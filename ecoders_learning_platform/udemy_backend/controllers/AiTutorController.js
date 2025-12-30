// api/controllers/AiTutorController.js

const axios = require("axios");
const {
  AiTutorInteraction,
  STATUS,
  CHANNEL,
} = require("../models/AiTutorInteractionModel");

// Flask base for AI Tutor
// Example: AITUTOR_FLASK_BASE=http://127.0.0.1:5071/aitutor/v1
const AITUTOR_FLASK_BASE =
  process.env.AITUTOR_FLASK_BASE || "http://127.0.0.1:5071/aitutor/v1";

function getClientIp(req) {
  const xfwd = req.headers["x-forwarded-for"];
  if (typeof xfwd === "string") return xfwd.split(",")[0].trim();
  return req.ip || req.connection?.remoteAddress || undefined;
}

/**
 * POST /api/ai-tutor/generate
 * Body: { task, max_new_tokens?, use_retrieval?, meta?, channel?, tags?, language? }
 *
 * NOTE:
 * - Your Flask AI Tutor is single-adapter. Do NOT pass adapter here.
 * - use_retrieval exists in payload for compatibility; Flask ignores it.
 */
const generateTutorAnswer = async (req, res) => {
  const startedAt = Date.now();

  try {
    const {
      task,
      language = "en",
      tags = [],
      channel = "widget",
      meta = {},
      use_retrieval = true,
      max_new_tokens,
    } = req.body || {};

    if (!task || typeof task !== "string" || !task.trim()) {
      return res.status(400).json({ ok: false, error: "Task is required" });
    }

    const cleanTask = task.trim();

    const requestPayload = {
      task: cleanTask,
      // kept for forward compatibility; Flask currently ignores it
      use_retrieval: !!use_retrieval,
    };
    if (max_new_tokens) requestPayload.max_new_tokens = max_new_tokens;

    const flaskUrl = `${AITUTOR_FLASK_BASE}/generate`;
    const askedAt = new Date();

    let flaskResp;
    try {
      flaskResp = await axios.post(flaskUrl, requestPayload, {
        timeout: 1000 * 120, // 120s
      });
    } catch (err) {
      const latency = Date.now() - startedAt;

      const interactionError = new AiTutorInteraction({
        user: req.user?._id || null,
        isAuthenticated: !!req.user,
        request: { task: cleanTask, language, tags },
        response: {
          answer: "",
          contentType: "text",
          status: "error",
          source: "api",
          errorCode: "FLASK_REQUEST_FAILED",
          errorMessage: err.message || "Failed to reach AI tutor Flask API",
          latencyMs: latency,
        },
        askedAt,
        respondedAt: new Date(),
        responseTimeMs: latency,
        meta: {
          sessionId: meta.sessionId || req.sessionID || undefined,
          channel:
            typeof channel === "string" && CHANNEL.includes(channel)
              ? channel
              : "widget",
          pageUrl: meta.pageUrl || req.headers.referer || undefined,
          userAgent: meta.userAgent || req.headers["user-agent"] || undefined,
          ipHash: AiTutorInteraction.hashIp(getClientIp(req)),
        },
      });

      try {
        await interactionError.save();
      } catch (saveErr) {
        console.error("[AiTutor] failed to save error interaction:", saveErr);
      }

      return res.status(502).json({
        ok: false,
        error: "AI tutor backend unavailable",
        detail: err.message || String(err),
      });
    }

    const latency = Date.now() - startedAt;
    const data = flaskResp.data || {};

    const okFlag = !!data.ok;
    const answer = data.answer || "";
    const source = data.source || "model";

    const copyRatio =
      typeof data.copy_ratio === "number" ? data.copy_ratio : null;

    // status mapping
    let status = "ok";
    if (!okFlag) status = "error";
    if (!STATUS.includes(status)) status = "ok";

    const modelInfo = data.active || null;

    const interactionDoc = new AiTutorInteraction({
      user: req.user?._id || null,
      isAuthenticated: !!req.user,
      request: { task: cleanTask, language, tags },
      response: {
        answer,
        contentType: "text",
        status,
        source,
        confidence: null, // single-adapter tutor doesn't emit confidence
        copyRatio,
        model: modelInfo?.type || "single_adapter",
        modelVersion: modelInfo?.base_path || undefined,
        chosenAdapter: modelInfo?.adapter_name || undefined,
        errorCode: data.errorCode || undefined,
        errorMessage: data.error || undefined,
        latencyMs: latency,
      },
      askedAt,
      respondedAt: new Date(),
      responseTimeMs: latency,
      meta: {
        sessionId: meta.sessionId || req.sessionID || undefined,
        channel:
          typeof channel === "string" && CHANNEL.includes(channel)
            ? channel
            : "widget",
        pageUrl: meta.pageUrl || req.headers.referer || undefined,
        userAgent: meta.userAgent || req.headers["user-agent"] || undefined,
        ipHash: AiTutorInteraction.hashIp(getClientIp(req)),
      },
    });

    await interactionDoc.save();

    return res.status(200).json({
      ok: okFlag,
      answer,
      source,
      status,
      copyRatio,
      latencyMs: latency,
      id: interactionDoc._id,
      modelInfo,
    });
  } catch (err) {
    console.error("[AiTutor] unexpected controller error:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error in AI tutor controller",
      detail: err.message || String(err),
    });
  }
};

/**
 * GET /api/ai-tutor/model-info
 * Proxies Flask /aitutor/v1/model-info
 */
const getAiTutorModelInfo = async (_req, res) => {
  try {
    const url = `${AITUTOR_FLASK_BASE}/model-info`;
    const r = await axios.get(url, { timeout: 20000 });
    return res.status(200).json(r.data || { ok: false });
  } catch (err) {
    return res.status(502).json({
      ok: false,
      error: "AI tutor model-info unavailable",
      detail: err.message || String(err),
    });
  }
};

/**
 * POST /api/ai-tutor/reload
 * Proxies Flask /aitutor/v1/reload
 */
const reloadAiTutor = async (_req, res) => {
  try {
    const url = `${AITUTOR_FLASK_BASE}/reload`;
    const r = await axios.post(url, {}, { timeout: 60000 });
    return res.status(200).json(r.data || { ok: true });
  } catch (err) {
    return res.status(502).json({
      ok: false,
      error: "AI tutor reload unavailable",
      detail: err.message || String(err),
    });
  }
};

module.exports = {
  generateTutorAnswer,
  getAiTutorModelInfo,
  reloadAiTutor,
};
