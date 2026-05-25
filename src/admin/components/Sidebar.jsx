import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenu, HiOutlineLogout } from "react-icons/hi";
import { FaChartLine, FaBoxOpen, FaBook } from "react-icons/fa";
import {
  HiOutlineUserCircle,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineTicket, 
} from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FaImages } from "react-icons/fa";
import { Layers } from 'lucide-react';
const Sidebar = ({ sidebarOpen, setSidebarOpen, tab, setTab, logout }) => {
  const sidebarItems = [
  { key: "overview", label: "Overview", icon: <FaChartLine /> },
  { key: "slider", label: "Hero Slider", icon: <FaImages /> },
  { key: "plan", label: "Plan Management", icon: <Layers /> },
  { key: "services", label: "Services", icon: <FaBook /> },
  { key: "products", label: "Products", icon: <FaBoxOpen /> },
  { key: "expert", label: "Add Experts", icon: <FaBook /> },
  { key: "course", label: "Add Course", icon: <FaBoxOpen /> },
  { key: "coupons", label: "Coupons", icon: <HiOutlineTicket /> },
  { key: "classes", label: "Classes", icon: <HiOutlineUserCircle /> },
  { key: "bookings", label: "Bookings", icon: <HiOutlineCalendar /> },
  { key: "orders", label: "Orders", icon: <HiOutlineShoppingBag /> },
  { key: "blog", label: "Blog", icon: <HiOutlineDocumentText /> },
  { key: "content", label: "Content", icon: <HiOutlineDocumentText /> },
  { key: "reports", label: "Reports", icon: <HiOutlineChartBar /> },
  { key: "users", label: "Users", icon: <HiOutlineUsers /> },
];

  return (
    <motion.aside 
      animate={{ width: sidebarOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-r border-orange-100 shadow-lg relative z-20 flex flex-col"
      style={{ height: "100vh", position: "sticky", top: 0 }}
    >
      {/* Logo Section */}
      <div className="p-5 flex items-center justify-between border-b border-orange-100 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-2 shrink-0">
            <FaChartLine className="w-5 h-5" />
          </div>
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                <div className="text-lg font-bold text-gray-800">AstroPanel</div>
                <div className="text-xs text-gray-500">Admin Dashboard</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 rounded-lg hover:bg-red-50 transition shrink-0"
        >
          <HiOutlineMenu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              tab === item.key
                ? "bg-red-50 text-red-600 shadow-sm"
                : "text-gray-600 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <div className={`w-5 h-5 shrink-0 ${tab === item.key ? "text-red-500" : ""}`}>
              {item.icon}
            </div>
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-orange-100 shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <HiOutlineLogout className="w-5 h-5 shrink-0" />
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;