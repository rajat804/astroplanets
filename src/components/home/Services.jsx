// components/home/Services.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  HiOutlineClock, 
  HiOutlineSparkles,
} from "react-icons/hi";
import { 
  GiCrystalBall, 
  GiMagicSwirl, 
  GiVibratingShield,
  GiStarsStack,
} from "react-icons/gi";
import { FaMoon } from "react-icons/fa";
import ServiceBookingModal from "../common/ServiceBookingModal";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Services = () => {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/services`);
      if (response.data.success) {
        setServices(response.data.services);
      } else {
        // Fallback to static data if API fails
        setServices(getFallbackServices());
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices(getFallbackServices());
      toast.error("Failed to load services, showing demo data");
    } finally {
      setLoading(false);
    }
  };

  // Fallback static data
  const getFallbackServices = () => {
    return [
      {
        _id: "1",
        title: "One-on-one Natal Chart Reading",
        description: "Deep, personalized chart analysis, career & relationship guidance.",
        duration: "60 min",
        price: "₹2,499",
        image: "https://media.istockphoto.com/id/1935644904/photo/zodiac-wheel-natal-chart-astrology-dices-and-stones-on-grey-table-flat-lay.jpg?s=612x612&w=0&k=20&c=128i99Orc9Y_RU3nSYKNLjf-INw5inM6q_H9FDCi_JE=",
        icon: "GiCrystalBall",
        iconColor: "text-purple-500",
        gradientKey: "purple",
        benefits: ["Birth Chart Analysis", "Career Guidance", "Relationship Insights"],
        symbolType: "zodiac"
      },
      {
        _id: "2",
        title: "Numerology Life Path Report",
        description: "Actionable insights from your core numbers and cycles.",
        duration: "45 min",
        price: "₹1,299",
        image: "https://astrala.imgix.net/3GFULF5okVu23twscOo7Fd/7406ee47eac22e71767ea4f4ec1412c7/life-path-number-7-meaning.jpg?w=3840&h=2560&fit=crop&q=60&auto=format,compress",
        icon: "GiStarsStack",
        iconColor: "text-blue-500",
        gradientKey: "blue",
        benefits: ["Life Path Number", "Destiny Matrix", "Cycle Analysis"],
        symbolType: "numbers"
      },
      {
        _id: "3",
        title: "Vastu Home Harmony Session",
        description: "Practical remedies to balance your living & working space.",
        duration: "90 min",
        price: "₹3,999",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
        icon: "GiVibratingShield",
        iconColor: "text-green-500",
        gradientKey: "green",
        benefits: ["Space Analysis", "Energy Balancing", "Remedial Solutions"],
        symbolType: "directions"
      },
    ];
  };

  // Detect device performance
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const isSlow = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
      setIsLowEndDevice(mobile && isSlow);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleBookNow = (service) => {
    if (isAuthenticated) {
      setSelectedService(service);
      setIsModalOpen(true);
    } else {
      toast.error("Please login to continue");
    }
  };

  const iconMap = {
    GiCrystalBall: GiCrystalBall,
    GiStarsStack: GiStarsStack,
    GiVibratingShield: GiVibratingShield,
  };

  const getIcon = (iconName) => {
    const Icon = iconMap[iconName] || GiCrystalBall;
    return <Icon className="w-4 h-4 md:w-5 md:h-5" />;
  };

  const getGradientClass = (gradientKey) => {
    const gradients = {
      purple: "from-purple-500/10 to-pink-500/10",
      blue: "from-blue-500/10 to-cyan-500/10",
      green: "from-green-500/10 to-emerald-500/10",
      orange: "from-orange-500/10 to-amber-500/10",
      red: "from-red-500/10 to-rose-500/10",
      indigo: "from-indigo-500/10 to-purple-500/10",
      teal: "from-teal-500/10 to-cyan-500/10",
      yellow: "from-yellow-500/10 to-orange-500/10",
    };
    return gradients[gradientKey] || gradients.purple;
  };

  const getSymbols = (type) => {
    switch(type) {
      case 'zodiac':
        return ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
      case 'numbers':
        return ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      case 'directions':
        return ["N", "S", "E", "W", "NE", "NW", "SE", "SW"];
      default:
        return [];
    }
  };

  // Reduce background animations on mobile/low-end
  const showBackgroundAnimations = !isLowEndDevice;
  const orbCount = isLowEndDevice ? 2 : isMobile ? 3 : 6;
  const starCount = isLowEndDevice ? 15 : isMobile ? 25 : 50;

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center bg-gradient-to-b from-offWhite to-orange-50/50">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-offWhite to-orange-50/50">
      {/* Animated Background Elements */}
      {showBackgroundAnimations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
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
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-8">
          {services.map((s, i) => {
            const isHovered = hoveredCard === i;
            const symbols = getSymbols(s.symbolType);
            const gradientClass = getGradientClass(s.gradientKey);
            
            return (
              <motion.article
                key={s._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 0.4, 
                  delay: isLowEndDevice ? 0 : i * 0.08,
                }}
                whileHover={!isMobile ? { y: -8 } : {}}
                onHoverStart={() => !isMobile && setHoveredCard(i)}
                onHoverEnd={() => !isMobile && setHoveredCard(null)}
                className="relative group cursor-pointer"
              >
                {!isMobile && (
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${isHovered ? 'opacity-30' : ''}`} />
                )}
                
                <div className={`relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-orange-100 bg-gradient-to-br ${gradientClass}`}>
                  {/* Image Section */}
                  <div className="relative h-44 md:h-52 overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    <div className="absolute left-3 md:left-4 top-3 md:top-4 bg-white/90 backdrop-blur px-2 md:px-3 py-1 rounded-lg md:rounded-xl text-[10px] md:text-xs font-semibold shadow-lg">
                      ✨ Expert Session
                    </div>

                    <div className="absolute right-3 md:right-4 bottom-3 md:bottom-4 bg-white/90 backdrop-blur rounded-full p-1.5 md:p-2 shadow-lg">
                      <div className={s.iconColor}>
                        {getIcon(s.icon)}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <h4 className={`text-base md:text-xl font-semibold text-gray-900 transition-colors duration-300 ${isHovered && !isMobile ? 'text-red-600' : ''}`}>
                      {s.title}
                    </h4>
                    
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      {s.description}
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-1">
                      {s.benefits?.slice(0, 3).map((benefit) => (
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

                    {/* Action Buttons - Only Book Now */}
                    <div className="flex gap-2 md:gap-3 mt-3 md:mt-4">
                      <button
                        onClick={() => handleBookNow(s)}
                        className="flex-1 px-2 md:px-4 py-1.5 md:py-2.5 rounded-lg md:rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-[10px] md:text-sm"
                      >
                        Book Now
                      </button>
                    </div>

                    {/* Symbols - Only show on desktop hover */}
                    {!isMobile && symbols.length > 0 && (
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-orange-100"
                          >
                            <div className="flex items-center justify-center gap-0.5 md:gap-1 flex-wrap">
                              {symbols.slice(0, 12).map((symbol, idx) => (
                                <span
                                  key={`${s.symbolType}-${idx}`}
                                  className={`text-[8px] md:text-xs ${
                                    s.symbolType === 'zodiac' 
                                      ? 'text-purple-400' 
                                      : s.symbolType === 'numbers'
                                      ? 'text-blue-400 font-mono'
                                      : 'text-green-400'
                                  } transition-colors`}
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

        {/* Decorative Floating Elements */}
        {!isMobile && services.length > 0 && (
          <>
            <div className="absolute -left-20 top-1/3 opacity-10 hidden xl:block animate-float-slow">
              <div className="text-6xl">🔮</div>
            </div>
            <div className="absolute -right-20 bottom-1/3 opacity-10 hidden xl:block animate-float-reverse">
              <FaMoon size={80} className="text-purple-600" />
            </div>
          </>
        )}
      </div>

      {/* Booking Modal */}
      <ServiceBookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />

      <style jsx>{`
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -15px) scale(1.05); }
          66% { transform: translate(-15px, 10px) scale(0.95); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.5; transform: scale(1); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(30px) rotate(180deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) rotate(360deg); }
          50% { transform: translateY(-30px) rotate(0deg); }
        }
        .animate-float-orb { animation: float-orb ease-in-out infinite; will-change: transform; }
        .animate-twinkle { animation: twinkle ease-in-out infinite; will-change: opacity, transform; }
        .animate-float-slow { animation: float-slow 20s ease-in-out infinite; will-change: transform; }
        .animate-float-reverse { animation: float-reverse 25s ease-in-out infinite; will-change: transform; }
      `}</style>
    </section>
  );
};

export default Services;