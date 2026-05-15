// :// components/common/ConsultationModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineX,
} from "react-icons/hi";
import { GiCrystalBall } from "react-icons/gi";

const ConsultationModal = ({ isOpen, onClose, onSubmit, consultantName = "Expert", prefillData = {} }) => {
  const [formData, setFormData] = useState({
    name: prefillData.name || "",
    email: prefillData.email || "",
    phone: prefillData.phone || "",
    preferredDate: prefillData.preferredDate || "",
    preferredTime: prefillData.preferredTime || "",
    message: prefillData.message || "",
    consultationType: prefillData.consultationType || "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Handle modal scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset form when modal opens with new prefill data
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: prefillData.name || "",
        email: prefillData.email || "",
        phone: prefillData.phone || "",
        preferredDate: prefillData.preferredDate || "",
        preferredTime: prefillData.preferredTime || "",
        message: prefillData.message || "",
        consultationType: prefillData.consultationType || "general",
      });
      setSubmitStatus(null);
    }
  }, [isOpen, prefillData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setIsSubmitting(true);
  setSubmitStatus(null);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/consultation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Something went wrong");
    }

    setSubmitStatus("success");

    setTimeout(() => {
      onClose();

      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
        consultationType: "general",
      });

      setSubmitStatus(null);
    }, 2000);

  } catch (error) {
    console.log(error);

    setSubmitStatus("error");

    setTimeout(() => {
      setSubmitStatus(null);
    }, 3000);

  } finally {
    setIsSubmitting(false);
  }
};

  const consultationTypes = [
    { value: "general", label: "General Consultation", price: "$50", duration: "30 min" },
    { value: "astrology", label: "Astrology Reading", price: "$80", duration: "45 min" },
    { value: "yoga", label: "Yoga Therapy", price: "$60", duration: "40 min" },
    { value: "meditation", label: "Meditation Coaching", price: "$55", duration: "35 min" },
    { value: "tarot", label: "Tarot Reading", price: "$70", duration: "40 min" },
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", 
    "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 rounded-2xl shadow-2xl border border-amber-400/30">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-4 sm:p-6 border-b border-amber-400/20 bg-gradient-to-r from-gray-900/95 to-indigo-950/95 backdrop-blur-sm">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <GiCrystalBall className="text-purple-400" />
                    Book a Consultation with {consultantName}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Fill out the form below and we'll get back to you within 24 hours
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <HiOutlineX className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Modal Body - Form */}
              <div className="p-4 sm:p-6">
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Booking Request Sent!</h3>
                    <p className="text-gray-300">We'll contact you shortly to confirm your consultation with {consultantName}.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Consultation Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Consultation Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="consultationType"
                        value={formData.consultationType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 sm:py-2.5 bg-white/10 border border-amber-400/30 rounded-lg text-black focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm sm:text-base"
                      >
                        {consultationTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label} 
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 bg-white/10 border border-amber-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm sm:text-base"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 bg-white/10 border border-amber-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm sm:text-base"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <HiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 bg-white/10 border border-amber-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm sm:text-base"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    {/* Date and Time - Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Preferred Date <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <HiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                          <input
                            type="date"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleInputChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 bg-white/10 border border-amber-400/30 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Preferred Time <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 sm:py-2.5 bg-white/10 border border-amber-400/30 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm sm:text-base"
                        >
                          <option value="">Select time</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Message / Questions
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/10 border border-amber-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm sm:text-base"
                        placeholder="Tell us about your goals or any specific questions you have for the consultation..."
                      />
                    </div>

                    {/* Additional Info */}
                    <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3">
                      <p className="text-xs text-amber-300">
                        <span className="font-semibold">✨ What to expect:</span> After booking, you'll receive a confirmation email with a calendar link to schedule your exact time. All consultations are conducted via Zoom or phone call.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Submit Booking Request"
                      )}
                    </button>

                    {/* Error Message */}
                    {submitStatus === "error" && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm text-center"
                      >
                        Something went wrong. Please try again.
                      </motion.p>
                    )}

                    <p className="text-xs text-gray-500 text-center">
                      By submitting this form, you agree to our terms and privacy policy.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConsultationModal;