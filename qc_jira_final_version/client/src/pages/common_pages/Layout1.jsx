// import React from "react";
// import "animate.css"; // Include animate.css for animations

// const Layout1 = () => {
//   const whoWeAreImages = [
//     { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
//     { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
//     { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
//     { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
//   ];

//   const ourValuesImages = [
//     { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
//     { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
//   ];

//   const ourTeamImages = [
//     { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
//     { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
//     { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
//     { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
//   ];

//   const ourClientImages = [
//     { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
//     { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
//   ];

//   const renderImages = (images) => (
//     <div className="flex flex-wrap justify-center md:justify-start space-x-2">
//       {images.map((image, index) => (
//         <div
//           key={index}
//           className="flex flex-col items-center mb-2 w-full md:w-auto"
//         >
//           <img
//             src={image.src}
//             alt="About Us"
//             className="object-cover rounded-lg shadow-lg w-full h-auto md:w-64 md:h-64"
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
//       <h2 className="text-center font-bold text-gray-600 p-5 text-4xl">
//         About Us
//       </h2>
//       <section className="flex flex-col items-center px-4 sm:px-8 lg:px-12 py-4 space-y-4">
//         {/* First Section */}
//         <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0">
//           <div className="w-full sm:w-full md:w-3/2 flex flex-col space-y-2  sm:items-end md:items-end lg:items-center">
//             {renderImages(whoWeAreImages)}
//           </div>
//           <div className="w-full sm:w-full md:w-2/4 flex flex-col sm:p-0 md:p-5">
//             <h2 className="text-2xl font-bold text-gray-600">Who We Are</h2>
//             <p className="text-gray-600 text-sm">
//               At the core of our company lies a passion for innovation and a
//               commitment to excellence. We specialize in building cutting-edge
//               AI solutions, pioneering blockchain technology, and developing
//               both web and mobile applications that push the boundaries of
//               what’s possible. Our team is a blend of creative thinkers,
//               technical experts, and problem-solvers who are dedicated to
//               delivering impactful software solutions. Whether it’s constructing
//               robust client applications using MERN, Next.js, or WordPress, or
//               ensuring the highest standards in software testing, we strive to
//               exceed expectations and drive success for our clients.
//             </p>
//           </div>
//         </div>

//         {/* Second Section */}
//         <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0">
//           <div className="w-full md:w-1/2 flex flex-col p-5">
//             <h2 className="text-2xl font-bold text-gray-600 text-right">
//               Our Values
//             </h2>
//             <p className="text-gray-600 text-sm text-right">
//               We believe in a set of core values that guide everything we do.
//               Integrity, innovation, and excellence are the pillars of our work.
//               Our dedication to these principles ensures that every project we
//               undertake not only meets but exceeds the expectations of our
//               clients. We are committed to delivering quality solutions with a
//               focus on sustainability and scalability. Our emphasis on
//               continuous learning and adaptation enables us to stay ahead in a
//               rapidly evolving industry, while our client-centric approach
//               ensures that the solutions we build are tailored to meet the
//               unique needs of those we serve.
//             </p>
//           </div>
//           <div className="w-full md:w-1/2 flex flex-col space-y-2 pr-5">
//             {renderImages(ourValuesImages)}
//           </div>
//         </div>

//         {/* Third Section */}
//         <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0">
//           <div className="w-full sm:w-full md:w-3/2 flex flex-col space-y-2  sm:items-end md:items-end lg:items-center">
//             {renderImages(ourTeamImages)}
//           </div>
//           <div className="w-full sm:w-full md:w-2/4 flex flex-col sm:p-0 md:p-5">
//             <h2 className="text-2xl font-bold text-gray-600">Our Team</h2>
//             <p className="text-gray-600 text-sm">
//               We are a group of passionate individuals dedicated to unlocking
//               potential and making a difference in the world through innovative
//               ideas and professional assistance.
//             </p>
//           </div>
//         </div>

//         {/* Fourth Section */}
//         <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0">
//           <div className="w-full md:w-1/2 flex flex-col p-5">
//             <h2 className="text-2xl font-bold text-gray-600 text-right">
//               Our Clients
//             </h2>
//             <p className="text-gray-600 text-sm text-right">
//               Our team is our greatest asset. Comprised of seasoned
//               professionals and bright minds, we bring together a diverse range
//               of skills and expertise to create a powerhouse of innovation. From
//               AI architects and blockchain developers to web and mobile app
//               specialists, our team excels in delivering top-tier solutions
//               across various platforms. We also pride ourselves on being the
//               best in the industry when it comes to software testing, ensuring
//               that every application we build is robust, secure, and ready for
//               deployment. Beyond development, we are committed to fostering the
//               next generation of tech leaders through our comprehensive training
//               programs, offering real hands-on projects and unparalleled
//               placement opportunities in the industry.
//             </p>
//           </div>
//           <div className="w-full md:w-1/2 flex flex-col space-y-2 pr-5">
//             {renderImages(ourClientImages)}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Layout1;

// animated code.

// import React from "react";
// import "animate.css"; // Include animate.css for animations

// const Layout1 = () => {
//   const whoWeAreImages = [
//     { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
//     { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
//     { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
//     { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
//   ];

//   const ourValuesImages = [
//     { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
//     { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
//   ];

//   const ourTeamImages = [
//     { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
//     { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
//     { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
//     { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
//   ];

//   const ourClientImages = [
//     { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
//     { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
//   ];

//   const renderImages = (images) => (
//     <div className="flex flex-wrap justify-center md:justify-start space-x-2">
//       {images.map((image, index) => (
//         <div
//           key={index}
//           className="flex flex-col items-center mb-2 w-full md:w-auto animate__animated animate__zoomIn"
//         >
//           <img
//             src={image.src}
//             alt="About Us"
//             className="object-cover rounded-lg shadow-lg w-full h-auto md:w-64 md:h-64"
//           />
//           <p className="text-gray-600 text-sm text-center w-full animate__animated animate__fadeInUp">
//             Sample text related to the image.
//           </p>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="w-full min-h-screen bg-white">
//       <h2 className="text-center font-bold text-gray-600 p-5 text-4xl animate__animated animate__fadeInDown">
//         About Us
//       </h2>
//       <section className="flex flex-col items-center px-4 sm:px-8 lg:px-12 py-4 space-y-4">
//         {/* First Section */}
//         <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0 animate__animated animate__fadeInLeft">
//           <div className="w-full sm:w-full md:w-3/2 flex flex-col space-y-2 sm:items-end md:items-end lg:items-center">
//             {renderImages(whoWeAreImages)}
//           </div>
//           <div className="w-full sm:w-full md:w-2/4 flex flex-col sm:p-0 md:p-5">
//             <h2 className="text-2xl font-bold text-gray-600 animate__animated animate__fadeInRight">
//               Who We Are
//             </h2>
//             <p className="text-gray-600 text-sm animate__animated animate__fadeInRight">
//               At the core of our company lies a passion for innovation and a
//               commitment to excellence. We specialize in building cutting-edge
//               AI solutions, pioneering blockchain technology, and developing
//               both web and mobile applications that push the boundaries of
//               what’s possible. Our team is a blend of creative thinkers,
//               technical experts, and problem-solvers who are dedicated to
//               delivering impactful software solutions. Whether it’s constructing
//               robust client applications using MERN, Next.js, or WordPress, or
//               ensuring the highest standards in software testing, we strive to
//               exceed expectations and drive success for our clients.
//             </p>
//           </div>
//         </div>

//         {/* Second Section */}
//         <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0 animate__animated animate__fadeInRight">
//           <div className="w-full md:w-1/2 flex flex-col p-5">
//             <h2 className="text-2xl font-bold text-gray-600 text-right animate__animated animate__fadeInLeft">
//               Our Values
//             </h2>
//             <p className="text-gray-600 text-sm text-right animate__animated animate__fadeInLeft">
//               We believe in a set of core values that guide everything we do.
//               Integrity, innovation, and excellence are the pillars of our work.
//               Our dedication to these principles ensures that every project we
//               undertake not only meets but exceeds the expectations of our
//               clients. We are committed to delivering quality solutions with a
//               focus on sustainability and scalability. Our emphasis on
//               continuous learning and adaptation enables us to stay ahead in a
//               rapidly evolving industry, while our client-centric approach
//               ensures that the solutions we build are tailored to meet the
//               unique needs of those we serve.
//             </p>
//           </div>
//           <div className="w-full md:w-1/2 flex flex-col space-y-2 pr-5">
//             {renderImages(ourValuesImages)}
//           </div>
//         </div>

//         {/* Third Section */}
//         <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0 animate__animated animate__fadeInLeft">
//           <div className="w-full sm:w-full md:w-3/2 flex flex-col space-y-2 sm:items-end md:items-end lg:items-center">
//             {renderImages(ourTeamImages)}
//           </div>
//           <div className="w-full sm:w-full md:w-2/4 flex flex-col sm:p-0 md:p-5">
//             <h2 className="text-2xl font-bold text-gray-600 animate__animated animate__fadeInRight">
//               Our Team
//             </h2>
//             <p className="text-gray-600 text-sm animate__animated animate__fadeInRight">
//               We are a group of passionate individuals dedicated to unlocking
//               potential and making a difference in the world through innovative
//               ideas and professional assistance.
//             </p>
//           </div>
//         </div>

//         {/* Fourth Section */}
//         <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0 animate__animated animate__fadeInRight">
//           <div className="w-full md:w-1/2 flex flex-col p-5">
//             <h2 className="text-2xl font-bold text-gray-600 text-right animate__animated animate__fadeInLeft">
//               Our Clients
//             </h2>
//             <p className="text-gray-600 text-sm text-right animate__animated animate__fadeInLeft">
//               Our team is our greatest asset. Comprised of seasoned
//               professionals and bright minds, we bring together a diverse range
//               of skills and expertise to create a powerhouse of innovation. From
//               AI architects and blockchain developers to web and mobile app
//               specialists, our team excels in delivering top-tier solutions
//               across various platforms. We also pride ourselves on being the
//               best in the industry when it comes to software testing, ensuring
//               that every application we build is robust, secure, and ready for
//               deployment. Beyond development, we are committed to fostering the
//               next generation of tech leaders through our comprehensive training
//               programs, offering real hands-on projects and unparalleled
//               placement opportunities in the industry.
//             </p>
//           </div>
//           <div className="w-full md:w-1/2 flex flex-col space-y-2 pr-5">
//             {renderImages(ourClientImages)}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Layout1;

// spacious layout.

import React from "react";
import "animate.css"; // Include animate.css for animations

const Layout1 = () => {
  const whoWeAreImages = [
    { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
  ];

  const ourValuesImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
  ];

  const ourTeamImages = [
    { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
    { src: "https://via.placeholder.com/300", size: "w-64 h-64" },
    { src: "https://via.placeholder.com/350", size: "w-72 h-72" },
    { src: "https://via.placeholder.com/250", size: "w-56 h-56" },
  ];

  const ourClientImages = [
    { src: "https://via.placeholder.com/400", size: "w-80 h-80" },
    { src: "https://via.placeholder.com/200", size: "w-40 h-40" },
  ];

  const renderImages = (images) => (
    <div className="flex flex-wrap justify-center md:justify-start space-x-2">
      {images.map((image, index) => (
        <div
          key={index}
          className="flex flex-col items-center mb-2 w-full md:w-auto animate__animated animate__zoomIn"
        >
          <img
            src={image.src}
            alt="About Us"
            className="object-cover rounded-lg shadow-lg w-full h-auto md:w-64 md:h-64"
          />
          <p className="text-gray-600 text-sm text-center w-full animate__animated animate__fadeInUp">
            Sample text related to the image.
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white px-8 lg:px-16">
      <h2 className="text-center font-bold text-gray-600 p-5 text-4xl animate__animated animate__fadeInDown">
        About Us
      </h2>
      <section className="flex flex-col items-center py-4 space-y-4">
        {/* First Section */}
        <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0 animate__animated animate__fadeInLeft">
          <div className="w-full sm:w-full md:w-3/2 flex flex-col space-y-2 sm:items-end md:items-end lg:items-center">
            {renderImages(whoWeAreImages)}
          </div>
          <div className="w-full sm:w-full md:w-2/4 flex flex-col sm:p-0 md:p-5">
            <h2 className="text-2xl font-bold text-gray-600 animate__animated animate__fadeInRight">
              Who We Are
            </h2>
            <p className="text-gray-600 text-sm animate__animated animate__fadeInRight">
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
        <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0 animate__animated animate__fadeInRight">
          <div className="w-full md:w-1/2 flex flex-col p-5">
            <h2 className="text-2xl font-bold text-gray-600 text-right animate__animated animate__fadeInLeft">
              Our Values
            </h2>
            <p className="text-gray-600 text-sm text-right animate__animated animate__fadeInLeft">
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
          <div className="w-full md:w-1/2 flex flex-col space-y-2 pr-5">
            {renderImages(ourValuesImages)}
          </div>
        </div>

        {/* Third Section */}
        <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0 animate__animated animate__fadeInLeft">
          <div className="w-full sm:w-full md:w-3/2 flex flex-col space-y-2 sm:items-end md:items-end lg:items-center">
            {renderImages(ourTeamImages)}
          </div>
          <div className="w-full sm:w-full md:w-2/4 flex flex-col sm:p-0 md:p-5">
            <h2 className="text-2xl font-bold text-gray-600 animate__animated animate__fadeInRight">
              Our Team
            </h2>
            <p className="text-gray-600 text-sm animate__animated animate__fadeInRight">
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
        <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0 animate__animated animate__fadeInRight">
          <div className="w-full md:w-1/2 flex flex-col p-5">
            <h2 className="text-2xl font-bold text-gray-600 text-right animate__animated animate__fadeInLeft">
              Our Clients
            </h2>
            <p className="text-gray-600 text-sm text-right animate__animated animate__fadeInLeft">
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
          <div className="w-full md:w-1/2 flex flex-col space-y-2 pr-5">
            {renderImages(ourClientImages)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Layout1;
