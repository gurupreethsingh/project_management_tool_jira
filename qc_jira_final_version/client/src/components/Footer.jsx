import React from "react";
import ecoders_logo from "../assets/ecoders_logo.png";

const Footer = () => {
  return (
    <div>
      {/* Footer Section */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <img
                src={ecoders_logo}
                alt="University Logo"
                className="h-10 w-auto mb-2"
              />
              <p className="text-gray-400 pr-3">
                Leading the way in software excellence and innovation.
                Harnessing the power of AI and blockchain technologies to
                revolutionize the digital landscape and drive transformative
                solutions.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Academics
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="/contact"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Courses
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Faculty
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Research
                  </a>
                </li>
                <li>
                  <a
                    href="contact"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Admissions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Community
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="/contact"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Student Life
                  </a>
                </li>
                <li>
                  <a
                    href="contact"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Events
                  </a>
                </li>
                <li>
                  <a
                    href="contact"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Alumni
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Contact Us
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Address: 193 Hesaraghatta Road, Bagalaguntte, Bangalore
                    560073
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Phone: +91 9538596766
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Email: igurupreeth@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Ecoders. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                {/* Insert your Facebook icon */}
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                {/* Insert your Twitter icon */}
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                {/* Insert your Instagram icon */}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
