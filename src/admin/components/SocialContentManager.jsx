import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlinePlus, 
  HiOutlinePencilAlt, 
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineEye,
  HiOutlineHeart,
  HiOutlinePhotograph,
  HiOutlineDocumentText,
  HiOutlineCloudUpload,
  HiOutlineExternalLink
} from 'react-icons/hi';
import { FaYoutube, FaInstagram, FaFileWord, FaImage, FaLink } from 'react-icons/fa';
import { 
  getAllSocialContent, 
  createSocialContent, 
  updateSocialContent, 
  deleteSocialContent,
  uploadImage
} from '../../services/api';
import toast from 'react-hot-toast';

const SocialContentManager = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [activeTab, setActiveTab] = useState('video');
  const [formData, setFormData] = useState({
    type: 'youtube',
    title: '',
    url: '',
    description: '',
    fileUrl: '',      // For blog post URL
    image: null,
    imagePreview: null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const data = await getAllSocialContent();
      setContents(data.content || []);
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
        url: content.url || '',
        description: content.description || '',
        fileUrl: content.fileUrl || '',
        image: null,
        imagePreview: content.imageUrl || null
      });
      if (content.type === 'blog') setActiveTab('blog');
      else if (content.type === 'gallery') setActiveTab('gallery');
      else setActiveTab('video');
    } else {
      setEditingContent(null);
      setFormData({
        type: 'youtube',
        title: '',
        url: '',
        description: '',
        fileUrl: '',
        image: null,
        imagePreview: null
      });
      setActiveTab('video');
    }
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, WEBP)');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: file, imagePreview: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToServer = async (file) => {
    const formDataObj = new FormData();
    formDataObj.append('image', file);
    
    try {
      const response = await uploadImage(formDataObj);
      console.log('Image upload response:', response);
      if (response.success || response.imageUrl) {
        return response.imageUrl || response.url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please fill all required fields');
      return;
    }

    if (activeTab === 'video' && !formData.url) {
      toast.error('Please enter video URL');
      return;
    }

    if (activeTab === 'blog' && !formData.fileUrl && !editingContent?.fileUrl) {
      toast.error('Please enter file URL');
      return;
    }

    if (activeTab === 'gallery' && !formData.image && !editingContent?.imageUrl) {
      toast.error('Please upload an image');
      return;
    }
    
    setUploading(true);
    try {
      let submitData = {
        title: formData.title,
        description: formData.description,
        type: activeTab === 'video' ? formData.type : activeTab,
      };

      if (activeTab === 'video') {
        submitData.url = formData.url;
      }
      
      if (activeTab === 'blog') {
        submitData.fileUrl = formData.fileUrl;
        submitData.fileName = formData.fileUrl.split('/').pop() || 'blog-file';
      }
      
      if (activeTab === 'gallery' && formData.image) {
        const imageUrl = await uploadImageToServer(formData.image);
        submitData.imageUrl = imageUrl;
      }
      
      console.log('Submitting data:', submitData);
      
      if (editingContent) {
        await updateSocialContent(editingContent._id, submitData);
        toast.success('Content updated successfully');
      } else {
        await createSocialContent(submitData);
        toast.success('Content created successfully');
      }
      setShowModal(false);
      fetchContents();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error(error.response?.data?.msg || 'Failed to save content');
    } finally {
      setUploading(false);
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

  const getContentIcon = (type) => {
    switch(type) {
      case 'youtube': return <FaYoutube className="text-red-500" />;
      case 'instagram': return <FaInstagram className="text-pink-500" />;
      case 'blog': return <FaFileWord className="text-blue-500" />;
      case 'gallery': return <FaImage className="text-green-500" />;
      default: return <HiOutlineDocumentText className="text-gray-500" />;
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
          <h3 className="text-xl font-semibold text-gray-800">Content Manager</h3>
          <p className="text-sm text-gray-500 mt-1">Manage videos, blog posts, and gallery images</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Content
        </button>
      </div>

      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('video')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'video' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📹 Videos
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'blog' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📝 Blog Posts
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'gallery' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🖼️ Gallery
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.filter(content => {
          if (activeTab === 'video') return content.type === 'youtube' || content.type === 'instagram';
          if (activeTab === 'blog') return content.type === 'blog';
          if (activeTab === 'gallery') return content.type === 'gallery';
          return true;
        }).map((content) => (
          <motion.div
            key={content._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-xl transition"
          >
            {content.type === 'gallery' && content.imageUrl && (
              <div className="h-48 overflow-hidden">
                <img src={content.imageUrl} alt={content.title} className="w-full h-full object-cover" />
              </div>
            )}
            
            {content.type === 'blog' && (
              <div className="h-32 bg-blue-50 flex items-center justify-center flex-col gap-2">
                <FaFileWord className="w-16 h-16 text-blue-500" />
                {content.fileUrl && (
                  <span className="text-xs text-gray-500 truncate max-w-[200px]">{content.fileUrl?.split('/').pop()}</span>
                )}
              </div>
            )}
            
            {(content.type === 'youtube' || content.type === 'instagram') && (
              <div className="h-48 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                {content.type === 'youtube' ? (
                  <FaYoutube className="w-20 h-20 text-white opacity-80" />
                ) : (
                  <FaInstagram className="w-20 h-20 text-white opacity-80" />
                )}
              </div>
            )}
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getContentIcon(content.type)}
                  <h4 className="font-semibold text-gray-800 line-clamp-1">{content.title}</h4>
                </div>
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
              </div>
              
              {content.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{content.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <HiOutlineEye className="w-4 h-4" />
                  {content.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <HiOutlineHeart className="w-4 h-4" />
                  {content.likes || 0}
                </span>
                <span>{new Date(content.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleOpenModal(content)}
                  className="flex-1 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(content._id)}
                  className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {contents.filter(content => {
          if (activeTab === 'video') return content.type === 'youtube' || content.type === 'instagram';
          if (activeTab === 'blog') return content.type === 'blog';
          if (activeTab === 'gallery') return content.type === 'gallery';
          return true;
        }).length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No content found. Click "Add Content" to get started.
          </div>
        )}
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
              className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
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

              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className={`px-4 py-2 font-medium transition ${
                    activeTab === 'video' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'
                  }`}
                >
                  Video Content
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('blog')}
                  className={`px-4 py-2 font-medium transition ${
                    activeTab === 'blog' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'
                  }`}
                >
                  Blog Post (File URL)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className={`px-4 py-2 font-medium transition ${
                    activeTab === 'gallery' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'
                  }`}
                >
                  Gallery Image
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Video Content Form */}
                {activeTab === 'video' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Platform *</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
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
                    </div>
                  </>
                )}

                {/* Blog Post Form - File URL Option (No File Upload) */}
                {activeTab === 'blog' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Understanding Vedic Astrology"
                        className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">File URL *</label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="url"
                            value={formData.fileUrl}
                            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                            placeholder="https://example.com/blog-post.docx or Google Drive link"
                            className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        🔗 Enter the direct URL of your Word document (Cloudinary, Google Drive, or any public URL)
                      </p>
                    </div>

                    {/* Show existing file URL if editing */}
                    {editingContent?.fileUrl && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 mb-1">Current File URL:</p>
                        <a 
                          href={editingContent.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline break-all flex items-center gap-1"
                        >
                          <HiOutlineExternalLink className="w-4 h-4" />
                          {editingContent.fileUrl}
                        </a>
                      </div>
                    )}
                  </>
                )}

                {/* Gallery Image Upload Form */}
                {activeTab === 'gallery' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Solar Eclipse Photography"
                        className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload *</label>
                      <div className="border-2 border-dashed border-orange-200 rounded-xl p-6 text-center hover:border-red-400 transition">
                        <input
                          type="file"
                          id="galleryImage"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label htmlFor="galleryImage" className="cursor-pointer block">
                          <HiOutlinePhotograph className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600">Click to upload image</p>
                          <p className="text-xs text-gray-400 mt-1">Supports JPEG, PNG, WEBP (Max 10MB)</p>
                        </label>
                      </div>
                      {formData.imagePreview && (
                        <div className="mt-3">
                          <img src={formData.imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Common Fields */}
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
                    disabled={uploading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </div>
                    ) : (
                      editingContent ? 'Update' : 'Create'
                    )}
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