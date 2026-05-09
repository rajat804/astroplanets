// components/home/Hero.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineShoppingCart,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineMail,
} from "react-icons/hi";
import { RiStarSLine } from "react-icons/ri";
import { GiCrystalBall } from "react-icons/gi";
import {
  FaSun,
  FaMoon,
  FaStar,
  FaGlobe,
  FaRing,
  FaFeatherAlt,
} from "react-icons/fa";
import { GiEarthAmerica, GiAstronautHelmet, GiPlanetCore } from "react-icons/gi";
import Accent from "../common/Accent";
import CTA from "../common/CTA";
import assets from "../../assets/assets";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Detect device performance
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Check for low-end devices (older phones, tablets)
      const isSlow = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
      const isLowEnd = mobile && isSlow;
      setIsLowEndDevice(isLowEnd);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Reduce floating icons on mobile and low-end devices
  const floatingIcons = isLowEndDevice 
    ? [
        { Icon: FaSun, size: 28, top: "10%", left: "5%", color: "#f59e0b" },
        { Icon: GiCrystalBall, size: 32, bottom: "20%", left: "3%", color: "#a855f7" },
        { Icon: FaStar, size: 20, top: "70%", left: "15%", color: "#eab308" },
      ]
    : isMobile
    ? [
        { Icon: FaSun, size: 28, top: "10%", left: "5%", delay: 0, duration: 20, color: "#f59e0b" },
        { Icon: FaMoon, size: 24, top: "15%", right: "8%", delay: 2, duration: 22, color: "#94a3b8" },
        { Icon: GiCrystalBall, size: 32, bottom: "20%", left: "3%", delay: 1, duration: 18, color: "#a855f7" },
        { Icon: RiStarSLine, size: 20, top: "50%", right: "12%", delay: 3, duration: 24, color: "#f97316" },
        { Icon: FaStar, size: 18, top: "70%", left: "15%", delay: 1.5, duration: 16, color: "#eab308" },
        { Icon: FaRing, size: 22, top: "60%", right: "25%", delay: 0.8, duration: 20, color: "#f43f5e" },
      ]
    : [
        { Icon: FaSun, size: 32, top: "10%", left: "5%", delay: 0, duration: 20, color: "#f59e0b" },
        { Icon: FaMoon, size: 28, top: "15%", right: "8%", delay: 2, duration: 22, color: "#94a3b8" },
        { Icon: GiCrystalBall, size: 40, bottom: "20%", left: "3%", delay: 1, duration: 18, color: "#a855f7" },
        { Icon: RiStarSLine, size: 24, top: "50%", right: "12%", delay: 3, duration: 24, color: "#f97316" },
        { Icon: FaStar, size: 20, top: "70%", left: "15%", delay: 1.5, duration: 16, color: "#eab308" },
        { Icon: GiEarthAmerica, size: 36, bottom: "30%", right: "5%", delay: 2.5, duration: 21, color: "#3b82f6" },
        { Icon: FaGlobe, size: 30, top: "80%", right: "20%", delay: 0.5, duration: 19, color: "#06b6d4" },
        { Icon: GiAstronautHelmet, size: 35, top: "25%", left: "20%", delay: 1.8, duration: 23, color: "#8b5cf6" },
        { Icon: GiPlanetCore, size: 28, bottom: "40%", left: "25%", delay: 2.2, duration: 17, color: "#ec489a" },
        { Icon: FaRing, size: 26, top: "60%", right: "25%", delay: 0.8, duration: 20, color: "#f43f5e" },
        { Icon: FaFeatherAlt, size: 22, bottom: "15%", right: "15%", delay: 3.2, duration: 25, color: "#d946ef" },
        { Icon: RiStarSLine, size: 18, top: "35%", left: "35%", delay: 2.7, duration: 18, color: "#facc15" },
      ];

  // Stars and planets for space background
  const starCount = isLowEndDevice ? 30 : isMobile ? 60 : 100;
  
  const planets = [
    { name: "Mercury", size: 20, left: "5%", top: "10%", delay: 0, duration: 20, color: "#c4a35a" },
    { name: "Venus", size: 25, left: "85%", top: "15%", delay: 2, duration: 25, color: "#e8b4b4" },
    { name: "Earth", size: 28, left: "10%", top: "80%", delay: 4, duration: 22, color: "#4a90e2" },
    { name: "Mars", size: 22, left: "80%", top: "75%", delay: 1, duration: 18, color: "#e74c3c" },
    { name: "Jupiter", size: 35, left: "90%", top: "85%", delay: 3, duration: 30, color: "#d4a574" },
    { name: "Saturn", size: 30, left: "2%", top: "50%", delay: 5, duration: 28, color: "#e8c9a0" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-offWhite to-orange-50/50">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Icons Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingIcons.map((item, index) => {
          const IconComponent = item.Icon;
          if (isLowEndDevice) {
            return (
              <div
                key={index}
                className="absolute animate-float-simple"
                style={{
                  top: item.top,
                  left: item.left,
                  right: item.right,
                  bottom: item.bottom,
                  animation: `float-simple 15s ease-in-out infinite`,
                  animationDelay: `${index * 0.5}s`,
                }}
              >
                <IconComponent
                  size={item.size}
                  color={item.color}
                  className="opacity-20 transition-opacity duration-300"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(0,0,0,0.1))",
                  }}
                />
              </div>
            );
          }
          
          return (
            <motion.div
              key={index}
              className="absolute will-change-transform"
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                bottom: item.bottom,
              }}
              animate={{
                y: [0, -20, 0, 20, 0],
                x: [0, 15, 0, -15, 0],
                rotate: [0, 8, 0, -8, 0],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0,
              }}
            >
              <IconComponent
                size={item.size}
                color={item.color}
                className="opacity-20 hover:opacity-30 transition-opacity duration-300"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(0,0,0,0.1))",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-5 sm:space-y-6 will-change-transform"
          >
            <div className="inline-flex items-center gap-3 bg-orange-100/60 text-red-700 px-3 py-1 rounded-full text-sm font-medium w-max shadow-sm backdrop-blur-sm">
              <RiStarSLine /> Featured
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Elevate your life with <Accent>astrology</Accent>, yoga &
              authentic ritual tools
            </h1>

            <p className="text-gray-600 max-w-2xl text-base sm:text-lg">
              Personalized consultations, premium courses, and ethically sourced
              products — all designed to help you live with clarity, balance,
              and intention.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
              <CTA>Book a Consultation</CTA>
              <button className="px-4 sm:px-5 py-2 rounded-2xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition text-sm sm:text-base">
                Browse Products
              </button>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 items-center mt-4">
              <div className="flex items-center gap-2 sm:gap-3 bg-white/70 px-3 py-2 rounded-lg shadow-sm backdrop-blur-sm">
                <HiOutlineUser className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                <div>
                  <div className="text-xs sm:text-sm font-semibold">4.9/5</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Avg. rating</div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 bg-white/70 px-3 py-2 rounded-lg shadow-sm backdrop-blur-sm">
                <GiCrystalBall className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                <div>
                  <div className="text-xs sm:text-sm font-semibold">2500+</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Clients served</div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 sm:gap-3 bg-white/70 px-3 py-2 rounded-lg shadow-sm backdrop-blur-sm">
                <HiOutlineShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                <div>
                  <div className="text-xs sm:text-sm font-semibold">500+</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Products</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Dharma Wheel Visualization with Space Background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            {/* Space Background Container */}
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
              {/* Dark Space Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900" />
              
              {/* Stars Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(starCount)].map((_, i) => (
                  <div
                    key={`star-${i}`}
                    className="absolute bg-white rounded-full animate-twinkle"
                    style={{
                      width: `${Math.random() * 2 + 1}px`,
                      height: `${Math.random() * 2 + 1}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${2 + Math.random() * 3}s`,
                      opacity: Math.random() * 0.7 + 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Floating Planets */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {planets.map((planet, index) => (
                  <div
                    key={planet.name}
                    className="absolute rounded-full animate-float-planet"
                    style={{
                      width: `${planet.size}px`,
                      height: `${planet.size}px`,
                      left: planet.left,
                      top: planet.top,
                      backgroundColor: planet.color,
                      boxShadow: `0 0 ${planet.size / 3}px ${planet.color}`,
                      animationDelay: `${planet.delay}s`,
                      animationDuration: `${planet.duration}s`,
                      opacity: isLowEndDevice ? 0.3 : 0.4,
                    }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full blur-md"
                      style={{
                        backgroundColor: planet.color,
                        opacity: 0.5,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Nebula Effects */}
              {!isLowEndDevice && (
                <>
                  <div className="absolute top-10 left-5 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
                  <div className="absolute bottom-10 right-5 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slower" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                </>
              )}

              {/* Card Content */}
              <div className="relative p-6 md:p-8 lg:p-10 backdrop-blur-sm">
                {/* Glowing aura behind the wheel */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 md:w-72 md:h-72 rounded-full bg-gradient-to-r from-purple-500/20 to-red-500/20 blur-3xl animate-pulse" />
                </div>
                
                {/* Dharma Wheel Container */}
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  {/* Outer decorative rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin-slow" />
                  <div className="absolute inset-4 rounded-full border border-purple-500/20 animate-spin-reverse-slow" />
                  <div className="absolute inset-8 rounded-full border border-red-500/20 animate-spin-slower" />
                  
                  {/* Dharma Wheel Image - Continuously Rotating */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: isLowEndDevice ? 30 : 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <img
                      src={assets.dharmawheel}
                      alt="Dharma Wheel"
                      className="w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
                      loading="lazy"
                    />
                  </motion.div>

                  {/* Inner decorative elements */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-yellow-500/20 animate-pulse-slow" />
                    <div className="absolute w-12 h-12 md:w-20 md:h-20 rounded-full border border-red-500/20 animate-pulse-slower" />
                  </div>
                </div>

                {/* Floating energy orbs */}
                {!isLowEndDevice && (
                  <>
                    <div className="absolute top-0 left-0 w-6 h-6 md:w-10 md:h-10 bg-purple-500/30 rounded-full blur-xl animate-float-orb" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 bg-red-500/30 rounded-full blur-xl animate-float-orb-delayed" />
                    <div className="absolute top-1/2 right-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500/30 rounded-full blur-lg animate-float-orb-slow" />
                  </>
                )}

                {/* Complimentary Note */}
                <motion.div 
                  className="mt-6 md:mt-8 p-3 md:p-4 bg-white/5 backdrop-blur rounded-xl md:rounded-2xl border border-purple-500/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                    <RiStarSLine className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                    <strong className="text-yellow-400 text-xs md:text-sm">Complimentary:</strong>
                  </div>
                  <p className="text-xs md:text-sm text-gray-300">
                    Short follow-up note with every consultation to help implement insights.
                    {!isMobile && " Plus, receive a personalized mantra based on your birth chart!"}
                  </p>
                </motion.div>

                {/* Energy rings SVG */}
                {!isLowEndDevice && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="100"
                      fill="none"
                      stroke="rgba(168,85,247,0.15)"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      className="animate-spin-slow"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="80"
                      fill="none"
                      stroke="rgba(236,72,153,0.1)"
                      strokeWidth="1"
                      className="animate-spin-reverse-slow"
                    />
                  </svg>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-reverse-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        
        @keyframes spin-slower {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes float-simple {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(10px);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 0.5;
            transform: scale(1);
          }
        }
        
        @keyframes float-planet {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10px, -10px);
          }
          50% {
            transform: translate(0, -15px);
          }
          75% {
            transform: translate(-10px, -5px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.05);
          }
        }
        
        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.08);
          }
        }
        
        @keyframes float-orb {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(8px, -8px);
          }
        }
        
        @keyframes float-orb-delayed {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-8px, 8px);
          }
        }
        
        @keyframes float-orb-slow {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(5px, -5px);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 40s linear infinite;
        }
        
        .animate-spin-slower {
          animation: spin-slower 30s linear infinite;
        }
        
        .animate-float-simple {
          animation: float-simple 15s ease-in-out infinite;
          will-change: transform;
        }
        
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
          will-change: opacity, transform;
        }
        
        .animate-float-planet {
          animation: float-planet ease-in-out infinite;
          will-change: transform;
        }
        
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
          will-change: opacity, transform;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
          will-change: opacity, transform;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
          will-change: opacity, transform;
        }
        
        .animate-float-orb {
          animation: float-orb 5s ease-in-out infinite;
          will-change: transform;
        }
        
        .animate-float-orb-delayed {
          animation: float-orb-delayed 6s ease-in-out infinite;
          will-change: transform;
        }
        
        .animate-float-orb-slow {
          animation: float-orb-slow 8s ease-in-out infinite;
          will-change: transform;
        }
        
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
    </section>
  );
};

export default Hero;