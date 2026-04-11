// frontend/src/pages/NewArrivalsPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewProducts } from '../features/product/productSlice';
import SEO from '../components/common/SEO';
import ProductCard from '../components/products/ProductCard';
import { FiFilter, FiGrid, FiList, FiSpark } from 'react-icons/fi';

const NewArrivalsPage = () => {
  const dispatch = useDispatch();
  const { newProducts, totalProducts, page, pages, loading } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 12,
      sort: sortBy === 'newest' ? '-createdAt' : sortBy === 'price-low' ? 'price' : '-price'
    };
    dispatch(fetchNewProducts(params));
    window.scrollTo(0, 0);
  }, [dispatch, currentPage, sortBy]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <SEO 
        title="New Arrivals" 
        description="Discover our latest collection of rare and authentic currencies" 
      />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-white bg-opacity-20 rounded-full backdrop-blur">
              <FiSpark className="w-5 h-5" />
              <span className="text-sm font-bold">BRAND NEW PRODUCTS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              New Arrivals
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Explore the latest additions to our collection. Fresh inventory added daily!
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Sort Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* View Type */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    View Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewType('grid')}
                      className={`flex-1 py-2 rounded-lg border-2 transition ${
                        viewType === 'grid'
                          ? 'border-green-600 bg-green-50 text-green-600'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <FiGrid className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => setViewType('list')}
                      className={`flex-1 py-2 rounded-lg border-2 transition ${
                        viewType === 'list'
                          ? 'border-green-600 bg-green-50 text-green-600'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <FiList className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>

                {/* Clear Filters */}
                <button className="w-full py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Products */}
            <div className="lg:col-span-3">
              {/* Header Controls */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 font-semibold">
                  Showing {(currentPage - 1) * 12 + 1} – {Math.min(currentPage * 12, totalProducts)} of {totalProducts} products
                </p>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FiFilter className="w-5 h-5" />
                  Filters
                </button>
              </div>

              {/* Products Grid */}
              {viewType === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {loading && newProducts.length === 0 ? (
                    [...Array(12)].map((_, idx) => (
                      <div key={idx} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
                    ))
                  ) : newProducts.length > 0 ? (
                    newProducts.map((product) => (
                      <ProductCard key={product._id} product={product} isNew={true} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-600 text-lg">No products found</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 mb-12">
                  {loading && newProducts.length === 0 ? (
                    [...Array(6)].map((_, idx) => (
                      <div key={idx} className="bg-gray-200 rounded-xl h-24 animate-pulse" />
                    ))
                  ) : newProducts.length > 0 ? (
                    newProducts.map((product) => (
                      <ProductListItem key={product._id} product={product} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-lg">No products found</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    ← Previous
                  </button>

                  {[...Array(Math.min(5, pages))].map((_, idx) => {
                    let pageNum = idx + 1;
                    if (pages > 5 && currentPage > 3) {
                      pageNum = currentPage - 2 + idx;
                    }
                    if (pageNum > pages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg transition ${
                          currentPage === pageNum
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// List View Item Component
const ProductListItem = ({ product }) => {
  return (
    <div className="flex gap-4 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 overflow-hidden">
        <img 
          src={product.images?.[0]?.url} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.category?.name}</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
            NEW
          </span>
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-lg font-bold text-green-600">₹{product.price}</p>
            {product.comparePrice > product.price && (
              <p className="text-sm line-through text-gray-500">₹{product.comparePrice}</p>
            )}
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;