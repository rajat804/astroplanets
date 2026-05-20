import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
    HiOutlineX,
    HiOutlinePlus,
    HiOutlineTrash,
} from "react-icons/hi";
import toast from "react-hot-toast";

const CourseFormModal = ({
    isOpen,
    onClose,
    editingCourse,
    onCreate,
    onUpdate,
}) => {

    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    const [formData, setFormData] = useState({
        type: "numerology",
        title: "",
        level: "Diploma",
        duration: "",
        sessions: "",
        courseLanguage: "Hindi, English",
        mode: "Live Online",
        mrpPrice: "",
        price: "",
        gstPercentage: 18,
        extraDiscount: 0,
        rating: 0,
        image: "",
        description: "",
        longDescription: "",
        syllabus: [""],
        includes: [""],
        isActive: true,
        enrolledStudents: 0,
    });

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    const courseTypes = [
        { value: "numerology", label: "Numerology" },
        { value: "astrology", label: "Astrology" },
        { value: "tarot", label: "Tarot Reading" },
        { value: "vastu", label: "Vastu Shastra" },
        { value: "palmistry", label: "Palmistry" },
        { value: "reiki", label: "Reiki Healing" },
        { value: "yoga", label: "Yoga" },
        { value: "meditation", label: "Meditation" },
    ];

    const levels = ["Diploma", "Certificate", "Advanced", "Master", "Beginner", "Intermediate"];
    const modes = ["Live Online", "Recorded", "Hybrid", "In-Person"];
    const languages = ["Hindi", "English", "Hindi, English", "Tamil", "Telugu", "Malayalam", "Kannada"];

    useEffect(() => {
        if (editingCourse) {
            setFormData({
                type: editingCourse.type || "numerology",
                title: editingCourse.title || "",
                level: editingCourse.level || "Diploma",
                duration: editingCourse.duration || "",
                sessions: editingCourse.sessions || "",
                courseLanguage: editingCourse.courseLanguage || editingCourse.language || "Hindi, English",
                mode: editingCourse.mode || "Live Online",
                mrpPrice: editingCourse.mrpPrice || "",
                price: editingCourse.price || "",
                gstPercentage: editingCourse.gstPercentage || 18,
                extraDiscount: editingCourse.extraDiscount || 0,
                rating: editingCourse.rating || 0,
                image: editingCourse.image || "",
                description: editingCourse.description || "",
                longDescription: editingCourse.longDescription || "",
                syllabus: editingCourse.syllabus?.length ? editingCourse.syllabus : [""],
                includes: editingCourse.includes?.length ? editingCourse.includes : [""],
                isActive: editingCourse.isActive !== undefined ? editingCourse.isActive : true,
                enrolledStudents: editingCourse.enrolledStudents || 0,
            });
            setImagePreview(editingCourse.image || "");
        } else {
            setFormData({
                type: "numerology",
                title: "",
                level: "Diploma",
                duration: "",
                sessions: "",
                courseLanguage: "Hindi, English",
                mode: "Live Online",
                mrpPrice: "",
                price: "",
                gstPercentage: 18,
                extraDiscount: 0,
                rating: 0,
                image: "",
                description: "",
                longDescription: "",
                syllabus: [""],
                includes: [""],
                isActive: true,
                enrolledStudents: 0,
            });
            setImagePreview("");
        }
        setImageFile(null);
    }, [editingCourse]);

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

            // Upload image if a new file is selected
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append("image", imageFile);

                let response;
                try {
                    response = await axios.post(`${API_URL}/courses/upload/single`, imageFormData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                } catch (err) {
                    console.log(err);
                    response = await axios.post(`${API_URL}/courses/upload`, imageFormData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                }

                if (response.data.success) {
                    imageUrl = response.data.imageUrl;
                } else {
                    toast.error("Image upload failed");
                    setUploading(false);
                    return;
                }
            }

            // Validation
            if (!formData.title || !formData.price || !imageUrl || !formData.description) {
                toast.error("Please fill all required fields (Title, Price, Image, Description)");
                setUploading(false);
                return;
            }

            // Clean data
            const cleanedData = {
                type: formData.type,
                title: formData.title.trim(),
                level: formData.level,
                duration: formData.duration,
                sessions: formData.sessions,
                courseLanguage: formData.courseLanguage,
                mode: formData.mode,
                mrpPrice: formData.mrpPrice,
                price: formData.price,
                gstPercentage: Number(formData.gstPercentage) || 18,
                extraDiscount: Number(formData.extraDiscount) || 0,
                rating: Number(formData.rating) || 0,
                image: imageUrl,
                description: formData.description.trim(),
                longDescription: formData.longDescription || "",
                syllabus: formData.syllabus.filter((item) => item && item.trim() !== ""),
                includes: formData.includes.filter((item) => item && item.trim() !== ""),
                isActive: formData.isActive,
                enrolledStudents: Number(formData.enrolledStudents) || 0,
            };

            // Ensure syllabus and includes have at least one item
            if (cleanedData.syllabus.length === 0) {
                cleanedData.syllabus = ["Introduction to " + cleanedData.title];
            }
            if (cleanedData.includes.length === 0) {
                cleanedData.includes = ["Certificate of Completion", "Lifetime Access"];
            }

            if (editingCourse) {
                await onUpdate(editingCourse._id, cleanedData);
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
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 z-10">
                    <h4 className="text-xl font-bold text-gray-800">
                        {editingCourse ? "Edit Course" : "Add New Course"}
                    </h4>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* BASIC INFO */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-orange-200">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Type *</label>
                                <select name="type" value={formData.type} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500">
                                    {courseTypes.map((type) => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                                <input name="title" value={formData.title} onChange={handleChange}
                                    placeholder="Professional Numerology Course"
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                                <select name="level" value={formData.level} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl">
                                    {levels.map((level) => (<option key={level} value={level}>{level}</option>))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                                <input name="duration" value={formData.duration} onChange={handleChange}
                                    placeholder="3 Months"
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sessions *</label>
                                <input name="sessions" value={formData.sessions} onChange={handleChange}
                                    placeholder="30+"
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
                                <select name="courseLanguage" value={formData.courseLanguage} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl">
                                    {languages.map((lang) => (<option key={lang} value={lang}>{lang}</option>))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mode *</label>
                                <select name="mode" value={formData.mode} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl">
                                    {modes.map((mode) => (<option key={mode} value={mode}>{mode}</option>))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* PRICING SECTION - NEW */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-orange-200">
                            Pricing & Discounts
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">MRP Price</label>
                                <input type="text" name="mrpPrice" value={formData.mrpPrice} onChange={handleChange}
                                    placeholder="₹49,999"
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl" />
                                <p className="text-xs text-gray-400 mt-1">Original price before discount</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                                <input type="text" name="price" value={formData.price} onChange={handleChange}
                                    placeholder="₹24,999"
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl" />
                                <p className="text-xs text-gray-400 mt-1">Final price after discount</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GST Percentage (%)</label>
                                <input type="number" name="gstPercentage" value={formData.gstPercentage} onChange={handleChange}
                                    placeholder="18"
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl" />
                                <p className="text-xs text-gray-400 mt-1">Default: 18%</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Extra Discount (%)</label>
                                <input type="number" name="extraDiscount" value={formData.extraDiscount} onChange={handleChange}
                                    placeholder="10"
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl" />
                                <p className="text-xs text-gray-400 mt-1">Additional discount percentage</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <input type="number" name="rating" value={formData.rating} onChange={handleChange}
                                    step="0.1" min="0" max="5"
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enrolled Students</label>
                                <input type="number" name="enrolledStudents" value={formData.enrolledStudents} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl" />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                                    <span className="text-sm text-gray-700">Course Active</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* IMAGE UPLOAD */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-orange-200">
                            Course Image
                        </h3>
                        
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="w-full px-4 py-2 border border-orange-200 rounded-xl"
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

                    {/* DESCRIPTIONS */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-orange-200">
                            Descriptions
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleChange}
                                    rows="3" maxLength="500"
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl" />
                                <p className="text-right text-xs text-gray-400 mt-1">{formData.description.length}/500</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
                                <textarea name="longDescription" value={formData.longDescription} onChange={handleChange}
                                    rows="6"
                                    className="w-full px-4 py-2 border border-orange-200 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* SYLLABUS */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-orange-200">
                            Syllabus
                        </h3>
                        {formData.syllabus.map((item, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input type="text" value={item}
                                    onChange={(e) => handleArrayItemChange("syllabus", index, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-orange-200 rounded-xl"
                                    placeholder={`Module ${index + 1}`} />
                                <button type="button" onClick={() => removeArrayItem("syllabus", index)}
                                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                                    <HiOutlineTrash className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem("syllabus")}
                            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition">
                            <HiOutlinePlus className="w-4 h-4" /> Add Module
                        </button>
                    </div>

                    {/* INCLUDES */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-orange-200">
                            What's Included
                        </h3>
                        {formData.includes.map((item, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input type="text" value={item}
                                    onChange={(e) => handleArrayItemChange("includes", index, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-orange-200 rounded-xl"
                                    placeholder={`Benefit ${index + 1}`} />
                                <button type="button" onClick={() => removeArrayItem("includes", index)}
                                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                                    <HiOutlineTrash className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem("includes")}
                            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition">
                            <HiOutlinePlus className="w-4 h-4" /> Add Benefit
                        </button>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-3 pt-4 border-t border-orange-200">
                        <button onClick={onClose}
                            className="flex-1 px-4 py-2 border border-orange-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={uploading}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition disabled:opacity-50">
                            {uploading ? "Uploading..." : (editingCourse ? "Update Course" : "Create Course")}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CourseFormModal;