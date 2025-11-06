// file: src/pages/Layout1.jsx
import React from "react";
import "animate.css";

const captions = [
  "Cloud-native platforms",
  "Automated CI/CD pipelines",
  "Quality engineering at scale",
  "Secure SDLC & compliance",
];

const Layout1 = () => {
  const whoWeAreImages = [
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: captions[0] },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: captions[1] },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: captions[2] },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: captions[3] },
  ];

  const ourValuesImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: "Customer impact over complexity" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Craft, clarity, ownership" },
  ];

  const ourTeamImages = [
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: "Product & platform engineering" },
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: "Data/AI & analytics" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: "DevOps & SRE" },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: "QA automation & security" },
  ];

  const ourClientImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: "ISVs & SaaS scale-ups" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Enterprises & startups" },
  ];

  const renderImages = (images) => (
    <div className="flex flex-wrap justify-center md:justify-start gap-x-2">
      {images.map((image, i) => (
        <div key={i} className="flex flex-col items-center mb-2 w-full md:w-auto animate__animated animate__zoomIn">
          <img
            src={image.src}
            alt={image.caption || "About us"}
            className="object-cover rounded-lg shadow-lg w-full h-auto md:w-64 md:h-64"
          />
          <p className="text-gray-600 text-sm text-center w-full animate__animated animate__fadeInUp">
            {image.caption}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-8 lg:px-16">
      <h2 className="text-center font-bold text-gray-700 p-5 text-3xl sm:text-4xl animate__animated animate__fadeInDown">
        About Us
      </h2>

      <section className="flex flex-col items-center py-4 space-y-6">
        {/* Who We Are */}
        <div className="flex flex-col md:flex-row items-start w-full gap-6 animate__animated animate__fadeInLeft">
          <div className="w-full md:w-3/5">{renderImages(whoWeAreImages)}</div>
          <div className="w-full md:w-2/5 md:p-2">
            <h3 className="text-2xl font-semibold text-gray-700">Who We Are</h3>
            <p className="text-gray-600 text-sm leading-6 mt-2">
              We’re a product engineering company helping teams **design, build, and scale** modern software.
              From **architecture & APIs** to **mobile/web apps**, **cloud platforms**, and **observability**,
              we deliver end-to-end outcomes. Our playbooks cover **secure SDLC**, **DevOps automation**,
              **SRE reliability**, and **data/AI** that turns telemetry into impact.
            </p>
            <ul className="mt-3 text-gray-600 text-sm leading-6 list-disc ms-4">
              <li>Product/Platform Engineering (React, Next.js, Node, Java, .NET, Python, Go)</li>
              <li>Cloud & Platform (AWS, Azure, GCP, Kubernetes, Terraform)</li>
              <li>DevOps/SRE (CI/CD, GitOps, observability, incident response)</li>
              <li>QA Engineering (automation, performance, security testing)</li>
              <li>Data, Analytics & AI (ETL, feature stores, MLOps)</li>
              <li>UX Research & Design Systems</li>
            </ul>
          </div>
        </div>

        {/* Our Values */}
        <div className="flex flex-col md:flex-row items-start w-full gap-6 animate__animated animate__fadeInRight">
          <div className="w-full md:w-1/2 md:p-2">
            <h3 className="text-2xl font-semibold text-gray-700 text-right">Our Values</h3>
            <ul className="text-gray-600 text-sm leading-6 text-right space-y-2 mt-2">
              <li><b>Outcomes over outputs:</b> We ship measurable value, not just code.</li>
              <li><b>Reliability by design:</b> Testing, resilience, and observability from day one.</li>
              <li><b>Security everywhere:</b> Threat modeling, SAST/DAST, secrets hygiene, SBOM.</li>
              <li><b>Continuous improvement:</b> Post-mortems, runbooks, humane on-call.</li>
            </ul>
          </div>
          <div className="w-full md:w-1/2">{renderImages(ourValuesImages)}</div>
        </div>

        {/* Our Team */}
        <div className="flex flex-col md:flex-row items-start w-full gap-6 animate__animated animate__fadeInLeft">
          <div className="w-full md:w-3/5">{renderImages(ourTeamImages)}</div>
          <div className="w-full md:w-2/5 md:p-2">
            <h3 className="text-2xl font-semibold text-gray-700">Our Team</h3>
            <p className="text-gray-600 text-sm leading-6 mt-2">
              Cross-functional squads led by **engineering managers** and **tech leads** partner with
              **UX**, **QA**, **DevOps/SRE**, and **PMO** to deliver safely at speed. We default to **docs,
              ADRs, and design reviews** for clarity.
            </p>
          </div>
        </div>

        {/* Clients & Partners */}
        <div className="flex flex-col md:flex-row items-start w-full gap-6 animate__animated animate__fadeInRight">
          <div className="w-full md:w-1/2 md:p-2">
            <h3 className="text-2xl font-semibold text-gray-700 text-right">Clients & Partners</h3>
            <p className="text-gray-600 text-sm leading-6 text-right mt-2">
              We work with **startups, ISVs, and enterprises** across fintech, retail, health, and SaaS.
              Partners include hyperscalers, observability vendors, and security platforms—accelerating
              delivery while keeping costs visible (**FinOps**).
            </p>
          </div>
          <div className="w-full md:w-1/2">{renderImages(ourClientImages)}</div>
        </div>
      </section>
    </div>
  );
};

export default Layout1;
