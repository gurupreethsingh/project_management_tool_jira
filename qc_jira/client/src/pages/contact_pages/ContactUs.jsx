"use client";

import React, { memo, useCallback, useState } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComment,
  FaMapMarkerAlt,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

// ✅ OS-independent, build-safe import (works on Windows + Linux server)
import contactPhoneBanner from "../../assets/images/contact_banner.jpg";

// ✅ static constants moved outside for better performance
const HERO_TAGS = ["CONTACT", "SOFTWARE", "AI", "BLOCKCHAIN"];

const HERO_STYLE = {
  backgroundImage: `url(${contactPhoneBanner})`,
};

/* =========================
   COMMON STYLES
========================= */

const MAIN_HEADING_STYLE =
  "text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-uppercase tracking-[0.1em]";

const SUB_HEADING_STYLE = "text-sm sm:text-base font-semibold text-indigo-600";

const BADGE_MAIN_HEADING_STYLE =
  "text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700";

const PARAGRAPH_STYLE = "text-sm sm:text-base text-slate-600 leading-relaxed";

const SMALL_PARAGRAPH_STYLE =
  "text-[12px] sm:text-xs text-slate-600 leading-relaxed";

const LIST_PARAGRAPH_STYLE = "text-[13px] sm:text-sm text-slate-700";

const HERO_BADGE_STYLE =
  "px-3 py-1 text-[11px] font-medium rounded-full bg-black/65 text-white backdrop-blur-sm border border-white/20";

const HERO_HEADING_STYLE =
  "text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]";

const HERO_GRADIENT_HEADING_STYLE =
  "text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]";

const HERO_PARAGRAPH_STYLE =
  "mt-3 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]";

const HERO_GLASS_STRIP_STYLE =
  "mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 text-xs sm:text-sm text-black/90";

const CARD_STYLE = "rounded-2xl bg-white border border-slate-200 shadow-sm";

const LARGE_CARD_STYLE =
  "rounded-3xl bg-white border border-slate-200 shadow-sm";

const FEATURE_CARD_STYLE =
  "group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200";

const INFO_CARD_STYLE =
  "rounded-2xl bg-white border border-slate-200 p-4 sm:p-5";

const ICON_BOX_STYLE =
  "inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md";

const SMALL_ICON_BOX_STYLE =
  "inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white";

const ROUND_ICON_BOX_STYLE =
  "mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white";

const BUTTON_STYLE =
  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200";

const PRIMARY_BUTTON_STYLE = `${BUTTON_STYLE} bg-slate-900 text-white hover:bg-slate-800`;

const SECONDARY_BUTTON_STYLE = `${BUTTON_STYLE} border border-slate-300 text-slate-700 hover:bg-slate-50`;

const LINK_STYLE = "transition-colors duration-200 hover:text-slate-900";

const FORM_LABEL_STYLE =
  "block text-sm font-medium leading-6 text-slate-900 flex items-center";

const FORM_INPUT_STYLE =
  "block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/70 focus:border-slate-900/70 sm:text-sm";

const FORM_HELP_TEXT_STYLE = "text-xs sm:text-sm text-slate-600";

const PRIMARY_GRADIENT_BUTTON_STYLE =
  "inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-md hover:shadow-lg hover:brightness-110";

function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message_text: "",
    agreeToLicense: false,
  });

  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleLicenseChange = useCallback((checked) => {
    setFormData((prev) => ({
      ...prev,
      agreeToLicense: checked,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const response = await axios.post(
          `${globalBackendRoute}/api/add-contact-message`,
          formData,
        );

        if (response.status === 201) {
          setSubmitted(true);
          alert(
            "Message successfully sent! You will be notified within 24 hours.",
          );
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message_text: "",
            agreeToLicense: false,
          });
          navigate("/contact");
        }
      } catch (error) {
        console.error("Error submitting contact message:", error);
        alert("There was an issue submitting your message. Please try again.");
      }
    },
    [formData, navigate],
  );

  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-slate-100 bg-cover bg-center bg-no-repeat"
        style={HERO_STYLE}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-white/15 to-white/35" />
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black/35 via-black/10 to-transparent" />
        <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/20 via-purple-300/20 to-pink-300/20 blur-[120px] opacity-70" />

        <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-16">
          <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                {HERO_TAGS.map((item) => (
                  <span key={item} className={HERO_BADGE_STYLE}>
                    {item}
                  </span>
                ))}
              </div>

              <h1 className={HERO_HEADING_STYLE}>
                Let&apos;s talk about your{" "}
                <span className={HERO_GRADIENT_HEADING_STYLE}>
                  software &amp; AI projects
                </span>
              </h1>

              <p className={HERO_PARAGRAPH_STYLE}>
                Share a quick note about what you&apos;re building or exploring.
                We&apos;ll get back with clear next steps, timelines and how we
                can help.
              </p>

              <div className={HERO_GLASS_STRIP_STYLE}>
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Typically respond within 24 hours
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>Typically respond within 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>Bangalore · IST (UTC+5:30)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="bg-white">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr),minmax(0,1fr)] gap-10 lg:gap-12 items-start">
            {/* LEFT: MAP + OFFICE INFO */}
            <section>
              <h2 className={MAIN_HEADING_STYLE}>Our office location</h2>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={SMALL_ICON_BOX_STYLE}>
                      <FaMapMarkerAlt className="text-xs" />
                    </span>
                    <p className={BADGE_MAIN_HEADING_STYLE}>Office address</p>
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-500">
                    Bangalore · India
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.708217642363!2d77.50440487591027!3d13.054235513059428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae23460634f221%3A0x2a27c0c9577a1841!2sEcoders!5e0!3m2!1sen!2sin!4v1725038241641!5m2!1sen!2sin"
                    width="100%"
                    height="320"
                    allowFullScreen=""
                    loading="lazy"
                    title="Company Location"
                    className="border-0"
                  ></iframe>
                </div>

                <div
                  className={`${LARGE_CARD_STYLE} mt-5 px-5 sm:px-6 py-5 sm:py-6`}
                >
                  <p className={BADGE_MAIN_HEADING_STYLE}>Contact details</p>

                  <div className="mt-4 space-y-3">
                    <p className={PARAGRAPH_STYLE}>
                      <span className="font-semibold text-slate-900">
                        Address :
                      </span>{" "}
                      Ecoders, 3rd Floor, Defence Colony,
                      <br />
                      Above Dr. Harini Clinic, Bagaloguntte, Hesaraghatta Road,
                      <br />
                      Bangalore, Karnataka - 560057
                      <br />
                      India.
                    </p>
                    <p className={PARAGRAPH_STYLE}>
                      <span className="font-semibold text-slate-900">
                        Phone :
                      </span>{" "}
                      +91 9538596766
                    </p>
                    <p className={PARAGRAPH_STYLE}>
                      <span className="font-semibold text-slate-900">
                        Email :
                      </span>{" "}
                      igurupreeth@gmail.com, ecoders@gmail.com
                    </p>
                    <p className={PARAGRAPH_STYLE}>
                      <span className="font-semibold text-slate-900">
                        Website :
                      </span>{" "}
                      www.ecoders.in
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT: FORM */}
            <section>
              <h2 className={MAIN_HEADING_STYLE}>Get in touch</h2>

              <div className={`${LARGE_CARD_STYLE} mt-5 p-5 sm:p-6 lg:p-7`}>
                <p className={BADGE_MAIN_HEADING_STYLE}>Send us a message</p>
                <p className={`mt-3 ${FORM_HELP_TEXT_STYLE}`}>
                  Fill in your details and a short message. We&apos;ll reply
                  over email or phone with the next steps.
                </p>

                <form onSubmit={handleSubmit} className="mx-auto max-w-xl mt-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label htmlFor="firstName" className={FORM_LABEL_STYLE}>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white mr-2">
                          <FaUser className="text-[11px]" />
                        </span>
                        First name
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={FORM_INPUT_STYLE}
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="lastName" className={FORM_LABEL_STYLE}>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white mr-2">
                          <FaUser className="text-[11px]" />
                        </span>
                        Last name
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={FORM_INPUT_STYLE}
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="email" className={FORM_LABEL_STYLE}>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white mr-2">
                          <FaEnvelope className="text-[11px]" />
                        </span>
                        Email
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={FORM_INPUT_STYLE}
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="phone" className={FORM_LABEL_STYLE}>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white mr-2">
                          <FaPhone className="text-[11px]" />
                        </span>
                        Phone number
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className={FORM_INPUT_STYLE}
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="message_text"
                        className={FORM_LABEL_STYLE}
                      >
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white mr-2">
                          <FaComment className="text-[11px]" />
                        </span>
                        Drop a message
                      </label>
                      <div className="mt-2.5">
                        <textarea
                          id="message_text"
                          name="message_text"
                          rows={4}
                          value={formData.message_text}
                          onChange={handleChange}
                          className={FORM_INPUT_STYLE}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-x-4 sm:col-span-2 items-start">
                      <div className="flex h-6 items-center">
                        <Switch
                          checked={formData.agreeToLicense}
                          onChange={handleLicenseChange}
                          className="group flex w-9 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 data-[checked]:bg-slate-900"
                        >
                          <span className="sr-only">Agree to policies</span>
                          <span
                            aria-hidden="true"
                            className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                          />
                        </Switch>
                      </div>

                      <label className="text-xs sm:text-sm leading-6 text-slate-600">
                        By selecting this, you agree to our{" "}
                        <a
                          href="/privacy-policy"
                          className="font-semibold text-slate-900 underline underline-offset-2"
                        >
                          privacy policy
                        </a>
                      </label>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      type="submit"
                      className={`${PRIMARY_GRADIENT_BUTTON_STYLE}`}
                      disabled={!formData.agreeToLicense}
                      title={
                        formData.agreeToLicense
                          ? "Submit your message"
                          : "Please agree to the privacy policy to submit"
                      }
                    >
                      Get in touch
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(ContactUs);
