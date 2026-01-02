// src/components/footer_components/Subscription.jsx
import React, { useMemo, useState } from "react";

function isBlank(s) {
  return s == null || String(s).trim() === "";
}

function normalizeTrim(s = "") {
  return String(s).trim();
}

function isValidEmail(email = "") {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email);
}

export default function Subscription({
  title = "Stay in the loop",
  subtitle = "Get product updates, tips, and releases. No spam.",
  placeholder = "you@example.com",
  buttonText = "Subscribe",
  onSubmit, // optional: (email) => Promise | void
}) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState({
    submitting: false,
    ok: false,
    error: "",
  });

  const error = useMemo(() => {
    const e = normalizeTrim(email);
    if (!touched) return "";
    if (isBlank(e)) return "Email is required.";
    if (!isValidEmail(e)) return "Please enter a valid email.";
    return "";
  }, [email, touched]);

  const canSubmit = useMemo(
    () => !error && !status.submitting,
    [error, status.submitting]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);

    const e1 = normalizeTrim(email);
    if (isBlank(e1) || !isValidEmail(e1)) {
      setStatus((s) => ({
        ...s,
        ok: false,
        error: "Please enter a valid email.",
      }));
      return;
    }

    try {
      setStatus({ submitting: true, ok: false, error: "" });

      if (typeof onSubmit === "function") {
        await onSubmit(e1);
      } else {
        // ✅ default: no-op (fast). Replace with API call later.
        await new Promise((r) => setTimeout(r, 350));
      }

      setStatus({ submitting: false, ok: true, error: "" });
      setEmail("");
      setTouched(false);
    } catch {
      setStatus({
        submitting: false,
        ok: false,
        error: "Something went wrong. Try again.",
      });
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-gray-600">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2" noValidate>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder={placeholder}
            inputMode="email"
            autoComplete="email"
            className="
              w-full rounded-xl bg-white px-4 py-2.5 text-sm
              text-gray-900 placeholder:text-gray-400
              ring-1 ring-gray-900/10
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40
            "
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="
              inline-flex items-center justify-center rounded-xl
              bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white
              shadow-sm hover:bg-indigo-600 disabled:opacity-60
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40
              whitespace-nowrap
            "
          >
            {status.submitting ? "Subscribing..." : buttonText}
          </button>
        </div>

        {error ? <p className="text-xs text-red-600">{error}</p> : null}
        {status.ok ? (
          <p className="text-xs font-semibold text-green-700">
            ✅ Subscribed successfully.
          </p>
        ) : null}
        {status.error ? (
          <p className="text-xs text-red-600">{status.error}</p>
        ) : null}
      </form>

      <p className="text-xs text-gray-500">
        By subscribing, you agree to receive emails from ECODERS.
      </p>
    </div>
  );
}
