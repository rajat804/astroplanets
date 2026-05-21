import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AdminRoute from "./AdminRoute";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import OverviewStats from "./components/OverviewStats";
import RevenueChart from "./components/RevenueChart";
import RecentBookings from "./components/RecentBookings";
import ProductsTable from "./components/ProductsTable";
import ProductFormModal from "./components/ProductFormModal";
import BookingsTable from "./components/BookingsTable";
import BookingStatsCards from "./components/BookingStatsCards";
import OrdersTable from "./components/OrdersTable";
import OrderStatsCards from "./components/OrderStatsCards";
import SocialContentManager from "./components/SocialContentManager";
import BlogManager from "./components/BlogManager";
import CouponManager from "./components/CouponManager";
import HeroSlide from "./components/HeroSlider";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} from "../services/api";
import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  // getBookingStats
} from "../services/api";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  // getOrderStats
} from "../services/api";
import AddCourse from "./components/AddCourse";
import Users from "./components/Users";
import AddServices from "./components/AddServices";
import AdminExperts from "./components/AdminExperts";

function useCount(to = 0, duration = 1200) {
  const [num, setNum] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const loop = (now) => {
      const prog = Math.min((now - start) / duration, 1);
      setNum(Math.round(prog * to));
      if (prog < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return num;
}

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

  // Products State
  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Bookings State
  const [bookingsData, setBookingsData] = useState([]);
  const [bookingStats, setBookingStats] = useState(null);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Services, Classes & Users State (will be fetched from API later)
  const [services, setServices] = useState([]);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchProductStats();
    fetchBookings();
    fetchOrders();
    fetchUsers();
    fetchServices();
    fetchClasses();
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (tab === 'bookings') {
      fetchBookings();
    }
    if (tab === 'orders') {
      fetchOrders();
    }
    if (tab === 'users') {
      fetchUsers();
    }
    if (tab === 'services') {
      fetchServices();
    }
    if (tab === 'classes') {
      fetchClasses();
    }
  }, [tab]);

  // Product Functions
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductStats = async () => {
    try {
      const stats = await getProductStats();
      setProductStats(stats);
    } catch (error) {
      console.error('Error fetching product stats:', error);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      const result = await createProduct(productData);
      setProducts([result.product, ...products]);
      toast.success('Product created successfully');
      setShowProductModal(false);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.msg || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      const result = await updateProduct(id, productData);
      setProducts(products.map(p => p._id === id ? result.product : p));
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
      await deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.msg || 'Failed to delete product');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  // Booking Functions
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const data = await getAllBookings();
      setBookingsData(data.bookings || []);
      setBookingStats(data.stats);

      // Update notifications for new bookings
      const newBookings = data.bookings?.filter(b => b.bookingStatus === 'pending') || [];
      if (newBookings.length > 0) {
        setNotifications(prev => [
          ...prev,
          { id: Date.now(), message: `${newBookings.length} new pending bookings`, time: 'Just now', read: false }
        ]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      await deleteBooking(bookingId);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  // Order Functions
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data.orders || []);
      setOrderStats(data.stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await deleteOrder(orderId);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  // User Functions (placeholder - will be implemented with actual API)
  const fetchUsers = async () => {
    try {
      // TODO: Implement getUsers API call
      // const data = await getUsers();
      // setUsers(data);
      setUsers([]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Services Functions (placeholder - will be implemented with actual API)
  const fetchServices = async () => {
    try {
      // TODO: Implement getServices API call
      // const data = await getServices();
      // setServices(data);
      setServices([]);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Classes Functions (placeholder - will be implemented with actual API)
  const fetchClasses = async () => {
    try {
      // TODO: Implement getClasses API call
      // const data = await getClasses();
      // setClasses(data);
      setClasses([]);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // Calculate totals for overview
  const totalRevenue = products.reduce((s, p) => s + (p.price * p.sold || 0), 0) +
    bookingsData.reduce((s, b) => s + (b.bookingStatus === "completed" ? b.amount : 0), 0);

  const revenueCount = useCount(Math.round(totalRevenue / 1000));
  const usersCount = useCount(users.length);
  const bookingsCount = useCount(bookingsData.length);
  const productsCount = useCount(products.length);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("admin");
    toast.success('Logged out successfully');
    nav("/admin/login");
  };

  // Prepare recent bookings for overview widget
  const recentBookingsForWidget = bookingsData.slice(0, 5).map(booking => ({
    id: booking._id,
    user: booking.customerName,
    service: booking.serviceType,
    date: new Date(booking.bookingDate).toLocaleDateString(),
    status: booking.bookingStatus === 'completed' ? 'Completed' : 'Booked',
    amount: booking.amount
  }));

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
                <OverviewStats
                  revenueCount={revenueCount}
                  usersCount={usersCount}
                  bookingsCount={bookingsCount}
                  productsCount={productsCount}
                />

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
                    <h4 className="font-semibold text-gray-800 mb-4">Revenue Overview</h4>
                    <RevenueChart />
                  </div>
                  <RecentBookings bookings={recentBookingsForWidget} />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-orange-100">
                    <h4 className="font-semibold text-gray-800 mb-3">Top Product</h4>
                    <div className="text-2xl font-bold text-red-600">
                      {productStats?.topProducts?.[0]?.name || 'No data'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {productStats?.topProducts?.[0]?.sold || 0} units sold
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-orange-100">
                    <h4 className="font-semibold text-gray-800 mb-3">Popular Service</h4>
                    <div className="text-2xl font-bold text-red-600">
                      {bookingStats?.mostPopularService || 'No data'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Highest bookings</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-orange-100">
                    <h4 className="font-semibold text-gray-800 mb-3">Active Users</h4>
                    <div className="text-2xl font-bold text-red-600">{users.length}</div>
                    <div className="text-sm text-gray-500 mt-1">Total registered</div>
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
                    onClick={handleAddClick}
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
                    onEdit={handleEditClick}
                    onDelete={handleDeleteProduct}
                  />
                )}
              </motion.section>
            )}

            {/* Bookings Tab */}
            {tab === "bookings" && (
              <motion.section
                key="bookings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Booking Management</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage customer service bookings</p>
                </div>

                <BookingStatsCards stats={bookingStats} />

                {bookingsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <BookingsTable
                    bookings={bookingsData}
                    onUpdateStatus={handleUpdateBookingStatus}
                    onDelete={handleDeleteBooking}
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

                <OrderStatsCards stats={orderStats} />

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

            {/* Content Tab - Social Media Manager */}
            {tab === "content" && (
              <motion.section
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SocialContentManager />
              </motion.section>
            )}
            {/* Hero Slider Tab */}
            {tab === "slider" && (
              <motion.section
                key="slider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HeroSlide />
              </motion.section>
            )}

            {/* expert tab */}
            {tab === "expert" && (
              <motion.section
                key="slider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AdminExperts />
              </motion.section>
            )}

            {/* course add */}
            {tab === "course" && (
              <motion.section
                key="course"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AddCourse />
              </motion.section>
            )}
            {/* Blog Tab */}
            {tab === "blog" && (
              <motion.section
                key="blog"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <BlogManager />
              </motion.section>
            )}

            {/* Coupons Tab */}
            {tab === "coupons" && (
              <motion.section
                key="coupons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CouponManager />
              </motion.section>
            )}

            {/* Users Tab */}
            {tab === "users" && (
              <motion.section
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Users />
              </motion.section>
            )}

            {/* Services Tab */}
            {tab === "services" && (
              <AddServices />
            )}

            {/* Classes Tab */}
            {tab === "classes" && (
              <motion.section
                key="classes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-orange-50">
                        <tr className="text-left text-sm text-gray-600">
                          <th className="px-6 py-4">Class</th>
                          <th className="px-6 py-4">Seats</th>
                          <th className="px-6 py-4">Enrolled</th>
                          <th className="px-6 py-4">Available</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classes.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                              No classes found
                            </td>
                          </tr>
                        ) : (
                          classes.map((c) => (
                            <tr key={c._id} className="hover:bg-orange-50 transition border-b border-orange-100">
                              <td className="px-6 py-4 font-medium text-gray-800">{c.title}</td>
                              <td className="px-6 py-4 text-gray-600">{c.seats}</td>
                              <td className="px-6 py-4 text-gray-600">{c.enrolled}</td>
                              <td className="px-6 py-4 text-gray-600">{c.seats - c.enrolled}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  {c.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition">
                                    Edit
                                  </button>
                                  <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Reports Tab - Placeholder */}
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