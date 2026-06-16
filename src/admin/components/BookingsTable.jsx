// src/pages/Bookings.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineEye, HiOutlineTrash, HiOutlineVideoCamera } from "react-icons/hi";
import { FaSync, FaVideo, FaEdit, FaCheckCircle, FaCrown, FaCalendarAlt, FaClock, FaStar, FaMoon, FaSun, FaChartLine, FaTrash } from "react-icons/fa";
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
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPlanStatusModal, setShowPlanStatusModal] = useState(false);
  const [showMeetLinkModal, setShowMeetLinkModal] = useState(false);
  const [showKundliModal, setShowKundliModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPlanUser, setSelectedPlanUser] = useState(null);
  const [selectedKundli, setSelectedKundli] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newPlanStatus, setNewPlanStatus] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPlanStatus, setUpdatingPlanStatus] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [expandedTab, setExpandedTab] = useState("details");

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

  // FETCH SESSION REQUESTS
  const fetchSessionRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/expert-bookings/all`);
      if (response.data.success) {
        setSessionRequests(response.data.bookings);
      }
    } catch (error) {
      console.log("FETCH SESSION REQUESTS ERROR =>", error);
      toast.error("Failed to fetch session requests");
    } finally {
      setLoading(false);
    }
  };

  // FETCH SERVICE BOOKINGS
  const fetchServiceBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/servicebookings/all`);
      if (response.data.success) {
        setServiceBookings(response.data.bookings);
      }
    } catch (error) {
      console.log("FETCH SERVICE BOOKINGS ERROR =>", error);
      toast.error("Failed to fetch service bookings");
    } finally {
      setLoading(false);
    }
  };

  // FETCH PLAN SUBSCRIPTIONS
  const fetchPlanSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/planpayments/admin/all-subscriptions`);
      
      console.log("Plan subscriptions response:", response.data);

      if (response.data.success) {
        setPlanSubscriptions(response.data.subscriptions);
        console.log(`Loaded ${response.data.subscriptions.length} plan subscriptions`);
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

  // FETCH SAVED KUNDLIS - ADMIN VERSION (NO TOKEN NEEDED)
  const fetchSavedKundlis = async () => {
    try {
      setLoading(true);
      
      // Admin endpoint - no token required
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

  // DELETE SAVED KUNDLI - ADMIN VERSION
  const deleteSavedKundli = async (chartId) => {
    if (!window.confirm("Are you sure you want to delete this Kundli chart? This action cannot be undone!")) return;

    try {
      const response = await axios.delete(`${API_URL}/astrology/admin/delete-kundli/${chartId}`);

      if (response.data.success) {
        toast.success("Kundli deleted successfully!");
        fetchSavedKundlis(); // Refresh the list
      } else {
        toast.error(response.data.message || 'Failed to delete kundli');
      }
    } catch (error) {
      console.log("DELETE KUNDLI ERROR =>", error);
      toast.error(error.response?.data?.message || "Failed to delete kundli");
    }
  };

  // UPDATE SESSION REQUEST STATUS
  const updateSessionStatus = async () => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    setUpdatingStatus(true);
    try {
      const response = await axios.put(
        `${API_URL}/expert-bookings/${selectedRequest._id}/status`,
        { status: newStatus }
      );
      if (response.data.success) {
        toast.success(`Status updated to ${newStatus} successfully!`);
        setShowStatusModal(false);
        setSelectedRequest(null);
        setNewStatus("");
        fetchSessionRequests();
      }
    } catch (error) {
      console.log("UPDATE STATUS ERROR =>", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // UPDATE PLAN SUBSCRIPTION STATUS
  const updatePlanStatus = async () => {
    if (!newPlanStatus) {
      toast.error("Please select a status");
      return;
    }

    setUpdatingPlanStatus(true);
    try {
      const response = await axios.put(
        `${API_URL}/planpayments/update-status/${selectedPlanUser._id}`,
        { status: newPlanStatus }
      );
      if (response.data.success) {
        toast.success(`Plan status updated to ${newPlanStatus} successfully!`);
        setShowPlanStatusModal(false);
        setSelectedPlanUser(null);
        setNewPlanStatus("");
        fetchPlanSubscriptions();
      }
    } catch (error) {
      console.log("UPDATE PLAN STATUS ERROR =>", error);
      toast.error("Failed to update plan status");
    } finally {
      setUpdatingPlanStatus(false);
    }
  };

  // UPDATE SERVICE MEET LINK
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

  // UPDATE PLAN SUBSCRIPTION MEET LINK
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

  // DELETE SESSION REQUEST
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

  // Get zodiac sign helper
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

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "confirmed", label: "Confirmed", color: "bg-green-500" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
    { value: "completed", label: "Completed", color: "bg-blue-500" }
  ];

  const planStatusOptions = [
    { value: "active", label: "Active", color: "bg-green-500" },
    { value: "expired", label: "Expired", color: "bg-gray-500" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
    { value: "inactive", label: "Inactive", color: "bg-gray-500" }
  ];

  const confirmedServiceBookings = serviceBookings.filter(b => b.status === 'confirmed' || b.status === 'success');
  const activePlanSubscriptions = planSubscriptions.filter(p => p.status === 'active');

  // Filter kundlis based on search (now includes user name and email)
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

      {/* ==================== KUNDLI CHARTS TAB (ADMIN VIEW WITH USER INFO) ==================== */}
      {activeTab === "kundlis" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden"
        >
          {/* Search Bar */}
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
                    <td colSpan="9" className="px-6 py-12 text-center">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading kundlis...</p>
                    </td>
                  </tr>
                ) : filteredKundlis.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
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

                        {/* Expanded Row for JSON View */}
                        {expandedBooking === kundli._id && (
                          <tr className="bg-purple-50/30">
                            <td colSpan="9" className="px-6 py-4">
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

      {/* Session Requests Table */}
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
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Expert</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Requested On</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="8" className="px-6 py-12 text-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                ) : sessionRequests.length === 0 ? (
                  <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">No session requests found</td></tr>
                ) : (
                  sessionRequests.map((request) => (
                    <React.Fragment key={request._id}>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {request.userName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">{request.userName}</span>
                              <p className="text-xs text-gray-400">{request.userPhone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{request.userEmail}</td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-medium text-gray-800">{request.expertName}</span>
                            <p className="text-xs text-gray-400">{request.expertId?.role || "Expert"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs text-gray-500">{new Date(request.preferredDate).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{request.preferredTime}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate" title={request.message}>
                            {request.message || "No message"}
                          </p>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(request.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedRequest(request); setNewStatus(request.status); setShowStatusModal(true); }} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition" title="Update Status"><FaSync className="w-4 h-4" /></button>
                            <button onClick={() => setExpandedBooking(expandedBooking === request._id ? null : request._id)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="View Details"><HiOutlineEye className="w-4 h-4" /></button>
                            <button onClick={() => deleteSessionRequest(request._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                      {expandedBooking === request._id && (
                        <tr className="bg-blue-50/30">
                          <td colSpan="8" className="px-6 py-4">
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
                                  <p className="text-gray-600 text-sm">Date: {new Date(request.preferredDate).toLocaleDateString()}</p>
                                  <p className="text-gray-600 text-sm">Time: {request.preferredTime}</p>
                                </div>
                              </div>
                              {request.message && (
                                <div>
                                  <p className="text-sm text-gray-500">Message</p>
                                  <p className="text-gray-600">{request.message}</p>
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

      {/* Service Bookings Table */}
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
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Meet Link</th>
                  <th className="px-6 py-4">Booked On</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="8" className="px-6 py-12 text-center"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                ) : confirmedServiceBookings.length === 0 ? (
                  <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">No confirmed service bookings found</td></tr>
                ) : (
                  confirmedServiceBookings.map((booking) => (
                    <React.Fragment key={booking._id}>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {booking.userName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">{booking.userName}</span>
                              <p className="text-xs text-gray-400">{booking.userPhone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{booking.userEmail}</td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-800">{booking.serviceTitle}</span>
                          <p className="text-xs text-gray-400">{booking.duration || "Consultation"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs">{new Date(booking.preferredDate).toLocaleDateString()}</div>
                            <div className="text-xs">{booking.preferredTime}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="font-semibold text-green-600">₹{booking.amount}</span></td>
                        <td className="px-6 py-4">
                          {booking.meetLink ? (
                            <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                              <FaVideo className="w-3 h-3" /> Join Meeting
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">Not set</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{new Date(booking.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedService(booking); setMeetLink(booking.meetLink || ""); setShowMeetLinkModal(true); }} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="Edit Meet Link"><FaEdit className="w-4 h-4" /></button>
                            <button onClick={() => setExpandedBooking(expandedBooking === booking._id ? null : booking._id)} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition" title="View Details"><HiOutlineEye className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                      {expandedBooking === booking._id && (
                        <tr className="bg-purple-50/30">
                          <td colSpan="8" className="px-6 py-4">
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
                                  <p className="text-gray-600 text-sm">Duration: {booking.duration || "Consultation"}</p>
                                </div>
                              </div>
                              {booking.message && (
                                <div>
                                  <p className="text-sm text-gray-500">Message</p>
                                  <p className="text-gray-600">{booking.message}</p>
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

      {/* Plan Subscriptions Table */}
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
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Valid Till</th>
                  <th className="px-6 py-4">Sessions</th>
                  <th className="px-6 py-4">Meet Link</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="11" className="px-6 py-12 text-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                ) : planSubscriptions.length === 0 ? (
                  <tr><td colSpan="11" className="px-6 py-12 text-center text-gray-500">No plan subscriptions found</td></tr>
                ) : (
                  planSubscriptions.map((subscription) => (
                    <React.Fragment key={subscription._id}>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              <FaCrown className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">{subscription.userName || "User"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{subscription.userEmail || "No email"}</td>
                        <td className="px-6 py-4 text-gray-600">{subscription.userPhone || "No phone"}</td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-semibold text-amber-600">{subscription.planName}</span>
                            <p className="text-xs text-gray-400">{subscription.duration}</p>
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
                        <td className="px-6 py-4">{subscription.durationDays} days</td>
                        <td className="px-6 py-4">{new Date(subscription.endDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{subscription.sessionsIncluded || 0}</td>
                        <td className="px-6 py-4">
                          {subscription.meetLink ? (
                            <a href={subscription.meetLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                              <FaVideo className="w-3 h-3" /> Join Meeting
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">Not set</span>
                          )}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(subscription.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedPlanUser(subscription); setNewPlanStatus(subscription.status); setShowPlanStatusModal(true); }} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition" title="Update Plan Status"><FaSync className="w-4 h-4" /></button>
                            <button onClick={() => { setSelectedPlanUser(subscription); setMeetLink(subscription.meetLink || ""); setShowMeetLinkModal(true); }} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="Add/Edit Meeting Link"><HiOutlineVideoCamera className="w-4 h-4" /></button>
                            <button onClick={() => setExpandedBooking(expandedBooking === subscription._id ? null : subscription._id)} className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition" title="View Details"><HiOutlineEye className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                      {expandedBooking === subscription._id && (
                        <tr className="bg-amber-50/30">
                          <td colSpan="11" className="px-6 py-4">
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

      {/* Kundli Detail Modal */}
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
                {/* Summary Cards */}
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

                {/* Full JSON */}
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

      {/* Session Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowStatusModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-5 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaSync className="w-5 h-5" /> Update Session Status
                    </h2>
                    <p className="text-sm text-white/80 mt-1">{selectedRequest.userName} - {selectedRequest.expertName}</p>
                  </div>
                  <button onClick={() => setShowStatusModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition">✕</button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setNewStatus(option.value)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          newStatus === option.value
                            ? `${option.color} text-white shadow-md scale-105`
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowStatusModal(false)} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium">Cancel</button>
                  <button onClick={updateSessionStatus} disabled={updatingStatus} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition font-medium flex items-center gap-2">
                    {updatingStatus ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Updating...</>
                    ) : (
                      <><FaSync className="w-4 h-4" /> Update Status</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan Status Update Modal */}
      <AnimatePresence>
        {showPlanStatusModal && selectedPlanUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPlanStatusModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaSync className="w-5 h-5" /> Update Plan Status
                    </h2>
                    <p className="text-sm text-white/80 mt-1">{selectedPlanUser.planName} - {selectedPlanUser.userName || "User"}</p>
                  </div>
                  <button onClick={() => setShowPlanStatusModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition">✕</button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Current Plan Details:</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">User:</span> {selectedPlanUser.userName || "User"}</p>
                    <p><span className="font-medium">Plan:</span> {selectedPlanUser.planName}</p>
                    <p><span className="font-medium">Amount:</span> ₹{selectedPlanUser.amount}</p>
                    <p><span className="font-medium">Valid Until:</span> {new Date(selectedPlanUser.endDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Current Status:</span> {getStatusBadge(selectedPlanUser.status)}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select New Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    {planStatusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setNewPlanStatus(option.value)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          newPlanStatus === option.value
                            ? `${option.color} text-white shadow-md scale-105`
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowPlanStatusModal(false)} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium">Cancel</button>
                  <button onClick={updatePlanStatus} disabled={updatingPlanStatus} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition font-medium flex items-center gap-2">
                    {updatingPlanStatus ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Updating...</>
                    ) : (
                      <><FaSync className="w-4 h-4" /> Update Status</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meet Link Modal */}
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