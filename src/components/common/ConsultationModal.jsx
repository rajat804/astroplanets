// components/common/ConsultationModal.jsx

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

const ConsultationModal = ({
  isOpen,
  onClose,
  // consultantName = "Expert",
  prefillData = {},
}) => {
const initialFormState = {
  name: "",
  email: "",
  phone: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
  consultationType: "general",
};

const [formData, setFormData] = useState(initialFormState);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
  if (isOpen) {
    setFormData({
      name: prefillData?.name || "",
      email: prefillData?.email || "",
      phone: prefillData?.phone || "",
      preferredDate: prefillData?.preferredDate || "",
      preferredTime: prefillData?.preferredTime || "",
      message: prefillData?.message || "",
      consultationType:
        prefillData?.consultationType || "general",
    });

    setSubmitStatus(null);
  }
}, [isOpen]);

  // Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Form
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

  // Consultation Types
  const consultationTypes = [
    { value: "general", label: "General Consultation" },
    { value: "astrology", label: "Astrology Reading" },
    { value: "yoga", label: "Yoga Therapy" },
    { value: "meditation", label: "Meditation Coaching" },
    { value: "tarot", label: "Tarot Reading" },
  ];

  // Time Slots
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", 
    "5:00 PM", "6:00 PM", "7:00 PM"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP - Darker with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[998] bg-black/80 backdrop-blur-md"
          />

          {/* MODAL WRAPPER */}
          <div className="fixed inset-0 z-[999] overflow-y-auto">
            {/* CENTER CONTAINER */}
            <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
              
              {/* MODAL - New Color Scheme */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 40 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                }}
                className="
                  relative
                  w-full
                  max-w-2xl
                  max-h-[90vh]
                  overflow-y-auto
                  rounded-3xl
                  border border-amber-400/30
                  custom-scrollbar
                "
                style={{
                  background: "radial-gradient(circle at center, #0a4d3c 0%, #03231b 100%)"
                }}
              >
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 rounded-t-3xl" />

                {/* HEADER */}
                <div className="sticky top-0 z-20 flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-amber-400/20" style={{
                  background: "linear-gradient(135deg, rgba(10,77,60,0.95) 0%, rgba(3,35,27,0.95) 100%)"
                }}>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                      <div className="p-2 rounded-full bg-amber-500/20 border border-amber-400/30">
                        <GiCrystalBall className="text-amber-400 text-xl" />
                      </div>
                      <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                        Book a Consultation
                      </span>
                    </h2>
                    <p className="text-sm text-gray-400 mt-2">
                      Fill out the form below and we'll contact you within 24 hours.
                    </p>
                  </div>

                  {/* CLOSE BUTTON */}
                  <button
                    onClick={onClose}
                    className="
                      w-10 h-10
                      flex items-center justify-center
                      rounded-xl
                      bg-white/5
                      hover:bg-red-500/20
                      border border-amber-400/20
                      transition-all duration-300
                      text-gray-300 hover:text-white
                    "
                  >
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                </div>

                {/* FORM CONTENT */}
                <div className="p-5 sm:p-7">
                  {submitStatus === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-14"
                    >
                      <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Booking Request Sent!
                      </h3>
                      <p className="text-gray-300">
                        We'll contact you shortly to confirm your consultation.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">

                      {/* CONSULTATION TYPE */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Consultation Type <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="consultationType"
                          value={formData.consultationType}
                          onChange={handleInputChange}
                          className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            bg-white/10
                            border border-amber-400/30
                            text-white
                            focus:outline-none
                            focus:ring-2
                            focus:ring-amber-500
                            appearance-none
                          "
                        >
                          {consultationTypes.map((type) => (
                            <option
                              key={type.value}
                              value={type.value}
                              className="bg-[#0a4d3c]"
                            >
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* NAME */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 w-5 h-5" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your full name"
                            className="
                              w-full
                              pl-10
                              pr-4
                              py-3
                              rounded-xl
                              bg-white/10
                              border border-amber-400/30
                              text-white
                              placeholder:text-gray-400
                              focus:outline-none
                              focus:ring-2
                              focus:ring-amber-500
                            "
                          />
                        </div>
                      </div>

                      {/* EMAIL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 w-5 h-5" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="you@example.com"
                            className="
                              w-full
                              pl-10
                              pr-4
                              py-3
                              rounded-xl
                              bg-white/10
                              border border-amber-400/30
                              text-white
                              placeholder:text-gray-400
                              focus:outline-none
                              focus:ring-2
                              focus:ring-amber-500
                            "
                          />
                        </div>
                      </div>

                      {/* PHONE */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 w-5 h-5" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="+91 9876543210"
                            className="
                              w-full
                              pl-10
                              pr-4
                              py-3
                              rounded-xl
                              bg-white/10
                              border border-amber-400/30
                              text-white
                              placeholder:text-gray-400
                              focus:outline-none
                              focus:ring-2
                              focus:ring-amber-500
                            "
                          />
                        </div>
                      </div>

                      {/* DATE & TIME */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* DATE */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Preferred Date <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 w-5 h-5" />
                            <input
                              type="date"
                              name="preferredDate"
                              value={formData.preferredDate}
                              onChange={handleInputChange}
                              required
                              min={new Date().toISOString().split("T")[0]}
                              className="
                                w-full
                                pl-10
                                pr-4
                                py-3
                                rounded-xl
                                bg-white/10
                                border border-amber-400/30
                                text-white
                                focus:outline-none
                                focus:ring-2
                                focus:ring-amber-500
                              "
                            />
                          </div>
                        </div>

                        {/* TIME */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Preferred Time <span className="text-red-400">*</span>
                          </label>
                          <select
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleInputChange}
                            required
                            className="
                              w-full
                              px-4
                              py-3
                              rounded-xl
                              bg-white/10
                              border border-amber-400/30
                              text-white
                              focus:outline-none
                              focus:ring-2
                              focus:ring-amber-500
                              appearance-none
                            "
                          >
                            <option value="" className="bg-[#0a4d3c]">
                              Select Time
                            </option>
                            {timeSlots.map((time) => (
                              <option
                                key={time}
                                value={time}
                                className="bg-[#0a4d3c]"
                              >
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* MESSAGE */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Message / Questions
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Tell us about your goals or questions..."
                          className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            bg-white/10
                            border border-amber-400/30
                            text-white
                            placeholder:text-gray-400
                            focus:outline-none
                            focus:ring-2
                            focus:ring-amber-500
                            resize-none
                          "
                        />
                      </div>

                      {/* INFO BOX */}
                      <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4">
                        <p className="text-sm text-amber-300">
                          ✨ After booking, you'll receive a confirmation email with Zoom or phone consultation details.
                        </p>
                      </div>

                      {/* SUBMIT BUTTON - Red Gradient */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="
                          w-full
                          py-3.5
                          rounded-2xl
                          font-semibold
                          text-white
                          bg-gradient-to-r
                          from-red-500
                          to-red-600
                          hover:from-red-600
                          hover:to-red-700
                          hover:scale-[1.02]
                          active:scale-[0.98]
                          transition-all duration-300
                          shadow-lg shadow-red-900/40
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
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

                      {/* ERROR */}
                      {submitStatus === "error" && (
                        <p className="text-red-400 text-sm text-center">
                          Something went wrong. Please try again.
                        </p>
                      )}

                      {/* TERMS */}
                      <p className="text-xs text-gray-500 text-center">
                        By submitting this form, you agree to our terms and privacy policy.
                      </p>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* CUSTOM SCROLLBAR */}
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(245, 158, 11, 0.5);
              border-radius: 20px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(245, 158, 11, 0.8);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConsultationModal;