// components/home/Products.jsx

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ShoppingCart,
  Star,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../services/api";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

// Categories based on actual product types from your database
const categories = [
  { key: "all", label: "All Products" },
  { key: "Rudraksha", label: "Rudraksha" },
  { key: "Mala", label: "Mala" },
  { key: "Bracelet", label: "Bracelets" },
  { key: "Necklace", label: "Necklaces" },
  { key: "108 Mala", label: "108 Mala" },
  { key: "Rare", label: "Rare Collection" },
];

const Products = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!products?.length) return [];

    if (activeCategory === "all") {
      return products;
    }

    return products.filter(
      (p) =>
        p.type?.toLowerCase() === activeCategory.toLowerCase() ||
        p.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [products, activeCategory]);

  const displayProducts = filteredProducts.slice(0, 6);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (!product.inStock) {
      toast.error('Product is out of stock');
      return;
    }
    try {
      await addItem(product._id, 1);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center bg-gradient-to-br from-red-50 via-orange-50 to-offWhite">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-red-50 via-orange-50 to-offWhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Our Collection</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            Explore <span className="text-red-600">Products</span>
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Discover authentic spiritual products crafted with divine energy
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDEBAR - Categories */}
          <div className="lg:w-[280px] flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-5 py-4">
                  <h3 className="text-white font-semibold text-lg">Categories</h3>
                </div>
                <div className="divide-y divide-orange-100">
                  {categories.map((category) => (
                    <button
                      key={category.key}
                      onClick={() => setActiveCategory(category.key)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 transition-all duration-300 group ${
                        activeCategory === category.key
                          ? "bg-gradient-to-r from-red-50 to-orange-50 text-red-600 font-semibold border-l-4 border-red-500"
                          : "text-gray-700 hover:bg-orange-50 hover:text-red-600"
                      }`}
                    >
                      <span className="text-[14px] md:text-[15px]">
                        {category.label}
                      </span>
                      <ChevronRight
                        size={16}
                        className={`transition-all duration-300 ${
                          activeCategory === category.key
                            ? "translate-x-1 text-red-500"
                            : "group-hover:translate-x-1 group-hover:text-red-500"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Decorative element */}
              <div className="mt-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 text-center border border-orange-100">
                <div className="text-3xl mb-2">🔮</div>
                <p className="text-sm text-gray-700 font-medium">Need Help?</p>
                <p className="text-xs text-gray-500 mt-1">Contact us for personalized recommendations</p>
                <button 
                  onClick={() => navigate('/contact')}
                  className="mt-3 text-red-500 text-sm font-semibold hover:underline"
                >
                  Contact Support →
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCTS GRID - Using flex wrap instead of grid */}
          <div className="flex-1">
            {displayProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg border border-orange-100">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg">No products found in this category</p>
                <button
                  onClick={() => setActiveCategory("all")}
                  className="mt-4 text-red-500 font-semibold hover:underline"
                >
                  View all products →
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6">
                {displayProducts.map((p, index) => (
                  <motion.div
                    key={p._id || index}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100"
                    style={{ width: "calc(33.333% - 1rem)", minWidth: "250px", flex: "0 0 auto" }}
                    onClick={() => handleProductClick(p._id)}
                  >
                    {/* IMAGE */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50">
                      <div className="aspect-square w-full">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      
                      {/* Discount Badge */}
                      {p.discount && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full z-10 shadow-md">
                          {p.discount}
                        </span>
                      )}
                      
                      {/* Out of Stock Overlay */}
                      {!p.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      {/* Hover Actions */}
                      <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(p._id);
                          }}
                          className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors duration-300"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={(e) => handleAddToCart(e, p)}
                          disabled={!p.inStock}
                          className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4">
                      {/* Product Type Tag */}
                      <div className="mb-2">
                        <span className="inline-block px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full">
                          {p.type || 'Rudraksha'}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                        {p.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < (p.rating || 4)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({p.rating || 4}.0)
                        </span>
                      </div>

                      {/* Price Section */}
                      <div className="mt-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-red-600 text-lg font-bold">
                            ₹{p.price}
                          </span>
                          {p.oldPrice && (
                            <span className="text-gray-400 line-through text-xs">
                              ₹{p.oldPrice}
                            </span>
                          )}
                          {p.oldPrice && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                              SAVE {Math.round(100 - (p.price / p.oldPrice) * 100)}%
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="mt-2">
                          {p.inStock ? (
                            <span className="text-green-600 text-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                              In Stock
                            </span>
                          ) : (
                            <span className="text-red-600 text-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* View All Button */}
        {displayProducts.length > 0 && products.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              View All Products
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;