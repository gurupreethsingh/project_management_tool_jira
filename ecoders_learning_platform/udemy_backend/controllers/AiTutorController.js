// api/controllers/AiTutorController.js

const axios = require("axios");
const {
  AiTutorInteraction,
  STATUS,
  CHANNEL,
  CONTENT_TYPE,
} = require("../models/AiTutorInteractionModel");

// Where to call the Flask AI tutor generator
// Example: AITUTOR_FLASK_BASE=http://127.0.0.1:5071/aitutor/v1
const AITUTOR_FLASK_BASE =
  process.env.AITUTOR_FLASK_BASE || "http://127.0.0.1:5071/aitutor/v1";

// Small helper to get IP (same pattern you usually use)
function getClientIp(req) {
  const xfwd = req.headers["x-forwarded-for"];
  if (typeof xfwd === "string") {
    return xfwd.split(",")[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || undefined;
}

/**
 * POST /api/ai-tutor/generate
 * Body: { task, language?, tags?, channel?, meta?, use_retrieval?, max_new_tokens? }
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
      return res.status(400).json({
        ok: false,
        error: "Task is required",
      });
    }

    const cleanTask = task.trim();

    // -----------------------
    // Prepare request object
    // -----------------------
    const requestPayload = {
      task: cleanTask,
      use_retrieval: !!use_retrieval,
    };

    if (max_new_tokens) {
      requestPayload.max_new_tokens = max_new_tokens;
    }

    const flaskUrl = `${AITUTOR_FLASK_BASE}/generate`;

    const askedAt = new Date();

    // -----------------------
    // Call Flask AI Tutor API
    // -----------------------
    let flaskResp;
    try {
      flaskResp = await axios.post(flaskUrl, requestPayload, {
        timeout: 1000 * 60, // 60s safety timeout
      });
    } catch (err) {
      // If Flask is down or errors, we'll log and respond with error
      const latency = Date.now() - startedAt;

      const interactionError = new AiTutorInteraction({
        user: req.user?._id || null,
        isAuthenticated: !!req.user,
        request: {
          task: cleanTask,
          language,
          tags,
        },
        response: {
          answer: "",
          contentType: "text",
          status: "error",
          source: "api",
          errorCode: "FLASK_REQUEST_FAILED",
          errorMessage: err.message || "Failed to reach AI tutor API",
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
    const source = data.source || "api";
    const confidence =
      typeof data.confidence === "number" ? data.confidence : null;
    const copyRatio =
      typeof data.copy_ratio === "number"
        ? data.copy_ratio
        : data.copyRatio ?? null;

    // -----------------------
    // Map source/confidence → status
    // -----------------------
    let status = "ok";
    if (!okFlag) {
      status = "error";
    } else if (source === "retrieval") {
      status = "retrieval";
    } else if (typeof confidence === "number" && confidence < 0.4) {
      status = "low_confidence";
    }

    if (!STATUS.includes(status)) {
      status = "ok";
    }

    // -----------------------
    // Build interaction document
    // -----------------------
    const interactionDoc = new AiTutorInteraction({
      user: req.user?._id || null,
      isAuthenticated: !!req.user,

      request: {
        task: cleanTask,
        language,
        tags,
      },

      response: {
        answer,
        contentType: "text",
        status,
        source,
        confidence,
        copyRatio,
        model: data.active?.type || undefined,
        modelVersion:
          data.active?.base_path || data.active?.full_path || undefined,
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

    // -----------------------
    // Return to frontend
    // -----------------------
    return res.status(200).json({
      ok: okFlag,
      answer,
      source,
      status,
      confidence,
      copyRatio,
      latencyMs: latency,
      id: interactionDoc._id,
      suggestions: data.suggestions || [],
      modelInfo: data.active || null,
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

module.exports = {
  generateTutorAnswer,
};
