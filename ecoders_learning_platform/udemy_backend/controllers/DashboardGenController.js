// api/controllers/DashboardGenController.js

const axios = require("axios");
const {
  DashboardGenInteraction,
} = require("../models/DashboardGenInteractionModel");

// IMPORTANT:
// Must match dashboard_gen_api.py:
//   GET  /dash/v1/model-info
//   POST /dash/v1/reload
//   POST /dash/v1/generate
//
// Configurable via .env:
//   DASH_FLASK_BASE=http://127.0.0.1:5067/dash/v1
const FLASK_BASE =
  process.env.DASH_FLASK_BASE || "http://127.0.0.1:5067/dash/v1";

console.log("[DashboardGen] Using FLASK_BASE:", FLASK_BASE);

/* -------------------------------------------------------------------------- */
/*                               Helper: HTML/JSX                             */
/* -------------------------------------------------------------------------- */

function looksLikeHtmlOrJsx(s) {
  if (!s || typeof s !== "string") return false;
  const t = s.trim().toLowerCase();
  if (t.length < 12) return false;

  if (t.includes("<!doctype html") || t.includes("<html")) return true;
  if (t.includes("<head") && t.includes("<body")) return true;

  if (
    /<(div|section|header|footer|main|form|nav|table|button|input|h1|h2|aside|canvas|svg)\b/i.test(
      t
    )
  )
    return true;

  if (/\bexport\s+default\s+function\b/i.test(s)) return true;

  return false;
}

function getClientIp(req) {
  const xff = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return (
    xff ||
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    null
  );
}

/* -------------------------------------------------------------------------- */
/*                             Model Info / Reload                            */
/* -------------------------------------------------------------------------- */

exports.modelInfo = async (_req, res) => {
  try {
    const { data } = await axios.get(`${FLASK_BASE}/model-info`, {
      timeout: 10000,
    });
    return res.json(data);
  } catch (e) {
    console.error("[DashboardGen] /model-info upstream error:", {
      message: e.message,
      code: e.code,
      status: e.response?.status,
      data: e.response?.data,
    });
    return res.status(502).json({
      ok: false,
      error: e?.message || "dashboard_gen_api unreachable",
    });
  }
};

exports.reload = async (req, res) => {
  try {
    const body = req.body || {};
    const { data } = await axios.post(`${FLASK_BASE}/reload`, body, {
      timeout: 60000,
    });
    return res.json(data);
  } catch (e) {
    console.error("[DashboardGen] /reload upstream error:", {
      message: e.message,
      code: e.code,
      status: e.response?.status,
      data: e.response?.data,
    });
    return res.status(502).json({
      ok: false,
      error: e?.message || "dashboard_gen_api reload failed",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                   Ask API                                  */
/* -------------------------------------------------------------------------- */

exports.ask = async (req, res) => {
  const task = (req.body?.task || "").trim();

  const max_new_tokens = Number.isFinite(+req.body?.max_new_tokens)
    ? +req.body.max_new_tokens
    : 1024;

  const use_retrieval = req.body?.use_retrieval !== false; // default true

  if (!task) {
    return res.status(400).json({ ok: false, message: "empty task" });
  }

  const askedAt = Date.now();
  const authUser = req.user || null;
  const ip = getClientIp(req);
  const ipHash = DashboardGenInteraction.hashIp(ip);

  try {
    const { data } = await axios.post(
      `${FLASK_BASE}/generate`,
      { task, max_new_tokens, use_retrieval },
      { timeout: 120000 }
    );

    const code = data?.code ?? "";
    const source = data?.source ?? "model";
    const confidence =
      typeof data?.confidence === "number" ? data.confidence : null;

    const htmlOk = looksLikeHtmlOrJsx(code);
    const status = htmlOk || source === "fallback" ? "ok" : "low_confidence";

    const respondedAt = Date.now();
    const dt = Math.max(0, respondedAt - askedAt);

    await DashboardGenInteraction.create({
      user: authUser?._id || null,
      isAuthenticated: !!authUser,
      request: {
        task,
        language: "en",
        tags: ["dashboard", "generator"],
      },
      response: {
        code,
        contentType: htmlOk || source === "fallback" ? "html" : "text",
        status,
        source,
        confidence,
        copyRatio: data?.copy_ratio || null,
        model: data?.active && data.active.base_path ? "seq2seq" : undefined,
        modelVersion: data?.active?.type || undefined,
        latencyMs: dt,
        suggestions: data?.suggestions || undefined,
      },
      askedAt: new Date(askedAt),
      respondedAt: new Date(respondedAt),
      responseTimeMs: dt,
      meta: {
        sessionId: req.headers["x-session-id"] || null,
        channel: req.headers["x-channel"] || "widget",
        pageUrl: req.headers["referer"] || req.headers["origin"] || null,
        userAgent: req.headers["user-agent"] || null,
        ipHash,
      },
    });

    return res.json({
      ok: true,
      data: {
        id: String(Date.now()),
        code,
        status,
        confidence,
        source,
        latencyMs: dt,
        suggestions: data?.suggestions || undefined,
      },
    });
  } catch (e) {
    const respondedAt = Date.now();
    const dt = Math.max(0, respondedAt - askedAt);
    const ipErr = getClientIp(req);
    const ipHashErr = DashboardGenInteraction.hashIp(ipErr);

    console.error("[DashboardGen] /ask upstream error:", {
      message: e.message,
      code: e.code,
      status: e.response?.status,
      data: e.response?.data,
    });

    try {
      await DashboardGenInteraction.create({
        user: authUser?._id || null,
        isAuthenticated: !!authUser,
        request: {
          task,
          language: "en",
          tags: ["dashboard", "generator"],
        },
        response: {
          code: "",
          contentType: "text",
          status: "error",
          source: "api",
          confidence: 0,
          errorCode: "UPSTREAM_ERROR",
          errorMessage: e?.message || "dashboard generator error",
          latencyMs: dt,
        },
        askedAt: new Date(askedAt),
        respondedAt: new Date(respondedAt),
        responseTimeMs: dt,
        meta: {
          sessionId: req.headers["x-session-id"] || null,
          channel: req.headers["x-channel"] || "widget",
          pageUrl: req.headers["referer"] || req.headers["origin"] || null,
          userAgent: req.headers["user-agent"] || null,
          ipHash: ipHashErr,
        },
      });
    } catch (logErr) {
      console.error("DashboardGenInteraction log error:", logErr);
    }

    return res.status(502).json({
      ok: false,
      message:
        e?.message ||
        e?.response?.data?.error ||
        "Dashboard generator is unavailable.",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                          Optional Read / List APIs                         */
/* -------------------------------------------------------------------------- */

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await DashboardGenInteraction.findById(id).lean();
    if (!doc) {
      return res.status(404).json({ ok: false, message: "not found" });
    }
    return res.json({ ok: true, data: doc });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message });
  }
};

exports.list = async (_req, res) => {
  try {
    const rows = await DashboardGenInteraction.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.json({ ok: true, data: rows });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message });
  }
};
