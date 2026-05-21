import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineFilter } from "react-icons/hi";
import ExpertTable from "../components/ExpertTable";
import ExpertFormModal from "../components/ExpertFormModal";
import toast, { Toaster } from "react-hot-toast";

const AdminExperts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/experts/admin/all`);
      setExperts(response.data.experts);
    } catch (error) {
      console.error("Error fetching experts:", error);
      toast.error("Failed to load experts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (expertData) => {
    try {
      const response = await axios.post(`${API_URL}/experts`, expertData);
      if (response.data.success) {
        toast.success("Expert created successfully!");
        fetchExperts();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Create error:", error);
      toast.error(error.response?.data?.message || "Failed to create expert");
    }
  };

  const handleUpdate = async (id, expertData) => {
    try {
      const response = await axios.put(`${API_URL}/experts/${id}`, expertData);
      if (response.data.success) {
        toast.success("Expert updated successfully!");
        fetchExperts();
        setIsModalOpen(false);
        setEditingExpert(null);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update expert");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expert?")) {
      try {
        const response = await axios.delete(`${API_URL}/experts/${id}`);
        if (response.data.success) {
          toast.success("Expert deleted successfully!");
          fetchExperts();
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete expert");
      }
    }
  };

  const handleToggleStatus = async (expert) => {
    try {
      const updatedExpert = { ...expert, isActive: !expert.isActive };
      const response = await axios.put(`${API_URL}/experts/${expert._id}`, updatedExpert);
      if (response.data.success) {
        toast.success(`Expert ${expert.isActive ? "deactivated" : "activated"} successfully!`);
        fetchExperts();
      }
    } catch (error) {
      console.error("Status toggle error:", error);
      toast.error("Failed to update expert status");
    }
  };

  const handleEdit = (expert) => {
    setEditingExpert(expert);
    setIsModalOpen(true);
  };

  const getFilteredExperts = () => {
    let filtered = experts;

    if (searchQuery) {
      filtered = filtered.filter(expert =>
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(expert =>
        filterStatus === "active" ? expert.isActive : !expert.isActive
      );
    }

    return filtered;
  };

  const stats = {
    total: experts.length,
    active: experts.filter(e => e.isActive).length,
    inactive: experts.filter(e => !e.isActive).length,
    featured: experts.filter(e => e.featured).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Expert Management
            </h1>
            <p className="text-gray-500 mt-1">Manage your team of spiritual experts and consultants</p>
          </div>

          <button
            onClick={() => {
              setEditingExpert(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add New Expert
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-orange-100">
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Experts</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-100">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-500">Active Experts</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-red-100">
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            <p className="text-sm text-gray-500">Inactive Experts</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-yellow-100">
            <p className="text-2xl font-bold text-yellow-600">{stats.featured}</p>
            <p className="text-sm text-gray-500">Featured Experts</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search experts by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <HiOutlineFilter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Filter</span>
          </button>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      filterStatus === "all"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All Experts
                  </button>
                  <button
                    onClick={() => setFilterStatus("active")}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      filterStatus === "active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Active Only
                  </button>
                  <button
                    onClick={() => setFilterStatus("inactive")}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      filterStatus === "inactive"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Inactive Only
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experts Table */}
        <ExpertTable
          experts={getFilteredExperts()}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />

        {/* Expert Form Modal */}
        <ExpertFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpert(null);
          }}
          editingExpert={editingExpert}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
};

export default AdminExperts;