// src/admin/components/Users.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaVideo, FaCheckCircle } from "react-icons/fa";
import { HiOutlineCalendar, HiOutlineClock, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

const Users = () => {
  const [courseUsers, setCourseUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [meetLink, setMeetLink] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    uniqueStudents: 0,
    totalRevenue: 0,
    meetLinksSet: 0
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // FETCH COURSE PURCHASES (Admin Endpoint - No Token)
  const fetchCoursePurchases = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/coursepayment/admin/success-users`);
      
      console.log("Admin Course Purchases Response:", response.data);
      
      if (response.data.success) {
        setCourseUsers(response.data.users);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } else {
        toast.error(response.data.message || 'Failed to fetch course purchases');
      }
    } catch (error) {
      console.log("FETCH COURSE USERS ERROR =>", error);
      toast.error("Failed to fetch course purchases");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE COURSE MEET LINK (Admin Endpoint - No Token)
  const updateCourseMeetLink = async () => {
    if (!meetLink.trim()) {
      alert("Please enter a valid Meet link");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/coursepayment/admin/update-meet-link/${selectedItem._id}`,
        { meetLink: meetLink.trim() }
      );
      
      if (response.data.success) {
        alert("Meet link updated successfully!");
        setShowModal(false);
        setMeetLink("");
        fetchCoursePurchases(); // Refresh the list
      } else {
        alert(response.data.message || "Failed to update meet link");
      }
    } catch (error) {
      console.log("UPDATE COURSE LINK ERROR =>", error);
      alert(error.response?.data?.message || "Failed to update meet link");
    }
  };

  useEffect(() => {
    fetchCoursePurchases();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Course Purchases Management
        </h1>
        <p className="text-gray-500 mt-1">Manage all course enrollments and meet links for students</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-100">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Enrollments</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-green-100">
          <p className="text-2xl font-bold text-green-600">
            ₹{stats.totalRevenue?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
          <p className="text-2xl font-bold text-blue-600">
            {stats.uniqueStudents || 0}
          </p>
          <p className="text-sm text-gray-500">Unique Students</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-yellow-100">
          <p className="text-2xl font-bold text-yellow-600">
            {stats.meetLinksSet || 0}
          </p>
          <p className="text-sm text-gray-500">Meet Links Set</p>
        </div>
      </div>

      {/* Course Purchases Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Purchased On</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Meet Link</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Loading enrollments...</p>
                  </td>
                </tr>
              ) : courseUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No course purchases found
                  </td>
                </tr>
              ) : (
                courseUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {u.userName?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">{u.userName || "Student"}</span>
                          {u.userPhone && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <HiOutlinePhone className="w-3 h-3" /> {u.userPhone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <HiOutlineMail className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{u.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium text-gray-800">{u.courseId?.title || "Course"}</span>
                        {u.courseId?.level && (
                          <p className="text-xs text-purple-500">{u.courseId.level}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <HiOutlineCalendar className="w-3 h-3" />
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">₹{u.amount || "0"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <FaCheckCircle className="w-3 h-3" /> Success
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.meetLink ? (
                        <a
                          href={u.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <FaVideo className="w-3 h-3" /> Join Meeting
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedItem(u);
                          setMeetLink(u.meetLink || "");
                          setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm"
                      >
                        <FaEdit className="w-3 h-3" /> Edit Link
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
           </table>
        </div>
      </motion.div>

      {/* Meet Link Modal */}
      <AnimatePresence>
        {showModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
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
                      Course: {selectedItem.courseId?.title || "Course"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Student Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {selectedItem.userName?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{selectedItem.userName || "Student"}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <HiOutlineMail className="w-3 h-3" />
                        <span>{selectedItem.userEmail}</span>
                      </div>
                    </div>
                  </div>
                  {selectedItem.userPhone && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                      <HiOutlinePhone className="w-3 h-3" />
                      <span>{selectedItem.userPhone}</span>
                    </div>
                  )}
                </div>

                {/* Course Details */}
                <div className="mb-4 p-3 bg-purple-50 rounded-xl">
                  <p className="text-sm font-semibold text-purple-700 mb-1">Course Details</p>
                  <p className="font-medium text-gray-800">{selectedItem.courseId?.title || "Course"}</p>
                  {selectedItem.courseId?.level && (
                    <p className="text-xs text-purple-500 mt-1">Level: {selectedItem.courseId.level}</p>
                  )}
                  <p className="text-sm text-green-600 font-semibold mt-2">
                    Amount Paid: ₹{selectedItem.amount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Purchased: {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Meet Link Input */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Google Meet Link
                  </label>
                  <input
                    type="text"
                    placeholder="https://meet.google.com/..."
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Example: https://meet.google.com/abc-defg-hij
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateCourseMeetLink}
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

export default Users;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaEdit, FaVideo, FaCheckCircle, FaClock, FaRupeeSign, FaCalendarAlt, FaUsers as FaUsersIcon, FaSync } from "react-icons/fa";
// import { HiOutlineCalendar, HiOutlineClock, HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineCheckCircle } from "react-icons/hi";

// const Users = () => {
//   const [activeTab, setActiveTab] = useState("courses");
//   const [courseUsers, setCourseUsers] = useState([]);
//   const [serviceUsers, setServiceUsers] = useState([]);
//   const [sessionRequests, setSessionRequests] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [meetLink, setMeetLink] = useState("");
//   const [itemType, setItemType] = useState("course");
//   const [newStatus, setNewStatus] = useState("");
//   const [updatingStatus, setUpdatingStatus] = useState(false);

//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

//   // FETCH COURSE PURCHASES (Success Payments)
//   const fetchCoursePurchases = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/coursepayment/success-users`);
//       if (response.data.success) {
//         setCourseUsers(response.data.users);
//       }
//     } catch (error) {
//       console.log("FETCH COURSE USERS ERROR =>", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // FETCH SERVICE BOOKINGS (Confirmed Payments Only)
//   const fetchServiceBookings = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/servicebookings/confirmed`);
//       if (response.data.success) {
//         setServiceUsers(response.data.bookings);
//       }
//     } catch (error) {
//       console.log("FETCH SERVICE BOOKINGS ERROR =>", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // FETCH SESSION REQUESTS (Expert Bookings - All requests)
//   const fetchSessionRequests = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/expert-bookings/all`);
//       if (response.data.success) {
//         setSessionRequests(response.data.bookings);
//       }
//     } catch (error) {
//       console.log("FETCH SESSION REQUESTS ERROR =>", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UPDATE SESSION REQUEST STATUS
//   const updateSessionStatus = async () => {
//     if (!newStatus) {
//       alert("Please select a status");
//       return;
//     }

//     setUpdatingStatus(true);
//     try {
//       const response = await axios.put(
//         `${API_URL}/expert-bookings/${selectedRequest._id}/status`,
//         { status: newStatus }
//       );
//       if (response.data.success) {
//         alert(`Status updated to ${newStatus} successfully!`);
//         setShowStatusModal(false);
//         setSelectedRequest(null);
//         setNewStatus("");
//         fetchSessionRequests();
//       }
//     } catch (error) {
//       console.log("UPDATE STATUS ERROR =>", error);
//       alert("Failed to update status");
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   // UPDATE COURSE MEET LINK
//   const updateCourseMeetLink = async () => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/coursepayment/update-meet-link/${selectedItem._id}`,
//         { meetLink }
//       );
//       if (response.data.success) {
//         alert("Meet link updated successfully");
//         setShowModal(false);
//         fetchCoursePurchases();
//       }
//     } catch (error) {
//       console.log("UPDATE COURSE LINK ERROR =>", error);
//       alert("Failed to update meet link");
//     }
//   };

//   // UPDATE SERVICE MEET LINK
//   const updateServiceMeetLink = async () => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/servicebookings/update-meet-link/${selectedItem._id}`,
//         { meetLink }
//       );
//       if (response.data.success) {
//         alert("Meet link updated successfully");
//         setShowModal(false);
//         fetchServiceBookings();
//       }
//     } catch (error) {
//       console.log("UPDATE SERVICE LINK ERROR =>", error);
//       alert("Failed to update meet link");
//     }
//   };

//   const handleUpdateLink = () => {
//     if (itemType === "course") {
//       updateCourseMeetLink();
//     } else {
//       updateServiceMeetLink();
//     }
//   };

//   const handleOpenStatusModal = (request) => {
//     setSelectedRequest(request);
//     setNewStatus(request.status);
//     setShowStatusModal(true);
//   };

//   useEffect(() => {
//     if (activeTab === "courses") {
//       fetchCoursePurchases();
//     } else if (activeTab === "services") {
//       fetchServiceBookings();
//     } else if (activeTab === "sessions") {
//       fetchSessionRequests();
//     }
//   }, [activeTab]);

//   const tabs = [
//     { id: "courses", label: "Course Purchases", icon: "📚", count: courseUsers.length },
//     { id: "services", label: "Service Bookings", icon: "🔮", count: serviceUsers.length },
//     { id: "sessions", label: "Session Requests", icon: "👥", count: sessionRequests.length }
//   ];

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending", icon: "⏳" },
//       confirmed: { color: "bg-green-100 text-green-700", label: "Confirmed", icon: "✅" },
//       cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled", icon: "❌" },
//       completed: { color: "bg-blue-100 text-blue-700", label: "Completed", icon: "🎉" }
//     };
//     const config = statusConfig[status] || statusConfig.pending;
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1 w-fit`}>
//         <span>{config.icon}</span>
//         {config.label}
//       </span>
//     );
//   };

//   const statusOptions = [
//     { value: "pending", label: "Pending", color: "bg-yellow-500" },
//     { value: "confirmed", label: "Confirmed", color: "bg-green-500" },
//     { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
//     { value: "completed", label: "Completed", color: "bg-blue-500" }
//   ];

//   return (
//     <div className="p-6">
//       {/* Tabs */}
//       <div className="flex gap-3 mb-6 border-b border-gray-200">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-t-lg ${
//               activeTab === tab.id
//                 ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             }`}
//           >
//             <span className="text-lg">{tab.icon}</span>
//             {tab.label}
//             <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
//               activeTab === tab.id
//                 ? "bg-white/20 text-white"
//                 : "bg-gray-300 text-gray-700"
//             }`}>
//               {tab.count}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* Course Purchases Table */}
//       {activeTab === "courses" && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
//         >
//           {/* ... Course table content remains same ... */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
//                 <tr className="text-left text-sm text-gray-600">
//                   <th className="px-6 py-4">User</th>
//                   <th className="px-6 py-4">Email</th>
//                   <th className="px-6 py-4">Course</th>
//                   <th className="px-6 py-4">Purchased On</th>
//                   <th className="px-6 py-4">Amount</th>
//                   <th className="px-6 py-4">Status</th>
//                   <th className="px-6 py-4">Meet Link</th>
//                   <th className="px-6 py-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
//                       <div className="flex justify-center"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
//                     </td>
//                   </tr>
//                 ) : courseUsers.length === 0 ? (
//                   <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">No course purchases found</td></tr>
//                 ) : (
//                   courseUsers.map((u) => (
//                     <tr key={u._id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
//                             {u.userName?.charAt(0)?.toUpperCase() || "U"}
//                           </div>
//                           <span className="font-medium text-gray-800">{u.userName}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-gray-600">{u.userEmail}</td>
//                       <td className="px-6 py-4">
//                         <span className="font-medium text-gray-800">{u.courseId?.title || "No Course"}</span>
//                         <p className="text-xs text-gray-400">{u.courseId?.level || ""}</p>
//                       </td>
//                       <td className="px-6 py-4 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
//                       <td className="px-6 py-4"><span className="font-semibold text-green-600">₹{u.amount || "2,499"}</span></td>
//                       <td className="px-6 py-4"><span className="flex items-center gap-1 text-green-600 text-sm"><FaCheckCircle className="w-3 h-3" />Success</span></td>
//                       <td className="px-6 py-4">
//                         {u.meetLink ? (
//                           <a href={u.meetLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"><FaVideo className="w-3 h-3" />Join Meeting</a>
//                         ) : (<span className="text-gray-400 text-sm">Not set</span>)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <button onClick={() => { setSelectedItem(u); setMeetLink(u.meetLink || ""); setItemType("course"); setShowModal(true); }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm">
//                           <FaEdit className="w-3 h-3" />Edit Link
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>
//       )}

//       {/* Service Bookings Table */}
//       {activeTab === "services" && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden"
//         >
//           {/* ... Service table content remains same ... */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
//                 <tr className="text-left text-sm text-gray-600">
//                   <th className="px-6 py-4">User</th>
//                   <th className="px-6 py-4">Email</th>
//                   <th className="px-6 py-4">Service</th>
//                   <th className="px-6 py-4">Date & Time</th>
//                   <th className="px-6 py-4">Amount</th>
//                   <th className="px-6 py-4">Status</th>
//                   <th className="px-6 py-4">Meet Link</th>
//                   <th className="px-6 py-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {loading ? (
//                   <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500"><div className="flex justify-center"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div></td></tr>
//                 ) : serviceUsers.length === 0 ? (
//                   <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">No confirmed service bookings found</td></tr>
//                 ) : (
//                   serviceUsers.map((booking) => (
//                     <tr key={booking._id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
//                             {booking.userName?.charAt(0)?.toUpperCase() || "U"}
//                           </div>
//                           <div><span className="font-medium text-gray-800">{booking.userName}</span><p className="text-xs text-gray-400">{booking.userPhone}</p></div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-gray-600">{booking.userEmail}</td>
//                       <td className="px-6 py-4"><span className="font-medium text-gray-800">{booking.serviceTitle}</span><p className="text-xs text-gray-400">{booking.duration || "Consultation"}</p></td>
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col gap-1">
//                           <div className="flex items-center gap-1 text-xs text-gray-500"><HiOutlineCalendar className="w-3 h-3" /><span>{new Date(booking.preferredDate).toLocaleDateString()}</span></div>
//                           <div className="flex items-center gap-1 text-xs text-gray-500"><HiOutlineClock className="w-3 h-3" /><span>{booking.preferredTime}</span></div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4"><span className="font-semibold text-green-600">₹{booking.amount}</span></td>
//                       <td className="px-6 py-4"><span className="flex items-center gap-1 text-green-600 text-sm"><HiOutlineCheckCircle className="w-3 h-3" />Confirmed</span></td>
//                       <td className="px-6 py-4">
//                         {booking.meetLink ? (
//                           <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"><FaVideo className="w-3 h-3" />Join Meeting</a>
//                         ) : (<span className="text-gray-400 text-sm">Not set</span>)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <button onClick={() => { setSelectedItem(booking); setMeetLink(booking.meetLink || ""); setItemType("service"); setShowModal(true); }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm">
//                           <FaEdit className="w-3 h-3" />Edit Link
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>
//       )}

//       {/* Session Requests Table with Status Update */}
//       {activeTab === "sessions" && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
//                 <tr className="text-left text-sm text-gray-600">
//                   <th className="px-6 py-4">User</th>
//                   <th className="px-6 py-4">Email</th>
//                   <th className="px-6 py-4">Expert</th>
//                   <th className="px-6 py-4">Date & Time</th>
//                   <th className="px-6 py-4">Message</th>
//                   <th className="px-6 py-4">Status</th>
//                   <th className="px-6 py-4">Requested On</th>
//                   <th className="px-6 py-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
//                       <div className="flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
//                     </td>
//                   </tr>
//                 ) : sessionRequests.length === 0 ? (
//                   <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">No session requests found</td></tr>
//                 ) : (
//                   sessionRequests.map((request) => (
//                     <tr key={request._id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
//                             {request.userName?.charAt(0)?.toUpperCase() || "U"}
//                           </div>
//                           <div>
//                             <span className="font-medium text-gray-800">{request.userName}</span>
//                             <p className="text-xs text-gray-400">{request.userPhone}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-gray-600">{request.userEmail}</td>
//                       <td className="px-6 py-4">
//                         <div>
//                           <span className="font-medium text-gray-800">{request.expertName}</span>
//                           <p className="text-xs text-gray-400">{request.expertId?.role || "Expert"}</p>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col gap-1">
//                           <div className="flex items-center gap-1 text-xs text-gray-500"><HiOutlineCalendar className="w-3 h-3" /><span>{new Date(request.preferredDate).toLocaleDateString()}</span></div>
//                           <div className="flex items-center gap-1 text-xs text-gray-500"><HiOutlineClock className="w-3 h-3" /><span>{request.preferredTime}</span></div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="text-sm text-gray-600 max-w-xs truncate" title={request.message}>
//                           {request.message || "No message"}
//                         </p>
//                       </td>
//                       <td className="px-6 py-4">
//                         {getStatusBadge(request.status)}
//                       </td>
//                       <td className="px-6 py-4 text-gray-600">
//                         {new Date(request.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => handleOpenStatusModal(request)}
//                           className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition text-sm"
//                         >
//                           <FaSync className="w-3 h-3" />
//                           Update Status
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>
//       )}

//       {/* Status Update Modal */}
//       <AnimatePresence>
//         {showStatusModal && selectedRequest && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowStatusModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 30 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 30 }}
//               className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-5 text-white">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h2 className="text-xl font-bold flex items-center gap-2">
//                       <FaSync className="w-5 h-5" />
//                       Update Session Status
//                     </h2>
//                     <p className="text-sm text-white/80 mt-1">
//                       {selectedRequest.userName} - {selectedRequest.expertName}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setShowStatusModal(false)}
//                     className="p-1 hover:bg-white/20 rounded-lg transition"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 {/* Request Details */}
//                 <div className="mb-4 p-3 bg-gray-50 rounded-xl">
//                   <p className="text-sm font-semibold text-gray-700 mb-2">Request Details:</p>
//                   <div className="space-y-1 text-sm">
//                     <p><span className="font-medium">User:</span> {selectedRequest.userName}</p>
//                     <p><span className="font-medium">Expert:</span> {selectedRequest.expertName}</p>
//                     <p><span className="font-medium">Date:</span> {new Date(selectedRequest.preferredDate).toLocaleDateString()}</p>
//                     <p><span className="font-medium">Time:</span> {selectedRequest.preferredTime}</p>
//                   </div>
//                 </div>

//                 {/* Status Selection */}
//                 <div className="mb-5">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Select Status
//                   </label>
//                   <div className="grid grid-cols-2 gap-3">
//                     {statusOptions.map((option) => (
//                       <button
//                         key={option.value}
//                         onClick={() => setNewStatus(option.value)}
//                         className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
//                           newStatus === option.value
//                             ? `${option.color} text-white shadow-md scale-105`
//                             : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                         }`}
//                       >
//                         {option.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Current Status Display */}
//                 <div className="mb-5 p-3 bg-yellow-50 rounded-xl">
//                   <p className="text-sm text-gray-600">
//                     <span className="font-semibold">Current Status:</span>{" "}
//                     {getStatusBadge(selectedRequest.status)}
//                   </p>
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-end gap-3">
//                   <button
//                     onClick={() => setShowStatusModal(false)}
//                     className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={updateSessionStatus}
//                     disabled={updatingStatus}
//                     className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition font-medium flex items-center gap-2"
//                   >
//                     {updatingStatus ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         Updating...
//                       </>
//                     ) : (
//                       <>
//                         <FaSync className="w-4 h-4" />
//                         Update Status
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Meet Link Modal (Existing - for Courses & Services) */}
//       <AnimatePresence>
//         {showModal && (itemType === "course" || itemType === "service") && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 30 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 30 }}
//               className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 text-white">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h2 className="text-xl font-bold flex items-center gap-2"><FaVideo className="w-5 h-5" />Update Google Meet Link</h2>
//                     <p className="text-sm text-white/80 mt-1">{itemType === "course" ? "Course Enrollment" : "Service Booking"} - {selectedItem?.userName}</p>
//                   </div>
//                   <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition">✕</button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="mb-4 p-3 bg-gray-50 rounded-xl">
//                   <div className="flex items-center gap-3 mb-2">
//                     <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
//                       {selectedItem?.userName?.charAt(0)?.toUpperCase() || "U"}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-800">{selectedItem?.userName}</p>
//                       <div className="flex items-center gap-2 text-xs text-gray-500"><HiOutlineMail className="w-3 h-3" /><span>{selectedItem?.userEmail}</span></div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200"><HiOutlinePhone className="w-3 h-3" /><span>{selectedItem?.userPhone || "Not provided"}</span></div>
//                 </div>

//                 <div className="mb-4 p-3 bg-purple-50 rounded-xl">
//                   <p className="text-sm font-semibold text-purple-700 mb-1">{itemType === "course" ? "Course Details" : "Service Details"}</p>
//                   <p className="font-medium text-gray-800">{itemType === "course" ? selectedItem?.courseId?.title : selectedItem?.serviceTitle}</p>
//                   {itemType === "service" && (
//                     <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
//                       <div className="flex items-center gap-1"><HiOutlineCalendar className="w-3 h-3" /><span>{new Date(selectedItem?.preferredDate).toLocaleDateString()}</span></div>
//                       <div className="flex items-center gap-1"><HiOutlineClock className="w-3 h-3" /><span>{selectedItem?.preferredTime}</span></div>
//                     </div>
//                   )}
//                   <p className="text-sm text-green-600 font-semibold mt-1">Amount Paid: ₹{selectedItem?.amount}</p>
//                 </div>

//                 <div className="mb-5">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Google Meet Link</label>
//                   <input type="text" placeholder="https://meet.google.com/..." value={meetLink} onChange={(e) => setMeetLink(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition" />
//                   <p className="text-xs text-gray-400 mt-1">Example: https://meet.google.com/abc-defg-hij</p>
//                 </div>

//                 <div className="flex justify-end gap-3">
//                   <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium">Cancel</button>
//                   <button onClick={handleUpdateLink} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition font-medium flex items-center gap-2"><FaVideo className="w-4 h-4" />Save & Send Link</button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Users;


