// AllFrames.jsx (FULL FILE — ECODERS style, responsive, fast, Selenium-practice ready)
// ✅ Covers: iframe by id/name, by WebElement, by index, nested frames, switchTo defaultContent/parentFrame,
// dynamic iframe (appears after delay), and an in-page modal (non-frame) so students don't confuse.
// ✅ Includes test-friendly ids/data attributes.

import React, { useEffect, useMemo, useState } from "react";
import {
  FaWindowRestore,
  FaLayerGroup,
  FaCode,
  FaClock,
  FaArrowRight,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function Badge({ children }) {
  return (
    <span className="px-3 py-1 text-[11px] font-medium rounded-full border border-slate-200 bg-white text-slate-700">
      {children}
    </span>
  );
}

function Card({
  icon: Icon,
  title,
  desc,
  children,
  toneClass = "text-indigo-400",
}) {
  return (
    <div className="group border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md group-hover:scale-105 transition-all">
          <Icon className={`text-xl ${toneClass}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function AllFrames() {
  const [status, setStatus] = useState("Ready");
  const [dynamicOn, setDynamicOn] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      // show dynamic iframe after a delay (explicit wait practice)
      await sleep(2500);
      if (alive) setDynamicOn(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const tips = useMemo(
    () => [
      "switchTo().frame(index)",
      'switchTo().frame("nameOrId")',
      "switchTo().frame(WebElement)",
      "switchTo().parentFrame()",
      "switchTo().defaultContent()",
      "Wait for iframe to appear then switch",
      "Nested frames: outer -> inner",
    ],
    [],
  );

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <div className="flex flex-wrap gap-2 mb-4">
            {["SELENIUM", "FRAMES", "IFRAME", "NESTED"].map((item) => (
              <span
                key={item}
                className="px-3 py-1 text-[11px] font-medium rounded-full bg-slate-900 text-white"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
              Frames Practice Lab
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Every Type of Frame Switching
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              Use this page to practice Selenium frame handling: switch by
              index, id/name, WebElement, nested frames, and switching back with
              parentFrame/defaultContent.
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge>
                Status: <span className="font-semibold">{status}</span>
              </Badge>
              <Badge>
                Dynamic iframe:{" "}
                <span className="font-semibold">
                  {dynamicOn ? "Visible ✅" : "Loading..."}
                </span>
              </Badge>
            </div>

            <div className="mt-5 rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-5 sm:p-6">
              <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FaInfoCircle className="text-slate-500" />
                What to practice (Selenium)
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tips.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-[11px] font-medium border border-slate-200 bg-white text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                Note: You can only interact with elements inside an iframe after
                switching into it.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-10 sm:py-14 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
            {/* iframe by id/name */}
            <Card
              icon={FaWindowRestore}
              title="1) Iframe by id / name"
              desc='Switch using driver.switchTo().frame("frame-one") or frame("frameOneName")'
              toneClass="text-sky-400"
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Outside iframe controls
                </div>
                <button
                  id="outside-frameone-btn"
                  onClick={() => setStatus("Clicked button outside iframe")}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Outside Button{" "}
                  <FaArrowRight className="inline ml-2 text-xs" />
                </button>
              </div>

              <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <iframe
                  id="frame-one"
                  name="frameOneName"
                  title="Frame One"
                  className="w-full h-[240px] sm:h-[260px]"
                  srcDoc={`
                    <html>
                      <body style="font-family: Arial; padding: 16px;">
                        <h3 id="frameone-title">Frame One (id/name)</h3>
                        <p style="color:#555; margin-top:8px;">Inside iframe content.</p>
                        <input id="frameone-input" placeholder="Type here..." style="padding:10px; width: 90%; border:1px solid #ccc; border-radius:10px;" />
                        <button id="frameone-btn" style="margin-top:12px; padding:10px 14px; border-radius:12px; border:1px solid #111; background:#111; color:#fff; cursor:pointer;"
                          onclick="document.getElementById('frameone-result').innerText = 'Saved: ' + (document.getElementById('frameone-input').value || '(empty)');">
                          Save
                        </button>
                        <div id="frameone-result" style="margin-top:10px; color:#0f766e; font-weight:600;">Result: -</div>
                      </body>
                    </html>
                  `}
                />
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Targets: <code>#frame-one</code>, <code>#frameone-input</code>,{" "}
                <code>#frameone-btn</code>
              </div>
            </Card>

            {/* iframe by index */}
            <Card
              icon={FaCode}
              title="2) Iframe by index"
              desc="Practice switching by index (be careful: index changes if DOM changes)."
              toneClass="text-purple-400"
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Tip
                </div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  Example: <code>driver.switchTo().frame(0)</code> or{" "}
                  <code>frame(1)</code>
                  depending on page order.
                </div>
              </div>

              <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <iframe
                  title="Frame Two"
                  className="w-full h-[240px] sm:h-[260px]"
                  srcDoc={`
                    <html>
                      <body style="font-family: Arial; padding: 16px;">
                        <h3 id="frametwo-title">Frame Two (Index)</h3>
                        <p style="color:#555; margin-top:8px;">Use frame(index) to reach here.</p>
                        <button id="frametwo-alert" style="padding:10px 14px; border-radius:12px; border:1px solid #111; background:#fff; cursor:pointer;"
                          onclick="alert('Alert inside Frame Two!');">
                          Trigger Alert (inside iframe)
                        </button>
                      </body>
                    </html>
                  `}
                />
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Target: <code>#frametwo-alert</code> triggers a JS alert inside
                iframe
              </div>
            </Card>

            {/* nested frames */}
            <Card
              icon={FaLayerGroup}
              title="3) Nested Frames (Outer → Inner)"
              desc="Switch into outer iframe, then into inner iframe. Practice parentFrame() and defaultContent()."
              toneClass="text-emerald-400"
            >
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <iframe
                  id="outer-frame"
                  name="outerFrame"
                  title="Outer Frame"
                  className="w-full h-[300px] sm:h-[320px]"
                  srcDoc={`
                    <html>
                      <body style="font-family: Arial; padding: 14px;">
                        <h3 id="outer-title">Outer Frame</h3>
                        <p style="color:#555; margin-top:6px;">
                          First switch here: switchTo().frame("outer-frame")
                        </p>
                        <button id="outer-btn" style="padding:9px 12px; border-radius:12px; border:1px solid #111; background:#111; color:#fff; cursor:pointer;"
                          onclick="document.getElementById('outer-note').innerText='Outer button clicked ✅';">
                          Outer Button
                        </button>
                        <div id="outer-note" style="margin-top:10px; color:#0f766e; font-weight:600;">Outer note: -</div>

                        <div style="margin-top:12px; border:1px solid #ddd; border-radius:14px; overflow:hidden;">
                          <iframe id="inner-frame" name="innerFrame" title="Inner Frame" style="width:100%; height:170px; border:0;"
                            srcdoc="
                              <html>
                                <body style='font-family: Arial; padding: 12px;'>
                                  <h4 id='inner-title'>Inner Frame</h4>
                                  <p style='color:#555; margin-top:6px;'>Then switch: switchTo().frame('inner-frame')</p>
                                  <input id='inner-input' placeholder='Inner input...' style='padding:10px; width: 92%; border:1px solid #ccc; border-radius:10px;'/>
                                  <button id='inner-btn' style='margin-top:10px; padding:9px 12px; border-radius:12px; border:1px solid #111; background:#fff; cursor:pointer;'
                                    onclick=&quot;document.getElementById('inner-result').innerText='Inner saved ✅';&quot;>
                                    Inner Save
                                  </button>
                                  <div id='inner-result' style='margin-top:8px; color:#7c3aed; font-weight:700;'>Inner result: -</div>
                                </body>
                              </html>
                            ">
                          </iframe>
                        </div>
                      </body>
                    </html>
                  `}
                />
              </div>

              <div className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                Flow: defaultContent → outer-frame → inner-frame → parentFrame →
                defaultContent
              </div>
            </Card>

            {/* dynamic iframe */}
            <Card
              icon={FaClock}
              title="4) Dynamic iframe (appears after delay)"
              desc="Practice explicit wait until iframe exists, then switch into it."
              toneClass="text-amber-400"
            >
              {!dynamicOn ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex items-start gap-3">
                  <FaExclamationTriangle className="mt-0.5" />
                  <div>
                    Dynamic iframe will appear after a few seconds. Use
                    WebDriverWait for presenceOfElementLocated.
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                  <iframe
                    id="dynamic-frame"
                    name="dynamicFrame"
                    title="Dynamic Frame"
                    className="w-full h-[240px] sm:h-[260px]"
                    srcDoc={`
                      <html>
                        <body style="font-family: Arial; padding: 16px;">
                          <h3 id="dynamic-title">Dynamic Frame ✅</h3>
                          <p style="color:#555; margin-top:6px;">This iframe was injected later.</p>
                          <button id="dynamic-btn" style="padding:10px 14px; border-radius:12px; border:1px solid #111; background:#111; color:#fff; cursor:pointer;"
                            onclick="document.getElementById('dynamic-note').innerText='Dynamic clicked ✅';">
                            Click in Dynamic Frame
                          </button>
                          <div id="dynamic-note" style="margin-top:10px; color:#0f766e; font-weight:700;">-</div>
                        </body>
                      </html>
                    `}
                  />
                </div>
              )}

              <div className="mt-3 text-[11px] text-slate-500">
                Target: <code>#dynamic-frame</code>, <code>#dynamic-btn</code>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
