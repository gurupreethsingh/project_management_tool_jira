// // "use client";

// // import { useState } from "react";
// // import { Switch } from "@headlessui/react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { FaUser, FaEnvelope, FaPhone, FaComment } from "react-icons/fa";
// // import globalBackendRoute from "../../config/Config";

// // export default function ContactUs() {
// //   const [formData, setFormData] = useState({
// //     firstName: "",
// //     lastName: "",
// //     email: "",
// //     phone: "",
// //     message_text: "",
// //     agreeToLicense: false,
// //   });

// //   const navigate = useNavigate();
// //   const [submitted, setSubmitted] = useState(false);

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: type === "checkbox" ? checked : value,
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const response = await axios.post(
// //         `${globalBackendRoute}/api/add-contact-message`,
// //         formData
// //       );
// //       if (response.status === 201) {
// //         setSubmitted(true);
// //         alert(
// //           "Message successfully sent! You will be notified within 24 hours."
// //         );
// //         setFormData({
// //           firstName: "",
// //           lastName: "",
// //           email: "",
// //           phone: "",
// //           message_text: "",
// //           agreeToLicense: false,
// //         });
// //         navigate("/contact");
// //       }
// //     } catch (error) {
// //       console.error("Error submitting contact message:", error);
// //       alert("There was an issue submitting your message. Please try again.");
// //     }
// //   };

// //   return (
// //     <div className="isolate bg-white px-6  sm:py-8 lg:px-8 animate__animated animate__fadeIn">
// //       <div className="mx-auto container">
// //         <div className="mb-12">
// //           <h3 className="text-2xl font-bold tracking-tight text-gray-600 sm:text-4xl">
// //             Contact Us
// //           </h3>
// //         </div>

// //         <div className="flex flex-col lg:flex-row lg:justify-between">
// //           <div className="w-full lg:w-1/2 lg:mr-8">
// //             <div className="mb-6 animate__animated animate__fadeInLeft">
// //               <iframe
// //                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.708217642363!2d77.50440487591027!3d13.054235513059428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae23460634f221%3A0x2a27c0c9577a1841!2sEcoders!5e0!3m2!1sen!2sin!4v1725038241641!5m2!1sen!2sin"
// //                 width="100%"
// //                 height="350"
// //                 allowFullScreen=""
// //                 loading="lazy"
// //                 title="Company Location"
// //                 className="rounded-lg shadow-lg"
// //               ></iframe>
// //             </div>

// //             <div className="text-left animate__animated animate__fadeInLeft">
// //               <h2 className="text-xl font-bold text-gray-600">Our Office</h2>
// //               <p className="mt-4 text-base text-gray-600">
// //                 <strong>Address :</strong> Ecoders, 3rd Floor, Defence Colony,
// //                 <br />
// //                 Above Dr. Harini Clinic, Bagaloguntte, Hesaraghatta Road,
// //                 <br />
// //                 Bangalore, Karnataka - 560057
// //                 <br />
// //                 India.
// //               </p>
// //               <p>
// //                 <strong>Phone :</strong> +91 9538596766
// //               </p>
// //               <p>
// //                 <strong>Email :</strong> igurupreeth@gmail.com,
// //                 ecoders@gmail.com
// //               </p>
// //               <p>
// //                 <strong>WebSite :</strong> www.ecoders.in
// //               </p>
// //             </div>
// //           </div>

// //           <div className="w-full lg:w-1/2 mt-10 lg:mt-0 animate__animated animate__fadeInRight">
// //             <p className="text-left border-b pb-2 mb-4">
// //               Fill in your details.
// //             </p>
// //             <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
// //               <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
// //                 <div className="relative">
// //                   <label
// //                     htmlFor="firstName"
// //                     className="block text-sm font-semibold leading-6 text-gray-900 flex items-center"
// //                   >
// //                     <FaUser className="text-blue-500 mr-2" />
// //                     First name
// //                   </label>
// //                   <div className="mt-2.5">
// //                     <input
// //                       id="firstName"
// //                       name="firstName"
// //                       type="text"
// //                       value={formData.firstName}
// //                       onChange={handleChange}
// //                       className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="relative">
// //                   <label
// //                     htmlFor="lastName"
// //                     className="block text-sm font-semibold leading-6 text-gray-900 flex items-center"
// //                   >
// //                     <FaUser className="text-green-500 mr-2" />
// //                     Last name
// //                   </label>
// //                   <div className="mt-2.5">
// //                     <input
// //                       id="lastName"
// //                       name="lastName"
// //                       type="text"
// //                       value={formData.lastName}
// //                       onChange={handleChange}
// //                       className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="relative sm:col-span-2">
// //                   <label
// //                     htmlFor="email"
// //                     className="block text-sm font-semibold leading-6 text-gray-900 flex items-center"
// //                   >
// //                     <FaEnvelope className="text-red-500 mr-2" />
// //                     Email
// //                   </label>
// //                   <div className="mt-2.5">
// //                     <input
// //                       id="email"
// //                       name="email"
// //                       type="email"
// //                       value={formData.email}
// //                       onChange={handleChange}
// //                       className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="relative sm:col-span-2">
// //                   <label
// //                     htmlFor="phone"
// //                     className="block text-sm font-semibold leading-6 text-gray-900 flex items-center"
// //                   >
// //                     <FaPhone className="text-yellow-500 mr-2" />
// //                     Phone number
// //                   </label>
// //                   <div className="mt-2.5">
// //                     <input
// //                       id="phone"
// //                       name="phone"
// //                       type="tel"
// //                       value={formData.phone}
// //                       onChange={handleChange}
// //                       className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="relative sm:col-span-2">
// //                   <label
// //                     htmlFor="message_text"
// //                     className="block text-sm font-semibold leading-6 text-gray-900 flex items-center"
// //                   >
// //                     <FaComment className="text-teal-500 mr-2" />
// //                     Drop A Message
// //                   </label>
// //                   <div className="mt-2.5">
// //                     <textarea
// //                       id="message_text"
// //                       name="message_text"
// //                       rows={4}
// //                       value={formData.message_text}
// //                       onChange={handleChange}
// //                       className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="flex gap-x-4 sm:col-span-2">
// //                   <div className="flex h-6 items-center">
// //                     <Switch
// //                       checked={formData.agreeToLicense}
// //                       onChange={(checked) =>
// //                         setFormData({ ...formData, agreeToLicense: checked })
// //                       }
// //                       className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600"
// //                     >
// //                       <span className="sr-only">Agree to policies</span>
// //                       <span
// //                         aria-hidden="true"
// //                         className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
// //                       />
// //                     </Switch>
// //                   </div>
// //                   <label className="text-sm leading-6 text-gray-600">
// //                     By selecting this, you agree to our{" "}
// //                     <a
// //                       href="/privacy-policy"
// //                       className="font-semibold text-indigo-600"
// //                     >
// //                       privacy policy
// //                     </a>
// //                     .
// //                   </label>
// //                 </div>
// //               </div>
// //               <div className="mt-10">
// //                 <button
// //                   type="submit"
// //                   className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-transform duration-300 transform hover:scale-105"
// //                 >
// //                   Get In Touch
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // till here original.

// //

// "use client";

// import { useState } from "react";
// import { Switch } from "@headlessui/react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaComment,
//   FaMapMarkerAlt,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// export default function ContactUs() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     message_text: "",
//     agreeToLicense: false,
//   });

//   const navigate = useNavigate();
//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         `${globalBackendRoute}/api/add-contact-message`,
//         formData
//       );
//       if (response.status === 201) {
//         setSubmitted(true);
//         alert(
//           "Message successfully sent! You will be notified within 24 hours."
//         );
//         setFormData({
//           firstName: "",
//           lastName: "",
//           email: "",
//           phone: "",
//           message_text: "",
//           agreeToLicense: false,
//         });
//         navigate("/contact");
//       }
//     } catch (error) {
//       console.error("Error submitting contact message:", error);
//       alert("There was an issue submitting your message. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-white min-h-screen text-slate-700">
//       {/* SIMPLE HEADER (no big gradient, no cards) */}
//       <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
//         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
//           <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
//             <div>
//               <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-pink-100">
//                 CONTACT · SOFTWARE · AI · CLOUD · BLOCKCHAIN
//               </p>
//               <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white drop-shadow-sm">
//                 Contact Us
//               </h1>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* MAIN CONTENT – no card layout for map or form */}
//       <main className="bg-white">
//         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
//             {/* LEFT: MAP + OFFICE INFO (no card wrapper) */}
//             <section className="space-y-6">
//               {/* Map with only subtle border + radius (no card bg) */}
//               <div className="overflow-hidden rounded-2xl border border-indigo-100">
//                 <iframe
//                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.708217642363!2d77.50440487591027!3d13.054235513059428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae23460634f221%3A0x2a27c0c9577a1841!2sEcoders!5e0!3m2!1sen!2sin!4v1725038241641!5m2!1sen!2sin"
//                   width="100%"
//                   height="320"
//                   allowFullScreen=""
//                   loading="lazy"
//                   title="Company Location"
//                   className="border-0"
//                 ></iframe>
//               </div>

//               {/* Office details inline (no card) */}
//               <div className="space-y-3 text-sm sm:text-base text-slate-700">
//                 <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-slate-900">
//                   <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
//                     <FaMapMarkerAlt className="text-xs" />
//                   </span>
//                   Our Office
//                 </h2>

//                 <p>
//                   <strong>Address :</strong> Ecoders, 3rd Floor, Defence Colony,
//                   <br />
//                   Above Dr. Harini Clinic, Bagaloguntte, Hesaraghatta Road,
//                   <br />
//                   Bangalore, Karnataka - 560057
//                   <br />
//                   India.
//                 </p>
//                 <p>
//                   <strong>Phone :</strong> +91 9538596766
//                 </p>
//                 <p>
//                   <strong>Email :</strong> igurupreeth@gmail.com,
//                   ecoders@gmail.com
//                 </p>
//                 <p>
//                   <strong>Website :</strong> www.ecoders.in
//                 </p>
//               </div>
//             </section>

//             {/* RIGHT: FORM (logic unchanged, no card wrapper) */}
//             <section>
//               <p className="text-xs sm:text-sm text-slate-600 border-b border-slate-200 pb-2 mb-5">
//                 Fill in your details and a short message. We&apos;ll respond via
//                 email or phone.
//               </p>

//               <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
//                 <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
//                   {/* First name */}
//                   <div className="sm:col-span-1">
//                     <label
//                       htmlFor="firstName"
//                       className="block text-sm font-semibold leading-6 text-slate-900 flex items-center"
//                     >
//                       <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mr-2">
//                         <FaUser className="text-xs" />
//                       </span>
//                       First name
//                     </label>
//                     <div className="mt-2.5">
//                       <input
//                         id="firstName"
//                         name="firstName"
//                         type="text"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         className="block w-full rounded-md border border-slate-200 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Last name */}
//                   <div className="sm:col-span-1">
//                     <label
//                       htmlFor="lastName"
//                       className="block text-sm font-semibold leading-6 text-slate-900 flex items-center"
//                     >
//                       <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-50 text-purple-600 mr-2">
//                         <FaUser className="text-xs" />
//                       </span>
//                       Last name
//                     </label>
//                     <div className="mt-2.5">
//                       <input
//                         id="lastName"
//                         name="lastName"
//                         type="text"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         className="block w-full rounded-md border border-slate-200 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Email */}
//                   <div className="sm:col-span-2">
//                     <label
//                       htmlFor="email"
//                       className="block text-sm font-semibold leading-6 text-slate-900 flex items-center"
//                     >
//                       <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-pink-50 text-pink-600 mr-2">
//                         <FaEnvelope className="text-xs" />
//                       </span>
//                       Email
//                     </label>
//                     <div className="mt-2.5">
//                       <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="block w-full rounded-md border border-slate-200 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Phone */}
//                   <div className="sm:col-span-2">
//                     <label
//                       htmlFor="phone"
//                       className="block text-sm font-semibold leading-6 text-slate-900 flex items-center"
//                     >
//                       <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mr-2">
//                         <FaPhone className="text-xs" />
//                       </span>
//                       Phone number
//                     </label>
//                     <div className="mt-2.5">
//                       <input
//                         id="phone"
//                         name="phone"
//                         type="tel"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         className="block w-full rounded-md border border-slate-200 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Message */}
//                   <div className="sm:col-span-2">
//                     <label
//                       htmlFor="message_text"
//                       className="block text-sm font-semibold leading-6 text-slate-900 flex items-center"
//                     >
//                       <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-50 text-purple-600 mr-2">
//                         <FaComment className="text-xs" />
//                       </span>
//                       Drop a message
//                     </label>
//                     <div className="mt-2.5">
//                       <textarea
//                         id="message_text"
//                         name="message_text"
//                         rows={4}
//                         value={formData.message_text}
//                         onChange={handleChange}
//                         className="block w-full rounded-md border border-slate-200 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Switch + policy text */}
//                   <div className="flex gap-x-4 sm:col-span-2 items-start">
//                     <div className="flex h-6 items-center">
//                       <Switch
//                         checked={formData.agreeToLicense}
//                         onChange={(checked) =>
//                           setFormData({ ...formData, agreeToLicense: checked })
//                         }
//                         className="group flex w-9 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600"
//                       >
//                         <span className="sr-only">Agree to policies</span>
//                         <span
//                           aria-hidden="true"
//                           className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
//                         />
//                       </Switch>
//                     </div>
//                     <label className="text-xs sm:text-sm leading-6 text-slate-600">
//                       By selecting this, you agree to our{" "}
//                       <a
//                         href="/privacy-policy"
//                         className="font-semibold text-indigo-600 hover:text-indigo-700"
//                       >
//                         privacy policy
//                       </a>
//                       .
//                     </label>
//                   </div>
//                 </div>

//                 <div className="mt-8">
//                   <button
//                     type="submit"
//                     className="block w-full rounded-xl bg-indigo-600 px-3.5 py-2.5 text-center text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-transform duration-200 transform hover:scale-[1.02]"
//                   >
//                     Get in touch
//                   </button>
//                 </div>
//               </form>
//             </section>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComment,
  FaMapMarkerAlt,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message_text: "",
    agreeToLicense: false,
  });

  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${globalBackendRoute}/api/add-contact-message`,
        formData
      );
      if (response.status === 201) {
        setSubmitted(true);
        alert(
          "Message successfully sent! You will be notified within 24 hours."
        );
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message_text: "",
          agreeToLicense: false,
        });
        navigate("/contact");
      }
    } catch (error) {
      console.error("Error submitting contact message:", error);
      alert("There was an issue submitting your message. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* HERO — SAME FEEL AS HOMEPAGE (LIGHT, MODERN, NO HEAVY BAR) */}
      <section className="relative overflow-hidden border-b border-slate-100">
        {/* soft gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] opacity-80" />

        <div className="relative mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              {/* badges row */}
              <div className="mb-3 flex flex-wrap gap-2">
                {["CONTACT", "SOFTWARE", "AI", "BLOCKCHAIN"].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 text-[11px] font-medium rounded-full bg-slate-900 text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
                Let&apos;s talk about your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  software &amp; AI projects
                </span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                Share a quick note about what you&apos;re building or exploring.
                We&apos;ll get back with clear next steps, timelines and how we
                can help.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>Typically respond within 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span>Bangalore · IST (UTC+5:30)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT — MAP + FORM, NO HEAVY CARDS */}
      <main className="bg-white">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            {/* LEFT: MAP + OFFICE INFO (no card wrapper, just clean layout) */}
            <section className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-slate-900">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white">
                    <FaMapMarkerAlt className="text-xs" />
                  </span>
                  Our office location
                </h2>
                <span className="text-[11px] sm:text-xs text-slate-500">
                  Bangalore · India
                </span>
              </div>

              {/* Map with subtle border + radius (no card bg) */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.708217642363!2d77.50440487591027!3d13.054235513059428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae23460634f221%3A0x2a27c0c9577a1841!2sEcoders!5e0!3m2!1sen!2sin!4v1725038241641!5m2!1sen!2sin"
                  width="100%"
                  height="320"
                  allowFullScreen=""
                  loading="lazy"
                  title="Company Location"
                  className="border-0"
                ></iframe>
              </div>

              {/* Office details inline (no card) */}
              <div className="space-y-3 text-sm sm:text-base text-slate-700">
                <p className="font-semibold text-slate-900">Contact details</p>
                <p className="leading-relaxed">
                  <strong>Address :</strong> Ecoders, 3rd Floor, Defence Colony,
                  <br />
                  Above Dr. Harini Clinic, Bagaloguntte, Hesaraghatta Road,
                  <br />
                  Bangalore, Karnataka - 560057
                  <br />
                  India.
                </p>
                <p>
                  <strong>Phone :</strong> +91 9538596766
                </p>
                <p>
                  <strong>Email :</strong> igurupreeth@gmail.com,
                  ecoders@gmail.com
                </p>
                <p>
                  <strong>Website :</strong> www.ecoders.in
                </p>
              </div>
            </section>

            {/* RIGHT: FORM (logic unchanged, UI modernised) */}
            <section>
              <div className="mb-5 border-b border-slate-200 pb-3">
                <p className="text-xs sm:text-sm text-slate-600">
                  Fill in your details and a short message. We&apos;ll reply
                  over email or phone with the next steps.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  {/* First name */}
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium leading-6 text-slate-900 flex items-center"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white mr-2">
                        <FaUser className="text-[11px]" />
                      </span>
                      First name
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/70 focus:border-slate-900/70 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Last name */}
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium leading-6 text-slate-900 flex items-center"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white mr-2">
                        <FaUser className="text-[11px]" />
                      </span>
                      Last name
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/70 focus:border-slate-900/70 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-slate-900 flex items-center"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white mr-2">
                        <FaEnvelope className="text-[11px]" />
                      </span>
                      Email
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/70 focus:border-slate-900/70 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-slate-900 flex items-center"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white mr-2">
                        <FaPhone className="text-[11px]" />
                      </span>
                      Phone number
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/70 focus:border-slate-900/70 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message_text"
                      className="block text-sm font-medium leading-6 text-slate-900 flex items-center"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white mr-2">
                        <FaComment className="text-[11px]" />
                      </span>
                      Drop a message
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        id="message_text"
                        name="message_text"
                        rows={4}
                        value={formData.message_text}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/70 focus:border-slate-900/70 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Switch + policy text */}
                  <div className="flex gap-x-4 sm:col-span-2 items-start">
                    <div className="flex h-6 items-center">
                      <Switch
                        checked={formData.agreeToLicense}
                        onChange={(checked) =>
                          setFormData({ ...formData, agreeToLicense: checked })
                        }
                        className="group flex w-9 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 data-[checked]:bg-slate-900"
                      >
                        <span className="sr-only">Agree to policies</span>
                        <span
                          aria-hidden="true"
                          className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                        />
                      </Switch>
                    </div>
                    <label className="text-xs sm:text-sm leading-6 text-slate-600">
                      By selecting this, you agree to our{" "}
                      <a
                        href="/privacy-policy"
                        className="font-semibold text-slate-900 underline underline-offset-2"
                      >
                        privacy policy
                      </a>
                      .
                    </label>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    className="block w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-center text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-transform duration-200 transform hover:scale-[1.02]"
                  >
                    Get in touch
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
