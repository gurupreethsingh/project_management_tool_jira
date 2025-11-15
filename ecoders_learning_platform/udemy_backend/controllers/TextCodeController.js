// controllers/TextCodeController.js
// Express controllers that call the TextCodeModel client.

const TextCodeModel = require("../models/TextCodeModel");

exports.getModelInfo = async (req, res) => {
  try {
    const data = await TextCodeModel.getModelInfo();
    return res.status(200).json(data);
  } catch (err) {
    console.error(
      "[TextCodeController.getModelInfo] error:",
      err?.message || err
    );
    return res.status(500).json({
      ok: false,
      error: "Failed to fetch text-to-code model info",
      details: err?.message || String(err),
    });
  }
};

exports.reloadModel = async (req, res) => {
  try {
    const body = req.body || {};
    const data = await TextCodeModel.reloadModel(body);
    return res.status(data?.ok ? 200 : 400).json(data);
  } catch (err) {
    console.error(
      "[TextCodeController.reloadModel] error:",
      err?.message || err
    );
    return res.status(500).json({
      ok: false,
      error: "Failed to reload text-to-code model",
      details: err?.message || String(err),
    });
  }
};

exports.generate = async (req, res) => {
  try {
    const { task, use_retrieval, max_new_tokens } = req.body || {};

    if (!task || typeof task !== "string" || !task.trim()) {
      return res.status(400).json({
        ok: false,
        error: "task is required and must be a non-empty string",
      });
    }

    const payload = {
      task: task.trim(),
      // optional fields – only send if defined
      ...(use_retrieval !== undefined && { use_retrieval }),
      ...(max_new_tokens !== undefined && { max_new_tokens }),
    };

    const data = await TextCodeModel.generateCode(payload);

    // Flask always responds with { ok, code, source, ... } on success/fallback
    if (!data || data.ok === false) {
      return res.status(502).json({
        ok: false,
        error: "Text-to-code backend returned an error",
        backend: data,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("[TextCodeController.generate] error:", err?.message || err);
    return res.status(500).json({
      ok: false,
      error: "Failed to generate code from text",
      details: err?.message || String(err),
    });
  }
};
