import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaEye, 
  FaTrash, 
  FaRupeeSign,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBox,
  FaTimes,
  FaShoppingBag,
  FaCreditCard,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFilter
} from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import toast from "react-hot-toast";

const OrdersTable = ({ orders = [], onUpdateStatus, onDelete }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Order status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: FaCheckCircle },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800', icon: FaBox },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: FaTruck },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: FaTimes }
  ];

  // Payment status options
  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'success', label: 'Success', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
    { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
  ];

  const getStatusColor = (status) => {
    const option = statusOptions.find(s => s.value === status);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const option = paymentStatusOptions.find(s => s.value === status);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const option = statusOptions.find(s => s.value === status);
    return option ? option.icon : FaClock;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return amount.toLocaleString('en-IN');
  };

  // Get filtered orders based on status, payment, and search
  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by order status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Filter by payment status
    if (paymentFilter !== "all") {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }

    // Search filter
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order => {
        const orderId = order.orderId || order._id || '';
        const customerName = order.shippingAddress?.fullName || order.user?.fullName || '';
        const email = order.shippingAddress?.email || order.user?.email || '';
        const phone = order.shippingAddress?.phone || order.user?.phone || '';
        
        return orderId.toLowerCase().includes(search) ||
               customerName.toLowerCase().includes(search) ||
               email.toLowerCase().includes(search) ||
               phone.includes(search);
      });
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Get status options based on payment status
  const getAvailableStatusOptions = (order) => {
    const baseOptions = [
      { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
      { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
      { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
      { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
      { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
    ];

    // If payment is not success, only allow pending and cancelled
    if (order.paymentStatus !== 'success') {
      return baseOptions.filter(opt => opt.value === 'pending' || opt.value === 'cancelled');
    }

    return baseOptions;
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    // Get order for validation
    const order = orders.find(o => o._id === orderId);
    if (!order) return;

    // Check if payment is success
    if (order.paymentStatus !== 'success') {
      toast.error(`❌ Cannot update status. Payment is ${order.paymentStatus}. Please complete payment first.`);
      return;
    }

    console.log('📤 Changing order status:', { orderId, newStatus });
    
    const confirmMessage = `Are you sure you want to change order status to "${newStatus.toUpperCase()}"?`;
    if (!window.confirm(confirmMessage)) return;
    
    setUpdatingId(orderId);
    try {
      await onUpdateStatus(orderId, newStatus);
    } catch (error) {
      console.error('❌ Status update error:', error);
      toast.error(error.response?.data?.msg || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    await onDelete(orderId);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  // Get filter counts
  const getFilterCounts = () => {
    const counts = {
      all: orders.length,
      pending: orders.filter(o => o.orderStatus === 'pending').length,
      confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
      processing: orders.filter(o => o.orderStatus === 'processing').length,
      shipped: orders.filter(o => o.orderStatus === 'shipped').length,
      delivered: orders.filter(o => o.orderStatus === 'delivered').length,
      cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
    };
    return counts;
  };

  const filterCounts = getFilterCounts();

  // If no orders
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <FaBox className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h4 className="text-lg font-semibold text-gray-600 mb-2">No Orders Found</h4>
        <p className="text-gray-400">Orders will appear here once customers place them</p>
      </div>
    );
  }

  return (
    <>
      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 w-4 h-4" />
            <span className="font-medium text-gray-700">Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="all">All Status ({filterCounts.all})</option>
            <option value="pending">Pending ({filterCounts.pending})</option>
            <option value="confirmed">Confirmed ({filterCounts.confirmed})</option>
            <option value="processing">Processing ({filterCounts.processing})</option>
            <option value="shipped">Shipped ({filterCounts.shipped})</option>
            <option value="delivered">Delivered ({filterCounts.delivered})</option>
            <option value="cancelled">Cancelled ({filterCounts.cancelled})</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by order ID, customer, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Clear Filters */}
          {(statusFilter !== "all" || paymentFilter !== "all" || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setPaymentFilter("all");
                setSearchTerm("");
              }}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const isPaymentSuccess = order.paymentStatus === 'success';
                const StatusIcon = getStatusIcon(order.orderStatus);
                
                return (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-gray-50 transition ${
                      !isPaymentSuccess ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-gray-600">
                        #{order.orderId || order._id?.slice(-6)}
                      </span>
                      {!isPaymentSuccess && (
                        <div className="flex items-center gap-1 mt-1">
                          <FaExclamationTriangle className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-500">Payment {order.paymentStatus}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {order.shippingAddress?.fullName || order.user?.fullName || 'Guest User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.shippingAddress?.email || order.user?.email || 'No email'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {order.items?.length || 0} items
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 font-semibold text-gray-800">
                        <FaRupeeSign className="w-3 h-3 text-gray-500" />
                        {formatCurrency(order.totalAmount)}
                      </div>
                      {order.discount > 0 && (
                        <span className="text-xs text-green-600">
                          -{order.discount}% off
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={order.orderStatus || 'pending'}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={updatingId === order._id || !isPaymentSuccess}
                          className={`px-2 py-1 text-xs rounded-full border-0 font-medium cursor-pointer ${getStatusColor(order.orderStatus)} ${
                            updatingId === order._id || !isPaymentSuccess ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {getAvailableStatusOptions(order).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {updatingId === order._id && (
                          <div className="absolute -right-6 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      {!isPaymentSuccess && (
                        <p className="text-[10px] text-red-500 mt-1">
                          ⚠️ Payment required
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Order"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
          <span className="text-sm text-gray-500">
            Total Revenue: ₹{formatCurrency(
              orders
                .filter(o => o.paymentStatus === 'success')
                .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
            )}
          </span>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDetails(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 z-10 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                <p className="text-sm text-gray-500">Order #{selectedOrder.orderId || selectedOrder._id}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                  {selectedOrder.orderStatus || 'pending'}
                </span>
                <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Order Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs text-gray-500">Order Date</p>
                  <p className="text-sm font-semibold text-gray-800">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold text-green-600">₹{formatCurrency(selectedOrder.totalAmount)}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="text-sm font-semibold text-gray-800 capitalize">{selectedOrder.paymentMethod || 'N/A'}</p>
                </div>
                <div className={`rounded-xl p-4 border ${
                  selectedOrder.paymentStatus === 'success' ? 'bg-green-50 border-green-200' :
                  selectedOrder.paymentStatus === 'failed' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <p className="text-xs text-gray-500">Payment Status</p>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus || 'pending'}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaUser className="w-4 h-4 text-blue-500" />
                  Customer Information
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <FaUser className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">
                      {selectedOrder.shippingAddress?.fullName || selectedOrder.user?.fullName || 'Guest User'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedOrder.shippingAddress?.email || selectedOrder.user?.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 capitalize">{selectedOrder.paymentMethod || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MdLocalShipping className="w-4 h-4 text-green-500" />
                    Shipping Address
                  </h4>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-800">{selectedOrder.shippingAddress.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800">{selectedOrder.shippingAddress.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-800">{selectedOrder.shippingAddress.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-800">{selectedOrder.shippingAddress.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">City</p>
                        <p className="text-gray-800">{selectedOrder.shippingAddress.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">State</p>
                        <p className="text-gray-800">{selectedOrder.shippingAddress.state}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pincode</p>
                        <p className="text-gray-800">{selectedOrder.shippingAddress.pincode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Country</p>
                        <p className="text-gray-800">{selectedOrder.shippingAddress.country || 'India'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaShoppingBag className="w-4 h-4 text-purple-500" />
                  Order Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase pb-2 border-b border-gray-200">
                        <div className="col-span-5">Product</div>
                        <div className="col-span-3 text-center">Quantity</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-right">Total</div>
                      </div>
                      {/* Items */}
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-gray-100 last:border-0">
                          <div className="col-span-5 flex items-center gap-3">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                                }}
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                              {item.variation && (
                                <p className="text-xs text-gray-500">{item.variation}</p>
                              )}
                            </div>
                          </div>
                          <div className="col-span-3 text-center">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="col-span-2 text-right font-medium text-gray-700">
                            ₹{formatCurrency(item.price)}
                          </div>
                          <div className="col-span-2 text-right font-semibold text-gray-800">
                            ₹{formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No items in this order</p>
                  )}
                </div>
              </div>

              {/* Order Summary Footer */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-end space-y-2">
                  <div className="w-full md:w-1/2 space-y-2">
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-800">₹{formatCurrency(selectedOrder.originalAmount)}</span>
                      </div>
                    )}
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-₹{formatCurrency(selectedOrder.discount)}</span>
                      </div>
                    )}
                    {selectedOrder.appliedCoupon && (
                      <div className="flex justify-between text-sm text-purple-600">
                        <span>Coupon Applied</span>
                        <span>{selectedOrder.appliedCoupon}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-lg font-semibold text-gray-800">Grand Total</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{formatCurrency(selectedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.notes && (
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-800">Order Notes</p>
                  <p className="text-gray-700">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Close
              </button>
              {selectedOrder.paymentStatus === 'success' && (
                <button
                  onClick={() => {
                    setShowDetails(false);
                    // Scroll to status dropdown in table
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Update Status
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default OrdersTable;