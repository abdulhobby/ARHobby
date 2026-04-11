import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/auth/authSlice';
import { fetchCart } from './features/cart/cartSlice';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';

// Page Components
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import TrackOrderPage from './pages/TrackOrderPage';
import ProfilePage from './pages/ProfilePage';
import AddressesPage from './pages/AddressesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import NewArrivals from './components/home/NewArrivals';
import TermsAndConditions from './pages/TermsAndConditions';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);

  // Load user on app mount
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  // Pages where header/footer should be hidden (auth pages with custom layout)
  const authPages = ['/login', '/register', '/forgot-password'];
  const isResetPasswordPage = location.pathname.startsWith('/reset-password');
  const hideLayout = authPages.includes(location.pathname) || isResetPasswordPage;

  // Pages where footer should be minimal or hidden
  const minimalFooterPages = ['/checkout', '/order-success'];
  const showMinimalFooter = minimalFooterPages.some(page => location.pathname.startsWith(page));

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Scroll To Top on Route Change */}
      <ScrollToTop />
      
      {/* Header - Hidden on auth pages */}
      {!hideLayout && <Header />}
      
      {/* Main Content Area */}
      <main className={`flex-1 ${!hideLayout ? 'pt-0' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* Protected Routes - Require Authentication */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-success/:id" 
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order/:id" 
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/track-order/:id" 
            element={
              <ProtectedRoute>
                <TrackOrderPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addresses" 
            element={
              <ProtectedRoute>
                <AddressesPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      {/* Footer - Hidden on auth pages, minimal on checkout */}
      {!hideLayout && (
        <Footer minimal={showMinimalFooter} />
      )}
    </div>
  );
}

export default App;