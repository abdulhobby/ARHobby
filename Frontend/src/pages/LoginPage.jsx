// LoginPage.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, clearError } from '../features/auth/authSlice';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiArrowRight,
  FiShield,
  FiUser
} from 'react-icons/fi';
import { GiCoinflip } from 'react-icons/gi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
  if (error) {
    // Check if the error indicates email not verified
    if (error.toLowerCase().includes('verify your email') || error.toLowerCase().includes('please verify')) {
      // Extract email from the error message (if present) or use the input email
      const emailMatch = error.match(/email:?\s*([^\s]+)/i);
      const emailToVerify = emailMatch ? emailMatch[1] : email;
      navigate(`/verify-email?email=${encodeURIComponent(emailToVerify || email)}`);
      toast.error('Please verify your email first. Check your inbox.');
    } else {
      toast.error(error);
    }
    dispatch(clearError());
  }
}, [error, dispatch, navigate, email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex">
      <SEO title="Login" />

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-primary-50 via-white to-primary-100">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:w-1/2">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-300 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <GiCoinflip className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-text-primary">AR Hobby</span>
          </Link>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">Welcome Back!</h1>
            <p className="text-text-secondary">
              Login to access your account and continue collecting
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                <FiMail className="w-4 h-4 text-primary" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3.5 pl-12 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 group-hover:border-primary-300"
                />
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                <FiLock className="w-4 h-4 text-primary" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 group-hover:border-primary-300"
                />
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light group-focus-within:text-primary transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-light hover:text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded border-2 border-border peer-checked:border-primary peer-checked:bg-primary transition-all duration-300 flex items-center justify-center">
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors cursor-pointer"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white font-bold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  <span>Login to Account</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-primary-50 via-white to-primary-100 text-text-light">
                New to AR Hobby?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-primary font-semibold rounded-xl border-2 border-primary cursor-pointer transition-all duration-300 hover:bg-primary-50 active:scale-[0.98] group"
          >
            <FiUser className="w-5 h-5" />
            <span>Create an Account</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Security Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-text-light">
            <FiShield className="w-4 h-4 text-primary" />
            <span>Secure & encrypted login</span>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-white rounded-full"></div>
        </div>

        <div className="relative text-center text-white max-w-lg">
          <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 animate-bounce-subtle">
            <GiCoinflip className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Welcome to AR Hobby
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Your trusted destination for rare and collectible currencies from around the world.
          </p>
          <div className="space-y-4">
            {[
              '100% Authentic Items',
              'Secure Transactions',
              'Expert Curation',
              'India Post Shipping'
            ].map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-primary-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
