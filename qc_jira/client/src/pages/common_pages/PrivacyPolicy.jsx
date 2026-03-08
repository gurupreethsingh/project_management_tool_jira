"use client";

import React, { memo } from "react";
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";

function PrivacyPolicy() {
  return (
    <div className="service-page-wrap">
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div className="service-hero-overlay-3" />

        <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            Your privacy is important to us. This privacy policy explains what
            personal data we collect, how we use it, and how we protect it.
          </p>
        </div>
      </section>

      <main className="service-main-wrap">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14">
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-8">
            <section className="service-parent-card">
              <h2 className="service-main-heading">
                Your data protection rights
              </h2>
              <p className="service-paragraph">
                Depending on your location, you may have the following rights
                regarding your personal data:
              </p>
              <ul className="mt-4 space-y-4 text-slate-600">
                <li className="flex gap-3">
                  <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">Right to access.</strong>{" "}
                    You may request copies of your personal data.
                  </span>
                </li>
                <li className="flex gap-3">
                  <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">
                      Right to rectification.
                    </strong>{" "}
                    You may request correction of inaccurate or incomplete data.
                  </span>
                </li>
                <li className="flex gap-3">
                  <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">
                      Right to erasure.
                    </strong>{" "}
                    You may request deletion of your personal data under certain
                    conditions.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">
                      Right to object to processing.
                    </strong>{" "}
                    You may object to our processing of your personal data under
                    certain conditions.
                  </span>
                </li>
              </ul>
            </section>

            <section className="service-parent-card">
              <h2 className="service-main-heading">Information we collect</h2>
              <p className="service-paragraph">
                We collect information you provide directly to us, such as your
                name, email address, phone number, and related contact details
                when you submit forms or use our services.
              </p>
              <ul className="mt-4 space-y-4 text-slate-600">
                <li className="flex gap-3">
                  <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">Data collection.</strong>{" "}
                    We collect only the information needed to operate
                    effectively and improve our services.
                  </span>
                </li>
                <li className="flex gap-3">
                  <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">Secure data.</strong> We
                    prioritize security and use reasonable safeguards to protect
                    your information.
                  </span>
                </li>
                <li className="flex gap-3">
                  <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">Data storage.</strong>{" "}
                    Data is stored securely with measures intended to preserve
                    integrity and availability.
                  </span>
                </li>
              </ul>
            </section>

            <section className="service-parent-card">
              <h2 className="service-main-heading">
                How we use your information
              </h2>
              <p className="service-paragraph">
                We use collected information to operate, improve, and support
                our services.
              </p>
              <ul className="mt-4 space-y-4 text-slate-600">
                <li className="flex gap-3">
                  <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">
                      Provide services.
                    </strong>{" "}
                    To operate, maintain, and deliver our website and services.
                  </span>
                </li>
                <li className="flex gap-3">
                  <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">
                      Improve experience.
                    </strong>{" "}
                    To improve, personalize, and expand our services.
                  </span>
                </li>
                <li className="flex gap-3">
                  <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">Communicate.</strong> To
                    send updates, service information, and support-related
                    communication.
                  </span>
                </li>
                <li className="flex gap-3">
                  <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">
                      Process transactions.
                    </strong>{" "}
                    To manage orders, payments, and subscriptions where
                    applicable.
                  </span>
                </li>
              </ul>
            </section>

            <section className="service-parent-card">
              <h2 className="service-main-heading">
                How we share your information
              </h2>
              <p className="service-paragraph">
                We may share information only in limited and appropriate
                situations.
              </p>
              <ul className="mt-4 space-y-4 text-slate-600">
                <li className="flex gap-3">
                  <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">
                      With service providers.
                    </strong>{" "}
                    We may share data with trusted vendors who help operate our
                    services.
                  </span>
                </li>
                <li className="flex gap-3">
                  <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">
                      For legal requirements.
                    </strong>{" "}
                    We may disclose information when legally required.
                  </span>
                </li>
                <li className="flex gap-3">
                  <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">
                      In business transfers.
                    </strong>{" "}
                    Information may transfer as part of a merger, acquisition,
                    or asset sale.
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(PrivacyPolicy);
