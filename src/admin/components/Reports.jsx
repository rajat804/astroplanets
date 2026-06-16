// src/admin/components/Reports.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  FaFileAlt, FaDownload, FaCalendarAlt, 
  FaChartLine, FaUsers, FaRupeeSign, FaStar,
  FaGraduationCap, FaCrown, FaGem, FaEye,
  FaFilter, FaPrint, FaFileExcel
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState("overview");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  // Data states
  const [overview, setOverview] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalKundlis: 0,
    totalCourses: 0,
    totalServices: 0,
    totalPlans: 0
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentKundlis, setRecentKundlis] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch Overview Data
  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [sessionRes, serviceRes, planRes, kundliRes, courseRes] = await Promise.all([
        axios.get(`${API_URL}/expert-bookings/all`),
        axios.get(`${API_URL}/servicebookings/all`),
        axios.get(`${API_URL}/planpayments/admin/all-subscriptions`),
        axios.get(`${API_URL}/astrology/admin/all-kundlis`),
        axios.get(`${API_URL}/coursepayment/admin/success-users`)
      ]);
      
      // Calculate overview
      const sessions = sessionRes.data?.bookings || [];
      const services = serviceRes.data?.bookings || [];
      const plans = planRes.data?.subscriptions || [];
      const kundlis = kundliRes.data?.kundlis || [];
      const courses = courseRes.data?.users || [];
      
      // Calculate revenue
      const sessionRevenue = sessions.reduce((sum, b) => sum + (b.amount || 0), 0);
      const serviceRevenue = services.reduce((sum, b) => sum + (b.amount || 0), 0);
      const planRevenue = plans.reduce((sum, p) => sum + (p.amount || 0), 0);
      const courseRevenue = courses.reduce((sum, c) => sum + (c.amount || 0), 0);
      
      setOverview({
        totalBookings: sessions.length + services.length + plans.length,
        totalRevenue: sessionRevenue + serviceRevenue + planRevenue + courseRevenue,
        totalUsers: new Set([...sessions.map(s => s.userEmail), ...services.map(s => s.userEmail), ...plans.map(p => p.userEmail)]).size,
        totalKundlis: kundlis.length,
        totalCourses: courses.length,
        totalServices: services.filter(s => s.status === 'confirmed').length,
        totalPlans: plans.filter(p => p.status === 'active').length
      });
      
      // Recent bookings
      const allBookings = [
        ...sessions.map(b => ({ ...b, type: 'session', date: b.createdAt })),
        ...services.map(b => ({ ...b, type: 'service', date: b.createdAt })),
        ...plans.map(b => ({ ...b, type: 'plan', date: b.createdAt }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
      
      setRecentBookings(allBookings);
      setRecentKundlis(kundlis.slice(0, 10));
      
      // Revenue by month
      const monthlyRevenue = {};
      [...sessions, ...services, ...plans, ...courses].forEach(item => {
        const date = new Date(item.createdAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + (item.amount || 0);
      });
      
      setRevenueData(Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue })));
      
      // Top users by spending
      const userSpending = {};
      [...sessions, ...services, ...plans, ...courses].forEach(item => {
        const email = item.userEmail;
        if (email) {
          userSpending[email] = (userSpending[email] || 0) + (item.amount || 0);
        }
      });
      
      setTopUsers(Object.entries(userSpending)
        .map(([email, amount]) => ({ email, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5));
      
    } catch (error) {
      console.error("Fetch overview error:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  // Download Report as JSON
  // const downloadReport = () => {
  //   const reportData = {
  //     generatedAt: new Date().toISOString(),
  //     dateRange,
  //     overview,
  //     recentBookings,
  //     recentKundlis,
  //     revenueData,
  //     topUsers
  //   };
    
  //   const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `admin_report_${new Date().toISOString().split('T')[0]}.json`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  //   toast.success("Report downloaded successfully!");
  // };

  // Download as CSV
  // const downloadCSV = () => {
  //   const headers = ["Type", "User", "Email", "Amount", "Status", "Date"];
  //   const rows = recentBookings.map(b => [
  //     b.type,
  //     b.userName || b.userName || "N/A",
  //     b.userEmail || "N/A",
  //     b.amount || 0,
  //     b.status || "N/A",
  //     new Date(b.date).toLocaleDateString()
  //   ]);
    
  //   const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
  //   const blob = new Blob([csvContent], { type: 'text/csv' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `bookings_report_${new Date().toISOString().split('T')[0]}.csv`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  //   toast.success("CSV downloaded successfully!");
  // };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const reportTabs = [
    { id: "overview", label: "Overview", icon: <FaChartLine /> },
    { id: "bookings", label: "Recent Bookings", icon: <FaFileAlt /> },
    { id: "kundlis", label: "Recent Kundlis", icon: <FaStar /> },
    { id: "revenue", label: "Revenue", icon: <FaRupeeSign /> }
  ];

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Reports & Analytics
        </h1>
        <p className="text-gray-500 mt-1">View detailed reports and analytics of your platform</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Date Range:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={fetchOverviewData}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2"
          >
            <FaFilter className="w-4 h-4" /> Apply Filter
          </button>
          <div className="flex gap-2 ml-auto">
            {/* <button
              onClick={downloadReport}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
            >
              <FaDownload className="w-4 h-4" /> JSON
            </button>
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
            >
              <FaFileExcel className="w-4 h-4" /> CSV
            </button> */}
            {/* <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
            >
              <FaPrint className="w-4 h-4" /> Print
            </button> */}
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex gap-3 mb-6 border-b border-gray-200 overflow-x-auto">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-t-lg whitespace-nowrap ${
              activeReport === tab.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeReport === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-90">Total Revenue</p>
                      <p className="text-2xl font-bold mt-1">₹{overview.totalRevenue.toLocaleString()}</p>
                    </div>
                    <FaRupeeSign className="text-3xl opacity-50" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-90">Total Bookings</p>
                      <p className="text-2xl font-bold mt-1">{overview.totalBookings}</p>
                    </div>
                    <FaFileAlt className="text-3xl opacity-50" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-90">Total Users</p>
                      <p className="text-2xl font-bold mt-1">{overview.totalUsers}</p>
                    </div>
                    <FaUsers className="text-3xl opacity-50" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-5 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-90">Total Kundlis</p>
                      <p className="text-2xl font-bold mt-1">{overview.totalKundlis}</p>
                    </div>
                    <FaStar className="text-3xl opacity-50" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Breakdown */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaChartLine className="text-purple-500" /> Breakdown by Type
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FaGraduationCap className="text-blue-600" />
                        <span>Course Purchases</span>
                      </div>
                      <span className="font-bold">{overview.totalCourses}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FaGem className="text-green-600" />
                        <span>Service Bookings</span>
                      </div>
                      <span className="font-bold">{overview.totalServices}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FaCrown className="text-yellow-600" />
                        <span>Plan Subscriptions</span>
                      </div>
                      <span className="font-bold">{overview.totalPlans}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FaStar className="text-purple-600" />
                        <span>Kundli Charts</span>
                      </div>
                      <span className="font-bold">{overview.totalKundlis}</span>
                    </div>
                  </div>
                </div>

                {/* Top Users */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUsers className="text-purple-500" /> Top Spending Users
                  </h3>
                  <div className="space-y-3">
                    {topUsers.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No data available</p>
                    ) : (
                      topUsers.map((user, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {idx + 1}
                            </div>
                            <span className="font-medium">{user.email}</span>
                          </div>
                          <span className="font-bold text-green-600">₹{user.amount.toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaRupeeSign className="text-purple-500" /> Monthly Revenue Trend
                </h3>
                {revenueData.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No revenue data available</p>
                ) : (
                  <div className="space-y-3">
                    {revenueData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium text-gray-600">{item.month}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full flex items-center justify-end px-3 text-white text-sm font-medium"
                            style={{ width: `${Math.min(100, (item.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100)}%` }}
                          >
                            ₹{item.revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Recent Bookings Tab */}
          {activeReport === "bookings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <tr className="text-left text-sm text-gray-600">
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentBookings.length === 0 ? (
                      <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No bookings found</td></tr>
                    ) : (
                      recentBookings.map((booking, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.type === 'session' ? 'bg-blue-100 text-blue-700' :
                              booking.type === 'service' ? 'bg-purple-100 text-purple-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium">{booking.userName || "N/A"}</td>
                          <td className="px-6 py-4 text-gray-600">{booking.userEmail || "N/A"}</td>
                          <td className="px-6 py-4 font-semibold text-green-600">₹{booking.amount || 0}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'success' || booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {booking.status || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{new Date(booking.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <button className="p-1 text-blue-500 hover:text-blue-700">
                              <FaEye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Recent Kundlis Tab */}
          {activeReport === "kundlis" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <tr className="text-left text-sm text-gray-600">
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Rashi</th>
                      <th className="px-6 py-4">Nakshatra</th>
                      <th className="px-6 py-4">Lagna</th>
                      <th className="px-6 py-4">Created On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentKundlis.length === 0 ? (
                      <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No kundlis found</td></tr>
                    ) : (
                      recentKundlis.map((kundli, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-gray-500">#{idx + 1}</td>
                          <td className="px-6 py-4 font-medium">{kundli.userName || "N/A"}</td>
                          <td className="px-6 py-4 text-gray-600">{kundli.userEmail || "N/A"}</td>
                          <td className="px-6 py-4">{kundli.kundliData?.rashi || kundli.kundliData?.sign || "N/A"}</td>
                          <td className="px-6 py-4">{kundli.kundliData?.nakshatra || "N/A"}</td>
                          <td className="px-6 py-4">{kundli.kundliData?.ascendant_sign || kundli.kundliData?.lagna || "N/A"}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(kundli.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Revenue Tab */}
          {activeReport === "revenue" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Revenue Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">₹{overview.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                  <p className="text-sm text-gray-500">Average Order Value</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    ₹{overview.totalBookings ? Math.round(overview.totalRevenue / overview.totalBookings).toLocaleString() : 0}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                  <p className="text-sm text-gray-500">Revenue per User</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    ₹{overview.totalUsers ? Math.round(overview.totalRevenue / overview.totalUsers).toLocaleString() : 0}
                  </p>
                </div>
              </div>

              {/* Revenue by Type */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue by Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Course Revenue</span>
                      <span className="font-bold text-blue-600">₹{overview.totalCourses * 2500}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Service Revenue</span>
                      <span className="font-bold text-green-600">₹{overview.totalServices * 500}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Plan Revenue</span>
                      <span className="font-bold text-yellow-600">₹{overview.totalPlans * 1999}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Kundli Revenue</span>
                      <span className="font-bold text-purple-600">₹{overview.totalKundlis * 99}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;