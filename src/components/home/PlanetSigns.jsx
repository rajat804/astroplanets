// components/home/PlanetSigns.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Star,
  Sparkles,
  Globe,
  Flame,
  Droplets,
  Wind,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const PlanetSigns = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredSign, setHoveredSign] = useState(null);
  const [zodiacSigns, setZodiacSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Fetch rashis from API
  useEffect(() => {
    const fetchRashis = async () => {
      try {
        setLoading(true);
        console.log("Fetching from:", `${API_URL}/rashifal`);
        
        const response = await axios.get(`${API_URL}/rashifal`);
        
        console.log("API Response:", response.data);
        
        if (response.data?.rashis?.length > 0) {
          console.log("Rashis found:", response.data.rashis.length);
          
          const transformedData = response.data.rashis.map((rashi) => {
            let ElementIcon = Globe;
            if (rashi.element === "Fire") ElementIcon = Flame;
            else if (rashi.element === "Water") ElementIcon = Droplets;
            else if (rashi.element === "Air") ElementIcon = Wind;
            else if (rashi.element === "Earth") ElementIcon = Globe;
            
            return {
              _id: rashi._id,
              name: rashi.name || "",
              name_hi: rashi.name_hi || "",
              symbol: rashi.symbol || "♈",
              dates: rashi.dates || "",
              color: rashi.color || "#E74C3C",
              element: rashi.element || "Fire",
              icon: ElementIcon,
              slug: rashi.slug || "",
              traits: rashi.traits || "",
              rulingPlanet: rashi.ruling_planet || "",
              luckyColor: rashi.lucky_color || "",
              luckyNumber: rashi.lucky_number || "",
              mantra: rashi.mantra || "",
              is_active: rashi.is_active,
            };
          });
          
          setZodiacSigns(transformedData);
          toast.success(`Loaded ${transformedData.length} zodiac signs`);
        } else {
          console.log("No Rashis Found");
          setZodiacSigns([]);
          toast.error("No rashis found");
        }
      } catch (error) {
        console.error("Error fetching rashis:", error);
        toast.error("Failed to load zodiac signs");
      } finally {
        setLoading(false);
      }
    };

    fetchRashis();
  }, []);

  const handleRashiClick = (slug) => {
    navigate(`/rashifal/${slug}`);
  };

  const getElementStyles = (element) => {
    switch (element) {
      case "Fire":
        return {
          badgeBg: "bg-orange-100",
          badgeText: "text-orange-700",
          badgeBorder: "border-orange-200",
        };
      case "Earth":
        return {
          badgeBg: "bg-emerald-100",
          badgeText: "text-emerald-700",
          badgeBorder: "border-emerald-200",
        };
      case "Air":
        return {
          badgeBg: "bg-sky-100",
          badgeText: "text-sky-700",
          badgeBorder: "border-sky-200",
        };
      case "Water":
        return {
          badgeBg: "bg-blue-100",
          badgeText: "text-blue-700",
          badgeBorder: "border-blue-200",
        };
      default:
        return {
          badgeBg: "bg-gray-100",
          badgeText: "text-gray-700",
          badgeBorder: "border-gray-200",
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        mass: 0.8,
      },
    },
  };

  if (loading) {
    return (
      <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden bg-[#FAF9F7]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading zodiac signs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (zodiacSigns.length === 0) {
    return (
      <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden bg-[#FAF9F7]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-5xl mb-4">🔮</div>
            <p className="text-gray-600">No zodiac signs found.</p>
            <p className="text-gray-400 text-sm mt-2">Please add rashis in admin panel first.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden bg-[#FAF9F7]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F7] to-[#F5F3F0]" />

      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #8B4513 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-purple-100/80 backdrop-blur-sm border border-purple-300 text-purple-700 px-5 py-2 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Celestial Wisdom</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
              The Zodiac Wheel
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-4" />
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Twelve signs, infinite possibilities — discover your cosmic blueprint
          </p>
        </motion.div>

        {/* Zodiac Signs Grid - FIXED: Added the map function back */}
        <div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 md:gap-6"
        >
          {zodiacSigns.map((sign, index) => {
            const isHovered = hoveredSign === sign.name;
            const IconComponent = sign.icon;
            const elementStyles = getElementStyles(sign.element);
            
            return (
              <motion.div
                key={sign._id || index}
                variants={itemVariants}
                onMouseEnter={() => setHoveredSign(sign.name)}
                onMouseLeave={() => setHoveredSign(null)}
                whileHover={!isMobile ? { y: -6 } : {}}
                transition={{ duration: 0.2 }}
                onClick={() => handleRashiClick(sign.slug)}
                className="group relative cursor-pointer"
              >
                {/* Hover Shadow */}
                <div 
                  className={`absolute -inset-0.5 rounded-2xl transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`} 
                  style={{
                    background: `linear-gradient(135deg, ${sign.color}20, ${sign.color}10)`,
                    boxShadow: `0 8px 25px ${sign.color}40`
                  }}
                />
                
                {/* Main Card */}
                <div className="relative bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 md:p-5 shadow-md transition-all duration-300 overflow-hidden">
                  
                  {/* Zodiac Symbol */}
                  <div className="relative flex justify-center mb-3">
                    <div
                      className="text-5xl md:text-6xl transition-transform duration-300"
                      style={{ 
                        color: sign.color,
                        textShadow: `0 2px 10px ${sign.color}60`,
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      {sign.symbol}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="text-center">
                    <h3 className="text-base md:text-lg font-bold text-gray-800">
                      {sign.name}
                    </h3>
                    {sign.name_hi && (
                      <p className="text-xs text-gray-500">{sign.name_hi}</p>
                    )}
                    
                    {sign.dates && (
                      <p className="text-gray-400 text-[10px] md:text-xs mt-1">
                        {sign.dates}
                      </p>
                    )}
                    
                    {/* Element Badge */}
                    <div className="flex justify-center mt-2">
                      <span className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-full border ${elementStyles.badgeBg} ${elementStyles.badgeText} ${elementStyles.badgeBorder} font-medium shadow-sm flex items-center gap-1`}>
                        <IconComponent className="w-2.5 h-2.5" />
                        {sign.element}
                      </span>
                    </div>
                    
                    {/* Hover Info */}
                    <div className={`mt-3 pt-2 border-t border-gray-200 transition-all duration-300 overflow-hidden ${
                      isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
                    }`}>
                      {sign.rulingPlanet && (
                        <p className="text-amber-600 text-[9px] md:text-[10px] font-medium">
                          ♀ Ruling: {sign.rulingPlanet}
                        </p>
                      )}
                      {sign.traits && (
                        <p className="text-gray-600 text-[8px] md:text-[9px] mt-1">
                          ✦ {sign.traits}
                        </p>
                      )}
                      {(sign.luckyColor || sign.luckyNumber) && (
                        <p className="text-gray-500 text-[8px] md:text-[9px] mt-0.5">
                          {sign.luckyColor && `🎨 ${sign.luckyColor}`}
                          {sign.luckyColor && sign.luckyNumber && " | "}
                          {sign.luckyNumber && `🔢 ${sign.luckyNumber}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Decorative Corners */}
                  <div 
                    className={`absolute top-2 right-2 w-4 h-4 border-t border-r rounded-tr-xl transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ borderColor: sign.color }}
                  />
                  <div 
                    className={`absolute bottom-2 left-2 w-4 h-4 border-b border-l rounded-bl-xl transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ borderColor: sign.color }}
                  />
                  
                  {/* Click Hint */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4" style={{ color: sign.color }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

       
      </div>
    </section>
  );
};

export default PlanetSigns;