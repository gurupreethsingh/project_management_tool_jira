// file: src/pages/Layout3.jsx
import React from "react";
import "animate.css";

const cap = {
  who: ["Composable architectures", "Platform engineering", "Continuous delivery"],
  values: ["Reliability first", "Security by default"],
  team: ["Engineering leadership", "DevOps/SRE guilds", "QA & AppSec"],
  clients: ["ISVs & SaaS", "Enterprises & startups"],
};

const Layout3 = () => {
  const whoWeAreImages = [
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: cap.who[0] },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: cap.who[1] },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: cap.who[2] },
  ];

  const ourValuesImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: cap.values[0] },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: cap.values[1] },
  ];

  const ourTeamImages = [
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: cap.team[0] },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: cap.team[1] },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: cap.team[2] },
  ];

  const ourClientImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: cap.clients[0] },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: cap.clients[1] },
  ];

  const renderImages = (images) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((image, i) => (
        <div key={i} className="flex flex-col items-center mb-2">
          <img
            src={image.src}
            alt={image.caption || "About us"}
            className="object-cover rounded-lg shadow-lg w-full h-auto md:w-64 md:h-64"
          />
          <p className="text-gray-600 text-sm text-center w-full">{image.caption}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white">
      <h2 className="text-center font-bold text-gray-700 p-5 text-3xl sm:text-4xl animate__animated animate__fadeInDown">
        About Us
      </h2>

      <section className="px-4 sm:px-8 lg:px-12 py-4 space-y-8">
        {/* Who We Are */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start gap-6">
          <div className="flex flex-col items-end space-y-2">{renderImages(whoWeAreImages)}</div>
          <div className="flex flex-col p-4">
            <h3 className="text-2xl font-semibold text-gray-700">Who We Are</h3>
            <p className="text-gray-600 text-sm leading-6 mt-2">
              We help organisations **ship faster and safer** with **API-first product engineering**, **cloud platforms**,
              and **automated delivery pipelines**. Engagements range from green-field builds to modernisation and SRE
              transformations, always anchored in **measurable business outcomes**.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-sm">
              <span>• Product/Platform Engineering</span>
              <span>• Cloud, Containers, IaC</span>
              <span>• DevOps, CI/CD, GitOps</span>
              <span>• SRE, SLIs/SLOs, On-call</span>
              <span>• QA Automation & Perf</span>
              <span>• AppSec & Compliance</span>
              <span>• Data Eng/AI/MLOps</span>
              <span>• UX Research & Design</span>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start gap-6">
          <div className="flex flex-col p-4">
            <h3 className="text-2xl font-semibold text-gray-700 text-right">Our Values</h3>
            <ul className="text-gray-600 text-sm leading-6 text-right space-y-2 mt-2">
              <li><b>Engineering excellence:</b> ADRs, code reviews, and performance budgets.</li>
              <li><b>Reliability:</b> Observability, chaos drills, capacity planning.</li>
              <li><b>Security:</b> SBOM, SAST/DAST, supply-chain hardening.</li>
              <li><b>Ownership:</b> Clear SLAs, post-mortems, continuous learning.</li>
            </ul>
          </div>
          <div className="flex flex-col items-start space-y-2">{renderImages(ourValuesImages)}</div>
        </div>

        {/* Our Team */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start gap-6">
          <div className="flex flex-col items-end space-y-2">{renderImages(ourTeamImages)}</div>
          <div className="flex flex-col p-4">
            <h3 className="text-2xl font-semibold text-gray-700">Our Team</h3>
            <p className="text-gray-600 text-sm leading-6 mt-2">
              Squads blend **engineering leadership**, **DevOps/SRE guilds**, **QA/AppSec**, and **product/UX**—
              supported by **PMO** for governance and transparency.
            </p>
          </div>
        </div>

        {/* Clients & Partners */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start gap-6">
          <div className="flex flex-col p-4">
            <h3 className="text-2xl font-semibold text-gray-700 text-right">Clients & Partners</h3>
            <p className="text-gray-600 text-sm leading-6 text-right mt-2">
              From **SaaS and ISVs** to **regulated enterprises**, we co-create with cloud, security, and
              observability partners to accelerate delivery—without compromising safety or cost visibility.
            </p>
          </div>
          <div className="flex flex-col items-start space-y-2">{renderImages(ourClientImages)}</div>
        </div>
      </section>
    </div>
  );
};

export default Layout3;
