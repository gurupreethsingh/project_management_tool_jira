// multiple layout.

import React, { useState } from "react";
import Layout1 from "./Layout1";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";

const AboutUs = () => {
  const [selectedLayout, setSelectedLayout] = useState("Layout 1");

  const renderLayout = () => {
    switch (selectedLayout) {
      case "Layout 1":
        return <Layout1 />;
      case "Layout 2":
        return <Layout2 />;
      case "Layout 3":
        return <Layout3 />;
      default:
        return <Layout1 />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex justify-end">
        <select
          className=" border border-gray-100 rounded p-1"
          value={selectedLayout}
          onChange={(e) => setSelectedLayout(e.target.value)}
        >
          <option value="Layout 1">Layout 1</option>
          <option value="Layout 2">Layout 2</option>
          <option value="Layout 3">Layout 3</option>
        </select>
      </div>
      {renderLayout()}
    </div>
  );
};

export default AboutUs;
