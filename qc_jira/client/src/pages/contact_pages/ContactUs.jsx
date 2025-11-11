"use client";

import { useState } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaComment } from "react-icons/fa";
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
    <div className="isolate bg-white px-6  sm:py-8 lg:px-8 animate__animated animate__fadeIn">
      <div className="mx-auto container">
        <div className="mb-12">
          <h3 className="text-2xl font-bold tracking-tight text-gray-600 sm:text-4xl">
            Contact Us
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="w-full lg:w-1/2 lg:mr-8">
            <div className="mb-6 animate__animated animate__fadeInLeft">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.708217642363!2d77.50440487591027!3d13.054235513059428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae23460634f221%3A0x2a27c0c9577a1841!2sEcoders!5e0!3m2!1sen!2sin!4v1725038241641!5m2!1sen!2sin"
                width="100%"
                height="350"
                allowFullScreen=""
                loading="lazy"
                title="Company Location"
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>

            <div className="text-left animate__animated animate__fadeInLeft">
              <h2 className="text-xl font-bold text-gray-600">Our Office</h2>
              <p className="mt-4 text-base text-gray-600">
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
                <strong>WebSite :</strong> www.ecoders.in
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 mt-10 lg:mt-0 animate__animated animate__fadeInRight">
            <p className="text-left border-b pb-2 mb-4">
              Fill in your details.
            </p>
            <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="relative">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold leading-6 text-gray-900 flex items-center"
                  >
                    <FaUser className="text-blue-500 mr-2" />
                    First name
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold leading-6 text-gray-900 flex items-center"
                  >
                    <FaUser className="text-green-500 mr-2" />
                    Last name
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="relative sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-gray-900 flex items-center"
                  >
                    <FaEnvelope className="text-red-500 mr-2" />
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="relative sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold leading-6 text-gray-900 flex items-center"
                  >
                    <FaPhone className="text-yellow-500 mr-2" />
                    Phone number
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="relative sm:col-span-2">
                  <label
                    htmlFor="message_text"
                    className="block text-sm font-semibold leading-6 text-gray-900 flex items-center"
                  >
                    <FaComment className="text-teal-500 mr-2" />
                    Drop A Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      id="message_text"
                      name="message_text"
                      rows={4}
                      value={formData.message_text}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-x-4 sm:col-span-2">
                  <div className="flex h-6 items-center">
                    <Switch
                      checked={formData.agreeToLicense}
                      onChange={(checked) =>
                        setFormData({ ...formData, agreeToLicense: checked })
                      }
                      className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600"
                    >
                      <span className="sr-only">Agree to policies</span>
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                      />
                    </Switch>
                  </div>
                  <label className="text-sm leading-6 text-gray-600">
                    By selecting this, you agree to our{" "}
                    <a
                      href="/privacy-policy"
                      className="font-semibold text-indigo-600"
                    >
                      privacy policy
                    </a>
                    .
                  </label>
                </div>
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-transform duration-300 transform hover:scale-105"
                >
                  Get In Touch
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
