// PlanPaymentModal.jsx
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
  HiOutlineShieldCheck,
  HiOutlineCheckCircle
} from "react-icons/hi";
import { FaRupeeSign, FaSpinner, FaCheckCircle, FaCrown, FaStar } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const PlanPaymentModal = ({ isOpen, onClose, plan, onSuccess }) => {
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

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user && isAuthenticated && plan) {
      setFormData(prev => ({
        ...prev,
        userName: user.fullName || user.name || "",
        userEmail: user.email || "",
        userPhone: user.phone || ""
      }));
    }
  }, [user, isAuthenticated, plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => {
        // Fallback to alternative CDN
        const altScript = document.createElement("script");
        altScript.src = "https://cdn.razorpay.com/static/widget/checkout.js";
        altScript.onload = () => resolve(true);
        altScript.onerror = () => resolve(false);
        document.body.appendChild(altScript);
      };
      document.body.appendChild(script);
    });
  };

  const calculateDiscount = () => {
    if (plan.mrpPrice && plan.sellingPrice && plan.mrpPrice > plan.sellingPrice) {
      return Math.round(((plan.mrpPrice - plan.sellingPrice) / plan.mrpPrice) * 100);
    }
    return 0;
  };

  const handlePayment = async () => {
    // Validation
    if (!isAuthenticated || !user) {
      toast.error("Please login to continue");
      return;
    }

    if (!plan) {
      toast.error("Plan not found");
      return;
    }

    if (!formData.userName || !formData.userEmail || !formData.userPhone) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load payment gateway. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const amount = plan.sellingPrice || plan.price;
      const token = sessionStorage.getItem('token');

      if (!token) {
        toast.error("Please login again");
        setLoading(false);
        return;
      }

      // Create order with user details
      const orderResponse = await axios.post(
        `${API_URL}/planpayments/create-order`,
        {
          planId: plan._id,
          userName: formData.userName,
          userEmail: formData.userEmail,
          userPhone: formData.userPhone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.success) {
        toast.error(orderResponse.data.message || "Failed to create order");
        setLoading(false);
        return;
      }

      const { orderId, amount: orderAmount, currency, keyId, subscriptionId } = orderResponse.data;

      const options = {
        key: keyId,
        amount: orderAmount,
        currency: currency,
        name: "Astro Guide",
        description: `${plan.name} Plan Subscription`, // ✅ Fixed: plan.name
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              `${API_URL}/planpayments/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                subscriptionId: subscriptionId,
                preferredDate: formData.preferredDate,
                preferredTime: formData.preferredTime,
                message: formData.message,
                userPhone: formData.userPhone,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              setStep("success");
              toast.success("Payment successful! Plan activated.");
              if (onSuccess) onSuccess(verifyResponse.data.subscription);
              setTimeout(() => {
                onClose();
                setStep("form");
                setFormData({
                  userName: user?.fullName || user?.name || "",
                  userEmail: user?.email || "",
                  userPhone: user?.phone || "",
                  preferredDate: "",
                  preferredTime: "",
                  message: ""
                });
              }, 3000);
            } else {
              toast.error(verifyResponse.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: formData.userName,
          email: formData.userEmail,
          contact: formData.userPhone,
        },
        notes: {
          planId: plan._id,
          planName: plan.name,
          userName: formData.userName,
          userEmail: formData.userEmail,
          userPhone: formData.userPhone,
        },
        theme: {
          color: "#dc2626",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM", "7:00 PM"
  ];

  const discountPercent = calculateDiscount();

  if (!isOpen || !plan) return null;

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
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FaCheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Plan Activated! 🎉</h3>
            <p className="text-gray-600 mb-4">
              You have successfully subscribed to <strong>{plan.name}</strong> plan
            </p>
            <div className="bg-amber-50 rounded-xl p-3 mb-4">
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to <strong>{formData.userEmail}</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                You can now access all premium features
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition"
            >
              Go to Dashboard
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
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-5 text-white rounded-t-2xl sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FaCrown className="w-5 h-5" />
                  Subscribe to Plan
                </h3>
                <p className="text-sm text-white/80 mt-1 line-clamp-1">{plan.name} Plan</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4">
            {/* Plan Info Card */}
            <div className="bg-gradient-to-r from-amber-50 to-red-50 rounded-xl p-4 border border-amber-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCrown className="text-amber-500 w-5 h-5" />
                    <p className="text-sm font-semibold text-amber-700">Premium Plan</p>
                    {plan.isPopular && (
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FaStar className="w-2 h-2" />
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-gray-800 text-lg">{plan.name}</p>
                  <p className="text-xs text-gray-500">{plan.duration}</p>
                </div>
                <div className="text-right">
                  {plan.mrpPrice && plan.mrpPrice > (plan.sellingPrice || plan.price) && (
                    <p className="text-xs text-gray-400 line-through">
                      ₹{plan.mrpPrice.toLocaleString()}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-red-600">
                    ₹{(plan.sellingPrice || plan.price).toLocaleString()}
                  </p>
                  {discountPercent > 0 && (
                    <p className="text-xs text-green-600">Save {discountPercent}%</p>
                  )}
                </div>
              </div>

              {/* Features Preview */}
              {plan.features && plan.features.length > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">What's included:</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded-full">
                        ✓ {feature}
                      </span>
                    ))}
                    {plan.features.length > 3 && (
                      <span className="text-xs text-gray-400">+{plan.features.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Details Section */}
            <div className="border-b border-gray-200 pb-2">
              <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <HiOutlineUser className="w-4 h-4 text-red-500" />
                Personal Information
              </h4>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="userPhone"
                    value={formData.userPhone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Session Scheduling Section */}
            <div className="border-b border-gray-200 pb-2 mt-2">
              <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <HiOutlineCalendar className="w-4 h-4 text-red-500" />
                Schedule Your Session
              </h4>
            </div>

            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                <HiOutlineCalendar className="w-4 h-4 text-amber-600" />
                Choose your preferred date and time for the first session (Optional)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <div className="relative">
                    <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <div className="relative">
                    <HiOutlineClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <HiOutlineCheckCircle className="w-3 h-3" />
                You can always reschedule later from your dashboard
              </p>
            </div>

            {/* Additional Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Message / Questions
              </label>
              <div className="relative">
                <HiOutlineChat className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Any specific questions or requirements for your session..."
                />
              </div>
            </div>

            {/* Plan Benefits */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                <HiOutlineShieldCheck className="w-4 h-4" />
                Plan Benefits
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <p className="flex items-center gap-1">✓ {plan.sessionsIncluded || 0} Consultation Sessions</p>
                <p className="flex items-center gap-1">✓ Priority Support</p>
                <p className="flex items-center gap-1">✓ Detailed Reports</p>
                <p className="flex items-center gap-1">✓ Free Remedies Guide</p>
                <p className="flex items-center gap-1">✓ 24/7 Chat Support</p>
                <p className="flex items-center gap-1">✓ Lifetime Access</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Order Summary</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plan Price</span>
                  <span className="font-medium">₹{(plan.sellingPrice || plan.price).toLocaleString()}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span>- ₹{Math.round((plan.mrpPrice - (plan.sellingPrice || plan.price))).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-md font-bold pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-red-600">₹{(plan.sellingPrice || plan.price).toLocaleString()}</span>
                </div>
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
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin w-5 h-5" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCrown className="w-5 h-5" />
                  Subscribe Now - ₹{(plan.sellingPrice || plan.price).toLocaleString()}
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              By subscribing, you agree to our terms and conditions. Cancel anytime.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlanPaymentModal;