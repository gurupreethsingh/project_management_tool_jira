// controllers/DashboardGenController.js
const axios = require("axios");
const DashboardGen = require("../models/DashboardGenModel");

// Helpers
function safeString(x) {
  if (typeof x === "string") return x;
  if (x == null) return "";
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}

function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function buildClientTimeoutMs() {
  const s = num(process.env.DASH_REQUEST_TIMEOUT_S, 900);
  return Math.max(10, s) * 1000;
}

function baseUrl() {
  return String(process.env.DASH_FLASK_BASE || "").replace(/\/+$/, "");
}

function requireBaseUrl() {
  const b = baseUrl();
  if (!b) {
    const e = new Error(
      "DASH_FLASK_BASE is missing in .env (example: http://127.0.0.1:5077)"
    );
    e.statusCode = 500;
    throw e;
  }
  return b;
}

function authUserId(req) {
  return req.user?._id || null;
}

function sessionId(req) {
  return String(req.headers["x-session-id"] || "");
}

function channel(req) {
  return String(req.headers["x-channel"] || "api");
}

/**
 * POST /api/dashboard-gen/generate
 * Body: { prompt, max_new_tokens, max_time_s }
 */
async function generateDashboard(req, res) {
  const started = Date.now();
  const b = requireBaseUrl();

  const prompt = String(req.body?.prompt || "").trim();
  if (!prompt) {
    return res.status(400).json({
      ok: false,
      error: "prompt is required",
      errorText: "prompt is required",
    });
  }

  const maxGenDefault = num(process.env.DASH_GEN_MAX, 1400);
  const maxTimeDefault = num(process.env.DASH_MAX_TIME_S, 240);

  const payload = {
    prompt,
    max_new_tokens: num(req.body?.max_new_tokens, maxGenDefault),
    max_time_s: num(req.body?.max_time_s, maxTimeDefault),
  };

  const timeoutMs = buildClientTimeoutMs();
  const url = `${b}/generate`;

  let savedDoc = null;

  try {
    const resp = await axios.post(url, payload, {
      timeout: timeoutMs,
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": sessionId(req),
        "X-Channel": channel(req),
      },
      validateStatus: () => true,
    });

    const data = resp?.data || {};
    const ok =
      resp.status >= 200 &&
      resp.status < 300 &&
      (data.ok === true || data.ok == null);

    const completion = safeString(data.completion);

    // Save to Mongo (best-effort)
    try {
      savedDoc = await DashboardGen.create({
        user: authUserId(req),
        sessionId: sessionId(req),
        channel: channel(req),
        prompt,
        params: {
          max_new_tokens: payload.max_new_tokens,
          max_time_s: payload.max_time_s,
        },
        completion,
        ok,
        error: ok ? "" : safeString(data.error || data.errorText || "Failed"),
        modelInfo: data.modelInfo || data.info || {},
        latencyMs: Date.now() - started,
      });
    } catch {
      // ignore DB errors
    }

    if (!ok) {
      return res.status(502).json({
        ok: false,
        status: resp.status,
        error: safeString(data.error || data.errorText || "Generation failed"),
        errorText: safeString(
          data.errorText || data.error || "Generation failed"
        ),
        completion,
      });
    }

    return res.json({
      ok: true,
      completion,
      savedId: savedDoc?._id || null,
      latencyMs: Date.now() - started,
      modelInfo: data.modelInfo || {},
    });
  } catch (e) {
    const msg = safeString(
      e?.response?.data?.errorText ||
        e?.response?.data?.error ||
        e?.message ||
        "Dashboard generator unavailable"
    );

    // Save fail to Mongo (best-effort)
    try {
      await DashboardGen.create({
        user: authUserId(req),
        sessionId: sessionId(req),
        channel: channel(req),
        prompt,
        params: {
          max_new_tokens: payload.max_new_tokens,
          max_time_s: payload.max_time_s,
        },
        completion: "",
        ok: false,
        error: msg,
        modelInfo: {},
        latencyMs: Date.now() - started,
      });
    } catch {}

    return res.status(503).json({
      ok: false,
      error: msg,
      errorText: msg,
    });
  }
}

/**
 * GET /api/dashboard-gen/model-info
 */
async function getModelInfo(req, res) {
  const b = requireBaseUrl();
  const timeoutMs = Math.min(buildClientTimeoutMs(), 20000);
  const url = `${b}/model-info`;

  try {
    const resp = await axios.get(url, {
      timeout: timeoutMs,
      headers: {
        "X-Session-Id": sessionId(req),
        "X-Channel": channel(req),
      },
      validateStatus: () => true,
    });

    const data = resp?.data || {};
    const ok =
      resp.status >= 200 &&
      resp.status < 300 &&
      (data.ok === true || data.ok == null);

    if (!ok) {
      return res.status(502).json({
        ok: false,
        status: resp.status,
        error: safeString(data.errorText || data.error || "model-info failed"),
        errorText: safeString(
          data.errorText || data.error || "model-info failed"
        ),
      });
    }

    return res.json(data);
  } catch (e) {
    const msg = safeString(e?.message || "model-info unavailable");
    return res.status(503).json({ ok: false, error: msg, errorText: msg });
  }
}

/**
 * POST /api/dashboard-gen/reload
 */
async function reloadModel(req, res) {
  const b = requireBaseUrl();
  const timeoutMs = Math.max(60000, buildClientTimeoutMs());
  const url = `${b}/reload`;

  try {
    const resp = await axios.post(
      url,
      {},
      {
        timeout: timeoutMs,
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId(req),
          "X-Channel": channel(req),
        },
        validateStatus: () => true,
      }
    );

    const data = resp?.data || {};
    const ok =
      resp.status >= 200 &&
      resp.status < 300 &&
      (data.ok === true || data.ok == null);

    if (!ok) {
      return res.status(502).json({
        ok: false,
        status: resp.status,
        error: safeString(data.errorText || data.error || "reload failed"),
        errorText: safeString(data.errorText || data.error || "reload failed"),
      });
    }

    return res.json(data);
  } catch (e) {
    const msg = safeString(e?.message || "reload unavailable");
    return res.status(503).json({ ok: false, error: msg, errorText: msg });
  }
}

module.exports = {
  generateDashboard,
  getModelInfo,
  reloadModel,
};
