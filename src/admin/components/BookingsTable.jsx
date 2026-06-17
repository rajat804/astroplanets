// src/pages/Bookings.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineEye, HiOutlineTrash, HiOutlineVideoCamera } from "react-icons/hi";
import { FaSync, FaVideo, FaEdit, FaCheckCircle, FaLink, FaCrown, FaCalendarAlt, FaClock, FaStar, FaMoon, FaSun, FaChartLine, FaTrash, FaCalendar, FaClock as FaClockIcon, FaSave, FaTimes } from "react-icons/fa";
import { HiOutlineCalendar, HiOutlineClock, HiOutlineMail, HiOutlinePhone, HiOutlineUsers, HiOutlineSearch } from "react-icons/hi";
import { GiCrystalBall } from "react-icons/gi";
import { toast, Toaster } from "react-hot-toast";
import BookingStatsCards from "../components/BookingStatsCards";

const Bookings = () => {
  const [activeTab, setActiveTab] = useState("kundlis");
  const [sessionRequests, setSessionRequests] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [planSubscriptions, setPlanSubscriptions] = useState([]);
  const [savedKundlis, setSavedKundlis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMeetLinkModal, setShowMeetLinkModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showKundliModal, setShowKundliModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPlanUser, setSelectedPlanUser] = useState(null);
  const [selectedKundli, setSelectedKundli] = useState(null);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState(null);
  const [scheduleType, setScheduleType] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [expandedBooking, setExpandedBooking] = useState(null);
  
  // Schedule Form Data
  const [scheduleFormData, setScheduleFormData] = useState({
    meetLink: "",
    date: "",
    time: "",
    duration: "60",
    classStatus: ""
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Calculate Statistics
  const calculateStats = () => {
    const sessionStats = {
      total: sessionRequests.length,
      pending: sessionRequests.filter(r => r.status === 'pending').length,
      confirmed: sessionRequests.filter(r => r.status === 'confirmed').length,
      cancelled: sessionRequests.filter(r => r.status === 'cancelled').length,
      completed: sessionRequests.filter(r => r.status === 'completed').length,
    };

    const confirmedServiceBookings = serviceBookings.filter(b => b.status === 'confirmed' || b.status === 'success');
    const serviceStats = {
      total: confirmedServiceBookings.length,
      totalRevenue: confirmedServiceBookings.reduce((sum, b) => sum + (b.amount || 0), 0),
      confirmed: confirmedServiceBookings.length,
    };

    const activePlanUsers = planSubscriptions.filter(p => p.status === 'active');
    const planStats = {
      total: planSubscriptions.length,
      active: activePlanUsers.length,
      totalRevenue: planSubscriptions.reduce((sum, p) => sum + (p.amount || 0), 0),
    };

    return {
      totalBookings: sessionStats.total + serviceStats.total + planStats.total + savedKundlis.length,
      totalRevenue: serviceStats.totalRevenue + planStats.totalRevenue,
      pendingBookings: sessionStats.pending,
      confirmedBookings: sessionStats.confirmed + serviceStats.confirmed + planStats.active,
      cancelledBookings: sessionStats.cancelled,
      completedBookings: sessionStats.completed,
      activePlanUsers: planStats.active,
      totalKundlis: savedKundlis.length,
    };
  };

  const stats = calculateStats();

  // ==================== FETCH SESSION REQUESTS ====================
  const fetchSessionRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/expert-bookings/all`);
      if (response.data.success) {
        const bookings = response.data.bookings.map(b => ({
          ...b,
          classStatus: b.classStatus || getClassStatusFromDate(b.preferredDate, b.status)
        }));
        setSessionRequests(bookings);
      }
    } catch (error) {
      console.log("FETCH SESSION REQUESTS ERROR =>", error);
      toast.error("Failed to fetch session requests");
    } finally {
      setLoading(false);
    }
  };

  // ==================== FETCH SERVICE BOOKINGS ====================
  const fetchServiceBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/servicebookings/all`);
      if (response.data.success) {
        const bookings = response.data.bookings.map(b => ({
          ...b,
          classStatus: b.classStatus || getClassStatusFromDate(b.preferredDate, b.status)
        }));
        setServiceBookings(bookings);
      }
    } catch (error) {
      console.log("FETCH SERVICE BOOKINGS ERROR =>", error);
      toast.error("Failed to fetch service bookings");
    } finally {
      setLoading(false);
    }
  };

  // ==================== FETCH PLAN SUBSCRIPTIONS ====================
  const fetchPlanSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/planpayments/admin/all-subscriptions`);
      
      console.log("Plan subscriptions response:", response.data);

      if (response.data.success) {
        const subscriptions = response.data.subscriptions.map(s => ({
          ...s,
          classStatus: s.classStatus || getClassStatusFromDate(s.preferredDate, s.status)
        }));
        setPlanSubscriptions(subscriptions);
        console.log(`Loaded ${subscriptions.length} plan subscriptions`);
      } else {
        setPlanSubscriptions([]);
      }
    } catch (error) {
      console.log("FETCH PLAN SUBSCRIPTIONS ERROR =>", error);
      toast.error("Failed to fetch plan subscriptions");
      setPlanSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FETCH SAVED KUNDLIS ====================
  const fetchSavedKundlis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/astrology/admin/all-kundlis`);

      console.log("Admin Kundlis response:", response.data);

      if (response.data.success) {
        const kundlis = response.data.kundlis || [];
        console.log(`✅ Admin: Loaded ${kundlis.length} kundlis from ${response.data.totalUsers || 0} users`);
        setSavedKundlis(kundlis);
      } else {
        setSavedKundlis([]);
        toast.error(response.data.message || 'Failed to fetch kundlis');
      }
    } catch (error) {
      console.log("FETCH KUNDLIS ERROR =>", error);
      toast.error("Failed to fetch saved kundlis");
      setSavedKundlis([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================== HELPER: Get Class Status from Date ====================
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

  // ==================== IS MEET LINK ACTIVE ====================
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

  // ==================== GET JOIN BUTTON ====================
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
      } catch (e) {}
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

  // ==================== DELETE SAVED KUNDLI ====================
  const deleteSavedKundli = async (chartId) => {
    if (!window.confirm("Are you sure you want to delete this Kundli chart? This action cannot be undone!")) return;

    try {
      const response = await axios.delete(`${API_URL}/astrology/admin/delete-kundli/${chartId}`);

      if (response.data.success) {
        toast.success("Kundli deleted successfully!");
        fetchSavedKundlis();
      } else {
        toast.error(response.data.message || 'Failed to delete kundli');
      }
    } catch (error) {
      console.log("DELETE KUNDLI ERROR =>", error);
      toast.error(error.response?.data?.message || "Failed to delete kundli");
    }
  };

  // ==================== UPDATE SERVICE MEET LINK ====================
  const updateServiceMeetLink = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/servicebookings/update-meet-link/${selectedService._id}`,
        { meetLink }
      );
      if (response.data.success) {
        toast.success("Meet link updated successfully");
        setShowMeetLinkModal(false);
        setSelectedService(null);
        setMeetLink("");
        fetchServiceBookings();
      }
    } catch (error) {
      console.log("UPDATE SERVICE LINK ERROR =>", error);
      toast.error("Failed to update meet link");
    }
  };

  // ==================== UPDATE PLAN MEET LINK ====================
  const updatePlanMeetLink = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/planpayments/update-meet-link/${selectedPlanUser._id}`,
        { meetLink }
      );
      if (response.data.success) {
        toast.success("Meeting link updated successfully");
        setShowMeetLinkModal(false);
        setSelectedPlanUser(null);
        setMeetLink("");
        fetchPlanSubscriptions();
      }
    } catch (error) {
      console.log("UPDATE PLAN MEET LINK ERROR =>", error);
      toast.error("Failed to update meeting link");
    }
  };

  // ==================== UPDATE SCHEDULE ====================
  const updateSchedule = async () => {
    if (!scheduleFormData.meetLink && !scheduleFormData.date && !scheduleFormData.time && !scheduleFormData.classStatus) {
      toast.error("Please fill at least one field");
      return;
    }

    try {
      setLoading(true);
      const updateData = {};
      if (scheduleFormData.meetLink) updateData.meetLink = scheduleFormData.meetLink;
      if (scheduleFormData.date) updateData.preferredDate = scheduleFormData.date;
      if (scheduleFormData.time) updateData.preferredTime = scheduleFormData.time;
      if (scheduleFormData.classStatus) updateData.classStatus = scheduleFormData.classStatus;

      let response;
      const type = scheduleType;
      const id = selectedScheduleItem?._id;
      
      if (type === 'session') {
        response = await axios.put(
          `${API_URL}/expert-bookings/admin/update-schedule/${id}`,
          updateData
        );
      } else if (type === 'service') {
        response = await axios.put(
          `${API_URL}/servicebookings/admin/update-schedule/${id}`,
          updateData
        );
      } else if (type === 'plan') {
        response = await axios.put(
          `${API_URL}/planpayments/admin/update-schedule/${id}`,
          updateData
        );
      }

      if (response?.data?.success) {
        toast.success("Schedule updated successfully!");
        setShowScheduleModal(false);
        resetScheduleForm();
        if (type === 'session') fetchSessionRequests();
        else if (type === 'service') fetchServiceBookings();
        else if (type === 'plan') fetchPlanSubscriptions();
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

  // ==================== RESET SCHEDULE FORM ====================
  const resetScheduleForm = () => {
    setScheduleFormData({
      meetLink: "",
      date: "",
      time: "",
      duration: "60",
      classStatus: ""
    });
    setSelectedScheduleItem(null);
    setScheduleType("");
  };

  // ==================== OPEN SCHEDULE MODAL ====================
  const openScheduleModal = (item, type) => {
    setSelectedScheduleItem(item);
    setScheduleType(type);
    
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
    
    setScheduleFormData({
      meetLink: item.meetLink || "",
      date: dateStr,
      time: item.preferredTime || "",
      duration: item.duration || "60",
      classStatus: item.classStatus || "scheduled"
    });
    setShowScheduleModal(true);
  };

  // ==================== DELETE SESSION REQUEST ====================
  const deleteSessionRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session request?")) return;

    try {
      const response = await axios.delete(`${API_URL}/expert-bookings/${id}`);
      if (response.data.success) {
        toast.success("Session request deleted successfully!");
        fetchSessionRequests();
      }
    } catch (error) {
      console.log("DELETE ERROR =>", error);
      toast.error("Failed to delete session request");
    }
  };

  // ==================== GET ZODIAC SIGN ====================
  const getZodiacSign = (date, month) => {
    if ((month === 3 && date >= 21) || (month === 4 && date <= 19)) return "Aries ♈";
    if ((month === 4 && date >= 20) || (month === 5 && date <= 20)) return "Taurus ♉";
    if ((month === 5 && date >= 21) || (month === 6 && date <= 20)) return "Gemini ♊";
    if ((month === 6 && date >= 21) || (month === 7 && date <= 22)) return "Cancer ♋";
    if ((month === 7 && date >= 23) || (month === 8 && date <= 22)) return "Leo ♌";
    if ((month === 8 && date >= 23) || (month === 9 && date <= 22)) return "Virgo ♍";
    if ((month === 9 && date >= 23) || (month === 10 && date <= 22)) return "Libra ♎";
    if ((month === 10 && date >= 23) || (month === 11 && date <= 21)) return "Scorpio ♏";
    if ((month === 11 && date >= 22) || (month === 12 && date <= 21)) return "Sagittarius ♐";
    if ((month === 12 && date >= 22) || (month === 1 && date <= 19)) return "Capricorn ♑";
    if ((month === 1 && date >= 20) || (month === 2 && date <= 18)) return "Aquarius ♒";
    return "Pisces ♓";
  };

  // ==================== GET CLASS STATUS BADGE ====================
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

  // ==================== GET PAYMENT STATUS BADGE ====================
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending", icon: "⏳" },
      confirmed: { color: "bg-green-100 text-green-700", label: "Confirmed", icon: "✅" },
      cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled", icon: "❌" },
      completed: { color: "bg-blue-100 text-blue-700", label: "Completed", icon: "🎉" },
      success: { color: "bg-green-100 text-green-700", label: "Success", icon: "✅" },
      active: { color: "bg-green-100 text-green-700", label: "Active", icon: "✅" },
      expired: { color: "bg-gray-100 text-gray-700", label: "Expired", icon: "⏰" },
      inactive: { color: "bg-gray-100 text-gray-700", label: "Inactive", icon: "⏸️" }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1 w-fit`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  // ==================== GET TYPE BADGE ====================
  const getTypeBadge = (type) => {
    const config = {
      session: { color: "bg-blue-100 text-blue-700", label: "Session", icon: "🎯" },
      service: { color: "bg-purple-100 text-purple-700", label: "Service", icon: "🔮" },
      plan: { color: "bg-amber-100 text-amber-700", label: "Plan", icon: "👑" },
      kundli: { color: "bg-indigo-100 text-indigo-700", label: "Kundli", icon: "⭐" }
    };
    const c = config[type] || config.session;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.color} flex items-center gap-1 w-fit`}>
        <span>{c.icon}</span>
        {c.label}
      </span>
    );
  };

  useEffect(() => {
    if (activeTab === "sessions") {
      fetchSessionRequests();
    } else if (activeTab === "services") {
      fetchServiceBookings();
    } else if (activeTab === "plans") {
      fetchPlanSubscriptions();
    } else if (activeTab === "kundlis") {
      fetchSavedKundlis();
    }
  }, [activeTab]);

  const tabs = [
    { id: "kundlis", label: "Kundli Charts", icon: "⭐", count: savedKundlis.length },
    { id: "sessions", label: "Session Requests", icon: "👥", count: sessionRequests.length },
    { id: "services", label: "Service Bookings", icon: "🔮", count: serviceBookings.filter(b => b.status === 'confirmed' || b.status === 'success').length },
    { id: "plans", label: "Plan Subscriptions", icon: "👑", count: planSubscriptions.filter(p => p.status === 'active').length }
  ];

  const confirmedServiceBookings = serviceBookings.filter(b => b.status === 'confirmed' || b.status === 'success');
  const activePlanSubscriptions = planSubscriptions.filter(p => p.status === 'active');

  // Filter kundlis based on search
  const filteredKundlis = savedKundlis.filter(kundli => {
    const kundliData = kundli.kundliData || {};
    const searchLower = searchTerm.toLowerCase();
    return (
      (kundli.userName || "").toLowerCase().includes(searchLower) ||
      (kundli.userEmail || "").toLowerCase().includes(searchLower) ||
      (kundliData.rashi || "").toLowerCase().includes(searchLower) ||
      (kundliData.nakshatra || "").toLowerCase().includes(searchLower) ||
      (kundliData.ascendant_sign || "").toLowerCase().includes(searchLower) ||
      (kundliData.lagna || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Booking & Kundli Management
        </h1>
        <p className="text-gray-500 mt-1">Manage all session requests, service bookings, plan subscriptions, and kundli charts</p>
      </div>

      <BookingStatsCards stats={stats} />

      <div className="flex gap-3 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-t-lg whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
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

      {/* ==================== KUNDLI CHARTS TAB ==================== */}
      {activeTab === "kundlis" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by User Name, Email, Rashi, Nakshatra, or Lagna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr className="text-left text-sm text-gray-600">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Birth Details</th>
                  <th className="px-6 py-4">Rashi</th>
                  <th className="px-6 py-4">Nakshatra</th>
                  <th className="px-6 py-4">Lagna</th>
                  <th className="px-6 py-4">Manglik</th>
                  <th className="px-6 py-4">Created On</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-center">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading kundlis...</p>
                    </td>
                  </tr>
                ) : filteredKundlis.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? "No matching kundli charts found" : "No saved kundli charts found"}
                    </td>
                  </tr>
                ) : (
                  filteredKundlis.map((kundli, index) => {
                    const birthDetails = kundli.birthDetails;
                    const kundliData = kundli.kundliData || {};
                    const zodiac = birthDetails ? getZodiacSign(birthDetails.date, birthDetails.month) : "Unknown";
                    
                    return (
                      <React.Fragment key={kundli._id || index}>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-gray-500">#{index + 1}</td>
                          <td className="px-6 py-4">{getTypeBadge('kundli')}</td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-800">{kundli.userName || "Unknown User"}</div>
                              <div className="text-xs text-gray-400">{kundli.userEmail || "No email"}</div>
                              <div className="text-xs text-purple-500 font-mono">ID: {kundli.userId?.slice(-8) || "N/A"}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {birthDetails ? (
                              <div>
                                <div className="font-medium text-gray-800">
                                  {birthDetails.date}/{birthDetails.month}/{birthDetails.year}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {birthDetails.hour}:{birthDetails.minute}
                                </div>
                                <div className="text-xs text-purple-600">
                                  {zodiac}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FaMoon className="text-purple-500" />
                              <span className="font-semibold">{kundliData.rashi || kundliData.sign || "N/A"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="font-medium">{kundliData.nakshatra || "N/A"}</span>
                              {kundliData.nakshatra_pada && (
                                <p className="text-xs text-gray-400">Pada: {kundliData.nakshatra_pada}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span>{kundliData.ascendant_sign || kundliData.lagna || "N/A"}</span>
                              {kundliData.ascendant_lord && (
                                <p className="text-xs text-gray-400">Lord: {kundliData.ascendant_lord}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              kundliData.manglik === "Yes" || kundliData.manglik === "Manglik"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}>
                              {kundliData.manglik === "Yes" || kundliData.manglik === "Manglik" ? "Manglik" : "Non-Manglik"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(kundli.createdAt || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedKundli(kundli);
                                  setShowKundliModal(true);
                                }}
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                title="View Kundli Details"
                              >
                                <HiOutlineEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteSavedKundli(kundli._id)}
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                title="Delete Kundli"
                              >
                                <HiOutlineTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {expandedBooking === kundli._id && (
                          <tr className="bg-purple-50/30">
                            <td colSpan="10" className="px-6 py-4">
                              <div className="bg-gray-900 rounded-lg p-4">
                                <div className="mb-2 text-white text-xs">
                                  User: {kundli.userName} ({kundli.userEmail})
                                </div>
                                <pre className="text-green-400 text-xs overflow-x-auto max-h-96">
                                  {JSON.stringify(kundli, null, 2)}
                                </pre>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ==================== SESSIONS TABLE ==================== */}
      {activeTab === "sessions" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <tr className="text-left text-sm text-gray-600">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Expert</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Class Status</th>
                  <th className="px-6 py-4">Meet Link</th>
                  <th className="px-6 py-4">Join</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="12" className="px-6 py-12 text-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                ) : sessionRequests.length === 0 ? (
                  <tr><td colSpan="12" className="px-6 py-12 text-center text-gray-500">No session requests found</td></tr>
                ) : (
                  sessionRequests.map((request, index) => (
                    <React.Fragment key={request._id}>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-400 text-sm">#{index + 1}</td>
                        <td className="px-6 py-4">{getTypeBadge('session')}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{request.userName || "N/A"}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[120px]">{request.userEmail || "N/A"}</p>
                            {request.userPhone && (
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <HiOutlinePhone className="w-2 h-2" /> {request.userPhone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">{request.expertName || "N/A"}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">{request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : 'Not set'}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <FaClockIcon className="w-2 h-2" /> {request.preferredTime || 'Not set'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{request.duration || "60"} mins</td>
                        <td className="px-6 py-4">{request.amount ? `₹${request.amount}` : '-'}</td>
                        <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                        <td className="px-6 py-4">{getClassStatusBadge(request.classStatus)}</td>
                        <td className="px-6 py-4">
                          {request.meetLink ? (
                            <a href={request.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
                              <FaLink className="w-3 h-3" /> View
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">Not set</span>
                          )}
                        </td>
                        <td className="px-6 py-4">{getJoinButton(request)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap">
                            <button onClick={() => openScheduleModal(request, 'session')} className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition" title="Edit Schedule">
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button onClick={() => setExpandedBooking(expandedBooking === request._id ? null : request._id)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="View Details">
                              <HiOutlineEye className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteSessionRequest(request._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete">
                              <HiOutlineTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedBooking === request._id && (
                        <tr className="bg-blue-50/30">
                          <td colSpan="12" className="px-6 py-4">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800">Booking Details</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Customer Information</p>
                                  <p className="text-gray-800">Name: {request.userName}</p>
                                  <p className="text-gray-600 text-sm">Email: {request.userEmail}</p>
                                  <p className="text-gray-600 text-sm">Phone: {request.userPhone}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Session Information</p>
                                  <p className="text-gray-800">Expert: {request.expertName}</p>
                                  <p className="text-gray-600 text-sm">Date: {request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : 'Not set'}</p>
                                  <p className="text-gray-600 text-sm">Time: {request.preferredTime || 'Not set'}</p>
                                  <p className="text-gray-600 text-sm">Duration: {request.duration || '60'} mins</p>
                                  <p className="text-gray-600 text-sm">Amount: {request.amount ? `₹${request.amount}` : '-'}</p>
                                </div>
                              </div>
                              {request.message && (
                                <div>
                                  <p className="text-sm text-gray-500">Message</p>
                                  <p className="text-gray-600">{request.message}</p>
                                </div>
                              )}
                              {request.meetLink && (
                                <div>
                                  <p className="text-sm text-gray-500">Meet Link</p>
                                  <a href={request.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-sm">
                                    {request.meetLink}
                                  </a>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ==================== SERVICES TABLE ==================== */}
      {activeTab === "services" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr className="text-left text-sm text-gray-600">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Class Status</th>
                  <th className="px-6 py-4">Meet Link</th>
                  <th className="px-6 py-4">Join</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="12" className="px-6 py-12 text-center"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                ) : confirmedServiceBookings.length === 0 ? (
                  <tr><td colSpan="12" className="px-6 py-12 text-center text-gray-500">No confirmed service bookings found</td></tr>
                ) : (
                  confirmedServiceBookings.map((booking, index) => (
                    <React.Fragment key={booking._id}>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-400 text-sm">#{index + 1}</td>
                        <td className="px-6 py-4">{getTypeBadge('service')}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{booking.userName || "N/A"}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[120px]">{booking.userEmail || "N/A"}</p>
                            {booking.userPhone && (
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <HiOutlinePhone className="w-2 h-2" /> {booking.userPhone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800">{booking.serviceTitle || "N/A"}</p>
                            <p className="text-xs text-gray-400">{booking.serviceTitleKey || "Service"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">{booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'Not set'}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <FaClockIcon className="w-2 h-2" /> {booking.preferredTime || 'Not set'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{booking.duration || booking.serviceDuration || "60"} mins</td>
                        <td className="px-6 py-4"><span className="font-semibold text-green-600">₹{booking.amount || 0}</span></td>
                        <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                        <td className="px-6 py-4">{getClassStatusBadge(booking.classStatus)}</td>
                        <td className="px-6 py-4">
                          {booking.meetLink ? (
                            <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
                              <FaLink className="w-3 h-3" /> View
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">Not set</span>
                          )}
                        </td>
                        <td className="px-6 py-4">{getJoinButton(booking)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap">
                            <button onClick={() => openScheduleModal(booking, 'service')} className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition" title="Edit Schedule">
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setSelectedService(booking); setMeetLink(booking.meetLink || ""); setShowMeetLinkModal(true); }} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="Edit Meet Link">
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button onClick={() => setExpandedBooking(expandedBooking === booking._id ? null : booking._id)} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition" title="View Details">
                              <HiOutlineEye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedBooking === booking._id && (
                        <tr className="bg-purple-50/30">
                          <td colSpan="12" className="px-6 py-4">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800">Service Booking Details</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Customer Information</p>
                                  <p className="text-gray-800">Name: {booking.userName}</p>
                                  <p className="text-gray-600 text-sm">Email: {booking.userEmail}</p>
                                  <p className="text-gray-600 text-sm">Phone: {booking.userPhone}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Service Information</p>
                                  <p className="text-gray-800">Service: {booking.serviceTitle}</p>
                                  <p className="text-gray-600 text-sm">Amount: ₹{booking.amount}</p>
                                  <p className="text-gray-600 text-sm">Duration: {booking.duration || booking.serviceDuration || "60"} mins</p>
                                  <p className="text-gray-600 text-sm">Category: {booking.serviceCategory || "N/A"}</p>
                                </div>
                              </div>
                              {booking.message && (
                                <div>
                                  <p className="text-sm text-gray-500">Message</p>
                                  <p className="text-gray-600">{booking.message}</p>
                                </div>
                              )}
                              {booking.meetLink && (
                                <div>
                                  <p className="text-sm text-gray-500">Meet Link</p>
                                  <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-sm">
                                    {booking.meetLink}
                                  </a>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ==================== PLANS TABLE ==================== */}
      {activeTab === "plans" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-50 to-orange-50">
                <tr className="text-left text-sm text-gray-600">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Sessions</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Class Status</th>
                  <th className="px-6 py-4">Meet Link</th>
                  <th className="px-6 py-4">Join</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="13" className="px-6 py-12 text-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                ) : planSubscriptions.length === 0 ? (
                  <tr><td colSpan="13" className="px-6 py-12 text-center text-gray-500">No plan subscriptions found</td></tr>
                ) : (
                  planSubscriptions.map((subscription, index) => (
                    <React.Fragment key={subscription._id}>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-400 text-sm">#{index + 1}</td>
                        <td className="px-6 py-4">{getTypeBadge('plan')}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{subscription.userName || "User"}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[120px]">{subscription.userEmail || "No email"}</p>
                            {subscription.userPhone && (
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <HiOutlinePhone className="w-2 h-2" /> {subscription.userPhone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-amber-600">{subscription.planName}</p>
                            <p className="text-xs text-gray-400">{subscription.duration}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">{subscription.preferredDate ? new Date(subscription.preferredDate).toLocaleDateString() : 'Not set'}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <FaClockIcon className="w-2 h-2" /> {subscription.preferredTime || 'Not set'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-semibold text-green-600">₹{subscription.amount}</span>
                            {subscription.mrpAmount > subscription.amount && (
                              <p className="text-xs text-gray-400 line-through">₹{subscription.mrpAmount}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">{subscription.durationDays || "N/A"} days</td>
                        <td className="px-6 py-4">{subscription.sessionsIncluded || 0}</td>
                        <td className="px-6 py-4">{getStatusBadge(subscription.status)}</td>
                        <td className="px-6 py-4">{getClassStatusBadge(subscription.classStatus)}</td>
                        <td className="px-6 py-4">
                          {subscription.meetLink ? (
                            <a href={subscription.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
                              <FaLink className="w-3 h-3" /> View
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">Not set</span>
                          )}
                        </td>
                        <td className="px-6 py-4">{getJoinButton(subscription)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap">
                            <button onClick={() => openScheduleModal(subscription, 'plan')} className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition" title="Edit Schedule">
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setSelectedPlanUser(subscription); setMeetLink(subscription.meetLink || ""); setShowMeetLinkModal(true); }} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="Add/Edit Meeting Link">
                              <HiOutlineVideoCamera className="w-4 h-4" />
                            </button>
                            <button onClick={() => setExpandedBooking(expandedBooking === subscription._id ? null : subscription._id)} className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition" title="View Details">
                              <HiOutlineEye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedBooking === subscription._id && (
                        <tr className="bg-amber-50/30">
                          <td colSpan="13" className="px-6 py-4">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800">Plan Subscription Details</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Customer Information</p>
                                  <p className="text-gray-800">Name: {subscription.userName || "User"}</p>
                                  <p className="text-gray-600 text-sm">Email: {subscription.userEmail || "No email"}</p>
                                  <p className="text-gray-600 text-sm">Phone: {subscription.userPhone || "No phone"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Plan Information</p>
                                  <p className="text-gray-800">Plan: {subscription.planName}</p>
                                  <p className="text-gray-600 text-sm">Duration: {subscription.duration}</p>
                                  <p className="text-gray-600 text-sm">Sessions: {subscription.sessionsIncluded}</p>
                                  {subscription.preferredDate && <p className="text-gray-600 text-sm">Preferred Date: {new Date(subscription.preferredDate).toLocaleDateString()}</p>}
                                  {subscription.preferredTime && <p className="text-gray-600 text-sm">Preferred Time: {subscription.preferredTime}</p>}
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Payment & Validity</p>
                                  <p className="text-gray-600 text-sm">Amount: ₹{subscription.amount}</p>
                                  <p className="text-gray-600 text-sm">Started: {new Date(subscription.startDate).toLocaleDateString()}</p>
                                  <p className="text-gray-600 text-sm">Expires: {new Date(subscription.endDate).toLocaleDateString()}</p>
                                  <p className="text-gray-600 text-sm">Payment ID: {subscription.razorpayPaymentId || "N/A"}</p>
                                </div>
                              </div>
                              {subscription.features && subscription.features.length > 0 && (
                                <div>
                                  <p className="text-sm text-gray-500">Plan Features</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {subscription.features.map((feature, idx) => (
                                      <span key={idx} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{feature}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {subscription.message && (
                                <div>
                                  <p className="text-sm text-gray-500">Message from User</p>
                                  <p className="text-gray-600">{subscription.message}</p>
                                </div>
                              )}
                              {subscription.meetLink && (
                                <div>
                                  <p className="text-sm text-gray-500">Meet Link</p>
                                  <a href={subscription.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-sm">
                                    {subscription.meetLink}
                                  </a>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ==================== SCHEDULE EDIT MODAL ==================== */}
      <AnimatePresence>
        {showScheduleModal && selectedScheduleItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 text-white sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaEdit className="w-5 h-5" /> Edit Schedule
                    </h2>
                    <p className="text-sm text-white/80 mt-1 flex items-center gap-2">
                      {selectedScheduleItem.userName || "User"} 
                      {getTypeBadge(scheduleType)}
                    </p>
                  </div>
                  <button onClick={() => setShowScheduleModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition text-2xl">✕</button>
                </div>
              </div>

              <div className="p-6">
                {/* Current Info */}
                <div className="mb-6 grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500">User</p>
                    <p className="font-medium text-gray-800">{selectedScheduleItem.userName || "N/A"}</p>
                    <p className="text-xs text-gray-400">{selectedScheduleItem.userEmail || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Title</p>
                    <p className="font-medium text-gray-800">{selectedScheduleItem.planName || selectedScheduleItem.serviceTitle || selectedScheduleItem.expertName || "N/A"}</p>
                    {selectedScheduleItem.amount > 0 && (
                      <p className="text-xs text-green-600 font-semibold">₹{selectedScheduleItem.amount}</p>
                    )}
                    <p className="text-xs text-gray-400">Payment Status: {getStatusBadge(selectedScheduleItem.status)}</p>
                    <p className="text-xs text-gray-400">Class Status: {getClassStatusBadge(selectedScheduleItem.classStatus)}</p>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <FaLink className="inline mr-1" /> Google Meet Link
                    </label>
                    <input type="text" value={scheduleFormData.meetLink}
                      onChange={(e) => setScheduleFormData({ ...scheduleFormData, meetLink: e.target.value })}
                      placeholder="https://meet.google.com/..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    <p className="text-xs text-gray-400 mt-1">Students can join 30 min before - 1 hour after scheduled time</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <FaCalendarAlt className="inline mr-1" /> Date
                      </label>
                      <input type="date" value={scheduleFormData.date}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, date: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <FaClockIcon className="inline mr-1" /> Time
                      </label>
                      <input type="time" value={scheduleFormData.time}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, time: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                      <select value={scheduleFormData.duration}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, duration: e.target.value })}
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
                      <select value={scheduleFormData.classStatus}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, classStatus: e.target.value })}
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

                {/* Current Schedule Info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-700 flex items-center gap-2">
                    <FaClock className="w-3 h-3" />
                    <span>Current Schedule: {scheduleFormData.date ? new Date(scheduleFormData.date).toLocaleDateString() : 'Not set'} at {scheduleFormData.time || 'Not set'}</span>
                  </p>
                  {scheduleFormData.meetLink && (
                    <p className="text-xs text-blue-700 mt-1 flex items-center gap-2">
                      <FaLink className="w-3 h-3" />
                      <span>Current Link: {scheduleFormData.meetLink}</span>
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button onClick={() => setShowScheduleModal(false)} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium">
                    Cancel
                  </button>
                  <button onClick={updateSchedule} disabled={loading}
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

      {/* ==================== KUNDLI DETAIL MODAL ==================== */}
      <AnimatePresence>
        {showKundliModal && selectedKundli && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowKundliModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 text-white sticky top-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaStar className="text-yellow-300" /> Kundli Chart Details
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      User: {selectedKundli.userName || "Unknown"} ({selectedKundli.userEmail || "No email"})
                    </p>
                    {selectedKundli.birthDetails && (
                      <p className="text-white/70 text-xs mt-1">
                        Birth: {selectedKundli.birthDetails.date}/{selectedKundli.birthDetails.month}/{selectedKundli.birthDetails.year} at {selectedKundli.birthDetails.hour}:{selectedKundli.birthDetails.minute}
                      </p>
                    )}
                  </div>
                  <button onClick={() => setShowKundliModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition text-2xl">✕</button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-purple-50 p-3 rounded-xl text-center">
                    <FaMoon className="text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Rashi</p>
                    <p className="font-bold text-sm">{selectedKundli.kundliData?.rashi || selectedKundli.kundliData?.sign || "N/A"}</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-xl text-center">
                    <FaStar className="text-indigo-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Nakshatra</p>
                    <p className="font-bold text-sm">{selectedKundli.kundliData?.nakshatra || "N/A"}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl text-center">
                    <FaSun className="text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Lagna</p>
                    <p className="font-bold text-sm">{selectedKundli.kundliData?.ascendant_sign || "N/A"}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl text-center">
                    <FaCheckCircle className="text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Manglik</p>
                    <p className="font-bold text-sm">{selectedKundli.kundliData?.manglik || "Non-Manglik"}</p>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Complete Kundli Data</h3>
                  <pre className="text-green-400 text-xs overflow-x-auto max-h-96">
                    {JSON.stringify(selectedKundli, null, 2)}
                  </pre>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== MEET LINK MODAL ==================== */}
      <AnimatePresence>
        {showMeetLinkModal && (selectedService || selectedPlanUser) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMeetLinkModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-5 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaVideo className="w-5 h-5" />
                      {selectedService ? "Update Google Meet Link" : "Add Meeting Link for Plan User"}
                    </h2>
                    <p className="text-sm text-white/80 mt-1">
                      {selectedService ? `Service Booking - ${selectedService.userName}` : `Plan Subscription - ${selectedPlanUser?.userName || "User"}`}
                    </p>
                  </div>
                  <button onClick={() => setShowMeetLinkModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition">✕</button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Link (Google Meet/Zoom)</label>
                  <input
                    type="text"
                    placeholder="https://meet.google.com/..."
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">Example: https://meet.google.com/abc-defg-hij</p>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowMeetLinkModal(false)} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium">Cancel</button>
                  <button onClick={selectedService ? updateServiceMeetLink : updatePlanMeetLink} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition font-medium flex items-center gap-2">
                    <FaVideo className="w-4 h-4" /> Save & Send Link
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

export default Bookings;