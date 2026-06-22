import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineLockClosed,
  HiOutlineMail,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineCog
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminLogin } from '../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Admin login attempt with email:', email);

    setErr('');

    if (!email.trim()) {
      setErr('Email is required');
      return;
    }
    if (!password.trim()) {
      setErr('Password is required');
      return;
    }

    setLoading(true);

    try {
      const response = await adminLogin({ email, password });
      sessionStorage.setItem('adminToken', response.token);
      sessionStorage.setItem('admin', JSON.stringify(response.admin));

      // Verify storage immediately
      console.log(
        "ADMIN TOKEN AFTER LOGIN:",
        sessionStorage.getItem("adminToken")
      );
console.log("ADMIN TOKEN AFTER LOGIN:", response.token);
console.log("SESSION TOKEN:", sessionStorage.getItem("adminToken"));
console.log("SESSION ADMIN:", sessionStorage.getItem("admin"));

      toast.success('Admin login successful!');
      // Use window.location for a hard redirect to avoid any state issues
      navigate('/admin/dashboard');

    } catch (error) {
      console.error('Login error details:', error);

      if (error.response) {
        if (error.response.status === 401) {
          setErr('Invalid email or password');
        } else if (error.response.status === 404) {
          setErr('Admin account not found');
        } else {
          setErr(error.response.data?.msg || 'Login failed. Please try again.');
        }
      } else if (error.request) {
        setErr('Cannot connect to server. Please check if backend is running');
      } else {
        setErr('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const adminFeatures = [
    { icon: <HiOutlineUserGroup className="w-5 h-5" />, text: "Manage Users & Bookings" },
    { icon: <HiOutlineChartBar className="w-5 h-5" />, text: "Analytics & Reports" },
    { icon: <HiOutlineCog className="w-5 h-5" />, text: "Content Management" },
    { icon: <HiOutlineShieldCheck className="w-5 h-5" />, text: "Secure Access" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-offWhite flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-orange-100"
      >
        {/* Left - Branding Section */}
        <div className="hidden md:flex flex-col items-center justify-center gap-6 p-10 bg-gradient-to-br from-red-600 to-red-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300/20 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <HiOutlineShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold mb-2">AstroPanel</h2>
            <p className="text-sm text-white/90 max-w-xs mx-auto">
              Admin Portal — manage services, classes, bookings, products, and content with ease.
            </p>
          </div>

          <div className="relative z-10 w-full mt-6 space-y-3">
            {adminFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 text-sm text-white/90 bg-white/10 rounded-lg p-2 px-3 backdrop-blur-sm"
              >
                {feature.icon}
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 mt-6 flex items-center gap-2 text-xs text-white/80 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
            <HiOutlineShieldCheck className="w-4 h-4" />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>

        {/* Right - Form Section */}
        <div className="p-8 md:p-10 bg-white">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Admin Sign In</h2>
            <p className="text-sm text-gray-500 mt-2">
              Enter your admin credentials to access the control panel
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (err) setErr('');
                  }}
                  placeholder="Enter email id"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (err) setErr('');
                  }}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <HiOutlineShieldCheck className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>

            {err && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {err}
                </p>
              </motion.div>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-gray-500 hover:text-red-600 transition"
                disabled={loading}
              >
                ← Back to Homepage
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-gray-400">
          Protected by advanced security measures | © {new Date().getFullYear()} AstroPlanets Admin
        </p>
      </div>
    </div>
  );
}