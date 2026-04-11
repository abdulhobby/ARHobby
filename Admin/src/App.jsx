// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAdmin } from './features/auth/adminAuthSlice';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import CategoriesPage from './pages/CategoriesPage';
import AddCategoryPage from './pages/AddCategoryPage';
import EditCategoryPage from './pages/EditCategoryPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CouponsPage from './pages/CouponsPage';
import AddCouponPage from './pages/AddCouponPage';
import EditCouponPage from './pages/EditCouponPage';
import UsersPage from './pages/UsersPage';
import ContactsPage from './pages/ContactsPage';
import AdminCampaignsPage from './pages/AdminCampaignsPage';
import AdminCreateCampaignPage from './pages/AdminCreateCampaignPage';
import AdminCampaignDetailPage from './pages/AdminCampaignDetailPage';
import AdminSubscribersPage from './pages/AdminSubscribersPage';
import Carts from './pages/Carts';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.adminAuth);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            
            {/* Animated ring */}
            <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 animate-pulse">
            Loading Admin Panel...
          </p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAdmin());
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Route - Login */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes - Admin Panel */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<DashboardPage />} />
        
        {/* Products */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        
        {/* Categories */}
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/add" element={<AddCategoryPage />} />
        <Route path="categories/edit/:id" element={<EditCategoryPage />} />

        <Route path="carts" element={<Carts />} />
        
        {/* Orders */}
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        
        {/* Coupons */}
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="coupons/add" element={<AddCouponPage />} />
        <Route path="coupons/edit/:id" element={<EditCouponPage />} />

        {/* Campaigns Management */}
            <Route path="campaigns" element={<AdminCampaignsPage />} />
            <Route path="campaigns/create" element={<AdminCreateCampaignPage />} />
            <Route path="campaigns/:id" element={<AdminCampaignDetailPage />} />
            <Route path="campaigns/:id/edit" element={<AdminCreateCampaignPage />} />

            {/* Subscribers Management */}
            <Route path="subscribers" element={<AdminSubscribersPage />} />
        
        {/* Users */}
        <Route path="users" element={<UsersPage />} />
        
        {/* Contacts */}
        <Route path="contacts" element={<ContactsPage />} />
      </Route>
      
      {/* Catch all - Redirect to Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;