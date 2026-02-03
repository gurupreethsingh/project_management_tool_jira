// controllers/CodeSummaryController.js
// Express controllers that call the CodeSummaryModel client.

const CodeSummaryModel = require("../models/CodeSummaryModel");

exports.getModelInfo = async (req, res) => {
  try {
    const data = await CodeSummaryModel.getModelInfo();
    return res.status(200).json(data);
  } catch (err) {
    console.error(
      "[CodeSummaryController.getModelInfo] error:",
      err?.message || err,
    );
    return res.status(500).json({
      ok: false,
      error: "Code Summary model-info failed",
      detail: err?.message || String(err),
    });
  }
};

exports.reloadModel = async (req, res) => {
  try {
    const data = await CodeSummaryModel.reload();
    return res.status(200).json(data);
  } catch (err) {
    console.error(
      "[CodeSummaryController.reloadModel] error:",
      err?.message || err,
    );
    return res.status(500).json({
      ok: false,
      error: "Code Summary reload failed",
      detail: err?.message || String(err),
    });
  }
};

exports.generate = async (req, res) => {
  try {
    // Pass through payload as-is; Flask accepts task/prompt/code/query/text etc.
    const payload = req.body || {};
    const data = await CodeSummaryModel.generate(payload);
    return res.status(200).json(data);
  } catch (err) {
    console.error(
      "[CodeSummaryController.generate] error:",
      err?.message || err,
    );
    return res.status(500).json({
      ok: false,
      error: "Code Summary generate failed",
      detail: err?.message || String(err),
    });
  }
};
