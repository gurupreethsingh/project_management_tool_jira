// models/TextCodeModel.js
const axios = require("axios");

const FLASK_BASE =
  process.env.TEXT_CODE_FLASK_BASE || "http://127.0.0.1:5071/code/v1";

function cleanUrl(u) {
  return String(u || "").replace(/\/+$/, "");
}

const BASE = cleanUrl(FLASK_BASE);

async function getModelInfo() {
  const url = `${BASE}/model-info`;
  const r = await axios.get(url, { timeout: 15000 });
  return r.data;
}

async function reloadModel(body = {}) {
  const url = `${BASE}/reload`;
  const r = await axios.post(url, body, { timeout: 60000 });
  return r.data;
}

async function generateCode(payload) {
  const url = `${BASE}/generate`;
  const r = await axios.post(url, payload, { timeout: 180000 });
  return r.data;
}

module.exports = {
  getModelInfo,
  reloadModel,
  generateCode,
};
