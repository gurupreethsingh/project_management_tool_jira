// // Footer.jsx
// import React from "react";
// import SubscriptionForm from "./SubscriptionForm";
// import { FaFacebookF, FaTwitter, FaGithub, FaLinkedinIn } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-gray-300 pt-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Top Section */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
//           {/* Company Info */}
//           <div>
//             <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
//             <ul className="space-y-2">
//               <li>
//                 <a href="/about-us" className="hover:text-white transition">
//                   About Us
//                 </a>
//               </li>
//               <li>
//                 <a href="/contact-us" className="hover:text-white transition">
//                   Contact Us
//                 </a>
//               </li>
//               <li>
//                 <a href="/careers" className="hover:text-white transition">
//                   Careers
//                 </a>
//               </li>
//               <li>
//                 <a href="/all-blogs" className="hover:text-white transition">
//                   Blogs
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
//             <ul className="space-y-2">
//               <li>
//                 <a href="/help-center" className="hover:text-white transition">
//                   Help Center
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="/privacy-policy"
//                   className="hover:text-white transition"
//                 >
//                   Privacy Policy
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="/terms-of-service"
//                   className="hover:text-white transition"
//                 >
//                   Terms of Service
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Social Media */}
//           <div>
//             <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
//             <div className="flex space-x-4">
//               <a href="https://www.facebook.com" target="_blank" className="hover:text-white transition">
//                 <FaFacebookF />
//               </a>
//               <a href="https://www.twitter.com"  target="_blank"  className="hover:text-white transition">
//                 <FaTwitter />
//               </a>
//               <a href="https://www.github.com"  target="_blank"  className="hover:text-white transition">
//                 <FaGithub />
//               </a>
//               <a href="https://www.linkedin.com"  target="_blank"  className="hover:text-white transition">
//                 <FaLinkedinIn />
//               </a>
//             </div>
//           </div>

//           {/* Subscription Form */}
//           <div>
//             <h3 className="text-white text-lg font-semibold mb-4">Subscribe</h3>
//             <SubscriptionForm />
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
//           <p className="text-sm">
//             &copy; 2025 Ecoders, Inc. All rights reserved.
//           </p>
//           <p className="text-sm mt-4 md:mt-0">Empowering online shopping — one click at a time.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

// till here old code.

// Footer.jsx
import React, { useMemo } from "react";
import SubscriptionForm from "./SubscriptionForm";
import {
  FaFacebookF,
  FaTwitter,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaRegClock,
  FaRegEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaHeadset,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";
import { RiSecurePaymentFill } from "react-icons/ri";
import { HiOutlineSparkles } from "react-icons/hi";

const Footer = () => {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="hp-font bg-gradient-to-b from-orange-50 via-white to-white text-gray-700 mt-5">
      {/* Font + small utilities (lightweight) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .hp-font {
          font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial,
            'Apple Color Emoji','Segoe UI Emoji';
        }
      `}</style>

      {/* Top highlight strip */}
      <div className="border-t border-orange-100">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {[
              {
                icon: <FaTruck className="w-5 h-5 text-orange-600" />,
                title: "Fast Delivery",
                desc: "Quick shipping on popular items",
              },
              {
                icon: <FaUndoAlt className="w-5 h-5 text-orange-600" />,
                title: "Easy Returns",
                desc: "Hassle-free return policy",
              },
              {
                icon: <FaShieldAlt className="w-5 h-5 text-orange-600" />,
                title: "Buyer Protection",
                desc: "Safe shopping experience",
              },
              {
                icon: <FaHeadset className="w-5 h-5 text-orange-600" />,
                title: "Support",
                desc: "Help when you need it",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-2xl bg-white/80 backdrop-blur border border-orange-100 shadow-sm px-4 py-4 flex items-start gap-3"
              >
                <div className="shrink-0 h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  {b.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-gray-900 text-[13px]">
                    {b.title}
                  </p>
                  <p className="text-[12px] text-gray-600 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Company Info */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/70 border border-orange-200 px-4 py-2">
                <HiOutlineSparkles className="text-orange-600" />
                <span className="text-[12px] font-extrabold text-orange-700 uppercase tracking-wide">
                  Ecoders
                </span>
              </div>

              <p className="mt-4 text-[13px] text-gray-600 leading-relaxed">
                Empowering online shopping — one click at a time. Discover
                curated collections, trusted brands, and fast checkout.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-[13px]">
                  <span className="h-10 w-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center">
                    <FaRegEnvelope className="text-orange-600" />
                  </span>
                  <span className="text-gray-700 font-semibold">
                    support@ecoders.com
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[13px]">
                  <span className="h-10 w-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center">
                    <FaPhoneAlt className="text-orange-600" />
                  </span>
                  <span className="text-gray-700 font-semibold">
                    +91 90000 00000
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[13px]">
                  <span className="h-10 w-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center">
                    <FaRegClock className="text-orange-600" />
                  </span>
                  <span className="text-gray-700 font-semibold">
                    Mon–Sat • 9:00 AM – 7:00 PM
                  </span>
                </div>

                <div className="flex items-start gap-3 text-[13px]">
                  <span className="h-10 w-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center mt-0.5">
                    <FaMapMarkerAlt className="text-orange-600" />
                  </span>
                  <span className="text-gray-700 font-semibold leading-snug">
                    Bengaluru, Karnataka, India
                  </span>
                </div>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-gray-900 text-[13px] font-extrabold uppercase tracking-wide mb-4">
                Company
              </h3>

              <ul className="space-y-3 text-[13px] font-semibold">
                <li>
                  <a
                    href="/about-us"
                    className="group inline-flex items-center gap-2 text-gray-700 hover:text-orange-700 transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-orange-300 group-hover:bg-orange-500 transition" />
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact-us"
                    className="group inline-flex items-center gap-2 text-gray-700 hover:text-orange-700 transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-orange-300 group-hover:bg-orange-500 transition" />
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="group inline-flex items-center gap-2 text-gray-700 hover:text-orange-700 transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-orange-300 group-hover:bg-orange-500 transition" />
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/all-blogs"
                    className="group inline-flex items-center gap-2 text-gray-700 hover:text-orange-700 transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-orange-300 group-hover:bg-orange-500 transition" />
                    Blogs
                  </a>
                </li>
              </ul>

              {/* Payment confidence */}
              <div className="mt-6 rounded-2xl bg-white border border-orange-100 shadow-sm p-4">
                <div className="flex items-center gap-2">
                  <RiSecurePaymentFill className="text-orange-600" />
                  <p className="text-[12px] font-extrabold text-gray-900">
                    Secure Payments
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-3 text-orange-500 text-[22px]">
                  <FaCcVisa />
                  <FaCcMastercard />
                  <FaCcPaypal />
                </div>
                <p className="mt-2 text-[12px] text-gray-600">
                  Multiple payment options supported.
                </p>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-gray-900 text-[13px] font-extrabold uppercase tracking-wide mb-4">
                Support
              </h3>

              <ul className="space-y-3 text-[13px] font-semibold">
                <li>
                  <a
                    href="/help-center"
                    className="group inline-flex items-center gap-2 text-gray-700 hover:text-orange-700 transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-orange-300 group-hover:bg-orange-500 transition" />
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="group inline-flex items-center gap-2 text-gray-700 hover:text-orange-700 transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-orange-300 group-hover:bg-orange-500 transition" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-of-service"
                    className="group inline-flex items-center gap-2 text-gray-700 hover:text-orange-700 transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-orange-300 group-hover:bg-orange-500 transition" />
                    Terms of Service
                  </a>
                </li>
              </ul>

              {/* Small highlight */}
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 p-4">
                <p className="text-[12px] font-extrabold text-orange-800">
                  Tip: Subscribe to get deal alerts 🔥
                </p>
                <p className="text-[12px] text-orange-700 mt-1">
                  New arrivals • coupons • flash sales
                </p>
              </div>
            </div>

            {/* Social + Subscribe */}
            <div>
              <h3 className="text-gray-900 text-[13px] font-extrabold uppercase tracking-wide mb-4">
                Follow & Subscribe
              </h3>

              {/* Social icons */}
              <div className="flex flex-wrap gap-3">
                {[
                  {
                    href: "https://www.facebook.com",
                    label: "Facebook",
                    icon: <FaFacebookF />,
                  },
                  {
                    href: "https://www.twitter.com",
                    label: "Twitter",
                    icon: <FaTwitter />,
                  },
                  {
                    href: "https://www.github.com",
                    label: "GitHub",
                    icon: <FaGithub />,
                  },
                  {
                    href: "https://www.linkedin.com",
                    label: "LinkedIn",
                    icon: <FaLinkedinIn />,
                  },
                  {
                    href: "https://www.instagram.com",
                    label: "Instagram",
                    icon: <FaInstagram />,
                  },
                  {
                    href: "https://www.youtube.com",
                    label: "YouTube",
                    icon: <FaYoutube />,
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="h-11 w-11 rounded-2xl bg-white border border-orange-100 shadow-sm flex items-center justify-center text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-md transition"
                  >
                    <span className="text-[18px]">{s.icon}</span>
                  </a>
                ))}
              </div>

              {/* Subscription */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <FaRegEnvelope className="text-orange-600" />
                  <h4 className="text-gray-900 text-[13px] font-extrabold">
                    Subscribe for Updates
                  </h4>
                </div>

                {/* Keep your existing functionality / component */}
                <div className="rounded-2xl bg-white border border-orange-100 shadow-sm p-4">
                  <SubscriptionForm />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-orange-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[12px] font-semibold text-gray-600 text-center md:text-left">
              &copy; {year} Ecoders, Inc. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-600">
              <FaShieldAlt className="text-orange-600" />
              <span>Secure • Fast • Reliable</span>
            </div>

            <p className="text-[12px] font-semibold text-gray-600 text-center md:text-right">
              Empowering online shopping — one click at a time.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
