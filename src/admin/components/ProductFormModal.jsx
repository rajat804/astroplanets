import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineX, HiOutlineUpload, HiOutlinePlus } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const ProductFormModal = ({ isOpen, onClose, editingProduct, onCreate, onUpdate }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    image: '',
    images: [],
    type: 'Rudraksha',
    gemstone: 'Rudraksha',
    stock: 10,
    discount: '',
    subtitle: '',
    description: '',
    color: '',
    material: 'Authentic Rudraksha',
    weight: '',
    dimensions: '',
    origin: 'Nepal / India',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customType, setCustomType] = useState('');
  const [showCustomType, setShowCustomType] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Product type options
  const productTypes = [
    'Rudraksha',
    'Mala',
    'Rare',
    'Necklace',
    '108 Mala',
    'Bracelet',
    'Other'
  ];

  useEffect(() => {
    if (editingProduct) {
      // Check if product type is custom (not in predefined list)
      const isCustomType = !productTypes.includes(editingProduct.type);

      setFormData({
        name: editingProduct.name || '',
        price: editingProduct.price || '',
        oldPrice: editingProduct.oldPrice || '',
        image: editingProduct.image || '',
        images: editingProduct.images || [],
        type: isCustomType ? 'Other' : (editingProduct.type || 'Rudraksha'),
        gemstone: editingProduct.gemstone || 'Rudraksha',
        stock: editingProduct.stock || 10,
        discount: editingProduct.discount || '',
        subtitle: editingProduct.subtitle || '',
        description: editingProduct.description || '',
        color: editingProduct.color || '',
        material: editingProduct.material || 'Authentic Rudraksha',
        weight: editingProduct.weight || '',
        dimensions: editingProduct.dimensions || '',
        origin: editingProduct.origin || 'Nepal / India',
      });

      setUploadedImages(editingProduct.images || []);

      if (isCustomType) {
        setShowCustomType(true);
        setCustomType(editingProduct.type);
      } else {
        setShowCustomType(false);
        setCustomType('');
      }
    } else {
      setFormData({
        name: '',
        price: '',
        oldPrice: '',
        image: '',
        images: [],
        type: 'Rudraksha',
        gemstone: 'Rudraksha',
        stock: 10,
        discount: '',
        subtitle: '',
        description: '',
        color: '',
        material: 'Authentic Rudraksha',
        weight: '',
        dimensions: '',
        origin: 'Nepal / India',
      });
      setUploadedImages([]);
      setCustomType('');
      setShowCustomType(false);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If type is changed to 'Other', show custom input
    if (name === 'type') {
      if (value === 'Other') {
        setShowCustomType(true);
        setFormData({ ...formData, type: value });
      } else {
        setShowCustomType(false);
        setCustomType('');
        setFormData({ ...formData, type: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCustomTypeChange = (e) => {
    setCustomType(e.target.value);
  };

  // Image Upload Handler - Updated for correct endpoint
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    if (uploadedImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    let uploadedUrls = [];

    try {
      // Upload each file one by one
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);

        // Using the correct endpoint '/api/upload/single'
        const response = await axios.post(
          `${API_URL}/upload/single`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('Upload response:', response.data);

        if (response.data && response.data.imageUrl) {
          uploadedUrls.push(response.data.imageUrl);
        }
      }

      // Update images state with all uploaded URLs
      if (uploadedUrls.length > 0) {
        const newImages = [...uploadedImages, ...uploadedUrls];
        setUploadedImages(newImages);
        setFormData(prev => ({
          ...prev,
          images: newImages,
          // Set first image as main image if no main image selected
          image: prev.image || (newImages.length > 0 ? newImages[0] : '')
        }));
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error.response?.data?.msg || error.message || 'Failed to upload image';
      toast.error(errorMsg);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  // Remove Image Handler
  const handleRemoveImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setFormData(prev => ({
      ...prev,
      images: newImages,
      // If removed image was main image, set first image as main
      image: newImages.length > 0 ? (prev.image === uploadedImages[index] ? newImages[0] : prev.image) : ''
    }));
    toast.success('Image removed');
  };

  // Select Main Image Handler
  const handleMainImageSelect = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
    toast.success('Main image selected');
  };
  // ✅ REPLACE handleSubmit with this FINAL version
const handleSubmit = async () => {
  console.log('📝 Form submitted');
  console.log('✏️ Editing:', !!editingProduct);

  // 1. Validate required fields
  if (!formData.name || !formData.name.trim()) {
    toast.error('Product name is required');
    return;
  }

  if (!formData.price || Number(formData.price) <= 0) {
    toast.error('Valid price is required');
    return;
  }

  // 2. For create: image required; for update: optional
  if (!editingProduct && uploadedImages.length === 0) {
    toast.error('Please upload at least one image');
    return;
  }

  // 3. Handle custom type
  let productType = formData.type;
  if (formData.type === 'Other') {
    if (!customType || !customType.trim()) {
      toast.error('Please enter a custom type name');
      return;
    }
    productType = customType.trim();
  }

  setIsSubmitting(true);

  try {
    // 4. Prepare base data
    const productData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      type: productType,
    };

    // 5. Add optional fields ONLY if they have values
    if (formData.oldPrice && formData.oldPrice !== '') {
      productData.oldPrice = Number(formData.oldPrice);
    }
    
    if (formData.gemstone && formData.gemstone !== '') {
      productData.gemstone = formData.gemstone;
    }
    
    if (formData.stock && formData.stock !== '') {
      productData.stock = Number(formData.stock);
    }
    
    if (formData.discount && formData.discount !== '') {
      productData.discount = formData.discount;
    }
    
    if (formData.subtitle && formData.subtitle !== '') {
      productData.subtitle = formData.subtitle;
    }
    
    if (formData.description && formData.description !== '') {
      productData.description = formData.description;
    }
    
    if (formData.color && formData.color !== '') {
      productData.color = formData.color;
    }
    
    if (formData.material && formData.material !== '') {
      productData.material = formData.material;
    }
    
    if (formData.weight && formData.weight !== '') {
      productData.weight = formData.weight;
    }
    
    if (formData.dimensions && formData.dimensions !== '') {
      productData.dimensions = formData.dimensions;
    }
    
    if (formData.origin && formData.origin !== '') {
      productData.origin = formData.origin;
    }

    // 6. Handle images - CRITICAL for create
    if (uploadedImages.length > 0) {
      productData.images = uploadedImages;
      productData.image = formData.image || uploadedImages[0];
    }

    console.log('📤 Sending data:', productData);

    // 7. Make API call
    if (editingProduct) {
      await onUpdate(editingProduct._id, productData);
    } else {
      await onCreate(productData);
    }
    
    // 8. Reset form on success
    setFormData({
      name: '',
      price: '',
      oldPrice: '',
      image: '',
      images: [],
      type: 'Rudraksha',
      gemstone: 'Rudraksha',
      stock: 10,
      discount: '',
      subtitle: '',
      description: '',
      color: '',
      material: 'Authentic Rudraksha',
      weight: '',
      dimensions: '',
      origin: 'Nepal / India',
    });
    setUploadedImages([]);
    setCustomType('');
    setShowCustomType(false);
    
  } catch (error) {
    console.error('❌ Submit error:', error);
    console.error('Response:', error.response?.data);
    
    const errorMsg = error.response?.data?.msg || 
                     error.response?.data?.error || 
                     error.message || 
                     'Failed to save product';
    toast.error(errorMsg);
  } finally {
    setIsSubmitting(false);
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
        className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 z-10">
          <h4 className="text-xl font-bold text-gray-800">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h4>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Premium Rudraksh Mala"
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {productTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Custom Type Input */}
              {showCustomType && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Type Name *</label>
                  <input
                    type="text"
                    value={customType}
                    onChange={handleCustomTypeChange}
                    placeholder="Enter custom type name"
                    className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {customType && (
                    <p className="text-xs text-green-600 mt-1">
                      Will be saved as: {customType}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="1999"
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old Price (₹)</label>
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                placeholder="2999"
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images *</label>

            {/* Upload Button */}
            <div className="flex items-center gap-4 mb-3">
              <label className={`cursor-pointer px-4 py-2 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                <HiOutlineUpload className="w-5 h-5" />
                {uploading ? 'Uploading...' : 'Upload Images'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <span className="text-sm text-gray-500">
                {uploadedImages.length}/5 images
              </span>
              {uploading && (
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {/* Image Preview Grid */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {uploadedImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group"
                  >
                    <div className="w-full h-24 rounded-lg overflow-hidden border border-orange-200">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    >
                      <HiOutlineX className="w-4 h-4" />
                    </button>
                    {formData.image === image && (
                      <span className="absolute bottom-1 left-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                        Main
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* No Images Message */}
            {uploadedImages.length === 0 && !uploading && (
              <div className="border-2 border-dashed border-orange-200 rounded-xl p-6 text-center">
                <HiOutlinePlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No images uploaded yet</p>
                <p className="text-sm text-gray-400">Click the upload button above to add images</p>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Upload up to 5 images (JPG, PNG, WebP)
            </p>
          </div>

          {/* Main Image Selection */}
          {uploadedImages.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Main Image *</label>
              <div className="flex gap-3 flex-wrap">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <button
                      type="button"
                      onClick={() => handleMainImageSelect(img)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${formData.image === img ? 'border-red-500 shadow-md' : 'border-orange-200'
                        }`}
                    >
                      <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                    {formData.image === img && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">Main</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Tag</label>
              <input
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="Best Seller, New, Sale"
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Short tagline for the product"
              className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Detailed product description"
              className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Brown, Black, etc"
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
              <input
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="Authentic Rudraksha"
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <input
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Approx. 15-20g"
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
              <input
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="8mm beads"
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
            <input
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              placeholder="Nepal / India"
              className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Submit Buttons with Animation */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-orange-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FaSpinner className="w-5 h-5" />
                  </motion.div>
                  {editingProduct ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>

          {/* Progress Bar Animation */}
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-gray-600"
            >
              {editingProduct ? 'Updating product...' : 'Creating new product...'}
              <motion.div
                className="w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mt-2"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: "linear" }}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductFormModal;