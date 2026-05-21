// src/components/admin/ServiceFormModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { HiOutlineX, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import toast from "react-hot-toast";

const ServiceFormModal = ({ isOpen, onClose, editingService, onCreate, onUpdate }) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    mrpPrice: "",
    image: "",
    icon: "GiCrystalBall",
    iconColor: "text-purple-500",
    gradientKey: "purple",
    benefits: [""],
    symbolType: "zodiac",
    isActive: true,
    featured: false,
    order: 0
  });

  const [autoDiscount, setAutoDiscount] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const iconOptions = [
    { value: "GiCrystalBall", label: "Crystal Ball", icon: "🔮" },
    { value: "GiAstrology", label: "Astrology", icon: "✨" },
    { value: "GiPlanetConjunction", label: "Planets", icon: "🪐" },
    { value: "GiSevenPointedStar", label: "Star", icon: "⭐" },
    { value: "GiSunbeams", label: "Sunbeams", icon: "☀️" },
  ];

  const iconColorOptions = [
    { value: "text-purple-500", label: "Purple" },
    { value: "text-blue-500", label: "Blue" },
    { value: "text-green-500", label: "Green" },
    { value: "text-orange-500", label: "Orange" },
    { value: "text-red-500", label: "Red" },
    { value: "text-indigo-500", label: "Indigo" },
    { value: "text-teal-500", label: "Teal" },
    { value: "text-yellow-500", label: "Yellow" },
  ];

  const gradientOptions = [
    { value: "purple", label: "Purple/Pink", gradient: "from-purple-500/10 to-pink-500/10" },
    { value: "blue", label: "Blue/Cyan", gradient: "from-blue-500/10 to-cyan-500/10" },
    { value: "green", label: "Green/Emerald", gradient: "from-green-500/10 to-emerald-500/10" },
    { value: "orange", label: "Orange/Amber", gradient: "from-orange-500/10 to-amber-500/10" },
    { value: "red", label: "Red/Rose", gradient: "from-red-500/10 to-rose-500/10" },
    { value: "indigo", label: "Indigo/Purple", gradient: "from-indigo-500/10 to-purple-500/10" },
    { value: "teal", label: "Teal/Cyan", gradient: "from-teal-500/10 to-cyan-500/10" },
    { value: "yellow", label: "Yellow/Orange", gradient: "from-yellow-500/10 to-orange-500/10" },
  ];

  const symbolTypeOptions = [
    { value: "zodiac", label: "Zodiac Signs" },
    { value: "planets", label: "Planets" },
    { value: "numbers", label: "Numbers" },
    { value: "directions", label: "Directions" },
    { value: "elements", label: "Elements" },
    { value: "none", label: "None" },
  ];

  // Calculate discount automatically when mrpPrice or price changes
  useEffect(() => {
    const calculateDiscount = () => {
      const mrp = parseFloat(formData.mrpPrice?.replace(/[^0-9.-]+/g, "") || 0);
      const sellingPrice = parseFloat(formData.price?.replace(/[^0-9.-]+/g, "") || 0);
      
      if (mrp > 0 && sellingPrice > 0 && mrp > sellingPrice) {
        const discountPercent = Math.round(((mrp - sellingPrice) / mrp) * 100);
        setAutoDiscount(discountPercent);
      } else {
        setAutoDiscount(0);
      }
    };
    
    calculateDiscount();
  }, [formData.mrpPrice, formData.price]);

  useEffect(() => {
    if (editingService) {
      setFormData({
        title: editingService.title || "",
        description: editingService.description || "",
        duration: editingService.duration || "",
        price: editingService.price || "",
        mrpPrice: editingService.mrpPrice || "",
        image: editingService.image || "",
        icon: editingService.icon || "GiCrystalBall",
        iconColor: editingService.iconColor || "text-purple-500",
        gradientKey: editingService.gradientKey || "purple",
        benefits: editingService.benefits?.length ? editingService.benefits : [""],
        symbolType: editingService.symbolType || "zodiac",
        isActive: editingService.isActive !== undefined ? editingService.isActive : true,
        featured: editingService.featured || false,
        order: editingService.order || 0,
      });
      setImagePreview(editingService.image || "");
    } else {
      setFormData({
        title: "",
        description: "",
        duration: "",
        price: "",
        mrpPrice: "",
        image: "",
        icon: "GiCrystalBall",
        iconColor: "text-purple-500",
        gradientKey: "purple",
        benefits: [""],
        symbolType: "zodiac",
        isActive: true,
        featured: false,
        order: 0,
      });
      setImagePreview("");
    }
    setImageFile(null);
  }, [editingService]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleArrayItemChange = (arrayName, index, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addArrayItem = (arrayName) => {
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], ""],
    });
  };

  const removeArrayItem = (arrayName, index) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, image: "" });
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      let imageUrl = formData.image;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const response = await axios.post(`${API_URL}/services/upload`, imageFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        if (response.data.success) {
          imageUrl = response.data.imageUrl;
        } else {
          toast.error("Image upload failed");
          setUploading(false);
          return;
        }
      }

      if (!formData.title || !formData.price || !imageUrl || !formData.description) {
        toast.error("Please fill all required fields (Title, Price, Image, Description)");
        setUploading(false);
        return;
      }

      const cleanedData = {
        ...formData,
        image: imageUrl,
        discount: autoDiscount,
        benefits: formData.benefits.filter((item) => item && item.trim() !== ""),
      };

      if (cleanedData.benefits.length === 0) {
        cleanedData.benefits = ["Professional Consultation", "Detailed Analysis"];
      }

      if (editingService) {
        if (typeof onUpdate === 'function') {
          await onUpdate(editingService._id, cleanedData);
        } else {
          console.error("onUpdate is not a function");
          toast.error("Update function not available");
        }
      } else {
        if (typeof onCreate === 'function') {
          await onCreate(cleanedData);
        } else {
          console.error("onCreate is not a function");
          toast.error("Create function not available");
        }
      }

      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 z-10">
          <h4 className="text-xl font-bold text-gray-800">
            {editingService ? "Edit Service" : "Add New Service"}
          </h4>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., One-on-one Natal Chart Reading"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Detailed description of the service..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 60 min"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symbol Type</label>
                <select
                  name="symbolType"
                  value={formData.symbolType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                >
                  {symbolTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing with Auto Discount */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MRP Price</label>
                <input
                  name="mrpPrice"
                  value={formData.mrpPrice}
                  onChange={handleChange}
                  placeholder="₹49,999"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
                <p className="text-xs text-gray-400 mt-1">Original price before discount</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="₹24,999"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
                <p className="text-xs text-gray-400 mt-1">Final price after discount</p>
              </div>
            </div>
            
            {/* Auto Discount Display */}
            {autoDiscount > 0 && (
              <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Auto Discount Applied:</span>
                  <span className="text-lg font-bold text-green-600">{autoDiscount}% OFF</span>
                </div>
                <div className="mt-1 text-xs text-green-600">
                  You save ₹{(parseFloat(formData.mrpPrice?.replace(/[^0-9.-]+/g, "") || 0) - parseFloat(formData.price?.replace(/[^0-9.-]+/g, "") || 0)).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Visual Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Visual Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                >
                  {iconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Color</label>
                <select
                  name="iconColor"
                  value={formData.iconColor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                >
                  {iconColorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gradient Color</label>
                <select
                  name="gradientKey"
                  value={formData.gradientKey}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                >
                  {gradientOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Service Image
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />
            {(imagePreview || formData.image) && (
              <div className="relative w-40 h-40 mt-4">
                <img
                  src={imagePreview || formData.image}
                  alt="preview"
                  className="w-full h-full object-cover rounded-xl border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition"
                >
                  <HiOutlineX className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Benefits / What You'll Get
            </h3>
            {formData.benefits.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayItemChange("benefits", index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder={`Benefit ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("benefits", index)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("benefits")}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
            >
              <HiOutlinePlus className="w-4 h-4" /> Add Benefit
            </button>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Status
            </h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Active (Visible on website)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={uploading} className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50">
              {uploading ? "Saving..." : (editingService ? "Update Service" : "Create Service")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceFormModal;