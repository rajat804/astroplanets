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
} from "react-icons/fa";

import { HiOutlineX } from "react-icons/hi";
import { GiCrystalBall } from "react-icons/gi";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [services, setServices] = useState([]);
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
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "courses", label: "My Courses", icon: <FaGraduationCap />, count: courses.length },
    { id: "services", label: "Service Bookings", icon: <GiCrystalBall />, count: services.length }
  ];

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
          </div>
        </motion.div>

        {/* TABS */}
        <div className="flex gap-3 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-t-lg ${
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
                      {/* IMAGE */}
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

                      {/* CONTENT */}
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

                        {/* Enrolled Date */}
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span>Enrolled: {new Date(item.enrolledAt).toLocaleDateString()}</span>
                        </div>

                        {/* BUTTON */}
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
                    {/* IMAGE Placeholder */}
                    <div className="relative h-56 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <GiCrystalBall className="text-white text-6xl opacity-50" />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <FaCheckCircle />
                        Confirmed
                      </div>
                    </div>

                    {/* CONTENT */}
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

                      {/* Booking Details */}
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

                      {/* BUTTON */}
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
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
              }`}>
                <h2 className="text-2xl font-bold text-white">
                  {itemType === "course" ? "Course Access" : "Service Session"}
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
                {/* IMAGE / ICON */}
                {itemType === "course" ? (
                  <img
                    src={selectedItem?.courseId?.image}
                    alt={selectedItem?.courseId?.title}
                    className="w-full h-60 object-cover rounded-3xl mb-5"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-5 flex items-center justify-center">
                    <GiCrystalBall className="text-white text-7xl opacity-70" />
                  </div>
                )}

                {/* TITLE */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {itemType === "course" 
                    ? selectedItem?.courseId?.title 
                    : selectedItem?.serviceTitle}
                </h2>

                {/* DESCRIPTION */}
                {itemType === "course" && (
                  <p className="text-gray-600 mb-5">
                    {selectedItem?.courseId?.description}
                  </p>
                )}

                {/* BOOKING DETAILS FOR SERVICE */}
                {itemType === "service" && (
                  <div className="space-y-3 mb-5 p-4 bg-purple-50 rounded-xl">
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
                  </div>
                )}

                {/* DATE */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <FaCalendarAlt className="text-orange-500" />
                  {itemType === "course" ? "Enrolled On" : "Booked On"} :{" "}
                  {new Date(
                    itemType === "course" ? selectedItem?.enrolledAt : selectedItem?.createdAt
                  ).toLocaleDateString()}
                </div>

                {/* GOOGLE MEET BOX */}
                <div className={`${
                  itemType === "course" ? "bg-orange-50 border-orange-200" : "bg-purple-50 border-purple-200"
                } border rounded-3xl p-5`}>
                  <div className="flex items-center gap-3 mb-4">
                    <FaVideo className={`${
                      itemType === "course" ? "text-red-500" : "text-purple-500"
                    } text-2xl`} />
                    <h3 className="text-xl font-bold text-gray-800">
                      Google Meet Link
                    </h3>
                  </div>

                  {/* MEET LINK */}
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