// file: src/pages/Layout2.jsx
import React from "react";
import "animate.css";

const ecommerceCaptions = [
  "Nationwide delivery network",
  "Real-time order tracking",
  "Quality-checked inventory",
  "Secure, compliant payments",
  "Verified seller onboarding",
];

const Layout2 = () => {
  const whoWeAreImages = [
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: ecommerceCaptions[0] },
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: ecommerceCaptions[1] },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: ecommerceCaptions[2] },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: ecommerceCaptions[3] },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: ecommerceCaptions[4] },
  ];

  const ourValuesImages = [
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Customer-first decisions" },
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: "Safe, ethical logistics" },
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: "Operational excellence" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Privacy by design" },
  ];

  const ourTeamImages = [
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: "Engineering & platform" },
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: "Data & recommendations" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: "Seller & brand success" },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: "FC & last-mile" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: "Customer experience" },
  ];

  const ourClientImages = [
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "SMB merchants" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Direct-to-consumer brands" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "National distributors" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Payment partners" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "3PL logistics" },
  ];

  const renderImages = (images) => (
    <div className="flex flex-wrap justify-center gap-x-2">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col items-center justify-center mb-2">
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
              We are a modern e-commerce marketplace connecting buyers with vetted sellers across categories.
              Our platform delivers **fast discovery**, transparent pricing, safe payments, and reliable fulfillment—
              backed by data-driven operations and customer support you can rely on.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="w-full flex flex-col space-y-4">
          <div className="flex flex-col p-4">
            {renderImages(ourValuesImages)}
            <h3 className="text-2xl font-semibold text-gray-700 text-center mt-2">Our Values</h3>
            <ul className="text-gray-600 text-sm text-center leading-6 space-y-2 mt-2">
              <li><b>Trust & Safety:</b> Authentic products and fair policies.</li>
              <li><b>Reliability:</b> SLA-driven warehousing and last-mile delivery.</li>
              <li><b>Growth for Sellers:</b> Catalog quality, pricing insights, and promotions.</li>
              <li><b>Privacy:</b> Secure, compliant processing of data and payments.</li>
            </ul>
          </div>
        </div>

        {/* Our Team */}
        <div className="w-full flex flex-col space-y-4">
          {renderImages(ourTeamImages)}
          <div className="flex flex-col p-4">
            <h3 className="text-2xl font-semibold text-gray-700 text-center">Our Team</h3>
            <p className="text-gray-600 text-sm text-center leading-6 mt-2">
              From engineers and data scientists to CX, ops, and seller success—our teams work as one to
              deliver **affordable, fast, and delightful** shopping for everyone.
            </p>
          </div>
        </div>

        {/* Customers & Partners */}
        <div className="w-full flex flex-col space-y-4">
          <div className="flex flex-col p-4">
            {renderImages(ourClientImages)}
            <h3 className="text-2xl font-semibold text-gray-700 text-center mt-2">
              Our Customers & Partners
            </h3>
            <p className="text-gray-600 text-sm text-center leading-6 mt-1">
              We collaborate with SMBs, brands, payment providers, and logistics partners to make everyday
              shopping **simple, safe, and accessible**.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Layout2;
