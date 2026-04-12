// frontend/src/pages/ShopPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/product/productSlice';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import SEO from '../components/common/SEO';
import { 
  FiGrid, 
  FiList, 
  FiFilter, 
  FiX, 
  FiSearch,
  FiSliders,
  FiPackage,
  FiChevronDown,
  FiCheck,
  FiRefreshCw
} from 'react-icons/fi';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, totalProducts, page, pages, loading } = useSelector((state) => state.product);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    stockStatus: searchParams.get('stockStatus') || '',
    condition: searchParams.get('condition') || '',
    sort: searchParams.get('sort') || 'new-to-old',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: Number(searchParams.get('page')) || 1
  });

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Fetch products whenever filters change
  useEffect(() => {
    // Build query params for API - Remove empty values
    const queryParams = {};
    
    if (filters.keyword) queryParams.keyword = filters.keyword;
    if (filters.category) queryParams.category = filters.category;
    if (filters.stockStatus) queryParams.stockStatus = filters.stockStatus;
    if (filters.condition) queryParams.condition = filters.condition;
    if (filters.sort) queryParams.sort = filters.sort;
    if (filters.minPrice) queryParams.minPrice = filters.minPrice;
    if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
    if (filters.page) queryParams.page = filters.page;
    
    // Update URL params
    const urlParams = new URLSearchParams();
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key]) {
        urlParams.set(key, queryParams[key]);
      }
    });
    setSearchParams(urlParams);
    
    // Fetch products with all filters
    dispatch(fetchProducts(queryParams));
    console.log('Fetching with filters:', queryParams);
  }, [filters, dispatch, setSearchParams]);

  useEffect(() => {
    // Close sort dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.sort-dropdown')) {
        setShowSortDropdown(false);
      }
    };
    if (showSortDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSortDropdown]);

  const handleFilterChange = (newFilters) => {
    console.log('Filter changed:', newFilters);
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sortValue) => {
    setFilters((prev) => ({ ...prev, sort: sortValue, page: 1 }));
    setShowSortDropdown(false);
  };

  const clearAllFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      stockStatus: '',
      condition: '',
      sort: 'new-to-old',
      minPrice: '',
      maxPrice: '',
      page: 1
    });
  };

  const sortOptions = [
    { value: 'new-to-old', label: 'Newest First' },
    { value: 'old-to-new', label: 'Oldest First' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'a-z', label: 'Name: A to Z' },
    { value: 'z-a', label: 'Name: Z to A' },
  ];

  const activeFiltersCount = [
    filters.keyword,
    filters.category,
    filters.stockStatus,
    filters.condition,
    filters.minPrice,
    filters.maxPrice
  ].filter(Boolean).length;

  const currentSortLabel = sortOptions.find(opt => opt.value === filters.sort)?.label || 'Sort By';

  return (
    <div className="min-h-screen bg-bg-secondary">
      <SEO title="Shop" description="Browse our collection of collectible currencies and coins" />
      
      {/* Page Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              Shop All <span className="text-primary">Products</span>
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Discover our extensive collection of rare coins, vintage notes, and collectible stamps. 
              Each item is verified for authenticity.
            </p>
            
            {/* Search Bar - Desktop */}
            <div className="mt-8 max-w-xl mx-auto hidden sm:block">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange({ ...filters, keyword: e.target.value })}
                  placeholder="Search for coins, notes, stamps..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-bg-secondary
                           text-text-primary placeholder:text-text-light transition-all duration-300
                           focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20
                           focus:bg-white"
                />
                {filters.keyword && (
                  <button
                    onClick={() => handleFilterChange({ ...filters, keyword: '' })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-light 
                             hover:text-text-primary transition-colors duration-300 cursor-pointer"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left - Filter Toggle & Results Count */}
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-bg-secondary 
                         hover:bg-primary/10 text-text-primary rounded-xl font-medium 
                         transition-all duration-300 cursor-pointer border border-border
                         hover:border-primary/30"
              >
                <FiSliders className="w-5 h-5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-primary text-white text-xs font-bold rounded-full 
                                 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Results Count */}
              <div className="hidden sm:flex items-center gap-2 text-text-secondary">
                <FiPackage className="w-5 h-5 text-primary" />
                <span>
                  <span className="font-semibold text-text-primary">{totalProducts}</span> products found
                </span>
              </div>
            </div>

            {/* Right - Sort & View Toggle */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative sort-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSortDropdown(!showSortDropdown);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-bg-secondary hover:bg-primary/10 
                           text-text-primary rounded-xl font-medium transition-all duration-300 
                           cursor-pointer border border-border hover:border-primary/30"
                >
                  <span className="hidden sm:inline">Sort:</span>
                  <span className="text-primary">{currentSortLabel}</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform duration-300 
                                           ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl 
                                border border-border py-2 z-50">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left
                                  transition-colors duration-200 cursor-pointer
                                  ${filters.sort === option.value 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'text-text-secondary hover:bg-bg-secondary'
                                  }`}
                      >
                        <span>{option.label}</span>
                        {filters.sort === option.value && <FiCheck className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center bg-bg-secondary rounded-xl p-1 border border-border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all duration-300 cursor-pointer
                            ${viewMode === 'grid' 
                              ? 'bg-primary text-white shadow-md' 
                              : 'text-text-secondary hover:text-primary'
                            }`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all duration-300 cursor-pointer
                            ${viewMode === 'list' 
                              ? 'bg-primary text-white shadow-md' 
                              : 'text-text-secondary hover:text-primary'
                            }`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 sm:hidden">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleFilterChange({ ...filters, keyword: e.target.value })}
                placeholder="Search products..."
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-border bg-bg-secondary
                         text-text-primary placeholder:text-text-light transition-all duration-300
                         focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
              />
              {filters.keyword && (
                <button
                  onClick={() => handleFilterChange({ ...filters, keyword: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-light 
                           hover:text-text-primary transition-colors cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-text-secondary">Active filters:</span>
              
              {filters.keyword && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 
                               text-primary text-sm font-medium rounded-lg">
                  Search: "{filters.keyword}"
                  <button
                    onClick={() => handleFilterChange({ ...filters, keyword: '' })}
                    className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              
              {filters.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 
                               text-primary text-sm font-medium rounded-lg">
                  Category: {filters.category}
                  <button
                    onClick={() => handleFilterChange({ ...filters, category: '' })}
                    className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {filters.condition && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 
                               text-primary text-sm font-medium rounded-lg">
                  Condition: {filters.condition}
                  <button
                    onClick={() => handleFilterChange({ ...filters, condition: '' })}
                    className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {filters.stockStatus && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 
                               text-primary text-sm font-medium rounded-lg">
                  Stock: {filters.stockStatus}
                  <button
                    onClick={() => handleFilterChange({ ...filters, stockStatus: '' })}
                    className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 
                               text-primary text-sm font-medium rounded-lg">
                  Price: ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                  <button
                    onClick={() => handleFilterChange({ ...filters, minPrice: '', maxPrice: '' })}
                    className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-error text-sm 
                         font-medium hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                      <FiFilter className="w-5 h-5 text-primary" />
                      Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-error hover:text-error/80 font-medium 
                                 transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <ProductFilters 
                    filters={filters} 
                    onFilterChange={handleFilterChange}
                    showCategoryFilter={true}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-border p-12">
                <EmptyState
                  icon={
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 
                                  rounded-full flex items-center justify-center mx-auto">
                      <FiSearch className="w-12 h-12 text-primary" />
                    </div>
                  }
                  title="No Products Found"
                  message={
                    activeFiltersCount > 0
                      ? "No products match your current filters. Try adjusting or clearing the filters."
                      : "We couldn't find any products. Please check back later."
                  }
                  actionText={activeFiltersCount > 0 ? "Clear Filters" : "Browse Categories"}
                  onAction={activeFiltersCount > 0 ? clearAllFilters : undefined}
                  actionLink={activeFiltersCount > 0 ? undefined : "/categories"}
                />
              </div>
            ) : (
              <>
                {/* Products Count - Mobile */}
                <div className="sm:hidden mb-4 text-center text-text-secondary">
                  Showing <span className="font-semibold text-text-primary">{products.length}</span> of{' '}
                  <span className="font-semibold text-text-primary">{totalProducts}</span> products
                </div>

                {/* Product Grid */}
                <ProductGrid products={products} viewMode={viewMode} />

                {/* Pagination */}
                {pages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination 
                      page={page} 
                      pages={pages} 
                      onPageChange={handlePageChange} 
                    />
                  </div>
                )}

                {/* Results Summary */}
                <div className="mt-8 text-center text-sm text-text-secondary">
                  Showing {((page - 1) * 12) + 1} - {Math.min(page * 12, totalProducts)} of {totalProducts} products
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <>
          <div 
            className="fixed inset-0 bg-secondary/50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
          
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 lg:hidden 
                        shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-secondary/50">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <FiFilter className="w-5 h-5 text-primary" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="w-6 h-6 bg-primary text-white text-xs font-bold rounded-full 
                                 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary 
                         rounded-lg transition-colors cursor-pointer"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <ProductFilters 
                filters={filters} 
                onFilterChange={handleFilterChange}
                showCategoryFilter={true}
              />
            </div>

            <div className="p-6 border-t border-border bg-white">
              <div className="flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 px-4 bg-bg-secondary hover:bg-border text-text-primary 
                           rounded-xl font-semibold transition-all duration-300 cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 px-4 bg-primary hover:bg-primary-dark text-white 
                           rounded-xl font-semibold transition-all duration-300 cursor-pointer
                           shadow-lg shadow-primary/30"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopPage;