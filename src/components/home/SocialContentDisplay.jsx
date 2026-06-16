// components/SocialContentDisplay.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaYoutube, 
  FaInstagram, 
  FaFileWord, 
  FaImage,
  FaHeart,
  FaEye,
  FaShare,
  FaDownload,
  FaPlay,
  FaTimes,
  FaSpinner,
  FaFileAlt,
  FaGoogle
} from 'react-icons/fa';
import { 
  HiOutlineDocumentText,
  HiOutlineExternalLink
} from 'react-icons/hi';
import { 
  getActiveSocialContent, 
  incrementContentViews, 
  incrementContentLikes 
} from '../../services/api';
import toast from 'react-hot-toast';

const SocialContentDisplay = () => {
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedContent, setSelectedContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewedContent, setViewedContent] = useState(new Set());

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    filterContents();
  }, [activeTab, contents]);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const data = await getActiveSocialContent();
      console.log('Fetched contents:', data);
      
      if (data.success && data.content) {
        setContents(data.content);
      } else {
        setContents([]);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterContents = () => {
    if (activeTab === 'all') {
      setFilteredContents(contents);
    } else {
      setFilteredContents(contents.filter(content => content.type === activeTab));
    }
  };

  const getAvailableTabs = () => {
    const types = new Set(contents.map(c => c.type));
    return tabs.filter(tab => {
      if (tab.id === 'all') return true;
      return types.has(tab.id);
    });
  };

  const handleViewContent = async (content) => {
    setSelectedContent(content);
    setShowModal(true);
    
    // Only increment view once per session
    if (!viewedContent.has(content._id)) {
      try {
        await incrementContentViews(content._id);
        setViewedContent(prev => new Set([...prev, content._id]));
        setContents(prev => prev.map(c => 
          c._id === content._id ? { ...c, views: (c.views || 0) + 1 } : c
        ));
      } catch (error) {
        console.error('Error updating views:', error);
      }
    }
  };

  const handleLike = async (contentId, e) => {
    e.stopPropagation();
    try {
      await incrementContentLikes(contentId);
      setContents(prev => prev.map(c => 
        c._id === contentId ? { ...c, likes: (c.likes || 0) + 1 } : c
      ));
      if (selectedContent && selectedContent._id === contentId) {
        setSelectedContent(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      }
      toast.success('Thanks for your like!', {
        icon: '❤️',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error liking content:', error);
      toast.error('Failed to like');
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  // Google Docs Viewer - BEST SOLUTION for Word files
  const openInGoogleDocs = (fileUrl, title) => {
    if (!fileUrl) {
      toast.error('File URL not available');
      return;
    }
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    window.open(viewerUrl, '_blank', 'noopener,noreferrer');
    toast.success(`Opening "${title}" in Google Docs Viewer`, {
      icon: '📄',
      duration: 3000,
    });
  };

  const handleDownload = (fileUrl, fileName) => {
    if (!fileUrl) {
      toast.error('File URL not available');
      return;
    }
    window.open(fileUrl, '_blank');
    toast.success('Download started!', {
      icon: '⬇️',
      duration: 2000,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedContent?.title,
          text: selectedContent?.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  const tabs = [
    { id: 'all', label: 'All', icon: '📱', color: 'bg-gray-500' },
    { id: 'youtube', label: 'YouTube', icon: <FaYoutube className="text-red-500" />, color: 'bg-red-500' },
    { id: 'instagram', label: 'Instagram', icon: <FaInstagram className="text-pink-500" />, color: 'bg-pink-500' },
    { id: 'blog', label: 'Blog Posts', icon: <FaFileWord className="text-blue-500" />, color: 'bg-blue-500' },
    { id: 'gallery', label: 'Gallery', icon: <FaImage className="text-green-500" />, color: 'bg-green-500' }
  ];

  const availableTabs = getAvailableTabs();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading spiritual content...</p>
        </div>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mx-4">
        <div className="text-6xl mb-4">🌟</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon!</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          We're preparing inspiring spiritual content for you. Check back soon for videos, blogs, and more!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Spiritual Insights & Guidance
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of spiritual content including videos, blog posts, and inspiring images
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      {availableTabs.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? `${tab.color} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="text-xs ml-1">
                ({contents.filter(c => tab.id === 'all' || c.type === tab.id).length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Content Grid */}
      {filteredContents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No content available in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content, index) => (
            <motion.div
              key={content._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleViewContent(content)}
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {content.type === 'youtube' && (
                  <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <FaYoutube className="w-16 h-16 text-white opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition">
                        <FaPlay className="w-5 h-5 text-red-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
                
                {content.type === 'instagram' && (
                  <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <FaInstagram className="w-16 h-16 text-white opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition">
                        <FaPlay className="w-5 h-5 text-pink-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
                
                {content.type === 'blog' && (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center">
                    <FaFileWord className="w-16 h-16 text-blue-500 mb-2" />
                    <p className="text-blue-600 text-sm font-medium">Click to read</p>
                  </div>
                )}
                
                {content.type === 'gallery' && content.imageUrl && (
                  <>
                    <img 
                      src={content.imageUrl} 
                      alt={content.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
                  </>
                )}
                
                {/* Content Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg ${
                    content.type === 'youtube' ? 'bg-red-500 text-white' :
                    content.type === 'instagram' ? 'bg-pink-500 text-white' :
                    content.type === 'blog' ? 'bg-blue-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {content.type === 'youtube' && <FaYoutube className="w-3 h-3" />}
                    {content.type === 'instagram' && <FaInstagram className="w-3 h-3" />}
                    {content.type === 'blog' && <FaFileWord className="w-3 h-3" />}
                    {content.type === 'gallery' && <FaImage className="w-3 h-3" />}
                    <span>{content.type.charAt(0).toUpperCase() + content.type.slice(1)}</span>
                  </span>
                </div>
              </div>
              
              {/* Content Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-red-600 transition">
                  {content.title}
                </h3>
                
                {content.description && (
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                    {content.description}
                  </p>
                )}
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => handleLike(content._id, e)}
                      className="flex items-center gap-1 hover:text-red-500 transition"
                    >
                      <FaHeart className="hover:scale-110 transition" />
                      <span>{content.likes || 0}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <FaEye />
                      <span>{content.views || 0}</span>
                    </div>
                  </div>
                  <div className="text-xs">
                    {new Date(content.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for viewing content */}
      <AnimatePresence>
        {showModal && selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                  {selectedContent.title}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Video Content */}
                {(selectedContent.type === 'youtube' || selectedContent.type === 'instagram') && selectedContent.url && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={selectedContent.type === 'youtube' 
                        ? getYouTubeEmbedUrl(selectedContent.url)
                        : selectedContent.url
                      }
                      title={selectedContent.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                
                {/* Blog Content - Google Docs Viewer Button */}
                {selectedContent.type === 'blog' && (
                  <div className="text-center py-12">
                    <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaFileWord className="w-14 h-14 text-blue-500" />
                    </div>
                    
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">
                      {selectedContent.title}
                    </h4>
                    
                    {selectedContent.description && (
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        {selectedContent.description}
                      </p>
                    )}
                    
                    <div className="space-y-4">
                      <button
                        onClick={() => openInGoogleDocs(selectedContent.fileUrl, selectedContent.title)}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition shadow-lg text-lg font-semibold w-full sm:w-auto"
                      >
                        <FaGoogle className="w-6 h-6" />
                        Read with Google Docs
                      </button>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <button
                          onClick={() => handleDownload(selectedContent.fileUrl, selectedContent.fileName)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                          <FaDownload />
                          Download Blog Post
                        </button>
                        
                        <button
                          onClick={() => window.open(selectedContent.fileUrl, '_blank')}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                          <HiOutlineExternalLink />
                          Direct Link
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-6">
                      File: {selectedContent.fileName || 'Blog Post'} | 
                      Need Google account to view online
                    </p>
                  </div>
                )}
                
                {/* Gallery Image */}
                {selectedContent.type === 'gallery' && selectedContent.imageUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={selectedContent.imageUrl} 
                      alt={selectedContent.title}
                      className="w-full h-auto"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
                
                {/* Description for non-blog content */}
                {selectedContent.type !== 'blog' && selectedContent.description && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <HiOutlineDocumentText className="w-5 h-5" />
                      Description
                    </h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedContent.description}</p>
                  </div>
                )}
                
                {/* Share Section */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-gray-800 mb-3">Share this content</h4>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={handleShare}
                      className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-md"
                    >
                      <FaShare />
                      Share
                    </button>
                    <button 
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition shadow-md"
                    >
                      <HiOutlineExternalLink />
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Stats Footer */}
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => handleLike(selectedContent._id, e)}
                      className="flex items-center gap-1 hover:text-red-500 transition"
                    >
                      <FaHeart className="hover:scale-110 transition" />
                      <span>{selectedContent.likes || 0} likes</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <FaEye />
                      <span>{selectedContent.views || 0} views</span>
                    </div>
                  </div>
                  <div>
                    Posted on {new Date(selectedContent.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialContentDisplay;