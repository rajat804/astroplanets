// ServicesPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineChat,
  HiOutlineSparkles,
  HiOutlineUsers,
  HiOutlineStar,
} from "react-icons/hi";
import { FaCheck, FaChevronDown, FaRupeeSign, FaStar, FaSpinner } from "react-icons/fa";
import { GiCrystalBall, GiSolarSystem, GiSevenPointedStar, GiSunbeams } from "react-icons/gi";
import BookConsultationButton from "../components/common/BookConsultationButton";
import ServiceBookingModal from "../components/common/ServiceBookingModal";
import PlanPaymentModal from "../components/common/PlanPaymentModal";

/* ---------- Helpers ---------- */
const Accent = ({ children }) => (
  <span className="text-red-600">{children}</span>
);

/* ---------- ICON MAP ---------- */
const iconMap = {
  GiCrystalBall: GiCrystalBall,
  GiSolarSystem: GiSolarSystem,
  GiSevenPointedStar: GiSevenPointedStar,
  GiSunbeams: GiSunbeams,
};

const getIcon = (iconName) => {
  const Icon = iconMap[iconName] || GiCrystalBall;
  return <Icon className="w-6 h-6 md:w-8 md:h-8" />;
};

const getGradient = (gradientKey) => {
  const gradients = {
    purple: "from-red-500/10 to-rose-500/10",
    blue: "from-red-500/10 to-rose-500/10",
    green: "from-red-500/10 to-rose-500/10",
    orange: "from-red-500/10 to-rose-500/10",
    red: "from-red-500/10 to-rose-500/10",
    indigo: "from-red-500/10 to-rose-500/10",
    teal: "from-red-500/10 to-rose-500/10",
    yellow: "from-red-500/10 to-rose-500/10",
  };
  return gradients[gradientKey] || gradients.red;
};

/* ---------- HERO ---------- */
const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative bg-gradient-to-b from-red-50/50 to-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Talk to our experts about <Accent>Astro, Numero, Vastu, Yoga</Accent> & more
        </h1>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
          From astrology to vastu, numerology, and personalized wellness — find
          the right guidance and tools crafted for your journey.
        </p>

        <div className="mt-6">
          <BookConsultationButton
            prefillData={{
              name: user?.name || "",
              email: user?.email || "",
              phone: user?.phone || "",
            }}
          />
        </div>
      </div>
    </section>
  );
};

/* ---------- SERVICE CARD COMPONENT ---------- */
const ServiceCard = ({ service, onBookNow }) => {
  const gradientClass = getGradient(service.gradientKey);
  const numericPrice = parseFloat(service.price?.replace(/[^0-9.-]+/g, "") || 0);
  const mrp = service.mrpPrice ? parseFloat(service.mrpPrice.replace(/[^0-9.-]+/g, "")) : numericPrice;
  const discountPercent = mrp > numericPrice ? Math.round(((mrp - numericPrice) / mrp) * 100) : service.discount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-red-100"
    >
      {/* Image Section */}
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${gradientClass}`}>
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 via-red-800/20 to-transparent" />
        
        {/* Icon Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-full p-2 shadow-lg">
          <div className={service.iconColor || "text-red-500"}>
            {getIcon(service.icon)}
          </div>
        </div>
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-red-600 transition">
          {service.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <HiOutlineClock className="w-3 h-3" />
          <span>{service.duration}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {service.description}
        </p>

        {/* Benefits */}
        <div className="flex flex-wrap gap-1 mb-3">
          {service.benefits?.slice(0, 2).map((benefit, idx) => (
            <span key={idx} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
              {benefit}
            </span>
          ))}
          {service.benefits?.length > 2 && (
            <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
              +{service.benefits.length - 2} more
            </span>
          )}
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-red-100">
          <div>
            {discountPercent > 0 && (
              <span className="text-xs text-gray-400 line-through block">
                ₹{mrp.toLocaleString()}
              </span>
            )}
            <span className="text-xl font-bold text-red-600">
              ₹{numericPrice.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => onBookNow(service)}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-semibold hover:from-red-600 hover:to-red-700 transition transform hover:scale-105 shadow-md"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------- SERVICES GRID SECTION ---------- */
const ServicesGrid = ({ onBookNow }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([{ id: "all", name: "All Services", icon: "✨" }]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(s => s.type === selectedCategory);
      setFilteredServices(filtered);
    }
  }, [selectedCategory, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/services`);
      if (response.data.success && Array.isArray(response.data.services)) {
        setServices(response.data.services);
        setFilteredServices(response.data.services);
        
        const uniqueTypes = [...new Set(response.data.services.map(s => s.type).filter(Boolean))];
        const categoryList = [
          { id: "all", name: "All Services", icon: "✨" },
          ...uniqueTypes.map(type => ({
            id: type,
            name: type.charAt(0).toUpperCase() + type.slice(1),
            icon: getCategoryIcon(type)
          }))
        ];
        setCategories(categoryList);
      } else {
        setServices([]);
        setFilteredServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (type) => {
    const icons = {
      astrology: "🔮",
      numerology: "🔢",
      vastu: "🏠",
      yoga: "🧘",
      tarot: "🃏",
      meditation: "🧠",
      reiki: "🌟",
      palmistry: "✋"
    };
    return icons[type] || "✨";
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <GiCrystalBall className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4">
            <HiOutlineSparkles className="text-red-500 w-4 h-4" />
            <span className="text-sm font-semibold text-red-700">Our Services</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Our Spiritual Services</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Choose from our wide range of authentic spiritual and astrological services
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200"
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No services available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onBookNow={onBookNow}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ---------- PLANS SECTION (Dynamic from API) ---------- */
const PlansSection = ({ onChoosePlan }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/plans`);
      
      if (response.data.success && response.data.plans) {
        setPlans(response.data.plans);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Failed to load plans. Please try again later.");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (mrp, selling) => {
    if (!mrp || !selling) return 0;
    const discount = ((mrp - selling) / mrp) * 100;
    return Math.round(discount);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4">
              <HiOutlineSparkles className="text-red-500 w-4 h-4 animate-pulse" />
              <span className="text-sm font-semibold text-red-700">Choose Your Plan</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800">Choose Your Perfect Plan</h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <FaSpinner className="animate-spin text-red-500 w-12 h-12 mx-auto mb-4" />
              <p className="text-gray-500">Loading plans...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4">
              <HiOutlineSparkles className="text-red-500 w-4 h-4" />
              <span className="text-sm font-semibold text-red-700">Choose Your Plan</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800">Choose Your Perfect Plan</h2>
          </div>
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchPlans}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (plans.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4">
              <HiOutlineSparkles className="text-red-500 w-4 h-4" />
              <span className="text-sm font-semibold text-red-700">Choose Your Plan</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800">Choose Your Perfect Plan</h2>
          </div>
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <p className="text-gray-500">No plans available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4">
            <HiOutlineSparkles className="text-red-500 w-4 h-4" />
            <span className="text-sm font-semibold text-red-700">Choose Your Plan</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800">Choose Your Perfect Plan</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Select the plan that fits your needs — from quick insights to deep dives with our experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const discountPercent = calculateDiscount(plan.mrpPrice, plan.sellingPrice);
            const displayPrice = plan.sellingPrice || plan.price;
            const displayMrp = plan.mrpPrice || plan.originalPrice || displayPrice;
            
            return (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                  plan.isPopular 
                    ? "shadow-2xl ring-2 ring-red-400 ring-offset-2 ring-offset-white" 
                    : "shadow-lg hover:shadow-xl"
                } bg-white`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-5 py-2 rounded-bl-2xl shadow-md flex items-center gap-1">
                      <FaStar className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-7 flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className={`text-2xl font-bold ${plan.isPopular ? "text-red-600" : "text-gray-800"}`}>
                      {plan.name}
                    </h3>
                    <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full mt-2"></div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-4xl font-extrabold text-gray-900">
                        ₹{displayPrice.toLocaleString()}
                      </span>
                      {discountPercent > 0 && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{displayMrp.toLocaleString()}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Save {discountPercent}%
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{plan.duration}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onChoosePlan(plan)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                      plan.isPopular
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200"
                    }`}
                  >
                    Choose Plan
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-12 pt-6 border-t border-red-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <HiOutlineUsers className="w-5 h-5 text-green-500" />
            <span>10,000+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaStar className="w-4 h-4 text-green-500" />
            <span>4.9 Rating (2,500+ reviews)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <HiOutlineShieldCheck className="w-5 h-5 text-green-500" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <HiOutlineClock className="w-5 h-5 text-green-500" />
            <span>Instant Confirmation</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- WHY CHOOSE US (Red, White, Green Theme) ---------- */
const WhyChooseUs = () => {
  const features = [
    {
      icon: <GiCrystalBall className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Expert Astrologers",
      description: "Certified professionals with years of experience"
    },
    {
      icon: <HiOutlineShieldCheck className="w-6 h-6 md:w-8 md:h-8" />,
      title: "100% Confidential",
      description: "Your privacy is our priority"
    },
    {
      icon: <HiOutlineCalendar className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Flexible Scheduling",
      description: "Book at your convenience"
    },
    {
      icon: <HiOutlineChat className="w-6 h-6 md:w-8 md:h-8" />,
      title: "24/7 Support",
      description: "We're here to help you anytime"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
            <HiOutlineStar className="text-green-600 w-4 h-4" />
            <span className="text-sm font-semibold text-green-700">Why Trust Us</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2>
          <p className="text-gray-600 mt-2">Trusted by thousands for authentic spiritual guidance</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-6 bg-white rounded-2xl hover:shadow-lg transition border border-green-100"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- FAQ (Red Theme) ---------- */
const FAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    {
      q: "How do I book a consultation?",
      a: "Simply select your desired service, pick a slot, and checkout securely online."
    },
    {
      q: "Are remedies included?",
      a: "Basic remedies are shared during sessions. Premium kits are available in our shop."
    },
    {
      q: "Can I reschedule?",
      a: "Yes, up to 24 hours before your session without extra charge."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, UPI, and net banking through secure payment gateways."
    }
  ];

  return (
    <section className="py-16 bg-red-50/30">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4">
            <HiOutlineChat className="text-red-500 w-4 h-4" />
            <span className="text-sm font-semibold text-red-700">Got Questions?</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 cursor-pointer border border-red-100 hover:shadow-md transition"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex justify-between w-full items-center font-semibold text-gray-800"
              >
                {f.q}
                <FaChevronDown
                  className={`transition text-red-500 ${
                    open === i ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 text-sm text-gray-600"
                  >
                    {f.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- MAIN PAGE ---------- */
const ServicesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanPaymentModal, setShowPlanPaymentModal] = useState(false);

  const handleBookNow = (service) => {
    if (isAuthenticated && user) {
      setSelectedService(service);
      setShowPaymentModal(true);
    } else {
      window.location.href = '/auth';
    }
  };

  const handleChoosePlan = (plan) => {
    if (isAuthenticated && user) {
      setSelectedPlan(plan);
      setShowPlanPaymentModal(true);
    } else {
      window.location.href = '/auth';
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedService(null);
    setShowPlanPaymentModal(false);
    setSelectedPlan(null);
  };

  return (
    <main className="bg-white">
      <Hero />
      <ServicesGrid onBookNow={handleBookNow} />
      <PlansSection onChoosePlan={handleChoosePlan} />
      <WhyChooseUs />
      <FAQ />

      {/* Service Payment Modal */}
      {selectedService && (
        <ServiceBookingModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedService(null);
          }}
          service={selectedService}
          user={user}
          isAuthenticated={isAuthenticated}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Plan Payment Modal */}
      {selectedPlan && (
        <PlanPaymentModal
          isOpen={showPlanPaymentModal}
          onClose={() => {
            setShowPlanPaymentModal(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
          user={user}
          isAuthenticated={isAuthenticated}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </main>
  );
};

export default ServicesPage;