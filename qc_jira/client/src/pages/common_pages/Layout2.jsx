// file: src/pages/Layout2.jsx
import React from "react";
import "animate.css";

const whoCaptions = [
  "Modern web & mobile",
  "API-first architectures",
  "Automated testing",
  "Cloud platforms",
  "Observability & SRE",
];

const Layout2 = () => {
  const whoWeAreImages = [
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: whoCaptions[0] },
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: whoCaptions[1] },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: whoCaptions[2] },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: whoCaptions[3] },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: whoCaptions[4] },
  ];

  const valuesImages = [
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Design for reliability" },
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: "Security in depth" },
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: "Automation everywhere" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Lean, iterative delivery" },
  ];

  const teamImages = [
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: "Frontend & UX" },
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: "Backend & APIs" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: "DevOps & SRE" },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: "QA automation" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: "Data/AI" },
  ];

  const clientImages = [
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "SaaS & ISVs" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Fintech & retail" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Healthcare & edtech" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Cloud partners" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Security ecosystem" },
  ];

  const renderImages = (images) => (
    <div className="flex flex-wrap justify-center gap-x-2">
      {images.map((image, i) => (
        <div key={i} className="flex flex-col items-center justify-center mb-2">
          <img
            src={image.src}
            alt={image.caption || "About us"}
            className={`object-cover rounded-lg shadow-lg ${image.size}`}
          />
          <p className="text-gray-600 text-sm text-center w-full">{image.caption}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white">
      <h2 className="text-center font-bold text-gray-700 p-5 text-3xl sm:text-4xl">About Us</h2>

      <section className="flex flex-col items-center px-4 sm:px-8 lg:px-12 py-4 space-y-8">
        {/* Who We Are */}
        <div className="w-full flex flex-col space-y-4">
          {renderImages(whoWeAreImages)}
          <div className="flex flex-col p-4">
            <h3 className="text-2xl font-semibold text-gray-700 text-center">Who We Are</h3>
            <p className="text-gray-600 text-sm text-center leading-6 mt-2">
              We build **scalable software** that lasts—composable architectures, robust APIs, and
              experiences users love. Our approach blends **product thinking** with **engineering rigor**:
              discovery → design → delivery → reliability.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-sm">
              <span>• Product & Platform Engineering</span>
              <span>• Cloud/Kubernetes & Infra as Code</span>
              <span>• DevOps, CI/CD, GitOps</span>
              <span>• SRE, Observability, Incident Mgmt</span>
              <span>• Test Automation, Performance</span>
              <span>• AppSec, Compliance, SBOM</span>
              <span>• Data Eng, Analytics & MLOps</span>
              <span>• UX Research & Design Systems</span>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="w-full flex flex-col space-y-4">
          <div className="flex flex-col p-4">
            {renderImages(valuesImages)}
            <h3 className="text-2xl font-semibold text-gray-700 text-center mt-2">Our Values</h3>
            <ul className="text-gray-600 text-sm text-center leading-6 space-y-2 mt-2">
              <li><b>Clarity:</b> ADRs, RFCs, and design reviews for shared understanding.</li>
              <li><b>Automation:</b> Pipelines, tests, and policies as code.</li>
              <li><b>Reliability:</b> SLIs/SLOs, chaos drills, and graceful degradation.</li>
              <li><b>Security:</b> Shift-left testing, secrets hygiene, least privilege.</li>
            </ul>
          </div>
        </div>

        {/* Our Team */}
        <div className="w-full flex flex-col space-y-4">
          {renderImages(teamImages)}
          <div className="flex flex-col p-4">
            <h3 className="text-2xl font-semibold text-gray-700 text-center">Our Team</h3>
            <p className="text-gray-600 text-sm text-center leading-6 mt-2">
              Multi-disciplinary squads with **PM/EM/Tech Lead** anchors, supported by **Architecture**, **Security**,
              **QA** and **SRE** guilds for consistency across products.
            </p>
          </div>
        </div>

        {/* Clients & Partners */}
        <div className="w-full flex flex-col space-y-4">
          <div className="flex flex-col p-4">
            {renderImages(clientImages)}
            <h3 className="text-2xl font-semibold text-gray-700 text-center mt-2">Clients & Partners</h3>
            <p className="text-gray-600 text-sm text-center leading-6 mt-1">
              We partner with cloud providers, observability stacks, security vendors, and CI/CD platforms
              to deliver faster with guardrails and **true DevEx**.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Layout2;
