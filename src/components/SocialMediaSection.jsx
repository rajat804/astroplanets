import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Eye, Instagram, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSocialContentByType, incrementContentViews, incrementContentLikes } from '../services/api';
import toast from 'react-hot-toast';

const SocialMediaSection = () => {
  const [activeTab, setActiveTab] = useState('youtube');
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [instagramReels, setInstagramReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [youtubePage, setYoutubePage] = useState(1);
  const [instagramPage, setInstagramPage] = useState(1);
  const [youtubePagination, setYoutubePagination] = useState(null);
  const [instagramPagination, setInstagramPagination] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [activeTab, youtubePage, instagramPage]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'youtube') {
        const data = await getSocialContentByType('youtube', youtubePage, 6);
        setYoutubeVideos(data.content);
        setYoutubePagination(data.pagination);
      } else {
        const data = await getSocialContentByType('instagram', instagramPage, 6);
        setInstagramReels(data.content);
        setInstagramPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      await incrementContentViews(id);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleLike = async (id) => {
    try {
      await incrementContentLikes(id);
      toast.success('Thanks for your reaction!');
      fetchContent();
    } catch (error) {
      console.error('Error liking:', error);
    }
  };

  const handlePageChange = (direction) => {
    if (activeTab === 'youtube') {
      if (direction === 'next' && youtubePage < youtubePagination?.totalPages) {
        setYoutubePage(youtubePage + 1);
      } else if (direction === 'prev' && youtubePage > 1) {
        setYoutubePage(youtubePage - 1);
      }
    } else {
      if (direction === 'next' && instagramPage < instagramPagination?.totalPages) {
        setInstagramPage(instagramPage + 1);
      } else if (direction === 'prev' && instagramPage > 1) {
        setInstagramPage(instagramPage - 1);
      }
    }
  };

  const renderYouTubeEmbed = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const renderInstagramEmbed = (embedId) => {
    return `https://www.instagram.com/reel/${embedId}/embed`;
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-red-50 via-orange-50 to-offWhite">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Follow Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
            Our <span className="text-red-600">Cosmic Content</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch our videos and reels for spiritual insights, astrology tips, and cosmic wisdom
          </p>
        </motion.div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'youtube'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-red-50 border border-orange-200'
            }`}
          >
            <Youtube className="w-5 h-5" />
            YouTube Videos
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'instagram'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-red-50 border border-orange-200'
            }`}
          >
            <Instagram className="w-5 h-5" />
            Instagram Reels
          </button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === 'youtube' ? (
                youtubeVideos.map((video, index) => (
                  <motion.div
                    key={video._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-xl transition group"
                  >
                    <div className="relative aspect-video bg-gray-900">
                      <iframe
                        src={renderYouTubeEmbed(video.embedId)}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => handleView(video._id)}
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {video.views || 0}
                          </span>
                          <button
                            onClick={() => handleLike(video._id)}
                            className="flex items-center gap-1 hover:text-red-500 transition"
                          >
                            <Heart className="w-4 h-4" />
                            {video.likes || 0}
                          </button>
                        </div>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          Watch on YouTube →
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                instagramReels.map((reel, index) => (
                  <motion.div
                    key={reel._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-xl transition group"
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-purple-500 to-pink-500">
                      <iframe
                        src={renderInstagramEmbed(reel.embedId)}
                        title={reel.title}
                        className="w-full h-full"
                        allowFullScreen
                        onLoad={() => handleView(reel._id)}
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {reel.title}
                      </h3>
                      {reel.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {reel.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {reel.views || 0}
                          </span>
                          <button
                            onClick={() => handleLike(reel._id)}
                            className="flex items-center gap-1 hover:text-red-500 transition"
                          >
                            <Heart className="w-4 h-4" />
                            {reel.likes || 0}
                          </button>
                        </div>
                        <a
                          href={reel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          View on Instagram →
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Pagination */}
            {(activeTab === 'youtube' && youtubePagination?.totalPages > 1) ||
             (activeTab === 'instagram' && instagramPagination?.totalPages > 1) ? (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={(activeTab === 'youtube' && youtubePage === 1) || (activeTab === 'instagram' && instagramPage === 1)}
                  className="p-2 rounded-lg bg-white border border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-gray-600">
                  Page {activeTab === 'youtube' ? youtubePage : instagramPage} of{' '}
                  {activeTab === 'youtube' ? youtubePagination?.totalPages : instagramPagination?.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={
                    (activeTab === 'youtube' && youtubePage === youtubePagination?.totalPages) ||
                    (activeTab === 'instagram' && instagramPage === instagramPagination?.totalPages)
                  }
                  className="p-2 rounded-lg bg-white border border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};

export default SocialMediaSection;