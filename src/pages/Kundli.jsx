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
    <div style={styles.formContainer}>
      <div style={styles.formHeader}>
        <div style={styles.formIcon}>🔮</div>
        <h1 style={styles.formTitle}>Generate Your Free Kundli</h1>
        <p style={styles.formSubtitle}>Discover your cosmic blueprint with accurate Vedic astrology - Absolutely Free!</p>
      </div>

      <form onSubmit={generateKundli}>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FaCalendarAlt style={styles.sectionIcon} />
            <h3 style={styles.sectionTitle}>Date of Birth</h3>
          </div>
          <div style={styles.row}>
            <input type="number" name="date" placeholder="DD" value={formData.date} onChange={handleChange} style={styles.input} required />
            <input type="number" name="month" placeholder="MM" value={formData.month} onChange={handleChange} style={styles.input} required />
            <input type="number" name="year" placeholder="YYYY" value={formData.year} onChange={handleChange} style={styles.input} required />
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FaClock style={styles.sectionIcon} />
            <h3 style={styles.sectionTitle}>Time of Birth</h3>
          </div>
          <div style={styles.row}>
            <input type="number" name="hour" placeholder="Hour (0-23)" value={formData.hour} onChange={handleChange} style={styles.input} required />
            <input type="number" name="minute" placeholder="Minute (0-59)" value={formData.minute} onChange={handleChange} style={styles.input} required />
            <select name="timezone" value={formData.timezone} onChange={handleChange} style={styles.input}>
              <option value="5.5">India (IST) +5:30</option>
              <option value="0">UTC</option>
            </select>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FaMapMarkerAlt style={styles.sectionIcon} />
            <h3 style={styles.sectionTitle}>Place of Birth</h3>
          </div>
          
          <div style={styles.cityChips}>
            {popularCities.map((city, i) => (
              <button key={i} type="button" onClick={() => selectPopularCity(city)} style={styles.cityChip}>
                {city.name}
              </button>
            ))}
          </div>

          <div style={styles.searchRow}>
            <input type="text" name="city" placeholder="Enter City Name" value={formData.city} onChange={handleChange} style={styles.inputSearch} />
            <button type="button" onClick={searchCity} disabled={searchingCity} style={styles.searchBtn}>
              <FaSearch /> {searchingCity ? '...' : 'Search'}
            </button>
          </div>

          <div style={styles.locationRow}>
            <input type="number" step="any" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} style={styles.inputHalf} required />
            <input type="number" step="any" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} style={styles.inputHalf} required />
            <button type="button" onClick={getCurrentLocation} disabled={gettingLocation} style={styles.locationBtn}>
              <FaLocationArrow /> {gettingLocation ? 'Getting...' : 'My Location'}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? '✨ Generating Your Kundli... ✨' : '✨ Generate Your Free Kundli ✨'}
        </button>
      </form>
    </div>
  );

  const renderKundli = () => {
    const data = kundliData || {};
    
    return (
      <div style={styles.resultContainer}>
        <div style={styles.resultHeader}>
          <div>
            <h2 style={styles.resultTitle}>📊 Your Kundli</h2>
            <p style={styles.resultSubtitle}>Detailed astrological analysis</p>
          </div>
          <div style={styles.resultActions}>
            <button onClick={() => setActiveView('panchang')} style={styles.switchBtnPanchang}>
              <FaMoon /> Panchang
            </button>
            <button onClick={() => setActiveView('form')} style={styles.backBtn}>
              <FaArrowLeft /> New
            </button>
          </div>
        </div>

        <div style={styles.ascendantCard}>
          <div style={styles.ascendantIcon}>🌅</div>
          <div style={styles.ascendantLabel}>Lagna (Ascendant)</div>
          <div style={styles.ascendantValue}>
            {getValue(data, ['ascendant_sign', 'lagna', 'ascendant', 'sign'], 'N/A')}
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div style={styles.statLabel}>Rashi (Moon Sign)</div>
            <div style={styles.statValue}>{getValue(data, ['sign', 'rashi', 'moon_sign'], 'N/A')}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🌟</div>
            <div style={styles.statLabel}>Nakshatra (Birth Star)</div>
            <div style={styles.statValue}>{getValue(data, ['nakshatra', 'Naksahtra'], 'N/A')}</div>
            <div style={styles.statSub}>Lord: {getValue(data, ['nakshatra_lord'], 'N/A')} | Pada: {getValue(data, ['nakshatra_pada'], 'N/A')}</div>
          </div>
        </div>

        <div style={{ ...styles.manglikCard, background: getValue(data, ['manglik'], 'No') === 'Yes' ? '#fef2f2' : '#f0fdf4', borderColor: getValue(data, ['manglik'], 'No') === 'Yes' ? '#fecaca' : '#bbf7d0' }}>
          <div style={{ ...styles.manglikIcon, color: getValue(data, ['manglik'], 'No') === 'Yes' ? '#dc2626' : '#10b981' }}>🔴</div>
          <div>
            <div style={styles.manglikLabel}>Manglik Dosha</div>
            <div style={{ ...styles.manglikValue, color: getValue(data, ['manglik'], 'No') === 'Yes' ? '#dc2626' : '#10b981' }}>
              {getValue(data, ['manglik'], 'Non-Manglik')}
            </div>
          </div>
        </div>

        <h3 style={styles.gridTitle}>📖 Vedic Details</h3>
        <div style={styles.grid}>
          <div style={styles.gridItem}><strong>🧘 Yoga:</strong> {getValue(data, ['yoga', 'yog'], 'N/A')}</div>
          <div style={styles.gridItem}><strong>📖 Tithi:</strong> {getValue(data, ['tithi'], 'N/A')}</div>
          <div style={styles.gridItem}><strong>🌊 Karana:</strong> {getValue(data, ['karana'], 'N/A')}</div>
          <div style={styles.gridItem}><strong>👨‍👩‍👧 Gan:</strong> {getValue(data, ['gan'], 'N/A')}</div>
          <div style={styles.gridItem}><strong>💫 Nadi:</strong> {getValue(data, ['nadi'], 'N/A')}</div>
          <div style={styles.gridItem}><strong>🎨 Varna:</strong> {getValue(data, ['varna'], 'N/A')}</div>
          <div style={styles.gridItem}><strong>🤝 Vashya:</strong> {getValue(data, ['vashya'], 'N/A')}</div>
          <div style={styles.gridItem}><strong>🐘 Yoni:</strong> {getValue(data, ['yoni'], 'N/A')}</div>
          <div style={styles.gridItem}><strong>👑 Sign Lord:</strong> {getValue(data, ['sign_lord'], 'N/A')}</div>
          <div style={styles.gridItem}><strong>🌍 Tatva:</strong> {getValue(data, ['tatva'], 'N/A')}</div>
          <div style={styles.gridItem}><strong>💰 Paya:</strong> {getValue(data, ['paya'], 'N/A')}</div>
          <div style={styles.gridItem}><strong>🔤 Alphabet:</strong> {getValue(data, ['name_alphabet'], 'N/A')}</div>
        </div>

        <button onClick={downloadPDF} disabled={loading} style={styles.downloadBtn}>
          <FaDownload /> {loading ? 'Generating PDF...' : 'Download PDF Report'}
        </button>
      </div>
    );
  };

  const renderPanchang = () => {
    const data = panchangData || {};
    
    return (
      <div style={styles.resultContainer}>
        <div style={styles.resultHeader}>
          <div>
            <h2 style={styles.resultTitle}>📅 Daily Panchang</h2>
            <p style={styles.resultSubtitle}>Celestial timings for your birth</p>
          </div>
          <div style={styles.resultActions}>
            <button onClick={() => setActiveView('kundli')} style={styles.switchBtnKundli}>
              <FaStar /> Kundli
            </button>
            <button onClick={() => setActiveView('form')} style={styles.backBtn}>
              <FaArrowLeft /> New
            </button>
          </div>
        </div>

        <div style={styles.sunTimesGrid}>
          <div style={styles.sunCard}><FaSun style={{ marginRight: '8px' }} /> Sunrise: {getValue(data, ['sunrise'], 'N/A')}</div>
          <div style={styles.sunCard}><FaSun style={{ marginRight: '8px' }} /> Sunset: {getValue(data, ['sunset'], 'N/A')}</div>
          <div style={styles.sunCard}><FaMoon style={{ marginRight: '8px' }} /> Moonrise: {getValue(data, ['moonrise'], 'N/A')}</div>
          <div style={styles.sunCard}><FaMoon style={{ marginRight: '8px' }} /> Moonset: {getValue(data, ['moonset'], 'N/A')}</div>
        </div>

        <div style={styles.panchangGrid}>
          <div style={styles.panchangCard}><span style={{ fontSize: '2rem' }}>📖</span><br />Tithi<br /><strong>{getValue(data, ['tithi'], 'N/A')}</strong></div>
          <div style={styles.panchangCard}><span style={{ fontSize: '2rem' }}>⭐</span><br />Nakshatra<br /><strong>{getValue(data, ['nakshatra'], 'N/A')}</strong></div>
          <div style={styles.panchangCard}><span style={{ fontSize: '2rem' }}>🧘</span><br />Yoga<br /><strong>{getValue(data, ['yog', 'yoga'], 'N/A')}</strong></div>
          <div style={styles.panchangCard}><span style={{ fontSize: '2rem' }}>🌊</span><br />Karana<br /><strong>{getValue(data, ['karan', 'karana'], 'N/A')}</strong></div>
        </div>

        <h3 style={styles.gridTitle}>⏰ Auspicious & Inauspicious Timings</h3>
        <div style={styles.muhuratGrid}>
          <div style={styles.muhuratCardRed}>🔴 Rahu Kaal: {getValue(data, ['rahukaal'], 'N/A')}</div>
          <div style={styles.muhuratCardYellow}>🟡 Yamaganda: {getValue(data, ['yamaganda'], 'N/A')}</div>
          <div style={styles.muhuratCardGreen}>🟢 Gulika: {getValue(data, ['gulika'], 'N/A')}</div>
        </div>

        <div style={styles.extraInfo}>
          <div><strong>🌸 Paksha:</strong> {getValue(data, ['paksha'], 'N/A')}</div>
          <div><strong>🌸 Ritu:</strong> {getValue(data, ['ritu'], 'N/A')}</div>
          <div><strong>☀️ Ayana:</strong> {getValue(data, ['ayana'], 'N/A')}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {activeView === 'form' && renderForm()}
        {activeView === 'kundli' && kundliData && renderKundli()}
        {activeView === 'panchang' && panchangData && renderPanchang()}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#faf8f5',
    padding: '40px 0'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  formContainer: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e8e4df'
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  formIcon: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  formTitle: {
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '10px'
  },
  formSubtitle: {
    color: '#6b7280',
    fontSize: '1rem'
  },
  section: {
    background: '#faf8f5',
    padding: '20px',
    borderRadius: '16px',
    marginBottom: '20px',
    border: '1px solid #e8e4df'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
  },
  sectionIcon: {
    color: '#dc2626',
    fontSize: '1.2rem'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#374151',
    margin: 0
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px'
  },
  input: {
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    background: '#ffffff',
    transition: 'all 0.3s'
  },
  inputSearch: {
    flex: 1,
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    background: '#ffffff'
  },
  inputHalf: {
    flex: 1,
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    background: '#ffffff'
  },
  cityChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '15px'
  },
  cityChip: {
    padding: '6px 14px',
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: '#4b5563',
    transition: 'all 0.3s'
  },
  searchRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px'
  },
  searchBtn: {
    padding: '12px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  locationRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  locationBtn: {
    padding: '12px 20px',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s'
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s'
  },
  resultContainer: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '40px',
    margin: '0 auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e8e4df'
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  resultTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '5px'
  },
  resultSubtitle: {
    color: '#6b7280',
    fontSize: '0.9rem'
  },
  resultActions: {
    display: 'flex',
    gap: '10px'
  },
  switchBtnPanchang: {
    padding: '10px 20px',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  switchBtnKundli: {
    padding: '10px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  backBtn: {
    padding: '10px 20px',
    background: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  ascendantCard: {
    background: '#fef2f2',
    padding: '30px',
    borderRadius: '20px',
    textAlign: 'center',
    marginBottom: '30px',
    border: '1px solid #fee2e2'
  },
  ascendantIcon: {
    fontSize: '2rem',
    marginBottom: '10px'
  },
  ascendantLabel: {
    fontSize: '0.9rem',
    color: '#dc2626',
    marginBottom: '10px'
  },
  ascendantValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#dc2626'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  statCard: {
    background: '#faf8f5',
    padding: '20px',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid #e8e4df'
  },
  statIcon: {
    fontSize: '2rem',
    marginBottom: '10px'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#6b7280',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#374151'
  },
  statSub: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    marginTop: '8px'
  },
  manglikCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px 20px',
    borderRadius: '16px',
    marginBottom: '25px',
    border: '1px solid'
  },
  manglikIcon: {
    fontSize: '1.8rem'
  },
  manglikLabel: {
    fontSize: '0.85rem',
    color: '#6b7280'
  },
  manglikValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  gridTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '15px',
    marginTop: '25px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
  },
  gridItem: {
    background: '#faf8f5',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    border: '1px solid #e8e4df'
  },
  downloadBtn: {
    width: '100%',
    padding: '16px',
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '30px',
    transition: 'all 0.3s'
  },
  sunTimesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
    marginBottom: '25px'
  },
  sunCard: {
    background: '#fefce8',
    padding: '15px',
    borderRadius: '16px',
    textAlign: 'center',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    border: '1px solid #fef3c7'
  },
  panchangGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '25px'
  },
  panchangCard: {
    background: '#f0fdf4',
    color: '#166534',
    padding: '20px',
    borderRadius: '16px',
    textAlign: 'center',
    lineHeight: '1.6',
    border: '1px solid #dcfce7'
  },
  muhuratGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  muhuratCardRed: {
    background: '#fef2f2',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '500',
    color: '#dc2626',
    border: '1px solid #fecaca'
  },
  muhuratCardYellow: {
    background: '#fefce8',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '500',
    color: '#d97706',
    border: '1px solid #fde68a'
  },
  muhuratCardGreen: {
    background: '#f0fdf4',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '500',
    color: '#10b981',
    border: '1px solid #bbf7d0'
  },
  extraInfo: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    background: '#faf8f5',
    padding: '15px',
    borderRadius: '12px',
    marginTop: '20px',
    border: '1px solid #e8e4df'
  }
};

export default AstrologyPage;