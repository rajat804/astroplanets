// src/pages/RashiDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaHeart,
  FaBriefcase,
  FaMoneyBillWave,
  FaLeaf,
  FaGem,
  FaDownload,
  FaShare,
  FaPrint,
  FaStar,
  FaMoon,
  FaSun,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import { GiCrystalBall } from "react-icons/gi";

const RashiDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [rashi, setRashi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchRashiDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/rashifal/${slug}`);
        
        if (response.data.success && response.data.rashi) {
          setRashi(response.data.rashi);
          console.log("Rashi details:", response.data.rashi);
        } else {
          toast.error("Rashi not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching rashi details:", error);
        toast.error("Failed to load rashi details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchRashiDetail();
    }
  }, [slug, navigate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${rashi?.name} Rashi Fal`,
        text: `Check out ${rashi?.name} rashi predictions`,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaStar /> },
    { id: "yearly", label: "Yearly", icon: <FaCalendarAlt /> },
    { id: "monthly", label: "Monthly", icon: <FaMoon /> },
    { id: "weekly", label: "Weekly", icon: <FaClock /> },
    { id: "daily", label: "Daily", icon: <FaSun /> },
    { id: "details", label: "Details", icon: <FaChartLine /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rashi details...</p>
        </div>
      </div>
    );
  }

  if (!rashi) return null;

  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  const monthNames = {
    january: "January", february: "February", march: "March", april: "April",
    may: "May", june: "June", july: "July", august: "August",
    september: "September", october: "October", november: "November", december: "December"
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition" />
          Back to Home
        </button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center gap-6 flex-wrap">
            {/* Symbol */}
            <div
              className="text-7xl md:text-8xl w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br"
              style={{
                background: `linear-gradient(135deg, ${rashi.color}20, ${rashi.color}10)`,
                color: rashi.color,
              }}
            >
              {rashi.symbol}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {rashi.name} <span className="text-gray-500">({rashi.name_hi})</span>
              </h1>
              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {rashi.element} Sign
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                  ♀ Ruling: {rashi.ruling_planet}
                </span>
                {rashi.dates && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    📅 {rashi.dates}
                  </span>
                )}
              </div>
              <div className="flex gap-4 mt-3 text-sm text-gray-600">
                {rashi.lucky_color && (
                  <span>🎨 Lucky Color: {rashi.lucky_color}</span>
                )}
                {rashi.lucky_number && (
                  <span>🔢 Lucky Number: {rashi.lucky_number}</span>
                )}
              </div>
              {rashi.mantra && (
                <p className="mt-3 text-purple-600 font-medium">
                  🔮 Mantra: {rashi.mantra}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                title="Share"
              >
                <FaShare className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handlePrint}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                title="Print"
              >
                <FaPrint className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Traits */}
              {rashi.traits && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FaStar className="text-yellow-500" /> Personality Traits
                  </h3>
                  <p className="text-gray-600">{rashi.traits}</p>
                </div>
              )}

              {/* Health, Career, Love, Finance Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rashi.health && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FaHeart className="text-green-600" />
                      <h4 className="font-semibold text-gray-800">Health</h4>
                    </div>
                    <div
                      className="text-gray-600 text-sm"
                      dangerouslySetInnerHTML={{ __html: rashi.health }}
                    />
                  </div>
                )}
                {rashi.career && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FaBriefcase className="text-blue-600" />
                      <h4 className="font-semibold text-gray-800">Career</h4>
                    </div>
                    <div
                      className="text-gray-600 text-sm"
                      dangerouslySetInnerHTML={{ __html: rashi.career }}
                    />
                  </div>
                )}
                {rashi.love && (
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FaHeart className="text-pink-600" />
                      <h4 className="font-semibold text-gray-800">Love & Relationship</h4>
                    </div>
                    <div
                      className="text-gray-600 text-sm"
                      dangerouslySetInnerHTML={{ __html: rashi.love }}
                    />
                  </div>
                )}
                {rashi.finance && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMoneyBillWave className="text-green-600" />
                      <h4 className="font-semibold text-gray-800">Finance</h4>
                    </div>
                    <div
                      className="text-gray-600 text-sm"
                      dangerouslySetInnerHTML={{ __html: rashi.finance }}
                    />
                  </div>
                )}
              </div>

              {/* Remedies */}
              {rashi.remedies && (
                <div className="p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FaLeaf className="text-amber-600" />
                    <h4 className="font-semibold text-gray-800">Remedies</h4>
                  </div>
                  <div
                    className="text-gray-600 text-sm"
                    dangerouslySetInnerHTML={{ __html: rashi.remedies }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Yearly Tab */}
          {activeTab === "yearly" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaCalendarAlt className="text-purple-600" />
                <h3 className="text-lg font-bold text-gray-800">
                  Yearly Predictions {new Date().getFullYear()}
                </h3>
              </div>
              {rashi.yearly_predictions ? (
                <div
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: rashi.yearly_predictions }}
                />
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No yearly predictions available yet.
                </p>
              )}
            </div>
          )}

          {/* Monthly Tab */}
          {activeTab === "monthly" && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMoon className="text-purple-600" /> Monthly Predictions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {months.map((month) => {
                  const prediction = rashi.monthly_predictions?.[month];
                  if (!prediction) return null;
                  return (
                    <div key={month} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                      <h4 className="font-bold text-purple-700 mb-2 capitalize">
                        {monthNames[month]}
                      </h4>
                      <div
                        className="text-gray-600 text-sm line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: prediction }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weekly Tab */}
          {activeTab === "weekly" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaClock className="text-purple-600" />
                <h3 className="text-lg font-bold text-gray-800">Weekly Predictions</h3>
              </div>
              {rashi.weekly_predictions ? (
                <div
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: rashi.weekly_predictions }}
                />
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No weekly predictions available yet.
                </p>
              )}
            </div>
          )}

          {/* Daily Tab */}
          {activeTab === "daily" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaSun className="text-purple-600" />
                <h3 className="text-lg font-bold text-gray-800">Daily Predictions</h3>
              </div>
              {rashi.daily_predictions ? (
                <div
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: rashi.daily_predictions }}
                />
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No daily predictions available yet.
                </p>
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Rashi Name</p>
                  <p className="font-semibold">{rashi.name} ({rashi.name_hi})</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Symbol</p>
                  <p className="font-semibold text-2xl">{rashi.symbol}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Element</p>
                  <p className="font-semibold">{rashi.element}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Ruling Planet</p>
                  <p className="font-semibold">{rashi.ruling_planet}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Dates</p>
                  <p className="font-semibold">{rashi.dates || "N/A"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Lucky Color</p>
                  <p className="font-semibold">{rashi.lucky_color || "N/A"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Lucky Number</p>
                  <p className="font-semibold">{rashi.lucky_number || "N/A"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Mantra</p>
                  <p className="font-semibold">{rashi.mantra || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Related Rashis - Quick Navigation */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Other Rashis</h3>
          <div className="flex flex-wrap gap-2">
            {["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"].map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/rashifal/${s}`)}
                className={`px-4 py-2 rounded-full text-sm capitalize transition ${
                  s === slug
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .group, button:not(.no-print) {
            display: none !important;
          }
          body {
            background: white;
          }
          .shadow-lg, .shadow-md {
            box-shadow: none !important;
          }
          .bg-gray-50, .bg-white {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RashiDetail;