import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/admin/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/admin/me')
};

export const dashboardAPI = {
  getStats: () => API.get('/admin/dashboard')
};

export const productAPI = {
  getAll: (params) => API.get('/products/admin', { params }),
  getById: (id) => API.get(`/products/${id}`),
  create: (formData) => API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/products/${id}`)
};

export const categoryAPI = {
  getAll: () => API.get('/categories/admin'),
  getById: (id) => API.get(`/categories/${id}`),
  create: (formData) => API.post('/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/categories/${id}`)
};

export const cartAPI = {
  getAll: (params) => API.get('/admin/carts', { params }),
  getAnalytics: () => API.get('/admin/carts/analytics'),
  getCartByUser: (userId) => API.get(`/admin/carts/user/${userId}`),
  removeItem: (userId, productId) => API.delete(`/admin/carts/user/${userId}/item/${productId}`),
  updateItem: (userId, productId, quantity) => API.put(`/admin/carts/user/${userId}/item/${productId}`, { quantity }),
  clearCart: (userId) => API.delete(`/admin/carts/user/${userId}/clear`),
  deleteCart: (userId) => API.delete(`/admin/carts/user/${userId}`),
  exportCarts: () => API.get('/admin/carts/export')
};

export const orderAPI = {
  getAll: (params) => API.get('/orders/admin/all', { params }),
  getById: (id) => API.get(`/orders/${id}`),
  updateStatus: (id, data) => API.put(`/orders/admin/${id}/status`, data),
  getNew: () => API.get('/orders/admin/new'),
  markViewed: (id) => API.put(`/orders/admin/${id}/viewed`),
  markAllViewed: () => API.put('/orders/admin/mark-all-viewed'),
  downloadInvoice: (id) => API.get(`/orders/${id}/invoice`)
};

export const couponAPI = {
  getAll: () => API.get('/coupons'),
  getById: (id) => API.get(`/coupons/${id}`),
  create: (data) => API.post('/coupons', data),
  update: (id, data) => API.put(`/coupons/${id}`, data),
  delete: (id) => API.delete(`/coupons/${id}`)
};

export const userAPI = {
  getAll: (params) => API.get('/users/all', { params })
};

export const contactAPI = {
  getAll: (params) => API.get('/contact', { params }),
  updateStatus: (id, data) => API.put(`/contact/${id}`, data),
  delete: (id) => API.delete(`/contact/${id}`)
};

export const subscriberAPI = {
  getAll: (params) => API.get('/subscribers', { params }),
  getStats: () => API.get('/subscribers/stats'),
  add: (data) => API.post('/subscribers', data),
  import: (formData) => API.post('/subscribers/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/subscribers/${id}`),
  export: (status) => API.get(`/subscribers/export/csv?status=${status}`, { responseType: 'blob' })
};

export const campaignAPI = {
  getAll: (params) => API.get('/campaigns', { params }),
  getById: (id) => API.get(`/campaigns/${id}`),
  getStats: () => API.get('/campaigns/stats'),
  create: (formData) => API.post('/campaigns', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/campaigns/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/campaigns/${id}`),
  cancel: (id) => API.put(`/campaigns/${id}/cancel`)
};

export default API;