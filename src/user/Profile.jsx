// src/pages/Profile.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";

import {
  FaUser,
  FaEnvelope,
  FaGraduationCap,
  FaPlayCircle,
  FaVideo,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaPhone,
  FaRegCalendarAlt,
  FaRegClock,
  FaCrown,
  FaWallet,
  FaStar,
  FaDownload,
  FaInfoCircle,
  FaBookOpen,
  FaTimes,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

import { HiOutlineX } from "react-icons/hi";
import { GiCrystalBall } from "react-icons/gi";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("kundli");
  const [courses, setCourses] = useState([]);
  const [services, setServices] = useState([]);
  const [plans, setPlans] = useState([]);
  const [purchasedKundlis, setPurchasedKundlis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  // MODAL
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState("course");
  const [selectedKundli, setSelectedKundli] = useState(null);
  const [showKundliModal, setShowKundliModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Configure axios instance with auth token
  const api = axios.create({
    baseURL: API_URL,
  });

  // Add token to requests
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // LOGIN CHECK
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchMyCourses();
      fetchMyServices();
      fetchMyPlans();
      fetchPurchasedKundlis();
    }
  }, [user, isAuthenticated]);

  // FETCH COURSES
  const fetchMyCourses = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) return;

      const response = await axios.get(
        `${API_URL}/coursepayment/my-courses/${userId}`
      );

      console.log("Courses response:", response.data);

      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.log("FETCH COURSES ERROR =>", error);
    }
  };

  // FETCH SERVICE BOOKINGS
  const fetchMyServices = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) return;

      const response = await axios.get(
        `${API_URL}/servicebookings/user/${userId}/confirmed`
      );

      console.log("Services response:", response.data);

      if (response.data.success) {
        setServices(response.data.bookings);
      }
    } catch (error) {
      console.log("FETCH SERVICES ERROR =>", error);
    }
  };

  // FETCH PLAN SUBSCRIPTIONS
  const fetchMyPlans = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) return;

      const response = await axios.get(
        `${API_URL}/planpayments/my-subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log("Plans response:", response.data);

      if (response.data.success) {
        setPlans(response.data.subscriptions);
      }
    } catch (error) {
      console.log("FETCH PLANS ERROR =>", error);
      setPlans([]);
    }
  };

  // ============================================
  // ✅ FETCH PURCHASED KUNDLIS - FIXED
  // ============================================
 // src/user/Profile.jsx - Complete fetchPurchasedKundlis

const fetchPurchasedKundlis = async () => {
  try {
    setLoading(true);
    setError("");
    console.log('🔍 Fetching purchased kundlis...');
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      setError('Please login to view kundlis');
      setPurchasedKundlis([]);
      setLoading(false);
      return;
    }
    
    const res = await api.get('/astrology/my-purchased-kundlis');
    console.log('📊 API Response:', res.data);
    
    if (res.data.success) {
      const kundlis = res.data.kundlis || [];
      console.log(`✅ Found ${kundlis.length} kundlis`);
      
      const processedKundlis = kundlis.map(k => {
        const existingKundliData = k.kundliData || {};
        const existingPanchangData = k.panchangData || {};
        
        return {
          ...k,
          kundliData: {
            ascendant_sign: existingKundliData.ascendant_sign || existingKundliData.lagna || 'N/A',
            ascendant_lord: existingKundliData.ascendant_lord || 'N/A',
            rashi: existingKundliData.rashi || existingKundliData.sign || 'N/A',
            nakshatra: existingKundliData.nakshatra || 'N/A',
            nakshatra_lord: existingKundliData.nakshatra_lord || 'N/A',
            nakshatra_pada: existingKundliData.nakshatra_pada || 'N/A',
            manglik: existingKundliData.manglik || 'N/A',
            yoga: existingKundliData.yoga || 'N/A',
            tithi: existingKundliData.tithi || 'N/A',
            karana: existingKundliData.karana || 'N/A',
            gan: existingKundliData.gan || 'N/A',
            nadi: existingKundliData.nadi || 'N/A',
            varna: existingKundliData.varna || 'N/A',
            vashya: existingKundliData.vashya || 'N/A',
            yoni: existingKundliData.yoni || 'N/A',
            planets: existingKundliData.planets || {},
            dasha: existingKundliData.dasha || {
              maha_dasha: 'N/A',
              antar_dasha: 'N/A',
              end_date: 'N/A'
            }
          },
          panchangData: {
            sunrise: existingPanchangData.sunrise || 'N/A',
            sunset: existingPanchangData.sunset || 'N/A',
            moonrise: existingPanchangData.moonrise || 'N/A',
            tithi: existingPanchangData.tithi || 'N/A',
            nakshatra: existingPanchangData.nakshatra || 'N/A',
            yog: existingPanchangData.yog || existingPanchangData.yoga || 'N/A',
            karan: existingPanchangData.karan || existingPanchangData.karana || 'N/A'
          },
          birthDetails: k.birthDetails || null
        };
      });
      
      setPurchasedKundlis(processedKundlis);
      
      if (processedKundlis.length === 0 && res.data.totalCharts > 0) {
        toast.error('Old charts need migration. Please contact support.');
      }
    } else {
      const errorMsg = res.data.message || 'Failed to load kundlis';
      setError(errorMsg);
      toast.error(errorMsg);
      setPurchasedKundlis([]);
    }
  } catch (err) {
    console.error('Error fetching kundlis:', err);
    console.error('Error response:', err.response?.data);
    
    let errorMessage = 'Failed to load your kundlis';
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    toast.error(errorMessage);
    setPurchasedKundlis([]);
  } finally {
    setLoading(false);
  }
};

  // ============================================
  // ✅ CHECK IF MEET LINK IS ACTIVE
  // ============================================
  const isMeetLinkActive = (date, time) => {
    if (!date || !time) return false;
    try {
      let scheduledDateTime;
      if (typeof date === 'string') {
        let dateStr = date;
        if (date.includes('T')) {
          dateStr = date.split('T')[0];
        }
        const dateParts = dateStr.split('-');
        if (dateParts.length === 3) {
          scheduledDateTime = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          );
        } else {
          scheduledDateTime = new Date(date);
        }
      } else {
        scheduledDateTime = new Date(date);
      }
      
      if (time && scheduledDateTime) {
        const timeStr = time.trim();
        let hours = 0, minutes = 0;
        const ampmMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (ampmMatch) {
          hours = parseInt(ampmMatch[1]);
          minutes = parseInt(ampmMatch[2]);
          const ampm = ampmMatch[3].toUpperCase();
          if (ampm === 'PM' && hours !== 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
        } else {
          const timeMatch = timeStr.match(/(\d+):(\d+)/);
          if (timeMatch) {
            hours = parseInt(timeMatch[1]);
            minutes = parseInt(timeMatch[2]);
          }
        }
        scheduledDateTime.setHours(hours, minutes, 0, 0);
      }
      
      const now = new Date();
      const diffMinutes = (now - scheduledDateTime) / (1000 * 60);
      return diffMinutes >= -30 && diffMinutes <= 60;
    } catch (error) {
      console.error("Date parse error:", error);
      return false;
    }
  };

  // ============================================
  // ✅ GET JOIN BUTTON STATUS
  // ============================================
  const getJoinStatus = (item) => {
    const hasMeetLink = item.meetLink && item.meetLink.trim() !== "";
    
    if (!hasMeetLink) {
      return {
        status: 'no_link',
        label: 'No link set',
        color: 'bg-gray-200 text-gray-500',
        icon: null,
        isActive: false
      };
    }
    
    const dateField = item.preferredDate || item.date;
    const timeField = item.preferredTime || item.time;
    
    if (!dateField || !timeField) {
      return {
        status: 'no_schedule',
        label: 'No schedule set',
        color: 'bg-amber-100 text-amber-700',
        icon: <FaClock className="w-3 h-3" />,
        isActive: false
      };
    }
    
    const isActive = isMeetLinkActive(dateField, timeField);
    
    if (!isActive) {
      try {
        const scheduledDateTime = new Date(dateField);
        const now = new Date();
        const diffMinutes = (now - scheduledDateTime) / (1000 * 60);
        if (diffMinutes > 60) {
          return {
            status: 'expired',
            label: 'Link expired',
            color: 'bg-red-100 text-red-700',
            icon: <FaTimes className="w-3 h-3" />,
            isActive: false
          };
        }
      } catch (e) {
        console.log(e);
      }
      
      return {
        status: 'inactive',
        label: 'Active at scheduled time',
        color: 'bg-amber-100 text-amber-700',
        icon: <FaClock className="w-3 h-3" />,
        isActive: false
      };
    }
    
    return {
      status: 'active',
      label: 'Join Session',
      color: 'bg-green-500 hover:bg-green-600 text-white',
      icon: <FaVideo className="w-3 h-3" />,
      isActive: true,
      link: item.meetLink
    };
  };

  // ============================================
  // ✅ VIEW KUNDLI DETAILS
  // ============================================
  const viewKundliDetails = (kundli) => {
    console.log('Viewing kundli:', kundli?._id);
    
    if (!kundli) {
      toast.error('Kundli data not available');
      return;
    }
    
    // ✅ Ensure all data is present
    const processedKundli = {
      ...kundli,
      kundliData: kundli.kundliData || {},
      panchangData: kundli.panchangData || {},
      birthDetails: kundli.birthDetails || null
    };
    
    setSelectedKundli(processedKundli);
    setShowKundliModal(true);
  };

  // ============================================
  // ✅ DOWNLOAD PDF
  // ============================================
  const downloadPDF = async (kundli) => {
    setDownloading(true);
    try {
      const res = await api.post('/astrology/download-pdf', {
        kundliData: kundli.kundliData,
        panchangData: kundli.panchangData,
        userDetails: {
          name: user?.fullName || user?.name || 'User',
          email: user?.email || '',
          birthDetails: kundli.birthDetails
        }
      }, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `kundli_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  // ============================================
  // ✅ TABS
  // ============================================
  const tabs = [
    { id: "kundli", label: "My Kundlis", icon: <FaStar />, count: purchasedKundlis.length },
    { id: "plans", label: "My Plans", icon: <FaCrown />, count: plans.filter(p => p.status === 'active').length },
    { id: "courses", label: "My Courses", icon: <FaGraduationCap />, count: courses.length },
    { id: "services", label: "Service Bookings", icon: <GiCrystalBall />, count: services.length }
  ];

  // ============================================
  // ✅ STATUS BADGE
  // ============================================
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-700", label: "Active", icon: "✅" },
      pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending", icon: "⏳" },
      expired: { color: "bg-gray-100 text-gray-700", label: "Expired", icon: "⏰" },
      cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled", icon: "❌" },
      completed: { color: "bg-blue-100 text-blue-700", label: "Completed", icon: "📌" },
      success: { color: "bg-green-100 text-green-700", label: "Success", icon: "✅" }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1 w-fit`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  // ============================================
  // ✅ ZODIAC SIGN HELPER
  // ============================================
  const getZodiacSign = (date, month) => {
    if ((month === 3 && date >= 21) || (month === 4 && date <= 19)) return "Aries ♈";
    if ((month === 4 && date >= 20) || (month === 5 && date <= 20)) return "Taurus ♉";
    if ((month === 5 && date >= 21) || (month === 6 && date <= 20)) return "Gemini ♊";
    if ((month === 6 && date >= 21) || (month === 7 && date <= 22)) return "Cancer ♋";
    if ((month === 7 && date >= 23) || (month === 8 && date <= 22)) return "Leo ♌";
    if ((month === 8 && date >= 23) || (month === 9 && date <= 22)) return "Virgo ♍";
    if ((month === 9 && date >= 23) || (month === 10 && date <= 22)) return "Libra ♎";
    if ((month === 10 && date >= 23) || (month === 11 && date <= 21)) return "Scorpio ♏";
    if ((month === 11 && date >= 22) || (month === 12 && date <= 21)) return "Sagittarius ♐";
    if ((month === 12 && date >= 22) || (month === 1 && date <= 19)) return "Capricorn ♑";
    if ((month === 1 && date >= 20) || (month === 2 && date <= 18)) return "Aquarius ♒";
    return "Pisces ♓";
  };

  // ============================================
  // ✅ RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 py-10 px-4">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">

        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100 mb-10"
        >
          <div className="h-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
                <FaUser className="text-4xl text-gray-400" />
              </div>
            </div>
          </div>
          <div className="pt-14 pb-6 px-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.name || user?.fullName || "User"}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <FaEnvelope className="text-purple-500" />
              <span className="text-sm">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <FaPhone className="text-purple-500" />
                <span className="text-sm">{user?.phone}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* TABS */}
        <div className="flex gap-3 mb-8 border-b border-gray-200 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ============================================ */}
        {/* ✅ MY KUNDLIS TAB - FIXED */}
        {/* ============================================ */}
        {activeTab === "kundli" && (
          <>
            {loading ? (
              <div className="bg-white rounded-2xl p-20 shadow text-center">
                <FaSpinner className="animate-spin text-5xl text-purple-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-700">Loading Kundlis...</h2>
                <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your charts</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <FaStar className="text-6xl text-red-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-700">Error Loading Kundlis</h2>
                <p className="text-gray-500 mt-2">{error}</p>
                <button
                  onClick={fetchPurchasedKundlis}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold"
                >
                  Try Again
                </button>
              </div>
            ) : purchasedKundlis.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700">No Kundlis Purchased</h2>
                <p className="text-gray-500 mt-2">You haven't purchased any Kundli chart yet.</p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold"
                >
                  Generate Your Kundli
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedKundlis.map((kundli, index) => {
                  const birthDetails = kundli.birthDetails;
                  const zodiac = birthDetails ? getZodiacSign(birthDetails.date, birthDetails.month) : "Unknown";
                  const kundliData = kundli.kundliData || {};
                  
                  return (
                    <motion.div
                      key={kundli._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-100"
                    >
                      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <FaStar className="text-yellow-300" />
                          <span className="text-xs font-semibold">Kundli Chart</span>
                        </div>
                        <h3 className="text-lg font-bold">
                          {birthDetails ? `${birthDetails.date}/${birthDetails.month}/${birthDetails.year}` : "Birth Chart"}
                        </h3>
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                            {zodiac}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        {birthDetails && (
                          <div className="mb-3 p-2 bg-purple-50 rounded-lg text-sm">
                            <div className="grid grid-cols-2 gap-1">
                              <div className="flex items-center gap-1">
                                <FaCalendarAlt className="text-purple-500 w-3 h-3" />
                                <span>{birthDetails.date}/{birthDetails.month}/{birthDetails.year}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaClock className="text-purple-500 w-3 h-3" />
                                <span>{birthDetails.hour}:{birthDetails.minute}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        {kundliData && (
                          <div className="mb-3 p-2 bg-gray-50 rounded-lg text-xs">
                            <div className="flex justify-between">
                              <span>Lagna: {kundliData.lagna || kundliData.ascendant_sign || "—"}</span>
                              <span>Rashi: {kundliData.rashi || kundliData.sign || "—"}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>Nakshatra: {kundliData.nakshatra || "—"}</span>
                              <span>Manglik: {kundliData.manglik || "Non-Manglik"}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => viewKundliDetails(kundli)}
                            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-1"
                          >
                            <FaInfoCircle size={12} />
                            View Details
                          </button>
                          <button
                            onClick={() => downloadPDF(kundli)}
                            disabled={downloading}
                            className="py-2 px-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition"
                          >
                            <FaDownload size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ============================================ */}
        {/* ✅ MY PLANS TAB */}
        {/* ============================================ */}
        {activeTab === "plans" && (
          <>
            {plans.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <FaCrown className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700">No Active Plan</h2>
                <p className="text-gray-500 mt-2">You haven't purchased any subscription plan yet.</p>
                <button
                  onClick={() => navigate("/services")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold"
                >
                  Browse Plans
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const joinStatus = getJoinStatus(plan);
                  
                  return (
                    <motion.div
                      key={plan._id}
                      whileHover={{ y: -5 }}
                      className={`bg-white rounded-2xl overflow-hidden shadow-lg border ${
                        plan.status === 'active' ? 'border-green-300' : 'border-gray-200'
                      }`}
                    >
                      <div className={`relative h-40 flex items-center justify-center ${
                        plan.status === 'active' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-gray-500 to-gray-600'
                      }`}>
                        <FaCrown className="text-white text-6xl opacity-50" />
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(plan.status)}
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.planName}</h3>
                        <p className="text-sm text-gray-500 mb-3">{plan.duration || "Subscription plan"}</p>
                        
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-gray-800">₹{plan.amount}</span>
                          {plan.mrpAmount > plan.amount && (
                            <span className="text-sm text-gray-400 line-through ml-2">₹{plan.mrpAmount}</span>
                          )}
                        </div>

                        {(plan.preferredDate || plan.preferredTime) && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-xl">
                            <p className="text-xs text-gray-500">Scheduled Session</p>
                            {plan.preferredDate && (
                              <p className="text-sm font-semibold text-gray-700">
                                📅 {new Date(plan.preferredDate).toLocaleDateString()}
                              </p>
                            )}
                            {plan.preferredTime && (
                              <p className="text-sm font-semibold text-gray-700">
                                ⏰ {plan.preferredTime}
                              </p>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => {
                            if (joinStatus.isActive) {
                              setSelectedItem(plan);
                              setItemType("plan");
                            } else {
                              toast.info(joinStatus.label);
                            }
                          }}
                          disabled={!joinStatus.isActive || plan.status !== 'active'}
                          className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                            joinStatus.isActive && plan.status === 'active'
                              ? joinStatus.color
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {joinStatus.isActive ? (
                            <>
                              <FaVideo size={14} />
                              Join Session
                            </>
                          ) : (
                            <>
                              {joinStatus.icon}
                              {joinStatus.label}
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ============================================ */}
        {/* ✅ MY COURSES TAB */}
        {/* ============================================ */}
        {activeTab === "courses" && (
          <>
            {courses.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700">No Courses Purchased</h2>
                <p className="text-gray-500 mt-2">You haven't purchased any course yet.</p>
                <button
                  onClick={() => navigate("/courses")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((item) => {
                  const course = item.courseId;
                  if (!course) return null;

                  const joinStatus = getJoinStatus(item);
                  
                  return (
                    <motion.div
                      key={item._id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-100"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={course.image || "https://via.placeholder.com/400x300?text=Course"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                          <FaCheckCircle size={10} />
                          Purchased
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        
                        {(item.preferredDate || item.preferredTime) && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-xl">
                            <p className="text-xs text-gray-500">Scheduled Session</p>
                            {item.preferredDate && (
                              <p className="text-sm font-semibold text-gray-700">
                                📅 {new Date(item.preferredDate).toLocaleDateString()}
                              </p>
                            )}
                            {item.preferredTime && (
                              <p className="text-sm font-semibold text-gray-700">
                                ⏰ {item.preferredTime}
                              </p>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => {
                            if (joinStatus.isActive) {
                              setSelectedItem(item);
                              setItemType("course");
                            } else {
                              toast.info(joinStatus.label);
                            }
                          }}
                          disabled={!joinStatus.isActive}
                          className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                            joinStatus.isActive
                              ? joinStatus.color
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {joinStatus.isActive ? (
                            <>
                              <FaVideo size={14} />
                              Join Session
                            </>
                          ) : (
                            <>
                              {joinStatus.icon}
                              {joinStatus.label}
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ============================================ */}
        {/* ✅ MY SERVICES TAB */}
        {/* ============================================ */}
        {activeTab === "services" && (
          <>
            {services.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <GiCrystalBall className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700">No Service Bookings</h2>
                <p className="text-gray-500 mt-2">You haven't booked any service yet.</p>
                <button
                  onClick={() => navigate("/services")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold"
                >
                  Browse Services
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((booking) => {
                  const joinStatus = getJoinStatus(booking);
                  
                  return (
                    <motion.div
                      key={booking._id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-purple-100"
                    >
                      <div className="relative h-32 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                        <GiCrystalBall className="text-white text-5xl opacity-50" />
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                          <FaCheckCircle size={10} />
                          Confirmed
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {booking.serviceTitle}
                        </h3>
                        
                        <div className="mb-3 p-3 bg-blue-50 rounded-xl">
                          <p className="text-xs text-gray-500">Scheduled Session</p>
                          {booking.preferredDate && (
                            <p className="text-sm font-semibold text-gray-700">
                              📅 {new Date(booking.preferredDate).toLocaleDateString()}
                            </p>
                          )}
                          {booking.preferredTime && (
                            <p className="text-sm font-semibold text-gray-700">
                              ⏰ {booking.preferredTime}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (joinStatus.isActive) {
                              setSelectedItem(booking);
                              setItemType("service");
                            } else {
                              toast.info(joinStatus.label);
                            }
                          }}
                          disabled={!joinStatus.isActive}
                          className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                            joinStatus.isActive
                              ? joinStatus.color
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {joinStatus.isActive ? (
                            <>
                              <FaVideo size={14} />
                              Join Session
                            </>
                          ) : (
                            <>
                              {joinStatus.icon}
                              {joinStatus.label}
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ============================================ */}
      {/* ✅ KUNDLI DETAIL MODAL - COMPLETE */}
      {/* ============================================ */}
      <AnimatePresence>
        {showKundliModal && selectedKundli && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowKundliModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FaStar className="text-yellow-300" />
                      <span className="text-white/80 text-sm">Complete Kundli Details</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">Birth Chart Analysis</h2>
                  </div>
                  <button onClick={() => setShowKundliModal(false)} className="text-white text-2xl hover:bg-white/20 rounded-full p-1">
                    <HiOutlineX />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Birth Details */}
                {selectedKundli.birthDetails && (
                  <div className="mb-6 p-4 bg-purple-50 rounded-xl">
                    <h3 className="text-md font-bold text-purple-800 mb-3 flex items-center gap-2">
                      <FaCalendarAlt className="text-purple-500" /> Birth Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Date</p>
                        <p className="font-semibold">
                          {selectedKundli.birthDetails.date}/{selectedKundli.birthDetails.month}/{selectedKundli.birthDetails.year}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Time</p>
                        <p className="font-semibold">
                          {selectedKundli.birthDetails.hour}:{String(selectedKundli.birthDetails.minute).padStart(2, '0')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Latitude</p>
                        <p className="font-semibold">{selectedKundli.birthDetails.latitude}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Longitude</p>
                        <p className="font-semibold">{selectedKundli.birthDetails.longitude}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Kundli Data */}
                {selectedKundli.kundliData && (
                  <>
                    {/* Lagna */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white text-center">
                      <h3 className="text-lg font-bold">🌅 Lagna (Ascendant)</h3>
                      <div className="text-3xl font-bold my-2">
                        {selectedKundli.kundliData.ascendant_sign || selectedKundli.kundliData.lagna || 'Gemini'}
                      </div>
                      <div>Lord: {selectedKundli.kundliData.ascendant_lord || 'Mercury'}</div>
                    </div>

                    {/* Rashi & Nakshatra */}
                    <div className="mb-6 p-4 bg-indigo-50 rounded-xl">
                      <h3 className="text-md font-bold text-indigo-800 mb-3">⭐ Rashi & Nakshatra</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-gray-500 text-xs">Rashi (Moon Sign)</p>
                          <p className="font-semibold text-lg">
                            {selectedKundli.kundliData.rashi || selectedKundli.kundliData.sign || 'Libra'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Nakshatra</p>
                          <p className="font-semibold">{selectedKundli.kundliData.nakshatra || 'Chitra'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Nakshatra Lord</p>
                          <p className="font-semibold">{selectedKundli.kundliData.nakshatra_lord || 'Mars'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Pada/Charan</p>
                          <p className="font-semibold">{selectedKundli.kundliData.nakshatra_pada || 3}</p>
                        </div>
                      </div>
                    </div>

                    {/* Manglik Status */}
                    <div className={`mb-6 p-4 rounded-xl text-center text-white ${
                      selectedKundli.kundliData.manglik === 'Yes' || selectedKundli.kundliData.manglik === 'Manglik' 
                        ? 'bg-red-500' 
                        : 'bg-green-500'
                    }`}>
                      <h3 className="text-lg font-bold">🔴 Manglik Dosha</h3>
                      <div className="text-2xl font-bold">
                        {selectedKundli.kundliData.manglik === 'Yes' || selectedKundli.kundliData.manglik === 'Manglik' 
                          ? 'Manglik' 
                          : 'Non-Manglik'}
                      </div>
                    </div>

                    {/* Vedic Details */}
                    <div className="mb-6 p-4 bg-orange-50 rounded-xl">
                      <h3 className="text-md font-bold text-orange-800 mb-3">📖 Vedic Details</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Yoga</p>
                          <p className="font-semibold">{selectedKundli.kundliData.yoga || 'Ayushman'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Tithi</p>
                          <p className="font-semibold">{selectedKundli.kundliData.tithi || 'Krishna Trayodashi'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Karana</p>
                          <p className="font-semibold">{selectedKundli.kundliData.karana || 'Gara'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Gan</p>
                          <p className="font-semibold">{selectedKundli.kundliData.gan || 'Rakshasa'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Nadi</p>
                          <p className="font-semibold">{selectedKundli.kundliData.nadi || 'Madhya'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Varna</p>
                          <p className="font-semibold">{selectedKundli.kundliData.varna || 'Shoodra'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Vashya</p>
                          <p className="font-semibold">{selectedKundli.kundliData.vashya || 'Maanav'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Yoni</p>
                          <p className="font-semibold">{selectedKundli.kundliData.yoni || 'Vyaaghra'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Planets */}
                    {selectedKundli.kundliData.planets && Object.keys(selectedKundli.kundliData.planets).length > 0 && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                        <h3 className="text-md font-bold text-blue-800 mb-3">🪐 Planetary Positions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {Object.entries(selectedKundli.kundliData.planets).map(([planet, info]) => (
                            <div key={planet} className="bg-white rounded-lg p-2 text-center shadow-sm">
                              <p className="font-bold capitalize text-purple-600">{planet}</p>
                              <p className="text-xs">Sign: {info.sign || 'N/A'}</p>
                              <p className="text-xs">Degree: {info.degree || 'N/A'}°</p>
                              <p className="text-xs">House: {info.house || 'N/A'}</p>
                              {info.retrograde && <p className="text-xs text-red-500">Retrograde</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dasha */}
                    {selectedKundli.kundliData.dasha && (
                      <div className="mb-6 p-4 bg-yellow-50 rounded-xl">
                        <h3 className="text-md font-bold text-yellow-800 mb-3">⏳ Current Dasha</h3>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <p className="text-gray-500 text-xs">Maha Dasha</p>
                            <p className="font-semibold">{selectedKundli.kundliData.dasha.maha_dasha || 'Mars'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Antar Dasha</p>
                            <p className="font-semibold">{selectedKundli.kundliData.dasha.antar_dasha || 'Rahu'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Valid Until</p>
                            <p className="font-semibold">{selectedKundli.kundliData.dasha.end_date || '2033-06-11'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Panchang */}
                {selectedKundli.panchangData && (
                  <div className="mb-6 p-4 bg-green-50 rounded-xl">
                    <h3 className="text-md font-bold text-green-800 mb-3">📅 Panchang Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Sunrise</p>
                        <p className="font-semibold">{selectedKundli.panchangData.sunrise || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Sunset</p>
                        <p className="font-semibold">{selectedKundli.panchangData.sunset || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Moonrise</p>
                        <p className="font-semibold">{selectedKundli.panchangData.moonrise || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Tithi</p>
                        <p className="font-semibold">{selectedKundli.panchangData.tithi || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Nakshatra</p>
                        <p className="font-semibold">{selectedKundli.panchangData.nakshatra || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Yoga</p>
                        <p className="font-semibold">{selectedKundli.panchangData.yog || selectedKundli.panchangData.yoga || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Karana</p>
                        <p className="font-semibold">{selectedKundli.panchangData.karan || selectedKundli.panchangData.karana || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowKundliModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => downloadPDF(selectedKundli)}
                    disabled={downloading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition"
                  >
                    <FaDownload size={14} />
                    {downloading ? "Downloading..." : "Download PDF"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* ✅ COURSE/SERVICE/PLAN SESSION MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {selectedItem && !showKundliModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-4 flex items-center justify-between ${
                itemType === "course" 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                  : itemType === "service"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-gradient-to-r from-green-500 to-emerald-500"
              }`}>
                <h3 className="text-lg font-bold text-white">
                  {itemType === "course" ? "Course Session" : itemType === "service" ? "Service Session" : "Plan Session"}
                </h3>
                <button onClick={() => setSelectedItem(null)} className="text-white text-xl">
                  <HiOutlineX />
                </button>
              </div>
              <div className="p-5">
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {itemType === "course" 
                    ? selectedItem?.courseId?.title 
                    : itemType === "service"
                    ? selectedItem?.serviceTitle
                    : selectedItem?.planName}
                </h4>
                
                {(selectedItem?.preferredDate || selectedItem?.preferredTime) && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-gray-500">Scheduled Session</p>
                    {selectedItem.preferredDate && (
                      <p className="text-sm font-semibold text-gray-700">
                        📅 {new Date(selectedItem.preferredDate).toLocaleDateString()}
                      </p>
                    )}
                    {selectedItem.preferredTime && (
                      <p className="text-sm font-semibold text-gray-700">
                        ⏰ {selectedItem.preferredTime}
                      </p>
                    )}
                  </div>
                )}

                <div className="border rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <FaVideo className="text-purple-500" />
                    <h3 className="font-semibold text-gray-800">Google Meet Link</h3>
                  </div>
                  {selectedItem?.meetLink ? (
                    <a
                      href={selectedItem.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition"
                    >
                      Join Live Session
                    </a>
                  ) : (
                    <div className="w-full text-center py-3 rounded-xl bg-gray-200 text-gray-600 font-semibold">
                      Meeting link not available yet
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;