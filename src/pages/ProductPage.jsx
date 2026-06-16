import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Star,
  Filter,
  ChevronDown,
  ChevronRight,
  X,
  Search,
  Grid3x3,
} from "lucide-react";
import assets from "../assets/assets";
import { getProducts } from "../services/api";
import toast from "react-hot-toast";

// Dynamic Categories from API or Product Data
const SHOP_CATEGORIES = [
  {
    id: "pyrite-bracelet",
    label: "Pyrite bracelet with magnetic closure",
    image: "https://justwowfactory.com/cdn/shop/files/Opulence_Drawer_Pyrite_Bracelet.webp?v=1742467045&width=200",
  },
  { id: "top-sellers", label: "Top Sellers", image: "https://justwowfactory.com/cdn/shop/files/new_red_string_stainless_sriyantra_bracelet2.webp?v=1756282989&width=200" },
  { id: "sriyantra", label: "Sriyantra", image: "https://justwowfactory.com/cdn/shop/files/MajesticSimplicityPyriteBraceletformen.webp?v=1743496608&width=200" },
  { id: "pyrite", label: "Pyrite", image: "https://justwowfactory.com/cdn/shop/collections/7_chakra_obsidian_bracelet_3.webp?v=1765620347&width=200" },
  { id: "shiva", label: "Shiva", image: "https://justwowfactory.com/cdn/shop/files/Divine_Shelter_Mahadev_Pendant_Rudraksha_Tiger_Eye_Mala_Mala.webp?v=1764667541&width=200" },
];

const TRENDING = [
  {
    tag: "2026 (Calm)",
    image: "https://justwowfactory.com/cdn/shop/files/2026_Five_Elements_Calm_Harmoniser_Bracelet1.webp?v=1762926421&width=1200",
    title: "Five Elements Calm Harmoniser Bracelet",
  },
  {
    tag: "2026 (Wealth)",
    image: "https://justwowfactory.com/cdn/shop/files/Five_ELements_Wealth_Harmoniser_BRACELET3.webp?v=1762926640&width=1200",
    title: "Five Elements Wealth Harmoniser Bracelet",
  },
];

export default function ShopPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [price, setPrice] = useState(2799);
  const [inStock, setInStock] = useState(false);
  const [types, setTypes] = useState([]);
  const [gems, setGems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Extract dynamic categories from products
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category || p.type).filter(Boolean))];
      const categoryCounts = uniqueCategories.map(cat => ({
        id: cat.toLowerCase().replace(/\s+/g, '-'),
        name: cat,
        count: products.filter(p => (p.category || p.type) === cat).length,
        icon: getCategoryIcon(cat),
      }));
      setDynamicCategories(categoryCounts);
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Rudraksha': '🌿',
      'Mala': '📿',
      'Bracelet': '⌚',
      'Necklace': '💎',
      'Rare': '✨',
      'Crystal': '🔮',
      'Pyrite': '🌟',
    };
    return icons[category] || '📦';
  };

  const toggle = (value, state, setState) => {
    setState(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value]
    );
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by selected category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => {
        const productCategory = (p.category || p.type).toLowerCase().replace(/\s+/g, '-');
        return productCategory === selectedCategory;
      });
    }
    
    // Filter by price
    filtered = filtered.filter((p) => p.price <= price);
    
    // Filter by stock
    if (inStock) {
      filtered = filtered.filter((p) => p.inStock);
    }
    
    // Filter by type
    if (types.length) {
      filtered = filtered.filter((p) => types.includes(p.type));
    }
    
    // Filter by gemstone
    if (gems.length) {
      filtered = filtered.filter((p) => gems.includes(p.gemstone));
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((p) => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || p.type)?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [products, selectedCategory, price, inStock, types, gems, searchQuery]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowMobileCategories(false);
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setPrice(2799);
    setInStock(false);
    setTypes([]);
    setGems([]);
    setSearchQuery("");
  };

  // Static categories for left sidebar
  const sidebarCategories = [
    { id: "all", name: "All Products", icon: "✨", count: products.length },
    ...dynamicCategories,
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-offWhite flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offWhite text-gray-800">
      {/* Search Bar - TOP of the page */}
      <div className="bg-white border-b border-orange-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name, category or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-xl border border-orange-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>


      {/* Main Shop Section with Filters on Left */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold"
          >
            <Filter size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
            <ChevronDown size={18} className={`transform transition ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* LEFT SIDE - Filters */}
          <aside className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            {/* Categories Section */}
            <div className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden sticky top-24">
              <div className="p-5 bg-gradient-to-r from-red-50 to-orange-50 border-b border-orange-100">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <Grid3x3 size={18} className="text-red-500" />
                  Categories
                </h3>
                <p className="text-xs text-gray-500 mt-1">Browse by category</p>
              </div>
              
              <div className="p-3 max-h-[400px] overflow-y-auto">
                {sidebarCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 mb-1 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-red-50 to-orange-50 text-red-600 border-l-4 border-red-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-red-500"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </span>
                    {category.count !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedCategory === category.id 
                          ? "bg-red-100 text-red-600" 
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {category.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 sticky top-24">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 border-b border-orange-100 pb-2 flex items-center gap-2">
                <Filter size={18} className="text-red-500" />
                Filters
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Availability</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={inStock} 
                      onChange={() => setInStock(!inStock)}
                      className="w-4 h-4 text-red-500 rounded border-orange-300 focus:ring-red-500"
                    /> 
                    <span className="text-gray-600">In Stock Only</span>
                  </label>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Price Range</h4>
                  <input
                    type="range"
                    min="0"
                    max="2799"
                    step="100"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>₹0</span>
                    <span>₹{price}</span>
                    <span>₹2799</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Product Type</h4>
                  {["Rudraksha", "Mala", "Necklace", "Bracelet", "108 Mala", "Rare"].map((t) => (
                    <label key={t} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        checked={types.includes(t)}
                        onChange={() => toggle(t, types, setTypes)}
                        type="checkbox"
                        className="w-4 h-4 text-red-500 rounded border-orange-300 focus:ring-red-500"
                      /> 
                      <span className="text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Gemstones</h4>
                  {["Clear Quartz", "Hematite", "Rudraksha", "Citrine"].map((g) => (
                    <label key={g} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        checked={gems.includes(g)}
                        onChange={() => toggle(g, gems, setGems)}
                        type="checkbox"
                        className="w-4 h-4 text-red-500 rounded border-orange-300 focus:ring-red-500"
                      /> 
                      <span className="text-gray-600">{g}</span>
                    </label>
                  ))}
                </div>

                <button 
                  onClick={clearAllFilters}
                  className="w-full mt-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT SIDE/CENTER - Products Grid */}
          <div>
            {/* Active Filters Display */}
            {(selectedCategory !== "all" || types.length > 0 || gems.length > 0 || inStock || price < 2799 || searchQuery) && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Active Filters:</span>
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                    {sidebarCategories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                    <button onClick={() => setSelectedCategory("all")} className="hover:text-red-800">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {inStock && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                    In Stock
                    <button onClick={() => setInStock(false)} className="hover:text-green-800">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {price < 2799 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                    Under ₹{price}
                    <button onClick={() => setPrice(2799)} className="hover:text-blue-800">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {types.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                    {t}
                    <button onClick={() => setTypes(types.filter(ty => ty !== t))} className="hover:text-purple-800">
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {gems.map(g => (
                  <span key={g} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-600 rounded-full text-xs">
                    {g}
                    <button onClick={() => setGems(gems.filter(gm => gm !== g))} className="hover:text-amber-800">
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <button onClick={clearAllFilters} className="text-sm text-red-500 hover:text-red-700">
                  Clear All
                </button>
              </div>
            )}

            {/* Result Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-700">{filteredProducts.length}</span> products
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <motion.div
                  key={p._id}
                  whileHover={{ y: -8 }}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-orange-100"
                  onClick={() => handleProductClick(p._id)}
                >
                  {p.discount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                      {p.discount}
                    </span>
                  )}

                  <div className="relative overflow-hidden group h-64">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    {p.inStock && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Added to cart!");
                        }}
                        className="absolute bottom-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Category Badge */}
                    <div className="mb-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {p.category || p.type}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-semibold leading-snug text-gray-800 line-clamp-2">
                      {p.name}
                    </h3>

                    <div className="flex text-yellow-500 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < (p.rating || 4) ? "currentColor" : "none"} />
                      ))}
                    </div>

                    <div className="text-sm">
                      {p.oldPrice && (
                        <span className="line-through mr-2 text-gray-400">
                          ₹{p.oldPrice}
                        </span>
                      )}
                      <span className="font-semibold text-red-600">
                        ₹{p.price}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔮</div>
                <p className="text-gray-500">No products found matching your criteria.</p>
                <button onClick={clearAllFilters} className="mt-4 text-red-500 hover:text-red-600 underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Overlay for mobile filters */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowFilters(false)} />
        )}
      </section>
    </div>
  );
}