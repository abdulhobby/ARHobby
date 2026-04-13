// NotFoundPage.jsx
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { FiHome, FiShoppingBag, FiSearch, FiArrowLeft, FiHelpCircle } from 'react-icons/fi';
import { GiCoinflip } from 'react-icons/gi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <SEO title="Page Not Found" />

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40"></div>

        {/* Floating Coins */}
        <div className="absolute top-1/4 left-1/4 animate-bounce-subtle" style={{ animationDelay: '0s' }}>
          <div className="w-12 h-12 rounded-full bg-primary-200 opacity-50"></div>
        </div>
        <div className="absolute top-1/3 right-1/4 animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>
          <div className="w-8 h-8 rounded-full bg-primary-300 opacity-50"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-bounce-subtle" style={{ animationDelay: '1s' }}>
          <div className="w-16 h-16 rounded-full bg-primary-100 opacity-50"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-bounce-subtle" style={{ animationDelay: '1.5s' }}>
          <div className="w-10 h-10 rounded-full bg-primary-200 opacity-50"></div>
        </div>
      </div>

      <div className="relative text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[120px] sm:text-[180px] lg:text-[220px] font-black text-primary-100 leading-none select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 animate-pulse-green">
              <GiCoinflip className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-text-secondary text-lg max-w-md mx-auto">
            The page you are looking for doesn't exist or has been moved to a different location.
          </p>
        </div>

        {/* Search Suggestion */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-5 py-4 pl-12 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light shadow-lg transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white font-semibold rounded-lg cursor-pointer transition-all duration-300 hover:bg-primary-dark active:scale-95">
              Search
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-95 group"
          >
            <FiHome className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl border-2 border-primary cursor-pointer transition-all duration-300 hover:bg-primary-50 active:scale-95 group"
          >
            <FiShoppingBag className="w-5 h-5" />
            <span>Browse Shop</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-text-light mb-4">Or try these popular pages:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'World Coins', href: '/category/world-coins' },
              { label: 'Indian Currency', href: '/category/indian-currency' },
              { label: 'New Arrivals', href: '/shop?sort=new-to-old' },
              { label: 'Contact Us', href: '/contact' }
            ].map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm text-text-secondary rounded-lg border border-border-light hover:border-primary hover:text-primary transition-all duration-300 cursor-pointer text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Help Link */}
        <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <FiHelpCircle className="w-5 h-5" />
            <span>Need help? Contact our support team</span>
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline cursor-pointer group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Go back to previous page</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;