const axios = require("axios");
const {
  ExamGenInteraction,
  STATUS,
  CHANNEL,
} = require("../models/ExamGenInteractionModel");

const EXAM_FLASK_BASE =
  process.env.EXAM_FLASK_BASE || "http://127.0.0.1:5070/exam/v1";

function getClientIp(req) {
  const xfwd = req.headers["x-forwarded-for"];
  if (typeof xfwd === "string") return xfwd.split(",")[0].trim();
  return req.ip || req.connection?.remoteAddress || undefined;
}

/**
 * GET /api/exam-gen/model-info
 */
const modelInfo = async (req, res) => {
  try {
    const url = `${EXAM_FLASK_BASE}/model-info`;
    const r = await axios.get(url, { timeout: 15000 });
    return res.status(200).json(r.data);
  } catch (e) {
    return res.status(502).json({
      ok: false,
      error: "Failed to reach exam flask model-info",
      detail: e.message || String(e),
    });
  }
};

/**
 * POST /api/exam-gen/reload
 */
const reloadModel = async (req, res) => {
  try {
    const url = `${EXAM_FLASK_BASE}/reload`;
    const r = await axios.post(url, {}, { timeout: 60000 });
    return res.status(200).json(r.data);
  } catch (e) {
    return res.status(502).json({
      ok: false,
      error: "Failed to reload exam flask",
      detail: e.message || String(e),
    });
  }
};

/**
 * POST /api/exam-gen/generate
 */
const generateExamPaper = async (req, res) => {
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
      use_retrieval: !!use_retrieval,
    };

    if (max_new_tokens) requestPayload.max_new_tokens = max_new_tokens;

    if (meta?.force_adapter && typeof meta.force_adapter === "string") {
      const fa = meta.force_adapter.trim();
      if (fa) requestPayload.force_adapter = fa;
    }

    const flaskUrl = `${EXAM_FLASK_BASE}/generate`;
    const askedAt = new Date();

    let flaskResp;
    try {
      flaskResp = await axios.post(flaskUrl, requestPayload, {
        timeout: 120000,
      });
    } catch (err) {
      const latency = Date.now() - startedAt;

      const interactionError = new ExamGenInteraction({
        user: req.user?._id || null,
        isAuthenticated: !!req.user,
        request: { task: cleanTask, language, tags },
        response: {
          paper: "",
          contentType: "text",
          status: "error",
          source: "api",
          errorCode: "FLASK_REQUEST_FAILED",
          errorMessage: err.message || "Failed to reach exam generator API",
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
          ipHash: ExamGenInteraction.hashIp(getClientIp(req)),
        },
      });

      try {
        await interactionError.save();
      } catch (saveErr) {
        console.error("[ExamGen] failed to save error interaction:", saveErr);
      }

      return res.status(502).json({
        ok: false,
        error: "Exam generator backend unavailable",
        detail: err.message || String(err),
      });
    }

    const latency = Date.now() - startedAt;
    const data = flaskResp.data || {};

    const okFlag = !!data.ok;
    const paper = data.paper || "";
    const source = data.source || "api";

    let status = "ok";
    if (!okFlag) status = "error";
    if (!STATUS.includes(status)) status = "ok";

    const interactionDoc = new ExamGenInteraction({
      user: req.user?._id || null,
      isAuthenticated: !!req.user,

      request: { task: cleanTask, language, tags },

      response: {
        paper,
        contentType: "text",
        status,
        source,
        confidence: data.confidence ?? null,
        model: data.active?.type || undefined,
        modelVersion:
          data.active?.base_path || data.active?.full_path || undefined,
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
        ipHash: ExamGenInteraction.hashIp(getClientIp(req)),
      },
    });

    await interactionDoc.save();

    return res.status(200).json({
      ok: okFlag,
      paper,
      source,
      status,
      latencyMs: latency,
      id: interactionDoc._id,
      suggestions: data.suggestions || [],
      modelInfo: data.active || null,
      meta: data.meta || null, // includes adapter_used + used_fallback from Flask
    });
  } catch (err) {
    console.error("[ExamGen] unexpected controller error:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error in exam generator controller",
      detail: err.message || String(err),
    });
  }
};

module.exports = {
  generateExamPaper,
  modelInfo,
  reloadModel,
};
