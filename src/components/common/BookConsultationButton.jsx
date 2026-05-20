// components/common/BookConsultationButton.jsx

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { HiOutlineCalendar, HiOutlineSparkles } from "react-icons/hi";
import ConsultationModal from "./ConsultationModal";

const BookConsultationButton = ({
  variant = "primary",
  size = "md",
  className = "",
  buttonText = "Query",
  prefillData = {},
  onSuccess = null,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm gap-2",
    md: "px-5 py-2 text-base gap-3",
    lg: "px-7 py-3 text-lg gap-3",
  };

  // Variant classes
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-red-500/25 text-white",

    secondary:
      "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white",

    outline:
      "border-2 border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white",

    golden:
      "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white",
  };

  const handleBookingSubmit = async (formData) => {
    console.log("Booking data:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (onSuccess) {
      onSuccess(formData);
    }

    return formData;
  };

  return (
    <>
      {/* BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        {variant === "primary" && (
          <HiOutlineSparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        )}

        <span>{buttonText}</span>

        {variant === "secondary" && (
          <HiOutlineCalendar className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </motion.button>

      {/* MODAL USING PORTAL */}
      {mounted &&
        ReactDOM.createPortal(
          <ConsultationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleBookingSubmit}
            consultantName="Our Expert"
            prefillData={prefillData}
          />,
          document.body
        )}
    </>
  );
};

export default BookConsultationButton;