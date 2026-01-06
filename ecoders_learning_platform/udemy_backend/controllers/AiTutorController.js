const axios = require("axios");
const {
  AiTutorInteraction,
  STATUS,
  CHANNEL,
} = require("../models/AiTutorInteractionModel");

const AITUTOR_FLASK_BASE = (
  process.env.AITUTOR_FLASK_BASE || "http://127.0.0.1:5081"
).replace(/\/+$/, "");

function getClientIp(req) {
  const xfwd = req.headers["x-forwarded-for"];
  if (typeof xfwd === "string") return xfwd.split(",")[0].trim();
  return req.ip || req.connection?.remoteAddress || undefined;
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function nint(v, fb) {
  const x = Number(v);
  return Number.isFinite(x) ? Math.trunc(x) : fb;
}

function nfloat(v, fb) {
  const x = Number(v);
  return Number.isFinite(x) ? x : fb;
}

const generateTutorAnswer = async (req, res) => {
  const startedAt = Date.now();

  try {
    const {
      task,
      language = "en",
      tags = [],
      channel = "widget",
      meta = {},
      use_retrieval = true, // compatibility only
      max_new_tokens,
      temperature,
    } = req.body || {};

    if (!task || typeof task !== "string" || !task.trim()) {
      return res.status(400).json({ ok: false, error: "Task is required" });
    }

    const cleanTask = task.trim();

    const reqMax = max_new_tokens ?? process.env.AITUTOR_MAX_NEW_TOKENS ?? 650;
    const reqTemp = temperature ?? process.env.AITUTOR_TEMPERATURE ?? 0.3;

    const requestPayload = {
      task: cleanTask,
      use_retrieval: !!use_retrieval, // Flask ignores (safe)
      max_new_tokens: clamp(nint(reqMax, 650), 200, 1200),
      temperature: clamp(nfloat(reqTemp, 0.3), 0, 1),
      do_sample: false,
      num_beams: 3,
    };

    const flaskUrl = `${AITUTOR_FLASK_BASE}/generate`;
    const askedAt = new Date();

    let flaskResp;
    try {
      flaskResp = await axios.post(flaskUrl, requestPayload, {
        timeout: 1000 * Number(process.env.AITUTOR_REQUEST_TIMEOUT_S || 120),
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": meta.sessionId || req.headers["x-session-id"] || "",
          "X-Channel": channel,
        },
        validateStatus: () => true,
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
      } catch {}

      return res.status(502).json({
        ok: false,
        error: "AI tutor backend unavailable",
        detail: err.message || String(err),
      });
    }

    const latency = Date.now() - startedAt;
    const data = flaskResp.data || {};

    const okFlag =
      flaskResp.status >= 200 && flaskResp.status < 300 && !!data.ok;
    const answer = data.answer || "";
    const source = data.source || "model";
    const modelInfo = data.active || null;

    let status = okFlag ? "ok" : "error";
    if (!STATUS.includes(status)) status = "ok";

    const interactionDoc = new AiTutorInteraction({
      user: req.user?._id || null,
      isAuthenticated: !!req.user,
      request: { task: cleanTask, language, tags },
      response: {
        answer,
        contentType: "text",
        status,
        source,
        confidence: null,
        copyRatio: null,
        model: modelInfo?.type || "adapter",
        modelVersion: modelInfo?.base_model || undefined,
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

    try {
      await interactionDoc.save();
    } catch {}

    return res.status(okFlag ? 200 : 502).json({
      ok: okFlag,
      answer,
      source,
      status,
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
