import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlinePlus, 
  HiOutlinePencilAlt, 
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineEye,
  HiOutlineHeart
} from 'react-icons/hi';
import { FaYoutube, FaInstagram } from 'react-icons/fa';
import { 
  getAllSocialContent, 
  createSocialContent, 
  updateSocialContent, 
  deleteSocialContent 
} from '../../services/api';
import toast from 'react-hot-toast';

const SocialContentManager = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    type: 'youtube',
    title: '',
    url: '',
    description: '',
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const data = await getAllSocialContent();
      setContents(data.content);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (content = null) => {
    if (content) {
      setEditingContent(content);
      setFormData({
        type: content.type,
        title: content.title,
        url: content.url,
        description: content.description || '',
      });
    } else {
      setEditingContent(null);
      setFormData({
        type: 'youtube',
        title: '',
        url: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      if (editingContent) {
        await updateSocialContent(editingContent._id, formData);
        toast.success('Content updated successfully');
      } else {
        await createSocialContent(formData);
        toast.success('Content created successfully');
      }
      setShowModal(false);
      fetchContents();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error(error.response?.data?.msg || 'Failed to save content');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    
    try {
      await deleteSocialContent(id);
      toast.success('Content deleted successfully');
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const handleToggleStatus = async (content) => {
    try {
      await updateSocialContent(content._id, { isActive: !content.isActive });
      toast.success(`Content ${content.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchContents();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Social Media Content</h3>
          <p className="text-sm text-gray-500 mt-1">Manage YouTube videos and Instagram reels</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Content
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Title/Embed</th>
                <th className="px-6 py-4">Stats</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {contents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No content found. Click "Add Content" to create your first post.
                  </td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr key={content._id} className="hover:bg-orange-50 transition">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        content.type === 'youtube' ? 'bg-red-100 text-red-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {content.type === 'youtube' ? <FaYoutube /> : <FaInstagram />}
                        {content.type === 'youtube' ? 'YouTube' : 'Instagram'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-800">{content.title}</div>
                        <div className="text-xs text-gray-500 font-mono">ID: {content.embedId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <HiOutlineEye className="w-4 h-4" />
                          {content.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiOutlineHeart className="w-4 h-4" />
                          {content.likes || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(content)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          content.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {content.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(content)}
                          className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
                        >
                          <HiOutlinePencilAlt className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(content._id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-gray-800">
                  {editingContent ? 'Edit Content' : 'Add New Content'}
                </h4>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={!!editingContent}
                  >
                    <option value="youtube">YouTube Video</option>
                    <option value="instagram">Instagram Reel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Weekly Astrology Forecast"
                    className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.type === 'youtube' ? 'YouTube URL *' : 'Instagram Reel URL *'}
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder={formData.type === 'youtube' 
                      ? 'https://youtube.com/watch?v=...' 
                      : 'https://instagram.com/reel/...'}
                    className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.type === 'youtube' 
                      ? 'Paste any YouTube video URL' 
                      : 'Paste any Instagram Reel URL'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    placeholder="Brief description of the content..."
                    className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-orange-200 rounded-xl text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-md"
                  >
                    {editingContent ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialContentManager;