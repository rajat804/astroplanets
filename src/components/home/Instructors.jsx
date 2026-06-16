// components/home/Instructors.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  Activity, 
  Compass, 
  Hand, 
  Star, 
  Calendar, 
  Award,
  Sparkles,
  Quote,
  X,
  User,
  Mail,
  Phone,
  Clock,
  MessageCircle,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Instructors = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch experts from API
  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/experts`);
      if (response.data.success) {
        setExperts(response.data.experts);
      }
    } catch (error) {
      console.error("Error fetching experts:", error);
      toast.error("Failed to load experts");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill user details when logged in
  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData(prev => ({
        ...prev,
        userName: user.fullName || user.name || "",
        userEmail: user.email || "",
        userPhone: user.phone || ""
      }));
    }
  }, [user, isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleViewProfile = (mentor) => {
    setSelectedMentor(mentor);
    setShowProfileModal(true);
  };

  const handleBookSession = (mentor) => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }
    setSelectedMentor(mentor);
    setShowBookingModal(true);
    setSubmitSuccess(false);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    if (!formData.preferredDate || !formData.preferredTime) {
      toast.error("Please select preferred date and time");
      return;
    }

    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await axios.post(`${API_URL}/expert-bookings/create`, {
        expertId: selectedMentor._id,
        expertName: selectedMentor.name,
        userId: user.id || user._id,
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.message
      });

      if (response.data.success) {
        setSubmitSuccess(true);
        toast.success("Booking request sent successfully!");
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setShowBookingModal(false);
          setSelectedMentor(null);
          setFormData({
            userName: "",
            userEmail: "",
            userPhone: "",
            preferredDate: "",
            preferredTime: "",
            message: ""
          });
          setSubmitSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Failed to book session");
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  const iconMap = {
    Compass: Compass,
    Hand: Hand,
    Activity: Activity,
    User: User,
    Star: Star
  };

  const getIcon = (iconName) => {
    const Icon = iconMap[iconName] || Compass;
    return <Icon className="w-5 h-5" />;
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM", "7:00 PM"
  ];

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-orange-50/50 to-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`bg-star-${i}`}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              delay: Math.random() * 5,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 px-4 py-2 rounded-full mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="text-red-500 w-4 h-4" />
            <span className="text-sm font-semibold text-red-600">Meet Our Masters</span>
          </motion.div>
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
            Our Spiritual Experts
          </h3>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Carefully selected practitioners with deep traditional knowledge and years of experience
          </p>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experts.map((mentor, i) => {
            const statsArray = mentor.stats ? Object.entries(mentor.stats) : [];
            
            return (
              <motion.div
                key={mentor._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                {/* Glow Effect */}
                <motion.div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${mentor.color} rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl`}
                />
                
                <div className={`relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-orange-100 ${mentor.bgColor}`}>
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Floating Icon */}
                    <motion.div
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-lg"
                      animate={{
                        y: [0, -5, 0],
                        rotate: [0, 10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className={mentor.iconColor}>
                        {getIcon(mentor.icon)}
                      </div>
                    </motion.div>

                    {/* Name Overlay */}
                    <motion.div
                      className="absolute bottom-4 left-4 right-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="text-white font-bold text-xl">{mentor.name}</h4>
                      <p className="text-white/80 text-sm">{mentor.role}</p>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-medium text-gray-600">{mentor.expertise}</span>
                    </div>

                    {/* Stats */}
                    {statsArray.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-orange-100">
                        {statsArray.map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-lg font-bold text-gray-900">{value}</div>
                            <div className="text-xs text-gray-500 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2">
                      {mentor.specialties?.slice(0, 3).map((specialty, idx) => {
                        const colorClass = mentor.iconColor?.split('-')[1] || 'orange';
                        return (
                          <motion.span
                            key={specialty}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`text-xs px-2 py-1 rounded-full bg-white border border-${colorClass}-200 text-${colorClass}-600`}
                          >
                            {specialty}
                          </motion.span>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <motion.button
                        onClick={() => handleViewProfile(mentor)}
                        className="flex-1 px-4 py-2 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-all duration-300 text-sm flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Quote className="w-3 h-3" />
                        View Profile
                      </motion.button>
                      <motion.button
                        onClick={() => handleBookSession(mentor)}
                        className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 text-sm flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Calendar className="w-3 h-3" />
                        Book Session
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full">
            <Star className="w-4 h-4 text-purple-500 fill-purple-500" />
            <span className="text-sm font-semibold text-purple-700">
              "Ancient wisdom meets modern guidance — Transform your life today"
            </span>
            <Star className="w-4 h-4 text-purple-500 fill-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && selectedMentor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Profile content remains same */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-full p-2 shadow-lg hover:bg-white transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="grid md:grid-cols-2">
                  <div className="relative h-96 md:h-full">
                    <img
                      src={selectedMentor.image}
                      alt={selectedMentor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-auto md:top-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{selectedMentor.name}</h3>
                      <p className="text-white/90">{selectedMentor.role}</p>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-semibold text-gray-700">{selectedMentor.expertise}</span>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">About</h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {selectedMentor.intro}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMentor.specialties?.map((specialty) => (
                          <span
                            key={specialty}
                            className="text-sm px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                      {selectedMentor.stats && Object.entries(selectedMentor.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal with Animated Submit Button */}
      <AnimatePresence>
        {showBookingModal && selectedMentor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-full p-2 shadow-lg hover:bg-white transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-orange-100 mb-4">
                      <Calendar className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Book Session with</h3>
                    <p className="text-xl font-semibold text-red-600 mt-1">{selectedMentor.name}</p>
                    <p className="text-gray-500 text-sm mt-1">{selectedMentor.role}</p>
                  </div>

                  {submitSuccess ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
                      >
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Request Sent!</h3>
                      <p className="text-gray-600">We'll contact you shortly to confirm your session.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmitBooking} className="space-y-4">
                      {/* Expert Name Display */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-sm text-gray-500">Expert</p>
                        <p className="font-semibold text-gray-800">{selectedMentor.name}</p>
                      </div>

                      {/* User Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            name="userEmail"
                            value={formData.userEmail}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            name="userPhone"
                            value={formData.userPhone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="date"
                              name="preferredDate"
                              value={formData.preferredDate}
                              onChange={handleInputChange}
                              required
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                              name="preferredTime"
                              value={formData.preferredTime}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none"
                            >
                              <option value="">Select time</option>
                              {timeSlots.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message / Questions</label>
                        <div className="relative">
                          <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            placeholder="Any specific questions or requirements..."
                          />
                        </div>
                      </div>

                      {/* Animated Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        animate={{
                          opacity: submitting ? 0.8 : 1,
                        }}
                      >
                        {submitting ? (
                          <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                          </motion.div>
                        ) : (
                          <motion.span
                            className="flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Calendar className="w-4 h-4" />
                            Submit Booking Request
                          </motion.span>
                        )}
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Instructors;