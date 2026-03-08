"use client";

import React, { memo } from "react";

function ServiceHero({
  banner,
  tags = [],
  titleStart = "",
  titleHighlight = "",
  description = "",
  statusText = "",
}) {
  const heroStyle = {
    backgroundImage: `url(${banner})`,
  };

  return (
    <section className="service-hero-section" style={heroStyle}>
      <div className="service-hero-overlay-1" />
      <div className="service-hero-overlay-2" />
      <div className="service-hero-overlay-3" />

      <div className="service-hero-container">
        <div className="service-hero-layout">
          <div>
            <div className="service-tag-row">
              {tags.map((item) => (
                <span key={item} className="service-tag-pill">
                  {item}
                </span>
              ))}
            </div>

            <h1 className="service-hero-title">
              {titleStart}{" "}
              <span className="service-hero-title-highlight">
                {titleHighlight}
              </span>
            </h1>

            <p className="service-hero-text">{description}</p>

            {statusText ? (
              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                {statusText}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(ServiceHero);
