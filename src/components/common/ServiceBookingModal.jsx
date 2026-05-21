// src/components/common/ServiceBookingModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  HiOutlineX, 
  HiOutlineCalendar, 
  HiOutlineClock, 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineChat,
  HiOutlineShieldCheck
} from "react-icons/hi";
import { FaRupeeSign, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ServiceBookingModal = ({ isOpen, onClose, service, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (user && isAuthenticated && service) {
      setFormData(prev => ({
        ...prev,
        userName: user.fullName || user.name || "",
        userEmail: user.email || "",
        userPhone: user.phone || ""
      }));
    }
  }, [user, isAuthenticated, service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    if (!isAuthenticated || !user) {
      toast.error("Please login to continue");
      return;
    }

    if (!service) {
      toast.error("Service not found");
      return;
    }

    if (!formData.preferredDate || !formData.preferredTime) {
      toast.error("Please select preferred date and time");
      return;
    }

    setLoading(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load payment gateway");
        setLoading(false);
        return;
      }

      const amount = parseFloat(service.price.replace(/[^0-9.-]+/g, ""));
      
      // Create order
      const orderResponse = await axios.post(`${API_URL}/servicebookings/create-order`, {
        serviceId: service._id,
        userId: user.id || user._id,
        userEmail: formData.userEmail,
        userName: formData.userName,
        amount: amount,
      });

      if (!orderResponse.data.success) {
        toast.error("Failed to create order");
        setLoading(false);
        return;
      }

      const { orderId, amount: orderAmount, currency, key } = orderResponse.data;

      const options = {
        key: key,
        amount: orderAmount,
        currency: currency,
        name: "Astrology Platform",
        description: `Booking for ${service.title}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment and create booking
            const verifyResponse = await axios.post(`${API_URL}/servicebookings/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              serviceId: service._id,
              userId: user.id || user._id,
              userName: formData.userName,
              userEmail: formData.userEmail,
              userPhone: formData.userPhone,
              preferredDate: formData.preferredDate,
              preferredTime: formData.preferredTime,
              message: formData.message,
              amount: amount
            });

            if (verifyResponse.data.success) {
              setStep("success");
              toast.success("Payment successful! Booking confirmed.");
              if (onSuccess) onSuccess(verifyResponse.data.booking);
              setTimeout(() => {
                onClose();
                setStep("form");
                setFormData({
                  userName: "",
                  userEmail: "",
                  userPhone: "",
                  preferredDate: "",
                  preferredTime: "",
                  message: ""
                });
              }, 2000);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: formData.userName,
          email: formData.userEmail,
          contact: formData.userPhone,
        },
        notes: {
          serviceId: service._id,
          serviceTitle: service.title,
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", 
    "5:00 PM", "6:00 PM", "7:00 PM"
  ];

  if (!isOpen || !service) return null;

  if (step === "success") {
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
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-4">
              You have successfully booked <strong>{service.title}</strong>
            </p>
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to {formData.userEmail}
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition"
            >
              Close
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
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 text-white rounded-t-2xl sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Complete Payment & Book</h3>
                <p className="text-sm text-white/80 mt-1 line-clamp-1">{service.title}</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4">
            {/* Service Info */}
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-semibold text-gray-800">{service.title}</p>
                  <p className="text-xs text-gray-500">{service.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-xl font-bold text-purple-600">{service.price}</p>
                </div>
              </div>
            </div>

            {/* User Details - Readonly from auth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="userPhone"
                    value={formData.userPhone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                <div className="relative">
                  <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                <div className="relative">
                  <HiOutlineClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message / Questions</label>
              <div className="relative">
                <HiOutlineChat className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Any specific questions or requirements..."
                />
              </div>
            </div>

            {/* Secure Payment Notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 py-2">
              <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />
              <span>Secured by Razorpay | 100% Safe & Secure</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin w-4 h-4" />
                  Processing...
                </>
              ) : (
                <>
                  <FaRupeeSign className="w-4 h-4" />
                  Pay {service.price} & Book Now
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              By proceeding, you agree to our terms and conditions
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceBookingModal;