// src/pages/chatbot_pages/DashboardGenAssistantShell.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
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

function safeString(x) {
  if (typeof x === "string") return x;
  if (x == null) return "";
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}

/** Remove ``` fences if model ever returns them */
function stripFences(text) {
  const t = String(text || "").trim();
  return t
    .replace(/```[a-zA-Z]*\s*/g, "")
    .replace(/\s*```$/g, "")
    .trim();
}

/**
 * Extract first React component-like block so preview doesn't die
 * when model appends junk or starts a second JSX section.
 */
function extractFirstComponentBlock(raw) {
  let code = stripFences(raw);

  // Remove leaked system text lines
  code = code
    .split("\n")
    .filter((ln) => {
      const s = ln.trim();
      if (!s) return true;
      if (s.startsWith("You are a code generator")) return false;
      if (s.startsWith("Return ONLY valid")) return false;
      if (s.startsWith("No markdown")) return false;
      if (s.startsWith("No explanation")) return false;
      if (s.startsWith("USER REQUEST:")) return false;
      return true;
    })
    .join("\n")
    .trim();

  // If it contains "JSX:" markers, keep only content after the LAST marker
  const last = code.lastIndexOf("JSX:");
  if (last !== -1) {
    code = code.slice(last + "JSX:".length).trim();
  }

  // If model repeats second JSX block, cut it
  const second = code.indexOf("\nJSX:");
  if (second !== -1) code = code.slice(0, second).trim();

  // Remove import lines (preview runs in isolated context)
  code = code.replace(/^\s*import\s+[\s\S]*?;\s*$/gm, "").trim();

  // Try to start from export default / function / const
  const starters = ["export default function", "function ", "const "];
  let startIndex = -1;
  for (const s of starters) {
    const i = code.indexOf(s);
    if (i !== -1) startIndex = startIndex === -1 ? i : Math.min(startIndex, i);
  }
  if (startIndex > 0) code = code.slice(startIndex).trim();

  // Now brace-balance to cut incomplete tails
  const firstBrace = code.indexOf("{");
  if (firstBrace === -1) return code;

  let out = "";
  let depth = 0;
  let inStr = false;
  let strCh = "";
  let esc = false;

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    out += ch;

    if (esc) {
      esc = false;
      continue;
    }

    if (inStr) {
      if (ch === "\\") esc = true;
      else if (ch === strCh) inStr = false;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      inStr = true;
      strCh = ch;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") depth--;

    if (i >= firstBrace && depth === 0) break;
  }

  return out.trim();
}

/**
 * Normalize model output to something previewable:
 * - Remove "export default"
 * - Ensure we end with: window.App = ComponentName
 */
function normalizeForPreview(codeRaw) {
  let code = extractFirstComponentBlock(codeRaw);

  // remove leading BOM / weird chars
  code = code.replace(/^\uFEFF/, "").trim();

  // export default function X -> function X
  code = code.replace(/export\s+default\s+function\s+/g, "function ");

  // remove trailing export default X;
  code = code.replace(/export\s+default\s+([A-Za-z0-9_]+)\s*;\s*$/gm, "");

  // remove any remaining "export default"
  code = code.replace(/export\s+default\s+/g, "");

  // detect component name
  let compName = null;
  const m1 = code.match(/function\s+([A-Za-z0-9_]+)\s*\(/);
  if (m1?.[1]) compName = m1[1];
  if (!compName) {
    const m2 = code.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\(/);
    if (m2?.[1]) compName = m2[1];
  }
  if (!compName) compName = "App";

  if (!/window\.App\s*=/.test(code)) {
    code += `\n\nwindow.App = ${compName};\n`;
  }

  return code;
}

function looksLikeJSX(text) {
  const t = stripFences(text);
  if (t.length < 60) return false;
  if (t.includes("<div") && t.includes("return")) return true;
  if (
    t.includes("className=") &&
    (t.includes("function") || t.includes("const"))
  )
    return true;
  if (t.includes("export default") && t.includes("return")) return true;
  return false;
}

function isProbablyValidDashboardJSX(text) {
  const t = stripFences(text);
  if (/\bdef\b|\blambda\b|\bprint\s*\(/i.test(t)) return false;
  if (
    t.includes("return (") &&
    (t.includes("<div") || t.includes("className="))
  )
    return true;
  return false;
}

function ensureScript(src) {
  return new Promise((resolve, reject) => {
    const existing = Array.from(document.scripts).find((s) => s.src === src);
    if (existing && existing.getAttribute("data-loaded") === "1") {
      resolve(true);
      return;
    }

    const s = existing || document.createElement("script");
    if (!existing) {
      s.src = src;
      s.async = true;
      document.head.appendChild(s);
    }

    s.onload = () => {
      s.setAttribute("data-loaded", "1");
      resolve(true);
    };
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
  });
}

async function ensureBabelLoaded() {
  if (window.Babel && window.Babel.transform) return true;
  await ensureScript("https://unpkg.com/@babel/standalone/babel.min.js");
  if (!window.Babel || !window.Babel.transform) {
    throw new Error("Babel Standalone did not initialize.");
  }
  return true;
}

async function ensureRechartsLoaded() {
  if (window.Recharts && window.Recharts.ResponsiveContainer) return true;
  try {
    await ensureScript("https://unpkg.com/recharts/umd/Recharts.min.js");
  } catch {
    return false;
  }
  return !!(window.Recharts && window.Recharts.ResponsiveContainer);
}

function JSXPreview({ jsxCode }) {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setStatus("");
      const code = normalizeForPreview(jsxCode);

      if (!mountRef.current) return;
      mountRef.current.innerHTML = "";
      if (!code.trim()) return;

      try {
        await ensureBabelLoaded();
        await ensureRechartsLoaded();

        if (cancelled) return;

        // expose React/ReactDOM to generated code
        window.__REACT__ = React;
        window.__REACTDOM__ = ReactDOM;

        const wrapped = `
          (function(){
            const React = window.__REACT__;
            const ReactDOM = window.__REACTDOM__;
            const Recharts = window.Recharts || {};
            ${code}
          })();
        `;

        const compiled = window.Babel.transform(wrapped, {
          presets: ["react"],
        }).code;

        window.App = null;

        // eslint-disable-next-line no-new-func
        new Function(compiled)();

        const App = window.App;
        if (!App) throw new Error("Preview failed: window.App missing.");

        const rootEl = document.createElement("div");
        mountRef.current.appendChild(rootEl);

        const root = ReactDOM.createRoot(rootEl);
        root.render(React.createElement(App));

        setStatus("✅ Preview rendered");
      } catch (e) {
        const msg = e?.message || String(e);
        setStatus(`❌ ${msg}`);

        if (mountRef.current) {
          const safe = msg
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
          mountRef.current.innerHTML = `<div style="padding:12px;border:1px solid #fecdd3;background:#fff1f2;color:#991b1b;border-radius:14px;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;font-size:12px;white-space:pre-wrap;">${safe}</div>`;
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [jsxCode]);

  return (
    <div className="rounded-2xl border bg-white overflow-hidden mt-4">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-900">Preview</div>
        <div className="text-xs text-gray-500">{status}</div>
      </div>
      <div className="p-4">
        <div ref={mountRef} />
      </div>
    </div>
  );
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
        text: `📊 Welcome to ${title}. Describe the dashboard you want and I’ll generate React JSX.`,
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
    if (sidebarOpen) setSidebarOpen(false);
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
      await axios.post(RELOAD_DASH, {}, { headers, timeout: 180000 });
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
      // ✅ THIS IS WHERE YOU PUT IT
      const payload = {
        prompt: task,
        max_new_tokens: 1400,
        max_time_s: 240, // matches backend safety cap
      };

      const resp = await axios.post(ASK_DASH, payload, {
        headers,
        timeout: 420000,
      });

      const raw = resp?.data || {};
      jsx = safeString(raw.completion);

      if (raw.ok === false) {
        const msg = safeString(
          raw.errorText || raw.message || raw.error || "Generation failed."
        );
        setError(msg);
        if (!jsx.trim()) jsx = `⚠️ ${msg}`;
      } else {
        if (!looksLikeJSX(jsx))
          setError("Output may not be JSX (still showing).");
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

              {modelInfo?.model_dir && (
                <div className="text-[11px] text-gray-600">
                  model: <code>{String(modelInfo.model_dir)}</code>
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
                      <>
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

                        {isProbablyValidDashboardJSX(m.text) && (
                          <JSXPreview jsxCode={m.text} />
                        )}
                      </>
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
