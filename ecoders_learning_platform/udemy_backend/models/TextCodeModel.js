// models/TextCodeModel.js
// Thin client to the Python text-to-code API (Flask service).

const axios = require("axios");

// Point this to your Flask text-to-code service
// Default: http://localhost:5068 (from CODE_PORT in app.py)
const TEXT_CODE_API_BASE =
  process.env.TEXT_CODE_API_BASE || "http://localhost:5068";

class TextCodeModel {
  static async getModelInfo() {
    const url = `${TEXT_CODE_API_BASE}/code/v1/model-info`;
    const res = await axios.get(url, { timeout: 60000 });
    return res.data;
  }

  static async reloadModel(payload = {}) {
    const url = `${TEXT_CODE_API_BASE}/code/v1/reload`;
    const res = await axios.post(url, payload, { timeout: 120000 });
    return res.data;
  }

  /**
   * payload: { task, use_retrieval?, max_new_tokens? }
   * Mirrors the Flask endpoint /code/v1/generate
   */
  static async generateCode(payload) {
    const url = `${TEXT_CODE_API_BASE}/code/v1/generate`;
    const res = await axios.post(url, payload, { timeout: 240000 });
    return res.data;
  }
}

module.exports = TextCodeModel;
