// models/CodeSummaryModel.js
// Node client that calls the FILE-ONLY Code Summary Flask API.

const axios = require("axios");

const BASE = (
  process.env.CODESUMMARY_FLASK_BASE || "http://127.0.0.1:5073"
).replace(/\/+$/, "");
const API_BASE = `${BASE}/code-summary/v1`;

const TIMEOUT_S = Number(process.env.CODESUMMARY_REQUEST_TIMEOUT_S || 120);
const TIMEOUT_MS = Math.max(1000, Math.floor(TIMEOUT_S * 1000));

async function getModelInfo() {
  const url = `${API_BASE}/model-info`;
  const r = await axios.get(url, { timeout: TIMEOUT_MS });
  return r.data;
}

async function reload() {
  const url = `${API_BASE}/reload`;
  const r = await axios.post(url, {}, { timeout: Math.max(TIMEOUT_MS, 60000) });
  return r.data;
}

async function generate(payload) {
  const url = `${API_BASE}/generate`;
  const r = await axios.post(url, payload || {}, {
    timeout: Math.max(TIMEOUT_MS, 120000),
  });
  return r.data;
}

module.exports = {
  getModelInfo,
  reload,
  generate,
};
