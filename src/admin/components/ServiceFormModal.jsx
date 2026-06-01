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

  // Service Title Options
  const serviceTitleOptions = [
    { value: "palmistry", label: "Palmistry Online Consultation" },
    { value: "vastu", label: "Vastu Online Consultation" },
    { value: "numerology", label: "Numerology Online Consultation" },
    { value: "yoga", label: "Yoga Online Consultation" },
  ];

  // Category Options with descriptions
  const categoryOptions = {
    palmistry: [
      { value: "career_counselling", label: "Career Counselling", description: "Get guidance on career path, job changes, promotions, and professional growth based on your palm lines." },
      { value: "relationship_counselling", label: "Relationship Counselling", description: "Understand relationship dynamics, compatibility, and solutions for love, marriage, and family matters." },
      { value: "all_over_guidance", label: "All Over Guidance", description: "Complete palmistry analysis covering career, relationships, health, wealth, and life predictions." },
    ],
    vastu: [
      { value: "home_vastu_1bhk", label: "Home Vastu (1BHK)", description: "Vastu analysis and remedies for 1BHK apartments/homes to enhance positive energy flow." },
      { value: "home_vastu_2bhk", label: "Home Vastu (2BHK)", description: "Complete Vastu consultation for 2BHK homes including room placements, directions, and remedies." },
      { value: "home_vastu_other", label: "Home Vastu (Other)", description: "Custom Vastu solutions for 3BHK, 4BHK, villas, and other residential properties." },
      { value: "plot_vastu", label: "Plot Vastu", description: "Vastu guidance for plot selection, shape analysis, direction planning, and construction advice." },
      { value: "factory_vastu", label: "Factory Vastu", description: "Industrial Vastu for factories, warehouses, and manufacturing units to improve productivity." },
    ],
    numerology: [
      { value: "name_numerology", label: "Name Numerology", description: "Analyze your name numbers for success, compatibility, and life path corrections." },
      { value: "marriage_compatibility", label: "Marriage Compatibility", description: "Numerology-based compatibility check for marriage, partnerships, and relationships." },
      { value: "vehicle_number_selection", label: "Vehicle Number Selection", description: "Select lucky vehicle numbers for safety, success, and positive journeys." },
    ],
    yoga: [
      { value: "counselling", label: "Counselling", description: "Personalized yoga counselling for mental peace, stress relief, and holistic wellness." },
    ],
  };

  const [formData, setFormData] = useState({
    title: "",
    titleKey: "",
    category: "",
    categoryDescription: "", // Auto-filled from selected category
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
  const [availableCategories, setAvailableCategories] = useState([]);

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
    { value: "purple", label: "Purple/Pink" },
    { value: "blue", label: "Blue/Cyan" },
    { value: "green", label: "Green/Emerald" },
    { value: "orange", label: "Orange/Amber" },
    { value: "red", label: "Red/Rose" },
    { value: "indigo", label: "Indigo/Purple" },
    { value: "teal", label: "Teal/Cyan" },
    { value: "yellow", label: "Yellow/Orange" },
  ];

  const symbolTypeOptions = [
    { value: "zodiac", label: "Zodiac Signs" },
    { value: "planets", label: "Planets" },
    { value: "numbers", label: "Numbers" },
    { value: "directions", label: "Directions" },
    { value: "elements", label: "Elements" },
    { value: "none", label: "None" },
  ];

  // Update categories when title changes
  useEffect(() => {
    if (formData.titleKey && categoryOptions[formData.titleKey]) {
      setAvailableCategories(categoryOptions[formData.titleKey]);
    } else {
      setAvailableCategories([]);
    }
  }, [formData.titleKey]);

  // Update category description when category changes
  useEffect(() => {
    if (formData.titleKey && formData.category) {
      const selectedCategory = categoryOptions[formData.titleKey]?.find(
        cat => cat.value === formData.category
      );
      if (selectedCategory) {
        setFormData(prev => ({
          ...prev,
          categoryDescription: selectedCategory.description
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        categoryDescription: ""
      }));
    }
  }, [formData.titleKey, formData.category]);

  // Calculate discount automatically
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
        titleKey: editingService.titleKey || "",
        category: editingService.category || "",
        categoryDescription: editingService.categoryDescription || "",
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
      resetForm();
    }
    setImageFile(null);
  }, [editingService]);

  const resetForm = () => {
    setFormData({
      title: "",
      titleKey: "",
      category: "",
      categoryDescription: "",
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
    setImageFile(null);
    setAvailableCategories([]);
  };

  const handleTitleChange = (e) => {
    const selectedKey = e.target.value;
    const selectedTitle = serviceTitleOptions.find(opt => opt.value === selectedKey);
    
    setFormData({
      ...formData,
      titleKey: selectedKey,
      title: selectedTitle ? selectedTitle.label : "",
      category: "", // Reset category when title changes
      categoryDescription: ""
    });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({
      ...formData,
      category: selectedCategory
    });
  };

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
      if (!formData.titleKey) {
        toast.error("Please select a service title");
        return;
      }
      if (!formData.category) {
        toast.error("Please select a category");
        return;
      }
      if (!formData.description || !formData.description.trim()) {
        toast.error("Please enter service description");
        return;
      }
      if (!formData.price || !formData.price.trim()) {
        toast.error("Please enter service price");
        return;
      }
      
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

      if (!imageUrl) {
        toast.error("Please upload a service image");
        setUploading(false);
        return;
      }

      const cleanedData = {
        ...formData,
        title: formData.title,
        titleKey: formData.titleKey,
        category: formData.category,
        categoryDescription: formData.categoryDescription,
        description: formData.description.trim(),
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
          toast.error("Update function not available");
          return;
        }
      } else {
        if (typeof onCreate === 'function') {
          await onCreate(cleanedData);
        } else {
          toast.error("Create function not available");
          return;
        }
      }

      onClose();
      resetForm();
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
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Service Title & Category Dropdowns */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Service Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Title *</label>
                <select
                  value={formData.titleKey}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Service Title</option>
                  {serviceTitleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={handleCategoryChange}
                  disabled={!formData.titleKey}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Category</option>
                  {availableCategories.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {!formData.titleKey && (
                  <p className="text-xs text-amber-600 mt-1">Please select a service title first</p>
                )}
              </div>
            </div>

            {/* Category Description Box */}
            {formData.categoryDescription && (
              <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 text-lg">ℹ️</span>
                  <div>
                    <p className="text-sm font-medium text-blue-800">About this service:</p>
                    <p className="text-sm text-blue-700">{formData.categoryDescription}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Service Description *
            </h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Write a detailed description of what this service offers, what customers can expect, and how it will benefit them..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-400 mt-1">This will be shown on the service page</p>
          </div>

          {/* Pricing */}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="₹24,999"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            {autoDiscount > 0 && (
              <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Discount Applied:</span>
                  <span className="text-lg font-bold text-green-600">{autoDiscount}% OFF</span>
                </div>
              </div>
            )}
          </div>

          {/* Duration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Duration
            </h3>
            <input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 60 minutes"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {iconColorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gradient</label>
                <select
                  name="gradientKey"
                  value={formData.gradientKey}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              Service Image *
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Benefit ${index + 1}`}
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("benefits", index)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                )}
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
                  className="w-4 h-4 rounded border-gray-300 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          {/* Symbol Type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Symbol Type
            </h3>
            <select
              name="symbolType"
              value={formData.symbolType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {symbolTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={() => {
                onClose();
                resetForm();
              }} 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={uploading} 
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
            >
              {uploading ? "Saving..." : (editingService ? "Update Service" : "Create Service")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceFormModal;