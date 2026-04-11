// frontend/src/components/home/NewArrivals.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchNewProducts } from '../../features/product/productSlice';
import ProductCard from '../product/ProductCard';
import { FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { IoSparklesSharp } from "react-icons/io5";

const NewArrivals = () => {
  const dispatch = useDispatch();
  const { newProducts, loading, error } = useSelector((state) => state.product);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Fetch new products with limit
    dispatch(fetchNewProducts({ limit: 20, page: 1 }));
  }, [dispatch, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Loading state
  if (loading && newProducts.length === 0) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
              <IoSparklesSharp className="w-5 h-5 text-green-600 animate-pulse" />
              <span className="text-sm font-bold text-green-700">JUST ARRIVED</span>
            </div>
            <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && newProducts.length === 0) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-red-100 rounded-full">
              <FiAlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-bold text-red-700">Unable to Load Products</span>
            </div>
            <p className="text-gray-600 mb-6">Failed to load new arrivals. Please try again.</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No products state
  if (!newProducts || newProducts.length === 0) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
              <IoSparklesSharp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-700">COMING SOON</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-4">
              New Arrivals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're adding new products regularly. Check back soon for fresh additions to our collection!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-gradient-to-tr from-blue-200 to-green-200 rounded-full opacity-5 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-300">
            <IoSparklesSharp className="w-5 h-5 text-green-600 animate-pulse" />
            <span className="text-sm font-bold text-green-700">JUST ARRIVED</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-4">
            New Arrivals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest additions to our exclusive collection of rare and authentic currencies from around the world
          </p>
        </div>

        {/* Products Grid */}
        {newProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newProducts.slice(0, 20).map((product) => (
                <ProductCard key={product._id} product={product} isNew={true} />
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center">
              <Link
                to="/new-arrivals"
                className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/40 active:scale-95 group"
              >
                <span>View All New Products</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-gray-600 mt-4">
                {newProducts.length}+ products added recently
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-yellow-100 rounded-full">
              <span className="text-sm font-bold text-yellow-700">No New Products Yet</span>
            </div>
            <p className="text-gray-600">Check back soon for new arrivals!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;