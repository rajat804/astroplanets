// src/pages/Profile.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaUser,
  FaEnvelope,
  FaGraduationCap,
  FaPlayCircle,
  FaVideo,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaPhone,
  FaRegCalendarAlt,
  FaRegClock,
  FaCrown,
  FaWallet,
} from "react-icons/fa";

import { HiOutlineX } from "react-icons/hi";
import { GiCrystalBall } from "react-icons/gi";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("plans");
  const [courses, setCourses] = useState([]);
  const [services, setServices] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // MODAL
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState("course");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // LOGIN CHECK
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchMyCourses();
      fetchMyServices();
      fetchMyPlans();
    }
  }, [user, isAuthenticated]);

  // FETCH COURSES
  const fetchMyCourses = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) return;

      const response = await axios.get(
        `${API_URL}/coursepayment/my-courses/${userId}`
      );

      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.log("FETCH COURSES ERROR =>", error);
    }
  };

  // FETCH SERVICE BOOKINGS
  const fetchMyServices = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) return;

      const response = await axios.get(
        `${API_URL}/servicebookings/user/${userId}/confirmed`
      );

      if (response.data.success) {
        setServices(response.data.bookings);
      }
    } catch (error) {
      console.log("FETCH SERVICES ERROR =>", error);
    }
  };

  // FETCH PLAN SUBSCRIPTIONS
  const fetchMyPlans = async () => {
    try {
      setLoading(true);
      const userId = user?._id || user?.id;
      if (!userId) return;

      const response = await axios.get(
        `${API_URL}/planpayments/my-subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log("Plans response:", response.data);

      if (response.data.success) {
        setPlans(response.data.subscriptions);
      }
    } catch (error) {
      console.log("FETCH PLANS ERROR =>", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "plans", label: "My Plans", icon: <FaCrown />, count: plans.filter(p => p.status === 'active').length },
    { id: "courses", label: "My Courses", icon: <FaGraduationCap />, count: courses.length },
    { id: "services", label: "Service Bookings", icon: <GiCrystalBall />, count: services.length }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-700", label: "Active", icon: "✅" },
      pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending", icon: "⏳" },
      expired: { color: "bg-gray-100 text-gray-700", label: "Expired", icon: "⏰" },
      cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled", icon: "❌" }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1 w-fit`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const activePlans = plans.filter(p => p.status === 'active');

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100 mb-10"
        >
          {/* TOP COVER */}
          <div className="h-44 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 relative">
            {/* PROFILE IMAGE */}
            <div className="absolute -bottom-14 left-8">
              <div className="w-28 h-28 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
                <FaUser className="text-5xl text-gray-400" />
              </div>
            </div>
          </div>

          {/* USER INFO */}
          <div className="pt-20 pb-8 px-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {user?.name || user?.fullName || "User"}
            </h1>
            <div className="flex items-center gap-2 mt-3 text-gray-600">
              <FaEnvelope className="text-red-500" />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <FaPhone className="text-red-500" />
                <span>{user?.phone}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* TABS */}
        <div className="flex gap-3 mb-8 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-t-lg whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* MY PLANS TAB - NEW */}
        {activeTab === "plans" && (
          <>
            {loading && plans.length === 0 ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                <h2 className="text-2xl font-bold text-gray-700 mt-4">Loading Plans...</h2>
              </div>
            ) : plans.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <FaCrown className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700">No Active Plan</h2>
                <p className="text-gray-500 mt-2">You haven't purchased any subscription plan yet.</p>
                <button
                  onClick={() => navigate("/plans")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Browse Plans
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <motion.div
                    key={plan._id}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white rounded-3xl overflow-hidden shadow-lg border ${
                      plan.status === 'active' ? 'border-green-300' : 'border-gray-200'
                    }`}
                  >
                    {/* HEADER */}
                    <div className={`relative p-5 ${
                      plan.status === 'active' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    } text-white`}>
                      <div className="flex items-center gap-2 mb-2">
                        <FaCrown className="text-yellow-300" />
                        <span className="text-sm font-semibold">Subscription Plan</span>
                      </div>
                      <h2 className="text-2xl font-bold">{plan.planName}</h2>
                      <div className="absolute top-4 right-4">
                        {getStatusBadge(plan.status)}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-800">₹{plan.amount}</span>
                        {plan.mrpAmount > plan.amount && (
                          <span className="text-sm text-gray-400 line-through ml-2">₹{plan.mrpAmount}</span>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{plan.duration}</p>
                      </div>

                      {/* Plan Features */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Features:</p>
                          <ul className="space-y-1">
                            {plan.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                <FaCheckCircle className="text-green-500 w-3 h-3" />
                                {feature}
                              </li>
                            ))}
                            {plan.features.length > 3 && (
                              <li className="text-xs text-gray-400">+{plan.features.length - 3} more</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Session Info */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Sessions Used:</span>
                          <span className="font-semibold">{plan.sessionsUsed || 0}/{plan.sessionsIncluded || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Valid Until:</span>
                          <span className="font-semibold">{new Date(plan.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-200">
                          <span className="text-gray-500">Enrolled On:</span>
                          <span className="font-semibold">{new Date(plan.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* BUTTON */}
                      <button
                        onClick={() => {
                          setSelectedItem(plan);
                          setItemType("plan");
                        }}
                        className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                          plan.status === 'active'
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={plan.status !== 'active'}
                      >
                        <FaVideo />
                        {plan.status === 'active' ? "Join Session" : "Plan Expired"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MY COURSES TAB */}
        {activeTab === "courses" && (
          <>
            {loading && courses.length === 0 ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                <h2 className="text-2xl font-bold text-gray-700 mt-4">Loading Courses...</h2>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700">No Courses Purchased</h2>
                <p className="text-gray-500 mt-2">You haven't purchased any course yet.</p>
                <button
                  onClick={() => navigate("/courses")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((item) => {
                  const course = item.courseId;
                  if (!course) return null;

                  return (
                    <motion.div
                      key={item._id}
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-orange-100"
                    >
                      <div className="relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-56 object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <FaCheckCircle />
                          Purchased
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <FaGraduationCap className="text-red-500" />
                          <span className="text-sm font-semibold text-red-500">
                            {course.level}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                          {course.title}
                        </h2>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-5">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span>Enrolled: {new Date(item.enrolledAt).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setItemType("course");
                          }}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                        >
                          <FaPlayCircle />
                          Start Learning
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* MY SERVICES TAB */}
        {activeTab === "services" && (
          <>
            {loading && services.length === 0 ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                <h2 className="text-2xl font-bold text-gray-700 mt-4">Loading Services...</h2>
              </div>
            ) : services.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <GiCrystalBall className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700">No Service Bookings</h2>
                <p className="text-gray-500 mt-2">You haven't booked any service yet.</p>
                <button
                  onClick={() => navigate("/services")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Browse Services
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((booking) => (
                  <motion.div
                    key={booking._id}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg border border-purple-100"
                  >
                    <div className="relative h-56 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <GiCrystalBall className="text-white text-6xl opacity-50" />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <FaCheckCircle />
                        Confirmed
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <GiCrystalBall className="text-purple-500" />
                        <span className="text-sm font-semibold text-purple-500">
                          Service Booking
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        {booking.serviceTitle}
                      </h2>
                      {booking.message && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {booking.message}
                        </p>
                      )}
                      <div className="space-y-2 mb-4 p-3 bg-purple-50 rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FaRegCalendarAlt className="text-purple-500 w-4 h-4" />
                          <span>Date: {new Date(booking.preferredDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FaRegClock className="text-purple-500 w-4 h-4" />
                          <span>Time: {booking.preferredTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FaPhone className="text-purple-500 w-4 h-4" />
                          <span>Contact: {booking.userPhone}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedItem(booking);
                          setItemType("service");
                        }}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                      >
                        <FaVideo />
                        Join Session
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl"
            >
              {/* TOP */}
              <div className={`p-5 flex items-center justify-between ${
                itemType === "course" 
                  ? "bg-gradient-to-r from-red-500 via-orange-500 to-amber-500"
                  : itemType === "service"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-gradient-to-r from-green-500 to-emerald-500"
              }`}>
                <h2 className="text-2xl font-bold text-white">
                  {itemType === "course" ? "Course Access" : itemType === "service" ? "Service Session" : "Plan Session"}
                </h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-white text-3xl"
                >
                  <HiOutlineX />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                {/* TITLE */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {itemType === "course" 
                    ? selectedItem?.courseId?.title 
                    : itemType === "service"
                    ? selectedItem?.serviceTitle
                    : selectedItem?.planName}
                </h2>

                {/* DESCRIPTION / FEATURES */}
                {itemType === "course" && (
                  <p className="text-gray-600 mb-5">
                    {selectedItem?.courseId?.description}
                  </p>
                )}

                {itemType === "plan" && selectedItem?.features && (
                  <div className="mb-5 p-4 bg-green-50 rounded-xl">
                    <p className="text-sm font-semibold text-green-700 mb-2">Plan Features:</p>
                    <ul className="space-y-1">
                      {selectedItem.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <FaCheckCircle className="text-green-500 w-4 h-4" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* BOOKING DETAILS */}
                {(itemType === "service" || itemType === "plan") && (
                  <div className={`space-y-3 mb-5 p-4 rounded-xl ${
                    itemType === "service" ? "bg-purple-50" : "bg-green-50"
                  }`}>
                    {itemType === "service" && (
                      <>
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaRegCalendarAlt className="text-purple-500" />
                          <span>Preferred Date: {new Date(selectedItem?.preferredDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaRegClock className="text-purple-500" />
                          <span>Preferred Time: {selectedItem?.preferredTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaPhone className="text-purple-500" />
                          <span>Contact: {selectedItem?.userPhone}</span>
                        </div>
                        {selectedItem?.message && (
                          <div className="mt-3 pt-3 border-t border-purple-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Message:</span> {selectedItem?.message}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    {itemType === "plan" && (
                      <>
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaWallet className="text-green-500" />
                          <span>Amount Paid: ₹{selectedItem?.amount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaRegCalendarAlt className="text-green-500" />
                          <span>Valid Until: {new Date(selectedItem?.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaClock className="text-green-500" />
                          <span>Sessions Used: {selectedItem?.sessionsUsed || 0}/{selectedItem?.sessionsIncluded || 0}</span>
                        </div>
                        {selectedItem?.preferredDate && (
                          <>
                            <div className="flex items-center gap-2 text-gray-700 mt-2 pt-2 border-t border-green-200">
                              <FaRegCalendarAlt className="text-green-500" />
                              <span>Preferred Date: {new Date(selectedItem?.preferredDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <FaRegClock className="text-green-500" />
                              <span>Preferred Time: {selectedItem?.preferredTime}</span>
                            </div>
                          </>
                        )}
                        {selectedItem?.message && (
                          <div className="mt-3 pt-3 border-t border-green-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Message:</span> {selectedItem?.message}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* DATE */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <FaCalendarAlt className="text-orange-500" />
                  {itemType === "course" ? "Enrolled On" : itemType === "service" ? "Booked On" : "Subscribed On"} :{" "}
                  {new Date(
                    itemType === "course" 
                      ? selectedItem?.enrolledAt 
                      : selectedItem?.createdAt
                  ).toLocaleDateString()}
                </div>

                {/* MEET LINK BOX */}
                <div className={`border rounded-3xl p-5 ${
                  itemType === "course" 
                    ? "bg-orange-50 border-orange-200"
                    : itemType === "service"
                    ? "bg-purple-50 border-purple-200"
                    : "bg-green-50 border-green-200"
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <FaVideo className={`text-2xl ${
                      itemType === "course" 
                        ? "text-red-500"
                        : itemType === "service"
                        ? "text-purple-500"
                        : "text-green-500"
                    }`} />
                    <h3 className="text-xl font-bold text-gray-800">
                      Google Meet Link
                    </h3>
                  </div>

                  {selectedItem?.meetLink ? (
                    <a
                      href={selectedItem?.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-300 shadow-md"
                    >
                      Join Live Session
                    </a>
                  ) : (
                    <div className="w-full text-center py-4 rounded-2xl bg-gray-100 text-gray-600 font-semibold">
                      Meeting link not available yet
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;