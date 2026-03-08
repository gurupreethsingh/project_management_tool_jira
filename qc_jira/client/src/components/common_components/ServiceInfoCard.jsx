"use client";

import React, { memo } from "react";

function ServiceInfoCard({ icon, title, description, chips = [] }) {
  return (
    <div className="service-parent-card">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
          {icon}
        </div>

        <h3 className="service-badge-heading">{title}</h3>
      </div>

      <p className="service-paragraph">{description}</p>

      {chips.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] sm:text-xs">
          {chips.map((chip, index) => (
            <span
              key={`${chip.label}-${index}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200"
            >
              {chip.icon}
              <span>{chip.label}</span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default memo(ServiceInfoCard);
