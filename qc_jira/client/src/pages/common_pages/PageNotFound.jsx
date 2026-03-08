"use client";

import React, { memo } from "react";
import { Link } from "react-router-dom";

import notFoundBanner from "../../assets/images/profile_banner.jpg";

const HERO_TAGS = ["404", "NOT FOUND", "ROUTING", "NAVIGATION"];

const HERO_STYLE = {
  backgroundImage: `url(${notFoundBanner})`,
};

function PageNotFound() {
  return (
    <div className="service-page-wrap min-h-screen">
      {/* HERO */}
      {/* <section className="service-hero-section" style={HERO_STYLE}>
        <div className="service-hero-overlay-1" />
        <div className="service-hero-overlay-2" />
        <div className="service-hero-overlay-3" />

        <div className="service-hero-container">
          <div className="service-hero-layout">
            <div>
              <div className="service-tag-row">
                {HERO_TAGS.map((item) => (
                  <span key={item} className="service-tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="service-hero-title">
                Page{" "}
                <span className="service-hero-title-highlight">not found</span>
              </h1>

              <p className="service-hero-text">
                Sorry, we could not find the page you were looking for. The link
                may be broken, outdated, or the page may have been moved.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
                Error 404 · Route unavailable
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* MAIN */}
      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-6 sm:p-8 lg:p-10 text-center">
              <p className="service-badge-heading">404 error</p>

              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                We could not locate that page
              </h2>

              <p className="mt-4 service-paragraph max-w-2xl mx-auto">
                The page you requested does not exist at this address. You can
                return to the homepage or reach out if you need help finding the
                correct section.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/" className="primary-gradient-button">
                  Go back home
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50"
                >
                  Contact support
                </Link>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-[12px] sm:text-sm text-slate-600">
                Tip: check the URL for spelling errors or navigate using the
                main menu.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(PageNotFound);
