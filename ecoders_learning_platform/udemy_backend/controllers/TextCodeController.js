// controllers/TextCodeController.js
const TextCodeModel = require("../models/TextCodeModel");

exports.getModelInfo = async (req, res) => {
  try {
    const data = await TextCodeModel.getModelInfo();
    return res.status(200).json(data);
  } catch (err) {
    console.error(
      "[TextCodeController.getModelInfo] error:",
      err?.message || err,
    );
    return res.status(500).json({
      ok: false,
      message: err?.message || "Failed to fetch model-info",
    });
  }
};

exports.reloadModel = async (req, res) => {
  try {
    const data = await TextCodeModel.reload();
    return res.status(200).json(data);
  } catch (err) {
    console.error(
      "[TextCodeController.reloadModel] error:",
      err?.message || err,
    );
    return res.status(500).json({
      ok: false,
      message: err?.message || "Failed to reload text-code model",
    });
  }
};

exports.generate = async (req, res) => {
  try {
    const { task, use_retrieval, max_new_tokens } = req.body || {};
    if (!task || typeof task !== "string" || !task.trim()) {
      return res.status(400).json({ ok: false, message: "task is required" });
    }

    const data = await TextCodeModel.generate({
      task: task.trim(),
      use_retrieval,
      max_new_tokens,
    });

    // normalize output so your React can always do: data.code
    const code = data?.code ?? data?.data?.code ?? "// No code returned";

    return res.status(200).json({
      ok: true,
      code,
      raw: data, // helpful for debugging (remove later if you want)
    });
  } catch (err) {
    console.error("[TextCodeController.generate] error:", err?.message || err);
    return res.status(500).json({
      ok: false,
      message: err?.message || "Text-to-code generation failed",
    });
  }
};
