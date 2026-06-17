// src/pages/Schedule.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaVideo, FaEdit, FaCalendarAlt, FaClock, FaUsers, 
  FaChalkboardTeacher, FaUserGraduate, FaCrown, 
  FaCheckCircle, FaTimes, FaEye, FaLink, FaSave,
  FaCalendarCheck, FaUserTie, FaBookOpen, FaChartLine,
  FaSpinner, FaArrowLeft, FaArrowRight, FaUser,
  FaPhone, FaEnvelope, FaRupeeSign, FaInfoCircle,
  FaCalendarDay, FaCalendarWeek, FaSync, FaClock as FaClockIcon,
  FaCalendar
} from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { toast, Toaster } from "react-hot-toast";

const Schedule = () => {
  const [activeTab, setActiveTab] = useState("dateview");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    meetLink: "",
    date: "",
    time: "",
    duration: "60",
    classStatus: ""
  });
  
  // Stats
  const [stats, setStats] = useState({
    todaySessions: 0,
    todayServices: 0,
    todayPlans: 0,
    todayCourses: 0,
    totalToday: 0,
    upcomingCount: 0,
    ongoingCount: 0,
    completedCount: 0,
    totalRevenue: 0
  });

  // Data states
  const [allBookings, setAllBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [sessionRequests, setSessionRequests] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [planSubscriptions, setPlanSubscriptions] = useState([]);
  const [coursePurchases, setCoursePurchases] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // ==================== HELPER: Calculate Class Status from Date ====================
  const getClassStatusFromDate = (preferredDate, paymentStatus) => {
    if (!preferredDate) return 'scheduled';
    
    try {
      const now = new Date();
      const classDate = new Date(preferredDate);
      
      if (isNaN(classDate.getTime())) return 'scheduled';
      
      if (paymentStatus === 'cancelled') return 'cancelled';
      if (paymentStatus === 'completed' || paymentStatus === 'success') return 'completed';
      
      const diffDays = (classDate - now) / (1000 * 60 * 60 * 24);
      
      if (diffDays > 1) return 'upcoming';
      if (diffDays >= -1 && diffDays <= 1) return 'ongoing';
      return 'completed';
    } catch (error) {
      return 'scheduled';
    }
  };

  // ==================== ✅ FIXED: Convert any date to YYYY-MM-DD ====================
  const toDateString = (dateValue) => {
    if (!dateValue) return null;
    
    try {
      let d;
      
      if (typeof dateValue === 'string') {
        if (dateValue.includes('-') && dateValue.length === 10) {
          d = new Date(dateValue + 'T00:00:00');
        } else if (dateValue.includes('T')) {
          d = new Date(dateValue);
        } else {
          d = new Date(dateValue);
        }
      } else if (dateValue instanceof Date) {
        d = dateValue;
      } else if (typeof dateValue === 'number') {
        d = new Date(dateValue);
      } else {
        d = new Date(dateValue);
      }
      
      if (isNaN(d.getTime())) {
        console.warn("Invalid date:", dateValue);
        return null;
      }
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
      
    } catch (error) {
      console.error("Date conversion error:", error, dateValue);
      return null;
    }
  };

  // ==================== FETCH FUNCTIONS ====================
  
  const fetchSessionRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/expert-bookings/all`);
      if (response.data.success) {
        const bookings = response.data.bookings || [];
        const formatted = bookings.map(b => {
          const classStatus = b.classStatus || getClassStatusFromDate(b.preferredDate, b.status);
          return {
            ...b,
            _type: 'session',
            displayTitle: `Session with ${b.expertName || 'Expert'}`,
            displayProvider: b.expertName || 'Expert',
            amount: b.amount || 0,
            classStatus: classStatus
          };
        });
        setSessionRequests(formatted);
        console.log("✅ Sessions loaded:", formatted.length);
      }
    } catch (error) {
      console.error("Fetch sessions error:", error);
    }
  };

  const fetchServiceBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/servicebookings/all`);
      if (response.data.success) {
        const bookings = response.data.bookings || [];
        const formatted = bookings.map(b => {
          const classStatus = b.classStatus || getClassStatusFromDate(b.preferredDate, b.status);
          return {
            ...b,
            _type: 'service',
            displayTitle: b.serviceTitle || 'Service Booking',
            displayProvider: 'Service Provider',
            amount: b.amount || 0,
            classStatus: classStatus
          };
        });
        setServiceBookings(formatted);
        console.log("✅ Services loaded:", formatted.length);
      }
    } catch (error) {
      console.error("Fetch services error:", error);
    }
  };

  const fetchPlanSubscriptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/planpayments/admin/all-subscriptions`);
      if (response.data.success) {
        const subscriptions = response.data.subscriptions || [];
        const formatted = subscriptions.map(s => {
          const preferredDate = s.preferredDate || s.startDate;
          const classStatus = s.classStatus || getClassStatusFromDate(preferredDate, s.status);
          return {
            ...s,
            _type: 'plan',
            displayTitle: s.planName || 'Plan Subscription',
            displayProvider: 'Plan',
            amount: s.amount || 0,
            preferredDate: preferredDate,
            preferredTime: s.preferredTime || '12:00 PM',
            classStatus: classStatus
          };
        });
        setPlanSubscriptions(formatted);
        console.log("✅ Plans loaded:", formatted.length);
      }
    } catch (error) {
      console.error("Fetch plans error:", error);
    }
  };

  const fetchCoursePurchases = async () => {
    try {
      const response = await axios.get(`${API_URL}/coursepayment/admin/success-users`);
      if (response.data.success) {
        const users = response.data.users || [];
        const formatted = users.map((u) => {
          const preferredDate = u.preferredDate || u.createdAt;
          const preferredTime = u.preferredTime || "12:00 PM";
          const classStatus = u.classStatus || getClassStatusFromDate(preferredDate, u.status);
          const duration = u.duration || "60";
          return {
            ...u,
            _type: 'course',
            displayTitle: u.courseId?.title || 'Course Enrollment',
            displayProvider: u.courseId?.level || 'Course',
            amount: u.amount || 0,
            preferredDate: preferredDate,
            preferredTime: preferredTime,
            duration: duration,
            status: u.status || 'success',
            classStatus: classStatus,
            meetLink: u.meetLink || "",
            userPhone: u.userPhone || "",
            userId: u.userId || "",
            courseId: u.courseId || {}
          };
        });
        setCoursePurchases(formatted);
        console.log("✅ Courses loaded:", formatted.length);
      }
    } catch (error) {
      console.error("Fetch courses error:", error);
    }
  };

  // ==================== GET STATUS BADGES ====================

  const getClassStatusBadge = (classStatus) => {
    const config = {
      upcoming: { color: "bg-blue-100 text-blue-700", label: "Upcoming", icon: "📅" },
      ongoing: { color: "bg-green-100 text-green-700", label: "Ongoing", icon: "🟢" },
      completed: { color: "bg-gray-100 text-gray-700", label: "Completed", icon: "✅" },
      cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled", icon: "❌" },
      scheduled: { color: "bg-yellow-100 text-yellow-700", label: "Scheduled", icon: "⏳" }
    };
    const c = config[classStatus] || config.scheduled;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.color} flex items-center gap-1 w-fit`}>
        <span>{c.icon}</span>
        {c.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending", icon: "⏳" },
      confirmed: { color: "bg-green-100 text-green-700", label: "Confirmed", icon: "✅" },
      cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled", icon: "❌" },
      completed: { color: "bg-blue-100 text-blue-700", label: "Completed", icon: "🎉" },
      success: { color: "bg-green-100 text-green-700", label: "Success", icon: "✅" },
      active: { color: "bg-green-100 text-green-700", label: "Active", icon: "🟢" },
      expired: { color: "bg-gray-100 text-gray-700", label: "Expired", icon: "⏰" },
      inactive: { color: "bg-gray-100 text-gray-700", label: "Inactive", icon: "⏸️" }
    };
    const c = config[status] || config.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.color} flex items-center gap-1 w-fit`}>
        <span>{c.icon}</span>
        {c.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const config = {
      session: { color: "bg-blue-100 text-blue-700", label: "Session", icon: "🎯" },
      service: { color: "bg-purple-100 text-purple-700", label: "Service", icon: "🔮" },
      plan: { color: "bg-amber-100 text-amber-700", label: "Plan", icon: "👑" },
      course: { color: "bg-green-100 text-green-700", label: "Course", icon: "📚" }
    };
    const c = config[type] || config.session;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.color} flex items-center gap-1 w-fit`}>
        <span>{c.icon}</span>
        {c.label}
      </span>
    );
  };

  // ==================== UPDATE FUNCTIONS ====================

  const updateClassStatus = async () => {
    if (!formData.classStatus && !formData.meetLink && !formData.date && !formData.time) {
      toast.error("Please fill at least one field");
      return;
    }

    try {
      setLoading(true);
      const updateData = {};
      if (formData.meetLink) updateData.meetLink = formData.meetLink;
      if (formData.date) updateData.preferredDate = formData.date;
      if (formData.time) updateData.preferredTime = formData.time;
      if (formData.classStatus) updateData.classStatus = formData.classStatus;

      let response;
      const type = selectedItem._type;
      
      if (type === 'session') {
        response = await axios.put(
          `${API_URL}/expert-bookings/admin/update-schedule/${selectedItem._id}`,
          updateData
        );
      } else if (type === 'service') {
        response = await axios.put(
          `${API_URL}/servicebookings/admin/update-schedule/${selectedItem._id}`,
          updateData
        );
      } else if (type === 'plan') {
        response = await axios.put(
          `${API_URL}/planpayments/admin/update-schedule/${selectedItem._id}`,
          updateData
        );
      } else if (type === 'course') {
        response = await axios.put(
          `${API_URL}/coursepayment/admin/update-schedule/${selectedItem._id}`,
          updateData
        );
      }

      if (response?.data?.success) {
        toast.success("Schedule updated successfully!");
        setShowModal(false);
        resetForm();
        await fetchAllData();
      } else {
        toast.error(response?.data?.message || "Failed to update");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update schedule");
    } finally {
      setLoading(false);
    }
  };

  // ==================== OTHER FUNCTIONS ====================

  const resetForm = () => {
    setFormData({
      meetLink: "",
      date: "",
      time: "",
      duration: "60",
      classStatus: ""
    });
    setSelectedItem(null);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    let dateStr = "";
    if (item.preferredDate) {
      try {
        const d = new Date(item.preferredDate);
        if (!isNaN(d.getTime())) {
          dateStr = d.toISOString().split('T')[0];
        }
      } catch (e) {
        console.error("Date parse error:", e);
      }
    }
    
    setFormData({
      meetLink: item.meetLink || "",
      date: dateStr,
      time: item.preferredTime || "",
      duration: item.duration || "60",
      classStatus: item.classStatus || "scheduled"
    });
    setShowModal(true);
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const isMeetLinkActive = (date, time) => {
    if (!date || !time) return false;
    try {
      let scheduledDateTime;
      if (typeof date === 'string') {
        let dateStr = date;
        if (date.includes('T')) {
          dateStr = date.split('T')[0];
        }
        const dateParts = dateStr.split('-');
        if (dateParts.length === 3) {
          scheduledDateTime = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          );
        } else {
          scheduledDateTime = new Date(date);
        }
      } else {
        scheduledDateTime = new Date(date);
      }
      
      if (time && scheduledDateTime) {
        const timeStr = time.trim();
        let hours = 0, minutes = 0;
        const ampmMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (ampmMatch) {
          hours = parseInt(ampmMatch[1]);
          minutes = parseInt(ampmMatch[2]);
          const ampm = ampmMatch[3].toUpperCase();
          if (ampm === 'PM' && hours !== 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
        } else {
          const timeMatch = timeStr.match(/(\d+):(\d+)/);
          if (timeMatch) {
            hours = parseInt(timeMatch[1]);
            minutes = parseInt(timeMatch[2]);
          }
        }
        scheduledDateTime.setHours(hours, minutes, 0, 0);
      }
      
      const now = new Date();
      const diffMinutes = (now - scheduledDateTime) / (1000 * 60);
      return diffMinutes >= -30 && diffMinutes <= 60;
    } catch (error) {
      console.error("Date parse error:", error);
      return false;
    }
  };

  const getJoinButton = (item) => {
    const hasMeetLink = item.meetLink && item.meetLink.trim() !== "";
    if (!hasMeetLink) {
      return <span className="text-xs text-gray-400">No link set</span>;
    }
    
    const dateField = item.preferredDate || item.date;
    const timeField = item.preferredTime || item.time;
    if (!dateField || !timeField) {
      return <span className="text-xs text-amber-600 flex items-center gap-1">
        <FaClockIcon className="w-3 h-3" /> No schedule set
      </span>;
    }
    
    const isActive = isMeetLinkActive(dateField, timeField);
    if (!isActive) {
      try {
        const scheduledDateTime = new Date(dateField);
        const now = new Date();
        const diffMinutes = (now - scheduledDateTime) / (1000 * 60);
        if (diffMinutes > 60) {
          return <span className="text-xs text-red-500 flex items-center gap-1">
            <FaTimes className="w-3 h-3" /> Link expired
          </span>;
        }
      } catch (e) {
        console.log(e);
      }
      return <span className="text-xs text-amber-600 flex items-center gap-1">
        <FaClockIcon className="w-3 h-3" /> Active at scheduled time
      </span>;
    }
    
    return (
      <a href={item.meetLink} target="_blank" rel="noopener noreferrer"
         className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition">
        <FaVideo className="w-3 h-3" /> Join Now
      </a>
    );
  };

  // ==================== ✅ FIXED: FILTERS & STATS ====================

  const applyFilters = () => {
    const all = [...sessionRequests, ...serviceBookings, ...planSubscriptions, ...coursePurchases];
    console.log("📊 Total bookings:", all.length);
    
    setAllBookings(all);

    // ✅ Helper function to get date string
    const getDateString = (dateValue) => {
      if (!dateValue) return null;
      try {
        let d;
        if (typeof dateValue === 'string') {
          if (dateValue.includes('-') && dateValue.length === 10) {
            d = new Date(dateValue + 'T00:00:00');
          } else {
            d = new Date(dateValue);
          }
        } else {
          d = new Date(dateValue);
        }
        if (isNaN(d.getTime())) return null;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch {
        return null;
      }
    };

    // ✅ DATE VIEW TAB - Show ANY date selected
    let filtered = all.filter(item => {
      const itemDate = item.preferredDate || item.createdAt;
      if (!itemDate) return false;
      const dateStr = getDateString(itemDate);
      return dateStr === selectedDate;
    });

    console.log(`📅 Date filter (${selectedDate}): ${filtered.length} items`);

    // ✅ TODAY TAB - Show only today's data
    const today = new Date().toISOString().split('T')[0];
    
    if (activeTab === 'today') {
      filtered = all.filter(item => {
        const itemDate = item.preferredDate || item.createdAt;
        if (!itemDate) return false;
        const dateStr = getDateString(itemDate);
        return dateStr === today;
      });
      console.log(`📅 Today filter: ${filtered.length} items`);
    } 
    // ✅ DATE VIEW TAB - Show selected date data
    else if (activeTab === 'dateview') {
      filtered = all.filter(item => {
        const itemDate = item.preferredDate || item.createdAt;
        if (!itemDate) return false;
        const dateStr = getDateString(itemDate);
        return dateStr === selectedDate;
      });
      console.log(`📅 Date View filter (${selectedDate}): ${filtered.length} items`);
    } 
    else if (activeTab === 'upcoming') {
      filtered = all.filter(item => {
        const classStatus = item.classStatus || '';
        const itemDate = item.preferredDate || item.createdAt;
        if (!itemDate) return false;
        const dateObj = new Date(itemDate);
        if (isNaN(dateObj.getTime())) return false;
        const now = new Date();
        const diffDays = (dateObj - now) / (1000 * 60 * 60 * 24);
        return (classStatus === 'upcoming' || classStatus === 'scheduled') && diffDays > 0;
      });
      console.log(`📅 Upcoming filter: ${filtered.length} items`);
    } else if (activeTab === 'ongoing') {
      filtered = all.filter(item => {
        const classStatus = item.classStatus || '';
        return classStatus === 'ongoing';
      });
      console.log(`📅 Ongoing filter: ${filtered.length} items`);
    } else if (activeTab === 'completed') {
      filtered = all.filter(item => {
        const classStatus = item.classStatus || '';
        return classStatus === 'completed' || classStatus === 'cancelled';
      });
      console.log(`📅 Completed filter: ${filtered.length} items`);
    }

    // ✅ Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const userName = (item.userName || '').toLowerCase();
        const userEmail = (item.userEmail || '').toLowerCase();
        const title = (item.displayTitle || item.title || item.planName || item.serviceTitle || '').toLowerCase();
        return userName.includes(term) || userEmail.includes(term) || title.includes(term);
      });
    }

    setFilteredBookings(filtered);

    // ✅ Update stats
    const todayStr = new Date().toISOString().split('T')[0];
    const todayItems = all.filter(item => {
      const itemDate = item.preferredDate || item.createdAt;
      if (!itemDate) return false;
      const dateStr = getDateString(itemDate);
      return dateStr === todayStr;
    });

    const totalRevenue = all.reduce((sum, item) => sum + (item.amount || 0), 0);

    setStats({
      todaySessions: todayItems.filter(i => i._type === 'session').length,
      todayServices: todayItems.filter(i => i._type === 'service').length,
      todayPlans: todayItems.filter(i => i._type === 'plan').length,
      todayCourses: todayItems.filter(i => i._type === 'course').length,
      totalToday: todayItems.length,
      upcomingCount: all.filter(i => {
        const classStatus = i.classStatus || '';
        const itemDate = i.preferredDate || i.createdAt;
        if (!itemDate) return false;
        const dateObj = new Date(itemDate);
        if (isNaN(dateObj.getTime())) return false;
        const now = new Date();
        const diffDays = (dateObj - now) / (1000 * 60 * 60 * 24);
        return (classStatus === 'upcoming' || classStatus === 'scheduled') && diffDays > 0;
      }).length,
      ongoingCount: all.filter(i => {
        const classStatus = i.classStatus || '';
        return classStatus === 'ongoing';
      }).length,
      completedCount: all.filter(i => {
        const classStatus = i.classStatus || '';
        return classStatus === 'completed' || classStatus === 'cancelled';
      }).length,
      totalRevenue: totalRevenue
    });
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatTimeDisplay = (timeString) => {
    if (!timeString) return 'Not set';
    return timeString;
  };

  const fetchAllData = async () => {
    setLoading(true);
    setDataLoaded(false);
    try {
      await Promise.all([
        fetchSessionRequests(),
        fetchServiceBookings(),
        fetchPlanSubscriptions(),
        fetchCoursePurchases()
      ]);
      setDataLoaded(true);
      console.log("✅ All data fetched successfully!");
    } catch (error) {
      console.error("Fetch all data error:", error);
      toast.error("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (dataLoaded || sessionRequests.length > 0 || serviceBookings.length > 0 || 
        planSubscriptions.length > 0 || coursePurchases.length > 0) {
      console.log("🔄 Applying filters...");
      applyFilters();
    }
  }, [activeTab, selectedDate, searchTerm, sessionRequests, serviceBookings, planSubscriptions, coursePurchases, dataLoaded]);

  // ✅ TABS with Date View Tab
  const tabs = [
    { id: "dateview", label: "📅 Date View", icon: <FaCalendar className="text-sm" /> },
    { id: "today", label: "Today", icon: <FaCalendarDay className="text-sm" /> },
    { id: "upcoming", label: "Upcoming", icon: <FaCalendarWeek className="text-sm" />, count: stats.upcomingCount },
    { id: "ongoing", label: "Ongoing", icon: <FaClockIcon className="text-sm" />, count: stats.ongoingCount },
    { id: "completed", label: "Completed", icon: <FaCheckCircle className="text-sm" />, count: stats.completedCount }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
          <FaCalendarCheck className="text-indigo-500" />
          Schedule Management
        </h1>
        <p className="text-gray-500 mt-1 flex items-center gap-2">
          Manage all class schedules, meeting links, and class status
          <button onClick={fetchAllData} className="ml-2 p-1 text-indigo-500 hover:bg-indigo-50 rounded-lg transition">
            <FaSync className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-indigo-500">
          <p className="text-2xl font-bold text-gray-800">{stats.totalToday}</p>
          <p className="text-xs text-gray-500">Today's Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
          <p className="text-2xl font-bold text-blue-600">{stats.todaySessions}</p>
          <p className="text-xs text-gray-500">Sessions</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-purple-500">
          <p className="text-2xl font-bold text-purple-600">{stats.todayServices}</p>
          <p className="text-xs text-gray-500">Services</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-amber-500">
          <p className="text-2xl font-bold text-amber-600">{stats.todayPlans}</p>
          <p className="text-xs text-gray-500">Plans</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
          <p className="text-2xl font-bold text-green-600">{stats.todayCourses}</p>
          <p className="text-xs text-gray-500">Courses</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-yellow-500">
          <p className="text-2xl font-bold text-yellow-600">{stats.upcomingCount}</p>
          <p className="text-xs text-gray-500">Upcoming</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-emerald-500">
          <p className="text-2xl font-bold text-emerald-600">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total Revenue</p>
        </div>
      </div>

      {/* Date Picker */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => changeDate(-1)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
              <FaArrowLeft className="text-gray-600" />
            </button>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            <button onClick={() => changeDate(1)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
              <FaArrowRight className="text-gray-600" />
            </button>
            <button onClick={goToToday} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition text-sm font-medium">
              Today
            </button>
            <span className="text-sm text-gray-500 ml-2 hidden md:block">
              {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-lg ${
              activeTab === tab.id ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
            }`}>
            {tab.icon} {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
        <div className="ml-auto text-sm text-gray-500 flex items-center gap-2">
          <span className="font-medium">{filteredBookings.length}</span> bookings found
        </div>
      </div>

      {/* Table */}
      <motion.div key={activeTab + selectedDate} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading && !dataLoaded ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="w-10 h-10 text-indigo-500 animate-spin" />
            <span className="ml-3 text-gray-500">Loading schedule data...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No bookings found</p>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === 'dateview' ? `No bookings found for ${new Date(selectedDate).toLocaleDateString()}` :
               activeTab === 'today' ? 'No bookings scheduled for today' :
               activeTab === 'upcoming' ? 'No upcoming bookings found' :
               activeTab === 'ongoing' ? 'No ongoing bookings found' :
               'No completed bookings found'}
            </p>
            <p className="text-gray-400 text-xs mt-2">Try selecting a different date or refreshing the data</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Status</th>
                  <th className="px-4 py-3">Class Status</th>
                  <th className="px-4 py-3">Meet Link</th>
                  <th className="px-4 py-3">Join</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((item, index) => (
                  <tr key={item._id || index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-400 text-sm">{index + 1}</td>
                    <td className="px-4 py-3">{getTypeBadge(item._type)}</td>
                    <td className="px-4 py-3">
                      <div className="min-w-[120px]">
                        <p className="font-medium text-gray-800 text-sm">{item.userName || "N/A"}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">{item.userEmail || "N/A"}</p>
                        {item.userPhone && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <FaPhone className="w-2 h-2" /> {item.userPhone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="min-w-[120px]">
                        <p className="font-medium text-gray-800 text-sm">
                          {item.displayTitle || item.title || item.planName || item.serviceTitle || "N/A"}
                        </p>
                        {item._type === 'plan' && item.sessionsIncluded && (
                          <p className="text-xs text-amber-600">{item.sessionsUsed || 0}/{item.sessionsIncluded} sessions</p>
                        )}
                        {item._type === 'course' && item.courseId?.level && (
                          <p className="text-xs text-green-600">{item.courseId.level}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="min-w-[100px]">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800">{formatDateDisplay(item.preferredDate)}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FaClockIcon className="w-2 h-2" /> {formatTimeDisplay(item.preferredTime)}
                          </span>
                          {item._type === 'plan' && item.endDate && (
                            <span className="text-xs text-gray-400 mt-1">Valid till: {formatDateDisplay(item.endDate)}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.amount > 0 ? (
                        <span className="font-semibold text-green-600 text-sm">₹{item.amount}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{getPaymentStatusBadge(item.status)}</td>
                    <td className="px-4 py-3">{getClassStatusBadge(item.classStatus)}</td>
                    <td className="px-4 py-3">
                      {item.meetLink ? (
                        <a href={item.meetLink} target="_blank" rel="noopener noreferrer" 
                          className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
                          <FaLink className="w-3 h-3" /> View
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{getJoinButton(item)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-center">
                        <button onClick={() => openEditModal(item)} className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition" title="Edit Schedule">
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openDetailModal(item)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="View Details">
                          <FaEye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 text-white sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><FaEdit className="w-5 h-5" /> Edit Schedule</h2>
                    <p className="text-sm text-white/80 mt-1 flex items-center gap-2">
                      {selectedItem.userName || "User"} {getTypeBadge(selectedItem._type)}
                    </p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition text-2xl">✕</button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500">User</p>
                    <p className="font-medium text-gray-800">{selectedItem.userName || "N/A"}</p>
                    <p className="text-xs text-gray-400">{selectedItem.userEmail || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Title</p>
                    <p className="font-medium text-gray-800">{selectedItem.displayTitle || selectedItem.title || selectedItem.planName || "N/A"}</p>
                    {selectedItem.amount > 0 && (
                      <p className="text-xs text-green-600 font-semibold">₹{selectedItem.amount}</p>
                    )}
                    <p className="text-xs text-gray-400">Payment Status: {getPaymentStatusBadge(selectedItem.status)}</p>
                    <p className="text-xs text-gray-400">Class Status: {getClassStatusBadge(selectedItem.classStatus)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <FaLink className="inline mr-1" /> Google Meet Link
                    </label>
                    <input type="text" value={formData.meetLink}
                      onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                      placeholder="https://meet.google.com/..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                    <p className="text-xs text-gray-400 mt-1">Students can join 30 min before - 1 hour after scheduled time</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <FaCalendarAlt className="inline mr-1" /> Date
                      </label>
                      <input type="date" value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <FaClockIcon className="inline mr-1" /> Time
                      </label>
                      <input type="time" value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                      <select value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500">
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <FaCheckCircle className="inline mr-1" /> Class Status
                      </label>
                      <select value={formData.classStatus}
                        onChange={(e) => setFormData({ ...formData, classStatus: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500">
                        <option value="scheduled">Scheduled</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">This is the class status, not payment status</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium">
                    Cancel
                  </button>
                  <button onClick={updateClassStatus} disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition font-medium flex items-center gap-2 disabled:opacity-50">
                    <FaSave className="w-4 h-4" />
                    {loading ? "Saving..." : "Update Schedule"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-5 text-white sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><FaInfoCircle className="w-5 h-5" /> Booking Details</h2>
                    <p className="text-sm text-white/80 mt-1 flex items-center gap-2">
                      {selectedItem.userName || "User"} {getTypeBadge(selectedItem._type)}
                    </p>
                  </div>
                  <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition text-2xl">✕</button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1 p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaUser className="text-indigo-500" /> User Information
                    </h3>
                    <div className="space-y-2">
                      <p><span className="text-xs text-gray-500">Name:</span> <span className="font-medium">{selectedItem.userName || "N/A"}</span></p>
                      <p><span className="text-xs text-gray-500">Email:</span> <span className="text-sm">{selectedItem.userEmail || "N/A"}</span></p>
                      {selectedItem.userPhone && (
                        <p><span className="text-xs text-gray-500">Phone:</span> <span>{selectedItem.userPhone}</span></p>
                      )}
                      {selectedItem.userId && (
                        <p><span className="text-xs text-gray-500">User ID:</span> <span className="text-xs font-mono">{selectedItem.userId}</span></p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 md:col-span-1 p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaCalendarCheck className="text-purple-500" /> Booking Information
                    </h3>
                    <div className="space-y-2">
                      <p><span className="text-xs text-gray-500">Title:</span> <span className="font-medium">{selectedItem.displayTitle || selectedItem.title || selectedItem.planName || "N/A"}</span></p>
                      <p><span className="text-xs text-gray-500">Type:</span> {getTypeBadge(selectedItem._type)}</p>
                      <p><span className="text-xs text-gray-500">Payment Status:</span> {getPaymentStatusBadge(selectedItem.status)}</p>
                      <p><span className="text-xs text-gray-500">Class Status:</span> {getClassStatusBadge(selectedItem.classStatus)}</p>
                      {selectedItem.amount > 0 && (
                        <p><span className="text-xs text-gray-500">Amount:</span> <span className="font-semibold text-green-600">₹{selectedItem.amount}</span></p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaClockIcon className="text-amber-500" /> Schedule Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p><span className="text-xs text-gray-500">Date:</span> <span className="font-medium">{formatDateDisplay(selectedItem.preferredDate)}</span></p>
                        <p><span className="text-xs text-gray-500">Time:</span> <span className="font-medium">{formatTimeDisplay(selectedItem.preferredTime)}</span></p>
                        {selectedItem.duration && (
                          <p><span className="text-xs text-gray-500">Duration:</span> <span>{selectedItem.duration} mins</span></p>
                        )}
                      </div>
                      <div>
                        <p><span className="text-xs text-gray-500">Meet Link:</span></p>
                        {selectedItem.meetLink ? (
                          <a href={selectedItem.meetLink} target="_blank" rel="noopener noreferrer" 
                            className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
                            <FaLink className="w-3 h-3" /> {selectedItem.meetLink}
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">Not set</span>
                        )}
                        <div className="mt-1">{getJoinButton(selectedItem)}</div>
                      </div>
                    </div>
                  </div>

                  {(selectedItem.message || selectedItem.features || selectedItem.expertName) && (
                    <div className="col-span-2 p-4 bg-gray-50 rounded-xl">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FaInfoCircle className="text-green-500" /> Additional Information
                      </h3>
                      <div className="space-y-2">
                        {selectedItem.expertName && (
                          <p><span className="text-xs text-gray-500">Expert:</span> <span className="font-medium">{selectedItem.expertName}</span></p>
                        )}
                        {selectedItem.features && selectedItem.features.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500">Plan Features:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedItem.features.map((feature, idx) => (
                                <span key={idx} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{feature}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedItem.message && (
                          <div>
                            <p className="text-xs text-gray-500">Message:</p>
                            <p className="text-sm text-gray-700 bg-white p-2 rounded-lg mt-1">{selectedItem.message}</p>
                          </div>
                        )}
                        {selectedItem._type === 'plan' && (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p><span className="text-xs text-gray-500">Sessions:</span> {selectedItem.sessionsUsed || 0}/{selectedItem.sessionsIncluded || 0}</p>
                            <p><span className="text-xs text-gray-500">Valid till:</span> {formatDateDisplay(selectedItem.endDate)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                  <button onClick={() => setShowDetailModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg transition font-medium">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Schedule;