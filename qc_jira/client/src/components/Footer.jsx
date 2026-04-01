import React from "react";
import { Link } from "react-router-dom";
import ecoders_logo from "../assets/ecoders_logo.png";

const Footer = () => {
  return (
    <div>
      {/* Footer Section */}
      <footer className="mt-8 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 px-5 py-6 sm:px-6 sm:py-7 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-8 sm:gap-10">
            {/* Brand */}
            <div className="sm:col-span-2 xl:col-span-1">
              <img
                src={ecoders_logo}
                alt="Ecoders Logo"
                className="h-10 sm:h-11 w-auto mb-3"
              />
              <p className="text-gray-400 text-sm sm:text-[15px] leading-relaxed pr-0 sm:pr-4">
                Building modern software with engineering excellence. We deliver
                web & mobile apps, AI systems, blockchain solutions, and
                end-to-end QA automation to ship faster with confidence.
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-3 sm:space-y-4">
                <li>
                  <Link
                    to="/about-us"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    to="/all-blogs"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Services
              </h3>
              <ul className="mt-4 space-y-3 sm:space-y-4">
                <li>
                  <Link
                    to="/explore-solutions"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Explore Solutions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/web-apps"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Web & Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link
                    to="/qa-automation"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    QA Automation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ai-systems"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    AI Systems
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blockchain"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Blockchain
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support / Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-3 sm:space-y-4">
                <li>
                  <Link
                    to="/contact"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Address */}
            <div className="text-gray-400 text-sm sm:text-[15px] space-y-2 sm:space-y-2.5 sm:col-span-2 xl:col-span-1">
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">
                Address
              </h3>
              <p className="leading-relaxed">
                #193 Hesaraghatta Road, Bagalaguntte, Bangalore 560073.
              </p>
              <p className="leading-relaxed break-words">
                Phone: +91 9538596766
              </p>
              <p className="leading-relaxed break-words">
                Email: gurupreeth@ecoders.co.in, igurupreeth@gmail.com
              </p>
              <p className="leading-relaxed break-words">
                Website: www.ecoders.co.in
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 border-t border-gray-700 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2019 Ecoders. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
