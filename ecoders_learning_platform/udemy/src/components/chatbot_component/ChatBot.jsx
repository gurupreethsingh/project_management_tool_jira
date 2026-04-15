// // src/components/chatbot/ChatBot.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import axios from "axios";
// import {
//   FiMessageSquare,
//   FiSend,
//   FiX,
//   FiMinus,
//   FiMaximize2,
//   FiThumbsUp,
//   FiThumbsDown,
//   FiLoader,
//   FiCpu,
//   FiUser,
// } from "react-icons/fi";

// import globalBackendRoute from "../../config/Config";
// import { getAuthorizationHeader } from "../auth_components/AuthManager";

// /* ---------------------------- Endpoints (in sync) ---------------------------- */
// const API = globalBackendRoute;
// const CHAT_BASE = `${API}/api/chat-interactions`;
// const ASK_API = `${API}/api/ai/ask`; // -> Node proxy to Flask /v1/answer
// const MODEL_INFO_API = `${API}/api/ai/model-info`; // -> Node proxy to Flask /v1/model-info

// /* ------------------------------- Local storage ------------------------------- */
// const SID_KEY = "chat_widget_sid_v1";
// const UI_KEY = "chat_widget_collapsed_v1";

// function ensureSessionId() {
//   let sid = localStorage.getItem(SID_KEY);
//   if (!sid) {
//     sid = cryptoRandomId();
//     localStorage.setItem(SID_KEY, sid);
//   }
//   return sid;
// }
// function cryptoRandomId(len = 24) {
//   const arr = new Uint8Array(len);
//   (window.crypto || window.msCrypto).getRandomValues(arr);
//   return Array.from(arr, (x) => ("0" + x.toString(16)).slice(-2)).join("");
// }

// /* --------------------------------- UI bits ---------------------------------- */
// function Bubble({ role, text, time }) {
//   const isUser = role === "user";
//   return (
//     <div
//       className={`flex items-start gap-2 ${
//         isUser ? "justify-end" : "justify-start"
//       } mb-3`}
//     >
//       {!isUser && (
//         <div className="mt-1 shrink-0 rounded-full p-2 bg-indigo-100">
//           <FiCpu className="w-4 h-4 text-indigo-600" />
//         </div>
//       )}
//       <div
//         className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow ${
//           isUser ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
//         }`}
//       >
//         <div className="whitespace-pre-wrap break-words">{text}</div>
//         {time && (
//           <div
//             className={`text-[10px] mt-1 ${
//               isUser ? "text-indigo-100/80" : "text-gray-500"
//             }`}
//           >
//             {new Date(time).toLocaleTimeString()}
//           </div>
//         )}
//       </div>
//       {isUser && (
//         <div className="mt-1 shrink-0 rounded-full p-2 bg-indigo-100">
//           <FiUser className="w-4 h-4 text-indigo-600" />
//         </div>
//       )}
//     </div>
//   );
// }

// function ActiveBadge({ active }) {
//   if (!active) return null;

//   const type = active.type;
//   let label = "model: base";

//   if (type === "adapter") {
//     const ap =
//       active.adapter_path || active.adapterPath || active.adapter || "";
//     const name = ap ? ap.split(/[\\/]/).pop() : "adapter";
//     label = `adapter: ${name}`;
//   } else if (type === "full") {
//     label = "model: base";
//   }

//   return (
//     <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
//       {label}
//     </span>
//   );
// }

// function Header({ onClose, onMinimize, active }) {
//   return (
//     <div className="flex items-center justify-between p-3 border-b">
//       <div className="flex items-center gap-2">
//         <div className="rounded-full p-2 bg-indigo-600 text-white">
//           <FiMessageSquare className="w-4 h-4" />
//         </div>
//         <div className="font-medium">Assistant</div>
//         <div className="ml-2 text-xs text-gray-500">
//           How may I help you today?
//         </div>
//         <ActiveBadge active={active} />
//       </div>
//       <div className="flex items-center gap-2">
//         <button
//           onClick={onMinimize}
//           className="p-2 rounded hover:bg-gray-100"
//           title="Minimize"
//           aria-label="Minimize"
//         >
//           <FiMinus />
//         </button>
//         <button
//           onClick={onClose}
//           className="p-2 rounded hover:bg-gray-100"
//           title="Close"
//           aria-label="Close"
//         >
//           <FiX />
//         </button>
//       </div>
//     </div>
//   );
// }

// /* -------------------------------- Component --------------------------------- */
// export default function ChatBot({ askApi = ASK_API }) {
//   const [collapsed, setCollapsed] = useState(
//     () => localStorage.getItem(UI_KEY) === "1"
//   );
//   const [messages, setMessages] = useState(() => [
//     {
//       id: "welcome",
//       role: "ai",
//       text: "🤖 Hi! How may I help you today?",
//       time: Date.now(),
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState("");
//   const [activeModel, setActiveModel] = useState(null); // from /api/ai/model-info or /ai/ask response

//   const listRef = useRef(null);
//   const sid = useMemo(() => ensureSessionId(), []);

//   useEffect(() => {
//     const el = listRef.current;
//     if (el) el.scrollTop = el.scrollHeight;
//   }, [messages, collapsed]);

//   // Initial fetch of model info (for the header badge)
//   useEffect(() => {
//     (async () => {
//       try {
//         const r = await axios.get(MODEL_INFO_API);
//         if (r?.data?.ok) setActiveModel(r.data.active || null);
//       } catch {
//         /* non-blocking */
//       }
//     })();
//   }, []);

//   const toggleCollapsed = () => {
//     const next = !collapsed;
//     setCollapsed(next);
//     localStorage.setItem(UI_KEY, next ? "1" : "0");
//   };

//   const headers = useMemo(() => {
//     const h = { "X-Session-Id": sid, "X-Channel": "widget" };
//     const auth = getAuthorizationHeader?.();
//     if (auth?.Authorization) h["Authorization"] = auth.Authorization;
//     return h;
//   }, [sid]);

//   // unified sender so we can call it from suggestions too
//   async function sendQuestion(question) {
//     if (!question || busy) return;

//     setError("");
//     setBusy(true);

//     const userMsg = {
//       id: "u_" + cryptoRandomId(8),
//       role: "user",
//       text: question,
//       time: Date.now(),
//     };
//     setMessages((m) => [...m, userMsg]);

//     let interactionId = null;
//     try {
//       const startPayload = {
//         questionText: question,
//         questionLanguage: "en",
//         questionContentType: "text",
//         pageUrl: window.location.href,
//         referrer: document.referrer,
//         pathname: window.location.pathname,
//         locale: navigator.language || "en-IN",
//         appVersion: "web@widget",
//       };
//       const startRes = await axios.post(
//         `${CHAT_BASE}/start-interaction`,
//         startPayload,
//         { headers }
//       );
//       interactionId = startRes?.data?.data?._id;
//     } catch (e) {
//       console.warn("start-interaction failed:", e?.response?.data || e.message);
//     }

//     let aiText = "";
//     let aiMeta = { source: "", confidence: undefined, suggestions: [] };

//     try {
//       const aiRes = await axios.post(askApi, { question }, { headers });
//       const aiData = aiRes?.data || {};
//       aiText = aiData.answer || aiData.data?.answer || aiData.message || "";
//       aiMeta = {
//         source: aiData.source || "",
//         confidence: aiData.confidence,
//         suggestions: Array.isArray(aiData.suggestions)
//           ? aiData.suggestions
//           : [],
//       };
//       if (aiData?.active) setActiveModel(aiData.active);
//     } catch (e) {
//       aiText = "";
//       setError(
//         e?.response?.data?.message ||
//           e?.response?.data?.error ||
//           "Sorry, I'm having trouble responding right now."
//       );
//     }

//     // persist interaction
//     try {
//       const payloadCommon = {
//         responseText: aiText || "No response from model.",
//         responseStatus: aiText ? "good" : "no_response",
//         model: aiMeta.source || "your-model",
//         modelVersion: "v1",
//       };

//       if (interactionId) {
//         await axios.post(
//           `${CHAT_BASE}/attach-response/${interactionId}`,
//           payloadCommon,
//           { headers }
//         );
//       } else {
//         await axios.post(
//           `${CHAT_BASE}/log-interaction`,
//           {
//             questionText: question,
//             ...payloadCommon,
//             pageUrl: window.location.href,
//             pathname: window.location.pathname,
//           },
//           { headers }
//         );
//       }
//     } catch (e) {
//       console.warn("attach/log failed:", e?.response?.data || e.message);
//     }

//     const aiMsg = {
//       id: "a_" + cryptoRandomId(8),
//       role: "ai",
//       text: aiText || "🙂 I couldn't reach the AI service. Please try again.",
//       time: Date.now(),
//       interactionId: interactionId || null,
//       source: aiMeta.source,
//       confidence: aiMeta.confidence,
//       suggestions: aiMeta.suggestions,
//     };
//     setMessages((m) => [...m, aiMsg]);
//     setBusy(false);
//   }

//   async function handleSend() {
//     const question = (input || "").trim();
//     setInput("");
//     await sendQuestion(question);
//   }

//   async function rate(interactionId, thumb) {
//     if (!interactionId) return;
//     try {
//       const rating = thumb === "up" ? 5 : 1;
//       await axios.post(
//         `${CHAT_BASE}/rate-interaction/${interactionId}`,
//         { rating, thumb },
//         { headers }
//       );
//     } catch (e) {
//       console.warn("rate failed:", e?.response?.data || e.message);
//     }
//   }

//   function onKeyDown(e) {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   }

//   function askSuggestionNow(qText) {
//     if (!qText) return;
//     // Send immediately as a new turn
//     sendQuestion(qText);
//   }

//   return (
//     <>
//       {collapsed ? (
//         <button
//           onClick={toggleCollapsed}
//           className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
//           aria-label="Open chat"
//           title="Chat with us"
//         >
//           <FiMessageSquare className="w-6 h-6" />
//         </button>
//       ) : null}

//       {!collapsed && (
//         <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
//           <Header
//             active={activeModel}
//             onClose={toggleCollapsed}
//             onMinimize={() => {
//               setCollapsed(true);
//               localStorage.setItem(UI_KEY, "1");
//             }}
//           />

//           <div ref={listRef} className="flex-1 overflow-y-auto p-3 bg-white">
//             {messages.map((m) => (
//               <div key={m.id}>
//                 <Bubble role={m.role} text={m.text} time={m.time} />

//                 {/* AI meta row (source / confidence) */}
//                 {m.role === "ai" &&
//                   (m.source || typeof m.confidence === "number") && (
//                     <div className="ml-10 -mt-2 mb-2 text-[10px] text-gray-500 flex items-center gap-2">
//                       {m.source ? <span>source: {m.source}</span> : null}
//                       {typeof m.confidence === "number" ? (
//                         <span>
//                           confidence: {(m.confidence * 100).toFixed(0)}%
//                         </span>
//                       ) : null}
//                     </div>
//                   )}

//                 {/* Suggestion chips (shown when backend returns them on low confidence) */}
//                 {m.role === "ai" &&
//                   Array.isArray(m.suggestions) &&
//                   m.suggestions.length > 0 && (
//                     <div className="flex flex-wrap gap-2 ml-10 mb-2">
//                       {m.suggestions.map((sug, idx) => (
//                         <button
//                           key={idx}
//                           onClick={() => askSuggestionNow(sug.question)}
//                           className="px-2 py-1 text-xs rounded-full border hover:bg-gray-50"
//                           title={
//                             typeof sug.score === "number"
//                               ? `Similarity: ${(sug.score * 100).toFixed(0)}%`
//                               : "Related question"
//                           }
//                         >
//                           {sug.question}
//                         </button>
//                       ))}
//                     </div>
//                   )}

//                 {/* Rating buttons (kept from your original) */}
//                 {m.role === "ai" && m.interactionId && (
//                   <div className="flex gap-2 ml-10 mb-2">
//                     <button
//                       onClick={() => rate(m.interactionId, "up")}
//                       className="px-2 py-1 text-xs rounded border hover:bg-gray-50 flex items-center gap-1"
//                       title="Helpful"
//                     >
//                       <FiThumbsUp /> Helpful
//                     </button>
//                     <button
//                       onClick={() => rate(m.interactionId, "down")}
//                       className="px-2 py-1 text-xs rounded border hover:bg-gray-50 flex items-center gap-1"
//                       title="Not helpful"
//                     >
//                       <FiThumbsDown /> Not helpful
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {busy && (
//               <div className="flex items-center gap-2 text-sm text-gray-500 pl-2">
//                 <FiLoader className="animate-spin" /> thinking…
//               </div>
//             )}
//             {error && (
//               <div className="mt-2 text-xs text-red-600 px-2">{error}</div>
//             )}
//           </div>

//           <div className="border-t p-3">
//             <div className="flex items-end gap-2">
//               <textarea
//                 className="flex-1 resize-none rounded-xl border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
//                 rows={2}
//                 placeholder="Type your question… (Shift+Enter for newline)"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={onKeyDown}
//                 disabled={busy}
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={busy || !input.trim()}
//                 className={`rounded-xl px-3 py-2 text-sm flex items-center gap-2 ${
//                   busy || !input.trim()
//                     ? "bg-gray-200 text-gray-500"
//                     : "bg-indigo-600 text-white hover:bg-indigo-700"
//                 }`}
//               >
//                 <FiSend /> Send
//               </button>
//             </div>
//             <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
//               <FiMaximize2 className="w-3 h-3" />
//               Press Enter to send • Shift+Enter for newline
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// without voice

// with voice

// src/components/chatbot/ChatBot.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  FiMessageSquare,
  FiSend,
  FiX,
  FiMinus,
  FiMaximize2,
  FiThumbsUp,
  FiThumbsDown,
  FiLoader,
  FiCpu,
  FiUser,
  FiMic,
  FiMicOff,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";

import globalBackendRoute from "../../config/Config";
import { getAuthorizationHeader } from "../auth_components/AuthManager";

const API = globalBackendRoute;
const CHAT_BASE = `${API}/api/chat-interactions`;
const ASK_API = `${API}/api/ai/ask`;
const MODEL_INFO_API = `${API}/api/ai/model-info`;

const SID_KEY = "chat_widget_sid_v1";
const UI_KEY = "chat_widget_collapsed_v1";
const SPEECH_KEY = "chat_widget_speech_enabled_v1";

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

function getSpeechRecognitionCtor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function getVoicesSafe() {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices() || [];
}

function Bubble({ role, text, time }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-start gap-2 ${
        isUser ? "justify-end" : "justify-start"
      } mb-3`}
    >
      {!isUser && (
        <div className="mt-1 shrink-0 rounded-full p-2 bg-indigo-100">
          <FiCpu className="w-4 h-4 text-indigo-600" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow ${
          isUser ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{text}</div>
        {time && (
          <div
            className={`text-[10px] mt-1 ${
              isUser ? "text-indigo-100/80" : "text-gray-500"
            }`}
          >
            {new Date(time).toLocaleTimeString()}
          </div>
        )}
      </div>

      {isUser && (
        <div className="mt-1 shrink-0 rounded-full p-2 bg-indigo-100">
          <FiUser className="w-4 h-4 text-indigo-600" />
        </div>
      )}
    </div>
  );
}

function ActiveBadge({ active }) {
  if (!active) return null;

  const type = active.type;
  let label = "model: base";

  if (type === "adapter") {
    const ap =
      active.adapter_path || active.adapterPath || active.adapter || "";
    const name = ap ? ap.split(/[\\/]/).pop() : "adapter";
    label = `adapter: ${name}`;
  } else if (type === "full") {
    label = "model: base";
  } else if (type === "multi") {
    label = `multi: ${active.active_adapter || "auto"}`;
  }

  return (
    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
      {label}
    </span>
  );
}

function Header({
  onClose,
  onMinimize,
  active,
  speechEnabled,
  setSpeechEnabled,
  ttsSupported,
}) {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center gap-2 min-w-0">
        <div className="rounded-full p-2 bg-indigo-600 text-white">
          <FiMessageSquare className="w-4 h-4" />
        </div>

        <div className="font-medium">Assistant</div>
        <div className="ml-2 text-xs text-gray-500 truncate">
          How may I help you today?
        </div>
        <ActiveBadge active={active} />
      </div>

      <div className="flex items-center gap-2">
        {ttsSupported && (
          <button
            onClick={() => setSpeechEnabled((s) => !s)}
            className="p-2 rounded hover:bg-gray-100"
            title={speechEnabled ? "Voice answers on" : "Voice answers off"}
            aria-label="Toggle voice answers"
          >
            {speechEnabled ? <FiVolume2 /> : <FiVolumeX />}
          </button>
        )}

        <button
          onClick={onMinimize}
          className="p-2 rounded hover:bg-gray-100"
          title="Minimize"
          aria-label="Minimize"
        >
          <FiMinus />
        </button>

        <button
          onClick={onClose}
          className="p-2 rounded hover:bg-gray-100"
          title="Close"
          aria-label="Close"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
}

export default function ChatBot({ askApi = ASK_API }) {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(UI_KEY) === "1",
  );

  const [messages, setMessages] = useState(() => [
    {
      id: "welcome",
      role: "ai",
      text: "🤖 Hi! How may I help you today?",
      time: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [activeModel, setActiveModel] = useState(null);

  const [speechEnabled, setSpeechEnabled] = useState(() => {
    const saved = localStorage.getItem(SPEECH_KEY);
    return saved == null ? true : saved === "1";
  });

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  const listRef = useRef(null);
  const sid = useMemo(() => ensureSessionId(), []);
  const recognitionRef = useRef(null);
  const lastSpokenMessageIdRef = useRef(null);
  const userHasInteractedRef = useRef(false);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, collapsed, isListening]);

  useEffect(() => {
    const RecognitionCtor = getSpeechRecognitionCtor();
    setSpeechSupported(!!RecognitionCtor);
    setTtsSupported(
      typeof window !== "undefined" &&
        !!window.speechSynthesis &&
        !!window.SpeechSynthesisUtterance,
    );

    const loadVoices = () => {
      try {
        getVoicesSafe();
      } catch {}
    };

    if (typeof window !== "undefined" && window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
      try {
        window.speechSynthesis?.cancel?.();
      } catch {}
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(SPEECH_KEY, speechEnabled ? "1" : "0");
    if (!speechEnabled) {
      try {
        window.speechSynthesis?.cancel?.();
      } catch {}
    }
  }, [speechEnabled]);

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(MODEL_INFO_API);
        if (r?.data?.ok) setActiveModel(r.data.active || null);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last) return;
    if (last.role !== "ai") return;
    if (!speechEnabled || !ttsSupported) return;
    if (!userHasInteractedRef.current) return;
    if (last.id === "welcome") return;
    if (lastSpokenMessageIdRef.current === last.id) return;

    speakText(last.text);
    lastSpokenMessageIdRef.current = last.id;
  }, [messages, speechEnabled, ttsSupported]);

  const headers = useMemo(() => {
    const h = { "X-Session-Id": sid, "X-Channel": "widget" };
    const auth = getAuthorizationHeader?.();
    if (auth?.Authorization) h["Authorization"] = auth.Authorization;
    return h;
  }, [sid]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(UI_KEY, next ? "1" : "0");
  };

  function speakText(text) {
    if (!text || !speechEnabled || !ttsSupported) return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = navigator.language || "en-IN";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = getVoicesSafe();
      if (voices.length > 0) {
        const preferred =
          voices.find((v) => /en[-_]?in/i.test(v.lang)) ||
          voices.find((v) => /en/i.test(v.lang)) ||
          voices[0];
        if (preferred) utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis failed:", e);
    }
  }

  function stopSpeaking() {
    try {
      window.speechSynthesis?.cancel?.();
    } catch {}
  }

  function startListening() {
    const RecognitionCtor = getSpeechRecognitionCtor();
    if (!RecognitionCtor) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    try {
      stopSpeaking();
      setError("");
      setLiveTranscript("");

      const recognition = new RecognitionCtor();
      recognition.lang = navigator.language || "en-IN";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        userHasInteractedRef.current = true;
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalText = "";
        let interimText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0]?.transcript || "";
          if (event.results[i].isFinal) finalText += transcript;
          else interimText += transcript;
        }

        const merged = (finalText || interimText).trim();
        setLiveTranscript(merged);
        setInput(merged);

        if (finalText.trim()) {
          setTimeout(() => {
            sendQuestion(finalText.trim());
          }, 150);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event?.error !== "aborted") {
          setError(`Voice input failed: ${event?.error || "unknown error"}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition start failed:", e);
      setError("Unable to start voice input.");
      setIsListening(false);
    }
  }

  function stopListening() {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setIsListening(false);
  }

  async function sendQuestion(question) {
    if (!question || busy) return;

    userHasInteractedRef.current = true;
    setError("");
    setBusy(true);
    stopSpeaking();

    const userMsg = {
      id: "u_" + cryptoRandomId(8),
      role: "user",
      text: question,
      time: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setLiveTranscript("");

    let interactionId = null;

    try {
      const startPayload = {
        questionText: question,
        questionLanguage: "en",
        questionContentType: "text",
        pageUrl: window.location.href,
        referrer: document.referrer,
        pathname: window.location.pathname,
        locale: navigator.language || "en-IN",
        appVersion: "web@widget",
      };

      const startRes = await axios.post(
        `${CHAT_BASE}/start-interaction`,
        startPayload,
        { headers },
      );

      interactionId = startRes?.data?.data?._id;
    } catch (e) {
      console.warn("start-interaction failed:", e?.response?.data || e.message);
    }

    let aiText = "";
    let aiMeta = { source: "", confidence: undefined, suggestions: [] };

    try {
      const aiRes = await axios.post(askApi, { question }, { headers });
      const aiData = aiRes?.data || {};

      aiText = aiData.answer || aiData.data?.answer || aiData.message || "";
      aiMeta = {
        source: aiData.source || "",
        confidence: aiData.confidence,
        suggestions: Array.isArray(aiData.suggestions)
          ? aiData.suggestions
          : [],
      };

      if (aiData?.active) setActiveModel(aiData.active);
    } catch (e) {
      aiText = "";
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Sorry, I'm having trouble responding right now.",
      );
    }

    try {
      const payloadCommon = {
        responseText: aiText || "No response from model.",
        responseStatus: aiText ? "good" : "no_response",
        model: aiMeta.source || "your-model",
        modelVersion: "v1",
      };

      if (interactionId) {
        await axios.post(
          `${CHAT_BASE}/attach-response/${interactionId}`,
          payloadCommon,
          { headers },
        );
      } else {
        await axios.post(
          `${CHAT_BASE}/log-interaction`,
          {
            questionText: question,
            ...payloadCommon,
            pageUrl: window.location.href,
            pathname: window.location.pathname,
          },
          { headers },
        );
      }
    } catch (e) {
      console.warn("attach/log failed:", e?.response?.data || e.message);
    }

    const aiMsg = {
      id: "a_" + cryptoRandomId(8),
      role: "ai",
      text: aiText || "🙂 I couldn't reach the AI service. Please try again.",
      time: Date.now(),
      interactionId: interactionId || null,
      source: aiMeta.source,
      confidence: aiMeta.confidence,
      suggestions: aiMeta.suggestions,
    };

    setMessages((m) => [...m, aiMsg]);
    setBusy(false);
  }

  async function handleSend() {
    const question = (input || "").trim();
    setInput("");
    await sendQuestion(question);
  }

  async function rate(interactionId, thumb) {
    if (!interactionId) return;
    try {
      const rating = thumb === "up" ? 5 : 1;
      await axios.post(
        `${CHAT_BASE}/rate-interaction/${interactionId}`,
        { rating, thumb },
        { headers },
      );
    } catch (e) {
      console.warn("rate failed:", e?.response?.data || e.message);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function askSuggestionNow(qText) {
    if (!qText) return;
    sendQuestion(qText);
  }

  return (
    <>
      {collapsed ? (
        <button
          onClick={toggleCollapsed}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white p-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Open chat"
          title="Chat with us"
        >
          <FiMessageSquare className="w-6 h-6" />
        </button>
      ) : null}

      {!collapsed && (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
          <Header
            active={activeModel}
            speechEnabled={speechEnabled}
            setSpeechEnabled={setSpeechEnabled}
            ttsSupported={ttsSupported}
            onClose={toggleCollapsed}
            onMinimize={() => {
              setCollapsed(true);
              localStorage.setItem(UI_KEY, "1");
            }}
          />

          <div ref={listRef} className="flex-1 overflow-y-auto p-3 bg-white">
            {messages.map((m) => (
              <div key={m.id}>
                <Bubble role={m.role} text={m.text} time={m.time} />

                {m.role === "ai" &&
                  (m.source || typeof m.confidence === "number") && (
                    <div className="ml-10 -mt-2 mb-2 text-[10px] text-gray-500 flex items-center gap-2">
                      {m.source ? <span>source: {m.source}</span> : null}
                      {typeof m.confidence === "number" ? (
                        <span>
                          confidence: {(m.confidence * 100).toFixed(0)}%
                        </span>
                      ) : null}
                    </div>
                  )}

                {m.role === "ai" &&
                  Array.isArray(m.suggestions) &&
                  m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-10 mb-2">
                      {m.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => askSuggestionNow(sug.question)}
                          className="px-2 py-1 text-xs rounded-full border hover:bg-gray-50"
                          title={
                            typeof sug.score === "number"
                              ? `Similarity: ${(sug.score * 100).toFixed(0)}%`
                              : "Related question"
                          }
                        >
                          {sug.question}
                        </button>
                      ))}
                    </div>
                  )}

                {m.role === "ai" && m.interactionId && (
                  <div className="flex gap-2 ml-10 mb-2">
                    <button
                      onClick={() => rate(m.interactionId, "up")}
                      className="px-2 py-1 text-xs rounded border hover:bg-gray-50 flex items-center gap-1"
                      title="Helpful"
                    >
                      <FiThumbsUp /> Helpful
                    </button>
                    <button
                      onClick={() => rate(m.interactionId, "down")}
                      className="px-2 py-1 text-xs rounded border hover:bg-gray-50 flex items-center gap-1"
                      title="Not helpful"
                    >
                      <FiThumbsDown /> Not helpful
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isListening && (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 mb-3">
                <div className="flex items-center gap-2 font-medium">
                  <FiMic className="animate-pulse" />
                  Listening...
                </div>
                {liveTranscript ? (
                  <div className="mt-1 text-indigo-800">{liveTranscript}</div>
                ) : (
                  <div className="mt-1 text-indigo-600">
                    Speak your question now.
                  </div>
                )}
              </div>
            )}

            {busy && (
              <div className="flex items-center gap-2 text-sm text-gray-500 pl-2">
                <FiLoader className="animate-spin" /> thinking…
              </div>
            )}

            {error && (
              <div className="mt-2 text-xs text-red-600 px-2">{error}</div>
            )}
          </div>

          <div className="border-t p-3">
            <div className="flex items-end gap-2">
              {speechSupported && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={busy}
                  className={`rounded-xl px-3 py-2 text-sm flex items-center gap-2 border ${
                    isListening
                      ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                  title={isListening ? "Stop listening" : "Speak your question"}
                >
                  {isListening ? <FiMicOff /> : <FiMic />}
                </button>
              )}

              <textarea
                className="flex-1 resize-none rounded-xl border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                rows={2}
                placeholder="Type your question… (Shift+Enter for newline)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={busy}
              />

              {ttsSupported && (
                <button
                  onClick={() => {
                    if (speechEnabled) {
                      stopSpeaking();
                      setSpeechEnabled(false);
                    } else {
                      setSpeechEnabled(true);
                    }
                  }}
                  className={`rounded-xl px-3 py-2 text-sm flex items-center gap-2 border ${
                    speechEnabled
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                  title={
                    speechEnabled
                      ? "Mute voice answers"
                      : "Enable voice answers"
                  }
                >
                  {speechEnabled ? <FiVolume2 /> : <FiVolumeX />}
                </button>
              )}

              <button
                onClick={handleSend}
                disabled={busy || !input.trim()}
                className={`rounded-xl px-3 py-2 text-sm flex items-center gap-2 ${
                  busy || !input.trim()
                    ? "bg-gray-200 text-gray-500"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <FiSend /> Send
              </button>
            </div>

            <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
              <FiMaximize2 className="w-3 h-3" />
              {speechSupported
                ? "Use the mic for voice input • Press Enter to send • Shift+Enter for newline"
                : "Voice input not supported in this browser • Press Enter to send • Shift+Enter for newline"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
