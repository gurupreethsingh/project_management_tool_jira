// src/pages/chatbot_pages/RoadmapAssistantShell.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  FiSend,
  FiMenu,
  FiPlus,
  FiClock,
  FiChevronRight,
  FiTrash2,
  FiLoader,
  FiCopy,
  FiDownload,
  FiInfo,
  FiRefreshCw,
  FiExternalLink,
} from "react-icons/fi";

import globalBackendRoute from "../../config/Config";
import { getAuthorizationHeader } from "../../components/auth_components/AuthManager";

const API = globalBackendRoute; // e.g., http://localhost:3011
const RM_BASE = `${API}/api/roadmap-gen`;
const ASK_RM = `${RM_BASE}/ask`;
const INFO_RM = `${RM_BASE}/model-info`;
const RELOAD_RM = `${RM_BASE}/reload`;

const SID_KEY = "roadmap_gen_workspace_sid_v1";
function ensureSessionId() {
  let sid = localStorage.getItem(SID_KEY);
  if (!sid) {
    sid = cryptoRandomId();
    localStorage.setItem(SID_KEY, sid);
  }
  return sid;
}
function cryptoRandomId(len = 24) {
  const arr = new Uint8Array(len);
  (window.crypto || window.msCrypto).getRandomValues(arr);
  return Array.from(arr, (x) => ("0" + x.toString(16)).slice(-2)).join("");
}

// --- Roadmap (Markdown) shape validator ---
function looksLikeRoadmap(s) {
  if (!s || typeof s !== "string") return false;
  const t = s.trim();
  if (t.length < 24) return false;
  // headings or syllabus-y terms
  if (/(^|\n)\s*#{1,3}\s+/.test(t)) return true;
  if (/(^|\n)\s*(Semester|Module|Week|Unit|Phase)\s*\d*/i.test(t)) return true;
  if (/(Outcomes?|Revision|Capstone|Projects?)/i.test(t)) return true;
  if (/(^|\n)\s*[-*•]\s+/.test(t) && /(Outcomes?|Revision|Project)/i.test(t))
    return true;
  return false;
}

// --- Tiny Markdown → HTML (safe-ish subset, no external deps) ---
function mdToHtml(md) {
  if (!md) return "";
  let html = md
    // escape
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // code fences (``` ... ```)
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre style="background:#0b1020;color:#e5e7eb;padding:.75rem 1rem;border-radius:.5rem;overflow:auto"><code>${code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</code></pre>`;
  });

  // headings
  html = html
    .replace(/^###\s+(.*)$/gim, "<h3>$1</h3>")
    .replace(/^##\s+(.*)$/gim, "<h2>$1</h2>")
    .replace(/^#\s+(.*)$/gim, "<h1>$1</h1>");

  // bold/italic
  html = html
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");

  // lists
  html = html.replace(/(^|\n)\s*[-*•]\s+(.*)/g, "$1<li>$2</li>");
  // group li into <ul> blocks
  html = html.replace(/(?:\s*<li>[\s\S]*?<\/li>)+/g, (m) => `<ul>${m}</ul>`);

  // paragraphs (simple)
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      if (
        /^<h\d|^<ul>|^<pre>|^<\/ul>|^<li>|^<\/li>|^<\/pre>|^<\/h\d>/.test(block)
      )
        return block;
      return `<p>${block.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");

  return html;
}

// LocalStorage helpers
function lsKey(scope, suffix) {
  return `roadmap_${scope}_${suffix}_v1`;
}

export default function RoadmapAssistantShell({
  title = "Roadmap Generator",
  scope = "roadmap-gen",
  placeholder = "Describe the roadmap you want (e.g., '2-year MSc AI syllabus with labs, projects, and outcomes')…",
  starterPrompts = [],
}) {
  const sid = useMemo(() => ensureSessionId(), []);
  const headers = useMemo(() => {
    const h = { "X-Session-Id": sid, "X-Channel": "widget" };
    const auth = getAuthorizationHeader?.();
    if (auth?.Authorization) h["Authorization"] = auth.Authorization;
    return h;
  }, [sid]);

  // ----------------------- UI State -----------------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [modelInfo, setModelInfo] = useState(null);
  const [lastRoadmap, setLastRoadmap] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(lsKey(scope, "active_convo"));
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: "welcome",
        role: "ai",
        text: `🎓 Welcome to ${title}. Ask for a syllabus/roadmap and I'll return structured Markdown with semesters, labs, projects, and outcomes.`,
        time: Date.now(),
      },
    ];
  });

  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem(lsKey(scope, "topics"));
    if (saved) {
      try {
        return JSON.parse(saved) || [];
      } catch {}
    }
    return [];
  });

  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    localStorage.setItem(
      lsKey(scope, "active_convo"),
      JSON.stringify(messages)
    );
  }, [messages, scope]);

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(INFO_RM, { headers, timeout: 10000 });
        setModelInfo(r?.data || null);
      } catch {
        setModelInfo(null);
      }
    })();
  }, [headers]);

  // ----------------------- Helpers -----------------------
  function newChat() {
    setMessages([
      {
        id: "welcome",
        role: "ai",
        text: `🆕 New ${title} session. What roadmap should I design?`,
        time: Date.now(),
      },
    ]);
    setInput("");
    setError("");
    setLastRoadmap("");
    setPreviewHtml("");
  }

  function addTopic(titleText) {
    const t = (titleText || "").trim();
    if (!t) return;
    const topic = {
      id: cryptoRandomId(8),
      title: t.slice(0, 80),
      at: Date.now(),
    };
    const next = [topic, ...topics].slice(0, 200);
    setTopics(next);
    localStorage.setItem(lsKey(scope, "topics"), JSON.stringify(next));
  }

  function removeTopic(id) {
    const next = topics.filter((t) => t.id !== id);
    setTopics(next);
    localStorage.setItem(lsKey(scope, "topics"), JSON.stringify(next));
  }

  function pickTopic(t) {
    setInput(t.title);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  function downloadMarkdown(text, filename = "roadmap.md") {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function renderPreview(md) {
    try {
      const html = mdToHtml(md);
      setPreviewHtml(html);
    } catch (e) {
      console.warn("preview failed:", e);
    }
  }

  async function reloadModel() {
    try {
      await axios.post(RELOAD_RM, {}, { headers, timeout: 60000 });
      const info = await axios.get(INFO_RM, { headers, timeout: 10000 });
      setModelInfo(info?.data || null);
    } catch (e) {
      setError(e?.response?.data?.message || "Reload failed");
    }
  }

  // ----------------------- Send -----------------------
  async function send() {
    const query = input.trim();
    if (!query || busy) return;
    setBusy(true);
    setError("");

    const userMsg = {
      id: "u_" + cryptoRandomId(8),
      role: "user",
      text: query,
      time: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    addTopic(query);

    let roadmap = "";
    try {
      // First pass: with retrieval
      let payload = {
        topic: query,
        use_retrieval: true,
        max_new_tokens: 1200,
      };
      let resp = await axios.post(ASK_RM, payload, {
        headers,
        timeout: 120000,
      });

      // The controller wraps data sometimes; accept both shapes.
      let data =
        resp?.data?.data /* in case your Node wraps */ || resp?.data || {};
      roadmap = data?.roadmap || data?.data?.roadmap || "";

      const notRoadmap =
        !looksLikeRoadmap(roadmap) || data?.status === "low_confidence";

      if (notRoadmap) {
        // Second pass: no retrieval, longer
        payload = { topic: query, use_retrieval: false, max_new_tokens: 1600 };
        resp = await axios.post(ASK_RM, payload, { headers, timeout: 120000 });
        data = resp?.data?.data /* wrapped */ || resp?.data /* direct */ || {};
        roadmap = data?.roadmap || data?.data?.roadmap || roadmap || "";
      }
    } catch (e) {
      setError(
        e?.response?.data?.message || "Roadmap generator is unavailable."
      );
    }

    const aiMsg = {
      id: "a_" + cryptoRandomId(8),
      role: "ai",
      text: roadmap || "No output.",
      time: Date.now(),
    };
    setMessages((m) => [...m, aiMsg]);
    setLastRoadmap(roadmap || "");
    if (looksLikeRoadmap(roadmap)) {
      renderPreview(roadmap);
    }
    setBusy(false);
  }

  // ----------------------- UI -----------------------
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-10rem)]">
      {/* Top bar (mobile) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
        <button
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-gray-50"
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu /> Topics
        </button>
        <div className="text-base font-semibold">{title}</div>
        <button
          onClick={newChat}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-gray-50"
        >
          <FiPlus /> New
        </button>
      </div>

      <div className="mx-auto max-w-7xl grid md:grid-cols-[280px,1fr]">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen
              ? "fixed inset-0 z-40 bg-black/40 md:bg-transparent"
              : ""
          } md:static`}
        >
          <div
            className={`${
              sidebarOpen ? "absolute left-0 top-0 bottom-0" : "hidden md:block"
            }
                        w-[80%] max-w-[320px] md:w-[280px] h-full md:h-auto bg-white md:bg-transparent border-r md:border-r p-4`}
          >
            <div className="hidden md:flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">{title} Topics</div>
              <button
                onClick={newChat}
                className="inline-flex items-center gap-1 text-xs border rounded px-2 py-1 bg-gray-50"
              >
                <FiPlus /> New
              </button>
            </div>
            <ul className="space-y-1 max-h-[70vh] md:max-h-[calc(100vh-18rem)] overflow-y-auto">
              {topics.length === 0 && (
                <li className="text-xs text-gray-500">
                  No topics yet. Describe a roadmap to start!
                </li>
              )}
              {topics.map((t) => (
                <li
                  key={t.id}
                  className="group flex items-center justify-between gap-2 rounded-lg border px-3 py-2 hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer"
                >
                  <button
                    onClick={() => pickTopic(t)}
                    className="flex items-center gap-2 text-left flex-1"
                    title={t.title}
                  >
                    <FiChevronRight className="shrink-0 text-gray-400" />
                    <span className="text-sm line-clamp-1">{t.title}</span>
                  </button>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiClock />
                    {new Date(t.at).toLocaleTimeString()}
                    <button
                      onClick={() => removeTopic(t.id)}
                      className="opacity-0 group-hover:opacity-100 transition"
                      title="Remove"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {sidebarOpen && (
              <button
                className="absolute top-3 right-3 text-white"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close topics"
              >
                ✕
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="min-h-[70vh] flex flex-col">
          {/* Header (desktop) */}
          <div className="hidden md:flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <button
                onClick={async () => {
                  try {
                    const r = await axios.get(INFO_RM, {
                      headers,
                      timeout: 10000,
                    });
                    setModelInfo(r?.data || null);
                  } catch {
                    setModelInfo(null);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100"
                title="Fetch model info"
              >
                <FiInfo /> Model info
              </button>
              <button
                onClick={reloadModel}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100"
                title="Reload adapters / retrieval"
              >
                <FiRefreshCw /> Reload
              </button>
              {modelInfo && (
                <div className="text-[11px] text-gray-600">
                  device: <code>{String(modelInfo.device)}</code>
                  {Array.isArray(modelInfo.adapters) && (
                    <>
                      {" "}
                      · adapters: <code>{modelInfo.adapters.length}</code>
                    </>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={newChat}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100"
            >
              <FiPlus /> New session
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-white"
          >
            <div className="mx-auto max-w-4xl">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`mb-5 ${
                    m.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block rounded-2xl px-4 py-3 text-sm shadow ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-50 text-gray-900 border"
                    }`}
                  >
                    {m.role === "ai" ? (
                      <pre className="whitespace-pre-wrap break-words text-xs">
                        {m.text}
                      </pre>
                    ) : (
                      <div className="whitespace-pre-wrap break-words">
                        {m.text}
                      </div>
                    )}
                    <div
                      className={`text-[10px] mt-1 ${
                        m.role === "user"
                          ? "text-indigo-100/80"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(m.time).toLocaleTimeString()}
                    </div>
                  </div>

                  {m.role === "ai" && m.text && (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <button
                        onClick={() => copyToClipboard(m.text)}
                        className="inline-flex items-center gap-1 border rounded px-2 py-1 hover:bg-gray-50"
                        title="Copy markdown"
                      >
                        <FiCopy /> Copy
                      </button>
                      <button
                        onClick={() => downloadMarkdown(m.text)}
                        className="inline-flex items-center gap-1 border rounded px-2 py-1 hover:bg-gray-50"
                        title="Download .md"
                      >
                        <FiDownload /> Download
                      </button>
                      <button
                        onClick={() => {
                          if (looksLikeRoadmap(m.text)) renderPreview(m.text);
                        }}
                        className="inline-flex items-center gap-1 border rounded px-2 py-1 hover:bg-gray-50"
                        title="Render preview below"
                        disabled={!looksLikeRoadmap(m.text)}
                      >
                        <FiExternalLink /> Preview
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiLoader className="animate-spin" /> generating…
                </div>
              )}
              {error && (
                <div className="mt-2 text-xs text-red-600">{error}</div>
              )}
            </div>
          </div>

          {/* Rendered Markdown preview */}
          {previewHtml && (
            <div className="border-t bg-gray-50">
              <div className="mx-auto max-w-5xl px-4 md:px-6 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-600">Rendered Preview</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (lastRoadmap) renderPreview(lastRoadmap);
                      }}
                      className="inline-flex items-center gap-1 border rounded px-2 py-1 text-xs bg-white hover:bg-gray-50"
                    >
                      <FiRefreshCw /> Refresh
                    </button>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden border bg-white">
                  <div
                    className="prose max-w-none p-4"
                    // We generate the HTML ourselves (no external libs)
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Starters */}
          {starterPrompts?.length > 0 && (
            <div className="px-4 md:px-6">
              <div className="mx-auto max-w-4xl flex flex-wrap gap-2 pb-2">
                {starterPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => setInput(p)}
                    className="text-xs border rounded-full px-3 py-1 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Composer */}
          <div className="border-t bg-white px-4 md:px-6 py-3">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  className="flex-1 resize-none rounded-xl border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder={placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  disabled={busy}
                />
                <button
                  onClick={send}
                  disabled={busy || !input.trim()}
                  className={`rounded-xl px-3 py-2 text-sm inline-flex items-center gap-2 ${
                    busy || !input.trim()
                      ? "bg-gray-200 text-gray-500"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  <FiSend /> Generate
                </button>
              </div>
              <div className="mt-1 text-[10px] text-gray-500">
                Press Enter to generate • Shift+Enter for newline
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
