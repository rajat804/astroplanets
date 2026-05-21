// src/pages/admin/AdminServices.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineFilter } from "react-icons/hi";
import ServiceTable from "../components/ServiceTable";
import ServiceFormModal from "../components/ServiceFormModal";
import toast, { Toaster } from "react-hot-toast";

const AddServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/services/admin/all`);
      setServices(response.data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (serviceData) => {
    try {
      const response = await axios.post(`${API_URL}/services`, serviceData);
      if (response.data.success) {
        toast.success("Service created successfully!");
        fetchServices();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Create error:", error);
      toast.error(error.response?.data?.message || "Failed to create service");
    }
  };

  const handleUpdate = async (id, serviceData) => {
    try {
      const response = await axios.put(`${API_URL}/services/${id}`, serviceData);
      if (response.data.success) {
        toast.success("Service updated successfully!");
        fetchServices();
        setIsModalOpen(false);
        setEditingService(null);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update service");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await axios.delete(`${API_URL}/services/${id}`);
        if (response.data.success) {
          toast.success("Service deleted successfully!");
          fetchServices();
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete service");
      }
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      const updatedService = { ...service, isActive: !service.isActive };
      const response = await axios.put(`${API_URL}/services/${service._id}`, updatedService);
      if (response.data.success) {
        toast.success(`Service ${service.isActive ? "deactivated" : "activated"} successfully!`);
        fetchServices();
      }
    } catch (error) {
      console.error("Status toggle error:", error);
      toast.error("Failed to update service status");
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const getFilteredServices = () => {
    let filtered = services;

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(service =>
        filterStatus === "active" ? service.isActive : !service.isActive
      );
    }

    return filtered;
  };

  const stats = {
    total: services.length,
    active: services.filter(s => s.isActive).length,
    inactive: services.filter(s => !s.isActive).length,
    featured: services.filter(s => s.featured).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Service Management
            </h1>
            <p className="text-gray-500 mt-1">Manage your spiritual and astrological services</p>
          </div>

          <button
            onClick={() => {
              setEditingService(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add New Service
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Services</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-100">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-500">Active Services</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-red-100">
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            <p className="text-sm text-gray-500">Inactive Services</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-yellow-100">
            <p className="text-2xl font-bold text-yellow-600">{stats.featured}</p>
            <p className="text-sm text-gray-500">Featured Services</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All Services
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

        {/* Services Table */}
        <ServiceTable
          services={getFilteredServices()}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />

        {/* Service Form Modal */}
        <ServiceFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingService(null);
          }}
          editingService={editingService}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
};

export default AddServices;