// file: src/pages/Layout3.jsx
import React from "react";
import "animate.css";

const ecommerceCaptions = {
  who: ["Nationwide coverage", "Live tracking", "QC & authenticity"],
  values: ["Customer-first", "Sustainable logistics"],
  team: ["Engineering", "Seller success", "Operations"],
  clients: ["Brands & SMBs", "Payment & logistics partners"],
};

const Layout3 = () => {
  const whoWeAreImages = [
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: ecommerceCaptions.who[0] },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: ecommerceCaptions.who[1] },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: ecommerceCaptions.who[2] },
  ];

  const ourValuesImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: ecommerceCaptions.values[0] },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: ecommerceCaptions.values[1] },
  ];

  const ourTeamImages = [
    { src: "https://via.placeholder.com/300", size: "w-64 h-64", caption: ecommerceCaptions.team[0] },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72", caption: ecommerceCaptions.team[1] },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56", caption: ecommerceCaptions.team[2] },
  ];

  const ourClientImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80", caption: ecommerceCaptions.clients[0] },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40", caption: ecommerceCaptions.clients[1] },
  ];

  const renderImages = (images) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col items-center mb-2">
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
              We’re building a **reliable, affordable** shopping experience at scale. Our marketplace and logistics
              network brings together **verified sellers**, transparent pricing, secure payments, and fast delivery—
              so customers can shop with confidence, wherever they are.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start gap-6">
          <div className="flex flex-col p-4">
            <h3 className="text-2xl font-semibold text-gray-700 text-right">Our Values</h3>
            <ul className="text-gray-600 text-sm leading-6 text-right space-y-2 mt-2">
              <li><b>Customer Trust:</b> Clear information, fair policies, easy returns.</li>
              <li><b>Operational Rigor:</b> Measured SLAs, safety, and continuous improvement.</li>
              <li><b>Seller Growth:</b> Tools for catalog quality, pricing, ads, and fulfillment.</li>
              <li><b>Security & Privacy:</b> Compliant payments and responsible data use.</li>
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
              Diverse teams across **engineering, data, product, operations, CX, and seller success** collaborate daily
              to deliver a seamless experience from “Search” to “Delivered”.
            </p>
          </div>
        </div>

        {/* Customers & Partners */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start gap-6">
          <div className="flex flex-col p-4">
            <h3 className="text-2xl font-semibold text-gray-700 text-right">Our Customers & Partners</h3>
            <p className="text-gray-600 text-sm leading-6 text-right mt-2">
              We support **buyers** across cities and towns, and help **sellers** scale with logistics, payments,
              and insights—partnering with trusted brands, payment providers, and 3PLs.
            </p>
          </div>
          <div className="flex flex-col items-start space-y-2">{renderImages(ourClientImages)}</div>
        </div>
      </section>
    </div>
  );
};

export default Layout3;
