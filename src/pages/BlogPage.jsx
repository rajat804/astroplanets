import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Eye, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllBlogs } from "../services/api";
import toast from "react-hot-toast";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [selectedTag, currentPage]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogs(selectedTag, currentPage, 9);
      setBlogs(data.blogs);
      setTags(data.tags || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-offWhite py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-red-600">Blog</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore articles on astrology, wellness, crystals, and spiritual growth
          </p>
        </div>

        {/* Tag Filter */}
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => {
                setSelectedTag('');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedTag === '' 
                  ? 'bg-red-500 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-red-100 border border-orange-200'
              }`}
            >
              All Posts
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(tag);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedTag === tag 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-red-100 border border-orange-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-gray-500">No articles found</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 transition-all group-hover:shadow-xl">
                      <div className="relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-56 w-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                          {post.tag}
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime} min read
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-2 group-hover:text-red-600 transition">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">By {post.author}</span>
                          <span className="text-red-600 font-semibold text-sm hover:underline">
                            Read More →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg bg-white border border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;