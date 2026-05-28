// components/home/Hero.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlineShoppingCart,
  HiOutlineUser,
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
import assets from "../../assets/assets";
import BookConsultationButton from "../common/BookConsultationButton";
import SliderComponent from "../common/SliderComponent";

const Hero = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Detect device performance
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

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
      { Icon: FaSun, size: 28, top: "10%", left: "5%", color: "#d4af37" },
      { Icon: GiCrystalBall, size: 32, bottom: "20%", left: "3%", color: "#f3e0aa" },
      { Icon: FaStar, size: 20, top: "70%", left: "15%", color: "#f3e0aa" },
    ]
    : isMobile
      ? [
        { Icon: FaSun, size: 28, top: "10%", left: "5%", delay: 0, duration: 20, color: "#d4af37" },
        { Icon: FaMoon, size: 24, top: "15%", right: "8%", delay: 2, duration: 22, color: "#cbd5e1" },
        { Icon: GiCrystalBall, size: 32, bottom: "20%", left: "3%", delay: 1, duration: 18, color: "#f3e0aa" },
        { Icon: RiStarSLine, size: 20, top: "50%", right: "12%", delay: 3, duration: 24, color: "#d4af37" },
        { Icon: FaStar, size: 18, top: "70%", left: "15%", delay: 1.5, duration: 16, color: "#f3e0aa" },
        { Icon: FaRing, size: 22, top: "60%", right: "25%", delay: 0.8, duration: 20, color: "#d4af37" },
      ]
      : [
        { Icon: FaSun, size: 32, top: "10%", left: "5%", delay: 0, duration: 20, color: "#d4af37" },
        { Icon: FaMoon, size: 28, top: "15%", right: "8%", delay: 2, duration: 22, color: "#cbd5e1" },
        { Icon: GiCrystalBall, size: 40, bottom: "20%", left: "3%", delay: 1, duration: 18, color: "#f3e0aa" },
        { Icon: RiStarSLine, size: 24, top: "50%", right: "12%", delay: 3, duration: 24, color: "#d4af37" },
        { Icon: FaStar, size: 20, top: "70%", left: "15%", delay: 1.5, duration: 16, color: "#f3e0aa" },
        { Icon: GiEarthAmerica, size: 36, bottom: "30%", right: "5%", delay: 2.5, duration: 21, color: "#60a5fa" },
        { Icon: FaGlobe, size: 30, top: "80%", right: "20%", delay: 0.5, duration: 19, color: "#22d3ee" },
        { Icon: GiAstronautHelmet, size: 35, top: "25%", left: "20%", delay: 1.8, duration: 23, color: "#c084fc" },
        { Icon: GiPlanetCore, size: 28, bottom: "40%", left: "25%", delay: 2.2, duration: 17, color: "#f472b6" },
        { Icon: FaRing, size: 26, top: "60%", right: "25%", delay: 0.8, duration: 20, color: "#d4af37" },
        { Icon: FaFeatherAlt, size: 22, bottom: "15%", right: "15%", delay: 3.2, duration: 25, color: "#e879f9" },
        { Icon: RiStarSLine, size: 18, top: "35%", left: "35%", delay: 2.7, duration: 18, color: "#d4af37" },
      ];

  // Stars and planets for space background
  const starCount = isLowEndDevice ? 40 : isMobile ? 80 : 150;

  const planets = [
    { name: "Mercury", size: 20, left: "5%", top: "10%", delay: 0, duration: 20, color: "#c4a35a" },
    { name: "Venus", size: 25, left: "85%", top: "15%", delay: 2, duration: 25, color: "#e8b4b4" },
    { name: "Earth", size: 28, left: "10%", top: "80%", delay: 4, duration: 22, color: "#60a5fa" },
    { name: "Mars", size: 22, left: "80%", top: "75%", delay: 1, duration: 18, color: "#f87171" },
    { name: "Jupiter", size: 35, left: "90%", top: "85%", delay: 3, duration: 30, color: "#d4a574" },
    { name: "Saturn", size: 30, left: "2%", top: "50%", delay: 5, duration: 28, color: "#d4af37" },
  ];

  return (
    <>
      <SliderComponent />

      <section className="relative overflow-hidden">
        {/* New Background - Radial Gradient with Golden Accent */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at center, #0a4d3c 0%, #03231b 100%)"
        }} />

        {/* Golden Orb Effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/5 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/5 blur-3xl animate-pulse-slower" />

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
                opacity: Math.random() * 0.6 + 0.2,
              }}
            />
          ))}
        </div>

        {/* Floating Planets */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {planets.map((planet) => (
            <div
              key={planet.name}
              className="absolute rounded-full animate-float-planet"
              style={{
                width: `${planet.size}px`,
                height: `${planet.size}px`,
                left: planet.left,
                top: planet.top,
                backgroundColor: planet.color,
                boxShadow: `0 0 ${planet.size / 3}px ${planet.color}80`,
                animationDelay: `${planet.delay}s`,
                animationDuration: `${planet.duration}s`,
                opacity: isLowEndDevice ? 0.3 : 0.5,
              }}
            >
              <div
                className="absolute inset-0 rounded-full blur-md"
                style={{
                  backgroundColor: planet.color,
                  opacity: 0.4,
                }}
              />
            </div>
          ))}
        </div>

        {/* Nebula Effects */}
        {!isLowEndDevice && (
          <>
            <div className="absolute top-10 left-5 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-10 right-5 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse-slower" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
          </>
        )}

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
                      filter: "drop-shadow(0 0 8px rgba(210,175,55,0.2))",
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
                    filter: "drop-shadow(0 0 8px rgba(210,175,55,0.2))",
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
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border border-amber-400/40 text-amber-200 px-3 py-1 rounded-full text-sm font-medium w-max shadow-lg">
                <RiStarSLine className="text-amber-300" /> Featured
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
                style={{
                  background: "linear-gradient(135deg, #f3e0aa 0%, #d4af37 40%, #aa771c 70%, #f3e0aa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                Elevate your life with <Accent>astrology</Accent>, yoga &
                authentic ritual tools
              </h1>

              <p className="text-gray-300 max-w-2xl text-base sm:text-lg">
                Personalized consultations, premium courses, and ethically sourced
                products — all designed to help you live with clarity, balance,
                and intention.
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                {/* Reusable Book Consultation Button */}
                <BookConsultationButton
                  prefillData={{
                    name: user?.name || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                  }}
                />

                <a href="/products">
                  <button className="px-4 sm:px-5 py-2 rounded-2xl border border-amber-400/50 bg-amber-500/10 backdrop-blur-sm text-amber-200 font-semibold hover:bg-amber-500/20 transition text-sm sm:text-base shadow-lg">
                    Browse Products
                  </button>
                </a>
              </div>

              <div className="flex flex-wrap gap-4 sm:gap-6 items-center mt-4">
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-white/10">
                  <HiOutlineUser className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white">4.9/5</div>
                    <div className="text-[10px] sm:text-xs text-gray-400">Avg. rating</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-white/10">
                  <GiCrystalBall className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white">2500+</div>
                    <div className="text-[10px] sm:text-xs text-gray-400">Clients served</div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-white/10">
                  <HiOutlineShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white">500+</div>
                    <div className="text-[10px] sm:text-xs text-gray-400">Products</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Dharma Wheel Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="relative"
            >
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50 backdrop-blur-md" />

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(40)].map((_, i) => (
                    <div
                      key={`card-star-${i}`}
                      className="absolute bg-white rounded-full animate-twinkle"
                      style={{
                        width: `${Math.random() * 1.5 + 0.5}px`,
                        height: `${Math.random() * 1.5 + 0.5}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 4}s`,
                        animationDuration: `${1.5 + Math.random() * 2}s`,
                        opacity: Math.random() * 0.5 + 0.2,
                      }}
                    />
                  ))}
                </div>

                {!isLowEndDevice && (
                  <>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl animate-pulse-slower" />
                  </>
                )}

                <div className="relative p-6 md:p-8 lg:p-10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 md:w-72 md:h-72 rounded-full bg-gradient-to-r from-amber-400/10 to-yellow-500/10 blur-3xl animate-pulse" />
                  </div>

                  <div className="relative w-full aspect-square max-w-md mx-auto">
                    <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-spin-slow" />
                    <div className="absolute inset-4 rounded-full border border-amber-400/25 animate-spin-reverse-slow" />
                    <div className="absolute inset-8 rounded-full border border-yellow-500/20 animate-spin-slower" />

                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ rotate: 360 }}
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

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-amber-500/20 animate-pulse-slow" />
                      <div className="absolute w-12 h-12 md:w-20 md:h-20 rounded-full border border-amber-400/20 animate-pulse-slower" />
                    </div>
                  </div>

                  {!isLowEndDevice && (
                    <>
                      <div className="absolute top-0 left-0 w-6 h-6 md:w-10 md:h-10 bg-amber-400/30 rounded-full blur-xl animate-float-orb" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 bg-yellow-500/30 rounded-full blur-xl animate-float-orb-delayed" />
                      <div className="absolute top-1/2 -left-4 w-5 h-5 md:w-6 md:h-6 bg-amber-400/30 rounded-full blur-lg animate-float-orb-slow" />
                    </>
                  )}

                  <motion.div
                    className="mt-6 md:mt-8 p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl border border-amber-400/30 shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                      <RiStarSLine className="w-4 h-4 md:w-5 md:h-5 text-amber-300" />
                      <strong className="text-amber-300 text-xs md:text-sm">Complimentary:</strong>
                    </div>
                    <p className="text-xs md:text-sm text-gray-300">
                      Short follow-up note with every consultation to help implement insights.
                      {!isMobile && " Plus, receive a personalized mantra based on your birth chart!"}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes spin-reverse-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          
          @keyframes spin-slower {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes float-simple {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-15px) translateX(10px); }
          }
          
          @keyframes twinkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 0.6; transform: scale(1); }
          }
          
          @keyframes float-planet {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(10px, -10px); }
            50% { transform: translate(0, -15px); }
            75% { transform: translate(-10px, -5px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.05; transform: scale(1); }
            50% { opacity: 0.1; transform: scale(1.1); }
          }
          
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.06; transform: scale(1); }
            50% { opacity: 0.12; transform: scale(1.05); }
          }
          
          @keyframes pulse-slower {
            0%, 100% { opacity: 0.04; transform: scale(1); }
            50% { opacity: 0.1; transform: scale(1.08); }
          }
          
          @keyframes float-orb {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(8px, -8px); }
          }
          
          @keyframes float-orb-delayed {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-8px, 8px); }
          }
          
          @keyframes float-orb-slow {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(5px, -5px); }
          }
          
          .animate-spin-slow { animation: spin-slow 60s linear infinite; }
          .animate-spin-reverse-slow { animation: spin-reverse-slow 40s linear infinite; }
          .animate-spin-slower { animation: spin-slower 30s linear infinite; }
          .animate-float-simple { animation: float-simple 15s ease-in-out infinite; will-change: transform; }
          .animate-twinkle { animation: twinkle ease-in-out infinite; will-change: opacity, transform; }
          .animate-float-planet { animation: float-planet ease-in-out infinite; will-change: transform; }
          .animate-pulse { animation: pulse 4s ease-in-out infinite; will-change: opacity, transform; }
          .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; will-change: opacity, transform; }
          .animate-pulse-slower { animation: pulse-slower 8s ease-in-out infinite; will-change: opacity, transform; }
          .animate-float-orb { animation: float-orb 5s ease-in-out infinite; will-change: transform; }
          .animate-float-orb-delayed { animation: float-orb-delayed 6s ease-in-out infinite; will-change: transform; }
          .animate-float-orb-slow { animation: float-orb-slow 8s ease-in-out infinite; will-change: transform; }
          .will-change-transform { will-change: transform; }
        `}</style>
      </section>
  {/* Add transition divider at bottom of Hero */ }
  {/* <div className="absolute bottom-0 left-0 right-0">
    <svg
      className="w-full h-12 md:h-16"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        fill="#ffffff"
        opacity="0.1"
      />
    </svg>
  </div> */}
    </>
  );
};

export default Hero;