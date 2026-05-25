import React from "react";
import { motion } from "framer-motion";
import { FaRupeeSign, FaBookOpen, FaMagic, FaUsers } from "react-icons/fa";
import { HiOutlineUsers, HiOutlineCalendar } from "react-icons/hi";

const OverviewStats = ({ stats }) => {
  // Debug log
  console.log("OverviewStats received:", stats);
  
  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <FaRupeeSign className="w-6 h-6" />,
      bgColor: "from-green-500 to-emerald-600",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
      subtitle: "From successful payments"
    },
    {
      title: "Course Revenue",
      value: `₹${(stats?.courseRevenue || 0).toLocaleString()}`,
      icon: <FaBookOpen className="w-6 h-6" />,
      bgColor: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      subtitle: `${stats?.totalCourseEnrollments || 0} enrollments`
    },
    {
      title: "Service Revenue",
      value: `₹${(stats?.serviceRevenue || 0).toLocaleString()}`,
      icon: <FaMagic className="w-6 h-6" />,
      bgColor: "from-blue-500 to-cyan-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      subtitle: `${stats?.totalServiceBookings || 0} bookings`
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <HiOutlineUsers className="w-6 h-6" />,
      bgColor: "from-orange-500 to-red-600",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
      subtitle: "Registered users"
    },
    {
      title: "Total Courses",
      value: stats?.totalCourses || 0,
      icon: <FaBookOpen className="w-6 h-6" />,
      bgColor: "from-indigo-500 to-purple-600",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      subtitle: "Available courses"
    },
    {
      title: "Total Services",
      value: stats?.totalServices || 0,
      icon: <FaMagic className="w-6 h-6" />,
      bgColor: "from-pink-500 to-rose-600",
      bgLight: "bg-pink-50",
      textColor: "text-pink-600",
      subtitle: "Services offered"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${card.bgLight} ${card.textColor} group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{card.value}</div>
              <div className="text-xs text-gray-400">{card.subtitle}</div>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600">{card.title}</h3>
          <div className="mt-2 w-full bg-gray-100 rounded-full h-1 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${card.bgColor}`} style={{ width: "70%" }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewStats;