import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const ASSET_URL = API_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');

    // Determine which token to use based on the route
    if (config.url.startsWith('/admin') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
};

export const adminAuthAPI = {
  login: (data) => api.post('/admin/auth/login', data),
  register: (data) => api.post('/admin/auth/register', data),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  calculateBMI: (data) => api.post('/user/bmi', data),
  getDietRecommendations: () => api.get('/user/diet-recommendations'),
};

export const regimenAPI = {
  getToday: () => api.get('/regimen'),
  markComplete: (id) => api.patch(`/regimen/${id}/complete`),
};

export const productAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  removeFromCart: (productId) => api.post('/cart/remove', { productId }),
  updateCartItem: (productId, quantity) => api.put('/cart/update', { productId, quantity }),
};

export const orderAPI = {
  createOrder: (data) => api.post('/orders/create', data),
  getUserOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getSOCMetrics: () => api.get('/admin/soc-metrics'),
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { adminStatus: status }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getUserActivity: (userId, params) => api.get(`/admin/activities/${userId}`, { params }),
  getAllActivities: (params) => api.get('/admin/activities', { params }),
  getAnomalies: () => api.get('/admin/anomalies'),
  getClickstreamMatrix: () => api.get('/admin/clickstream-matrix'),
};

export const analyticsAPI = {
  trackNavigation: (data) => api.post('/analytics/track-navigation', data),
};

export default api;
