import React from "react";
import "animate.css"; // Include animate.css for animations

const Layout2 = () => {
  const whoWeAreImages = [
    { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
    { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
  ];

  const ourValuesImages = [
    { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
    { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
    { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
  ];

  const ourTeamImages = [
    { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
    { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
  ];

  const ourClientImages = [
    { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
  ];

  const renderImages = (images) => (
    <div className="flex flex-wrap justify-center space-x-2">
      {images.map((image, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center mb-2"
        >
          <img
            src={image.src}
            alt="About Us"
            className={`object-cover rounded-lg shadow-lg ${image.size}`}
          />
          <p className="text-gray-600 text-sm text-center w-full">
            Sample text related to the image.
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white">
      <h2 className="text-center fw-bold text-gray-600 p-5 text-4xl">
        About Us
      </h2>
      <section className="flex flex-col items-center px-4 sm:px-8 lg:px-12 py-4 space-y-8">
        {/* First Section */}
        <div className="w-full flex flex-col space-y-4">
          {renderImages(whoWeAreImages)}
          <div className="flex flex-col p-5">
            <h2 className="text-2xl font-bold text-gray-600 text-center">
              Who We Are
            </h2>
            <p className="text-gray-600 text-sm text-center">
              At the core of our company lies a passion for innovation and a
              commitment to excellence. We specialize in building cutting-edge
              AI solutions, pioneering blockchain technology, and developing
              both web and mobile applications that push the boundaries of
              what’s possible. Our team is a blend of creative thinkers,
              technical experts, and problem-solvers who are dedicated to
              delivering impactful software solutions. Whether it’s constructing
              robust client applications using MERN, Next.js, or WordPress, or
              ensuring the highest standards in software testing, we strive to
              exceed expectations and drive success for our clients.
            </p>
          </div>
        </div>

        {/* Second Section */}
        <div className="w-full flex flex-col space-y-4">
          <div className="flex flex-col p-5">
            {renderImages(ourValuesImages)}
            <h2 className="text-2xl font-bold text-gray-600 text-center">
              Our Values
            </h2>
            <p className="text-gray-600 text-sm text-center">
              We believe in a set of core values that guide everything we do.
              Integrity, innovation, and excellence are the pillars of our work.
              Our dedication to these principles ensures that every project we
              undertake not only meets but exceeds the expectations of our
              clients. We are committed to delivering quality solutions with a
              focus on sustainability and scalability. Our emphasis on
              continuous learning and adaptation enables us to stay ahead in a
              rapidly evolving industry, while our client-centric approach
              ensures that the solutions we build are tailored to meet the
              unique needs of those we serve.
            </p>
          </div>
        </div>

        {/* Third Section */}
        <div className="w-full flex flex-col space-y-4">
          {renderImages(ourTeamImages)}
          <div className="flex flex-col p-5">
            <h2 className="text-2xl font-bold text-gray-600 text-center">
              Our Team
            </h2>
            <p className="text-gray-600 text-sm text-center">
              Our team is our greatest asset. Comprised of seasoned
              professionals and bright minds, we bring together a diverse range
              of skills and expertise to create a powerhouse of innovation. From
              AI architects and blockchain developers to web and mobile app
              specialists, our team excels in delivering top-tier solutions
              across various platforms. We also pride ourselves on being the
              best in the industry when it comes to software testing, ensuring
              that every application we build is robust, secure, and ready for
              deployment. Beyond development, we are committed to fostering the
              next generation of tech leaders through our comprehensive training
              programs, offering real hands-on projects and unparalleled
              placement opportunities in the industry.
            </p>
          </div>
        </div>

        {/* Fourth Section */}
        <div className="w-full flex flex-col space-y-4">
          <div className="flex flex-col p-5">
            {renderImages(ourClientImages)}
            <h2 className="text-2xl font-bold text-gray-600 text-center">
              Our Clients
            </h2>
            <p className="text-gray-600 text-sm text-center">
              We are proud to partner with some of the most innovative and
              respected companies across various industries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Layout2;
