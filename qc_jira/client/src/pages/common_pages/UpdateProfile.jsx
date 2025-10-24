import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

export default function UpdateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    avatar: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${globalBackendRoute}/api/user/${id}`
        );
        const fetchedData = response.data;

        const addressData = fetchedData.address || {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        };

        setUserData({
          name: fetchedData.name || "",
          email: fetchedData.email || "",
          phone: fetchedData.phone || "",
          address: addressData,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      address: {
        ...userData.address,
        [name]: value,
      },
    });
  };

  const handleFileChange = (e) => {
    setUserData({
      ...userData,
      avatar: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
    formData.append("street", userData.address.street);
    formData.append("city", userData.address.city);
    formData.append("state", userData.address.state);
    formData.append("postalCode", userData.address.postalCode);
    formData.append("country", userData.address.country);

    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    try {
      const response = await axios.put(
        `${globalBackendRoute}/api/update-user/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully.");
        navigate(`/profile/${id}`);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <motion.h3
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-base font-semibold leading-7 text-gray-900 text-left"
      >
        Update Profile
      </motion.h3>
      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6"
        >
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaUser className="text-indigo-500 mr-2" /> Full Name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="p-2 w-full rounded-md focus:ring-0 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaEnvelope className="text-green-500 mr-2" /> Email
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="p-2 w-full rounded-md focus:ring-0 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaPhone className="text-yellow-500 mr-2" /> Phone
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className="p-2 w-full rounded-md focus:ring-0 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> Street
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="street"
                  value={userData.address.street}
                  onChange={handleAddressChange}
                  className="p-2 w-full rounded-md focus:ring-0 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> City
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="city"
                  value={userData.address.city}
                  onChange={handleAddressChange}
                  className="p-2 w-full rounded-md focus:ring-0 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> State
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="state"
                  value={userData.address.state}
                  onChange={handleAddressChange}
                  className="p-2 w-full rounded-md focus:ring-0 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> Postal Code
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="postalCode"
                  value={userData.address.postalCode}
                  onChange={handleAddressChange}
                  className="p-2 w-full rounded-md focus:ring-0 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> Country
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="country"
                  value={userData.address.country}
                  onChange={handleAddressChange}
                  className="p-2 w-full rounded-md focus:ring-0 focus:outline-none"
                />
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                <FaUser className="text-blue-500 mr-2" /> Avatar
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="file"
                  name="avatar"
                  onChange={handleFileChange}
                  className="p-2 w-full rounded-md focus:ring-0 focus:outline-none"
                />
              </dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 flex justify-end"
        >
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none"
          >
            Save Changes
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
