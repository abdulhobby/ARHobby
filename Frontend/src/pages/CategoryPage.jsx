// CategoryPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByCategory } from '../features/product/productSlice';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';
import { buildQueryString } from '../utils/helpers';
import { 
  FiGrid, 
  FiList, 
  FiFilter, 
  FiX, 
  FiPackage,
  FiChevronRight,
  FiHome,
  FiSliders
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { categoryProducts, category, totalProducts, page, pages, loading } = useSelector((state) => state.product);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    stockStatus: searchParams.get('stockStatus') || '',
    condition: searchParams.get('condition') || '',
    sort: searchParams.get('sort') || 'new-to-old',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: Number(searchParams.get('page')) || 1
  });

  useEffect(() => {
    const queryParams = buildQueryString(filters);
    setSearchParams(queryParams);
    dispatch(fetchProductsByCategory({ slug, params: queryParams }));
  }, [filters, slug, dispatch, setSearchParams]);

  useEffect(() => {
    setFilters({
      keyword: '',
      stockStatus: '',
      condition: '',
      sort: 'new-to-old',
      minPrice: '',
      maxPrice: '',
      page: 1
    });
  }, [slug]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setShowMobileFilters(false);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount = [
    filters.keyword,
    filters.stockStatus,
    filters.condition,
    filters.minPrice,
    filters.maxPrice
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-bg-secondary">
      <SEO
        title={category?.name || 'Category'}
        description={category?.description || `Browse ${category?.name} collection`}
      />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        {/* Background Image */}
        {category?.image?.url && (
          <div className="absolute inset-0">
            <img 
              src={category.image.url} 
              alt={category?.name}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/70"></div>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 left-20 w-24 h-24 border-4 border-white rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-200 mb-6">
            <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
              <FiHome className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <FiChevronRight className="w-4 h-4" />
            <Link to="/shop" className="hover:text-white transition-colors cursor-pointer">
              Shop
            </Link>
            <FiChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{category?.name}</span>
          </nav>

          {/* Category Info */}
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in">
              {category?.name}
            </h1>
            {category?.description && (
              <p className="text-lg text-primary-100 mb-6 leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {category.description}
              </p>
            )}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <FiPackage className="w-5 h-5 text-primary-300" />
              <span className="text-white font-medium">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
              </span>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8 sm:h-12">
            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f0fdf4"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border border-border rounded-xl font-medium text-text-primary cursor-pointer transition-all duration-300 hover:border-primary hover:text-primary active:scale-95"
          >
            <FiFilter className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort and View Options */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Sort Dropdown */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value, page: 1 })}
              className="px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium text-text-primary cursor-pointer transition-all duration-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="new-to-old">Newest First</option>
              <option value="old-to-new">Oldest First</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
              <option value="name-z-a">Name: Z to A</option>
            </select>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center bg-white border border-border rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'text-text-light hover:text-primary'
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-primary text-white' 
                    : 'text-text-light hover:text-primary'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 p-4 bg-primary-50 border-b border-border-light">
                  <FiSliders className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-text-primary">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <span className="ml-auto w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <ProductFilters 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    showCategoryFilter={false} 
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowMobileFilters(false)}
              ></div>
              <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl animate-slide-in-right overflow-y-auto">
                <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b border-border-light z-10">
                  <div className="flex items-center gap-2">
                    <FiSliders className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-text-primary">Filters</h2>
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4">
                  <ProductFilters 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    showCategoryFilter={false} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader />
              </div>
            ) : categoryProducts.length > 0 ? (
              <>
                <ProductGrid products={categoryProducts} viewMode={viewMode} />
                
                {pages > 1 && (
                  <div className="mt-8">
                    <Pagination 
                      page={page} 
                      pages={pages} 
                      onPageChange={handlePageChange} 
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-border-light shadow-sm p-8 sm:p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <FiPackage className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">No Products Found</h3>
                <p className="text-text-light mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={() => handleFilterChange({
                    keyword: '',
                    stockStatus: '',
                    condition: '',
                    sort: 'new-to-old',
                    minPrice: '',
                    maxPrice: '',
                    page: 1
                  })}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark active:scale-95"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;