// PlanManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiPlus, HiPencil, HiTrash, HiX, HiCheck, 
  HiOutlineSparkles, HiOutlineUsers 
} from 'react-icons/hi';
import { FaStar, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: 'Starter',
    mrpPrice: '',
    sellingPrice: '',
    duration: '',
    durationDays: 30,
    features: [],
    isPopular: false,
    sessionsIncluded: 0,
    description: '',
    status: 'active'
  });
  const [featureInput, setFeatureInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${API_URL}/plans/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      toast.error('Failed to fetch plans');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.features.length === 0) {
      toast.error('Please add at least one feature');
      return;
    }
    
    if (!formData.mrpPrice || !formData.sellingPrice || !formData.duration) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (parseFloat(formData.sellingPrice) > parseFloat(formData.mrpPrice)) {
      toast.error('Selling price cannot be greater than MRP');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const token = sessionStorage.getItem('token');
      let response;

      const submitData = {
        ...formData,
        mrpPrice: Number(formData.mrpPrice),
        sellingPrice: Number(formData.sellingPrice),
        durationDays: Number(formData.durationDays),
        sessionsIncluded: Number(formData.sessionsIncluded)
      };

      if (editingPlan) {
        response = await axios.put(
          `${API_URL}/plans/${editingPlan._id}`,
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Plan updated successfully!');
        }
      } else {
        response = await axios.post(
          `${API_URL}/plans`,
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Plan created successfully!');
        }
      }

      fetchPlans();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (planId) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`${API_URL}/plans/${planId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Plan deleted successfully');
      fetchPlans();
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete plan');
      console.log(error);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        mrpPrice: plan.mrpPrice,
        sellingPrice: plan.sellingPrice,
        duration: plan.duration,
        durationDays: plan.durationDays || 30,
        features: plan.features || [],
        isPopular: plan.isPopular || false,
        sessionsIncluded: plan.sessionsIncluded || 0,
        description: plan.description || '',
        status: plan.status || 'active'
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: 'Starter',
        mrpPrice: '',
        sellingPrice: '',
        duration: '',
        durationDays: 30,
        features: [],
        isPopular: false,
        sessionsIncluded: 0,
        description: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFeatureInput('');
  };

  const getPlanColor = (planName) => {
    switch(planName) {
      case 'Starter': return 'from-gray-500 to-gray-600';
      case 'Premium': return 'from-orange-500 to-red-600';
      case 'Elite': return 'from-purple-500 to-indigo-600';
      default: return 'from-blue-500 to-cyan-600';
    }
  };

  const calculateDiscount = (mrp, selling) => {
    if (!mrp || !selling) return 0;
    const discount = ((mrp - selling) / mrp) * 100;
    return Math.round(discount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <HiOutlineSparkles className="text-red-500" />
                Plan Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your subscription plans with MRP & Selling Price</p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <HiPlus size={20} />
              Add New Plan
            </button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {plans.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="text-gray-400 mb-4">
              <HiOutlineUsers className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600">No Plans Found</h3>
            <p className="text-gray-500 mt-2">Click "Add New Plan" to create your first plan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const discountPercent = calculateDiscount(plan.mrpPrice, plan.sellingPrice);
              return (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative"
                >
                  <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${
                    plan.isPopular ? 'border-red-400' : 'border-transparent'
                  } hover:shadow-2xl transition-all duration-300`}>
                    
                    {/* Popular Badge */}
                    {plan.isPopular && (
                      <div className="absolute top-0 right-0 z-10">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl flex items-center gap-1">
                          <FaStar className="w-3 h-3" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        plan.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {plan.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Plan Header */}
                    <div className={`bg-gradient-to-r ${getPlanColor(plan.name)} p-6 text-white`}>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <div className="mt-3">
                        <span className="text-4xl font-bold">₹{plan.sellingPrice.toLocaleString()}</span>
                        <span className="text-sm opacity-90">/{plan.duration}</span>
                      </div>
                      {discountPercent > 0 && (
                        <div className="mt-2">
                          <span className="text-sm line-through opacity-70">₹{plan.mrpPrice.toLocaleString()}</span>
                          <span className="text-sm ml-2 bg-green-500 px-2 py-0.5 rounded-full">
                            Save {discountPercent}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Plan Details */}
                    <div className="p-6">
                      {/* Description */}
                      {plan.description && (
                        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                      )}
                      
                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-700 mb-3">Features:</h4>
                        <ul className="space-y-2">
                          {plan.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <FaCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {plan.features.length > 4 && (
                            <li className="text-sm text-gray-500 ml-6">
                              +{plan.features.length - 4} more features
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Additional Info */}
                      <div className="border-t border-gray-200 pt-4 mb-6 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Duration Days:</span>
                          <span className="font-semibold">{plan.durationDays} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Sessions Included:</span>
                          <span className="font-semibold">{plan.sessionsIncluded || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Created:</span>
                          <span className="font-semibold">
                            {new Date(plan.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => openModal(plan)}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition"
                        >
                          <HiPencil size={18} />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(plan)}
                          className="flex-1 bg-red-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition"
                        >
                          <HiTrash size={18} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <HiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Plan Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Plan Name *
                  </label>
                  <select
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="Starter">Starter</option>
                    <option value="Premium">Premium</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* MRP Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      MRP Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.mrpPrice}
                      onChange={(e) => setFormData({ ...formData, mrpPrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      min="0"
                      step="1"
                      placeholder="Original price"
                    />
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      min="0"
                      step="1"
                      placeholder="Discounted price"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 1 month, 90-min session"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Duration Days */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Sessions Included */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sessions Included
                    </label>
                    <input
                      type="number"
                      value={formData.sessionsIncluded}
                      onChange={(e) => setFormData({ ...formData, sessionsIncluded: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Popular Plan Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                  />
                  <label htmlFor="isPopular" className="text-sm font-semibold text-gray-700">
                    Mark as Most Popular
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Brief description of the plan..."
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Features * ({formData.features.length} added)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                      placeholder="Enter a feature"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                    {formData.features.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center">No features added yet</p>
                    ) : (
                      formData.features.map((feature, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                          <span className="text-sm text-gray-700">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <HiX size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || formData.features.length === 0}
                    className="flex-1 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {editingPlan ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <HiCheck size={18} />
                        {editingPlan ? 'Update Plan' : 'Create Plan'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiTrash className="text-red-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Plan</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <strong>{deleteConfirm.name}</strong> plan? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm._id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
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

export default PlanManagement;