import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Eye, Clock, Heart, ArrowLeft, Share2 } from "lucide-react";
import { getBlogBySlug, likeBlog } from "../services/api";
import toast from "react-hot-toast";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const data = await getBlogBySlug(slug);
      setBlog(data.blog);
      setRelatedBlogs(data.relatedBlogs || []);
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (liked) return;
    try {
      await likeBlog(blog._id);
      setBlog({ ...blog, likes: blog.likes + 1 });
      setLiked(true);
      toast.success('Thanks for liking!');
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-offWhite flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-offWhite flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Article not found</p>
          <Link to="/blog" className="mt-4 text-red-500 hover:underline inline-block">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-offWhite py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-orange-100">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-96 object-cover"
          />

          <div className="p-8 md:p-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                {blog.tag}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-orange-100">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {blog.readTime} min read
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {blog.views} views
              </span>
              <span className="flex items-center gap-2">
                By {blog.author}
              </span>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              {blog.content.split('\n').map((paragraph, idx) => (
                paragraph.trim() && (
                  <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-orange-100">
              <button
                onClick={handleLike}
                disabled={liked}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  liked
                    ? 'bg-red-500 text-white'
                    : 'bg-orange-50 text-gray-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {blog.likes} Likes
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-gray-700 hover:bg-red-50 hover:text-red-600 transition font-medium"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedBlogs.map((related) => (
                <Link key={related._id} to={`/blog/${related.slug}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-xl transition group">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="h-40 w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-red-600 transition">
                        {related.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {related.excerpt}
                      </p>
                      <div className="mt-3 text-xs text-gray-400">
                        {new Date(related.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailPage;