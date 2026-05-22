import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import dayjs from "dayjs";
import {
  Sparkles,
  Sunrise,
  Sunset,
  Moon,
  Stars,
  CalendarDays,
  Sun,
  Compass,
  TrendingUp,
  Heart,
} from "lucide-react";

const VastuCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [panchang, setPanchang] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("panchang");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchPanchang(date);
  }, []);

  const fetchPanchang = async (selectedDate) => {
    try {
      setLoading(true);
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
      const response = await axios.get(
        `${API_URL}/calendar?date=${formattedDate}`
      );
      setPanchang(response.data.data);
    } catch (error) {
      console.log("Error fetching panchang:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (value) => {
    setDate(value);
    fetchPanchang(value);
  };

  const tabs = [
    { id: "panchang", label: "Panchang", icon: <Moon className="w-4 h-4" /> },
    { id: "auspicious", label: "Auspicious Times", icon: <Sparkles className="w-4 h-4" /> },
    { id: "vastu", label: "Vastu Tips", icon: <Compass className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-yellow-500/10 blur-[180px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[180px] rounded-full animate-pulse-slower"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/5 blur-[200px] rounded-full"></div>
      
      {/* Floating Stars */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            opacity: Math.random() * 0.5,
          }}
        />
      ))}

      <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50"></div>
              <Sparkles className="text-yellow-400 w-8 h-8 md:w-10 md:h-10 relative animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              Vastu Panchang
            </h1>
          </div>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg">
            Discover celestial energies and auspicious timings
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Calendar Section */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 sm:p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <CalendarDays className="text-white w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Select Sacred Date
              </h2>
            </div>

            <div className="calendar-wrapper">
              <Calendar
                onChange={handleDateChange}
                value={date}
                className="custom-calendar w-full"
                tileClassName={({ date, view }) => {
                  if (view === 'month') {
                    const today = new Date();
                    if (date.toDateString() === today.toDateString()) {
                      return 'today-tile';
                    }
                  }
                  return null;
                }}
              />
            </div>

            {/* Quick Date Navigation */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {[-2, -1, 0, 1, 2].map((offset) => {
                const newDate = new Date();
                newDate.setDate(newDate.getDate() + offset);
                const isSelected = newDate.toDateString() === date.toDateString();
                return (
                  <button
                    key={offset}
                    onClick={() => handleDateChange(newDate)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {offset === 0 ? "Today" : dayjs(newDate).format("DD MMM")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Panel */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 md:py-4 text-sm md:text-base font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-b-2 border-yellow-500"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : panchang ? (
                <>
                  {/* Panchang Tab */}
                  {activeTab === "panchang" && (
                    <div className="space-y-5 md:space-y-6">
                      {/* Date Header */}
                      <div className="text-center pb-4 border-b border-white/10">
                        <p className="text-gray-400 text-xs sm:text-sm mb-1">Selected Date</p>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                          {dayjs(date).format("DD MMMM YYYY")}
                        </h2>
                        <p className="text-cyan-400 text-base sm:text-lg font-semibold mt-1">
                          {panchang.vaara}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                        {/* Tithi Card */}
                        <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl md:rounded-2xl p-4 md:p-5 hover:scale-105 transition-all duration-500">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                          <div className="flex items-center gap-2 mb-2">
                            <Moon className="text-yellow-300 w-5 h-5" />
                            <h3 className="font-bold text-gray-300">Tithi</h3>
                          </div>
                          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400">
                            {panchang.tithi?.[0]?.name}
                          </p>
                          <p className="text-gray-400 text-sm mt-1 capitalize">
                            {panchang.tithi?.[0]?.paksha}
                          </p>
                        </div>

                        {/* Nakshatra Card */}
                        <div className="group relative overflow-hidden bg-gradient-to-br from-pink-500/10 to-orange-500/10 border border-pink-500/20 rounded-xl md:rounded-2xl p-4 md:p-5 hover:scale-105 transition-all duration-500">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                          <div className="flex items-center gap-2 mb-2">
                            <Stars className="text-pink-300 w-5 h-5" />
                            <h3 className="font-bold text-gray-300">Nakshatra</h3>
                          </div>
                          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-400">
                            {panchang.nakshatra?.[0]?.name}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Lord: {panchang.nakshatra?.[0]?.lord?.name}
                          </p>
                        </div>
                      </div>

                      {/* Yoga and Karana */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                          <p className="text-gray-400 text-xs mb-1">Yoga</p>
                          <p className="text-base font-semibold text-green-400">
                            {panchang.yoga?.[0]?.name || "—"}
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                          <p className="text-gray-400 text-xs mb-1">Karana</p>
                          <p className="text-base font-semibold text-blue-400">
                            {panchang.karana?.[0]?.name || "—"}
                          </p>
                        </div>
                      </div>

                      {/* Sunrise Sunset */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Sunrise className="text-yellow-400 w-5 h-5" />
                            <h4 className="font-semibold">Sunrise</h4>
                          </div>
                          <p className="text-xl md:text-2xl font-bold text-yellow-300">
                            {dayjs(panchang.sunrise).format("hh:mm A")}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Sunset className="text-orange-400 w-5 h-5" />
                            <h4 className="font-semibold">Sunset</h4>
                          </div>
                          <p className="text-xl md:text-2xl font-bold text-orange-300">
                            {dayjs(panchang.sunset).format("hh:mm A")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Auspicious Times Tab */}
                  {activeTab === "auspicious" && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-green-400 mb-3">✨ Auspicious Timings</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-gray-300">Abhijit Muhurat</span>
                            <span className="text-yellow-400 font-semibold">
                              {panchang.abhijit || "12:00 PM - 12:45 PM"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-gray-300">Amrit Kaal</span>
                            <span className="text-yellow-400 font-semibold">
                              {panchang.amritKaal || "06:00 AM - 07:30 AM"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-300">Brahma Muhurat</span>
                            <span className="text-yellow-400 font-semibold">
                              {panchang.brahmaMuhurat || "04:30 AM - 05:15 AM"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-purple-400 mb-3">⚠️ Inauspicious Timings</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-gray-300">Rahu Kaal</span>
                            <span className="text-red-400 font-semibold">
                              {panchang.rahuKaal || "09:00 AM - 10:30 AM"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-gray-300">Yamaganda</span>
                            <span className="text-red-400 font-semibold">
                              {panchang.yamaganda || "12:00 PM - 01:30 PM"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-300">Gulika Kaal</span>
                            <span className="text-red-400 font-semibold">
                              {panchang.gulikaKaal || "03:00 PM - 04:30 PM"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vastu Tips Tab */}
                  {activeTab === "vastu" && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">🏠 Vastu Tips for Today</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <Compass className="w-5 h-5 text-cyan-400 mt-0.5" />
                            <span className="text-gray-300 text-sm">Face {panchang.direction || "East"} while working for better productivity</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Sun className="w-5 h-5 text-yellow-400 mt-0.5" />
                            <span className="text-gray-300 text-sm">Allow morning sunlight into your home office</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                            <span className="text-gray-300 text-sm">Keep the North-East zone clean and clutter-free</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Heart className="w-5 h-5 text-pink-400 mt-0.5" />
                            <span className="text-gray-300 text-sm">Use crystals or plants in the living room for positive energy</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/5 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-orange-400 mb-3">🌟 Today's Recommendation</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {panchang.recommendation || "Today is favorable for starting new ventures, home improvements, and spiritual practices. Avoid arguments and negative discussions."}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No data available for selected date</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 md:mt-12">
          <p className="text-gray-500 text-xs md:text-sm">
            Based on Vedic Astrology calculations | Timings are in IST
          </p>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.6; transform: scale(1); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
        
        .custom-calendar {
          width: 100%;
          background: transparent;
          border: none;
          color: white;
        }
        
        .custom-calendar .react-calendar__navigation {
          margin-bottom: 1rem;
        }
        
        .custom-calendar .react-calendar__navigation button {
          color: white;
          font-size: 1rem;
          font-weight: bold;
          background: rgba(255,255,255,0.05);
          border-radius: 0.75rem;
          padding: 0.5rem;
          transition: all 0.3s;
        }
        
        .custom-calendar .react-calendar__navigation button:hover {
          background: rgba(255,255,255,0.1);
        }
        
        .custom-calendar .react-calendar__month-view__weekdays {
          color: #9CA3AF;
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.5rem 0;
        }
        
        .custom-calendar .react-calendar__month-view__weekdays abbr {
          text-decoration: none;
        }
        
        .custom-calendar .react-calendar__tile {
          background: transparent;
          color: #e5e7eb;
          border-radius: 1rem;
          padding: 0.75rem 0.5rem;
          transition: all 0.3s;
          font-size: 0.875rem;
        }
        
        @media (min-width: 768px) {
          .custom-calendar .react-calendar__tile {
            padding: 1rem 0.5rem;
            font-size: 1rem;
          }
        }
        
        .custom-calendar .react-calendar__tile:hover {
          background: rgba(255,255,255,0.1);
          transform: scale(1.05);
        }
        
        .custom-calendar .react-calendar__tile--active {
          background: linear-gradient(135deg, #f59e0b, #ec4899) !important;
          color: white !important;
          box-shadow: 0 10px 20px -5px rgba(245, 158, 11, 0.3);
        }
        
        .custom-calendar .today-tile {
          background: rgba(59, 130, 246, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.5);
        }
        
        .custom-calendar .react-calendar__tile--now {
          background: rgba(59, 130, 246, 0.2);
        }
        
        .custom-calendar .react-calendar__navigation button:disabled {
          opacity: 0.5;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #f59e0b, #ec4899);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default VastuCalendar;