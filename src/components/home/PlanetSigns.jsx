// components/home/PlanetSigns.jsx
import React, { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Sun,
  Moon,
  Star,
  Orbit,
  Sparkles,
  Globe,
  Heart,
  Zap,
  Droplets,
  Wind,
  Flame,
  Gem,
  Calendar,
} from "lucide-react";
import {
  GiRingedPlanet,
  GiOrbital,
  GiMoonOrbit,
  GiPlanetCore
} from "react-icons/gi";

const PlanetSigns = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

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

 const planets = [
    {
      name: "Sun",
      symbol: "☉",
      icon: Sun,
      color: "#F59E0B",
      gradient: "from-amber-400 to-orange-500",
      bgGradient: "from-amber-500/20 to-orange-500/10",
      description: "Soul • Vitality • Leadership",
      element: "Fire",
      elementIcon: Flame,
      mantra: "ॐ सूर्याय नमः",
      gemstone: "Ruby",
      day: "Sunday",
      delay: 0,
    },
    {
      name: "Moon",
      symbol: "☽",
      icon: Moon,
      color: "#94A3B8",
      gradient: "from-slate-300 to-gray-400",
      bgGradient: "from-slate-500/20 to-gray-500/10",
      description: "Mind • Emotions • Intuition",
      element: "Water",
      elementIcon: Droplets,
      mantra: "ॐ चन्द्राय नमः",
      gemstone: "Pearl",
      day: "Monday",
      delay: 0.1,
    },
    {
      name: "Mars",
      symbol: "♂",
      icon: Flame,
      color: "#EF4444",
      gradient: "from-red-400 to-red-600",
      bgGradient: "from-red-500/20 to-red-600/10",
      description: "Energy • Action • Courage",
      element: "Fire",
      elementIcon: Flame,
      mantra: "ॐ मंगलाय नमः",
      gemstone: "Red Coral",
      day: "Tuesday",
      delay: 0.2,
    },
    {
      name: "Venus",
      symbol: "♀",
      icon: Heart,
      color: "#F472B6",
      gradient: "from-pink-400 to-rose-500",
      bgGradient: "from-pink-500/20 to-rose-500/10",
      description: "Love • Beauty • Harmony",
      element: "Earth",
      elementIcon: Globe,
      mantra: "ॐ शुक्राय नमः",
      gemstone: "Diamond",
      day: "Friday",
      delay: 0.3,
    },
    {
      name: "Mercury",
      symbol: "☿",
      icon: Zap ,
      color: "#34D399",
      gradient: "from-emerald-400 to-teal-500",
      bgGradient: "from-emerald-500/20 to-teal-500/10",
      description: "Communication • Intellect",
      element: "Air",
      elementIcon: Wind,
      mantra: "ॐ बुधाय नमः",
      gemstone: "Emerald",
      day: "Wednesday",
      delay: 0.4,
    },
    {
      name: "Jupiter",
      symbol: "♃",
      icon: GiPlanetCore ,
      color: "#A855F7",
      gradient: "from-purple-400 to-purple-600",
      bgGradient: "from-purple-500/20 to-purple-600/10",
      description: "Wisdom • Abundance • Growth",
      element: "Water",
      elementIcon: Droplets,
      mantra: "ॐ गुरुवे नमः",
      gemstone: "Yellow Sapphire",
      day: "Thursday",
      delay: 0.5,
    },
    {
      name: "Saturn",
      symbol: "♄",
      icon: GiRingedPlanet ,
      color: "#6B7280",
      gradient: "from-gray-400 to-gray-600",
      bgGradient: "from-gray-500/20 to-gray-600/10",
      description: "Discipline • Karma • Structure",
      element: "Earth",
      elementIcon: Globe,
      mantra: "ॐ शनैश्चराय नमः",
      gemstone: "Blue Sapphire",
      day: "Saturday",
      delay: 0.6,
    },
    {
      name: "Uranus",
      symbol: "⛢",
      icon: GiRingedPlanet,
      color: "#38BDF8",
      gradient: "from-sky-400 to-blue-500",
      bgGradient: "from-sky-500/20 to-blue-500/10",
      description: "Innovation • Change • Freedom",
      element: "Air",
      elementIcon: Wind,
      mantra: "ॐ उराणाय नमः",
      gemstone: "Amethyst",
      day: "—",
      delay: 0.7,
    },
    {
      name: "Neptune",
      symbol: "♆",
      icon: GiMoonOrbit,
      color: "#818CF8",
      gradient: "from-indigo-400 to-indigo-600",
      bgGradient: "from-indigo-500/20 to-indigo-600/10",
      description: "Dreams • Spirituality • Illusion",
      element: "Water",
      elementIcon: Droplets,
      mantra: "ॐ नेप्च्यूनाय नमः",
      gemstone: "Aquamarine",
      day: "—",
      delay: 0.8,
    },
    {
      name: "Pluto",
      symbol: "♇",
      icon: GiOrbital,
      color: "#C084FC",
      gradient: "from-purple-400 to-fuchsia-500",
      bgGradient: "from-purple-500/20 to-fuchsia-500/10",
      description: "Transformation • Rebirth • Power",
      element: "Fire",
      elementIcon: Flame,
      mantra: "ॐ प्लूटोय नमः",
      gemstone: "Obsidian",
      day: "—",
      delay: 0.9,
    },
  ];

  const getElementColorClass = (element) => {
    switch (element) {
      case "Fire":
        return "bg-amber-500/20 text-amber-400 border-amber-400/30";
      case "Earth":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "Air":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-400/30";
      case "Water":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-400/30";
      default:
        return "bg-white/20 text-white border-white/30";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 120,
        mass: 0.8,
      },
    },
  };

  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Stars Background */}
        {[...Array(80)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white rounded-full animate-twinkle pointer-events-none"
            style={{
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-amber-400/40 text-amber-300 px-5 py-2 rounded-full text-sm font-medium mb-5 shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Celestial Wisdom</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Planetary Influences
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4" />
          <p className="text-gray-200 max-w-2xl mx-auto text-base sm:text-lg">
            Each planet carries unique cosmic energies that shape our lives, personalities, and destinies
          </p>
        </motion.div>

        {/* Planets Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6"
        >
          {planets.map((planet) => {
            const IconComponent = planet.icon;
            const ElementIcon = planet.elementIcon;
            const isHovered = hoveredPlanet === planet.name;
            
            return (
              <motion.div
                key={planet.name}
                variants={itemVariants}
                onMouseEnter={() => setHoveredPlanet(planet.name)}
                onMouseLeave={() => setHoveredPlanet(null)}
                whileHover={!isMobile ? { y: -6 } : {}}
                transition={{ duration: 0.2 }}
                className="group relative cursor-pointer"
              >
                {/* Background Glow - Only on hover */}
                <div 
                  className={`absolute -inset-0.5 bg-gradient-to-br ${planet.gradient} rounded-2xl blur-xl transition-opacity duration-300 ${
                    isHovered ? 'opacity-40' : 'opacity-0'
                  }`} 
                />
                
                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-5 shadow-lg transition-all duration-300 overflow-hidden">
                  
                  {/* Planet Icon */}
                  <div className="relative flex justify-center mb-4">
                    <div className="relative z-10">
                      <IconComponent
                        className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-300 ${
                          isHovered ? 'scale-110 drop-shadow-lg' : ''
                        }`}
                        style={{ color: planet.color }}
                      />
                    </div>
                  </div>

                  {/* Planet Details */}
                  <div className="text-center">
                    <h3 className="text-lg md:text-xl font-bold text-white flex items-center justify-center gap-1.5">
                      {planet.name}
                      <span className="text-sm text-amber-400/80">{planet.symbol}</span>
                    </h3>
                    
                    {/* Element Badge */}
                    <div className="flex justify-center mt-2">
                      <span className={`text-[10px] md:text-xs px-2.5 py-1 rounded-full border ${getElementColorClass(planet.element)} font-medium shadow-md flex items-center gap-1`}>
                        <ElementIcon className="w-2.5 h-2.5" />
                        {planet.element}
                      </span>
                    </div>
                    
                    {/* Description - Always visible */}
                    <p className="text-gray-300 text-xs mt-3 leading-relaxed">
                      {planet.description}
                    </p>
                    
                    {/* Additional Info - Visible on hover with smooth transition */}
                    <div className={`mt-3 pt-2 border-t border-white/15 transition-all duration-300 overflow-hidden ${
                      isHovered ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0'
                    }`}>
                      <p className="text-amber-300 text-[10px] font-medium">{planet.mantra}</p>
                      <p className="text-gray-300 text-[9px] mt-1 flex items-center justify-center gap-1">
                        <Gem className="w-2.5 h-2.5" /> {planet.gemstone}
                      </p>
                      {planet.day !== "—" && (
                        <p className="text-gray-300 text-[9px] flex items-center justify-center gap-1 mt-0.5">
                          <Calendar className="w-2.5 h-2.5" /> {planet.day}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Decorative Corners - Only on hover */}
                  <div className={`absolute top-2 right-2 w-5 h-5 border-t border-r border-white/20 rounded-tr-xl transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`} />
                  <div className={`absolute bottom-2 left-2 w-5 h-5 border-b border-l border-white/20 rounded-bl-xl transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Zodiac Signs Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 md:mt-20 pt-10 border-t border-white/10"
        >
          <div className="text-center mb-8 md:mb-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              The <span className="text-amber-400">Zodiac</span> Wheel
            </h3>
            <p className="text-gray-300 text-sm md:text-base">
              Twelve signs, infinite possibilities — discover your cosmic blueprint
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4">
            {[
              { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19", color: "#EF4444", element: "Fire", icon: Flame },
              { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20", color: "#10B981", element: "Earth", icon: Globe },
              { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20", color: "#F59E0B", element: "Air", icon: Wind },
              { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22", color: "#EC4899", element: "Water", icon: Droplets },
              { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22", color: "#FBBF24", element: "Fire", icon: Flame },
              { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22", color: "#84CC16", element: "Earth", icon: Globe },
              { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22", color: "#A855F7", element: "Air", icon: Wind },
              { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21", color: "#EF4444", element: "Water", icon: Droplets },
              { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21", color: "#3B82F6", element: "Fire", icon: Flame },
              { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19", color: "#6B7280", element: "Earth", icon: Globe },
              { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18", color: "#06B6D4", element: "Air", icon: Wind },
              { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20", color: "#8B5CF6", element: "Water", icon: Droplets },
            ].map((sign, index) => {
              const SignIcon = sign.icon;
              return (
                <motion.div
                  key={sign.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                  whileHover={{ y: -4 }}
                  className="group relative bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="text-3xl md:text-4xl mb-1 transition-transform group-hover:scale-110 inline-block"
                    style={{ color: sign.color, textShadow: `0 0 10px ${sign.color}50` }}
                  >
                    {sign.symbol}
                  </div>
                  <h4 className="text-xs md:text-sm font-semibold text-white">{sign.name}</h4>
                  <p className="text-gray-400 text-[8px] mt-0.5 hidden sm:block">{sign.dates}</p>
                  <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-0.5">
                    <SignIcon className="w-2.5 h-2.5 text-amber-400" />
                    <span className="text-[8px] text-amber-400 font-medium">{sign.element}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <a href="/services">
            <button className="group relative px-8 md:px-10 py-3 md:py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                <Sparkles className="w-5 h-5" />
                Get Your Birth Chart Reading
                <Heart className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </button>
          </a>
          <p className="text-gray-300 text-xs mt-4">Unlock the secrets of your destiny</p>
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.15); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.05); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.8; transform: scale(1); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 20s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 10s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 6s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default PlanetSigns;