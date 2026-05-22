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

export default function HomePage() {
  return (
    <div className="bg-offWhite text-gray-900">
      <Hero />
      <Stats />
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