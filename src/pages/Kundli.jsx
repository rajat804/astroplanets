// src/pages/AstrologyPage.jsx

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaSearch, 
  FaLocationArrow,
  FaStar,
  FaMoon,
  FaSun,
  FaDownload,
  FaArrowLeft
} from 'react-icons/fa';

const AstrologyPage = () => {
  const { getToken, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [kundliData, setKundliData] = useState(null);
  const [panchangData, setPanchangData] = useState(null);
  const [activeView, setActiveView] = useState('form');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [searchingCity, setSearchingCity] = useState(false);
  
  const isProcessingRef = useRef(false);

  const [formData, setFormData] = useState({
    date: '', month: '', year: '', hour: '', minute: '',
    latitude: '', longitude: '', timezone: '5.5',
    city: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const getAuthToken = () => {
    try {
      if (typeof getToken === 'function') {
        return getToken();
      }
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    } catch (err) {
      console.log(err);
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
  };

  const api = axios.create({ baseURL: API_BASE_URL });
  api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    setGettingLocation(true);
    toast.loading('Getting your location...', { id: 'location' });
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6)
        }));
        toast.success(`Location set successfully!`, { id: 'location' });
        setGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timeout';
            break;
          default:
            errorMessage = 'Unknown location error';
        }
        toast.error(errorMessage, { id: 'location' });
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const searchCity = async () => {
    if (!formData.city.trim()) return toast.error('Enter city name');
    setSearchingCity(true);
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: formData.city, format: 'json', limit: 1 }
      });
      if (res.data?.length > 0) {
        const loc = res.data[0];
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(loc.lat).toFixed(6),
          longitude: parseFloat(loc.lon).toFixed(6)
        }));
        toast.success(`✅ ${loc.display_name.split(',')[0]} selected`);
      } else toast.error('City not found');
    } catch (err) {
      console.log(err);
      toast.error('Search failed');
    } finally {
      setSearchingCity(false);
    }
  };

  const popularCities = [
    { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
    { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 }
  ];

  const selectPopularCity = (city) => {
    setFormData(prev => ({
      ...prev,
      city: city.name,
      latitude: city.lat.toString(),
      longitude: city.lon.toString()
    }));
    toast.success(`${city.name} selected`);
  };

  // Direct Kundli Generation - FREE (No Payment)
  const generateKundli = async (e) => {
    e.preventDefault();
    
    if (isProcessingRef.current) return;
    
    const dateNum = parseInt(formData.date);
    const monthNum = parseInt(formData.month);
    const yearNum = parseInt(formData.year);
    const hourNum = parseInt(formData.hour);
    const minuteNum = parseInt(formData.minute);
    const latNum = parseFloat(formData.latitude);
    const lonNum = parseFloat(formData.longitude);
    
    if (isNaN(dateNum) || dateNum < 1 || dateNum > 31) {
      toast.error('Please enter a valid date (1-31)');
      return;
    }
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      toast.error('Please enter a valid month (1-12)');
      return;
    }
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      toast.error(`Please enter a valid year (1900-${new Date().getFullYear()})`);
      return;
    }
    if (isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
      toast.error('Please enter a valid hour (0-23)');
      return;
    }
    if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
      toast.error('Please enter a valid minute (0-59)');
      return;
    }
    if (isNaN(latNum) || isNaN(lonNum)) {
      toast.error('Please select a location');
      return;
    }
    
    const token = getAuthToken();
    if (!token && !isAuthenticated) {
      localStorage.setItem('redirect_after_login', '/astrology');
      toast.error('Please login to generate Kundli');
      navigate('/auth');
      return;
    }

    const requestData = {
      date: dateNum, month: monthNum, year: yearNum,
      hour: hourNum, minute: minuteNum,
      latitude: latNum, longitude: lonNum,
      timezone: parseFloat(formData.timezone)
    };
    
    isProcessingRef.current = true;
    setLoading(true);
    
    try {
      const res = await api.post('/astrology/generate', requestData);
      if (res.data.success) {
        const kundli = res.data.kundli;
        const panchang = res.data.panchang;
        
        setKundliData(kundli);
        setPanchangData(panchang);
        setActiveView('kundli');
        
        // Save to user's profile automatically (FREE)
        try {
          await api.post('/astrology/save-purchased-kundli', {
            kundliData: kundli,
            panchangData: panchang,
            birthDetails: requestData
          });
          toast.success('✨ Kundli saved to your profile!');
        } catch (saveErr) {
          console.error('Failed to save kundli:', saveErr);
        }
        
        toast.success('✨ Kundli Generated Successfully!');
      } else {
        toast.error(res.data.message || 'Failed to generate Kundli');
      }
    } catch (err) {
      console.error('Generation error:', err);
      toast.error('Error generating kundli. Please try again.');
    } finally {
      setLoading(false);
      isProcessingRef.current = false;
    }
  };

  const downloadPDF = async () => {
    if (!kundliData) return;
    
    setLoading(true);
    try {
      const res = await api.post('/astrology/download-pdf', {
        kundliData,
        panchangData,
        userDetails: {
          name: user?.fullName || 'User',
          email: user?.email || '',
          birthDetails: formData
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
      setLoading(false);
    }
  };

  const getValue = (obj, keys, defaultValue = 'N/A') => {
    if (!obj) return defaultValue;
    const keyArray = Array.isArray(keys) ? keys : [keys];
    for (const key of keyArray) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        return obj[key];
      }
    }
    return defaultValue;
  };

  const renderForm = () => (
    <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-10 max-w-4xl mx-auto shadow-lg border border-orange-100">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🔮</div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Generate Your Free Kundli</h1>
        <p className="text-gray-500 text-sm md:text-base mt-2">Discover your cosmic blueprint with accurate Vedic astrology – Absolutely Free!</p>
      </div>

      <form onSubmit={generateKundli}>
        {/* Date of Birth */}
        <div className="bg-orange-50 p-4 md:p-5 rounded-xl mb-4 border border-orange-100">
          <div className="flex items-center gap-2 mb-3">
            <FaCalendarAlt className="text-red-500 text-lg" />
            <h3 className="font-semibold text-gray-700">Date of Birth</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input type="number" name="date" placeholder="DD" value={formData.date} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none" required />
            <input type="number" name="month" placeholder="MM" value={formData.month} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none" required />
            <input type="number" name="year" placeholder="YYYY" value={formData.year} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none" required />
          </div>
        </div>

        {/* Time of Birth */}
        <div className="bg-orange-50 p-4 md:p-5 rounded-xl mb-4 border border-orange-100">
          <div className="flex items-center gap-2 mb-3">
            <FaClock className="text-red-500 text-lg" />
            <h3 className="font-semibold text-gray-700">Time of Birth</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input type="number" name="hour" placeholder="Hour (0-23)" value={formData.hour} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none" required />
            <input type="number" name="minute" placeholder="Minute (0-59)" value={formData.minute} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none" required />
            <select name="timezone" value={formData.timezone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none bg-white">
              <option value="5.5">India (IST) +5:30</option>
              <option value="0">UTC</option>
            </select>
          </div>
        </div>

        {/* Place of Birth */}
        <div className="bg-orange-50 p-4 md:p-5 rounded-xl mb-4 border border-orange-100">
          <div className="flex items-center gap-2 mb-3">
            <FaMapMarkerAlt className="text-red-500 text-lg" />
            <h3 className="font-semibold text-gray-700">Place of Birth</h3>
          </div>

          {/* City chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {popularCities.map((city, i) => (
              <button key={i} type="button" onClick={() => selectPopularCity(city)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm text-gray-700 transition">
                {city.name}
              </button>
            ))}
          </div>

          {/* Search city */}
          <div className="px-3 py-2 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 rounded-full">
            <input type="text" name="city" placeholder="Enter City Name" value={formData.city} onChange={handleChange} className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none" />
            <button type="button" onClick={searchCity} disabled={searchingCity} className="px-4 py-3 bg-emerald-500 text-white rounded-lg flex items-center gap-1 hover:bg-emerald-600 transition disabled:opacity-50">
              <FaSearch /> {searchingCity ? '...' : 'Search'}
            </button>
          </div>

          {/* Latitude / Longitude / My Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <input type="number" step="any" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} className="flex-1 min-w-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none" required />
            <input type="number" step="any" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} className="flex-1 min-w-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none" required />
            <button type="button" onClick={getCurrentLocation} disabled={gettingLocation} className="px-4 py-3 bg-amber-500 text-white rounded-lg flex items-center gap-1 hover:bg-amber-600 transition disabled:opacity-50">
              <FaLocationArrow /> {gettingLocation ? 'Getting...' : 'My Location'}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg rounded-xl hover:shadow-lg transition disabled:opacity-50">
          {loading ? '✨ Generating Your Kundli... ✨' : '✨ Generate Your Free Kundli ✨'}
        </button>
      </form>
    </div>
  );

  const renderKundli = () => {
    const data = kundliData || {};
    
    return (
      <div className="bg-white rounded-2xl p-6 md:p-10 max-w-4xl mx-auto shadow-lg border border-orange-100">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📊 Your Kundli</h2>
            <p className="text-gray-500 text-sm">Detailed astrological analysis</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setActiveView('panchang')} className="px-4 py-2 bg-amber-500 text-white rounded-lg flex items-center gap-1 hover:bg-amber-600 transition">
              <FaMoon /> Panchang
            </button>
            <button onClick={() => setActiveView('form')} className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-1 hover:bg-gray-600 transition">
              <FaArrowLeft /> New
            </button>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-2xl text-center mb-6 border border-red-200">
          <div className="text-4xl mb-2">🌅</div>
          <div className="text-sm text-red-600">Lagna (Ascendant)</div>
          <div className="text-3xl font-bold text-red-600">
            {getValue(data, ['ascendant_sign', 'lagna', 'ascendant', 'sign'], 'N/A')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-200">
            <div className="text-3xl mb-1">⭐</div>
            <div className="text-sm text-gray-600">Rashi (Moon Sign)</div>
            <div className="text-xl font-bold text-gray-800">{getValue(data, ['sign', 'rashi', 'moon_sign'], 'N/A')}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-200">
            <div className="text-3xl mb-1">🌟</div>
            <div className="text-sm text-gray-600">Nakshatra (Birth Star)</div>
            <div className="text-xl font-bold text-gray-800">{getValue(data, ['nakshatra', 'Naksahtra'], 'N/A')}</div>
            <div className="text-xs text-gray-500 mt-1">Lord: {getValue(data, ['nakshatra_lord'], 'N/A')} | Pada: {getValue(data, ['nakshatra_pada'], 'N/A')}</div>
          </div>
        </div>

        <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 border ${getValue(data, ['manglik'], 'No') === 'Yes' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className={`text-3xl ${getValue(data, ['manglik'], 'No') === 'Yes' ? 'text-red-500' : 'text-green-500'}`}>🔴</div>
          <div>
            <div className="text-sm text-gray-600">Manglik Dosha</div>
            <div className={`text-lg font-bold ${getValue(data, ['manglik'], 'No') === 'Yes' ? 'text-red-600' : 'text-green-600'}`}>
              {getValue(data, ['manglik'], 'Non-Manglik')}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">📖 Vedic Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>🧘 Yoga:</strong> {getValue(data, ['yoga', 'yog'], 'N/A')}</div>
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>📖 Tithi:</strong> {getValue(data, ['tithi'], 'N/A')}</div>
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>🌊 Karana:</strong> {getValue(data, ['karana'], 'N/A')}</div>
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>👨‍👩‍👧 Gan:</strong> {getValue(data, ['gan'], 'N/A')}</div>
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>💫 Nadi:</strong> {getValue(data, ['nadi'], 'N/A')}</div>
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>🎨 Varna:</strong> {getValue(data, ['varna'], 'N/A')}</div>
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>🤝 Vashya:</strong> {getValue(data, ['vashya'], 'N/A')}</div>
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>🐘 Yoni:</strong> {getValue(data, ['yoni'], 'N/A')}</div>
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>👑 Sign Lord:</strong> {getValue(data, ['sign_lord'], 'N/A')}</div>
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>🌍 Tatva:</strong> {getValue(data, ['tatva'], 'N/A')}</div>
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>💰 Paya:</strong> {getValue(data, ['paya'], 'N/A')}</div>
          <div className="bg-orange-50 p-3 rounded-lg text-sm border border-orange-100"><strong>🔤 Alphabet:</strong> {getValue(data, ['name_alphabet'], 'N/A')}</div>
        </div>

        <button onClick={downloadPDF} disabled={loading} className="w-full mt-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50">
          <FaDownload /> {loading ? 'Generating PDF...' : 'Download PDF Report'}
        </button>
      </div>
    );
  };

  const renderPanchang = () => {
    const data = panchangData || {};
    
    return (
      <div className="bg-white rounded-2xl p-6 md:p-10 max-w-4xl mx-auto shadow-lg border border-orange-100">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📅 Daily Panchang</h2>
            <p className="text-gray-500 text-sm">Celestial timings for your birth</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setActiveView('kundli')} className="px-4 py-2 bg-emerald-500 text-white rounded-lg flex items-center gap-1 hover:bg-emerald-600 transition">
              <FaStar /> Kundli
            </button>
            <button onClick={() => setActiveView('form')} className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-1 hover:bg-gray-600 transition">
              <FaArrowLeft /> New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-yellow-50 p-3 rounded-xl text-center border border-yellow-200 flex items-center justify-center gap-2 text-sm"><FaSun className="text-yellow-500" /> Sunrise: {getValue(data, ['sunrise'], 'N/A')}</div>
          <div className="bg-yellow-50 p-3 rounded-xl text-center border border-yellow-200 flex items-center justify-center gap-2 text-sm"><FaSun className="text-yellow-500" /> Sunset: {getValue(data, ['sunset'], 'N/A')}</div>
          <div className="bg-yellow-50 p-3 rounded-xl text-center border border-yellow-200 flex items-center justify-center gap-2 text-sm"><FaMoon className="text-blue-500" /> Moonrise: {getValue(data, ['moonrise'], 'N/A')}</div>
          <div className="bg-yellow-50 p-3 rounded-xl text-center border border-yellow-200 flex items-center justify-center gap-2 text-sm"><FaMoon className="text-blue-500" /> Moonset: {getValue(data, ['moonset'], 'N/A')}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
            <span className="text-3xl">📖</span><br />
            <span className="text-sm text-gray-600">Tithi</span><br />
            <strong>{getValue(data, ['tithi'], 'N/A')}</strong>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
            <span className="text-3xl">⭐</span><br />
            <span className="text-sm text-gray-600">Nakshatra</span><br />
            <strong>{getValue(data, ['nakshatra'], 'N/A')}</strong>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
            <span className="text-3xl">🧘</span><br />
            <span className="text-sm text-gray-600">Yoga</span><br />
            <strong>{getValue(data, ['yog', 'yoga'], 'N/A')}</strong>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
            <span className="text-3xl">🌊</span><br />
            <span className="text-sm text-gray-600">Karana</span><br />
            <strong>{getValue(data, ['karan', 'karana'], 'N/A')}</strong>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">⏰ Auspicious & Inauspicious Timings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-red-50 p-3 rounded-xl text-center text-red-600 border border-red-200">🔴 Rahu Kaal: {getValue(data, ['rahukaal'], 'N/A')}</div>
          <div className="bg-yellow-50 p-3 rounded-xl text-center text-yellow-700 border border-yellow-200">🟡 Yamaganda: {getValue(data, ['yamaganda'], 'N/A')}</div>
          <div className="bg-green-50 p-3 rounded-xl text-center text-green-600 border border-green-200">🟢 Gulika: {getValue(data, ['gulika'], 'N/A')}</div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 bg-orange-50 p-4 rounded-xl border border-orange-200">
          <div><strong>🌸 Paksha:</strong> {getValue(data, ['paksha'], 'N/A')}</div>
          <div><strong>🌸 Ritu:</strong> {getValue(data, ['ritu'], 'N/A')}</div>
          <div><strong>☀️ Ayana:</strong> {getValue(data, ['ayana'], 'N/A')}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-offWhite py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {activeView === 'form' && renderForm()}
        {activeView === 'kundli' && kundliData && renderKundli()}
        {activeView === 'panchang' && panchangData && renderPanchang()}
      </div>
    </div>
  );
};

export default AstrologyPage;