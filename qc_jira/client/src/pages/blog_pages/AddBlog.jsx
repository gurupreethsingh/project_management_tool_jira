// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import globalBackendRoute from "../../config/Config";

// export default function AddBlog() {
//   const initialFormData = {
//     title: "",
//     body: "",
//     summary: "",
//     tags: "",
//     category: "",
//     seoTitle: "",
//     metaDescription: "",
//     published: false,
//     featuredImage: null,
//     code: "", // NEW
//     explanation: "", // NEW
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [authorId, setAuthorId] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Unauthorized: Login required.");
//       return;
//     }
//     try {
//       const decoded = jwtDecode(token);
//       setAuthorId(decoded.id);
//     } catch (error) {
//       console.error("Invalid token format");
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       featuredImage: e.target.files[0],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const blogForm = new FormData();

//     blogForm.append("title", formData.title);
//     blogForm.append("body", formData.body);
//     blogForm.append("summary", formData.summary);
//     blogForm.append("tags", formData.tags);
//     blogForm.append("category", formData.category);
//     blogForm.append("seoTitle", formData.seoTitle);
//     blogForm.append("metaDescription", formData.metaDescription);
//     blogForm.append("published", formData.published);
//     blogForm.append("author", authorId);

//     // NEW structured fields
//     blogForm.append("code", formData.code || "");
//     blogForm.append("explanation", formData.explanation || "");

//     if (formData.featuredImage) {
//       blogForm.append("featuredImage", formData.featuredImage);
//     }

//     try {
//       await axios.post(`${globalBackendRoute}/api/add-blog`, blogForm, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("✅ Blog added successfully!");
//       setFormData(initialFormData);
//       navigate("/add-blog", { replace: true });
//     } catch (error) {
//       console.error("Error adding blog:", error);
//       alert("Failed to add blog. Please try again.");
//     }
//   };

//   return (
//     <div className="containerWidth my-8">
//       <div className="bg-white p-6 sm:p-8 max-w-7xl mx-auto">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//           📢 Add New Blog
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {[
//             { label: "Title", name: "title", type: "text" },
//             { label: "SEO Title", name: "seoTitle", type: "text" },
//             { label: "Tags (comma-separated)", name: "tags", type: "text" },
//             { label: "Category", name: "category", type: "text" },
//           ].map(({ label, name, type }) => (
//             <div key={name}>
//               <label htmlFor={name} className="formLabel">
//                 {label}
//               </label>
//               <input
//                 type={type}
//                 name={name}
//                 value={formData[name]}
//                 onChange={handleChange}
//                 className="formInput"
//                 required={name === "title"}
//               />
//             </div>
//           ))}

//           <div>
//             <label className="formLabel" htmlFor="body">
//               Body (normal content)
//             </label>
//             <textarea
//               id="body"
//               name="body"
//               rows="8"
//               value={formData.body}
//               onChange={handleChange}
//               className="formInput"
//               placeholder={`Write your article here. You can still include Q/A style text if you like.`}
//               required
//             />
//           </div>

//           <div>
//             <label className="formLabel" htmlFor="summary">
//               Summary
//             </label>
//             <textarea
//               id="summary"
//               name="summary"
//               rows="2"
//               value={formData.summary}
//               onChange={handleChange}
//               className="formInput"
//             />
//           </div>

//           <div>
//             <label className="formLabel" htmlFor="metaDescription">
//               Meta Description
//             </label>
//             <textarea
//               id="metaDescription"
//               name="metaDescription"
//               rows="2"
//               value={formData.metaDescription}
//               onChange={handleChange}
//               className="formInput"
//             />
//           </div>

//           {/* NEW: Optional structured code/explanation fields */}
//           <div>
//             <label className="formLabel" htmlFor="code">
//               Code (optional; will show with a gray background)
//             </label>
//             <textarea
//               id="code"
//               name="code"
//               rows="6"
//               value={formData.code}
//               onChange={handleChange}
//               className="formInput font-mono"
//               placeholder={`// Example
// function add(a, b) {
//   return a + b;
// }`}
//             />
//           </div>

//           <div>
//             <label className="formLabel" htmlFor="explanation">
//               Explanation (optional)
//             </label>
//             <textarea
//               id="explanation"
//               name="explanation"
//               rows="3"
//               value={formData.explanation}
//               onChange={handleChange}
//               className="formInput"
//               placeholder="Explain what the code does."
//             />
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="published"
//               name="published"
//               checked={formData.published}
//               onChange={handleChange}
//               className="mr-2"
//             />
//             <label htmlFor="published" className="text-sm text-gray-700">
//               Publish Blog
//             </label>
//           </div>

//           <div>
//             <label className="formLabel" htmlFor="featuredImage">
//               Featured Image
//             </label>
//             <input
//               type="file"
//               id="featuredImage"
//               onChange={handleImageChange}
//               className="w-full mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
//             />
//           </div>

//           <div className="text-center pt-4">
//             <button
//               type="submit"
//               className="primaryBtn px-6 py-2 rounded-lg w-full sm:w-1/2 mx-auto"
//             >
//               Submit Blog
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

//

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import globalBackendRoute from "../../config/Config";

export default function AddBlog() {
  const initialFormData = {
    title: "",
    body: "",
    summary: "",
    tags: "",
    category: "",
    seoTitle: "",
    metaDescription: "",
    published: false,
    featuredImage: null,
    code: "",
    explanation: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [authorId, setAuthorId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: Login required.");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setAuthorId(decoded.id);
    } catch (error) {
      console.error("Invalid token format");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: e.target.files?.[0] ?? null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogForm = new FormData();

    blogForm.append("title", formData.title);
    blogForm.append("body", formData.body);
    blogForm.append("summary", formData.summary);
    blogForm.append("tags", formData.tags);
    blogForm.append("category", formData.category);
    blogForm.append("seoTitle", formData.seoTitle);
    blogForm.append("metaDescription", formData.metaDescription);
    blogForm.append("published", String(formData.published));
    blogForm.append("author", authorId);
    blogForm.append("code", formData.code || "");
    blogForm.append("explanation", formData.explanation || "");

    if (formData.featuredImage) {
      blogForm.append("featuredImage", formData.featuredImage);
    }

    try {
      await axios.post(`${globalBackendRoute}/api/add-blog`, blogForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Blog added successfully!");
      setFormData(initialFormData);
      navigate("/add-blog", { replace: true });
    } catch (error) {
      console.error("Error adding blog:", error);
      alert("Failed to add blog. Please try again.");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 my-8">
      <div className="mx-auto max-w-5xl bg-white rounded-xl  p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
          Add New Blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row: Title + SEO Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Title <span className="text-rose-600">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter the blog title"
              />
            </div>

            <div>
              <label
                htmlFor="seoTitle"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                SEO Title
              </label>
              <input
                id="seoTitle"
                name="seoTitle"
                type="text"
                value={formData.seoTitle}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Custom SEO title (optional)"
              />
            </div>
          </div>

          {/* Row: Tags + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="react, tailwind, testing"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Category
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Programming"
              />
            </div>
          </div>

          {/* Body */}
          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Body (normal content) <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              required
              rows={10}
              value={formData.body}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Write your article here. You can still include Q/A style content if you want."
            />
          </div>

          {/* Summary + Meta Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="summary"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={3}
                value={formData.summary}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Short summary shown in lists."
              />
            </div>

            <div>
              <label
                htmlFor="metaDescription"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                rows={3}
                value={formData.metaDescription}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="SEO description for search engines."
              />
            </div>
          </div>

          {/* Code / Explanation */}
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Code (optional; will render in a gray block)
            </label>
            <textarea
              id="code"
              name="code"
              rows={8}
              value={formData.code}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 font-mono"
              placeholder={`// Example
function add(a, b) {
  return a + b;
}`}
            />
          </div>

          <div>
            <label
              htmlFor="explanation"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Explanation (optional)
            </label>
            <textarea
              id="explanation"
              name="explanation"
              rows={4}
              value={formData.explanation}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Explain what the code does."
            />
          </div>

          {/* Publish + Image */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-slate-700">Publish Blog</span>
            </label>

            <div className="w-full sm:w-auto">
              <label
                htmlFor="featuredImage"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Featured Image
              </label>
              <input
                id="featuredImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-indigo-600 px-6 py-2 text-white font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
