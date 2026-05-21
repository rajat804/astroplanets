import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlinePlus, 
  HiOutlinePencilAlt, 
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineTicket,
  HiOutlineCalendar,
  HiOutlineCurrencyRupee,
  HiOutlineUsers,
  HiOutlineCheck,
} from 'react-icons/hi';
import { 
  getAllCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon,
  toggleCouponStatus 
} from '../../services/api';
import toast from 'react-hot-toast';

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    perUserLimit: 1,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getAllCoupons();
      setCoupons(data.coupons);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description || '',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount || '',
        startDate: coupon.startDate.split('T')[0],
        endDate: coupon.endDate.split('T')[0],
        usageLimit: coupon.usageLimit || '',
        perUserLimit: coupon.perUserLimit,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        startDate: '',
        endDate: '',
        usageLimit: '',
        perUserLimit: 1,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code || !formData.discountValue || !formData.startDate || !formData.endDate) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const couponData = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : 0,
      maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      perUserLimit: Number(formData.perUserLimit),
    };
    
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon._id, couponData);
        toast.success('Coupon updated successfully');
      } else {
        await createCoupon(couponData);
        toast.success('Coupon created successfully');
      }
      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error(error.response?.data?.msg || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await deleteCoupon(id);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleCouponStatus(id);
      toast.success('Coupon status updated');
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (coupon) => {
    const now = new Date();
    const endDate = new Date(coupon.endDate);
    const startDate = new Date(coupon.startDate);
    
    if (!coupon.isActive) return 'bg-gray-100 text-gray-500';
    if (endDate < now) return 'bg-red-100 text-red-700';
    if (startDate > now) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (coupon) => {
    const now = new Date();
    const endDate = new Date(coupon.endDate);
    const startDate = new Date(coupon.startDate);
    
    if (!coupon.isActive) return 'Inactive';
    if (endDate < now) return 'Expired';
    if (startDate > now) return 'Upcoming';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Coupon Management</h3>
          <p className="text-sm text-gray-500 mt-1">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Coupon
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <HiOutlineTicket className="w-4 h-4" />
              <p className="text-sm">Total Coupons</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <HiOutlineCheck className="w-4 h-4 text-green-600" />
              <p className="text-sm">Active</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <HiOutlineX className="w-4 h-4 text-red-600" />
              <p className="text-sm">Expired</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <HiOutlineUsers className="w-4 h-4" />
              <p className="text-sm">Total Used</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.totalUsed?.[0]?.total || 0}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Min Order</th>
                <th className="px-6 py-4">Valid Period</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No coupons found. Click "Add Coupon" to create your first coupon.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-orange-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-gray-800">{coupon.code}</div>
                      {coupon.description && (
                        <div className="text-xs text-gray-500">{coupon.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-red-600">
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue}% OFF` 
                          : `₹${coupon.discountValue} OFF`}
                      </div>
                      {coupon.maxDiscountAmount && (
                        <div className="text-xs text-gray-500">
                          Max ₹{coupon.maxDiscountAmount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : 'No minimum'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>{new Date(coupon.startDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">to</div>
                      <div>{new Date(coupon.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {coupon.usageLimit ? `${coupon.usedCount}/${coupon.usageLimit}` : `${coupon.usedCount} used`}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(coupon._id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon)}`}
                      >
                        {getStatusText(coupon)}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(coupon)}
                          className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
                        >
                          <HiOutlinePencilAlt className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2">
                <h4 className="text-xl font-bold text-gray-800">
                  {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                </h4>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="WELCOME10"
                    className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="2"
                    placeholder="Brief description of this coupon"
                    className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.discountType === 'percentage' ? 'Discount % *' : 'Discount Amount *'}
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                      className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount</label>
                    <input
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                      placeholder="Unlimited"
                      className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      placeholder="Unlimited"
                      className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Per User Limit</label>
                    <input
                      type="number"
                      value={formData.perUserLimit}
                      onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                      min="1"
                      className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-orange-200 rounded-xl text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-md"
                  >
                    {editingCoupon ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponManager;