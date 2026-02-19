// SubscriptionForm.jsx
import React, { useState } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const SubscriptionForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (input) => {
    const trimmed = input.trim();
    if (trimmed === "") return "Please enter your email.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOkMsg("");

    const errorMsg = validateEmail(email);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        `${globalBackendRoute}/api/subscribe`,
        { email: email.trim() },
        { headers: { "Content-Type": "application/json" } },
      );

      setOkMsg(res?.data?.message || "✅ Subscription successful!");
      setEmail("");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Subscription failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError("");
          if (okMsg) setOkMsg("");
        }}
        placeholder="Enter your email"
        className={`w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border border-red-500" : ""
        }`}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {okMsg && <p className="text-green-600 text-sm">{okMsg}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
};

export default SubscriptionForm;
