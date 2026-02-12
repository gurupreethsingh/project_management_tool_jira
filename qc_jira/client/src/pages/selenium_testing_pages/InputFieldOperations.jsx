// InputFieldOperations.jsx (FULL FILE — ECODERS style, responsive, fast, Selenium-practice ready)
// ✅ Covers: type, clear, append, select-all + replace, read value, disabled/readonly,
// placeholder, maxLength, number input, date/time, file input, textarea,
// masked input (simple), OTP fields, auto-suggest (datalist), validation + error messages.

import React, { useMemo, useRef, useState } from "react";
import {
  FaKeyboard,
  FaEraser,
  FaCopy,
  FaInfoCircle,
  FaLock,
  FaRegCheckCircle,
  FaFileUpload,
  FaHashtag,
} from "react-icons/fa";

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

export default function InputFieldOperations() {
  const [status, setStatus] = useState("Ready");
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("-");
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    about: "",
    qty: 1,
    date: "",
    time: "",
    password: "",
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    city: "",
    readOnly: "READONLY VALUE",
    disabled: "DISABLED VALUE",
    masked: "",
  });

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.includes("@")) e.email = "Valid email required.";
    if (String(form.phone).replace(/\D/g, "").length < 10)
      e.phone = "Phone must be at least 10 digits.";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be 6+ chars.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setStatus("Submitting...");
    const ok = validate();
    setStatus(ok ? "Submitted ✅" : "Validation failed ❌");
  };

  // simple mask: keep only digits and format ####-#### (max 8 digits)
  const onMasked = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    const out =
      digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;
    setField("masked", out);
  };

  const tips = useMemo(
    () => [
      "sendKeys(text)",
      "clear()",
      "Keys.chord(Keys.CONTROL, 'a') + sendKeys(replace)",
      "getAttribute('value')",
      "readonly vs disabled",
      "file upload: input.sendKeys(path)",
      "textarea + multiline",
      "OTP fields",
      "validation messages",
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
            {["SELENIUM", "INPUTS", "FORMS", "VALIDATION"].map((item) => (
              <span
                key={item}
                className="px-3 py-1 text-[11px] font-medium rounded-full bg-slate-900 text-white"
              >
                {item}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
            Input Field Operations
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Type, Clear, Read, Validate — Everything
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Practice all input operations: sendKeys, clear, append, select-all
            replace, readonly/disabled, file upload, textarea, masked inputs,
            OTP fields, and validation.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>
              Status: <span className="font-semibold">{status}</span>
            </Badge>
            {tips.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          {/* FORM PANEL */}
          <div className="mt-7 rounded-3xl bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-5 sm:p-7">
            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Left */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="inp-fullname"
                    value={form.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    placeholder="Eg: Gurupreeth Singh"
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />
                  {errors.fullName ? (
                    <div
                      id="err-fullname"
                      className="mt-1 text-xs text-rose-700"
                    >
                      {errors.fullName}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Email <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="inp-email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="name@example.com"
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />
                  {errors.email ? (
                    <div id="err-email" className="mt-1 text-xs text-rose-700">
                      {errors.email}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Phone (digits) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="inp-phone"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="Enter 10 digits"
                    inputMode="numeric"
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />
                  {errors.phone ? (
                    <div id="err-phone" className="mt-1 text-xs text-rose-700">
                      {errors.phone}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Masked Input (####-####)
                  </label>
                  <input
                    id="inp-masked"
                    value={form.masked}
                    onChange={(e) => onMasked(e.target.value)}
                    placeholder="1234-5678"
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />
                  <div className="mt-1 text-[11px] text-slate-500">
                    Practice: type digits; formatting happens automatically.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">
                      Number input (qty)
                    </label>
                    <input
                      id="inp-qty"
                      type="number"
                      min={1}
                      max={99}
                      value={form.qty}
                      onChange={(e) => setField("qty", e.target.value)}
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">
                      Datalist Auto-suggest
                    </label>
                    <input
                      id="inp-city"
                      list="cities"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="Type city..."
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                    />
                    <datalist id="cities">
                      <option value="Bengaluru" />
                      <option value="Mysuru" />
                      <option value="Hyderabad" />
                      <option value="Chennai" />
                      <option value="Pune" />
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Password <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="inp-password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="min 6 chars"
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />
                  {errors.password ? (
                    <div
                      id="err-password"
                      className="mt-1 text-xs text-rose-700"
                    >
                      {errors.password}
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">
                      Date
                    </label>
                    <input
                      id="inp-date"
                      type="date"
                      value={form.date}
                      onChange={(e) => setField("date", e.target.value)}
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">
                      Time
                    </label>
                    <input
                      id="inp-time"
                      type="time"
                      value={form.time}
                      onChange={(e) => setField("time", e.target.value)}
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Textarea (multiline)
                  </label>
                  <textarea
                    id="inp-about"
                    rows={4}
                    value={form.about}
                    onChange={(e) => setField("about", e.target.value)}
                    placeholder="Type multiple lines..."
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <FaLock className="text-slate-400" />
                      Readonly
                    </label>
                    <input
                      id="inp-readonly"
                      readOnly
                      value={form.readOnly}
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <FaLock className="text-slate-400" />
                      Disabled
                    </label>
                    <input
                      id="inp-disabled"
                      disabled
                      value={form.disabled}
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <FaFileUpload className="text-slate-400" />
                    File Upload
                  </label>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <button
                      id="btn-pick-file"
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                    >
                      Choose File
                    </button>
                    <span id="file-name" className="text-sm text-slate-600">
                      {fileName}
                    </span>
                    <input
                      ref={fileRef}
                      id="inp-file"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setFileName(f ? f.name : "-");
                        setStatus(
                          f ? `File selected: ${f.name}` : "No file selected",
                        );
                        e.target.value = "";
                      }}
                    />
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Selenium: input[type=file].sendKeys("C:\\path\\file.png")
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <FaHashtag className="text-slate-400" />
                    OTP Inputs (4 boxes)
                  </label>
                  <div className="mt-2 grid grid-cols-4 gap-2 max-w-xs">
                    {["otp1", "otp2", "otp3", "otp4"].map((k, idx) => (
                      <input
                        key={k}
                        id={`otp-${idx + 1}`}
                        value={form[k]}
                        maxLength={1}
                        inputMode="numeric"
                        onChange={(e) =>
                          setField(
                            k,
                            e.target.value.replace(/\D/g, "").slice(0, 1),
                          )
                        }
                        className="text-center px-3 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Practice: sendKeys into each box, auto-advance can be added
                    later.
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-3">
                  <button
                    id="btn-submit-form"
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <FaRegCheckCircle className="inline mr-2 text-sm" />
                    Submit
                  </button>

                  <button
                    id="btn-reset-form"
                    type="button"
                    onClick={() => {
                      setForm({
                        fullName: "",
                        email: "",
                        phone: "",
                        about: "",
                        qty: 1,
                        date: "",
                        time: "",
                        password: "",
                        otp1: "",
                        otp2: "",
                        otp3: "",
                        otp4: "",
                        city: "",
                        readOnly: "READONLY VALUE",
                        disabled: "DISABLED VALUE",
                        masked: "",
                      });
                      setErrors({});
                      setFileName("-");
                      setStatus("Reset ✅");
                    }}
                    className="px-6 py-3 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                  >
                    <FaEraser className="inline mr-2 text-sm" />
                    Reset
                  </button>

                  <button
                    id="btn-read-values"
                    type="button"
                    onClick={() =>
                      setStatus(
                        `Read values: name="${form.fullName}", email="${form.email}"`,
                      )
                    }
                    className="px-6 py-3 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                  >
                    <FaCopy className="inline mr-2 text-sm" />
                    Read Values
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-4 text-[11px] text-slate-500">
              Selenium note: read input value with{" "}
              <code>getAttribute("value")</code>.
            </div>
          </div>
        </div>
      </section>

      {/* EXTRA CARDS */}
      <section className="pb-10 sm:pb-14 lg:pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
            <Card
              icon={FaKeyboard}
              title="Max Length + Placeholder"
              desc="Practice typing beyond maxlength and verifying placeholder text."
              toneClass="text-amber-400"
            >
              <label className="text-xs font-semibold text-slate-700">
                Max Length (10)
              </label>
              <input
                id="inp-maxlen"
                maxLength={10}
                placeholder="max 10 chars"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
              />
              <div className="mt-2 text-[11px] text-slate-500">
                Verify value length in Selenium after sendKeys.
              </div>
            </Card>

            <Card
              icon={FaInfoCircle}
              title="Custom Error (Inline)"
              desc="Click button to show/hide an inline validation message (common UI pattern)."
              toneClass="text-sky-400"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  id="btn-show-inline-error"
                  type="button"
                  onClick={() =>
                    setErrors((p) => ({
                      ...p,
                      inline: "Inline error message shown ❌",
                    }))
                  }
                  className="px-5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-medium hover:bg-rose-100 transition"
                >
                  Show Error
                </button>
                <button
                  id="btn-hide-inline-error"
                  type="button"
                  onClick={() =>
                    setErrors((p) => {
                      const n = { ...p };
                      delete n.inline;
                      return n;
                    })
                  }
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 transition"
                >
                  Hide Error
                </button>
              </div>

              {errors.inline ? (
                <div
                  id="inline-error"
                  className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
                >
                  {errors.inline}
                </div>
              ) : (
                <div className="mt-4 text-sm text-slate-500">
                  No inline error currently.
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
