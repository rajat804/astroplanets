import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getAllBlogs } from "../../services/api";
import { Calendar, Eye, Clock } from "lucide-react";

const BlogPreview = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [selectedTag]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogs(selectedTag, 1, 3);
      setBlogs(data.blogs);
      setTags(data.tags || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-offWhite">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold mb-6 text-red-600">Latest Articles</h3>
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-offWhite">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-red-600">Latest Articles</h3>
          
          {/* Tag Filter */}
          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-4 sm:mt-0">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  selectedTag === '' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-red-100'
                }`}
              >
                All
              </button>
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    selectedTag === tag 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-red-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-500">No articles found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {blogs.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-orange-100 bg-white transition-all group-hover:shadow-xl">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {post.tag}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
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
                      <h4 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">By {post.author}</span>
                        <button className="text-red-600 font-semibold text-sm hover:underline">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition shadow-md"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;