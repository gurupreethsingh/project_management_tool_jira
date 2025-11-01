const router = require("express").Router();
const axios = require("axios");

const FLASK_URL = process.env.PES_FLASK_URL || "http://127.0.0.1:5055";
const client = axios.create({
  baseURL: FLASK_URL,
  timeout: 20000,
});

// POST /api/ai/ask  ->  Flask /v1/answer
router.post("/ai/ask", async (req, res) => {
  try {
    const { question, use_retrieval } = req.body || {};
    if (!question || !String(question).trim()) {
      return res.status(400).json({ ok: false, message: "empty question" });
    }

    const headers = {
      // passthroughs (useful for logging/analytics on Flask)
      "X-Session-Id": req.get("X-Session-Id") || "",
      "X-Channel": req.get("X-Channel") || "widget",
      Authorization: req.get("Authorization") || "",
    };

    // IMPORTANT: pass question & optional use_retrieval flag
    const r = await client.post(
      "/v1/answer",
      { question, use_retrieval },
      { headers }
    );

    // IMPORTANT: pass-through EVERYTHING Flask returns
    return res.status(r.status).json(r.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      ok: false,
      message: err.response?.data?.error || err.message || "error",
    });
  }
});

// Optional admin helpers
router.get("/ai/model-info", async (_req, res) => {
  try {
    const r = await client.get("/v1/model-info");
    return res.status(r.status).json(r.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      ok: false,
      error: err.response?.data?.error || err.message || "error",
    });
  }
});

router.post("/ai/reload", async (req, res) => {
  try {
    const r = await client.post("/v1/reload", req.body || {});
    return res.status(r.status).json(r.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      ok: false,
      error: err.response?.data?.error || err.message || "error",
    });
  }
});

module.exports = router;
