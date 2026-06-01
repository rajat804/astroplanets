import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const WhatsAppFloatingButton = () => {
  const phoneNumber = "9175196579";

  const message =
    "Hello! I would like to know more about your astrology, yoga, and ritual tools services.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Pulse Animation */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="absolute inset-0 rounded-full bg-green-500"
      />

      {/* Floating Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{
          scale: 1.12,
          rotate: [0, -5, 5, -5, 0],
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 10,
        }}
        className="relative flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 
                   text-white px-5 py-3 rounded-full shadow-2xl 
                   hover:shadow-green-500/50 transition-all duration-300 group"
      >
        {/* Icon */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <FaWhatsapp className="text-3xl" />
        </motion.div>

        {/* Text */}
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-xs opacity-90">Chat with us</span>
          <span className="font-semibold text-sm">
            Astrology Support
          </span>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.a>
    </div>
  );
};

export default WhatsAppFloatingButton;