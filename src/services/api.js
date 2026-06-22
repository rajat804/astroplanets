import axios from 'axios';
import toast from 'react-hot-toast';

// Simple API URL detection
const getApiUrl = () => {
  // Check if we're on Vercel (production)
  const isVercel = window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  console.log('Hostname:', window.location.hostname);
  console.log('Is Vercel:', isVercel);

  if (isVercel) {
    // Use your backend URL
    return 'https://astroplanets-backend.vercel.app/api';
  }

  // Local development
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: false,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    let token = sessionStorage.getItem('token');
    if (!token) {
      token = sessionStorage.getItem('adminToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`${config.method.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    console.error('Full error:', error);

    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    } else if (!error.response) {
      toast.error('Cannot connect to server. Please check if backend is running.');
    } else {
      const message = error.response?.data?.msg || error.response?.data?.message || 'An error occurred';

      if (error.response?.status === 401) {
        if (error.config.url?.includes('/admin/')) {
          sessionStorage.removeItem('adminToken');
          sessionStorage.removeItem('admin');
          window.location.href = '/admin/login';
          toast.error('Admin session expired. Please login again.');
        } else {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          window.location.href = '/auth';
          toast.error('Session expired. Please login again.');
        }
      } else {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('user', JSON.stringify(response.data.user));
    sessionStorage.setItem('loginTime', Date.now().toString());
  }
  return response.data;
};

export const login = async (credentials) => {
  console.log('Login API called with:', credentials.email);
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('user', JSON.stringify(response.data.user));
    sessionStorage.setItem('loginTime', Date.now().toString());
  }
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ==================== ADMIN APIs ====================
export const adminLogin = async (credentials) => {
  console.log('Admin login API called with:', credentials.email);

  try {
    const response = await api.post('/admin/login', credentials);
    console.log('Admin login response:', response.data);
    // ✅ Only return data, storage handled by component
    return response.data;
  } catch (error) {
    console.error('Admin login API error:', error);
    throw error;
  }
};

export const createAdmin = async (adminData) => {
  const response = await api.post('/admin/create', adminData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const response = await api.put(`/admin/users/${userId}`, { isActive });
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getCurrentAdmin = async () => {
  const response = await api.get('/admin/me');
  return response.data;
};

export const isAdminLoggedIn = () => {
  const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  const admin = sessionStorage.getItem('admin') || sessionStorage.getItem('admin');
  return !!(token && admin);
};

export const adminLogout = () => {
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('admin');
  toast.success('Admin logged out successfully');
  window.location.href = '/admin/login';
};

// ==================== ADMIN DASHBOARD APIs ====================
export const getAdminDashboardStats = async (year, month) => {
  try {
    let url = '/admindashboard/overview-stats';
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getAdminRecentActivities = async () => {
  try {
    const response = await api.get('/admindashboard/recent-activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

export const getAdminTopProducts = async () => {
  try {
    const response = await api.get('/admindashboard/top-products');
    return response.data;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};

export const getAdminPopularServices = async () => {
  try {
    const response = await api.get('/admindashboard/popular-services');
    return response.data;
  } catch (error) {
    console.error('Error fetching popular services:', error);
    throw error;
  }
};

// ==================== PRODUCT APIs ====================
export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/products${params ? `?${params}` : ''}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const getProductStats = async () => {
  const response = await api.get('/products/stats/admin');
  return response.data;
};

// ==================== IMAGE UPLOAD APIs ====================
export const uploadImage = async (formData) => {
  const response = await api.post('/upload/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Upload document (Word file) - ADD THIS NEW FUNCTION
export const uploadDocument = async (formData) => {
  const response = await api.post('/upload/document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadMultipleImages = async (formData) => {
  const response = await api.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteImage = async (publicId) => {
  const response = await api.delete('/upload/image', { data: { publicId } });
  return response.data;
};

// ==================== CART APIs ====================
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity) => {
  const response = await api.post('/cart/add', { productId, quantity });
  return response.data;
};

export const updateCartItem = async (productId, quantity) => {
  const response = await api.put(`/cart/update/${productId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/remove/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart/clear');
  return response.data;
};

// ==================== PAYMENT APIs ====================
export const createOrder = async (orderData) => {
  const response = await api.post('/payment/create-order', orderData);
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post('/payment/verify-payment', paymentData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await api.get('/payment/orders');
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/payment/order/${orderId}`);
  return response.data;
};

// ==================== ORDER APIs (Admin) ====================
export const getAllOrders = async () => {
  const response = await api.get('/orders/admin');
  return response.data;
};

export const getOrderStats = async () => {
  const response = await api.get('/orders/admin/stats/dashboard');
  return response.data;
};

export const updateOrderStatus = async (orderId, orderStatus) => {
  const response = await api.put(`/orders/admin/${orderId}/status`, { orderStatus });
  return response.data;
};

export const updatePaymentStatus = async (orderId, paymentStatus) => {
  const response = await api.put(`/orders/admin/${orderId}/payment`, { paymentStatus });
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await api.delete(`/orders/admin/${orderId}`);
  return response.data;
};

export const getAdminOrderById = async (orderId) => {
  const response = await api.get(`/orders/admin/${orderId}`);
  return response.data;
};

// ==================== BOOKING APIs ====================
export const getAllBookings = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/bookings/admin${params ? `?${params}` : ''}`);
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/admin/${id}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const updateBookingStatus = async (id, bookingStatus) => {
  const response = await api.put(`/bookings/admin/${id}/status`, { bookingStatus });
  return response.data;
};

export const updateBookingPaymentStatus = async (id, paymentStatus) => {
  const response = await api.put(`/bookings/admin/${id}/payment`, { paymentStatus });
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/admin/${id}`);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/my-bookings');
  return response.data;
};

export const getBookingStats = async () => {
  const response = await api.get('/bookings/admin/stats/dashboard');
  return response.data;
};

// ==================== SOCIAL CONTENT APIs ====================
// Get all social content (Admin)
export const getAllSocialContent = async () => {
  const response = await api.get('/social-content');
  return response.data;
};

// Get active social content (Public)
export const getActiveSocialContent = async () => {
  const response = await api.get('/social-content/active');
  return response.data;
};

// Get social content by type (Public)
export const getSocialContentByType = async (type, page = 1, limit = 12) => {
  const response = await api.get(`/social-content/type/${type}?page=${page}&limit=${limit}`);
  return response.data;
};

// Get social content by ID
export const getSocialContentById = async (id) => {
  const response = await api.get(`/social-content/${id}`);
  return response.data;
};

// Create social content (Admin)
export const createSocialContent = async (data) => {
  const response = await api.post('/social-content', data);
  return response.data;
};

// Upload file for social content (Admin)
export const uploadSocialContentFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/social-content/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update social content (Admin)
export const updateSocialContent = async (id, data) => {
  const response = await api.put(`/social-content/${id}`, data);
  return response.data;
};

// Delete social content (Admin)
export const deleteSocialContent = async (id) => {
  const response = await api.delete(`/social-content/${id}`);
  return response.data;
};

// Increment view count (Public)
export const incrementContentViews = async (id) => {
  const response = await api.put(`/social-content/${id}/view`);
  return response.data;
};

// Increment like count (Public)
export const incrementContentLikes = async (id) => {
  const response = await api.put(`/social-content/${id}/like`);
  return response.data;
};

// ==================== BLOG APIs ====================
// Blog APIs (Public)
export const getAllBlogs = async (tag = '', page = 1, limit = 6) => {
  const params = new URLSearchParams();
  if (tag) params.append('tag', tag);
  params.append('page', page);
  params.append('limit', limit);

  const response = await api.get(`/blogs?${params.toString()}`);
  return response.data;
};

export const getBlogBySlug = async (slug) => {
  const response = await api.get(`/blogs/${slug}`);
  return response.data;
};

export const likeBlog = async (id) => {
  const response = await api.put(`/blogs/${id}/like`);
  return response.data;
};

// Blog APIs (Admin)
export const getAllBlogsAdmin = async () => {
  const response = await api.get('/blogs/admin/all');
  return response.data;
};

export const getBlogById = async (id) => {
  const response = await api.get(`/blogs/admin/${id}`);
  return response.data;
};

export const createBlog = async (blogData) => {
  const response = await api.post('/blogs/admin', blogData);
  return response.data;
};

export const updateBlog = async (id, blogData) => {
  const response = await api.put(`/blogs/admin/${id}`, blogData);
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/admin/${id}`);
  return response.data;
};

export const toggleBlogPublish = async (id) => {
  const response = await api.patch(`/blogs/admin/${id}/toggle`);
  return response.data;
};

// ==================== COUPON APIs ====================
export const getActiveCoupons = async () => {
  const response = await api.get('/coupons/active');
  return response.data;
};

export const validateCoupon = async (code, orderAmount, productIds = []) => {
  const response = await api.post('/coupons/validate', { code, orderAmount, productIds });
  return response.data;
};

export const getAllCoupons = async () => {
  const response = await api.get('/coupons/admin');
  return response.data;
};

export const createCoupon = async (couponData) => {
  const response = await api.post('/coupons/admin', couponData);
  return response.data;
};

export const updateCoupon = async (id, couponData) => {
  const response = await api.put(`/coupons/admin/${id}`, couponData);
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await api.delete(`/coupons/admin/${id}`);
  return response.data;
};

export const toggleCouponStatus = async (id) => {
  const response = await api.patch(`/coupons/admin/${id}/toggle`);
  return response.data;
};

export default api;