// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { MdOutlineAdminPanelSettings } from "react-icons/md";
// import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     let formErrors = {};

//     if (!formData.name.trim()) {
//       formErrors.name = "Name cannot be only spaces.";
//     }

//     if (!formData.email || /\s/.test(formData.email)) {
//       formErrors.email = "Email cannot contain spaces.";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       formErrors.email = "Please enter a valid email address.";
//     }

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
//     if (!formData.password) {
//       formErrors.password = "Password is required.";
//     } else if (/\s/.test(formData.password)) {
//       formErrors.password = "Password cannot contain spaces.";
//     } else if (!passwordRegex.test(formData.password)) {
//       formErrors.password =
//         "Password must be at least 6 characters long and include 1 lowercase, 1 uppercase, 1 number, and 1 special character.";
//     }

//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       try {
//         const response = await fetch(`${globalBackendRoute}/api/register`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         });

//         if (response.ok) {
//           setSuccessMessage("Registration successful!");
//           setFormData({
//             name: "",
//             email: "",
//             password: "",
//           });
//           setErrors({});
//           alert("Registration Successful.");
//           navigate("/login");
//         } else {
//           const errorData = await response.json();
//           setErrors({
//             submit:
//               errorData.message || "Registration failed. User already exists",
//           });
//         }
//       } catch (error) {
//         setErrors({ submit: "An error occurred. Please try again." });
//       }
//     }
//   };

//   return (
//     <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
//         <MdOutlineAdminPanelSettings
//           className="text-indigo-600 mx-auto mb-2"
//           size={48}
//         />
//         <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
//           Register
//         </h2>
//       </div>

//       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
//             >
//               <FaUser className="text-green-500 mr-2" /> Name
//             </label>
//             <div className="mt-2">
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               />
//               {errors.name && (
//                 <p className="mt-2 text-sm text-red-600">{errors.name}</p>
//               )}
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
//             >
//               <FaEnvelope className="text-blue-500 mr-2" /> Email Address
//             </label>
//             <div className="mt-2">
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               />
//               {errors.email && (
//                 <p className="mt-2 text-sm text-red-600">{errors.email}</p>
//               )}
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
//             >
//               <FaLock className="text-purple-500 mr-2" /> Password
//             </label>
//             <div className="mt-2 relative">
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//                 title={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//               {errors.password && (
//                 <p className="mt-2 text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>
//           </div>

//           {errors.submit && <div className="text-red-600">{errors.submit}</div>}
//           {successMessage && (
//             <div className="text-green-600">{successMessage}</div>
//           )}

//           <div>
//             <button
//               type="submit"
//               className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             >
//               Register
//             </button>
//           </div>
//         </form>

//         <p className="mt-10 text-center text-sm text-gray-500">
//           Have an Account?{" "}
//           <a
//             href="/login"
//             className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
//           >
//             Sign in
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

//

"use client";

import React, { memo, useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

import registerBanner from "../../assets/images/register_banner.jpg";

const HERO_TAGS = ["REGISTER", "NEW ACCOUNT", "SECURE ACCESS", "ONBOARDING"];

const HERO_STYLE = {
  backgroundImage: `url(${registerBanner})`,
};

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};

    if (!formData.name.trim()) {
      formErrors.name = "Name cannot be only spaces.";
    }

    if (!formData.email || /\s/.test(formData.email)) {
      formErrors.email = "Email cannot contain spaces.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Please enter a valid email address.";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!formData.password) {
      formErrors.password = "Password is required.";
    } else if (/\s/.test(formData.password)) {
      formErrors.password = "Password cannot contain spaces.";
    } else if (!passwordRegex.test(formData.password)) {
      formErrors.password =
        "Password must be at least 6 characters long and include 1 lowercase, 1 uppercase, 1 number, and 1 special character.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (validateForm()) {
        try {
          const response = await fetch(`${globalBackendRoute}/api/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            setSuccessMessage("Registration successful!");
            setFormData({
              name: "",
              email: "",
              password: "",
            });
            setErrors({});
            alert("Registration Successful.");
            navigate("/login");
          } else {
            const errorData = await response.json();
            setErrors({
              submit:
                errorData.message || "Registration failed. User already exists",
            });
          }
        } catch (_error) {
          setErrors({ submit: "An error occurred. Please try again." });
        }
      }
    },
    [formData, navigate],
  );

  return (
    <div className="service-page-wrap min-h-screen">
      {/* HERO */}
      <section className="service-hero-section" style={HERO_STYLE}>
        <div className="service-hero-overlay-1" />
        <div className="service-hero-overlay-2" />
        <div className="service-hero-overlay-3" />

        <div className="service-hero-container">
          <div className="service-hero-layout">
            <div>
              <div className="service-tag-row">
                {HERO_TAGS.map((item) => (
                  <span key={item} className="service-tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="service-hero-title">
                Create your{" "}
                <span className="service-hero-title-highlight">
                  new account
                </span>
              </h1>

              <p className="service-hero-text">
                Register to access your workspace, dashboards, tools, and
                role-based platform features securely.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Fast onboarding · Secure registration
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span>Validated registration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200" />
                <span>Secure account creation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr),minmax(0,1fr)] gap-10 lg:gap-12 items-start">
            {/* LEFT */}
            <section>
              <h2 className="service-main-heading">Create your account</h2>

              <div className="glass-card mt-5 px-5 sm:px-6 py-5 sm:py-6">
                <p className="service-badge-heading">New user registration</p>

                <div className="mt-4 space-y-4">
                  <p className="service-paragraph">
                    Register with your name, email address, and password to set
                    up your account and access the platform.
                  </p>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                        <MdOutlineAdminPanelSettings className="text-base" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Validated onboarding
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Your registration details are validated before account
                          creation to ensure proper format and secure access.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                        <FaLock className="text-base" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Strong password rules
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Passwords must include uppercase, lowercase, number,
                          and special character combinations for better account
                          security.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT */}
            <section>
              <h2 className="service-main-heading">Registration form</h2>

              <div className="glass-card mt-5 p-5 sm:p-6 lg:p-7">
                <p className="service-badge-heading">Register</p>
                <p className="mt-3 form-help-text">
                  Fill in your details below to create your account.
                </p>

                <form onSubmit={handleSubmit} className="mx-auto max-w-xl mt-6">
                  <div className="grid grid-cols-1 gap-y-5">
                    <div>
                      <label htmlFor="name" className="form-label">
                        <span className="form-icon-badge">
                          <FaUser className="text-[11px]" />
                        </span>
                        Name
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">
                        <span className="form-icon-badge">
                          <FaEnvelope className="text-[11px]" />
                        </span>
                        Email address
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Enter your email"
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="form-label">
                        <span className="form-icon-badge">
                          <FaLock className="text-[11px]" />
                        </span>
                        Password
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="form-input pr-12"
                          placeholder="Enter your password"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-800"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          title={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>

                        {errors.password && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-3 py-2">
                      <p className="text-sm text-green-600">{successMessage}</p>
                    </div>
                  )}

                  <div className="mt-8 text-center">
                    <button type="submit" className="primary-gradient-button">
                      Register
                    </button>
                  </div>

                  <p className="mt-8 text-center text-sm text-slate-500">
                    Have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-700"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(Register);
