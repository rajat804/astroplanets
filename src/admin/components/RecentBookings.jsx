// src/components/admin/RecentBookings.jsx
import React from "react";
import { motion } from "framer-motion";
import { HiOutlineCalendar, HiOutlineUser, HiOutlineCurrencyRupee, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

const RecentBookings = ({ bookings = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "confirmed":
        return "✅";
      case "completed":
        return "🎉";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Debug: Log bookings to see what data we're getting
  console.log("RecentBookings received data:", bookings);

  // Helper function to get user name from booking object
  const getUserName = (booking) => {
    console.log("Getting user name from booking:", booking);
    
    // Check all possible fields where name might be stored
    if (booking.userName) return booking.userName;
    if (booking.customerName) return booking.customerName;
    if (booking.user?.fullName) return booking.user.fullName;
    if (booking.user?.name) return booking.user.name;
    if (booking.fullName) return booking.fullName;
    if (booking.name) return booking.name;
    
    // Check if message contains name
    if (booking.message && booking.message.includes('booked')) {
      const nameMatch = booking.message.match(/(\w+)\s+booked/);
      if (nameMatch) return nameMatch[1];
    }
    
    return "Guest User";
  };

  // Helper function to get email from booking object
  const getUserEmail = (booking) => {
    if (booking.userEmail) return booking.userEmail;
    if (booking.customerEmail) return booking.customerEmail;
    if (booking.user?.email) return booking.user.email;
    if (booking.email) return booking.email;
    return "No email";
  };

  // Helper function to get phone from booking object
  const getUserPhone = (booking) => {
    if (booking.userPhone) return booking.userPhone;
    if (booking.customerPhone) return booking.customerPhone;
    if (booking.user?.phone) return booking.user.phone;
    if (booking.phone) return booking.phone;
    return null;
  };

  // Helper function to get message from booking object
  const getMessage = (booking) => {
    if (booking.message) return booking.message;
    if (booking.notes) return booking.notes;
    if (booking.specialRequests) return booking.specialRequests;
    return null;
  };

  // Helper function to get service title
  const getServiceTitle = (booking) => {
    if (booking.serviceTitle) return booking.serviceTitle;
    if (booking.service?.title) return booking.service.title;
    if (booking.courseId?.title) return booking.courseId.title;
    if (booking.courseTitle) return booking.courseTitle;
    if (booking.message) {
      const match = booking.message.match(/booked\s+(.+?)(?:\s+on|\s+for|$)/);
      if (match) return match[1];
    }
    return "Service Booking";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">Recent Bookings</h4>
        <HiOutlineCalendar className="text-gray-400 w-5 h-5" />
      </div>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No recent bookings</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {bookings.map((booking, idx) => {
            const userName = getUserName(booking);
            const userEmail = getUserEmail(booking);
            const userPhone = getUserPhone(booking);
            const message = getMessage(booking);
            const serviceTitle = getServiceTitle(booking);
            
            console.log(`Booking ${idx}:`, { userName, userEmail, serviceTitle });
            
            return (
              <motion.div
                key={booking._id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                onClick={() => {
                  console.log("Booking details:", booking);
                }}
              >
                {/* Header with User and Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {userName.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <HiOutlineMail className="w-3 h-3" />
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-bold text-green-600 text-sm">
                      ₹{booking.amount || 0}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                      <span>{getStatusIcon(booking.status)}</span>
                      {booking.status || "pending"}
                    </span>
                  </div>
                </div>

                {/* Service Details */}
                <div className="ml-10 mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    🎯 {serviceTitle}
                  </p>
                  {booking.preferredDate && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <HiOutlineCalendar className="w-3 h-3" />
                      {formatDate(booking.preferredDate)} {booking.preferredTime ? `at ${booking.preferredTime}` : ""}
                    </p>
                  )}
                </div>

                {/* Contact Info - Only show if available */}
                {(userPhone || message) && (
                  <div className="ml-10 pt-2 border-t border-gray-200 flex flex-wrap gap-3">
                    {userPhone && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <HiOutlinePhone className="w-3 h-3" />
                        {userPhone}
                      </p>
                    )}
                    {message && (
                      <p className="text-xs text-gray-500 truncate max-w-[200px]" title={message}>
                        💬 {message.length > 30 ? message.substring(0, 30) + "..." : message}
                      </p>
                    )}
                  </div>
                )}

                {/* Booking ID for reference */}
                <div className="ml-10 mt-1">
                  <p className="text-[10px] text-gray-400">
                    Booking ID: {booking._id?.slice(-8) || "N/A"}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Footer with total count */}
      {bookings.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Total {bookings.length} recent booking{bookings.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default RecentBookings;