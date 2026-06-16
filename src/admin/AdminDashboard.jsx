import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaRupeeSign, FaBookOpen, FaMagic, FaCalendarAlt, FaFilter, FaClock } from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi";
import AdminRoute from "./AdminRoute";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import OverviewStats from "./components/OverviewStats";
import RevenueChart from "./components/RevenueChart";
import RecentBookings from "./components/RecentBookings";
import ProductsTable from "./components/ProductsTable";
import ProductFormModal from "./components/ProductFormModal";
import BookingsTable from "./components/BookingsTable";
import AddCourse from "./components/AddCourse";
import Users from "./components/Users";
import AddServices from "./components/AddServices";
import AdminExperts from "./components/AdminExperts";
import HeroSlide from "./components/HeroSlider";
import SocialContentManager from "./components/SocialContentManager";
import BlogManager from "./components/BlogManager";
import CouponManager from "./components/CouponManager";
import PlanManagement from "./components/PlanManagement";
import OrdersTable from "./components/OrdersTable";
import OrderStatsCards from "./components/OrderStatsCards";
import Reports from "./components/Reports";
import Classes from "./components/Classes";
import RashiFalManager from "./components/RashiFalManager";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminDashboardShell() {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
}

function AdminDashboard() {
  const nav = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [filterType, setFilterType] = useState("monthly"); // monthly, yearly, custom
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Timing Filter States
  const [timeFilter, setTimeFilter] = useState("all"); // all, morning, afternoon, evening, night
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showTimeFilter, setShowTimeFilter] = useState(false);

  // Products State
  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Bookings State
  const [bookingsData, setBookingsData] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStats, setOrderStats] = useState(null);

  // Available years (current year and 2 years back)
  const availableYears = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];
  
  // Months
  const months = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" }
  ];

  // Time slots for filtering
  const timeSlots = [
    { value: "all", label: "All Time", icon: "🕐", range: "00:00 - 23:59" },
    { value: "morning", label: "Morning", icon: "🌅", range: "06:00 - 12:00", startHour: 6, endHour: 12 },
    { value: "afternoon", label: "Afternoon", icon: "☀️", range: "12:00 - 17:00", startHour: 12, endHour: 17 },
    { value: "evening", label: "Evening", icon: "🌤️", range: "17:00 - 20:00", startHour: 17, endHour: 20 },
    { value: "night", label: "Night", icon: "🌙", range: "20:00 - 06:00", startHour: 20, endHour: 24 }
  ];

  // Get Auth Token
  const getAuthToken = () => {
    return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  };

  // Filter data by time of day
  const filterByTimeOfDay = (data) => {
    if (timeFilter === "all") return data;
    
    const selectedSlot = timeSlots.find(slot => slot.value === timeFilter);
    if (!selectedSlot) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item.createdAt);
      const hour = itemDate.getHours();
      
      if (timeFilter === "morning") return hour >= 6 && hour < 12;
      if (timeFilter === "afternoon") return hour >= 12 && hour < 17;
      if (timeFilter === "evening") return hour >= 17 && hour < 20;
      if (timeFilter === "night") return hour >= 20 || hour < 6;
      return true;
    });
  };

  // Filter data by custom date range
  const filterByDateRange = (data) => {
    if (!startDate && !endDate) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      return true;
    });
  };

  // Axios interceptor for adding token to all requests
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Add response interceptor for handling 401 errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          logout();
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Fetch Dashboard Data with filters
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      console.log("Fetching dashboard data with filters:", { filterType, selectedYear, selectedMonth, timeFilter, startDate, endDate });
      
      // Build query params
      const params = new URLSearchParams();
      if (filterType === "monthly") {
        params.append('year', selectedYear);
        params.append('month', selectedMonth);
      } else if (filterType === "yearly") {
        params.append('year', selectedYear);
      }
      
      // Add custom date range if provided
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (timeFilter !== "all") params.append('timeFilter', timeFilter);
      
      // Fetch stats with filters
      const statsRes = await axios.get(`${API_URL}/admindashboard/overview-stats?${params.toString()}`);
      console.log("Stats response:", statsRes.data);
      
      if (statsRes.data.success) {
        setDashboardStats(statsRes.data.stats);
        setMonthlyRevenue(statsRes.data.stats.monthlyRevenue || []);
      }
      
      // Fetch ONLY confirmed/successful service bookings
      const confirmedBookingsRes = await axios.get(`${API_URL}/servicebookings/confirmed`);
      console.log("Confirmed Service Bookings:", confirmedBookingsRes.data);
      
      let allConfirmedBookings = [];
      
      if (confirmedBookingsRes.data.success && confirmedBookingsRes.data.bookings) {
        // Filter bookings by selected date range
        let filteredBookings = confirmedBookingsRes.data.bookings;
        
        if (filterType === "monthly") {
          filteredBookings = filteredBookings.filter(booking => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate.getFullYear() === selectedYear && 
                   (bookingDate.getMonth() + 1) === selectedMonth;
          });
        } else if (filterType === "yearly") {
          filteredBookings = filteredBookings.filter(booking => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate.getFullYear() === selectedYear;
          });
        }
        
        // Apply custom date range filter
        if (startDate || endDate) {
          filteredBookings = filterByDateRange(filteredBookings);
        }
        
        // Apply time of day filter
        filteredBookings = filterByTimeOfDay(filteredBookings);
        
        const serviceBookings = filteredBookings.map(booking => ({
          _id: booking._id,
          userName: booking.userName || "Guest User",
          userEmail: booking.userEmail || "No email",
          userPhone: booking.userPhone || null,
          serviceTitle: booking.serviceTitle || "Service Booking",
          amount: booking.amount || 0,
          status: booking.status || "confirmed",
          preferredDate: booking.preferredDate,
          preferredTime: booking.preferredTime,
          message: booking.message || null,
          createdAt: booking.createdAt,
          type: "service"
        }));
        allConfirmedBookings = [...serviceBookings];
      }
      
      // Fetch successful course payments
      const coursePaymentsRes = await axios.get(`${API_URL}/coursepayment/success-users`);
      console.log("Course Payments:", coursePaymentsRes.data);
      
      if (coursePaymentsRes.data.success && coursePaymentsRes.data.users) {
        // Filter course payments by selected date range
        let filteredPayments = coursePaymentsRes.data.users;
        
        if (filterType === "monthly") {
          filteredPayments = filteredPayments.filter(payment => {
            const paymentDate = new Date(payment.createdAt);
            return paymentDate.getFullYear() === selectedYear && 
                   (paymentDate.getMonth() + 1) === selectedMonth;
          });
        } else if (filterType === "yearly") {
          filteredPayments = filteredPayments.filter(payment => {
            const paymentDate = new Date(payment.createdAt);
            return paymentDate.getFullYear() === selectedYear;
          });
        }
        
        // Apply custom date range filter
        if (startDate || endDate) {
          filteredPayments = filterByDateRange(filteredPayments);
        }
        
        // Apply time of day filter
        filteredPayments = filterByTimeOfDay(filteredPayments);
        
        const courseBookings = filteredPayments.map(payment => ({
          _id: payment._id,
          userName: payment.userName || "User",
          userEmail: payment.userEmail || "No email",
          userPhone: payment.userPhone || null,
          serviceTitle: payment.courseId?.title || "Course Enrollment",
          amount: payment.amount || 0,
          status: "success",
          preferredDate: payment.createdAt,
          preferredTime: "Flexible",
          message: `Enrolled in ${payment.courseId?.title || "course"}`,
          createdAt: payment.createdAt,
          type: "course"
        }));
        allConfirmedBookings = [...allConfirmedBookings, ...courseBookings];
      }
      
      // Sort by date (newest first) and take top 5
      const sortedBookings = allConfirmedBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      console.log("Final recent bookings:", sortedBookings);
      setRecentBookings(sortedBookings);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Orders - Updated to match backend routes
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/orders/admin`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Orders response:", response.data);
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
      
      // Fetch order stats separately
      try {
        const statsResponse = await axios.get(`${API_URL}/orders/admin/stats/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (statsResponse.data.success) {
          setOrderStats(statsResponse.data.stats);
        }
      } catch (statsError) {
        console.warn('Order stats not available:', statsError.message);
      }
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 404) {
        console.warn('Orders endpoint not available yet');
        setOrders([]);
      } else if (error.response?.status === 401) {
        toast.error('Unauthorized. Please login again.');
        logout();
      } else {
        toast.error('Failed to fetch orders');
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  // Update Order Status - Updated to match backend routes
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(`${API_URL}/orders/admin/${orderId}/status`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Order status updated successfully');
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  // Delete Order - Updated to match backend routes
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const token = getAuthToken();
      const response = await axios.delete(`${API_URL}/orders/admin/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast.success('Order deleted successfully');
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  };

  // Product Functions
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data.products || []);
      
      try {
        const token = getAuthToken();
        const statsResponse = await axios.get(`${API_URL}/products/stats/admin`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProductStats(statsResponse.data.stats);
      } catch (statsError) {
        console.warn('Product stats not available:', statsError.message);
        setProductStats({
          totalProducts: response.data.products?.length || 0,
          lowStock: 0,
          outOfStock: 0
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  // Booking Functions
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/servicebookings/all`);
      setBookingsData(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  // Product CRUD
  const handleCreateProduct = async (productData) => {
    try {
      const response = await axios.post(`${API_URL}/products`, productData);
      setProducts([response.data.product, ...products]);
      toast.success('Product created successfully');
      setShowProductModal(false);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.msg || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, productData);
      setProducts(products.map(p => p._id === id ? response.data.product : p));
      toast.success('Product updated successfully');
      setEditingProduct(null);
      setShowProductModal(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.msg || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("admin");
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
    nav("/admin/login");
  };

  // Reset custom date range
  const resetCustomDateRange = () => {
    setStartDate("");
    setEndDate("");
  };

  // Handle filter apply
  const handleFilterApply = () => {
    fetchDashboardData();
    setShowFilterDropdown(false);
    setShowTimeFilter(false);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setFilterType("monthly");
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1);
    setTimeFilter("all");
    setStartDate("");
    setEndDate("");
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
    fetchProducts();
    fetchBookings();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (tab === 'bookings') {
      fetchBookings();
    }
    if (tab === 'overview') {
      fetchDashboardData();
    }
    if (tab === 'orders') {
      fetchOrders();
    }
  }, [tab]);

  // Get active filter display text
  const getActiveFilterText = () => {
    if (filterType === "custom") {
      return `Custom: ${startDate || "Any"} to ${endDate || "Any"}`;
    }
    if (filterType === "monthly") {
      return `${months.find(m => m.value === selectedMonth)?.name} ${selectedYear}`;
    }
    return `Year ${selectedYear}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-offWhite flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        tab={tab}
        setTab={setTab}
        logout={logout}
      />

      <div className="flex-1 overflow-x-hidden">
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          tab={tab}
          notifications={notifications}
        />

        <main className="p-6">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {tab === "overview" && (
              <motion.section
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Enhanced Filter Bar with Timing Filter */}
                <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg border border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <FaFilter className="text-gray-400 w-5 h-5" />
                      <span className="font-semibold text-gray-700">Filter Data:</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Filter Type Toggle */}
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setFilterType("monthly")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                            filterType === "monthly"
                              ? "bg-white text-red-600 shadow-sm"
                              : "text-gray-600 hover:text-gray-800"
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setFilterType("yearly")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                            filterType === "yearly"
                              ? "bg-white text-red-600 shadow-sm"
                              : "text-gray-600 hover:text-gray-800"
                          }`}
                        >
                          Yearly
                        </button>
                        <button
                          onClick={() => setFilterType("custom")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                            filterType === "custom"
                              ? "bg-white text-red-600 shadow-sm"
                              : "text-gray-600 hover:text-gray-800"
                          }`}
                        >
                          Custom Range
                        </button>
                      </div>
                      
                      {/* Year Selector */}
                      {(filterType === "monthly" || filterType === "yearly") && (
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      )}
                      
                      {/* Month Selector (only for monthly view) */}
                      {filterType === "monthly" && (
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          {months.map(month => (
                            <option key={month.value} value={month.value}>{month.name}</option>
                          ))}
                        </select>
                      )}
                      
                      {/* Custom Date Range Picker */}
                      {filterType === "custom" && (
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Start Date"
                          />
                          <span className="text-gray-400">to</span>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="End Date"
                          />
                        </div>
                      )}
                      
                      {/* Time of Day Filter */}
                      <div className="relative">
                        <button
                          onClick={() => setShowTimeFilter(!showTimeFilter)}
                          className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition ${
                            timeFilter !== "all"
                              ? "border-red-400 bg-red-50 text-red-600"
                              : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                          }`}
                        >
                          <FaClock className="w-4 h-4" />
                          <span>
                            {timeFilter === "all" ? "All Times" : timeSlots.find(s => s.value === timeFilter)?.label}
                          </span>
                        </button>
                        
                        {/* Time Filter Dropdown */}
                        {showTimeFilter && (
                          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[200px]">
                            {timeSlots.map(slot => (
                              <button
                                key={slot.value}
                                onClick={() => {
                                  setTimeFilter(slot.value);
                                  setShowTimeFilter(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition flex items-center justify-between ${
                                  timeFilter === slot.value ? "bg-red-50 text-red-600" : "text-gray-700"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{slot.icon}</span>
                                  <span>{slot.label}</span>
                                </div>
                                <span className="text-xs text-gray-400">{slot.range}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Apply Button */}
                      <button
                        onClick={handleFilterApply}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition shadow-md"
                      >
                        Apply Filter
                      </button>
                      
                      {/* Reset Button */}
                      <button
                        onClick={resetAllFilters}
                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                      >
                        Reset
                      </button>
                    </div>
                    
                    {/* Active Filters Display */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>{getActiveFilterText()}</span>
                      </div>
                      {timeFilter !== "all" && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                          <FaClock className="w-3 h-3" />
                          <span>{timeSlots.find(s => s.value === timeFilter)?.label}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <OverviewStats stats={dashboardStats} />

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">Revenue Overview</h4>
                      <span className="text-xs text-gray-400">
                        {filterType === "monthly" ? "Monthly breakdown" : filterType === "yearly" ? "Yearly overview" : "Custom range"}
                      </span>
                    </div>
                    <RevenueChart data={monthlyRevenue} filterType={filterType} />
                  </div>
                  <RecentBookings bookings={recentBookings} />
                </div>

                {/* Revenue Breakdown Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Revenue Breakdown Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">Revenue Breakdown</h4>
                      <FaRupeeSign className="text-green-500 w-5 h-5" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <FaBookOpen className="text-purple-500 w-4 h-4" />
                          <span className="text-gray-600">Course Revenue</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-800">
                            ₹{(dashboardStats?.courseRevenue || 0).toLocaleString()}
                          </span>
                          <p className="text-xs text-gray-400">
                            {dashboardStats?.totalCourseEnrollments || 0} enrollments
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <FaMagic className="text-blue-500 w-4 h-4" />
                          <span className="text-gray-600">Service Revenue</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-800">
                            ₹{(dashboardStats?.serviceRevenue || 0).toLocaleString()}
                          </span>
                          <p className="text-xs text-gray-400">
                            {dashboardStats?.totalServiceBookings || 0} bookings
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-gray-800">Total Revenue</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-green-600">
                            ₹{(dashboardStats?.totalRevenue || 0).toLocaleString()}
                          </span>
                          <p className="text-xs text-gray-400">From successful payments</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">Payment Summary</h4>
                      <HiOutlineClock className="text-blue-500 w-5 h-5" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Successful Payments</span>
                        <span className="font-semibold text-green-600">
                          {dashboardStats?.totalBookings || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pending Payments</span>
                        <span className="font-semibold text-yellow-600">
                          {dashboardStats?.pendingBookings || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Completed</span>
                        <span className="font-semibold text-blue-600">
                          {dashboardStats?.completedBookings || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-gray-600">Conversion Rate</span>
                        <span className="font-semibold text-purple-600">
                          {dashboardStats?.totalBookings > 0 
                            ? Math.round(((dashboardStats?.completedBookings || 0) / dashboardStats?.totalBookings) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <h4 className="font-semibold text-gray-800 mb-3">Popular Services</h4>
                    {dashboardStats?.popularServices?.length > 0 ? (
                      <div className="space-y-3">
                        {dashboardStats.popularServices.slice(0, 3).map((service, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-gray-700">{service._id}</span>
                            <span className="font-semibold text-purple-600">{service.count} bookings</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No data available</p>
                    )}
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <h4 className="font-semibold text-gray-800 mb-3">Stock Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Low Stock Items</span>
                        <span className="font-semibold text-orange-600">{dashboardStats?.lowStockProducts || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Out of Stock</span>
                        <span className="font-semibold text-red-600">{dashboardStats?.outOfStockProducts || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Sold</span>
                        <span className="font-semibold text-green-600">{dashboardStats?.totalProductSales || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                    <h4 className="font-semibold text-gray-800 mb-3">Session Requests</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Requests</span>
                        <span className="font-semibold text-blue-600">{dashboardStats?.sessionRequests || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Pending</span>
                        <span className="font-semibold text-yellow-600">{dashboardStats?.pendingSessions || 0}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-200">
                        <span className="text-gray-700">Completed Sessions</span>
                        <span className="font-semibold text-green-600">{dashboardStats?.completedSessions || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Products Tab */}
            {tab === "products" && (
              <motion.section
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Products & Inventory</h3>
                    {productStats && (
                      <p className="text-sm text-gray-500 mt-1">
                        Total: {productStats.totalProducts} | Low Stock: {productStats.lowStock} | Out of Stock: {productStats.outOfStock}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setShowProductModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition"
                  >
                    <span>+</span> Add Product
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <ProductsTable
                    products={products}
                    searchQuery={searchQuery}
                    onEdit={(product) => {
                      setEditingProduct(product);
                      setShowProductModal(true);
                    }}
                    onDelete={handleDeleteProduct}
                  />
                )}
              </motion.section>
            )}
            
            {/* Orders Tab */}
            {tab === "orders" && (
              <motion.section
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Order Management</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage and track customer orders</p>
                </div>

                {orderStats && orderStats.totalOrders !== undefined && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-600">{orderStats.totalOrders || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{orderStats.pendingOrders || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <p className="text-sm text-gray-600">Delivered</p>
                      <p className="text-2xl font-bold text-green-600">{orderStats.deliveredOrders || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-purple-600">₹{(orderStats.totalRevenue || 0).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <OrdersTable 
                    orders={orders}
                    onUpdateStatus={handleUpdateOrderStatus}
                    onDelete={handleDeleteOrder}
                  />
                )}
              </motion.section>
            )}
            
            {/* Bookings Tab */}
            {tab === "bookings" && (
              <BookingsTable 
                bookings={bookingsData}
                loading={bookingsLoading}
                onUpdateStatus={async (id, status) => {
                  try {
                    await axios.put(`${API_URL}/servicebookings/${id}/status`, { status });
                    toast.success('Booking status updated');
                    fetchBookings();
                  } catch (error) {
                    toast.error('Failed to update status');
                    console.log(error);
                  }
                }}
                onDelete={async (id) => {
                  if (window.confirm('Delete this booking?')) {
                    try {
                      await axios.delete(`${API_URL}/servicebookings/${id}`);
                      toast.success('Booking deleted');
                      fetchBookings();
                    } catch (error) {
                      toast.error('Failed to delete');
                      console.log(error);
                    }
                  }
                }}
              />
            )}
            
            {/* Content Tab */}
            {tab === "content" && <SocialContentManager />}
            
            {/* Hero Slider Tab */}
            {tab === "slider" && <HeroSlide />}

            {/* plan management */}
            {tab === "plan" && <PlanManagement />} 

            {/* Expert Tab */}
            {tab === "expert" && <AdminExperts />}
            
            {/* Course Tab */}
            {tab === "course" && <AddCourse />}
            {/* rashi tab */}
            {tab === "rashi" && <RashiFalManager />}
            {/* Blog Tab */}
            {tab === "blog" && <BlogManager />}
            
            {/* Coupons Tab */}
            {tab === "coupons" && <CouponManager />}
            
            {/* Users Tab */}
            {tab === "users" && <Users />}
            
            {/* Services Tab */}
            {tab === "services" && <AddServices />}
            
            {tab === "classes" && <Classes />}

            {/* Reports Tab */}
            {tab === "reports" && <Reports />}
          </AnimatePresence>
        </main>
      </div>

      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        editingProduct={editingProduct}
        onCreate={handleCreateProduct}
        onUpdate={handleUpdateProduct}
      />
    </div>
  );
}