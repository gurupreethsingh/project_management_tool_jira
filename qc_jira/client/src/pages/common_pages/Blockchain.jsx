import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaLock, FaLink } from "react-icons/fa";
import { SiHiveBlockchain, SiEthereum } from "react-icons/si";

export default function Blockchain() {
  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[110px] opacity-80" />

        <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-9">
          <nav className="mb-2 text-xs sm:text-sm text-slate-500">
            <Link to="/homepage" className="hover:text-slate-900">
              Home
            </Link>{" "}
            <span className="mx-1">/</span>
            <Link to="/explore-solutions" className="hover:text-slate-900">
              Solutions
            </Link>{" "}
            <span className="mx-1">/</span>
            <span className="text-slate-700">Blockchain</span>
          </nav>

          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
                Blockchain-backed audit &amp; workflows
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl">
                We use blockchain where it makes the most sense: tamper-proof
                logs for activities that must be proveable, traceable and
                secure.
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                <SiHiveBlockchain className="text-[#FF6F00]" />
                <span>Immutable records</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="bg-white">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-9 lg:py-10 space-y-8">
          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)] gap-7">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
                Where blockchain fits best
              </h2>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-emerald-500 text-xs" />
                  <span>
                    Release approvals and deployment logs that must be
                    tamper-proof.
                  </span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-sky-500 text-xs" />
                  <span>
                    Change management and configuration history across multiple
                    environments.
                  </span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="mt-[3px] text-amber-500 text-xs" />
                  <span>Asset and contract lifecycle tracking.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 sm:p-6 bg-white shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
                  <SiHiveBlockchain className="text-xl text-[#FF6F00]" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Security without a painful UX.
                </p>
              </div>
              <p className="text-sm text-slate-700">
                Your users stay inside familiar interfaces while blockchain
                works beneath the surface to guarantee integrity.
              </p>

              <div className="mt-2 flex flex-wrap gap-3 text-[11px] sm:text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <FaLock className="text-emerald-500" />
                  <span>Security first</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <SiEthereum className="text-[#627EEA]" />
                  <span>EVM-compatible</span>
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
              Example patterns
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
                <FaLink className="mt-1 text-indigo-500" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    Release ledger
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
                    Every release is written to an immutable ledger with
                    relevant metadata.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
                <FaLock className="mt-1 text-rose-500" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    Signature workflows
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
                    Approvals recorded as blockchain-backed actions instead of
                    emails.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 flex gap-3 items-start">
                <SiHiveBlockchain className="mt-1 text-[#FF6F00]" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    Immutable audit
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
                    Full activity history that can&apos;t be quietly edited or
                    deleted.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
