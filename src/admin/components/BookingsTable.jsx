// src/pages/Bookings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi";
import { FaSync, FaVideo, FaEdit, FaCheckCircle } from "react-icons/fa";
import { HiOutlineCalendar, HiOutlineClock, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import BookingStatsCards from "../components/BookingStatsCards";

const Bookings = () => {
  const [activeTab, setActiveTab] = useState("sessions");
  const [sessionRequests, setSessionRequests] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showMeetLinkModal, setShowMeetLinkModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState(null);

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

    // Only confirmed service bookings
    const confirmedServiceBookings = serviceBookings.filter(b => b.status === 'confirmed' || b.status === 'success');
    const serviceStats = {
      total: confirmedServiceBookings.length,
      totalRevenue: confirmedServiceBookings.reduce((sum, b) => sum + (b.amount || 0), 0),
      confirmed: confirmedServiceBookings.length,
    };

    return {
      totalBookings: sessionStats.total + serviceStats.total,
      totalRevenue: serviceStats.totalRevenue,
      pendingBookings: sessionStats.pending,
      confirmedBookings: sessionStats.confirmed + serviceStats.confirmed,
      cancelledBookings: sessionStats.cancelled,
      completedBookings: sessionStats.completed,
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
    } finally {
      setLoading(false);
    }
  };

  // FETCH SERVICE BOOKINGS (All for stats calculation, but we'll filter for display)
  const fetchServiceBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/servicebookings/all`);
      if (response.data.success) {
        setServiceBookings(response.data.bookings);
      }
    } catch (error) {
      console.log("FETCH SERVICE BOOKINGS ERROR =>", error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE SESSION REQUEST STATUS
  const updateSessionStatus = async () => {
    if (!newStatus) {
      alert("Please select a status");
      return;
    }

    setUpdatingStatus(true);
    try {
      const response = await axios.put(
        `${API_URL}/expert-bookings/${selectedRequest._id}/status`,
        { status: newStatus }
      );
      if (response.data.success) {
        alert(`Status updated to ${newStatus} successfully!`);
        setShowStatusModal(false);
        setSelectedRequest(null);
        setNewStatus("");
        fetchSessionRequests();
      }
    } catch (error) {
      console.log("UPDATE STATUS ERROR =>", error);
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(false);
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
        alert("Meet link updated successfully");
        setShowMeetLinkModal(false);
        setSelectedService(null);
        setMeetLink("");
        fetchServiceBookings();
      }
    } catch (error) {
      console.log("UPDATE SERVICE LINK ERROR =>", error);
      alert("Failed to update meet link");
    }
  };

  // DELETE SESSION REQUEST ONLY
  const deleteSessionRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session request?")) return;
    
    try {
      const response = await axios.delete(`${API_URL}/expert-bookings/${id}`);
      if (response.data.success) {
        alert("Session request deleted successfully!");
        fetchSessionRequests();
      }
    } catch (error) {
      console.log("DELETE ERROR =>", error);
      alert("Failed to delete session request");
    }
  };

  useEffect(() => {
    if (activeTab === "sessions") {
      fetchSessionRequests();
    } else {
      fetchServiceBookings();
    }
  }, [activeTab]);

  const tabs = [
    { id: "sessions", label: "Session Requests", icon: "👥", count: sessionRequests.length },
    { id: "services", label: "Service Bookings", icon: "🔮", count: serviceBookings.filter(b => b.status === 'confirmed' || b.status === 'success').length }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending", icon: "⏳" },
      confirmed: { color: "bg-green-100 text-green-700", label: "Confirmed", icon: "✅" },
      cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled", icon: "❌" },
      completed: { color: "bg-blue-100 text-blue-700", label: "Completed", icon: "🎉" },
      success: { color: "bg-green-100 text-green-700", label: "Success", icon: "✅" }
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

  // Filter only confirmed service bookings (paid users)
  const confirmedServiceBookings = serviceBookings.filter(b => b.status === 'confirmed' || b.status === 'success');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Booking Management
        </h1>
        <p className="text-gray-500 mt-1">Manage all session requests and service bookings</p>
      </div>

      <BookingStatsCards stats={stats} />

      <div className="flex gap-3 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-t-lg ${
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

      {/* Session Requests Table (with delete option) */}
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
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setNewStatus(request.status);
                                setShowStatusModal(true);
                              }}
                              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                              title="Update Status"
                            >
                              <FaSync className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setExpandedBooking(expandedBooking === request._id ? null : request._id)}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                              title="View Details"
                            >
                              <HiOutlineEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteSessionRequest(request._id)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                              title="Delete"
                            >
                              <HiOutlineTrash className="w-4 h-4" />
                            </button>
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
                              <div>
                                <p className="text-sm text-gray-500">Timestamps</p>
                                <p className="text-gray-600 text-sm">Created: {new Date(request.createdAt).toLocaleString()}</p>
                              </div>
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

      {/* Service Bookings Table - Only Confirmed Bookings (Paid Users) */}
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
                        <td className="px-6 py-4">
                          <span className="font-semibold text-green-600">₹{booking.amount}</span>
                         </td>
                        <td className="px-6 py-4">
                          {booking.meetLink ? (
                            <a
                              href={booking.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <FaVideo className="w-3 h-3" />
                              Join Meeting
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">Not set</span>
                          )}
                         </td>
                        <td className="px-6 py-4 text-gray-600">{new Date(booking.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedService(booking);
                                setMeetLink(booking.meetLink || "");
                                setShowMeetLinkModal(true);
                              }}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                              title="Edit Meet Link"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setExpandedBooking(expandedBooking === booking._id ? null : booking._id)}
                              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                              title="View Details"
                            >
                              <HiOutlineEye className="w-4 h-4" />
                            </button>
                          </div>
                         </td>
                       </tr>
                      {expandedBooking === booking._id && (
                        <tr className="bg-purple-50/30">
                          <td colSpan="8" className="px-6 py-4">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800">Booking Details</h4>
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
                                  <p className="text-gray-600 text-sm">Date: {new Date(booking.preferredDate).toLocaleDateString()}</p>
                                  <p className="text-gray-600 text-sm">Time: {booking.preferredTime}</p>
                                  <p className="text-gray-600 text-sm">Amount: ₹{booking.amount}</p>
                                  {booking.meetLink && (
                                    <p className="text-gray-600 text-sm">Meet Link: <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{booking.meetLink}</a></p>
                                  )}
                                </div>
                              </div>
                              {booking.message && (
                                <div>
                                  <p className="text-sm text-gray-500">Message</p>
                                  <p className="text-gray-600">{booking.message}</p>
                                </div>
                              )}
                              {booking.paymentId && (
                                <div>
                                  <p className="text-sm text-gray-500">Payment Information</p>
                                  <p className="text-gray-600 text-sm">Payment ID: {booking.paymentId}</p>
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

      {/* Status Update Modal for Session Requests */}
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
                      <FaSync className="w-5 h-5" />
                      Update Session Status
                    </h2>
                    <p className="text-sm text-white/80 mt-1">
                      {selectedRequest.userName} - {selectedRequest.expertName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Request Details:</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">User:</span> {selectedRequest.userName}</p>
                    <p><span className="font-medium">Expert:</span> {selectedRequest.expertName}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedRequest.preferredDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Time:</span> {selectedRequest.preferredTime}</p>
                  </div>
                </div>

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

                <div className="mb-5 p-3 bg-yellow-50 rounded-xl">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Current Status:</span>{" "}
                    {getStatusBadge(selectedRequest.status)}
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateSessionStatus}
                    disabled={updatingStatus}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition font-medium flex items-center gap-2"
                  >
                    {updatingStatus ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaSync className="w-4 h-4" />
                        Update Status
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Meet Link Modal for Service Bookings */}
      <AnimatePresence>
        {showMeetLinkModal && selectedService && (
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
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaVideo className="w-5 h-5" />
                      Update Google Meet Link
                    </h2>
                    <p className="text-sm text-white/80 mt-1">
                      Service Booking - {selectedService.userName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMeetLinkModal(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {selectedService.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{selectedService.userName}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <HiOutlineMail className="w-3 h-3" />
                        <span>{selectedService.userEmail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                    <HiOutlinePhone className="w-3 h-3" />
                    <span>{selectedService.userPhone || "Not provided"}</span>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-purple-50 rounded-xl">
                  <p className="text-sm font-semibold text-purple-700 mb-1">Service Details</p>
                  <p className="font-medium text-gray-800">{selectedService.serviceTitle}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <HiOutlineCalendar className="w-3 h-3" />
                      <span>{new Date(selectedService.preferredDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiOutlineClock className="w-3 h-3" />
                      <span>{selectedService.preferredTime}</span>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 font-semibold mt-1">Amount Paid: ₹{selectedService.amount}</p>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Google Meet Link</label>
                  <input
                    type="text"
                    placeholder="https://meet.google.com/..."
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">Example: https://meet.google.com/abc-defg-hij</p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowMeetLinkModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateServiceMeetLink}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition font-medium flex items-center gap-2"
                  >
                    <FaVideo className="w-4 h-4" />
                    Save & Send Link
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