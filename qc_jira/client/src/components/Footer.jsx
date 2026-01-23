import React from "react";
import { Link } from "react-router-dom";
import ecoders_logo from "../assets/ecoders_logo.png";

const Footer = () => {
  return (
    <div>
      {/* Footer Section */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div>
              <img
                src={ecoders_logo}
                alt="Ecoders Logo"
                className="h-10 w-auto mb-2"
              />
              <p className="text-gray-400 pr-3">
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
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    to="/about-us"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    to="/all-blogs"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services (Software + Testing focused) */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Services
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    to="/explore-solutions"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Explore Solutions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/web-apps"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Web & Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link
                    to="/qa-automation"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    QA Automation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ai-systems"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    AI Systems
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blockchain"
                    className="text-base text-gray-300 hover:text-white"
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
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    to="/contact"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Optional quick contact (not routes; kept as plain text) */}
            <div className="mt-6 text-gray-400 text-sm space-y-2">
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Address
              </h3>
              <p>#193 Hesaraghatta Road, Bagalaguntte, Bangalore 560073.</p>
              <p>Phone: +91 9538596766</p>
              <p>Email: gurupreeth@ecoders.co.in , igurupreeth@gmail.com</p>
              <p>Website: www.ecoders.co.in</p>
            </div>

            {/* Social placeholders (no routes provided in App.jsx, so keeping as #) */}
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2019 Ecoders. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
