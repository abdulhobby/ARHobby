// frontend/src/pages/HomePage.jsx
import SEO from '../components/common/SEO';
import HeroBanner from '../components/home/HeroBanner';
import CategorySection from '../components/home/CategorySection';
import NewArrivals from '../components/home/NewArrivals';
import WhyChooseUs from '../components/home/WhyChooseUs';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMail, FiAward, FiTrendingUp, FiShield, FiHeadphones } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const HomePage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <SEO title="Home"
        description="Shop the best hobby products at AR Hobby. Discover quality collectibles, rare items, and hobby supplies with fast delivery across India."
        keywords="hobby store, collectibles India, hobby products online, AR Hobby"
        url="https://www.arhobby.in"
        type="website" />

      {/* Hero Section */}
      <HeroBanner />

      {/* Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <CategorySection />
      </section>

      <NewArrivals />

      {/* Promotional Banner with Premium Design */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-r from-slate-900 via-green-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold">LIMITED TIME OFFER</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Free Shipping on Orders Above
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  ₹1500
                </span>
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                Start building your collection today! Enjoy free delivery on all orders over ₹1500. Premium packaging guaranteed.
              </p>

              {/* Feature List */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: FiTrendingUp, text: 'Fast Shipping' },
                  { icon: FiShield, text: 'Secure Payment' },
                  { icon: FiAward, text: 'Authentic Items' },
                  { icon: FiHeadphones, text: '24/7 Support' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/40 active:scale-95 group text-lg"
              >
                Shop Now
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square">
                {/* Coin Cards Stack */}
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white to-gray-100 border-2 border-white/20 shadow-2xl transform"
                    style={{
                      transform: `rotate(${idx * 8}deg) scale(${1 - idx * 0.08}) translateY(${idx * 20}px)`,
                      transitionProperty: 'transform',
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl">💰</div>
                    </div>
                  </div>
                ))}

                {/* Floating Elements */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl opacity-20 blur-2xl animate-float"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <WhyChooseUs />
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-slate-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: '100+', label: 'Happy Customers', icon: '😊' },
              { number: '500+', label: 'Items Sold', icon: '🏆' },
              { number: '100%', label: 'Authentic Items', icon: '✓' },
              { number: '4.7★', label: 'Customer Rating', icon: '⭐' }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition duration-300">
                <div className="text-4xl sm:text-5xl mb-3">{stat.icon}</div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 mb-2">
                  {stat.number}
                </p>
                <p className="text-sm sm:text-base text-gray-400 group-hover:text-green-300 transition">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;