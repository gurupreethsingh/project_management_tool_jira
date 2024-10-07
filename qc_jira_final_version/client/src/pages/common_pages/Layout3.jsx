// import React from "react";
// import "animate.css"; // Include animate.css for animations

// const Layout3 = () => {
//   const whoWeAreImages = [
//     { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
//     { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
//     { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
//   ];

//   const ourValuesImages = [
//     { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
//     { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
//   ];

//   const ourTeamImages = [
//     { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
//     { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
//     { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
//   ];

//   const ourClientImages = [
//     { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
//     { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
//   ];

//   const renderImages = (images) => (
//     <div className="grid grid-cols-2 gap-4">
//       {images.map((image, index) => (
//         <div key={index} className="flex flex-col items-center mb-2">
//           <img
//             src={image.src}
//             alt="About Us"
//             className={`object-cover rounded-lg shadow-lg ${image.size}`}
//           />
//           <p className="text-gray-600 text-sm text-center w-full">
//             Sample text related to the image.
//           </p>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="w-full min-h-screen bg-white">
//       <h2 className="text-center fw-bold text-gray-600 p-5 text-4xl">
//         About Us
//       </h2>
//       <section className="px-4 sm:px-8 lg:px-12 py-4 space-y-8">
//         {/* First Section */}
//         <div className="w-full grid grid-cols-2 gap-4 items-start">
//           <div className="flex flex-col space-y-2 items-end">
//             {renderImages(whoWeAreImages)}
//           </div>
//           <div className="flex flex-col p-5">
//             <h2 className="text-2xl font-bold text-gray-600">Who We Are</h2>
//             <p className="text-gray-600 text-sm">
//               We are a group of passionate individuals dedicated to unlocking
//               potential and making a difference in the world through innovative
//               ideas and professional assistance.
//             </p>
//           </div>
//         </div>

//         {/* Second Section */}
//         <div className="w-full grid grid-cols-2 gap-4 items-start">
//           <div className="flex flex-col p-5">
//             <h2 className="text-2xl font-bold text-gray-600 text-right">
//               Our Values
//             </h2>
//             <p className="text-gray-600 text-sm text-right">
//               We are committed to integrity, innovation, and excellence in
//               everything we do.
//             </p>
//           </div>
//           <div className="flex flex-col space-y-2 items-start">
//             {renderImages(ourValuesImages)}
//           </div>
//         </div>

//         {/* Third Section */}
//         <div className="w-full grid grid-cols-2 gap-4 items-start">
//           <div className="flex flex-col space-y-2 items-end">
//             {renderImages(ourTeamImages)}
//           </div>
//           <div className="flex flex-col p-5">
//             <h2 className="text-2xl font-bold text-gray-600">Our Team</h2>
//             <p className="text-gray-600 text-sm">
//               Meet our dedicated team of professionals who are the backbone of
//               our success. Their expertise and commitment drive our company
//               forward every day.
//             </p>
//           </div>
//         </div>

//         {/* Fourth Section */}
//         <div className="w-full grid grid-cols-2 gap-4 items-start">
//           <div className="flex flex-col p-5">
//             <h2 className="text-2xl font-bold text-gray-600 text-right">
//               Our Clients
//             </h2>
//             <p className="text-gray-600 text-sm text-right">
//               We are proud to partner with some of the most innovative and
//               respected companies across various industries.
//             </p>
//           </div>
//           <div className="flex flex-col space-y-2 items-start">
//             {renderImages(ourClientImages)}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Layout3;

//mobile view .

import React from "react";
import "animate.css"; // Include animate.css for animations

const Layout3 = () => {
  const whoWeAreImages = [
    { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
  ];

  const ourValuesImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
  ];

  const ourTeamImages = [
    { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
  ];

  const ourClientImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
  ];

  const renderImages = (images) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col items-center mb-2">
          <img
            src={image.src}
            alt="About Us"
            className="object-cover rounded-lg shadow-lg w-full h-auto md:w-64 md:h-64"
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
      <h2 className="text-center font-bold text-gray-600 p-5 text-4xl">
        About Us
      </h2>
      <section className="px-4 sm:px-8 lg:px-12 py-4 space-y-8">
        {/* First Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2  items-start">
          <div className="flex flex-col items-end space-y-2">
            {renderImages(whoWeAreImages)}
          </div>
          <div className="flex flex-col p-5">
            <h2 className="text-2xl font-bold text-gray-600">Who We Are</h2>
            <p className="text-gray-600 text-sm">
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
        <div className="w-full grid grid-cols-1 md:grid-cols-2  items-start">
          <div className="flex flex-col p-5">
            <h2 className="text-2xl font-bold text-gray-600 text-right">
              Our Values
            </h2>
            <p className="text-gray-600 text-sm text-right">
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
          <div className="flex flex-col items-start space-y-2">
            {renderImages(ourValuesImages)}
          </div>
        </div>

        {/* Third Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start">
          <div className="flex flex-col items-end space-y-2">
            {renderImages(ourTeamImages)}
          </div>
          <div className="flex flex-col p-5">
            <h2 className="text-2xl font-bold text-gray-600">Our Team</h2>
            <p className="text-gray-600 text-sm">
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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start">
          <div className="flex flex-col p-5">
            <h2 className="text-2xl font-bold text-gray-600 text-right">
              Our Clients
            </h2>
            <p className="text-gray-600 text-sm text-right">
              We are proud to partner with some of the most innovative and
              respected companies across various industries.
            </p>
          </div>
          <div className="flex flex-col items-start space-y-2">
            {renderImages(ourClientImages)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Layout3;
