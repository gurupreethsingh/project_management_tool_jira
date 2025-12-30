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
} from "react-icons/fi";

import globalBackendRoute from "../../config/Config";
import { getAuthorizationHeader } from "../../components/auth_components/AuthManager";

const API = globalBackendRoute; // e.g. http://localhost:3011

// ✅ Node endpoints (Node → Flask)
const DASH_BASE = `${API}/api/dashboard-gen`;
const ASK_DASH = `${DASH_BASE}/generate`;
const INFO_DASH = `${DASH_BASE}/model-info`;
const RELOAD_DASH = `${DASH_BASE}/reload`;

const SID_KEY = "dash_gen_workspace_sid_v1";

function cryptoRandomId(len = 24) {
  const arr = new Uint8Array(len);
  (window.crypto || window.msCrypto).getRandomValues(arr);
  return Array.from(arr, (x) => ("0" + x.toString(16)).slice(-2)).join("");
}

function ensureSessionId() {
  let sid = localStorage.getItem(SID_KEY);
  if (!sid) {
    sid = cryptoRandomId();
    localStorage.setItem(SID_KEY, sid);
  }
  return sid;
}

function lsKey(scope, suffix) {
  return `dash_${scope}_${suffix}_v1`;
}

function looksLikeJSX(text) {
  if (!text || typeof text !== "string") return false;
  const t = text.trim();
  if (t.length < 50) return false;
  if (t.includes("export default function")) return true;
  if (t.includes('from "react"') || t.includes("from 'react'")) return true;
  if (
    t.includes("return (") &&
    (t.includes("className=") || t.includes("<div"))
  )
    return true;
  return false;
}

function safeString(x) {
  if (typeof x === "string") return x;
  if (x == null) return "";
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}

export default function DashboardGenAssistantShell({
  title = "Dashboard Generator",
  scope = "dashboard-gen",
  placeholder = "Describe the dashboard…",
  starterPrompts = [],
}) {
  const sid = useMemo(() => ensureSessionId(), []);
  const headers = useMemo(() => {
    const h = { "X-Session-Id": sid, "X-Channel": "widget" };
    const auth = getAuthorizationHeader?.();
    if (auth?.Authorization) h["Authorization"] = auth.Authorization;
    return h;
  }, [sid]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [modelInfo, setModelInfo] = useState(null);

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
        text: `📊 Welcome to ${title}. Describe the dashboard you want and I’ll generate React JSX (Tailwind + Recharts).`,
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
        const r = await axios.get(INFO_DASH, { headers, timeout: 20000 });
        setModelInfo(r?.data || null);
      } catch {
        setModelInfo(null);
      }
    })();
  }, [headers]);

  function newChat() {
    setMessages([
      {
        id: "welcome",
        role: "ai",
        text: `🆕 New ${title} session. What dashboard should I generate?`,
        time: Date.now(),
      },
    ]);
    setInput("");
    setError("");
  }

  function addTopic(titleText) {
    const t = (titleText || "").trim();
    if (!t) return;
    const topic = {
      id: cryptoRandomId(8),
      title: t.slice(0, 90),
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
    navigator.clipboard.writeText(String(text || "")).catch(() => {});
  }

  function downloadJSX(text, filename = "Dashboard.jsx") {
    const blob = new Blob([String(text || "")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function reloadModel() {
    try {
      setError("");
      await axios.post(RELOAD_DASH, {}, { headers, timeout: 120000 });
      const info = await axios.get(INFO_DASH, { headers, timeout: 20000 });
      setModelInfo(info?.data || null);
    } catch (e) {
      setError(
        safeString(
          e?.response?.data?.errorText ||
            e?.response?.data?.error ||
            e?.message ||
            "Reload failed"
        )
      );
    }
  }

  async function send() {
    const task = input.trim();
    if (!task || busy) return;

    setBusy(true);
    setError("");

    const userMsg = {
      id: "u_" + cryptoRandomId(8),
      role: "user",
      text: task,
      time: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    addTopic(task);

    let jsx = "";
    try {
      // ✅ CPU-friendly defaults: beams=1 (fast), fewer tokens
      const payload = {
        prompt: task,
        max_new_tokens: 600,
        num_beams: 1,
        do_sample: false,
      };

      // ✅ increase frontend timeout so it doesn't die before Node/Flask responds
      const resp = await axios.post(ASK_DASH, payload, {
        headers,
        timeout: 360000, // 6 minutes
      });

      const raw = resp?.data || {};

      // ✅ completion ALWAYS rendered as string
      jsx = safeString(raw.completion);

      if (raw.ok === false) {
        const msg = safeString(
          raw.errorText || raw.message || raw.error || "Generation failed."
        );
        setError(msg);
        if (!jsx.trim()) jsx = `⚠️ ${msg}`;
      } else {
        if (!looksLikeJSX(jsx)) {
          setError("Output does not look like JSX (still showing it).");
        }
      }
    } catch (e) {
      const msg = safeString(
        e?.response?.data?.errorText ||
          e?.response?.data?.error ||
          e?.message ||
          "Dashboard generator unavailable."
      );
      setError(msg);
      jsx = `⚠️ ${msg}`;
    }

    const aiMsg = {
      id: "a_" + cryptoRandomId(8),
      role: "ai",
      text: jsx || "No output.",
      time: Date.now(),
    };
    setMessages((m) => [...m, aiMsg]);
    setBusy(false);
  }

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-10rem)]">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
        <button
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-gray-50"
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu /> Prompts
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
            } w-[80%] max-w-[320px] md:w-[280px] h-full md:h-auto bg-white md:bg-transparent border-r md:border-r p-4 overflow-y-auto`}
          >
            <div className="hidden md:flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">{title} Prompts</div>
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
                  No prompts yet. Start by describing a dashboard.
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
                aria-label="Close prompts"
              >
                ✕
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="min-h-[70vh] flex flex-col">
          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>

              <button
                onClick={async () => {
                  try {
                    const r = await axios.get(INFO_DASH, {
                      headers,
                      timeout: 20000,
                    });
                    setModelInfo(r?.data || null);
                  } catch {
                    setModelInfo(null);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100"
              >
                <FiInfo /> Model info
              </button>

              <button
                onClick={reloadModel}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100"
              >
                <FiRefreshCw /> Reload
              </button>

              {modelInfo?.model?.adapter_name && (
                <div className="text-[11px] text-gray-600">
                  adapter: <code>{String(modelInfo.model.adapter_name)}</code>
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
                    m.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 shadow ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white w-full md:w-[70%]"
                        : "bg-gray-50 text-gray-900 border w-full"
                    }`}
                  >
                    <div
                      className={`whitespace-pre-wrap break-words text-xs md:text-sm ${
                        m.role === "ai" ? "font-mono" : ""
                      }`}
                    >
                      {String(m.text || "")}
                    </div>

                    <div
                      className={`text-[10px] mt-1 ${
                        m.role === "user"
                          ? "text-indigo-100/80"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(m.time).toLocaleTimeString()}
                    </div>

                    {m.role === "ai" && m.text && (
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <button
                          onClick={() => copyToClipboard(m.text)}
                          className="inline-flex items-center gap-1 border rounded px-2 py-1 hover:bg-white"
                        >
                          <FiCopy /> Copy
                        </button>
                        <button
                          onClick={() => downloadJSX(m.text, "Dashboard.jsx")}
                          className="inline-flex items-center gap-1 border rounded px-2 py-1 hover:bg-white"
                        >
                          <FiDownload /> Download JSX
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {busy && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiLoader className="animate-spin" /> generating dashboard…
                </div>
              )}

              {error && (
                <div className="mt-2 text-xs text-red-600">{error}</div>
              )}
            </div>
          </div>

          {/* Starter prompts */}
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

          {/* Input */}
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
