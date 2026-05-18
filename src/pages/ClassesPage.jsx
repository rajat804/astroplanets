// src/pages/CoursesPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineChat,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { 
  FaCheck, 
  FaChevronDown, 
  FaStar, 
  FaGraduationCap, 
  FaAward, 
  FaLanguage, 
  FaLaptopCode,
  FaRupeeSign,
  FaSpinner,
  FaCheckCircle,
  FaWhatsapp,
  FaUsers,
} from "react-icons/fa";
import { GiCrystalBall, GiYinYang, GiHouse } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
/* ---------- Helpers ---------- */
const Accent = ({ children }) => (
  <span className="text-green-600">{children}</span>
);

const CTA = ({ children, className = "", onClick, disabled, ...rest }) => (
  <button
    {...rest}
    onClick={onClick}
    disabled={disabled}
    className={
      "inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold shadow-md text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 " +
      className + (disabled ? " opacity-50 cursor-not-allowed" : "")
    }
  >
    {children}
  </button>
);

/* ---------- PAYMENT MODAL COMPONENT ---------- */
const CoursePaymentModal = ({ isOpen, onClose, course, user, isAuthenticated, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState("details");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // Check if user is authenticated and user exists
    console.log(user);
    if (!isAuthenticated || !user) {
      toast.error("Please login to continue");
      onClose();
      return;
    }

    try {
      setLoading(true);
      setPaymentStep("processing");

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load payment gateway");
        setPaymentStep("details");
        setLoading(false);
        return;
      }

      const numericPrice = parseFloat(course.price.replace(/[^0-9.-]+/g, ""));
      
      // Get user ID from either id or _id field
      const userId = user.id || user._id;
      
      if (!userId) {
        toast.error("User ID not found. Please login again.");
        setPaymentStep("details");
        setLoading(false);
        return;
      }

      const orderResponse = await axios.post(`${API_URL}/coursepayment/create-order`, {
        courseId: course._id,
        userId: userId,
        userEmail: user.email,
        userName: user.fullName,
        amount: numericPrice,
      });

      if (!orderResponse.data.success) {
        toast.error("Failed to create order");
        setPaymentStep("details");
        setLoading(false);
        return;
      }

      const { orderId, amount, currency, key } = orderResponse.data;

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "Astrology Platform",
        description: `Enrollment for ${course.title}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(`${API_URL}/coursepayment/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id,
              userId: userId,
            });

            if (verifyResponse.data.success) {
              setPaymentStep("success");
              toast.success("Payment successful! You are now enrolled.");
              setTimeout(() => {
                if (onSuccess) onSuccess(verifyResponse.data);
                onClose();
              }, 2000);
            } else {
              toast.error("Payment verification failed");
              setPaymentStep("details");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed");
            setPaymentStep("details");
          }
        },
        prefill: {
          name: user.fullName || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        notes: {
          courseId: course._id,
          courseTitle: course.title,
        },
        theme: {
          color: "#dc2626",
        },
        modal: {
          ondismiss: () => {
            setPaymentStep("details");
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
      setPaymentStep("details");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const numericPrice = parseFloat(course.price?.replace(/[^0-9.-]+/g, "") || 0);
  const gst = numericPrice * 0.18;
  const total = numericPrice;

  if (paymentStep === "success") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="bg-white rounded-2xl max-w-md w-full p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FaCheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">
              You have successfully enrolled in <strong>{course.title}</strong>
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
            >
              Continue to Dashboard
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-5 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Complete Payment</h3>
                <p className="text-sm text-white/80 mt-1">Secure payment gateway</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-5 border-b border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-2">{course.title}</h4>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Course Fee</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-red-600">{course.price}</span>
                <span className="text-xs text-gray-500 ml-1">inclusive of tax</span>
              </div>
            </div>
          </div>

          <div className="p-5 border-b border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-3">You'll Get:</h4>
            <div className="space-y-2">
              {course.includes?.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheck className="text-green-500 w-4 h-4" />
                  <span>{item}</span>
                </div>
              ))}
              {course.includes?.length > 3 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaCheck className="text-green-500 w-4 h-4" />
                  <span>+{course.includes.length - 3} more benefits</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Course Price</span>
                <span className="font-medium">₹{numericPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST (18%)</span>
                <span className="font-medium">₹{Math.round(gst).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span className="text-red-600 text-lg">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4 text-xs text-gray-500">
              <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />
              <span>Secured by Razorpay | 100% Safe & Secure</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin w-4 h-4" />
                  Processing...
                </>
              ) : (
                <>
                  <FaRupeeSign className="w-4 h-4" />
                  Pay {course.price}
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              By proceeding, you agree to our Terms of Service
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ---------- HERO ---------- */
const Hero = () => (
  <section className="relative bg-gradient-to-br from-red-50 via-orange-50/30 to-offWhite py-16 md:py-20 overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <FaGraduationCap /> Transform Your Life
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
          Master Ancient Wisdom with <Accent>Expert-Led Courses</Accent>
        </h1>
        <p className="text-gray-600 mt-4 md:mt-6 max-w-2xl mx-auto text-base md:text-lg">
          Dive deep into Numerology, Vastu Shastra, and Yoga with our comprehensive certification programs. 
          Learn from masters, get certified, and transform your life and career.
        </p>
        <div className="mt-6 md:mt-8 flex flex-wrap gap-4 justify-center">
          <CTA>Explore All Courses</CTA>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ---------- FEATURED COURSE CARDS ---------- */
const CourseCard = ({ course, onViewDetails }) => {
  const getIcon = () => {
    switch(course.type) {
      case 'numerology':
        return <GiCrystalBall className="w-6 h-6 md:w-8 md:h-8 text-red-500" />;
      case 'vastu':
        return <GiHouse className="w-6 h-6 md:w-8 md:h-8 text-red-500" />;
      case 'yoga':
        return <GiYinYang className="w-6 h-6 md:w-8 md:h-8 text-red-500" />;
      default:
        return <FaGraduationCap className="w-6 h-6 md:w-8 md:h-8 text-red-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-orange-100 w-[300px] sm:w-[320px] md:w-[350px] flex-shrink-0"
      onClick={() => onViewDetails(course)}
    >
      {/* Course Image Banner */}
      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            course.level === 'Master' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
          }`}>
            {course.level}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-1.5 md:p-2">
          {getIcon()}
        </div>
      </div>

      {/* Course Info */}
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-2 mb-2">
          <FaStar className="text-yellow-500 w-3 h-3 md:w-4 md:h-4" />
          <span className="text-xs md:text-sm font-medium text-gray-600">{course.rating} (120+ reviews)</span>
        </div>
        
        <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
          {course.description}
        </p>

        {/* Key Features */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-600">
            <HiOutlineClock className="text-red-500 w-3 h-3 md:w-4 md:h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-600">
            <HiOutlineBookOpen className="text-red-500 w-3 h-3 md:w-4 md:h-4" />
            <span>{course.sessions}+ Sessions</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-600">
            <FaLanguage className="text-red-500 w-3 h-3 md:w-4 md:h-4" />
            <span>{course.courseLanguage || course.language}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-600">
            <FaLaptopCode className="text-red-500 w-3 h-3 md:w-4 md:h-4" />
            <span>{course.mode}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-orange-100">
          <div>
            <span className="text-[10px] md:text-xs text-gray-500">Starting from</span>
            <div className="text-lg md:text-xl lg:text-2xl font-bold text-red-600">{course.price}</div>
          </div>
          <button 
            className="px-3 md:px-4 py-1.5 md:py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition text-xs md:text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(course);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------- COURSE DETAILS MODAL WITH PAYMENT ---------- */
/* ---------- COURSE DETAILS MODAL ---------- */
const CourseDetailsModal = ({ course, onClose, user, isAuthenticated }) => {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);

  const handleEnrollClick = () => {
    if (isAuthenticated && user) {
      setShowPayment(true);
    } else {
      toast.error("Please login to continue");
      navigate("/auth", { state: { redirectTo: "/courses" } });
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Successfully enrolled in the course!");
    setTimeout(() => {
      navigate("/profile");
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Course Header */}
            <div className="relative h-48 sm:h-56 md:h-64">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur rounded-full p-2 text-white hover:bg-white/40 transition"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
                <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold ${
                  course.level === 'Master' ? 'bg-red-500' : 'bg-orange-500'
                }`}>
                  {course.level} Certification
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 md:mt-3">{course.title}</h2>
              </div>
            </div>

            <div className="p-4 md:p-6 lg:p-8">
              {/* Course Content */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-orange-50 rounded-xl p-3 md:p-4 text-center">
                  <HiOutlineClock className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto mb-2" />
                  <div className="text-xs md:text-sm text-gray-600">Duration</div>
                  <div className="font-semibold text-sm md:text-base">{course.duration}</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 md:p-4 text-center">
                  <HiOutlineBookOpen className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto mb-2" />
                  <div className="text-xs md:text-sm text-gray-600">Sessions</div>
                  <div className="font-semibold text-sm md:text-base">{course.sessions}+ Live Classes</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 md:p-4 text-center">
                  <FaAward className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto mb-2" />
                  <div className="text-xs md:text-sm text-gray-600">Certification</div>
                  <div className="font-semibold text-sm md:text-base">{course.level} Diploma</div>
                </div>
              </div>

              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">About This Course</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">{course.longDescription}</p>
              </div>

              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">What You'll Learn</h3>
                <ul className="grid md:grid-cols-2 gap-2 md:gap-3">
                  {course.syllabus?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FaCheck className="text-green-500 mt-1 w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-gray-700 text-xs md:text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Course Includes</h3>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {course.includes?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                      <FaCheck className="text-green-500 w-3 h-3 md:w-4 md:h-4" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-xs md:text-sm text-gray-600">Course Fee</div>
                  <div className="text-2xl md:text-3xl font-bold text-red-600">{course.price}</div>
                  <div className="text-[10px] md:text-xs text-gray-500">Inclusive of all taxes</div>
                </div>
                <button 
                  onClick={handleEnrollClick}
                  className="px-6 md:px-8 py-2 md:py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition transform hover:scale-105 text-sm md:text-base flex items-center gap-2"
                >
                  <FaRupeeSign className="w-4 h-4" />
                  Enroll Now
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><FaUsers className="w-3 h-3" /><span>5000+ Students</span></div>
                <div className="flex items-center gap-1"><FaWhatsapp className="w-3 h-3 text-green-500" /><span>24/7 Support</span></div>
                <div className="flex items-center gap-1"><HiOutlineShieldCheck className="w-3 h-3" /><span>7-Day Refund</span></div>
                <div className="flex items-center gap-1"><FaStar className="w-3 h-3 text-yellow-500" /><span>4.9 Rating</span></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <CoursePaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        course={course}
        user={user}
        isAuthenticated={isAuthenticated}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};
/* ---------- HORIZONTAL SCROLL SECTION ---------- */
const HorizontalScrollSection = ({ title, category, courses, onViewDetails, loading }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const categoryIcons = {
    numerology: '🔮',
    vastu: '🏠',
    yoga: '🧘'
  };

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 20);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 20
      );
    }
  };

  // Scroll functions
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Mouse drag scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.userSelect = 'auto';
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      container.style.cursor = 'grab';
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [courses]);

  if (loading) {
    return (
      <div className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[300px] sm:w-[320px] md:w-[350px] h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-2xl md:text-3xl lg:text-4xl">{categoryIcons[category] || '📚'}</span>
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
              {title}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-0.5 md:mt-1">
              {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
            </p>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <div className="hidden lg:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className={`p-1.5 md:p-2 rounded-full bg-white border border-orange-200 text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-300 ${
              !showLeftArrow ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            disabled={!showLeftArrow}
          >
            <HiOutlineChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`p-1.5 md:p-2 rounded-full bg-white border border-orange-200 text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-300 ${
              !showRightArrow ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            disabled={!showRightArrow}
          >
            <HiOutlineChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide pb-4 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex gap-4 md:gap-6 w-max">
          {courses.map((course) => (
            <CourseCard
              key={course._id || course.id}
              course={course}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- SIDEBAR COMPONENT ---------- */
const Sidebar = ({ activeCategory, onCategoryChange, isMobileMenuOpen, setIsMobileMenuOpen, courseCounts }) => {
  const categories = [
    { id: 'all', name: 'All Courses', icon: '📚', count: courseCounts.total },
    { id: 'numerology', name: 'Numerology', icon: '🔮', count: courseCounts.numerology },
    { id: 'vastu', name: 'Vastu Shastra', icon: '🏠', count: courseCounts.vastu },
    { id: 'yoga', name: 'Yoga', icon: '🧘', count: courseCounts.yoga },
  ];

  const sidebarContent = (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-4">
      <div className="mb-4 md:mb-6 pb-3 md:pb-4 border-b border-orange-100">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
          📚 Categories
        </h3>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Filter courses by category</p>
      </div>
      
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              onCategoryChange(category.id);
              if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2.5 md:p-3 rounded-xl transition-all duration-300 ${
              activeCategory === category.id
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-lg md:text-xl">{category.icon}</span>
              <span className="font-semibold text-sm md:text-base">{category.name}</span>
            </div>
            <span className={`text-xs md:text-sm font-medium px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${
              activeCategory === category.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Featured Badge */}
      <div className="mt-4 md:mt-6 pt-4 border-t border-orange-100">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 md:p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl md:text-2xl">🏆</span>
            <span className="font-semibold text-gray-800 text-sm md:text-base">Why Choose Us?</span>
          </div>
          <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <FaCheck className="text-green-500 w-3 h-3" />
              <span>Certified Experts</span>
            </li>
            <li className="flex items-center gap-2">
              <FaCheck className="text-green-500 w-3 h-3" />
              <span>Lifetime Access</span>
            </li>
            <li className="flex items-center gap-2">
              <FaCheck className="text-green-500 w-3 h-3" />
              <span>Practical Training</span>
            </li>
            <li className="flex items-center gap-2">
              <FaCheck className="text-green-500 w-3 h-3" />
              <span>Recognized Certificate</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
        <div className="sticky top-24">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between bg-white rounded-xl shadow-lg border border-orange-100 p-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="font-semibold text-gray-800">Filter Categories</span>
          </div>
          {isMobileMenuOpen ? (
            <HiOutlineX className="w-5 h-5 text-gray-600" />
          ) : (
            <HiOutlineMenu className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mb-4"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ---------- COURSES SECTION ---------- */
const CoursesSection = ({ onViewDetails }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseCounts, setCourseCounts] = useState({
    total: 0,
    numerology: 0,
    vastu: 0,
    yoga: 0
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch courses from API
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/courses`);
      
      if (response.data.success) {
        const allCourses = response.data.courses;
        setCourses(allCourses);
        
        // Calculate counts
        const counts = {
          total: allCourses.length,
          numerology: allCourses.filter(c => c.type === 'numerology').length,
          vastu: allCourses.filter(c => c.type === 'vastu').length,
          yoga: allCourses.filter(c => c.type === 'yoga').length
        };
        setCourseCounts(counts);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
      
      // Fallback to static data if API fails
      const fallbackCourses = getFallbackCourses();
      setCourses(fallbackCourses);
      setCourseCounts({
        total: fallbackCourses.length,
        numerology: fallbackCourses.filter(c => c.type === 'numerology').length,
        vastu: fallbackCourses.filter(c => c.type === 'vastu').length,
        yoga: fallbackCourses.filter(c => c.type === 'yoga').length
      });
    } finally {
      setLoading(false);
    }
  };

  // Fallback static data
  const getFallbackCourses = () => {
    return [
      {
        _id: '1',
        type: 'numerology',
        title: 'Professional Numerology Course',
        level: 'Diploma',
        duration: '3 Months',
        sessions: '30+',
        courseLanguage: 'Hindi, English',
        mode: 'Live Online',
        price: '₹24,999',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1590080876135-2a34e3a3d6a9?w=800&h=500&fit=crop',
        description: 'Master the ancient science of numbers with our comprehensive diploma program.',
        longDescription: 'This comprehensive Numerology Diploma program takes you on a transformative journey...',
        syllabus: ['Introduction to Numerology', 'Lo Shu Grid Analysis', 'Personal Number Calculation'],
        includes: ['30+ Live Sessions', 'Study Material', 'Certificate of Completion']
      },
      {
        _id: '3',
        type: 'vastu',
        title: 'Vastu Shastra Diploma',
        level: 'Diploma',
        duration: '3 Months',
        sessions: '30+',
        courseLanguage: 'Hindi, English',
        mode: 'Live Online',
        price: '₹24,999',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=500&fit=crop',
        description: 'Learn the ancient science of architecture and space harmony.',
        longDescription: 'Vastu Shastra teaches us how to create harmonious living spaces...',
        syllabus: ['Introduction to Vastu', 'Five Elements', 'Directions Significance'],
        includes: ['30+ Live Sessions', 'Vastu Toolkit', 'Certificate']
      },
      {
        _id: '5',
        type: 'yoga',
        title: 'Yoga Teacher Training',
        level: 'Diploma',
        duration: '3 Months',
        sessions: '45+',
        courseLanguage: 'Hindi, English',
        mode: 'Live Online',
        price: '₹29,999',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop',
        description: 'Transformative yoga teacher training program.',
        longDescription: 'Embark on a transformative journey to become a certified yoga teacher...',
        syllabus: ['History of Yoga', 'Asanas', 'Pranayama'],
        includes: ['45+ Live Sessions', 'Detailed Manual', 'Yoga Alliance Certified']
      }
    ];
  };

  // Get courses based on active category
  const getFilteredCourses = () => {
    if (activeCategory === 'all') {
      return courses;
    }
    return courses.filter(course => course.type === activeCategory);
  };

  const filteredCourses = getFilteredCourses();

  // Group courses by category for "All Courses" view
  const getGroupedCourses = () => {
    if (activeCategory !== 'all') return null;
    
    const numerologyCourses = courses.filter(c => c.type === 'numerology');
    const vastuCourses = courses.filter(c => c.type === 'vastu');
    const yogaCourses = courses.filter(c => c.type === 'yoga');
    
    const groups = [];
    if (numerologyCourses.length > 0) {
      groups.push({ title: 'Numerology Courses', category: 'numerology', courses: numerologyCourses });
    }
    if (vastuCourses.length > 0) {
      groups.push({ title: 'Vastu Shastra Courses', category: 'vastu', courses: vastuCourses });
    }
    if (yogaCourses.length > 0) {
      groups.push({ title: 'Yoga & Meditation Courses', category: 'yoga', courses: yogaCourses });
    }
    
    return groups;
  };

  const groupedCourses = getGroupedCourses();

  return (
    <section className="py-12 md:py-20 bg-offWhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
            Explore Our <span className="text-red-600">Certified Programs</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Choose from our comprehensive certification programs designed to transform your understanding and career
          </p>
        </div>

        {/* Sidebar + Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <Sidebar 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            courseCounts={courseCounts}
          />

          {/* Main Content - Right */}
          <div className="flex-1 min-w-0">
            {loading ? (
              // Loading skeletons
              <div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mb-8">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="flex gap-4">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="w-[300px] sm:w-[320px] md:w-[350px] h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : activeCategory === 'all' ? (
              // Show all categories as horizontal scroll sections
              <div>
                {groupedCourses && groupedCourses.map((group, index) => (
                  <HorizontalScrollSection
                    key={index}
                    title={group.title}
                    category={group.category}
                    courses={group.courses}
                    onViewDetails={onViewDetails}
                    loading={false}
                  />
                ))}
                {(!groupedCourses || groupedCourses.length === 0) && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No courses available</p>
                  </div>
                )}
              </div>
            ) : (
              // Show single category
              <div>
                <div className="mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                    {activeCategory === 'numerology' && '🔮 Numerology Courses'}
                    {activeCategory === 'vastu' && '🏠 Vastu Shastra Courses'}
                    {activeCategory === 'yoga' && '🧘 Yoga & Meditation Courses'}
                  </h2>
                  <p className="text-gray-500 text-xs md:text-sm mt-1">
                    {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'} Available
                  </p>
                </div>
                
                {/* Grid layout for mobile, horizontal scroll for desktop */}
                <div className="block lg:hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {filteredCourses.map((course) => (
                      <div key={course._id || course.id} className="flex justify-center">
                        <CourseCard
                          course={course}
                          onViewDetails={onViewDetails}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <HorizontalScrollSection
                    title=""
                    category={activeCategory}
                    courses={filteredCourses}
                    onViewDetails={onViewDetails}
                    loading={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Hide Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

/* ---------- WHY CHOOSE US ---------- */
const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaGraduationCap className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Certified Experts",
      description: "Learn from industry experts with decades of experience"
    },
    {
      icon: <HiOutlineAcademicCap className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Recognized Certification",
      description: "Get certified and start your professional journey"
    },
    {
      icon: <HiOutlineClock className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Flexible Learning",
      description: "Live online classes with lifetime access to recordings"
    },
    {
      icon: <HiOutlineChat className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Support Community",
      description: "Join our community of learners and practitioners"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-4">Why Choose Our Courses?</h2>
          <p className="text-gray-600 text-sm md:text-base">Join thousands of successful graduates who transformed their lives</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-4 md:p-6 bg-offWhite rounded-2xl hover:shadow-lg transition border border-orange-100"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-3 md:mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-xs md:text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- FAQ ---------- */
const FAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    {
      q: "How are the courses conducted?",
      a: "All our courses are conducted live via Zoom/Google Meet. Each session is recorded and made available in your dashboard for lifetime access."
    },
    {
      q: "Will I receive a certificate?",
      a: "Yes, upon successful completion of the course and assessment, you will receive a recognized certificate that you can showcase on your resume and LinkedIn."
    },
    {
      q: "What if I miss a live class?",
      a: "Don't worry! All sessions are recorded and uploaded to your dashboard within 24 hours. You can access them anytime, anywhere."
    },
    {
      q: "Is there any practical training?",
      a: "Absolutely! Our courses include practical assignments, case studies, and live practice sessions to ensure you gain hands-on experience."
    },
    {
      q: "Can I get a refund if I'm not satisfied?",
      a: "We offer a 7-day money-back guarantee if you're not satisfied with the course quality. No questions asked!"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-orange-50/30 to-offWhite">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-sm md:text-base">Got questions? We've got answers</p>
        </div>
        <div className="space-y-3 md:space-y-4">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex justify-between w-full items-center p-4 md:p-5 font-semibold text-gray-800 hover:bg-red-50 transition text-sm md:text-base"
              >
                <span>{f.q}</span>
                <FaChevronDown
                  className={`transition-transform text-red-500 w-3 h-3 md:w-4 md:h-4 ${
                    open === i ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 md:px-5 md:pb-5"
                  >
                    <p className="text-gray-600 text-sm md:text-base">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- MAIN PAGE ---------- */
const CoursesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
  };

  const handleEnroll = (course) => {
    if (isAuthenticated) {
      navigate(`/checkout/${course._id || course.id}`);
    } else {
      navigate("/auth", { state: { redirectTo: `/checkout/${course._id || course.id}` } });
    }

  };

  return (
    <main className="bg-offWhite min-h-screen">
      <Hero />
      <CoursesSection onViewDetails={handleViewDetails} />
      <WhyChooseUs />
      <FAQ />
      
      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal 
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnroll={handleEnroll}
          user={user}
  isAuthenticated={isAuthenticated}
        />
      )}
    </main>
  );
};

export default CoursesPage;

