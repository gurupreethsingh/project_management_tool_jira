// controllers/RoadmapGenController.js
const axios = require("axios");
const {
  RoadmapGenInteraction,
} = require("../models/RoadmapGenInteractionModel");

const FLASK_BASE =
  process.env.ROADMAP_FLASK_BASE || "http://127.0.0.1:5068/roadmap/v1";

function looksLikeRoadmap(s) {
  if (!s || typeof s !== "string") return false;
  const t = s.trim();
  if (t.length < 24) return false;
  const low = t.toLowerCase();

  // Headings & syllabus-y words
  if (
    /\b(semester|module|week|unit|phase|syllabus|roadmap|curriculum|capstone|lab|revision|outcome)\b/i.test(
      t
    )
  )
    return true;

  // Markdown bullets or many sections
  if (/^\s*[-*•]\s+/m.test(t)) return true;
  if (/^##\s+\S+/m.test(t)) return true;

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
  // Accept multiple keys, like your Flask API does
  const topic = (req.body?.topic || "").trim();
  const subject = (req.body?.subject || "").trim();
  const task = (req.body?.task || "").trim();
  const query = (req.body?.query || "").trim();

  const payload = {};
  if (topic) payload.topic = topic;
  if (subject) payload.subject = subject;
  if (task) payload.task = task;
  if (query) payload.query = query;

  // default: use retrieval, allow override
  const use_retrieval = req.body?.use_retrieval !== false;
  payload.use_retrieval = use_retrieval;

  // generation length
  const max_new_tokens = Number.isFinite(+req.body?.max_new_tokens)
    ? +req.body.max_new_tokens
    : 1400;
  payload.max_new_tokens = max_new_tokens;

  // At least one field must be non-empty
  const textForValidation = topic || subject || task || query || "";
  if (!textForValidation)
    return res.status(400).json({ ok: false, message: "empty request" });

  const askedAt = Date.now();
  const authUser = req.user || null;

  try {
    const { data } = await axios.post(`${FLASK_BASE}/generate`, payload, {
      timeout: 120000,
    });

    const roadmap = data?.roadmap ?? "";
    const source = data?.source ?? "model";
    const confidence =
      typeof data?.confidence === "number" ? data.confidence : null;

    const mdOk = looksLikeRoadmap(roadmap);
    const status = mdOk || source === "fallback" ? "ok" : "low_confidence";

    const respondedAt = Date.now();
    const dt = Math.max(0, respondedAt - askedAt);

    // optional IP hash using model helper + your env ROADMAP_IP_SALT
    const ipRaw =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      null;
    const ipHash =
      typeof RoadmapGenInteraction.hashIp === "function"
        ? RoadmapGenInteraction.hashIp(ipRaw)
        : undefined;

    await RoadmapGenInteraction.create({
      user: authUser?._id || null,
      isAuthenticated: !!authUser,
      request: {
        topic: topic || undefined,
        subject: subject || undefined,
        task: task || undefined,
        query: query || undefined,
        useRetrieval: use_retrieval,
        maxNewTokens: max_new_tokens,
        language: "en",
        tags: ["roadmap", "generator"],
      },
      response: {
        roadmap,
        contentType: "markdown",
        status,
        source,
        confidence,
        copyRatio: data?.copy_ratio ?? null,
        model:
          data?.active?.base_path || data?.active?.full_path
            ? "seq2seq"
            : undefined,
        modelVersion: data?.active?.type || undefined,
        latencyMs: dt,
        // suggestions are not in schema, but we still return them to client below
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

    // Return minimal object for widgets/clients
    return res.json({
      ok: true,
      data: {
        id: String(Date.now()),
        roadmap,
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

    // optional IP hash even on error
    const ipRaw =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      null;
    const ipHash =
      typeof RoadmapGenInteraction.hashIp === "function"
        ? RoadmapGenInteraction.hashIp(ipRaw)
        : undefined;

    await RoadmapGenInteraction.create({
      user: authUser?._id || null,
      isAuthenticated: !!authUser,
      request: {
        topic: topic || undefined,
        subject: subject || undefined,
        task: task || undefined,
        query: query || undefined,
        useRetrieval: use_retrieval,
        maxNewTokens: max_new_tokens,
        language: "en",
        tags: ["roadmap", "generator"],
      },
      response: {
        roadmap: "",
        contentType: "text",
        status: "error",
        source: "api",
        confidence: 0,
        errorCode: "UPSTREAM_ERROR",
        errorMessage: e?.message || "roadmap generator error",
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
        ipHash,
      },
    });

    return res
      .status(502)
      .json({ ok: false, message: "Roadmap generator is unavailable." });
  }
};

// Optional: fetch one saved interaction
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await RoadmapGenInteraction.findById(id).lean();
    if (!doc) return res.status(404).json({ ok: false, message: "not found" });
    res.json({ ok: true, data: doc });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

// Optional: list recent interactions
exports.list = async (req, res) => {
  try {
    const q = RoadmapGenInteraction.find({}).sort({ createdAt: -1 }).limit(50);
    const rows = await q.lean();
    res.json({ ok: true, data: rows });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};
