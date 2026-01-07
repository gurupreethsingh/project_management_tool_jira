const axios = require("axios");
const DashboardGen = require("../models/DashboardGenModel");

// ---------------------
// Helpers
// ---------------------
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

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function clampNum(v, lo, hi, fallback) {
  return clamp(num(v, fallback), lo, hi);
}

function baseUrl() {
  return String(process.env.DASH_FLASK_BASE || "").replace(/\/+$/, "");
}

function requireBaseUrl() {
  const b = baseUrl();
  if (!b) {
    const e = new Error(
      "DASH_FLASK_BASE is missing in .env (example: http://127.0.0.1:5072)"
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

function buildClientTimeoutMs() {
  const s = num(process.env.DASH_REQUEST_TIMEOUT_S, 180);
  return clamp(s, 10, 900) * 1000;
}

/**
 * ✅ Filter + clamp payload so frontend cannot blow up time.
 */
function buildFlaskPayload(reqBody) {
  const prompt = String(reqBody?.prompt || "").trim();

  const maxGenDefault = num(process.env.DASH_GEN_MAX, 700);
  const maxTimeDefault = num(process.env.DASH_MAX_TIME_S, 60);

  const prefer = String(reqBody?.prefer || "")
    .trim()
    .toLowerCase(); // tailwind/auto...

  return {
    prompt,
    prefer,
    max_new_tokens: clampNum(reqBody?.max_new_tokens, 64, 1100, maxGenDefault),
    max_time_s: clampNum(reqBody?.max_time_s, 5, 90, maxTimeDefault),
  };
}

/**
 * Safety: fix multiline className="a\nb\nc" -> className="a b c"
 */
function sanitizeMultilineClassName(code) {
  const s = safeString(code);

  const dq = s.replace(/className="([\s\S]*?)"/g, (_m, inner) => {
    const fixed = String(inner).replace(/\s+/g, " ").trim();
    return `className="${fixed}"`;
  });

  const sq = dq.replace(/className='([\s\S]*?)'/g, (_m, inner) => {
    const fixed = String(inner).replace(/\s+/g, " ").trim();
    return `className='${fixed}'`;
  });

  return sq;
}

/**
 * If Flask is retrieval (5072), it returns completion.
 * If older retrieval returns jsx, we still support it.
 */
function readCompletion(data) {
  return safeString(data?.completion || data?.jsx || "");
}

// ---------------------
// Controllers
// ---------------------

async function generateDashboard(req, res) {
  const started = Date.now();
  const b = requireBaseUrl();

  const prompt = String(req.body?.prompt || "").trim();
  if (!prompt) {
    return res
      .status(400)
      .json({
        ok: false,
        error: "prompt is required",
        errorText: "prompt is required",
      });
  }

  const payload = buildFlaskPayload(req.body);

  const timeoutMs = buildClientTimeoutMs();

  // ✅ Prefer /generate, but support /generate-dashboard too
  const urlsToTry = [`${b}/generate`, `${b}/generate-dashboard`];

  let lastResp = null;
  let lastErr = null;

  for (const url of urlsToTry) {
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

      lastResp = resp;

      // if endpoint not found, try next
      if (resp.status === 404) continue;

      const data = resp?.data || {};
      const ok =
        resp.status >= 200 &&
        resp.status < 300 &&
        (data.ok === true || data.ok == null);

      let completion = readCompletion(data);
      completion = sanitizeMultilineClassName(completion);

      // Save to Mongo (best-effort)
      let savedDoc = null;
      try {
        savedDoc = await DashboardGen.create({
          user: authUserId(req),
          sessionId: sessionId(req),
          channel: channel(req),
          prompt,
          params: {
            max_new_tokens: payload.max_new_tokens,
            max_time_s: payload.max_time_s,
            prefer: payload.prefer || "",
          },
          completion,
          ok,
          error: ok ? "" : safeString(data.error || data.errorText || "Failed"),
          modelInfo: data.modelInfo || data.info || data || {},
          latencyMs: Date.now() - started,
        });
      } catch {}

      if (!ok) {
        return res.status(502).json({
          ok: false,
          status: resp.status,
          error: safeString(
            data.error || data.errorText || "Generation failed"
          ),
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
        modelInfo: data.modelInfo || data.info || {},
        // helpful debug from retrieval API:
        used_fallback: data.used_fallback,
        similarity: data.similarity,
        reason: data.reason,
        matched_examples: data.matched_examples,
      });
    } catch (e) {
      lastErr = e;
      continue;
    }
  }

  const msg = safeString(
    lastResp?.data?.errorText ||
      lastResp?.data?.error ||
      lastErr?.message ||
      "Dashboard generator unavailable"
  );

  try {
    await DashboardGen.create({
      user: authUserId(req),
      sessionId: sessionId(req),
      channel: channel(req),
      prompt,
      params: {
        max_new_tokens: payload.max_new_tokens,
        max_time_s: payload.max_time_s,
        prefer: payload.prefer || "",
      },
      completion: "",
      ok: false,
      error: msg,
      modelInfo: {},
      latencyMs: Date.now() - started,
    });
  } catch {}

  return res.status(503).json({ ok: false, error: msg, errorText: msg });
}

async function getModelInfo(req, res) {
  const b = requireBaseUrl();
  const timeoutMs = Math.min(buildClientTimeoutMs(), 20000);

  const urlsToTry = [`${b}/model-info`];

  try {
    const resp = await axios.get(urlsToTry[0], {
      timeout: timeoutMs,
      headers: { "X-Session-Id": sessionId(req), "X-Channel": channel(req) },
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

async function reloadModel(req, res) {
  const b = requireBaseUrl();
  const url = `${b}/reload`;
  const timeoutMs = Math.max(60000, buildClientTimeoutMs());

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

module.exports = { generateDashboard, getModelInfo, reloadModel };
