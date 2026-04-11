// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword: (token, data) => API.put(`/auth/reset-password/${token}`, data)
};

export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  updatePassword: (data) => API.put('/users/password', data),
  updateAvatar: (formData) => API.put('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// frontend/src/services/api.js (Updated productAPI section)
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getBySlug: (slug) => API.get(`/products/slug/${slug}`),
  getByCategory: (slug, params) => API.get(`/products/category/${slug}`, { params }),
  getFeatured: (params) => API.get('/products/featured', { params }),
  getNew: (params) => {
    console.log('Fetching new products with params:', params);
    return API.get('/products/new', { params });
  },
  getLatest: (params) => API.get('/products/latest', { params }),
  getRelated: (id, params) => API.get(`/products/related/${id}`, { params })
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  getBySlug: (slug) => API.get(`/categories/slug/${slug}`)
};

export const cartAPI = {
  get: () => API.get('/cart'),
  add: (data) => API.post('/cart/add', data),
  update: (data) => API.put('/cart/update', data),
  remove: (productId) => API.delete(`/cart/remove/${productId}`),
  clear: () => API.delete('/cart/clear')
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: (params) => API.get('/orders/my-orders', { params }),
  getById: (id) => API.get(`/orders/${id}`),
  track: (id) => API.get(`/orders/${id}/track`),
  downloadInvoice: (id) => API.get(`/orders/${id}/invoice`),
  getStoreInfo: () => API.get('/orders/store-info')
};

export const addressAPI = {
  getAll: () => API.get('/addresses'),
  add: (data) => API.post('/addresses', data),
  update: (id, data) => API.put(`/addresses/${id}`, data),
  delete: (id) => API.delete(`/addresses/${id}`),
  setDefault: (id) => API.put(`/addresses/${id}/default`)
};

export const couponAPI = {
  apply: (data) => API.post('/coupons/apply', data)
};

export const contactAPI = {
  submit: (data) => API.post('/contact', data)
};

export default API;