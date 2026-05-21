// components/admin/ExpertFormModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { HiOutlineX, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { GiCrystalBall } from "react-icons/gi";

const ExpertFormModal = ({ isOpen, onClose, editingExpert, onCreate, onUpdate }) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    expertise: "",
    image: "",
    icon: "Compass",
    intro: "",
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    stats: [
      { key: "experience", value: "", label: "Experience", icon: "⭐" },
      { key: "students", value: "", label: "Students", icon: "👥" },
      { key: "consultations", value: "", label: "Consultations", icon: "📞" }
    ],
    specialties: [""],
    isActive: true,
    featured: false
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Predefined stat templates
  const statTemplates = [
    { key: "experience", label: "Experience", placeholder: "12+ years", icon: "⭐" },
    { key: "students", label: "Students", placeholder: "1500+", icon: "👥" },
    { key: "consultations", label: "Consultations", placeholder: "3000+", icon: "📞" },
    { key: "readings", label: "Readings", placeholder: "2500+", icon: "🔮" },
    { key: "accuracy", label: "Accuracy", placeholder: "95%", icon: "🎯" },
    { key: "classes", label: "Classes", placeholder: "500+", icon: "📚" },
    { key: "certifications", label: "Certifications", placeholder: "10+", icon: "📜" },
    { key: "awards", label: "Awards", placeholder: "5+", icon: "🏆" },
    { key: "clients", label: "Happy Clients", placeholder: "1500+", icon: "😊" },
    { key: "years", label: "Years of Experience", placeholder: "12+ years", icon: "📅" },
    { key: "sessions", label: "Sessions", placeholder: "1000+", icon: "🎓" },
    { key: "workshops", label: "Workshops", placeholder: "200+", icon: "🏢" },
    { key: "reviews", label: "Reviews", placeholder: "500+", icon: "⭐" },
    { key: "success_rate", label: "Success Rate", placeholder: "98%", icon: "📈" },
  ];

  const iconOptions = [
    { value: "Compass", label: "Compass", icon: "🧭" },
    { value: "User", label: "User", icon: "👤" },
    { value: "Star", label: "Star", icon: "⭐" },
    { value: "Crown", label: "Crown", icon: "👑" },
    { value: "Heart", label: "Heart", icon: "❤️" },
    { value: "Flower", label: "Flower", icon: "🌸" },
    { value: "Diamond", label: "Diamond", icon: "💎" },
    { value: "Moon", label: "Moon", icon: "🌙" },
    { value: "Sun", label: "Sun", icon: "☀️" },
    { value: "Handup", label: "Handup", icon: "✋" },
    { value: "Increasing", label: "Increasing", icon: "💹" },
  ];

  const colorOptions = [
    { value: "from-orange-500 to-red-600", label: "Orange to Red", preview: "bg-gradient-to-r from-orange-500 to-red-600" },
    { value: "from-purple-500 to-pink-600", label: "Purple to Pink", preview: "bg-gradient-to-r from-purple-500 to-pink-600" },
    { value: "from-green-500 to-emerald-600", label: "Green to Emerald", preview: "bg-gradient-to-r from-green-500 to-emerald-600" },
    { value: "from-blue-500 to-cyan-500", label: "Blue to Cyan", preview: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { value: "from-indigo-500 to-purple-500", label: "Indigo to Purple", preview: "bg-gradient-to-r from-indigo-500 to-purple-500" },
    { value: "from-red-500 to-rose-500", label: "Red to Rose", preview: "bg-gradient-to-r from-red-500 to-rose-500" },
    { value: "from-teal-500 to-cyan-500", label: "Teal to Cyan", preview: "bg-gradient-to-r from-teal-500 to-cyan-500" },
    { value: "from-yellow-500 to-amber-500", label: "Yellow to Amber", preview: "bg-gradient-to-r from-yellow-500 to-amber-500" },
    { value: "from-pink-500 to-rose-500", label: "Pink to Rose", preview: "bg-gradient-to-r from-pink-500 to-rose-500" },
    { value: "from-violet-500 to-purple-500", label: "Violet to Purple", preview: "bg-gradient-to-r from-violet-500 to-purple-500" },
    { value: "from-fuchsia-500 to-pink-500", label: "Fuchsia to Pink", preview: "bg-gradient-to-r from-fuchsia-500 to-pink-500" },
    { value: "from-emerald-500 to-teal-500", label: "Emerald to Teal", preview: "bg-gradient-to-r from-emerald-500 to-teal-500" },
    { value: "from-sky-500 to-blue-500", label: "Sky to Blue", preview: "bg-gradient-to-r from-sky-500 to-blue-500" },
    { value: "from-amber-500 to-yellow-500", label: "Amber to Yellow", preview: "bg-gradient-to-r from-amber-500 to-yellow-500" },
    { value: "from-lime-500 to-green-500", label: "Lime to Green", preview: "bg-gradient-to-r from-lime-500 to-green-500" },
    { value: "from-cyan-500 to-blue-500", label: "Cyan to Blue", preview: "bg-gradient-to-r from-cyan-500 to-blue-500" },
  ];

  const bgColorOptions = [
    { value: "bg-orange-50", label: "Orange Light", preview: "bg-orange-50" },
    { value: "bg-purple-50", label: "Purple Light", preview: "bg-purple-50" },
    { value: "bg-green-50", label: "Green Light", preview: "bg-green-50" },
    { value: "bg-blue-50", label: "Blue Light", preview: "bg-blue-50" },
    { value: "bg-red-50", label: "Red Light", preview: "bg-red-50" },
    { value: "bg-pink-50", label: "Pink Light", preview: "bg-pink-50" },
    { value: "bg-indigo-50", label: "Indigo Light", preview: "bg-indigo-50" },
    { value: "bg-teal-50", label: "Teal Light", preview: "bg-teal-50" },
    { value: "bg-yellow-50", label: "Yellow Light", preview: "bg-yellow-50" },
    { value: "bg-amber-50", label: "Amber Light", preview: "bg-amber-50" },
    { value: "bg-violet-50", label: "Violet Light", preview: "bg-violet-50" },
    { value: "bg-fuchsia-50", label: "Fuchsia Light", preview: "bg-fuchsia-50" },
    { value: "bg-emerald-50", label: "Emerald Light", preview: "bg-emerald-50" },
    { value: "bg-sky-50", label: "Sky Light", preview: "bg-sky-50" },
    { value: "bg-lime-50", label: "Lime Light", preview: "bg-lime-50" },
    { value: "bg-cyan-50", label: "Cyan Light", preview: "bg-cyan-50" },
    { value: "bg-rose-50", label: "Rose Light", preview: "bg-rose-50" },
    { value: "bg-gray-50", label: "Gray Light", preview: "bg-gray-50" },
  ];

  const iconColorOptions = [
    { value: "text-orange-600", label: "Orange", preview: "text-orange-600" },
    { value: "text-purple-600", label: "Purple", preview: "text-purple-600" },
    { value: "text-green-600", label: "Green", preview: "text-green-600" },
    { value: "text-blue-600", label: "Blue", preview: "text-blue-600" },
    { value: "text-red-600", label: "Red", preview: "text-red-600" },
    { value: "text-pink-600", label: "Pink", preview: "text-pink-600" },
    { value: "text-indigo-600", label: "Indigo", preview: "text-indigo-600" },
    { value: "text-teal-600", label: "Teal", preview: "text-teal-600" },
    { value: "text-yellow-600", label: "Yellow", preview: "text-yellow-600" },
    { value: "text-amber-600", label: "Amber", preview: "text-amber-600" },
    { value: "text-violet-600", label: "Violet", preview: "text-violet-600" },
    { value: "text-fuchsia-600", label: "Fuchsia", preview: "text-fuchsia-600" },
    { value: "text-emerald-600", label: "Emerald", preview: "text-emerald-600" },
    { value: "text-sky-600", label: "Sky", preview: "text-sky-600" },
    { value: "text-rose-600", label: "Rose", preview: "text-rose-600" },
    { value: "text-lime-600", label: "Lime", preview: "text-lime-600" },
    { value: "text-cyan-600", label: "Cyan", preview: "text-cyan-600" },
  ];

  useEffect(() => {
    if (editingExpert) {
      // Convert stats object to array if it's an object
      let statsArray = [];
      if (editingExpert.stats && Array.isArray(editingExpert.stats)) {
        statsArray = editingExpert.stats;
      } else if (editingExpert.stats && typeof editingExpert.stats === 'object') {
        statsArray = Object.entries(editingExpert.stats).map(([key, value]) => {
          const template = statTemplates.find(t => t.key === key);
          return {
            key: key,
            value: value,
            label: template?.label || key.charAt(0).toUpperCase() + key.slice(1),
            icon: template?.icon || "📊"
          };
        });
      } else {
        statsArray = [
          { key: "experience", value: "", label: "Experience", icon: "⭐" },
          { key: "students", value: "", label: "Students", icon: "👥" },
          { key: "consultations", value: "", label: "Consultations", icon: "📞" }
        ];
      }

      setFormData({
        name: editingExpert.name || "",
        role: editingExpert.role || "",
        expertise: editingExpert.expertise || "",
        image: editingExpert.image || "",
        icon: editingExpert.icon || "Compass",
        intro: editingExpert.intro || "",
        color: editingExpert.color || "from-orange-500 to-red-600",
        bgColor: editingExpert.bgColor || "bg-orange-50",
        iconColor: editingExpert.iconColor || "text-orange-600",
        stats: statsArray,
        specialties: editingExpert.specialties?.length ? editingExpert.specialties : [""],
        isActive: editingExpert.isActive !== undefined ? editingExpert.isActive : true,
        featured: editingExpert.featured || false
      });
      setImagePreview(editingExpert.image || "");
    } else {
      setFormData({
        name: "",
        role: "",
        expertise: "",
        image: "",
        icon: "Compass",
        intro: "",
        color: "from-orange-500 to-red-600",
        bgColor: "bg-orange-50",
        iconColor: "text-orange-600",
        stats: [
          { key: "experience", value: "", label: "Experience", icon: "⭐" },
          { key: "students", value: "", label: "Students", icon: "👥" },
          { key: "consultations", value: "", label: "Consultations", icon: "📞" }
        ],
        specialties: [""],
        isActive: true,
        featured: false
      });
      setImagePreview("");
    }
    setImageFile(null);
  }, [editingExpert]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Stats handlers
  const handleStatChange = (index, field, value) => {
    const newStats = [...formData.stats];
    newStats[index][field] = value;
    setFormData({ ...formData, stats: newStats });
  };

  const addStat = (template) => {
    const newStat = {
      key: template.key,
      value: "",
      label: template.label,
      icon: template.icon
    };
    setFormData({
      ...formData,
      stats: [...formData.stats, newStat]
    });
  };

  const removeStat = (index) => {
    const newStats = formData.stats.filter((_, i) => i !== index);
    setFormData({ ...formData, stats: newStats });
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

  const getColorPreview = (colorValue) => {
    const option = colorOptions.find(opt => opt.value === colorValue);
    return option ? option.preview : "";
  };

  const getBgPreview = (bgValue) => {
    const option = bgColorOptions.find(opt => opt.value === bgValue);
    return option ? option.preview : "";
  };

  const getIconColorPreview = (colorValue) => {
    const option = iconColorOptions.find(opt => opt.value === colorValue);
    return option ? option.preview : "";
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      let imageUrl = formData.image;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const response = await axios.post(`${API_URL}/experts/upload`, imageFormData, {
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

      if (!formData.name || !formData.role || !imageUrl || !formData.intro) {
        toast.error("Please fill all required fields (Name, Role, Image, Intro)");
        setUploading(false);
        return;
      }

      // Convert stats array to object for storage
      const statsObject = {};
      formData.stats.forEach(stat => {
        if (stat.key && stat.value) {
          statsObject[stat.key] = stat.value;
        }
      });

      const cleanedData = {
        ...formData,
        image: imageUrl,
        stats: statsObject,
        specialties: formData.specialties.filter((item) => item && item.trim() !== ""),
      };

      if (cleanedData.specialties.length === 0) {
        cleanedData.specialties = ["Expert Consultant"];
      }

      if (editingExpert) {
        await onUpdate(editingExpert._id, cleanedData);
      } else {
        await onCreate(cleanedData);
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
            {editingExpert ? "Edit Expert" : "Add New Expert"}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Anuja S Chavaan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g., Vastu & Numerology Expert"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
                <input
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="e.g., Vastu Shastra | Numerology | Space Healing"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
              </div>

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
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Profile Image
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />
            {(imagePreview || formData.image) && (
              <div className="relative w-32 h-32 mt-4">
                <img
                  src={imagePreview || formData.image}
                  alt="preview"
                  className="w-full h-full object-cover rounded-full border-4 border-orange-200"
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

          {/* Intro/Bio */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Introduction / Bio *
            </h3>
            <textarea
              name="intro"
              value={formData.intro}
              onChange={handleChange}
              rows="6"
              placeholder="Write a detailed introduction about the expert..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Dynamic Statistics */}
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Statistics (Dynamic)</h3>
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm"
                >
                  <FaPlus className="w-3 h-3" /> Add Stat
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 hidden group-hover:block z-10">
                  <div className="p-2">
                    <p className="text-xs text-gray-500 px-2 py-1">Select stat type:</p>
                    {statTemplates.map((template) => (
                      <button
                        key={template.key}
                        type="button"
                        onClick={() => addStat(template)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition flex items-center gap-2"
                      >
                        <span className="text-lg">{template.icon}</span>
                        <span>{template.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {formData.stats.map((stat, index) => (
              <div key={index} className="flex gap-3 mb-3 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, "label", e.target.value)}
                    placeholder="Label"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="flex-[2]">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, "value", e.target.value)}
                    placeholder={`e.g., ${statTemplates.find(t => t.key === stat.key)?.placeholder || "Value"}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-400 mt-2">
              You can add any combination of stats like Experience, Students, Consultations, Readings, Accuracy, Classes, etc.
            </p>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Specialties
            </h3>
            {formData.specialties.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayItemChange("specialties", index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder={`Specialty ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("specialties", index)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("specialties")}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition"
            >
              <HiOutlinePlus className="w-4 h-4" /> Add Specialty
            </button>
          </div>

          {/* Styling Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Styling Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gradient Color</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl mb-2"
                >
                  {colorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className={`h-8 rounded-lg ${getColorPreview(formData.color)}`}></div>
                <p className="text-xs text-gray-400 mt-1">Preview of gradient</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                <select
                  name="bgColor"
                  value={formData.bgColor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl mb-2"
                >
                  {bgColorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className={`h-8 rounded-lg ${getBgPreview(formData.bgColor)} border border-gray-200`}></div>
                <p className="text-xs text-gray-400 mt-1">Preview of background</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Color</label>
                <select
                  name="iconColor"
                  value={formData.iconColor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl mb-2"
                >
                  {iconColorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className={`flex items-center gap-2 p-2 border border-gray-200 rounded-lg`}>
                  <GiCrystalBall className={`w-6 h-6 ${getIconColorPreview(formData.iconColor)}`} />
                  <span className={`text-sm ${getIconColorPreview(formData.iconColor)}`}>Sample Icon</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Preview of icon color</p>
              </div>
            </div>
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
            <button onClick={handleSubmit} disabled={uploading} className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50">
              {uploading ? "Saving..." : (editingExpert ? "Update Expert" : "Create Expert")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExpertFormModal;