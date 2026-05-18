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
} from "react-icons/fa";

import { HiOutlineX } from "react-icons/hi";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // MODAL
  const [selectedCourse, setSelectedCourse] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // LOGIN CHECK
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchMyCourses();
    }
  }, [user, isAuthenticated]);

  // FETCH COURSES
  const fetchMyCourses = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

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

        {/* PAGE TITLE */}
        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            My Purchased Courses
          </h2>

          <p className="text-gray-500">
            Courses you have successfully enrolled in
          </p>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="text-center py-20">

            <h2 className="text-2xl font-bold text-gray-700">
              Loading Courses...
            </h2>

          </div>

        ) : courses.length === 0 ? (

          <div className="bg-white rounded-2xl p-10 shadow text-center">

            <h2 className="text-2xl font-bold text-gray-700">
              No Courses Purchased
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't purchased any course yet.
            </p>

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

                    {/* BUTTON */}
                    <button
                      onClick={() => setSelectedCourse(item)}
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

      </div>

      {/* ================= MODAL ================= */}

      <AnimatePresence>

        {selectedCourse && (

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
              <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 p-5 flex items-center justify-between">

                <h2 className="text-2xl font-bold text-white">
                  Course Access
                </h2>

                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-white text-3xl"
                >

                  <HiOutlineX />

                </button>

              </div>

              {/* CONTENT */}
              <div className="p-6">

                {/* COURSE IMAGE */}
                <img
                  src={selectedCourse?.courseId?.image}
                  alt={selectedCourse?.courseId?.title}
                  className="w-full h-60 object-cover rounded-3xl mb-5"
                />

                {/* TITLE */}
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  {selectedCourse?.courseId?.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-gray-600 mb-5">
                  {selectedCourse?.courseId?.description}
                </p>

                {/* DATE */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">

                  <FaCalendarAlt className="text-orange-500" />

                  Enrolled On :
                  {" "}
                  {new Date(
                    selectedCourse?.enrolledAt
                  ).toLocaleDateString()}

                </div>

                {/* GOOGLE MEET BOX */}
                <div className="bg-orange-50 border border-orange-200 rounded-3xl p-5">

                  <div className="flex items-center gap-3 mb-4">

                    <FaVideo className="text-red-500 text-2xl" />

                    <h3 className="text-xl font-bold text-gray-800">
                      Google Meet Link
                    </h3>

                  </div>

                  {/* MEET LINK */}
                  {selectedCourse?.meetLink ? (

                    <a
                      href={selectedCourse?.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-300 shadow-md"
                    >

                      Join Live Class

                    </a>

                  ) : (

                    <div className="w-full text-center py-4 rounded-2xl bg-gray-100 text-gray-600 font-semibold">
                      Meeting link not available
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