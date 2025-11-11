// controllers/UiGenController.js
const axios = require("axios");
const { UiGenInteraction } = require("../models/UiGenInteractionModel");

const FLASK_BASE = process.env.UI_FLASK_BASE || "http://127.0.0.1:5066/ui/v1";

function looksLikeHtmlOrJsx(s) {
  if (!s || typeof s !== "string") return false;
  const t = s.trim().toLowerCase();
  if (t.length < 12) return false;
  if (t.includes("<!doctype html") || t.includes("<html")) return true;
  if (t.includes("<head") && t.includes("<body")) return true;
  if (
    /<(div|section|header|footer|main|form|nav|table|button|input|h1|h2)\b/i.test(
      t
    )
  )
    return true;
  if (/\bexport\s+default\s+function\b/i.test(s)) return true; // JSX snippets also allowed
  return false;
}

exports.modelInfo = async (req, res) => {
  try {
    const { data } = await axios.get(`${FLASK_BASE}/model-info`, {
      timeout: 10000,
    });
    res.json(data);
  } catch (e) {
    res
      .status(502)
      .json({ ok: false, error: e.message || "flask unreachable" });
  }
};

exports.reload = async (req, res) => {
  try {
    const body = req.body || {};
    const { data } = await axios.post(`${FLASK_BASE}/reload`, body, {
      timeout: 60000,
    });
    res.json(data);
  } catch (e) {
    res.status(502).json({ ok: false, error: e.message || "reload failed" });
  }
};

exports.ask = async (req, res) => {
  const task = (req.body?.task || "").trim();
  const max_new_tokens = Number.isFinite(+req.body?.max_new_tokens)
    ? +req.body.max_new_tokens
    : 1024; // increased default
  const use_retrieval = req.body?.use_retrieval !== false; // default true
  if (!task) return res.status(400).json({ ok: false, message: "empty task" });

  const askedAt = Date.now();
  const authUser = req.user || null;

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

    await UiGenInteraction.create({
      user: authUser?._id || null,
      isAuthenticated: !!authUser,
      request: { task, language: "en", tags: ["ui", "generator"] },
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
      },
    });

    // Return as the widget expects:
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
    await UiGenInteraction.create({
      user: authUser?._id || null,
      isAuthenticated: !!authUser,
      request: { task, language: "en", tags: ["ui", "generator"] },
      response: {
        code: "",
        contentType: "text",
        status: "error",
        source: "api",
        confidence: 0,
        errorCode: "UPSTREAM_ERROR",
        errorMessage: e?.message || "ui generator error",
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
      },
    });
    return res
      .status(502)
      .json({ ok: false, message: "UI generator is unavailable." });
  }
};

// Optional extra endpoints if you want to fetch saved interactions
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await UiGenInteraction.findById(id).lean();
    if (!doc) return res.status(404).json({ ok: false, message: "not found" });
    res.json({ ok: true, data: doc });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

exports.list = async (req, res) => {
  try {
    const q = UiGenInteraction.find({}).sort({ createdAt: -1 }).limit(50);
    const rows = await q.lean();
    res.json({ ok: true, data: rows });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};
