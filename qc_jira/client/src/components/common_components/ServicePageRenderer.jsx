"use client";

import React, { memo } from "react";
import { useParams } from "react-router-dom";

import ServiceHero from "../../components/common_components/ServiceHero";
import ServiceInfoCard from "../../components/common_components/ServiceInfoCard";
import ServiceFeatureCard from "../../components/common_components/ServiceFeatureCard";
import { ServicePagesData } from "../../components/common_components/ServicePagesData";

function ServicePageRenderer({ serviceKey = "" }) {
  const { serviceSlug } = useParams();

  const resolvedServiceKey = serviceKey || serviceSlug || "";
  const pageData = ServicePagesData[resolvedServiceKey];

  if (!pageData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Service page not found
          </h2>
          <p className="mt-2 text-slate-600">
            The service you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page-wrap">
      <ServiceHero
        banner={pageData.hero.banner}
        tags={pageData.hero.tags}
        titleStart={pageData.hero.titleStart}
        titleHighlight={pageData.hero.titleHighlight}
        description={pageData.hero.description}
        statusText={pageData.hero.statusText}
      />

      <main className="service-main-wrap">
        <div className="service-main-container">
          <section className="service-grid-two">
            <div>
              <h2 className="service-main-heading">
                {pageData.introSection.heading}
              </h2>

              <ul className="space-y-3 text-sm text-slate-700 mt-5">
                {pageData.introSection.list.map((item, index) => (
                  <li key={`${item.text}-${index}`} className="flex gap-2">
                    {item.icon}
                    <span className="service-list-paragraph">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ServiceInfoCard
              icon={pageData.infoCard.icon}
              title={pageData.infoCard.title}
              description={pageData.infoCard.description}
              chips={pageData.infoCard.chips}
            />
          </section>

          <section>
            <h2 className="service-main-heading">
              {pageData.featuresSection.heading}
            </h2>

            <div className="service-grid-three">
              {pageData.featuresSection.features.map((feature, index) => (
                <ServiceFeatureCard
                  key={`${feature.title}-${index}`}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default memo(ServicePageRenderer);
