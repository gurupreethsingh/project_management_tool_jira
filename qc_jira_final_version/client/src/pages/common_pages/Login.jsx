import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Import icons
import { MdLogin } from "react-icons/md"; // Import MdLogin icon

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );

      // Ensure you're getting the token and user data
      const { userToken, user } = response.data;

      if (userToken && user) {
        localStorage.setItem("token", userToken); // Store the token
        localStorage.setItem("userId", user.id); // Store the userId properly here
        localStorage.setItem("user", JSON.stringify(user)); // Store the user data

        // Dispatch storage event to trigger header update
        window.dispatchEvent(new Event("storage"));

        // Navigate based on user role
        switch (user.role) {
          case "superadmin":
            navigate("/super-admin-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
            case "developer_lead":
              navigate("/developer-lead-dashboard");
              break;
          case "developer":
            navigate("/developer-dashboard");
            break;
          case "qa_lead":
            navigate("/qa-dashboard");
            break;
          case "test_engineer":
            navigate("/test-engineer-dashboard");
            break;
          default: // Default case for regular user
            navigate("/dashboard");
            break;
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <MdLogin className="text-indigo-600 mx-auto mb-2" size={48} />
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
            >
              <FaEnvelope className="text-blue-500 mr-2" /> Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
              >
                <FaLock className="text-purple-500 mr-2" /> Password
              </label>
              <div className="text-sm">
                <a
                  href="/admin-forgot-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Need an account?{" "}
          <a
            href="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
