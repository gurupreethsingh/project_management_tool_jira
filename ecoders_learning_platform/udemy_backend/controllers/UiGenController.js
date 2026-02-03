// controllers/UiGenController.js
const axios = require("axios");
const { UiGenInteraction } = require("../models/UiGenInteractionModel");

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
  // UI_FLASK_BASE like http://127.0.0.1:5066 (no /ui/v1)
  const raw =
    process.env.UI_FLASK_BASE ||
    process.env.UI_GEN_API_URL ||
    "http://127.0.0.1:5066";
  return String(raw).replace(/\/+$/, "");
}

function requireBaseUrl() {
  const b = baseUrl();
  if (!b) {
    const e = new Error(
      "UI_FLASK_BASE is missing in .env (example: http://127.0.0.1:5066)",
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
  const s = num(process.env.UI_REQUEST_TIMEOUT_S, 180);
  return clamp(s, 10, 900) * 1000;
}

function looksLikeHtmlOrJsx(s) {
  if (!s || typeof s !== "string") return false;
  const t = s.trim().toLowerCase();
  if (t.length < 12) return false;
  if (t.includes("<!doctype html") || t.includes("<html")) return true;
  if (t.includes("<head") && t.includes("<body")) return true;
  if (
    /<(div|section|header|footer|main|form|nav|table|button|input|h1|h2)\b/i.test(
      t,
    )
  )
    return true;
  if (/\bexport\s+default\s+function\b/i.test(s)) return true;
  return false;
}

/**
 * Accept BOTH prompt and task from frontend
 * Send BOTH prompt and task to Flask
 */
function buildFlaskPayload(reqBody) {
  const prompt = String(reqBody?.prompt || reqBody?.task || "").trim();

  const maxGenDefault = num(process.env.UI_GEN_MAX, 1100);
  const useRetrievalDefault =
    String(process.env.UI_USE_RETRIEVAL_DEFAULT || "1").trim() !== "0";

  const max_new_tokens = clampNum(
    reqBody?.max_new_tokens,
    64,
    2400,
    maxGenDefault,
  );

  const use_retrieval =
    typeof reqBody?.use_retrieval === "boolean"
      ? reqBody.use_retrieval
      : useRetrievalDefault;

  return { prompt, task: prompt, max_new_tokens, use_retrieval };
}

function readCode(data) {
  return safeString(data?.completion || data?.code || "");
}

// ---------------------
// Controllers
// ---------------------

async function generateUi(req, res) {
  const started = Date.now();
  const b = requireBaseUrl();

  const prompt = String(req.body?.prompt || req.body?.task || "").trim();
  if (!prompt) {
    return res.status(400).json({
      ok: false,
      error: "prompt is required",
      errorText: "prompt is required",
    });
  }

  const payload = buildFlaskPayload(req.body);
  const timeoutMs = buildClientTimeoutMs();

  const urlsToTry = [`${b}/generate`, `${b}/ui/v1/generate`];

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
      if (resp.status === 404) continue;

      const data = resp?.data || {};
      const ok =
        resp.status >= 200 &&
        resp.status < 300 &&
        (data.ok === true || data.ok == null);

      const code = readCode(data);
      const htmlOk = looksLikeHtmlOrJsx(code);

      // ✅ Flask meta fields (we forward these)
      const used_template_fallback = Boolean(
        data.used_template_fallback ?? data.used_fallback ?? false,
      );
      const output_mode = data.output_mode || null;
      const fallback_kind = data.fallback_kind || null;
      const sanitize_reason = data.sanitize_reason || null;

      const adapter = data.adapter || null;
      const adapter_path = data.adapter_path || null;
      const resolved_base_model = data.resolved_base_model || null;
      const adapter_base_model_from_adapter_config =
        data.adapter_base_model_from_adapter_config || null;

      // Save to Mongo (best-effort)
      let savedDoc = null;
      try {
        savedDoc = await UiGenInteraction.create({
          user: authUserId(req),
          isAuthenticated: !!req.user,
          request: {
            prompt,
            max_new_tokens: payload.max_new_tokens,
            use_retrieval: payload.use_retrieval,
          },
          response: {
            code,
            contentType: htmlOk ? "html" : "text",
            status: ok && htmlOk ? "ok" : ok ? "low_confidence" : "error",
            source: safeString(data.source || "model"),
            confidence:
              typeof data.confidence === "number" ? data.confidence : null,
            copyRatio:
              typeof data.copy_ratio === "number" ? data.copy_ratio : null,
            latencyMs: Date.now() - started,
            suggestions: data.suggestions || undefined,
          },
          askedAt: new Date(started),
          respondedAt: new Date(),
          responseTimeMs: Date.now() - started,
          meta: {
            sessionId: sessionId(req) || null,
            channel: channel(req),
            userAgent: req.headers["user-agent"] || null,
            output_mode,
            used_template_fallback,
            fallback_kind,
            sanitize_reason,
            adapter,
            adapter_path,
            resolved_base_model,
          },
          modelInfo: data.modelInfo || data.active || data.info || {},
        });
      } catch {}

      if (!ok) {
        return res.status(502).json({
          ok: false,
          status: resp.status,
          error: safeString(
            data.error || data.errorText || "Generation failed",
          ),
          errorText: safeString(
            data.errorText || data.error || "Generation failed",
          ),
          completion: code,
          // forward debug
          output_mode,
          used_template_fallback,
          fallback_kind,
          sanitize_reason,
          adapter,
          adapter_path,
          resolved_base_model,
        });
      }

      // ✅ Return fields your UiGenAssistantShell can use
      return res.json({
        ok: true,
        completion: code,
        savedId: savedDoc?._id || null,
        latencyMs: Date.now() - started,

        // ✅ IMPORTANT: React shell reads these
        errorText: data.errorText || data.error || "",
        used_fallback: used_template_fallback, // alias for your UI
        used_template_fallback,
        output_mode,
        fallback_kind,
        sanitize_reason,

        // model details
        adapter,
        adapter_path,
        resolved_base_model,
        adapter_base_model_from_adapter_config,

        // keep for compatibility
        modelInfo: data.modelInfo || data.active || data.info || {},
        source: data.source,
        confidence: data.confidence,
        copy_ratio: data.copy_ratio,
        suggestions: data.suggestions,

        // extra debug (optional)
        debug: {
          flask_http: resp.status,
          flask_url: url,
        },
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
      "UI generator unavailable",
  );

  try {
    await UiGenInteraction.create({
      user: authUserId(req),
      isAuthenticated: !!req.user,
      request: payload,
      response: {
        code: "",
        contentType: "text",
        status: "error",
        source: "api",
        confidence: 0,
        errorMessage: msg,
        latencyMs: Date.now() - started,
      },
      askedAt: new Date(started),
      respondedAt: new Date(),
      responseTimeMs: Date.now() - started,
      meta: {
        sessionId: sessionId(req) || null,
        channel: channel(req),
        userAgent: req.headers["user-agent"] || null,
      },
      modelInfo: {},
    });
  } catch {}

  return res.status(503).json({ ok: false, error: msg, errorText: msg });
}

async function getModelInfo(req, res) {
  const b = requireBaseUrl();
  const timeoutMs = Math.min(buildClientTimeoutMs(), 20000);

  const urlsToTry = [`${b}/model-info`, `${b}/ui/v1/model-info`];
  let lastErr = null;

  for (const url of urlsToTry) {
    try {
      const resp = await axios.get(url, {
        timeout: timeoutMs,
        headers: { "X-Session-Id": sessionId(req), "X-Channel": channel(req) },
        validateStatus: () => true,
      });

      if (resp.status === 404) continue;

      const data = resp?.data || {};
      const ok =
        resp.status >= 200 &&
        resp.status < 300 &&
        (data.ok === true || data.ok == null);

      if (!ok) {
        return res.status(502).json({
          ok: false,
          status: resp.status,
          error: safeString(
            data.errorText || data.error || "model-info failed",
          ),
          errorText: safeString(
            data.errorText || data.error || "model-info failed",
          ),
        });
      }

      return res.json(data);
    } catch (e) {
      lastErr = e;
      continue;
    }
  }

  const msg = safeString(lastErr?.message || "model-info unavailable");
  return res.status(503).json({ ok: false, error: msg, errorText: msg });
}

async function reloadModel(req, res) {
  const b = requireBaseUrl();
  const timeoutMs = Math.max(60000, buildClientTimeoutMs());

  const urlsToTry = [`${b}/reload`, `${b}/ui/v1/reload`];
  let lastErr = null;

  for (const url of urlsToTry) {
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
        },
      );

      if (resp.status === 404) continue;

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
          errorText: safeString(
            data.errorText || data.error || "reload failed",
          ),
        });
      }

      return res.json(data);
    } catch (e) {
      lastErr = e;
      continue;
    }
  }

  const msg = safeString(lastErr?.message || "reload unavailable");
  return res.status(503).json({ ok: false, error: msg, errorText: msg });
}

module.exports = { generateUi, getModelInfo, reloadModel };
