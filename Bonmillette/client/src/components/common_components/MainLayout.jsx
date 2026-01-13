import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// components, imports
import Header from "../header_components/Header";
import HeaderSlider from "../header_components/HeaderSlider";
import Footer from "../footer_component/Footer";
// pages imports
import Homepage from "../../pages/common_pages/Homepage";
import AboutUs from "../../pages/common_pages/AboutUs";
import PageNotFound from "../../pages/common_pages/PageNotFound";

const MainLayout = () => {
  return (
    <Router>
      <Header />
      <HeaderSlider />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/page-not-found" element={<PageNotFound />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default MainLayout;
