import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineCalendar, 
  HiOutlineClock, 
  HiOutlineCheckCircle, 
  HiOutlineXCircle, 
  HiOutlineCurrencyRupee,
  HiOutlineTrendingUp,
  HiOutlineChartBar
} from 'react-icons/hi';
import { FaWallet, FaRegCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';

const BookingStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: <HiOutlineCalendar className="w-6 h-6" />,
      bgColor: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <HiOutlineCurrencyRupee className="w-6 h-6" />,
      bgColor: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: 'Pending',
      value: stats?.pendingBookings || 0,
      icon: <HiOutlineClock className="w-6 h-6" />,
      bgColor: 'from-yellow-500 to-amber-600',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Confirmed',
      value: stats?.confirmedBookings || 0,
      icon: <HiOutlineCheckCircle className="w-6 h-6" />,
      bgColor: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Completed',
      value: stats?.completedBookings || 0,
      icon: <FaRegCheckCircle className="w-6 h-6" />,
      bgColor: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Cancelled',
      value: stats?.cancelledBookings || 0,
      icon: <FaTimesCircle className="w-6 h-6" />,
      bgColor: 'from-red-500 to-rose-600',
      bgLight: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
  ];

  // Calculate conversion rate
  const conversionRate = stats?.totalBookings > 0 
    ? Math.round((stats?.completedBookings / stats?.totalBookings) * 100) 
    : 0;

  return (
    <>
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`relative bg-white rounded-2xl p-5 shadow-lg border ${card.borderColor} hover:shadow-2xl transition-all duration-300 overflow-hidden group`}
          >
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${card.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            {/* Icon and Value Row */}
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${card.bgLight} ${card.textColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{card.value}</div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-500 mb-2">{card.title}</h3>

            {/* Progress Bar for Status Cards */}
            {(card.title === 'Confirmed' || card.title === 'Completed' || card.title === 'Pending') && stats?.totalBookings > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(card.value / stats?.totalBookings) * 100}%` }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className={`h-full rounded-full ${card.textColor.replace('text', 'bg')}`}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Additional Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Conversion Rate Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <HiOutlineChartBar className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{conversionRate}%</div>
              <div className="text-xs opacity-80">Conversion Rate</div>
            </div>
          </div>
          <h3 className="text-sm font-semibold opacity-90">Completed vs Total</h3>
          <div className="mt-2 w-full bg-white/20 rounded-full h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${conversionRate}%` }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </motion.div>

        {/* Average Booking Value */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <FaWallet className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                ₹{stats?.totalBookings > 0 
                  ? Math.round(stats?.totalRevenue / stats?.totalBookings).toLocaleString() 
                  : 0}
              </div>
              <div className="text-xs opacity-80">Average Value</div>
            </div>
          </div>
          <h3 className="text-sm font-semibold opacity-90">Per Booking</h3>
        </motion.div>

        {/* Success Rate Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-5 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <FaRegCheckCircle className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                {stats?.totalBookings > 0 
                  ? Math.round(((stats?.confirmedBookings + stats?.completedBookings) / stats?.totalBookings) * 100)
                  : 0}%
              </div>
              <div className="text-xs opacity-80">Success Rate</div>
            </div>
          </div>
          <h3 className="text-sm font-semibold opacity-90">Confirmed + Completed</h3>
        </motion.div>

        {/* Booking Velocity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <FaClock className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                {Math.round((stats?.totalBookings || 0) / 30)}/day
              </div>
              <div className="text-xs opacity-80">Avg Daily</div>
            </div>
          </div>
          <h3 className="text-sm font-semibold opacity-90">Booking Velocity</h3>
        </motion.div>
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 mb-8 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Booking Summary</h3>
            <p className="text-sm text-gray-500 mt-1">Overall performance of your bookings</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Completed</span>
              <span className="text-sm font-semibold text-gray-800">{stats?.completedBookings || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Confirmed</span>
              <span className="text-sm font-semibold text-gray-800">{stats?.confirmedBookings || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Pending</span>
              <span className="text-sm font-semibold text-gray-800">{stats?.pendingBookings || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Cancelled</span>
              <span className="text-sm font-semibold text-gray-800">{stats?.cancelledBookings || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingStatsCards;
