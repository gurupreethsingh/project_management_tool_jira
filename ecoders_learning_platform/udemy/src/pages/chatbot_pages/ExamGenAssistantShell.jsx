// src/components/ai_components/ExamGenAssistantShell.jsx

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

const API = globalBackendRoute; // e.g., http://localhost:3011
const EXAM_BASE = `${API}/api/exam-gen`;
const ASK_EXAM = `${EXAM_BASE}/generate`;
// Optional future endpoints if you add Node wrappers:
// const INFO_EXAM = `${EXAM_BASE}/model-info`;
// const RELOAD_EXAM = `${EXAM_BASE}/reload`;

const SID_KEY = "exam_gen_workspace_sid_v1";

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

function lsKey(scope, suffix) {
  return `exam_${scope}_${suffix}_v1`;
}

// Simple heuristic to recognise exam-paper-ish text
function looksLikeExamPaper(text) {
  if (!text || typeof text !== "string") return false;
  const t = text.trim();
  if (t.length < 40) return false;
  if (/max marks\s*:\s*\d+/i.test(t)) return true;
  if (/end semester examination/i.test(t)) return true;
  if (/section\s*-\s*[abc]/i.test(t)) return true;
  if (/\bQ[1-5]\./.test(t)) return true;
  return false;
}

export default function ExamGenAssistantShell({
  title = "Exam Question Paper Generator",
  scope = "exam-gen",
  placeholder = "Describe the exam paper pattern, subject, marks split, and constraints…",
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
  const [modelInfo, setModelInfo] = useState(null); // if you wire /model-info later

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
        text: `📄 Welcome to ${title}. Describe the subject, marks pattern (e.g., 100 marks, 5x20 with 2/4/5 marks sub-questions), and I’ll generate a full exam paper.`,
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

  // If later you create /api/exam-gen/model-info that proxies to Flask:
  useEffect(() => {
    (async () => {
      try {
        // const r = await axios.get(`${EXAM_BASE}/model-info`, {
        //   headers,
        //   timeout: 10000,
        // });
        // setModelInfo(r?.data || null);
        setModelInfo(null); // placeholder: avoid 404 until backend is ready
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
        text: `🆕 New ${title} session. What kind of exam question paper should I generate?`,
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

  function downloadExam(text, filename = "exam_paper.txt") {
    const blob = new Blob([text || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // If you build backend /reload, wire here
  async function reloadModel() {
    try {
      // await axios.post(`${EXAM_BASE}/reload`, {}, { headers, timeout: 60000 });
      // const info = await axios.get(`${EXAM_BASE}/model-info`, {
      //   headers,
      //   timeout: 10000,
      // });
      // setModelInfo(info?.data || null);
      setError("Reload endpoint for exam-gen is not configured yet.");
    } catch (e) {
      setError(e?.response?.data?.message || "Reload failed");
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

    let paper = "";
    try {
      const payload = {
        task,
        max_new_tokens: 1400,
        use_retrieval: true,
      };
      const resp = await axios.post(ASK_EXAM, payload, {
        headers,
        timeout: 120000,
      });
      const data = resp?.data?.data || resp?.data || {};
      paper = data.paper ?? "No paper returned.";
    } catch (e) {
      setError(
        e?.response?.data?.message || "Exam generator is unavailable right now."
      );
      paper = "Exam generator is unavailable. Please try again later.";
    }

    const aiMsg = {
      id: "a_" + cryptoRandomId(8),
      role: "ai",
      text: paper || "No output.",
      time: Date.now(),
    };
    setMessages((m) => [...m, aiMsg]);

    setBusy(false);
  }

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-10rem)]">
      {/* Top bar (mobile) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
        <button
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-gray-50"
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu /> Papers
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
                  No topics yet. Describe an exam pattern to start!
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
                    // const r = await axios.get(`${EXAM_BASE}/model-info`, {
                    //   headers,
                    //   timeout: 10000,
                    // });
                    // setModelInfo(r?.data || null);
                    setModelInfo(null);
                  } catch {
                    setModelInfo(null);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100"
                title="Fetch model info (wire backend /model-info to enable)"
              >
                <FiInfo /> Model info
              </button>
              <button
                onClick={reloadModel}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100"
                title="Reload adapters / retrieval (needs /reload endpoint)"
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
                    <div className="whitespace-pre-wrap break-words text-xs md:text-sm">
                      {m.text}
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
                  </div>

                  {m.role === "ai" && m.text && (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <button
                        onClick={() => copyToClipboard(m.text)}
                        className="inline-flex items-center gap-1 border rounded px-2 py-1 hover:bg-gray-50"
                        title="Copy exam paper"
                      >
                        <FiCopy /> Copy
                      </button>
                      <button
                        onClick={() => downloadExam(m.text)}
                        className="inline-flex items-center gap-1 border rounded px-2 py-1 hover:bg-gray-50"
                        title="Download .txt"
                      >
                        <FiDownload /> Download
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiLoader className="animate-spin" /> generating exam paper…
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
