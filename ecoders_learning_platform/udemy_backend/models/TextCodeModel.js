// models/TextCodeModel.js
const axios = require("axios");

const BASE = (process.env.TEXT_CODE_FLASK_BASE || "").replace(/\/+$/, ""); // trim trailing /
const TIMEOUT_S = Number(process.env.CODE_REQUEST_TIMEOUT_S || 120); // optional
const TIMEOUT_MS = Math.max(5, TIMEOUT_S) * 1000;

function assertBase() {
  if (!BASE) {
    throw new Error(
      "TEXT_CODE_FLASK_BASE is missing. Ensure your .env file is named correctly and Node was restarted.",
    );
  }
}

async function getModelInfo() {
  assertBase();
  const url = `${BASE}/model-info`;
  const r = await axios.get(url, { timeout: 10000 });
  return r.data;
}

async function reload() {
  assertBase();
  const url = `${BASE}/reload`;
  const r = await axios.post(url, {}, { timeout: 60000 });
  return r.data;
}

async function generate({ task, use_retrieval, max_new_tokens }) {
  assertBase();
  const url = `${BASE}/generate`;

  // Flask accepts task/prompt/etc, but we’ll send task (your frontend uses task)
  const payload = {
    task: String(task || ""),
    use_retrieval: Boolean(use_retrieval),
    max_new_tokens: Number(max_new_tokens || 512),
  };

  const r = await axios.post(url, payload, { timeout: TIMEOUT_MS });
  return r.data;
}

module.exports = {
  getModelInfo,
  reload,
  generate,
};
