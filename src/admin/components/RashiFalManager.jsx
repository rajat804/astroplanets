// src/admin/components/RashiFalManager.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaEdit, FaTrash, FaSave, FaTimes, 
  FaEye, FaSearch, FaBold, FaUnderline, FaItalic,
  FaHeading, FaListUl, FaListOl, FaCalendarAlt, 
  FaHeart, FaBriefcase, FaMoneyBillWave, FaLeaf, FaGem,
  FaFileExcel, FaDownload
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';

// Simple Rich Text Editor Component
const SimpleRichTextEditor = ({ value, onChange, placeholder }) => {
  const [text, setText] = useState(value || '');
  
  const handleChange = (e) => {
    setText(e.target.value);
    onChange(e.target.value);
  };
  
  const applyFormat = (format) => {
    const textarea = document.getElementById('editor-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    let formattedText = '';
    switch(format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'heading':
        formattedText = `\n## ${selectedText}\n`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        break;
      case 'number':
        formattedText = `\n1. ${selectedText}`;
        break;
      default:
        return;
    }
    
    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setText(newText);
    onChange(newText);
  };
  
  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50">
        <button type="button" onClick={() => applyFormat('bold')} className="p-2 rounded hover:bg-gray-200 transition" title="Bold">
          <FaBold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => applyFormat('italic')} className="p-2 rounded hover:bg-gray-200 transition" title="Italic">
          <FaItalic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => applyFormat('underline')} className="p-2 rounded hover:bg-gray-200 transition" title="Underline">
          <FaUnderline className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button type="button" onClick={() => applyFormat('heading')} className="p-2 rounded hover:bg-gray-200 transition" title="Heading">
          <FaHeading className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button type="button" onClick={() => applyFormat('list')} className="p-2 rounded hover:bg-gray-200 transition" title="Bullet List">
          <FaListUl className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => applyFormat('number')} className="p-2 rounded hover:bg-gray-200 transition" title="Numbered List">
          <FaListOl className="w-4 h-4" />
        </button>
      </div>
      <textarea
        id="editor-textarea"
        value={text}
        onChange={handleChange}
        placeholder={placeholder || "Write predictions here..."}
        rows="6"
        className="w-full p-4 focus:outline-none resize-y"
        style={{ minHeight: '150px' }}
      />
      <div className="border-t border-gray-200 p-2 bg-gray-50 text-xs text-gray-400">
        Tip: Select text and use formatting buttons
      </div>
    </div>
  );
};

const RashiFalManager = () => {
  const [rashis, setRashis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRashi, setSelectedRashi] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [exporting, setExporting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    name_hi: '',
    symbol: '',
    slug: '',
    color: '#E74C3C',
    element: 'Fire',
    ruling_planet: '',
    lucky_color: '',
    lucky_number: 0,
    yearly_predictions: '',
    monthly_predictions: {
      january: '', february: '', march: '', april: '',
      may: '', june: '', july: '', august: '',
      september: '', october: '', november: '', december: ''
    },
    weekly_predictions: '',
    daily_predictions: '',
    health: '',
    career: '',
    love: '',
    finance: '',
    remedies: '',
    mantra: '',
    meta_title: '',
    meta_description: '',
    is_active: true
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const rashisList = [
    { name: 'Aries', symbol: '♈', slug: 'aries', color: '#E74C3C', element: 'Fire' },
    { name: 'Taurus', symbol: '♉', slug: 'taurus', color: '#27AE60', element: 'Earth' },
    { name: 'Gemini', symbol: '♊', slug: 'gemini', color: '#F39C12', element: 'Air' },
    { name: 'Cancer', symbol: '♋', slug: 'cancer', color: '#E91E63', element: 'Water' },
    { name: 'Leo', symbol: '♌', slug: 'leo', color: '#FF9800', element: 'Fire' },
    { name: 'Virgo', symbol: '♍', slug: 'virgo', color: '#8BC34A', element: 'Earth' },
    { name: 'Libra', symbol: '♎', slug: 'libra', color: '#9B59B6', element: 'Air' },
    { name: 'Scorpio', symbol: '♏', slug: 'scorpio', color: '#C0392B', element: 'Water' },
    { name: 'Sagittarius', symbol: '♐', slug: 'sagittarius', color: '#3498DB', element: 'Fire' },
    { name: 'Capricorn', symbol: '♑', slug: 'capricorn', color: '#7F8C8D', element: 'Earth' },
    { name: 'Aquarius', symbol: '♒', slug: 'aquarius', color: '#1ABC9C', element: 'Air' },
    { name: 'Pisces', symbol: '♓', slug: 'pisces', color: '#5D6D7E', element: 'Water' }
  ];

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const fetchRashis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/rashifal/admin/all`);
      if (response.data.success) {
        setRashis(response.data.rashis);
      }
    } catch (error) {
      console.error('Fetch rashis error:', error);
      toast.error('Failed to fetch rashis');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ✅ Export to Excel Function
  // ============================================
  const exportToExcel = () => {
    try {
      setExporting(true);
      
      // Prepare data for Excel
      const excelData = rashis.map((rashi, index) => ({
        'S.No': index + 1,
        'Symbol': rashi.symbol || '',
        'Name': rashi.name || '',
        'Name (Hindi)': rashi.name_hi || '',
        'Slug': rashi.slug || '',
        'Element': rashi.element || '',
        'Color': rashi.color || '',
        'Ruling Planet': rashi.ruling_planet || '',
        'Lucky Color': rashi.lucky_color || '',
        'Lucky Number': rashi.lucky_number || 0,
        'Mantra': rashi.mantra || '',
        'Status': rashi.is_active ? 'Active' : 'Inactive',
        'Yearly Predictions': rashi.yearly_predictions ? rashi.yearly_predictions.substring(0, 100) + '...' : '',
        'Weekly Predictions': rashi.weekly_predictions ? rashi.weekly_predictions.substring(0, 100) + '...' : '',
        'Daily Predictions': rashi.daily_predictions ? rashi.daily_predictions.substring(0, 100) + '...' : '',
        'Health': rashi.health ? rashi.health.substring(0, 100) + '...' : '',
        'Career': rashi.career ? rashi.career.substring(0, 100) + '...' : '',
        'Love': rashi.love ? rashi.love.substring(0, 100) + '...' : '',
        'Finance': rashi.finance ? rashi.finance.substring(0, 100) + '...' : '',
        'Remedies': rashi.remedies ? rashi.remedies.substring(0, 100) + '...' : '',
        'Meta Title': rashi.meta_title || '',
        'Meta Description': rashi.meta_description || '',
        'Created At': rashi.createdAt ? new Date(rashi.createdAt).toLocaleDateString() : '',
        'Updated At': rashi.updatedAt ? new Date(rashi.updatedAt).toLocaleDateString() : '',
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Auto column widths
      const colWidths = [
        { wch: 6 },  // S.No
        { wch: 8 },  // Symbol
        { wch: 15 }, // Name
        { wch: 15 }, // Name (Hindi)
        { wch: 15 }, // Slug
        { wch: 12 }, // Element
        { wch: 10 }, // Color
        { wch: 15 }, // Ruling Planet
        { wch: 15 }, // Lucky Color
        { wch: 12 }, // Lucky Number
        { wch: 20 }, // Mantra
        { wch: 10 }, // Status
        { wch: 30 }, // Yearly Predictions
        { wch: 30 }, // Weekly Predictions
        { wch: 30 }, // Daily Predictions
        { wch: 30 }, // Health
        { wch: 30 }, // Career
        { wch: 30 }, // Love
        { wch: 30 }, // Finance
        { wch: 30 }, // Remedies
        { wch: 25 }, // Meta Title
        { wch: 35 }, // Meta Description
        { wch: 15 }, // Created At
        { wch: 15 }, // Updated At
      ];
      ws['!cols'] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'RashiFal');

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Download file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `RashiFal_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      toast.success(`Exported ${rashis.length} rashis successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export Excel file');
    } finally {
      setExporting(false);
    }
  };

  const createRashi = async () => {
    if (!formData.name || !formData.symbol) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/rashifal/admin/create`, formData);
      if (response.data.success) {
        toast.success('Rashi Fal created successfully');
        setShowModal(false);
        resetForm();
        fetchRashis();
      }
    } catch (error) {
      console.error('Create error:', error);
      toast.error(error.response?.data?.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const updateRashi = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/rashifal/admin/update/${selectedRashi._id}`, formData);
      if (response.data.success) {
        toast.success('Rashi Fal updated successfully');
        setShowModal(false);
        resetForm();
        fetchRashis();
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const deleteRashi = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/rashifal/admin/delete/${selectedRashi._id}`);
      if (response.data.success) {
        toast.success('Rashi Fal deleted successfully');
        setShowDeleteModal(false);
        fetchRashis();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (rashi) => {
    setSelectedRashi(rashi);
    setFormData({
      name: rashi.name,
      name_hi: rashi.name_hi || '',
      symbol: rashi.symbol,
      slug: rashi.slug,
      color: rashi.color || '#E74C3C',
      element: rashi.element || 'Fire',
      ruling_planet: rashi.ruling_planet || '',
      lucky_color: rashi.lucky_color || '',
      lucky_number: rashi.lucky_number || 0,
      yearly_predictions: rashi.yearly_predictions || '',
      monthly_predictions: rashi.monthly_predictions || {
        january: '', february: '', march: '', april: '',
        may: '', june: '', july: '', august: '',
        september: '', october: '', november: '', december: ''
      },
      weekly_predictions: rashi.weekly_predictions || '',
      daily_predictions: rashi.daily_predictions || '',
      health: rashi.health || '',
      career: rashi.career || '',
      love: rashi.love || '',
      finance: rashi.finance || '',
      remedies: rashi.remedies || '',
      mantra: rashi.mantra || '',
      meta_title: rashi.meta_title || '',
      meta_description: rashi.meta_description || '',
      is_active: rashi.is_active !== false
    });
    setEditMode(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_hi: '',
      symbol: '',
      slug: '',
      color: '#E74C3C',
      element: 'Fire',
      ruling_planet: '',
      lucky_color: '',
      lucky_number: 0,
      yearly_predictions: '',
      monthly_predictions: {
        january: '', february: '', march: '', april: '',
        may: '', june: '', july: '', august: '',
        september: '', october: '', november: '', december: ''
      },
      weekly_predictions: '',
      daily_predictions: '',
      health: '',
      career: '',
      love: '',
      finance: '',
      remedies: '',
      mantra: '',
      meta_title: '',
      meta_description: '',
      is_active: true
    });
    setEditMode(false);
    setSelectedRashi(null);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({ ...formData, name, slug: generateSlug(name) });
  };

  const selectPredefinedRashi = (rashi) => {
    setFormData({
      ...formData,
      name: rashi.name,
      symbol: rashi.symbol,
      slug: rashi.slug,
      color: rashi.color,
      element: rashi.element
    });
  };

  useEffect(() => {
    fetchRashis();
  }, []);

  const filteredRashis = rashis.filter(rashi =>
    rashi.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rashi.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  const monthNames = {
    january: 'January', february: 'February', march: 'March', april: 'April',
    may: 'May', june: 'June', july: 'July', august: 'August',
    september: 'September', october: 'October', november: 'November', december: 'December'
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Rashi Fal Management
        </h1>
        <p className="text-gray-500 mt-1">Manage zodiac sign predictions, yearly forecast, and monthly predictions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md border border-purple-100">
          <p className="text-2xl font-bold text-gray-800">{rashis.length}</p>
          <p className="text-sm text-gray-500">Total Rashis</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-green-100">
          <p className="text-2xl font-bold text-green-600">{rashis.filter(r => r.is_active).length}</p>
          <p className="text-sm text-gray-500">Active Rashis</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
          <p className="text-2xl font-bold text-blue-600">{rashis.filter(r => r.yearly_predictions).length}</p>
          <p className="text-sm text-gray-500">Yearly Predictions</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-yellow-100">
          <p className="text-2xl font-bold text-yellow-600">{rashis.filter(r => r.monthly_predictions).length}</p>
          <p className="text-sm text-gray-500">Monthly Predictions</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* ✅ Excel Download Button */}
            <button
              onClick={exportToExcel}
              disabled={exporting || rashis.length === 0}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                exporting || rashis.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
              }`}
              title={rashis.length === 0 ? "No data to export" : "Download Excel"}
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Exporting...
                </>
              ) : (
                <>
                  <FaFileExcel className="w-4 h-4" />
                  <FaDownload className="w-3 h-3" />
                  Export Excel
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
            >
              <FaPlus /> Add New Rashi Fal
            </button>
          </div>
        </div>
      </div>

      {/* Rashis Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Element</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mx-auto"></div>
                  </td>
                </tr>
              ) : filteredRashis.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? "No matching rashis found" : "No rashis found"}
                  </td>
                </tr>
              ) : (
                filteredRashis.map((rashi, index) => (
                  <tr key={rashi._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-500">#{index + 1}</td>
                    <td className="px-6 py-4 text-2xl" style={{ color: rashi.color }}>{rashi.symbol}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{rashi.name}</span>
                      {rashi.name_hi && <span className="text-xs text-gray-400 ml-1">({rashi.name_hi})</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{rashi.slug}</td>
                    <td className="px-6 py-4">{rashi.element}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${rashi.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {rashi.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(rashi)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                          <FaEdit />
                        </button>
                        <button onClick={() => { setSelectedRashi(rashi); setShowDeleteModal(true); }} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {editMode ? <FaEdit /> : <FaPlus />}
                    {editMode ? "Edit Rashi Fal" : "Add New Rashi Fal"}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="text-white text-2xl hover:bg-white/20 rounded-full p-1">
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Quick Select */}
                {!editMode && (
                  <div className="mb-6 p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Quick Select Rashi:</p>
                    <div className="flex flex-wrap gap-2">
                      {rashisList.map(rashi => (
                        <button
                          key={rashi.name}
                          type="button"
                          onClick={() => selectPredefinedRashi(rashi)}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:border-purple-300 hover:bg-purple-50 transition"
                        >
                          {rashi.symbol} {rashi.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
                  {[
                    { id: 'basic', label: 'Basic Info', icon: <FaGem className="w-4 h-4" /> },
                    { id: 'predictions', label: 'Predictions', icon: <FaCalendarAlt className="w-4 h-4" /> },
                    { id: 'monthly', label: 'Monthly', icon: <FaCalendarAlt className="w-4 h-4" /> },
                    { id: 'details', label: 'Details', icon: <FaHeart className="w-4 h-4" /> },
                    { id: 'seo', label: 'SEO', icon: <FaEye className="w-4 h-4" /> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition ${
                        activeTab === tab.id ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Basic Info Tab - No image_url */}
                {activeTab === 'basic' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Rashi Name (English) *</label>
                      <input type="text" value={formData.name} onChange={handleNameChange} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500" placeholder="e.g., Aries" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Rashi Name (Hindi)</label>
                      <input type="text" value={formData.name_hi} onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="e.g., मेष" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Symbol *</label>
                      <input type="text" value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="e.g., ♈" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Slug *</label>
                      <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="e.g., aries" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Color</label>
                      <div className="flex gap-2">
                        <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer" />
                        <input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="flex-1 border border-gray-300 rounded-xl px-4 py-2" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Element</label>
                      <select value={formData.element} onChange={(e) => setFormData({ ...formData, element: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2">
                        <option value="Fire">Fire</option>
                        <option value="Earth">Earth</option>
                        <option value="Air">Air</option>
                        <option value="Water">Water</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ruling Planet</label>
                      <input type="text" value={formData.ruling_planet} onChange={(e) => setFormData({ ...formData, ruling_planet: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Lucky Color</label>
                      <input type="text" value={formData.lucky_color} onChange={(e) => setFormData({ ...formData, lucky_color: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Lucky Number</label>
                      <input type="number" value={formData.lucky_number} onChange={(e) => setFormData({ ...formData, lucky_number: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-xl px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Mantra</label>
                      <textarea value={formData.mantra} onChange={(e) => setFormData({ ...formData, mantra: e.target.value })} rows="2" className="w-full border border-gray-300 rounded-xl px-4 py-2" placeholder="e.g., ॐ सूर्याय नमः" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                      <select value={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })} className="w-full border border-gray-300 rounded-xl px-4 py-2">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Predictions Tab */}
                {activeTab === 'predictions' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Yearly Predictions</label>
                      <SimpleRichTextEditor value={formData.yearly_predictions} onChange={(value) => setFormData({ ...formData, yearly_predictions: value })} placeholder="Write yearly predictions..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Weekly Predictions</label>
                      <SimpleRichTextEditor value={formData.weekly_predictions} onChange={(value) => setFormData({ ...formData, weekly_predictions: value })} placeholder="Write weekly predictions..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Predictions</label>
                      <SimpleRichTextEditor value={formData.daily_predictions} onChange={(value) => setFormData({ ...formData, daily_predictions: value })} placeholder="Write daily predictions..." />
                    </div>
                  </div>
                )}

                {/* Monthly Tab */}
                {activeTab === 'monthly' && (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {months.map(month => (
                      <div key={month} className="border border-gray-200 rounded-xl p-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">{monthNames[month]}</label>
                        <SimpleRichTextEditor
                          value={formData.monthly_predictions[month]}
                          onChange={(value) => setFormData({ ...formData, monthly_predictions: { ...formData.monthly_predictions, [month]: value } })}
                          placeholder={`${monthNames[month]} predictions...`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaHeart className="text-pink-500" /> Health</label>
                      <SimpleRichTextEditor value={formData.health} onChange={(value) => setFormData({ ...formData, health: value })} placeholder="Health predictions..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaBriefcase className="text-blue-500" /> Career</label>
                      <SimpleRichTextEditor value={formData.career} onChange={(value) => setFormData({ ...formData, career: value })} placeholder="Career predictions..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaHeart className="text-red-500" /> Love</label>
                      <SimpleRichTextEditor value={formData.love} onChange={(value) => setFormData({ ...formData, love: value })} placeholder="Love predictions..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaMoneyBillWave className="text-green-500" /> Finance</label>
                      <SimpleRichTextEditor value={formData.finance} onChange={(value) => setFormData({ ...formData, finance: value })} placeholder="Finance predictions..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaLeaf className="text-green-500" /> Remedies</label>
                      <SimpleRichTextEditor value={formData.remedies} onChange={(value) => setFormData({ ...formData, remedies: value })} placeholder="Remedies..." />
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title</label>
                      <input type="text" value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description</label>
                      <textarea value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })} rows="3" className="w-full border border-gray-300 rounded-xl px-4 py-2" />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium">Cancel</button>
                  <button type="button" onClick={editMode ? updateRashi : createRashi} disabled={loading} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition font-medium flex items-center gap-2">
                    <FaSave /> {loading ? "Saving..." : (editMode ? "Update" : "Create")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedRashi && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-5 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2"><FaTrash /> Confirm Delete</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">Delete <strong>{selectedRashi.name}</strong>? This cannot be undone.</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 rounded-xl bg-gray-100">Cancel</button>
                  <button onClick={deleteRashi} className="px-5 py-2.5 rounded-xl bg-red-500 text-white">Delete</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RashiFalManager;