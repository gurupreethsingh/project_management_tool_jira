// file: controllers/AiTutorController.js
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

function nbool(v, fb) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const t = v.trim().toLowerCase();
    if (t === "1" || t === "true" || t === "yes") return true;
    if (t === "0" || t === "false" || t === "no") return false;
  }
  if (typeof v === "number") return v !== 0;
  return fb;
}

const DEFAULT_MAX_NEW_TOKENS = nint(process.env.AITUTOR_MAX_NEW_TOKENS, 320);
const DEFAULT_DO_SAMPLE = nbool(process.env.AITUTOR_DO_SAMPLE, false);
const DEFAULT_TEMPERATURE = nfloat(process.env.AITUTOR_TEMPERATURE, 0.2);
const DEFAULT_TIMEOUT_S = nint(process.env.AITUTOR_REQUEST_TIMEOUT_S, 180);

function isBlankishAnswer(ans) {
  const t = String(ans || "").trim();
  if (!t) return true;
  // if template exists but sections are empty
  const defEmpty = /DEFINITION:\s*\n\s*\n/.test(t);
  const explEmpty = /EXPLANATION:\s*\n\s*\n/.test(t);
  const codeEmpty = /EXAMPLE \(PYTHON CODE\):\s*\n\s*\n/.test(t);
  return defEmpty && explEmpty && codeEmpty;
}

async function callFlaskGenerate(payload) {
  const flaskUrl = `${AITUTOR_FLASK_BASE}/generate`;
  return axios.post(flaskUrl, payload, {
    timeout: 1000 * DEFAULT_TIMEOUT_S,
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
  });
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
      use_retrieval = true,
      max_new_tokens,
      temperature,
      do_sample,
    } = req.body || {};

    if (!task || typeof task !== "string" || !task.trim()) {
      return res.status(400).json({ ok: false, error: "Task is required" });
    }

    const cleanTask = task.trim();

    const reqMax = max_new_tokens ?? DEFAULT_MAX_NEW_TOKENS;
    const reqSample = do_sample ?? DEFAULT_DO_SAMPLE;
    const reqTemp = temperature ?? DEFAULT_TEMPERATURE;

    const requestPayload = {
      task: cleanTask,
      use_retrieval: !!use_retrieval,
      max_new_tokens: clamp(nint(reqMax, 320), 220, 420),
      do_sample: !!reqSample,
      ...(!!reqSample
        ? { temperature: clamp(nfloat(reqTemp, 0.2), 0.05, 1) }
        : {}),
    };

    const askedAt = new Date();

    let flaskResp;
    try {
      flaskResp = await callFlaskGenerate(requestPayload);
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

    let okFlag = flaskResp.status >= 200 && flaskResp.status < 300 && !!data.ok;

    let answer = data.answer || "";
    let modelInfo = data.active || null;

    // ✅ Controller-side retry (extra safety)
    if (okFlag && isBlankishAnswer(answer)) {
      const retryPayload = {
        ...requestPayload,
        task: cleanTask + " (Fill every section properly.)",
      };
      const retryResp = await callFlaskGenerate(retryPayload);
      const retryData = retryResp.data || {};
      if (retryResp.status >= 200 && retryResp.status < 300 && !!retryData.ok) {
        answer = retryData.answer || answer;
        modelInfo = retryData.active || modelInfo;
        okFlag = true;
      }
    }

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
        source: "model",
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
      source: "model",
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
    const r = await axios.post(
      url,
      {},
      { timeout: 60000, validateStatus: () => true },
    );

    if (r.status >= 200 && r.status < 300) {
      return res.status(200).json(r.data || { ok: true });
    }

    if (r.status === 404) {
      return res.status(200).json({
        ok: true,
        note: "Flask /reload endpoint not implemented; restart Flask to reload model.",
      });
    }

    return res.status(502).json({
      ok: false,
      error: "AI tutor reload failed",
      detail: r.data?.error || `Flask returned status ${r.status}`,
    });
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
