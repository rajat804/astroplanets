import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineFilter } from "react-icons/hi";
import CourseTable from "./CourseTable";
import CourseFormModal from "./CourseFormModal";
import toast, { Toaster } from "react-hot-toast";

const AddCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

// In AddCourse.jsx, replace your handleCreate function with this:

const handleCreate = async (courseData) => {
  try {
    console.log("Sending course data:", courseData);
    
    // Send as JSON, not FormData
    const response = await axios.post(`${API_URL}/courses`, courseData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      toast.success("Course Created Successfully!");
      fetchCourses();
      setIsModalOpen(false);
    }
  } catch (error) {
    console.error("Create error:", error);
    console.error("Error response:", error.response?.data);
    toast.error(error.response?.data?.message || "Failed to create course");
  }
};

const handleUpdate = async (id, courseData) => {
  try {
    const response = await axios.put(`${API_URL}/courses/${id}`, courseData);
    if (response.data.success) {
      toast.success("Course updated successfully!");
      fetchCourses();
      setIsModalOpen(false);
      setEditingCourse(null);
    }
  } catch (error) {
    console.error("Error updating course:", error);
    toast.error(error.response?.data?.message || "Failed to update course");
  }
};



  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await axios.delete(`${API_URL}/courses/${id}`);
        if (response.data.success) {
          toast.success("Course deleted successfully!");
          fetchCourses();
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Failed to delete course");
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const getFilteredCourses = () => {
    let filtered = courses;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(course => course.type === filterType);
    }
    
    return filtered;
  };

  const courseTypes = [
    { value: "all", label: "All Courses" },
    { value: "numerology", label: "Numerology" },
    { value: "astrology", label: "Astrology" },
    { value: "tarot", label: "Tarot" },
    { value: "vastu", label: "Vastu" },
    { value: "palmistry", label: "Palmistry" },
    { value: "reiki", label: "Reiki" },
    { value: "yoga", label: "Yoga" },
    { value: "meditation", label: "Meditation" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Course Management
            </h1>
            <p className="text-gray-500 mt-1">Manage your courses, syllabus, and enrollments</p>
          </div>
          
          <button
            onClick={() => {
              setEditingCourse(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add New Course
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses by title or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-xl hover:bg-orange-50 transition"
          >
            <HiOutlineFilter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Filter</span>
          </button>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white rounded-xl p-4 border border-orange-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Course Type</h3>
                <div className="flex flex-wrap gap-2">
                  {courseTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setFilterType(type.value)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        filterType === type.value
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-orange-100">
            <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
            <p className="text-sm text-gray-500">Total Courses</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-100">
            <p className="text-2xl font-bold text-gray-800">
              {courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0)}
            </p>
            <p className="text-sm text-gray-500">Total Enrollments</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-100">
            <p className="text-2xl font-bold text-gray-800">
              {courses.filter(c => c.isActive !== false).length}
            </p>
            <p className="text-sm text-gray-500">Active Courses</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-100">
            <p className="text-2xl font-bold text-gray-800">
              {new Set(courses.map(c => c.type)).size}
            </p>
            <p className="text-sm text-gray-500">Course Categories</p>
          </div>
        </div>

        {/* Courses Table */}
        <CourseTable
          courses={getFilteredCourses()}
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Course Form Modal */}
        <CourseFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCourse(null);
          }}
          editingCourse={editingCourse}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
};

export default AddCourse;