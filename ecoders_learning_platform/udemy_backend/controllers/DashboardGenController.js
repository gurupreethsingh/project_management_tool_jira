const axios = require("axios");
const DashboardGenInteraction =
  require("../models/DashboardGenInteractionModel")?.DashboardGenInteraction ||
  require("../models/DashboardGenInteractionModel");

const FLASK_BASE =
  process.env.DASH_FLASK_BASE || "http://127.0.0.1:5067/dash/v1";

const GEN_URL = `${FLASK_BASE}/generate`;
const INFO_URL = `${FLASK_BASE}/model-info`;
const RELOAD_URL = `${FLASK_BASE}/reload`;
const LORA_DEBUG_URL = `${FLASK_BASE}/debug/lora`;

function sidFromReq(req) {
  return (
    req.headers["x-session-id"] ||
    req.headers["X-Session-Id"] ||
    req.headers["x-sessionid"] ||
    "no_sid"
  );
}

function pickPrompt(body) {
  return String(body?.prompt ?? body?.task ?? "").trim();
}

function pickNumber(x, def) {
  const n = Number(x);
  return Number.isFinite(n) ? n : def;
}

function safeString(x) {
  if (typeof x === "string") return x;
  if (x == null) return "";
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}

module.exports.modelInfo = async (_req, res) => {
  try {
    const r = await axios.get(INFO_URL, { timeout: 20000 });
    return res.json(r.data);
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: "model-info failed",
      errorText: safeString(e?.response?.data || e?.message || e),
      flask_base: FLASK_BASE,
    });
  }
};

module.exports.reloadModel = async (_req, res) => {
  try {
    const r = await axios.post(RELOAD_URL, {}, { timeout: 120000 });
    return res.json(r.data);
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: "reload failed",
      errorText: safeString(e?.response?.data || e?.message || e),
      flask_base: FLASK_BASE,
    });
  }
};

module.exports.loraDebug = async (_req, res) => {
  try {
    const r = await axios.get(LORA_DEBUG_URL, { timeout: 20000 });
    return res.json(r.data);
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: "lora debug failed",
      errorText: safeString(e?.response?.data || e?.message || e),
      flask_base: FLASK_BASE,
    });
  }
};

module.exports.generateDashboard = async (req, res) => {
  const sid = sidFromReq(req);
  const prompt = pickPrompt(req.body);

  if (!prompt) {
    return res.status(400).json({ ok: false, message: "prompt is required" });
  }

  // ✅ CPU-friendly defaults if caller doesn't set them
  const max_new_tokens = Math.max(
    256,
    Math.min(1200, pickNumber(req.body?.max_new_tokens, 600))
  );

  const num_beams = Math.max(
    1,
    Math.min(4, pickNumber(req.body?.num_beams, 1))
  );
  const do_sample = Boolean(req.body?.do_sample ?? false);

  const temperature = Math.max(
    0,
    Math.min(2, pickNumber(req.body?.temperature, 0.7))
  );
  const top_p = Math.max(0, Math.min(1, pickNumber(req.body?.top_p, 0.95)));

  const payload = {
    prompt,
    max_new_tokens,
    num_beams,
    do_sample,
    temperature,
    top_p,
  };

  try {
    const t0 = Date.now();

    // ✅ accept 2xx–4xx so 422 doesn't throw
    const r = await axios.post(GEN_URL, payload, {
      timeout: 360000, // 6 minutes
      validateStatus: (status) => status >= 200 && status < 500,
    });

    const ms = Date.now() - t0;
    const d = r?.data || {};

    const completion = safeString(
      d?.completion || d?.cleaned_completion || d?.raw_completion || ""
    );

    const errorText = safeString(d?.error || d?.message || d?.errorText || "");

    // store if we got something
    try {
      if (DashboardGenInteraction?.create && completion.trim()) {
        await DashboardGenInteraction.create({
          sessionId: sid,
          prompt,
          completion,
          meta: d.meta || {},
          createdAt: new Date(),
        });
      }
    } catch {}

    // ✅ normalize response to frontend (ALWAYS)
    if (d.ok === true) {
      return res.json({
        ok: true,
        completion,
        meta: { ...(d.meta || {}), latency_ms: ms, flask_status: r.status },
        debug: d.debug || {},
      });
    }

    // Flask ok:false (often 422 output_not_jsx) → still return 200 to frontend
    return res.json({
      ok: false,
      completion: completion || "⚠️ Model returned non-JSX output.",
      errorText: errorText || "Model output did not look like JSX.",
      meta: { ...(d.meta || {}), latency_ms: ms, flask_status: r.status },
      debug: d.debug || {},
      flask_response: d,
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      completion: "Dashboard generator unavailable. Please try again.",
      errorText: safeString(e?.response?.data || e?.message || e),
      flask_base: FLASK_BASE,
    });
  }
};

module.exports.history = async (req, res) => {
  const sid = sidFromReq(req);
  try {
    if (!DashboardGenInteraction?.find)
      return res.json({ ok: true, history: [] });

    const rows = await DashboardGenInteraction.find({ sessionId: sid })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.json({ ok: true, history: rows });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: "history failed",
      errorText: String(e?.message || e),
    });
  }
};

module.exports.clearSession = async (req, res) => {
  const sid = sidFromReq(req);
  try {
    if (DashboardGenInteraction?.deleteMany) {
      await DashboardGenInteraction.deleteMany({ sessionId: sid });
    }
    return res.json({ ok: true, cleared: true });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: "clear failed",
      errorText: String(e?.message || e),
    });
  }
};
