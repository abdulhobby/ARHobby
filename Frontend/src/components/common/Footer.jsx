import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiTruck, FiPackage } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-secondary text-text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 py-12 sm:py-16">
          {/* Brand Section with Logo */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 mb-4">
              {/* Logo Circle */}
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">AR</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary-light tracking-tight">
                  AR Hobby
                </h2>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xs">
              Your trusted destination for collectible currencies, coins, and numismatic
              treasures from around the world.
            </p>
            
            {/* Shipping Badge */}
            <div className="mt-6 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <FiTruck className="text-primary-light text-lg" />
                <span className="text-sm font-semibold text-primary-light">India Post Shipping</span>
              </div>
              <p className="text-xs text-gray-400">
                All orders shipped via India Post with tracking number
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-accent mb-5 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1.5 left-0 w-10 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/new-arrivals', label: 'New Arrivals' },
                { to: '/shop', label: 'Shop' },
                { to: '/about', label: 'About Us' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-400 hover:text-primary-light text-sm sm:text-base 
                             cursor-pointer transition-colors duration-300 hover:translate-x-1 
                             transform inline-flex items-center gap-1 w-fit"
                >
                  <span className="opacity-0 hover:opacity-100 transition-opacity">›</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* My Account */}
          <div>
            <h3 className="text-lg font-semibold text-accent mb-5 relative inline-block">
              My Account
              <span className="absolute -bottom-1.5 left-0 w-10 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { to: '/profile', label: 'Profile' },
                { to: '/orders', label: 'My Orders' },
                { to: '/terms-and-conditions', label: 'Terms & Conditions' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-400 hover:text-primary-light text-sm sm:text-base 
                             cursor-pointer transition-colors duration-300 hover:translate-x-1 
                             transform inline-flex items-center gap-1 w-fit"
                >
                  <span className="opacity-0 hover:opacity-100 transition-opacity">›</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h3 className="text-lg font-semibold text-accent mb-5 relative inline-block">
              Shipping Info
              <span className="absolute -bottom-1.5 left-0 w-10 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-gray-400 text-sm sm:text-base">
                <FiPackage className="text-primary-light text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Delivery Time</p>
                  <p className="text-gray-400 text-xs">2-3 business days after payment verification</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-400 text-sm sm:text-base">
                <FiTruck className="text-primary-light text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Shipping Partner</p>
                  <p className="text-gray-400 text-xs">India Post (Trackable)</p>
                </div>
              </div>
              <div className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-xs text-green-400 text-center">
                  🚚 Free shipping on orders above ₹1000
                </p>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold text-accent mb-5 relative inline-block">
              Contact Us
              <span className="absolute -bottom-1.5 left-0 w-10 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <div className="flex flex-col gap-4">
              <p className="flex items-start gap-3 text-gray-400 text-sm sm:text-base">
                <FiMapPin className="text-primary-light text-lg mt-0.5 flex-shrink-0" />
                <span>Prayagraj, Uttar Pradesh, India</span>
              </p>
              <a 
                href="tel:+917081434589" 
                className="flex items-center gap-3 text-gray-400 hover:text-primary-light text-sm sm:text-base transition-colors duration-300"
              >
                <FiPhone className="text-primary-light text-lg flex-shrink-0" />
                <span>+91-7081434589</span>
              </a>
              <a 
                href="https://wa.me/917081434589" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-green-400 text-sm sm:text-base transition-colors duration-300"
              >
                <FaWhatsapp className="text-green-500 text-lg flex-shrink-0" />
                <span>WhatsApp: 7081434589</span>
              </a>
              <a 
                href="mailto:arhobby@email.com" 
                className="flex items-center gap-3 text-gray-400 hover:text-primary-light text-sm sm:text-base transition-colors duration-300"
              >
                <FiMail className="text-primary-light text-lg flex-shrink-0" />
                <span>arhobby4@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with India Post Highlight */}
        <div className="border-t border-gray-700/60 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Small Logo in Bottom Bar */}
              <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">AR</span>
              </div>
              <p className="text-center text-gray-500 text-xs sm:text-sm">
                &copy; {new Date().getFullYear()} AR Hobby. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <FiTruck className="text-primary-light text-sm" />
                <span className="text-xs text-gray-400">India Post Shipping</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                <span className="text-xs text-green-400">✓ Trackable Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;