// pages/HomePage.jsx (Updated)
import React from "react";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Services from "../components/home/Services";
import Products from "../components/home/Products";
import FeaturesList from "../components/home/FeaturesList";
import Instructors from "../components/home/Instructors";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import BlogPreview from "../components/home/BlogPreview";
import VastuCalendar from "../components/VastuCalendar";
// import SectionDivider from "../components/SectionDivider";
import PlanetSigns from "../components/home/PlanetSigns";

export default function HomePage() {
  return (
    <div className="bg-offWhite text-gray-900">
      <Hero />
      {/* <SectionDivider variant="wave" /> */}

      {/* Planet Signs Section - Add this right after Hero */}
      <PlanetSigns />
      <Stats />
      <div className="h-4 bg-gradient-to-b from-white/0 to-white"></div>
      <VastuCalendar />
      <Services />
      <Products />
      {/* <FeaturesList /> */}
      <Instructors />
      <Testimonials />
      <FAQ />
      <BlogPreview />
    </div>
  );
}