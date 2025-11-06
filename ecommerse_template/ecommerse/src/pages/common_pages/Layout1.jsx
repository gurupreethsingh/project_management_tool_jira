// file: src/pages/Layout1.jsx
import React from "react";
import "animate.css";

const ecommerceCaptions = [
  "Nationwide delivery network",
  "Real-time order tracking",
  "Quality-checked inventory",
  "Secure, compliant payments",
];

const Layout1 = () => {
  const whoWeAreImages = [
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: ecommerceCaptions[0] },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: ecommerceCaptions[1] },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: ecommerceCaptions[2] },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: ecommerceCaptions[3] },
  ];

  const ourValuesImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: "Customer-first decisions" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Ethical sourcing" },
  ];

  const ourTeamImages = [
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: "Warehouse & last-mile teams" },
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: "Engineering & data science" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: "Seller success managers" },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: "Customer experience (CX)" },
  ];

  const ourClientImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: "Brands & SMB sellers" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: "Buyers in 10k+ pincodes" },
  ];

  const renderImages = (images) => (
    <div className="flex flex-wrap justify-center md:justify-start gap-x-2">
      {images.map((image, index) => (
        <div
          key={index}
          className="flex flex-col items-center mb-2 w-full md:w-auto animate__animated animate__zoomIn"
        >
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
            <h3 className="text-2xl font-semibold text-gray-700 animate__animated animate__fadeInRight">
              Who We Are
            </h3>
            <p className="text-gray-600 text-sm leading-6 mt-2 animate__animated animate__fadeInRight">
              We’re a commerce platform connecting **buyers across India** with **trusted brands and local sellers**.
              From catalog and pricing to payments, fulfillment, and last-mile delivery, we manage the end-to-end
              journey so customers receive the **right product, at the right price, on time**. Our stack powers
              lightning-fast search, personalized recommendations, secure payments (UPI/cards), and **real-time order
              tracking**—while our operations team maintains **SLA-driven fulfillment** across cities and towns.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="flex flex-col md:flex-row items-start w-full gap-6 animate__animated animate__fadeInRight">
          <div className="w-full md:w-1/2 md:p-2">
            <h3 className="text-2xl font-semibold text-gray-700 text-right animate__animated animate__fadeInLeft">
              Our Values
            </h3>
            <ul className="text-gray-600 text-sm leading-6 text-right space-y-2 mt-2 animate__animated animate__fadeInLeft">
              <li><b>Customer Obsession:</b> Decisions begin with buyer trust—quality listings, transparent pricing, and easy returns.</li>
              <li><b>Seller Empowerment:</b> Tools for onboarding, catalog quality, pricing, ads, and growth programs.</li>
              <li><b>Operational Excellence:</b> Reliable SLAs, safety-first warehouses, and ethical, sustainable logistics.</li>
              <li><b>Privacy & Security:</b> PCI-DSS compliant payments and rigorous data protection by design.</li>
            </ul>
          </div>
          <div className="w-full md:w-1/2">{renderImages(ourValuesImages)}</div>
        </div>

        {/* Our Team */}
        <div className="flex flex-col md:flex-row items-start w-full gap-6 animate__animated animate__fadeInLeft">
          <div className="w-full md:w-3/5">{renderImages(ourTeamImages)}</div>
          <div className="w-full md:w-2/5 md:p-2">
            <h3 className="text-2xl font-semibold text-gray-700 animate__animated animate__fadeInRight">
              Our Team
            </h3>
            <p className="text-gray-600 text-sm leading-6 mt-2 animate__animated animate__fadeInRight">
              We’re engineers, data scientists, product managers, catalog specialists, seller success managers,
              warehouse operators, delivery partners, and CX experts—**one team** focused on reliable shopping.
              We ship fast, measure everything, and continuously improve based on buyer and seller feedback.
            </p>
          </div>
        </div>

        {/* Our Clients / Partners */}
        <div className="flex flex-col md:flex-row items-start w-full gap-6 animate__animated animate__fadeInRight">
          <div className="w-full md:w-1/2 md:p-2">
            <h3 className="text-2xl font-semibold text-gray-700 text-right animate__animated animate__fadeInLeft">
              Our Customers & Partners
            </h3>
            <p className="text-gray-600 text-sm leading-6 text-right mt-2 animate__animated animate__fadeInLeft">
              We serve **millions of buyers** and thousands of **SMB/enterprise sellers**. Whether it’s daily essentials,
              fashion, or electronics, we ensure compliant listings and **authentic products**. Our partners include
              payment providers, logistics networks, and brand owners—together enabling **fast, safe, affordable commerce**.
            </p>
          </div>
          <div className="w-full md:w-1/2">{renderImages(ourClientImages)}</div>
        </div>
      </section>
    </div>
  );
};

export default Layout1;
