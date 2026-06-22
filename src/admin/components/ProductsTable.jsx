import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaBoxOpen, FaRupeeSign, FaTag, FaBox, FaShoppingBag } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineEye, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const ProductsTable = ({ onEdit, onDelete, onViewDetails }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [productStats, setProductStats] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchProductStats();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products`);
      console.log("Products fetched:", response.data);
      
      if (response.data.success) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/stats/admin`);
      setProductStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching product stats:", error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (stock < 10) return { text: "Low Stock", color: "bg-orange-100 text-orange-700" };
    return { text: "In Stock", color: "bg-green-100 text-green-700" };
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
    // Call the parent callback if provided
    if (onViewDetails) {
      onViewDetails(product);
    }
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8">
        <div className="flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Stats Summary */}
        {productStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{productStats.totalProducts || products.length}</p>
              <p className="text-xs text-gray-500">Total Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{productStats.lowStock || 0}</p>
              <p className="text-xs text-gray-500">Low Stock</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{productStats.outOfStock || 0}</p>
              <p className="text-xs text-gray-500">Out of Stock</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{productStats.totalSold || products.reduce((sum, p) => sum + (p.sold || 0), 0)}</p>
              <p className="text-xs text-gray-500">Total Sold</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-50 to-red-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Sold</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const stockStatus = getStockStatus(p.stock);
                  return (
                    <tr key={p._id} className="hover:bg-orange-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <img 
                              src={p.image || p.images?.[0] || 'https://via.placeholder.com/50'} 
                              alt={p.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/50';
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 line-clamp-1">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.subtitle || p.type}</div>
                            {p.discount && (
                              <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                                {p.discount}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {p.type || 'Rudraksha'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-800">₹{p.price?.toLocaleString()}</div>
                          {p.oldPrice && (
                            <div className="text-xs text-gray-400 line-through">₹{p.oldPrice?.toLocaleString()}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.text} ({p.stock || 0})
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{p.sold || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-500" />
                          <span className="text-gray-600">{p.rating || 4.5}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.inStock && p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {p.inStock && p.stock > 0 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewDetails(p)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            title="View Details"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onEdit(p)}
                            className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
                            title="Edit Product"
                          >
                            <HiOutlinePencilAlt className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDelete(p._id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            title="Delete Product"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer with total count */}
        {filteredProducts.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <button
              onClick={fetchProducts}
              className="text-sm text-red-500 hover:text-red-600 transition"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedProduct && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6 sticky top-0 bg-white pb-4 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={selectedProduct.image || selectedProduct.images?.[0] || 'https://via.placeholder.com/64'} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-500">{selectedProduct.subtitle}</p>
                    {selectedProduct.discount && (
                      <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        {selectedProduct.discount}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <HiOutlineX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaBox className="text-blue-500" />
                      Basic Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Product ID</span>
                        <span className="font-mono text-sm text-gray-700">{selectedProduct._id?.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {selectedProduct.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Gemstone</span>
                        <span className="text-gray-700">{selectedProduct.gemstone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category</span>
                        <span className="text-gray-700">{selectedProduct.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          selectedProduct.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {selectedProduct.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaRupeeSign className="text-green-500" />
                      Pricing & Stock
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Price</span>
                        <span className="font-bold text-gray-800">₹{formatCurrency(selectedProduct.price)}</span>
                      </div>
                      {selectedProduct.oldPrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Original Price</span>
                          <span className="text-gray-400 line-through">₹{formatCurrency(selectedProduct.oldPrice)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Stock</span>
                        <span className={`font-semibold ${
                          selectedProduct.stock === 0 ? "text-red-600" : 
                          selectedProduct.stock < 10 ? "text-orange-600" : "text-green-600"
                        }`}>
                          {selectedProduct.stock} units
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sold</span>
                        <span className="text-gray-700">{selectedProduct.sold || 0} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Rating</span>
                        <span className="flex items-center gap-1">
                          <FaStar className="text-yellow-500" />
                          {selectedProduct.rating || 0} / 5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaBoxOpen className="text-purple-500" />
                      Product Details
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Description</p>
                        <p className="text-sm text-gray-700 mt-1">{selectedProduct.description || 'No description'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Designer Note</p>
                        <p className="text-sm text-gray-700 mt-1">{selectedProduct.designerNote || 'No designer note'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaTag className="text-orange-500" />
                      Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Color</p>
                        <p className="text-sm text-gray-700">{selectedProduct.color || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Material</p>
                        <p className="text-sm text-gray-700">{selectedProduct.material || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="text-sm text-gray-700">{selectedProduct.weight || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Dimensions</p>
                        <p className="text-sm text-gray-700">{selectedProduct.dimensions || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Origin</p>
                        <p className="text-sm text-gray-700">{selectedProduct.origin || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm text-gray-700">{formatDate(selectedProduct.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Images */}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Gallery</h4>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedProduct.images.map((img, idx) => (
                          <div key={idx} className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={img} 
                              alt={`Product ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer - Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    onEdit(selectedProduct);
                  }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
                >
                  <HiOutlinePencilAlt className="w-4 h-4" />
                  Edit Product
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    onDelete(selectedProduct._id);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductsTable;