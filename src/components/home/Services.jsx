// components/home/Services.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineCalendar, 
  HiOutlineClock, 
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineHome,
  HiOutlineUserGroup
} from "react-icons/hi";
import { 
  GiCrystalBall, 
  GiMagicSwirl, 
  GiVibratingShield,
  GiStarsStack,
  GiLotus
} from "react-icons/gi";
import { FaStar, FaInfinity, FaMoon, FaSun } from "react-icons/fa";
import CTA from "../common/CTA";

const Services = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Detect device performance
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Check for low-end devices
      const isSlow = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
      const isLowEnd = mobile && isSlow;
      setIsLowEndDevice(isLowEnd);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  const services = [
    {
      title: "One-on-one Natal Chart Reading",
      desc: "Deep, personalized chart analysis, career & relationship guidance.",
      duration: "60 min",
      price: "₹2,499",
      img: "https://media.istockphoto.com/id/1935644904/photo/zodiac-wheel-natal-chart-astrology-dices-and-stones-on-grey-table-flat-lay.jpg?s=612x612&w=0&k=20&c=128i99Orc9Y_RU3nSYKNLjf-INw5inM6q_H9FDCi_JE=",
      icon: GiCrystalBall,
      gradient: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-500",
      benefits: ["Birth Chart Analysis", "Career Guidance", "Relationship Insights"],
      symbols: ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"],
      symbolType: "zodiac"
    },
    {
      title: "Numerology Life Path Report",
      desc: "Actionable insights from your core numbers and cycles.",
      duration: "45 min",
      price: "₹1,299",
      img: "https://astrala.imgix.net/3GFULF5okVu23twscOo7Fd/7406ee47eac22e71767ea4f4ec1412c7/life-path-number-7-meaning.jpg?w=3840&h=2560&fit=crop&q=60&auto=format,compress",
      icon: GiStarsStack,
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-500",
      benefits: ["Life Path Number", "Destiny Matrix", "Cycle Analysis"],
      symbols: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      symbolType: "numbers"
    },
    {
      title: "Vastu Home Harmony Session",
      desc: "Practical remedies to balance your living & working space.",
      duration: "90 min",
      price: "₹3,999",
      img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      icon: GiVibratingShield,
      gradient: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-500",
      benefits: ["Space Analysis", "Energy Balancing", "Remedial Solutions"],
      symbols: ["N", "S", "E", "W", "NE", "NW", "SE", "SW"],
      symbolType: "directions"
    },
  ];

  // Reduce background animations on mobile/low-end
  const showBackgroundAnimations = !isLowEndDevice;
  const orbCount = isLowEndDevice ? 2 : isMobile ? 3 : 6;
  const starCount = isLowEndDevice ? 15 : isMobile ? 25 : 50;

  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-offWhite to-orange-50/50">
      {/* Animated Background Elements - Reduced on mobile */}
      {showBackgroundAnimations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Orbs - Using CSS animations for better performance */}
          {[...Array(orbCount)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute rounded-full blur-3xl opacity-20 animate-float-orb"
              style={{
                width: `${100 + Math.random() * 150}px`,
                height: `${100 + Math.random() * 150}px`,
                background: `radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(249,115,22,0.2) 100%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${15 + i * 3}s`,
              }}
            />
          ))}

          {/* Animated Stars - Using CSS animations */}
          {[...Array(starCount)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-0.5 h-0.5 bg-yellow-300 rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with Animation - Optimized */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12"
        >
          <div className="mb-4 md:mb-0">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-3 md:mb-4">
              <GiMagicSwirl className="text-red-500 w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-semibold text-red-600">Divine Guidance</span>
            </div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
              Premium Consultation Services
            </h3>
            <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
              Book curated sessions crafted by senior practitioners
            </p>
          </div>
          {!isMobile && (
            <div className="hidden md:flex gap-3">
              <button className="px-4 md:px-5 py-2 md:py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-all duration-300 text-sm md:text-base">
                View all
              </button>
              <CTA>Book a Slot</CTA>
            </div>
          )}
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-8">
          {services.map((s, i) => {
            const IconComponent = s.icon;
            const isHovered = hoveredCard === i;
            
            return (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 0.4, 
                  delay: isLowEndDevice ? 0 : i * 0.08,
                  ease: "easeOut"
                }}
                whileHover={!isMobile ? { y: -8 } : {}}
                onHoverStart={() => !isMobile && setHoveredCard(i)}
                onHoverEnd={() => !isMobile && setHoveredCard(null)}
                className="relative group cursor-pointer"
              >
                {/* Glow Effect - Disabled on mobile */}
                {!isMobile && (
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${isHovered ? 'opacity-30' : ''}`} />
                )}
                
                <div className={`relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-orange-100 ${s.gradient}`}>
                  {/* Image Section */}
                  <div className="relative h-44 md:h-52 overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute left-3 md:left-4 top-3 md:top-4 bg-white/90 backdrop-blur px-2 md:px-3 py-1 rounded-lg md:rounded-xl text-[10px] md:text-xs font-semibold shadow-lg">
                      ✨ Expert Session
                    </div>

                    {/* Floating Icon - Simplified animation */}
                    <div className="absolute right-3 md:right-4 bottom-3 md:bottom-4 bg-white/90 backdrop-blur rounded-full p-1.5 md:p-2 shadow-lg">
                      <IconComponent className={`w-4 h-4 md:w-5 md:h-5 ${s.iconColor}`} />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <h4 className={`text-base md:text-xl font-semibold text-gray-900 transition-colors duration-300 ${isHovered && !isMobile ? 'text-red-600' : ''}`}>
                      {s.title}
                    </h4>
                    
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      {s.desc}
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-1">
                      {s.benefits.map((benefit, idx) => (
                        <div
                          key={benefit}
                          className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500"
                        >
                          <HiOutlineSparkles className="w-2 h-2 md:w-3 md:h-3 text-red-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

                    {/* Duration & Price Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500">
                        <HiOutlineClock className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                        <span>{s.duration}</span>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] md:text-xs text-gray-400">Starting from</div>
                        <div className="text-lg md:text-2xl font-bold text-gray-900">
                          {s.price}
                          <span className="text-xs md:text-sm font-normal text-gray-500">/session</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 md:gap-3 mt-3 md:mt-4">
                      <button 
                        className="flex-1 px-2 md:px-4 py-1.5 md:py-2.5 rounded-lg md:rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-all duration-300 text-[10px] md:text-sm"
                      >
                        View Details
                      </button>
                      <div>
                        <CTA className="flex-none text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2.5">Book Now</CTA>
                      </div>
                    </div>

                    {/* Symbols - Only show on desktop hover */}
                    {!isMobile && (
                      <AnimatePresence>
                        {isHovered && s.symbols && s.symbols.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-orange-100"
                          >
                            <div className="flex items-center justify-center gap-0.5 md:gap-1 flex-wrap">
                              {s.symbols.slice(0, isMobile ? 6 : 12).map((symbol, idx) => (
                                <span
                                  key={`${s.symbolType}-${idx}`}
                                  className={`text-[8px] md:text-xs ${
                                    s.symbolType === 'zodiac' 
                                      ? 'text-purple-400' 
                                      : s.symbolType === 'numbers'
                                      ? 'text-blue-400 font-mono'
                                      : 'text-green-400'
                                  } transition-colors`}
                                  title={
                                    s.symbolType === 'zodiac' 
                                      ? 'Zodiac Sign' 
                                      : s.symbolType === 'numbers'
                                      ? 'Numerology Number'
                                      : 'Direction'
                                  }
                                >
                                  {symbol}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Decorative Floating Elements - Hidden on mobile */}
        {!isMobile && (
          <>
            <div className="absolute -left-20 top-1/3 opacity-10 hidden xl:block animate-float-slow">
              <GiLotus size={150} className="text-purple-600" />
            </div>

            <div className="absolute -right-20 bottom-1/3 opacity-10 hidden xl:block animate-float-reverse">
              <FaMoon size={120} className="text-orange-600" />
            </div>

            
          </>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-orb {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20px, -15px) scale(1.05);
          }
          66% {
            transform: translate(-15px, 10px) scale(0.95);
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
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(30px) rotate(180deg);
          }
        }
        
        @keyframes float-reverse {
          0%, 100% {
            transform: translateY(0) rotate(360deg);
          }
          50% {
            transform: translateY(-30px) rotate(0deg);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
        
        .animate-float-orb {
          animation: float-orb ease-in-out infinite;
          will-change: transform;
        }
        
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
          will-change: opacity, transform;
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
          will-change: transform;
        }
        
        .animate-float-reverse {
          animation: float-reverse 25s ease-in-out infinite;
          will-change: transform;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </section>
  );
};

export default Services;