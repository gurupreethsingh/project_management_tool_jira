"use client";

import React, { memo } from "react";

function ServiceFeatureCard({ icon, title, description }) {
  return (
    <div className="service-small-card">
      {icon}
      <div>
        <h4 className="service-sub-heading">{title}</h4>
        <p className="service-small-paragraph">{description}</p>
      </div>
    </div>
  );
}

export default memo(ServiceFeatureCard);
