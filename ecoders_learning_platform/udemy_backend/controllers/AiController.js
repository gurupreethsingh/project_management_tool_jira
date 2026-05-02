const axios = require("axios");

const FLASK_AI_BASE = process.env.FLASK_AI_BASE || "http://127.0.0.1:5055";

exports.askAi = async (req, res) => {
  try {
    const user = req.user || req.authUser || {};

    const payload = {
      question: req.body.question || req.body.message || "",
      message: req.body.message || req.body.question || "",
      user_id: user._id || req.body.user_id || "anonymous",
      user_name: user.name || user.fullName || req.body.user_name || "",
      email: user.email || req.body.email || "",
      role: user.role || req.body.role || "user",
      session_id: req.body.session_id,
      emotion: req.body.emotion || "",
      use_rag: req.body.use_rag !== false,
      use_memory: req.body.use_memory !== false,
      use_retrieval: req.body.use_retrieval !== false,
      speak_answer: false,
      speak_emotion: false,
    };

    const response = await axios.post(`${FLASK_AI_BASE}/v1/answer`, payload, {
      timeout: 120000,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("AI ask error:", error?.response?.data || error.message);

    return res.status(error?.response?.status || 500).json({
      ok: false,
      error:
        error?.response?.data?.error || error.message || "AI service failed",
    });
  }
};

exports.preloadKnowledge = async (req, res) => {
  try {
    const response = await axios.post(
      `${FLASK_AI_BASE}/v1/preload-knowledge`,
      {
        role: req.body.role || "superadmin",
        admin_key: req.body.admin_key || "",
        reset: req.body.reset || false,
      },
      { timeout: 120000 },
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("AI preload error:", error?.response?.data || error.message);

    return res.status(error?.response?.status || 500).json({
      ok: false,
      error:
        error?.response?.data?.error || error.message || "AI preload failed",
    });
  }
};

exports.modelInfo = async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_AI_BASE}/v1/model-info`, {
      timeout: 30000,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error?.response?.status || 500).json({
      ok: false,
      error: error?.response?.data?.error || error.message,
    });
  }
};
