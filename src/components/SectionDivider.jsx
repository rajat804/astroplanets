// components/common/SectionDivider.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaArrowDown, FaStar, FaMoon, FaSun } from "react-icons/fa";
import { GiCrystalBall } from "react-icons/gi";

const SectionDivider = ({ variant = "wave", color = "from-emerald-900 to-emerald-800" }) => {
  
  // Variant 1: Wave Divider (Most Professional)
  if (variant === "wave") {
    return (
      <div className="relative w-full overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-12 md:h-16 lg:h-20 text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#gradient)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#064e3b", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#0a4d3c", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
        </svg>
        <div className="h-16 md:h-20 bg-gradient-to-b from-emerald-900/50 to-transparent"></div>
      </div>
    );
  }

  // Variant 2: Gradient Spacer with Icon
  if (variant === "gradient") {
    return (
      <div className="relative">
        <div className="h-20 md:h-28 bg-gradient-to-b from-emerald-900 via-emerald-800/50 to-white"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <FaArrowDown className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
        </motion.div>
      </div>
    );
  }

  // Variant 3: Cosmic Stars Divider
  if (variant === "cosmic") {
    return (
      <div className="relative py-8 md:py-12 bg-gradient-to-b from-emerald-900 to-white">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-amber-400 rounded-full animate-twinkle"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        <div className="relative flex justify-center items-center gap-4 md:gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <FaSun className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <GiCrystalBall className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <FaMoon className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
          </motion.div>
        </div>
        <div className="flex justify-center mt-3 gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="w-2 h-2 text-amber-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>
    );
  }

  // Variant 4: Simple Spacer with Decorative Line
  if (variant === "simple") {
    return (
      <div className="py-8 md:py-12 bg-gradient-to-b from-emerald-900 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          </div>
          <div className="flex justify-center mt-3">
            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
              <FaStar className="w-3 h-3 text-amber-400" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SectionDivider;