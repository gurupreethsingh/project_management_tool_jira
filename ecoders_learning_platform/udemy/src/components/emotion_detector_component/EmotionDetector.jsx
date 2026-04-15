import React, { useState } from "react";
import {
  FiCamera,
  FiCameraOff,
  FiChevronLeft,
  FiMinus,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";

const STREAM_BASE_URL = "http://localhost:5000";

export default function EmotionDetector() {
  const [collapsed, setCollapsed] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [streamKey, setStreamKey] = useState(Date.now());

  const openWidget = () => {
    setCollapsed(false);
  };

  const closeWidget = () => {
    setCollapsed(true);
    setCameraEnabled(false);
  };

  const minimizeWidget = () => {
    setCollapsed(true);
  };

  const toggleCamera = () => {
    if (cameraEnabled) {
      setCameraEnabled(false);
      return;
    }

    setStreamKey(Date.now());
    setCameraEnabled(true);
  };

  const refreshStream = () => {
    setStreamKey(Date.now());
  };

  const streamUrl = `${STREAM_BASE_URL}/start-webcam?ts=${streamKey}`;

  if (collapsed) {
    return (
      <button
        onClick={openWidget}
        className="fixed left-4 bottom-24 md:left-6 md:bottom-28 z-50 rounded-full shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white p-4 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        aria-label="Open emotion detector"
        title="Open emotion detector"
      >
        <FiCamera className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed left-4 bottom-24 md:left-6 md:bottom-28 z-50 w-[92vw] max-w-sm bg-white rounded-2xl shadow-2xl border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="flex items-center gap-2 min-w-0">
          <div className="rounded-full bg-white/20 p-2">
            <FiCamera className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-sm">Emotion Detector</p>
            <p className="text-[11px] text-white/80 truncate">
              Live webcam emotion recognition
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={minimizeWidget}
            className="p-2 rounded-lg hover:bg-white/10"
            title="Minimize"
            aria-label="Minimize"
          >
            <FiMinus />
          </button>

          <button
            onClick={closeWidget}
            className="p-2 rounded-lg hover:bg-white/10"
            title="Close"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>
      </div>

      <div className="p-3 bg-slate-50">
        <div className="mb-3">
          <span className="text-xs text-emerald-700 font-medium">
            Connected to Flask webcam stream
          </span>
        </div>

        <div className="rounded-2xl overflow-hidden border bg-black aspect-[4/3] flex items-center justify-center">
          {cameraEnabled ? (
            <img
              key={streamKey}
              src={streamUrl}
              alt="Emotion detector stream"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center px-4">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                <FiCameraOff className="w-6 h-6" />
              </div>

              <p className="text-white text-sm font-medium">
                Camera is currently off
              </p>

              <p className="text-white/70 text-xs mt-1">
                Click Start Camera to begin live emotion detection
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={toggleCamera}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              cameraEnabled
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {cameraEnabled ? "Stop Camera" : "Start Camera"}
          </button>

          <button
            onClick={refreshStream}
            disabled={!cameraEnabled}
            className={`rounded-xl px-3 py-2.5 border text-sm ${
              cameraEnabled
                ? "bg-white hover:bg-slate-100 text-slate-700"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
            title="Refresh stream"
            aria-label="Refresh stream"
          >
            <FiRefreshCw />
          </button>

          <button
            onClick={minimizeWidget}
            className="rounded-xl px-3 py-2.5 border bg-white hover:bg-slate-100 text-slate-700"
            title="Minimize"
            aria-label="Minimize widget"
          >
            <FiChevronLeft />
          </button>
        </div>

        <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
          This widget uses your Flask emotion detection stream and shows the
          processed webcam feed directly inside your MERN application.
        </p>
      </div>
    </div>
  );
}
