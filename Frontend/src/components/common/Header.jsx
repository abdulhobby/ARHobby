import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiLogOut,
  FiPackage,
  FiMapPin,
  FiTruck,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${searchQuery}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdown(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const cartItemCount = cart?.totalItems || 0;

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <>
      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-[104px] sm:h-[108px] lg:h-[112px]"></div>

      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Sub Header - Free Delivery & WhatsApp */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2.5 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
              {/* Free Delivery Message */}
              <div className="flex items-center gap-2">
                <FiTruck className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-center sm:text-left">
                  Free delivery on orders above ₹1000!
                </span>
              </div>
              
              {/* WhatsApp Contact */}
              <a 
                href="https://wa.me/917081434589" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all duration-300 group"
              >
                <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">
                  Need help? WhatsApp: 7081434589
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-bg-primary/95 backdrop-blur-md border-b border-border-light shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 cursor-pointer group flex items-center gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AR</span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary tracking-tight group-hover:text-primary-dark transition-colors duration-300">
                  <span className="text-secondary">Hobby</span>
                </h1>
              </Link>

              {/* Desktop Navigation Menu */}
              <nav className="hidden lg:flex items-center gap-1 ml-6">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/shop', label: 'Shop' },
                  { to: '/about', label: 'About' },
                  { to: '/contact', label: 'Contact' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary 
                             hover:text-primary hover:bg-primary-50 cursor-pointer 
                             transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Collapsible Search Bar */}
                <div ref={searchRef} className="relative">
                  {searchOpen ? (
                    <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
                      <div className="relative">
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search collectibles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-64 sm:w-80 pl-10 pr-4 py-2 rounded-full border-2 border-primary 
                                   bg-white text-text-primary text-sm
                                   placeholder:text-text-light
                                   focus:outline-none focus:ring-2 focus:ring-primary-200
                                   transition-all duration-300 shadow-lg"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg" />
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setSearchOpen(true)}
                      className="p-2.5 rounded-full hover:bg-primary-50 cursor-pointer 
                               transition-all duration-300 group"
                    >
                      <FiSearch className="text-xl sm:text-2xl text-text-secondary group-hover:text-primary transition-colors" />
                    </button>
                  )}
                </div>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative p-2.5 rounded-full hover:bg-primary-50 cursor-pointer 
                           transition-all duration-300 group"
                >
                  <FiShoppingCart
                    className="text-xl sm:text-2xl text-text-secondary 
                                            group-hover:text-primary transition-colors duration-300"
                  />
                  {cartItemCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 bg-primary text-text-white text-[10px] 
                                 font-bold w-5 h-5 rounded-full flex items-center justify-center 
                                 shadow-md"
                    >
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* Auth Section */}
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdown(!profileDropdown)}
                      className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full 
                               border-2 border-border-light hover:border-primary 
                               cursor-pointer transition-all duration-300 group bg-bg-primary"
                    >
                      <div
                        className="w-8 h-8 rounded-full bg-primary-100 flex items-center 
                                    justify-center group-hover:bg-primary-200 transition-colors duration-300"
                      >
                        <FiUser className="text-primary text-sm" />
                      </div>
                      <span className="text-sm font-medium text-text-secondary group-hover:text-primary transition-colors">
                        {user?.name?.split(' ')[0]}
                      </span>
                    </button>

                    {/* Mobile user icon */}
                    <button
                      onClick={() => setProfileDropdown(!profileDropdown)}
                      className="sm:hidden p-2.5 rounded-full hover:bg-primary-50 cursor-pointer 
                               transition-all duration-300"
                    >
                      <FiUser className="text-xl text-text-secondary" />
                    </button>

                    {/* Profile Dropdown */}
                    {profileDropdown && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileDropdown(false)}
                        ></div>

                        <div
                          className="absolute right-0 mt-2 w-56 bg-bg-primary rounded-xl shadow-2xl 
                                      border border-border-light z-50 py-2 
                                      animate-[fadeIn_0.2s_ease-in-out]"
                        >
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-border-light">
                            <p className="text-sm font-semibold text-text-primary truncate">
                              {user?.name}
                            </p>
                            <p className="text-xs text-text-light truncate">{user?.email}</p>
                          </div>

                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary 
                                     hover:bg-primary-50 hover:text-primary cursor-pointer 
                                     transition-all duration-200"
                          >
                            <FiUser className="text-base" /> Profile
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setProfileDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary 
                                     hover:bg-primary-50 hover:text-primary cursor-pointer 
                                     transition-all duration-200"
                          >
                            <FiPackage className="text-base" /> Orders
                          </Link>
                          <Link
                            to="/addresses"
                            onClick={() => setProfileDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary 
                                     hover:bg-primary-50 hover:text-primary cursor-pointer 
                                     transition-all duration-200"
                          >
                            <FiMapPin className="text-base" /> Addresses
                          </Link>

                          <div className="border-t border-border-light mt-1 pt-1">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm 
                                       text-error hover:bg-red-50 cursor-pointer 
                                       transition-all duration-200"
                            >
                              <FiLogOut className="text-base" /> Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark 
                               cursor-pointer transition-colors duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-text-white text-sm 
                               font-semibold rounded-lg cursor-pointer transition-all duration-300 
                               shadow-md hover:shadow-lg"
                    >
                      Register
                    </Link>
                  </div>
                )}

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="lg:hidden p-2.5 rounded-lg hover:bg-primary-50 cursor-pointer 
                           transition-all duration-300"
                >
                  {menuOpen ? (
                    <FiX className="text-2xl text-text-secondary" />
                  ) : (
                    <FiMenu className="text-2xl text-text-secondary" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="lg:hidden bg-bg-primary border-t border-border-light shadow-xl 
                        animate-[slideDown_0.3s_ease-in-out] max-h-[80vh] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {/* Navigation Links */}
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Shop' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-text-secondary font-medium 
                           hover:bg-primary-50 hover:text-primary cursor-pointer 
                           transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-border-light my-2"></div>

              {isAuthenticated && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary 
                             font-medium hover:bg-primary-50 hover:text-primary cursor-pointer 
                             transition-all duration-200"
                  >
                    <FiUser className="text-lg" /> Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary 
                             font-medium hover:bg-primary-50 hover:text-primary cursor-pointer 
                             transition-all duration-200"
                  >
                    <FiPackage className="text-lg" /> Orders
                  </Link>
                  <Link
                    to="/addresses"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary 
                             font-medium hover:bg-primary-50 hover:text-primary cursor-pointer 
                             transition-all duration-200"
                  >
                    <FiMapPin className="text-lg" /> Addresses
                  </Link>

                  <div className="border-t border-border-light my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-error 
                             font-medium hover:bg-red-50 cursor-pointer transition-all duration-200"
                  >
                    <FiLogOut className="text-lg" /> Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center px-4 py-3 border-2 border-primary text-primary 
                             font-semibold rounded-lg cursor-pointer hover:bg-primary-50 
                             transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center px-4 py-3 bg-primary hover:bg-primary-dark 
                             text-text-white font-semibold rounded-lg cursor-pointer 
                             transition-all duration-300 shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
};

export default Header;