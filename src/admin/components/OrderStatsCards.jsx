import React from "react";
import { motion } from "framer-motion";
import { 
  FaBox, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaRupeeSign,
  FaTruck,
  FaBoxOpen,
  FaShoppingBag
} from "react-icons/fa";

const OrderStatsCards = ({ stats = {} }) => {
  const cards = [
    {
      id: 'total',
      label: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: FaShoppingBag,
      color: 'bg-blue-500',
      bg: 'bg-blue-50'
    },
    {
      id: 'pending',
      label: 'Pending',
      value: stats.pendingOrders || 0,
      icon: FaClock,
      color: 'bg-yellow-500',
      bg: 'bg-yellow-50'
    },
    {
      id: 'confirmed',
      label: 'Confirmed',
      value: stats.confirmedOrders || 0,
      icon: FaCheckCircle,
      color: 'bg-green-500',
      bg: 'bg-green-50'
    },
    {
      id: 'processing',
      label: 'Processing',
      value: stats.processingOrders || 0,
      icon: FaBoxOpen,
      color: 'bg-purple-500',
      bg: 'bg-purple-50'
    },
    {
      id: 'shipped',
      label: 'Shipped',
      value: stats.shippedOrders || 0,
      icon: FaTruck,
      color: 'bg-indigo-500',
      bg: 'bg-indigo-50'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      value: stats.deliveredOrders || 0,
      icon: FaCheckCircle,
      color: 'bg-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      value: stats.cancelledOrders || 0,
      icon: FaTimesCircle,
      color: 'bg-red-500',
      bg: 'bg-red-50'
    },
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: FaRupeeSign,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      bg: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${card.bg} rounded-xl p-4 border border-gray-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
            </div>
            <div className={`${card.color} p-3 rounded-lg text-white`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OrderStatsCards;