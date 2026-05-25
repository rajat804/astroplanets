import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaRupeeSign, FaBookOpen, FaMagic } from "react-icons/fa";
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
// import ClassesManager from "./components/ClassesManager";

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

  // Products State
  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Bookings State
  const [bookingsData, setBookingsData] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      console.log("Fetching dashboard data...");
      
      // Fetch stats
      const statsRes = await axios.get(`${API_URL}/admindashboard/overview-stats`);
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
        const serviceBookings = confirmedBookingsRes.data.bookings.map(booking => ({
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
        const courseBookings = coursePaymentsRes.data.users.map(payment => ({
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

  // Product Functions
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data.products || []);
      
      const statsResponse = await axios.get(`${API_URL}/products/stats/admin`);
      setProductStats(statsResponse.data.stats);
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
    toast.success('Logged out successfully');
    nav("/admin/login");
  };

  useEffect(() => {
    fetchDashboardData();
    fetchProducts();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (tab === 'bookings') {
      fetchBookings();
    }
    if (tab === 'overview') {
      fetchDashboardData();
    }
  }, [tab]);

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
                <OverviewStats stats={dashboardStats} />

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">Revenue Overview</h4>
                      <span className="text-xs text-gray-400">Last 12 months</span>
                    </div>
                    <RevenueChart data={monthlyRevenue} />
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
            
            {/* Blog Tab */}
            {tab === "blog" && <BlogManager />}
            
            {/* Coupons Tab */}
            {tab === "coupons" && <CouponManager />}
            
            {/* Users Tab */}
            {tab === "users" && <Users />}
            
            {/* Services Tab */}
            {tab === "services" && <AddServices />}
            
            {/* Classes Tab */}
            {tab === "classes" && <ClassesManager />}

            {/* Reports Tab */}
            {tab === "reports" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-orange-100 p-12 text-center"
              >
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Reports Coming Soon</h3>
                <p className="text-gray-500">Advanced analytics and reporting features are under development.</p>
              </motion.div>
            )}
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