// AllAlerts.jsx (FULL FILE — ECODERS style, responsive, fast, Selenium-practice ready)
// ✅ Includes: JS alerts, confirm, prompt, beforeunload, on-page modal, auth basic (opens new tab),
// file chooser, notifications permission, geolocation permission, clipboard permission,
// print dialog, fullscreen permission, popups, window.open/tab handling, multiple windows,
// and a tiny “dynamic text” + “delayed alert” for wait practice.

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle,
  FaQuestionCircle,
  FaKeyboard,
  FaClock,
  FaWindowRestore,
  FaLock,
  FaLink,
  FaFileUpload,
  FaMapMarkerAlt,
  FaClipboard,
  FaExpand,
  FaPrint,
  FaTimes,
  FaInfoCircle,
  FaRocket,
} from "react-icons/fa";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function Badge({ children }) {
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-slate-200 bg-white text-slate-700">
      {children}
    </span>
  );
}

function SmallButton({ icon: Icon, label, onClick, tone = "dark", disabled }) {
  const toneClass =
    tone === "dark"
      ? "bg-slate-900 text-white hover:shadow-lg hover:-translate-y-0.5"
      : tone === "soft"
        ? "border border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
        : tone === "warn"
          ? "border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700"
          : "border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700";

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${toneClass}`}
    >
      {Icon ? <Icon className="text-sm" /> : null}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function Card({
  icon: Icon,
  title,
  desc,
  children,
  toneClass = "text-slate-900",
}) {
  return (
    <div className="group border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:scale-105 transition-all">
          <Icon className={`text-lg ${toneClass}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{desc}</p>
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AllAlerts() {
  const [lastAction, setLastAction] = useState("None");
  const [confirmResult, setConfirmResult] = useState(null);
  const [promptResult, setPromptResult] = useState(null);
  const [dynamicText, setDynamicText] = useState("Waiting...");
  const [toast, setToast] = useState(null);

  // On-page modal (not browser alert, but common in apps)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState("");

  // File chooser (native OS dialog)
  const fileRef = useRef(null);

  // Dynamic + delayed alert for explicit wait practice
  const [delaySec, setDelaySec] = useState(3);

  const showToast = (type, text) => {
    setToast({ type, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    // tiny dynamic text update demo for Selenium waits
    const t = window.setInterval(() => {
      setDynamicText((prev) =>
        prev === "Waiting..." ? "Ready ✅" : "Waiting...",
      );
    }, 2500);
    return () => window.clearInterval(t);
  }, []);

  // beforeunload: you can't "force" it reliably programmatically; it triggers on refresh/close/navigation
  // We'll register/unregister handler when user toggles it.
  const [beforeUnloadOn, setBeforeUnloadOn] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      // Chrome ignores custom text and uses default
      e.returnValue = "";
      return "";
    };
    if (beforeUnloadOn) window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [beforeUnloadOn]);

  const actions = useMemo(
    () => ({
      simpleAlert: () => {
        setLastAction("JS Alert fired");
        alert(
          "This is a JavaScript alert.\n\nSelenium: driver.switchTo().alert().accept()",
        );
      },

      confirmAlert: () => {
        setLastAction("JS Confirm fired");
        const ok = confirm(
          "This is a JavaScript confirm.\n\nSelenium: switchTo().alert().accept() / dismiss()",
        );
        setConfirmResult(ok ? "Accepted (OK)" : "Dismissed (Cancel)");
        showToast(
          "info",
          ok ? "Confirm: OK clicked" : "Confirm: Cancel clicked",
        );
      },

      promptAlert: () => {
        setLastAction("JS Prompt fired");
        const v = prompt(
          "This is a JavaScript prompt.\n\nSelenium: alert.sendKeys('text'); alert.accept()",
          "type here...",
        );
        setPromptResult(v === null ? "(Cancelled)" : v);
        showToast("info", v === null ? "Prompt cancelled" : "Prompt submitted");
      },

      delayedAlert: async () => {
        setLastAction(`Delayed alert scheduled (${delaySec}s)`);
        showToast("info", `Alert will appear in ${delaySec}s`);
        await sleep(Math.max(1, Number(delaySec) || 1) * 1000);
        alert(`Delayed JavaScript alert after ${delaySec}s`);
      },

      chainedAlerts: () => {
        setLastAction("Chained alerts fired");
        alert("Alert #1");
        alert("Alert #2");
        alert("Alert #3");
      },

      openPopupWindow: () => {
        setLastAction("Popup window opened");
        const w = window.open(
          "",
          "_blank",
          "noopener,noreferrer,width=520,height=420",
        );
        if (!w) {
          showToast(
            "warn",
            "Popup blocked by browser. Allow popups to practice this.",
          );
          return;
        }
        w.document.write(`
          <html>
            <head><title>Popup Window</title></head>
            <body style="font-family: Arial; padding: 18px;">
              <h3>Popup Window</h3>
              <p>This window is opened via <code>window.open()</code>.</p>
              <button onclick="alert('Alert inside popup!')">Trigger Alert</button>
              <p style="margin-top:12px;color:#555">Selenium: switchTo().window(handle)</p>
            </body>
          </html>
        `);
        w.document.close();
      },

      openAuthTab: () => {
        setLastAction("Auth (Basic) tab opened");
        // This demonstrates Basic Auth dialog. Some browsers block embedding credentials.
        // Use a safe demo URL. If it doesn't show auth dialog due to browser policy, it's still useful for Selenium handling.
        window.open(
          "https://httpbin.org/basic-auth/user/passwd",
          "_blank",
          "noopener,noreferrer",
        );
        showToast(
          "info",
          "Opened Basic Auth demo in new tab (may show auth dialog)",
        );
      },

      openFileChooser: () => {
        setLastAction("File chooser opened");
        if (fileRef.current) fileRef.current.click();
      },

      requestNotifications: async () => {
        setLastAction("Notifications permission requested");
        if (!("Notification" in window)) {
          showToast("warn", "Notifications API not supported in this browser.");
          return;
        }
        const perm = await Notification.requestPermission();
        showToast("info", `Notification permission: ${perm}`);
        if (perm === "granted") {
          new Notification("ECODERS Alert Practice", {
            body: "This is a Notification API popup (not JS alert).",
          });
        }
      },

      requestGeo: () => {
        setLastAction("Geolocation permission requested");
        if (!navigator.geolocation) {
          showToast("warn", "Geolocation not supported.");
          return;
        }
        navigator.geolocation.getCurrentPosition(
          () => showToast("info", "Geolocation granted (position received)."),
          (err) =>
            showToast("warn", `Geolocation denied/failed: ${err.message}`),
        );
      },

      requestClipboardRead: async () => {
        setLastAction("Clipboard read permission attempted");
        try {
          if (!navigator.clipboard) {
            showToast("warn", "Clipboard API not available.");
            return;
          }
          const txt = await navigator.clipboard.readText();
          showToast(
            "info",
            `Clipboard read: ${txt ? txt.slice(0, 40) : "(empty)"}`,
          );
        } catch (e) {
          showToast(
            "warn",
            "Clipboard read blocked. Try in HTTPS + user gesture.",
          );
        }
      },

      requestClipboardWrite: async () => {
        setLastAction("Clipboard write attempted");
        try {
          if (!navigator.clipboard) {
            showToast("warn", "Clipboard API not available.");
            return;
          }
          await navigator.clipboard.writeText("ECODERS Clipboard Test ✅");
          showToast("info", "Clipboard write successful.");
        } catch (e) {
          showToast(
            "warn",
            "Clipboard write blocked. Try in HTTPS + user gesture.",
          );
        }
      },

      printDialog: () => {
        setLastAction("Print dialog triggered");
        window.print();
      },

      requestFullscreen: async () => {
        setLastAction("Fullscreen requested");
        const el = document.documentElement;
        try {
          if (el.requestFullscreen) await el.requestFullscreen();
          showToast("info", "Entered fullscreen. Press ESC to exit.");
        } catch {
          showToast("warn", "Fullscreen blocked.");
        }
      },

      exitFullscreen: async () => {
        setLastAction("Exit fullscreen");
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
        } catch {}
      },

      openOnPageModal: () => {
        setLastAction("On-page modal opened (app alert)");
        setModalInput("");
        setModalOpen(true);
      },
    }),
    [delaySec],
  );

  const onFilePicked = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLastAction(`File selected: ${f.name}`);
    showToast("info", `Selected: ${f.name}`);
    // reset value so selecting same file again triggers change
    e.target.value = "";
  };

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse rounded-full" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {["SELENIUM", "ALERTS", "POPUPS", "PERMISSIONS"].map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 text-[11px] font-medium rounded-full bg-slate-900 text-white"
                >
                  {item}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
              Selenium Practice Lab
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                All Browser Alerts & Popups
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              Trigger different alert types that you commonly automate in
              Selenium: JavaScript alerts, confirms, prompts, delayed alerts,
              popups/new windows, file chooser, browser permission dialogs,
              print/fullscreen, and app-style modals.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                Last action: <span className="font-semibold">{lastAction}</span>
              </Badge>
              <Badge>
                Dynamic text:{" "}
                <span className="font-semibold">{dynamicText}</span>
              </Badge>
              <Badge>
                Confirm result:{" "}
                <span className="font-semibold">{confirmResult ?? "-"}</span>
              </Badge>
              <Badge>
                Prompt value:{" "}
                <span className="font-semibold">{promptResult ?? "-"}</span>
              </Badge>
            </div>
          </div>

          {/* TOOLS PANEL */}
          <div className="mt-7 rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm font-semibold text-slate-900">
                  Quick Triggers
                  <span className="block text-[11px] font-medium text-slate-500 mt-0.5">
                    Use these for fast Selenium runs
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaExclamationTriangle}
                  label="JS Alert"
                  onClick={actions.simpleAlert}
                />
                <SmallButton
                  icon={FaQuestionCircle}
                  label="Confirm"
                  onClick={actions.confirmAlert}
                  tone="soft"
                />
                <SmallButton
                  icon={FaKeyboard}
                  label="Prompt"
                  onClick={actions.promptAlert}
                  tone="soft"
                />
                <SmallButton
                  icon={FaClock}
                  label="Delayed Alert"
                  onClick={actions.delayedAlert}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-700">
                  Delayed Alert Seconds
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={delaySec}
                    onChange={(e) => setDelaySec(e.target.value)}
                    className="w-28 px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />
                  <div className="text-xs text-slate-500">
                    Try explicit waits
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-700">
                  beforeunload (Leave/Refresh)
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setBeforeUnloadOn((p) => !p);
                      showToast(
                        "info",
                        `beforeunload: ${!beforeUnloadOn ? "ON" : "OFF"}`,
                      );
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                      beforeUnloadOn
                        ? "border-amber-200 bg-amber-50 text-amber-800"
                        : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {beforeUnloadOn ? "Enabled" : "Disabled"}
                  </button>
                  <div className="text-xs text-slate-500">
                    Refresh/back/close to see browser dialog
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-700">
                  Hidden File Input
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <SmallButton
                    icon={FaFileUpload}
                    label="Open File Chooser"
                    onClick={actions.openFileChooser}
                    tone="soft"
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    onChange={onFilePicked}
                    className="hidden"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Selenium usually does <code>sendKeys(filePath)</code> on file
                  input.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID OF ALERT TYPES */}
      <section className="py-10 sm:py-14 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900">
              Alert Types You Can Automate
            </h2>
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
              <FaInfoCircle />
              Click any card to trigger the alert/popup
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {/* JS Alert */}
            <Card
              icon={FaExclamationTriangle}
              title="JavaScript Alert()"
              desc="Classic browser alert dialog. Accept only."
              toneClass="text-rose-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaExclamationTriangle}
                  label="Trigger alert()"
                  onClick={actions.simpleAlert}
                />
                <SmallButton
                  icon={FaClock}
                  label="Trigger delayed"
                  onClick={actions.delayedAlert}
                  tone="soft"
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Practice: switchTo().alert().accept()
              </div>
            </Card>

            {/* Confirm */}
            <Card
              icon={FaQuestionCircle}
              title="JavaScript Confirm()"
              desc="OK / Cancel confirmation alert."
              toneClass="text-amber-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaQuestionCircle}
                  label="Trigger confirm()"
                  onClick={actions.confirmAlert}
                />
                <SmallButton
                  icon={FaCheckCircle}
                  label="Show result badge"
                  onClick={() =>
                    showToast("info", `Confirm: ${confirmResult ?? "-"}`)
                  }
                  tone="soft"
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Practice: accept() / dismiss()
              </div>
            </Card>

            {/* Prompt */}
            <Card
              icon={FaKeyboard}
              title="JavaScript Prompt()"
              desc="Input text in an alert prompt then accept/cancel."
              toneClass="text-indigo-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaKeyboard}
                  label="Trigger prompt()"
                  onClick={actions.promptAlert}
                />
                <SmallButton
                  icon={FaInfoCircle}
                  label="Show value"
                  onClick={() =>
                    showToast("info", `Prompt: ${promptResult ?? "-"}`)
                  }
                  tone="soft"
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Practice: alert.sendKeys() then accept()
              </div>
            </Card>

            {/* Multiple alerts */}
            <Card
              icon={FaRocket}
              title="Multiple/Chained Alerts"
              desc="Back-to-back alerts (handle sequentially)."
              toneClass="text-purple-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaRocket}
                  label="Trigger 3 alerts"
                  onClick={actions.chainedAlerts}
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Practice: accept alerts in a loop
              </div>
            </Card>

            {/* beforeunload */}
            <Card
              icon={FaExclamationTriangle}
              title="beforeunload (Leave Page Dialog)"
              desc="Browser shows “Leave site?” prompt on refresh/back/close."
              toneClass="text-rose-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaExclamationTriangle}
                  label={
                    beforeUnloadOn
                      ? "Disable beforeunload"
                      : "Enable beforeunload"
                  }
                  onClick={() => {
                    setBeforeUnloadOn((p) => !p);
                    showToast(
                      "info",
                      `beforeunload: ${!beforeUnloadOn ? "ON" : "OFF"}`,
                    );
                  }}
                />
                <SmallButton
                  icon={FaLink}
                  label="Try navigate (hash)"
                  onClick={() => {
                    window.location.hash = `test-${Date.now()}`;
                    setLastAction("Navigated hash");
                  }}
                  tone="soft"
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Practice: navigation/refresh handling
              </div>
            </Card>

            {/* Popup / new window */}
            <Card
              icon={FaWindowRestore}
              title="Popup / New Window"
              desc="Open a new window/tab and handle window switching."
              toneClass="text-sky-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaWindowRestore}
                  label="Open popup"
                  onClick={actions.openPopupWindow}
                />
                <SmallButton
                  icon={FaLink}
                  label="Open new tab"
                  onClick={() =>
                    window.open("about:blank", "_blank", "noopener,noreferrer")
                  }
                  tone="soft"
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Practice: driver.getWindowHandles(), switchTo().window()
              </div>
            </Card>

            {/* Basic Auth */}
            <Card
              icon={FaLock}
              title="Basic Auth Dialog"
              desc="HTTP basic authentication popup (browser-level)."
              toneClass="text-emerald-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaLock}
                  label="Open auth demo"
                  onClick={actions.openAuthTab}
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Practice: handle auth via URL/credentials or browser options
              </div>
            </Card>

            {/* File chooser */}
            <Card
              icon={FaFileUpload}
              title="File Upload (OS File Chooser)"
              desc="Native file picker dialog (not a JS alert)."
              toneClass="text-indigo-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaFileUpload}
                  label="Open file chooser"
                  onClick={actions.openFileChooser}
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: sendKeys(filePath) to the input[type=file]
              </div>
            </Card>

            {/* Notifications */}
            <Card
              icon={FaBell}
              title="Notification Permission"
              desc="Browser permission popup for notifications."
              toneClass="text-amber-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaBell}
                  label="Request permission"
                  onClick={actions.requestNotifications}
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: handle permission prompts via browser profiles/options
              </div>
            </Card>

            {/* Geolocation */}
            <Card
              icon={FaMapMarkerAlt}
              title="Geolocation Permission"
              desc="Allow/Deny location access dialog."
              toneClass="text-rose-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaMapMarkerAlt}
                  label="Request geolocation"
                  onClick={actions.requestGeo}
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: auto-allow/deny with ChromeOptions/Firefox profiles
              </div>
            </Card>

            {/* Clipboard */}
            <Card
              icon={FaClipboard}
              title="Clipboard Permission"
              desc="Read/Write clipboard may prompt permission (depends on browser/HTTPS)."
              toneClass="text-sky-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaClipboard}
                  label="Write clipboard"
                  onClick={actions.requestClipboardWrite}
                />
                <SmallButton
                  icon={FaClipboard}
                  label="Read clipboard"
                  onClick={actions.requestClipboardRead}
                  tone="soft"
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Practice: permissions + user gesture rules
              </div>
            </Card>

            {/* Fullscreen */}
            <Card
              icon={FaExpand}
              title="Fullscreen Permission"
              desc="Request fullscreen (may show permission or require gesture)."
              toneClass="text-purple-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaExpand}
                  label="Enter fullscreen"
                  onClick={actions.requestFullscreen}
                />
                <SmallButton
                  icon={FaTimes}
                  label="Exit"
                  onClick={actions.exitFullscreen}
                  tone="soft"
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Practice: user gesture + browser UI behaviors
              </div>
            </Card>

            {/* Print */}
            <Card
              icon={FaPrint}
              title="Print Dialog"
              desc="Opens the browser print dialog (OS/browser controlled)."
              toneClass="text-emerald-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaPrint}
                  label="Open print dialog"
                  onClick={actions.printDialog}
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: print dialogs are not standard JS alerts
              </div>
            </Card>

            {/* App-style modal */}
            <Card
              icon={FaInfoCircle}
              title="In-App Modal (Not Browser Alert)"
              desc="Common UI modal inside page (sweetalert, bootstrap modal, etc.)."
              toneClass="text-indigo-400"
            >
              <div className="flex flex-wrap gap-3">
                <SmallButton
                  icon={FaInfoCircle}
                  label="Open modal"
                  onClick={actions.openOnPageModal}
                />
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Selenium: locate elements, click buttons, read text
              </div>
            </Card>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div className="text-sm font-semibold text-slate-900">
              Selenium Notes (What to practice)
            </div>
            <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="text-slate-500">•</span>{" "}
                switchTo().alert().accept()
              </li>
              <li className="flex gap-2">
                <span className="text-slate-500">•</span>{" "}
                switchTo().alert().dismiss()
              </li>
              <li className="flex gap-2">
                <span className="text-slate-500">•</span>{" "}
                switchTo().alert().getText()
              </li>
              <li className="flex gap-2">
                <span className="text-slate-500">•</span>{" "}
                switchTo().alert().sendKeys()
              </li>
              <li className="flex gap-2">
                <span className="text-slate-500">•</span> explicit waits for
                delayed alerts
              </li>
              <li className="flex gap-2">
                <span className="text-slate-500">•</span> window handles +
                switching tabs
              </li>
              <li className="flex gap-2">
                <span className="text-slate-500">•</span> permission popups via
                browser options
              </li>
              <li className="flex gap-2">
                <span className="text-slate-500">•</span> file upload using
                input[type=file]
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* In-app Modal */}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  In-App Modal
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  This is NOT a browser alert. Automate using normal locators.
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-700">
                Type something
              </label>
              <input
                value={modalInput}
                onChange={(e) => setModalInput(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                placeholder="Modal input..."
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <SmallButton
                icon={FaCheckCircle}
                label="Submit"
                onClick={() => {
                  setLastAction("In-app modal submitted");
                  showToast(
                    "ok",
                    `Modal submitted: ${modalInput || "(empty)"}`,
                  );
                  setModalOpen(false);
                }}
              />
              <SmallButton
                icon={FaTimes}
                label="Cancel"
                tone="soft"
                onClick={() => {
                  setLastAction("In-app modal cancelled");
                  setModalOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Toast */}
      {toast ? (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] px-4 w-full sm:w-auto">
          <div
            className={`w-full sm:w-auto max-w-xl rounded-2xl border px-4 py-3 shadow-lg backdrop-blur bg-white/95 text-sm flex items-start gap-3 ${
              toast.type === "ok"
                ? "border-emerald-200 text-emerald-800"
                : toast.type === "warn"
                  ? "border-rose-200 text-rose-800"
                  : "border-slate-200 text-slate-800"
            }`}
          >
            <FaInfoCircle className="mt-0.5" />
            <div className="font-medium">{toast.text}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
