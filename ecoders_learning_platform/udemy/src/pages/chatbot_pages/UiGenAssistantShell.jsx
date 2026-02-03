// UiGenAssistantShell.jsx
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
  FiExternalLink,
  FiDownload,
  FiInfo,
  FiRefreshCw,
} from "react-icons/fi";

import globalBackendRoute from "../../config/Config";
import { getAuthorizationHeader } from "../../components/auth_components/AuthManager";

const API = globalBackendRoute; // e.g., http://localhost:3011
const UI_BASE = `${API}/api/ui-gen`;

// ✅ Match backend routes (dashboard-style contract)
const GEN_UI = `${UI_BASE}/generate`;
const INFO_UI = `${UI_BASE}/model-info`;
const RELOAD_UI = `${UI_BASE}/reload`;

const SID_KEY = "ui_gen_workspace_sid_v1";

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

// --- HTML/JSX validator (prevents junk previews) ---
function looksLikeHtmlOrJsx(s) {
  if (!s || typeof s !== "string") return false;
  const t = s.trim().toLowerCase();
  if (t.length < 12) return false;
  if (t.includes("<!doctype html") || t.includes("<html")) return true;
  if (t.includes("<head") && t.includes("<body")) return true;
  if (
    /(<(div|section|header|footer|main|form|nav|table|button|input|h1|h2)\b)/i.test(
      t,
    )
  )
    return true;
  if (/\bexport\s+default\s+function\b/i.test(s)) return true;
  return false;
}

// LocalStorage helpers
function lsKey(scope, suffix) {
  return `ui_${scope}_${suffix}_v1`;
}

// Detect backend fallback HTML (so you can SEE when it happens)
function isFallbackHtml(code) {
  if (!code || typeof code !== "string") return false;
  return /Fallback page/i.test(code) || /Fallback Template/i.test(code);
}

export default function UiGenAssistantShell({
  title = "UI Generator",
  scope = "ui-gen",
  placeholder = "Describe the UI you want…",
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
  const [previewUrl, setPreviewUrl] = useState("");
  const [lastCode, setLastCode] = useState("");
  const [lastMeta, setLastMeta] = useState(null);

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
        text: `🧩 Welcome to ${title}. Describe a component or layout and I'll generate UI code.`,
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
      JSON.stringify(messages),
    );
  }, [messages, scope]);

  useEffect(() => {
    localStorage.setItem(lsKey(scope, "topics"), JSON.stringify(topics));
  }, [topics, scope]);

  async function fetchModelInfo() {
    try {
      const r = await axios.get(INFO_UI, { headers, timeout: 10000 });
      setModelInfo(r?.data || null);
    } catch {
      setModelInfo(null);
    }
  }

  useEffect(() => {
    fetchModelInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headers]);

  // ----------------------- Helpers -----------------------
  function newChat() {
    setMessages([
      {
        id: "welcome",
        role: "ai",
        text: `🆕 New ${title} session. What should I build?`,
        time: Date.now(),
      },
    ]);
    setInput("");
    setError("");
    setLastCode("");
    setLastMeta(null);
    setPreviewUrl((u) => {
      if (u) URL.revokeObjectURL(u);
      return "";
    });
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
  }

  function removeTopic(id) {
    const next = topics.filter((t) => t.id !== id);
    setTopics(next);
  }

  function pickTopic(t) {
    setInput(t.title);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  function openPreview(code) {
    try {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const blob = new Blob([code], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (e) {
      console.warn("preview failed:", e);
    }
  }

  function downloadHtml(code, filename = "ui_snippet.html") {
    const blob = new Blob([code], { type: "text/html" });
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
      await axios.post(RELOAD_UI, {}, { headers, timeout: 60000 });
      await fetchModelInfo();
      setError("");
    } catch (e) {
      setError(
        e?.response?.data?.errorText ||
          e?.response?.data?.error ||
          "Reload failed",
      );
    }
  }

  // ----------------------- Send (Dashboard-style contract) -----------------------
  async function send() {
    const prompt = input.trim();
    if (!prompt || busy) return;

    setBusy(true);
    setError("");

    const userMsg = {
      id: "u_" + cryptoRandomId(8),
      role: "user",
      text: prompt,
      time: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    addTopic(prompt);

    let completion = "";
    let meta = null;

    try {
      const payload = {
        prompt,
        prefer: "auto",
        max_new_tokens: 1200,
        max_time_s: 60,
      };

      const resp = await axios.post(GEN_UI, payload, {
        headers,
        timeout: 120000,
        validateStatus: () => true,
      });

      const data = resp?.data || {};
      const ok =
        resp.status >= 200 &&
        resp.status < 300 &&
        (data.ok === true || data.ok == null);

      completion = String(data?.completion || "");

      meta = {
        http: resp.status,
        ok,
        adapter: data?.adapter,
        resolved_base_model: data?.resolved_base_model,
        output_mode: data?.output_mode,
        used_fallback:
          Boolean(data?.used_fallback) ||
          Boolean(data?.used_template_fallback) ||
          isFallbackHtml(completion),
        fallback_kind: data?.fallback_kind,
        sanitize_reason: data?.sanitize_reason,
        errorText: data?.errorText || data?.error || "",
      };

      setLastMeta(meta);

      if (!ok) {
        const msg = String(meta.errorText || "UI generation failed");
        setError(msg);
        if (!completion) completion = `<!-- ${msg} -->`;
      }

      // If it *is* fallback, show clear warning
      if (meta.used_fallback) {
        setError(
          meta.errorText ||
            `Backend returned TEMPLATE FALLBACK. (fallback_kind: ${meta.fallback_kind || "unknown"}, sanitize_reason: ${meta.sanitize_reason || "unknown"})`,
        );
      }

      if (!completion || completion.trim().length < 5) {
        const msg = "Empty output from backend.";
        setError(msg);
        completion = `<!-- ${msg} -->`;
      }
    } catch (e) {
      const msg =
        e?.response?.data?.errorText ||
        e?.response?.data?.error ||
        "UI generator is unavailable.";
      setError(msg);
      completion = `<!-- ${msg} -->`;
      setLastMeta({ http: 0, ok: false, used_fallback: true, errorText: msg });
    }

    const aiMsg = {
      id: "a_" + cryptoRandomId(8),
      role: "ai",
      text: completion || "No output.",
      time: Date.now(),
    };
    setMessages((m) => [...m, aiMsg]);
    setLastCode(completion || "");

    if (looksLikeHtmlOrJsx(completion)) openPreview(completion);

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
            } w-[80%] max-w-[320px] md:w-[280px] h-full md:h-auto bg-white md:bg-transparent border-r md:border-r p-4`}
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
                  No topics yet. Describe a UI to start!
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
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>

              <button
                onClick={fetchModelInfo}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100"
                title="Fetch model info"
              >
                <FiInfo /> Model info
              </button>

              <button
                onClick={reloadModel}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100"
                title="Reload"
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

              {lastMeta && (
                <div className="text-[11px] text-gray-600">
                  · http: <code>{String(lastMeta.http)}</code>
                  {" · usedFallback: "}
                  <code>{String(Boolean(lastMeta.used_fallback))}</code>
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
                  className={`mb-5 ${m.role === "user" ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`inline-block rounded-2xl px-4 py-3 text-sm shadow ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-50 text-gray-900 border"
                    }`}
                  >
                    {m.role === "ai" && /<\/?[a-z][\s\S]*>/i.test(m.text) ? (
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
                        title="Copy code"
                      >
                        <FiCopy /> Copy
                      </button>
                      <button
                        onClick={() =>
                          looksLikeHtmlOrJsx(m.text) && openPreview(m.text)
                        }
                        className="inline-flex items-center gap-1 border rounded px-2 py-1 hover:bg-gray-50"
                        title="Open preview below"
                        disabled={!looksLikeHtmlOrJsx(m.text)}
                      >
                        <FiExternalLink /> Preview
                      </button>
                      <button
                        onClick={() => downloadHtml(m.text)}
                        className="inline-flex items-center gap-1 border rounded px-2 py-1 hover:bg-gray-50"
                        title="Download .html"
                      >
                        <FiDownload /> Download
                      </button>
                    </div>
                  )}

                  {m.role === "ai" && isFallbackHtml(m.text) && (
                    <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">
                      ⚠️ Backend returned TEMPLATE FALLBACK. (Model output was
                      unusable.)
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

          {/* Live preview */}
          {previewUrl && (
            <div className="border-t bg-gray-50">
              <div className="mx-auto max-w-5xl px-4 md:px-6 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-600">Live Preview</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        window.open(previewUrl, "_blank", "noopener,noreferrer")
                      }
                      className="inline-flex items-center gap-1 border rounded px-2 py-1 text-xs bg-white hover:bg-gray-50"
                    >
                      <FiExternalLink /> Open in new tab
                    </button>
                    <button
                      onClick={() => {
                        if (lastCode) openPreview(lastCode);
                      }}
                      className="inline-flex items-center gap-1 border rounded px-2 py-1 text-xs bg-white hover:bg-gray-50"
                    >
                      <FiRefreshCw /> Refresh
                    </button>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden border bg-white">
                  <iframe
                    title="ui-gen-preview"
                    src={previewUrl}
                    className="w-full h-[480px]"
                    // ✅ FIX: remove allow-same-origin to avoid sandbox escape warning
                    sandbox="allow-forms allow-pointer-lock allow-popups allow-scripts"
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
                    title={p}
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
