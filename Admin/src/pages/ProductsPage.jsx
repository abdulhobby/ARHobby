// pages/admin/ProductsPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchProducts, deleteProduct, markProductAsNew, removeNewStatus } from '../features/products/adminProductSlice';
import { fetchCategories } from '../features/categories/adminCategorySlice';
import { fetchSubCategories } from '../features/subCategory/adminSubCategorySlice';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/helpers';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiPackage, 
  FiFilter, 
  FiX,
  FiChevronDown,
  FiGrid,
  FiList,
  FiMapPin,
  FiBox,
  FiLayers,
  FiClock,
  FiAward
} from 'react-icons/fi';
import { IoSparklesSharp } from "react-icons/io5";
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { products, totalProducts, page, pages, loading } = useSelector((state) => state.adminProduct);
  const { categories } = useSelector((state) => state.adminCategory);
  const { subCategories } = useSelector((state) => state.adminSubCategory);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    country: '',
    material: '',
    stockStatus: '',
    isFeatured: '',
    sortBy: '-createdAt',
    minPrice: '',
    maxPrice: '',
    condition: '',
    rarity: ''
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  // Get unique countries and materials from products
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  
  // Fetch categories and sub-categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
  }, [dispatch]);
  
  // Get query params from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    const subCategoryParam = params.get('subCategory');
    const countryParam = params.get('country');
    const materialParam = params.get('material');
    const stockStatusParam = params.get('stockStatus');
    const featuredParam = params.get('featured');
    const sortParam = params.get('sort');
    const conditionParam = params.get('condition');
    const rarityParam = params.get('rarity');
    const minPriceParam = params.get('minPrice');
    const maxPriceParam = params.get('maxPrice');
    
    if (pageParam) setCurrentPage(parseInt(pageParam));
    if (searchParam) {
      setSearch(searchParam);
      setSearchInput(searchParam);
    }
    if (categoryParam) setFilters(prev => ({ ...prev, category: categoryParam }));
    if (subCategoryParam) setFilters(prev => ({ ...prev, subCategory: subCategoryParam }));
    if (countryParam) setFilters(prev => ({ ...prev, country: countryParam }));
    if (materialParam) setFilters(prev => ({ ...prev, material: materialParam }));
    if (stockStatusParam) setFilters(prev => ({ ...prev, stockStatus: stockStatusParam }));
    if (featuredParam) setFilters(prev => ({ ...prev, isFeatured: featuredParam }));
    if (sortParam) setFilters(prev => ({ ...prev, sortBy: sortParam }));
    if (conditionParam) setFilters(prev => ({ ...prev, condition: conditionParam }));
    if (rarityParam) setFilters(prev => ({ ...prev, rarity: rarityParam }));
    if (minPriceParam) setFilters(prev => ({ ...prev, minPrice: minPriceParam }));
    if (maxPriceParam) setFilters(prev => ({ ...prev, maxPrice: maxPriceParam }));
  }, [location.search]);

  // Fetch products when filters or page changes
  useEffect(() => {
    const params = { 
      page: currentPage,
      limit: 12
    };
    
    if (search) params.keyword = search;
    if (filters.category) params.category = filters.category;
    if (filters.subCategory) params.subCategory = filters.subCategory;
    if (filters.country) params.country = filters.country;
    if (filters.material) params.material = filters.material;
    if (filters.stockStatus) params.stockStatus = filters.stockStatus;
    if (filters.isFeatured) params.isFeatured = filters.isFeatured;
    if (filters.sortBy) params.sort = filters.sortBy;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.condition) params.condition = filters.condition;
    if (filters.rarity) params.rarity = filters.rarity;
    
    dispatch(fetchProducts(params));
    
    // Update URL with query params
    updateUrlParams(params);
  }, [dispatch, currentPage, search, filters]);

  // Extract unique countries and materials from products
  useEffect(() => {
    if (products && products.length > 0) {
      const countries = [...new Set(products.map(p => p.country).filter(c => c && c.trim()))];
      const materials = [...new Set(products.map(p => p.material).filter(m => m && m.trim()))];
      setAvailableCountries(countries.sort());
      setAvailableMaterials(materials.sort());
    }
  }, [products]);

  const updateUrlParams = (params) => {
    const urlParams = new URLSearchParams();
    if (params.page && params.page !== 1) urlParams.set('page', params.page);
    if (params.keyword) urlParams.set('search', params.keyword);
    if (params.category) urlParams.set('category', params.category);
    if (params.subCategory) urlParams.set('subCategory', params.subCategory);
    if (params.country) urlParams.set('country', params.country);
    if (params.material) urlParams.set('material', params.material);
    if (params.stockStatus) urlParams.set('stockStatus', params.stockStatus);
    if (params.isFeatured) urlParams.set('featured', params.isFeatured);
    if (params.sort && params.sort !== '-createdAt') urlParams.set('sort', params.sort);
    if (params.condition) urlParams.set('condition', params.condition);
    if (params.rarity) urlParams.set('rarity', params.rarity);
    if (params.minPrice) urlParams.set('minPrice', params.minPrice);
    if (params.maxPrice) urlParams.set('maxPrice', params.maxPrice);
    
    const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleDelete = () => {
    dispatch(deleteProduct(deleteModal.id))
      .unwrap()
      .then(() => {
        toast.success('Product deleted successfully');
        dispatch(fetchProducts({ page: currentPage }));
      })
      .catch((err) => toast.error(err));
    setDeleteModal({ open: false, id: null });
  };

  // ✅ NEW: Handle Mark as New
  const handleMarkAsNew = async (id) => {
    try {
      await dispatch(markProductAsNew(id)).unwrap();
      toast.success('Product marked as New! It will appear in New Arrivals for 48 hours.');
      dispatch(fetchProducts({ page: currentPage, ...filters }));
    } catch (err) {
      toast.error(err);
    }
  };

  // ✅ NEW: Handle Remove New Status
  const handleRemoveNewStatus = async (id) => {
    try {
      await dispatch(removeNewStatus(id)).unwrap();
      toast.success('New status removed from product');
      dispatch(fetchProducts({ page: currentPage, ...filters }));
    } catch (err) {
      toast.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      subCategory: '',
      country: '',
      material: '',
      stockStatus: '',
      isFeatured: '',
      sortBy: '-createdAt',
      minPrice: '',
      maxPrice: '',
      condition: '',
      rarity: ''
    });
    setSearch('');
    setSearchInput('');
    setCurrentPage(1);
  };

  const getStockStatusColor = (status) => {
    const colors = {
      'In Stock': 'bg-green-100 text-green-700',
      'Low Stock': 'bg-yellow-100 text-yellow-700',
      'Out of Stock': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // ✅ NEW: Calculate remaining new hours
  const getNewRemainingTime = (product) => {
    if (!product.isNew || !product.newMarkedAt) return null;
    const now = new Date();
    const markedDate = new Date(product.newMarkedAt);
    const hoursSinceMarked = (now - markedDate) / (1000 * 60 * 60);
    const remainingHours = Math.max(0, 48 - hoursSinceMarked);
    
    if (remainingHours <= 0) return null;
    if (remainingHours < 24) {
      return `${Math.floor(remainingHours)}h left`;
    }
    return `${Math.floor(remainingHours / 24)}d left`;
  };

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'name', label: 'Name: A to Z' },
    { value: '-name', label: 'Name: Z to A' },
    { value: '-views', label: 'Most Viewed' },
    { value: '-stock', label: 'Stock: High to Low' }
  ];

  const stockStatusOptions = [
    { value: '', label: 'All Status' },
    { value: 'In Stock', label: 'In Stock' },
    { value: 'Low Stock', label: 'Low Stock' },
    { value: 'Out of Stock', label: 'Out of Stock' }
  ];

  const conditionOptions = [
    { value: '', label: 'All Conditions' },
    { value: 'Uncirculated', label: 'Uncirculated' },
    { value: 'Extremely Fine', label: 'Extremely Fine' },
    { value: 'Very Fine', label: 'Very Fine' },
    { value: 'Fine', label: 'Fine' },
    { value: 'Very Good', label: 'Very Good' },
    { value: 'Good', label: 'Good' }
  ];

  const rarityOptions = [
    { value: '', label: 'All Rarities' },
    { value: 'Common', label: 'Common' },
    { value: 'Uncommon', label: 'Uncommon' },
    { value: 'Rare', label: 'Rare' },
    { value: 'Very Rare', label: 'Very Rare' },
    { value: 'Extremely Rare', label: 'Extremely Rare' }
  ];

  const hasActiveFilters = () => {
    return filters.category || filters.subCategory || filters.country || filters.material ||
           filters.stockStatus || filters.isFeatured || filters.minPrice || filters.maxPrice || 
           filters.condition || filters.rarity || filters.sortBy !== '-createdAt' || search;
  };

  // Filter sub-categories based on selected category
  const filteredSubCategories = filters.category
    ? subCategories.filter(sc => sc.category === filters.category)
    : subCategories;

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Products 
            <span className="ml-3 text-lg font-normal text-gray-500">({totalProducts})</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <Link
          to="/products/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg font-medium"
        >
          <FiPlus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, category, description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-lg border transition-all duration-200 font-medium flex items-center gap-2
              ${showFilters ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            <FiFilter className="w-5 h-5" />
            Filters
            {hasActiveFilters() && (
              <span className="ml-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-3 transition-all duration-200 ${viewMode === 'table' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <FiList className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-all duration-200 border-l border-gray-300 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => {
                    handleFilterChange('category', e.target.value);
                    handleFilterChange('subCategory', ''); // Reset sub-category when category changes
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Sub-Category Filter */}
              {filteredSubCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FiLayers className="w-4 h-4" />
                    Sub-Category
                  </label>
                  <select
                    value={filters.subCategory}
                    onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  >
                    <option value="">All Sub-Categories</option>
                    {filteredSubCategories.map(sub => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FiMapPin className="w-4 h-4" />
                  Country
                </label>
                <select
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                >
                  <option value="">All Countries</option>
                  {availableCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Material Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FiBox className="w-4 h-4" />
                  Material
                </label>
                <select
                  value={filters.material}
                  onChange={(e) => handleFilterChange('material', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                >
                  <option value="">All Materials</option>
                  {availableMaterials.map(material => (
                    <option key={material} value={material}>{material}</option>
                  ))}
                </select>
              </div>

              {/* Stock Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Status
                </label>
                <select
                  value={filters.stockStatus}
                  onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                >
                  {stockStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Status
                </label>
                <select
                  value={filters.isFeatured}
                  onChange={(e) => handleFilterChange('isFeatured', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                >
                  <option value="">All Products</option>
                  <option value="true">Featured Only</option>
                  <option value="false">Non-Featured Only</option>
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                >
                  {conditionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rarity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rarity
                </label>
                <select
                  value={filters.rarity}
                  onChange={(e) => handleFilterChange('rarity', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                >
                  {rarityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range - Min */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
              </div>

              {/* Price Range - Max */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters() && (
              <div className="flex flex-wrap gap-2 pt-2">
                {search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Search: {search}
                    <button onClick={handleClearSearch} className="ml-1 hover:text-blue-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Category: {categories.find(c => c._id === filters.category)?.name || filters.category}
                    <button onClick={() => handleFilterChange('category', '')} className="ml-1 hover:text-purple-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.subCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    Sub-Category: {subCategories.find(s => s._id === filters.subCategory)?.name || filters.subCategory}
                    <button onClick={() => handleFilterChange('subCategory', '')} className="ml-1 hover:text-indigo-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.country && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Country: {filters.country}
                    <button onClick={() => handleFilterChange('country', '')} className="ml-1 hover:text-green-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.material && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    Material: {filters.material}
                    <button onClick={() => handleFilterChange('material', '')} className="ml-1 hover:text-yellow-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.stockStatus && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    Stock: {filters.stockStatus}
                    <button onClick={() => handleFilterChange('stockStatus', '')} className="ml-1 hover:text-orange-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                    {filters.isFeatured === 'true' ? 'Featured' : 'Non-Featured'}
                    <button onClick={() => handleFilterChange('isFeatured', '')} className="ml-1 hover:text-pink-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.condition && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                    Condition: {filters.condition}
                    <button onClick={() => handleFilterChange('condition', '')} className="ml-1 hover:text-teal-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.rarity && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm">
                    Rarity: {filters.rarity}
                    <button onClick={() => handleFilterChange('rarity', '')} className="ml-1 hover:text-cyan-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    Price: ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                    <button onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }} className="ml-1 hover:text-gray-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.sortBy !== '-createdAt' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    Sort: {sortOptions.find(o => o.value === filters.sortBy)?.label}
                    <button onClick={() => handleFilterChange('sortBy', '-createdAt')} className="ml-1 hover:text-gray-900">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Display */}
      {viewMode === 'table' ? (
        // Table View
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category/Sub</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">New</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                          <FiPackage className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No products found</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {hasActiveFilters() ? 'Try clearing your filters' : 'Add your first product to get started'}
                        </p>
                        {hasActiveFilters() && (
                          <button
                            onClick={handleClearFilters}
                            className="mt-4 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                          >
                            Clear All Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const remainingTime = getNewRemainingTime(product);
                    return (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={product.images?.[0]?.url || '/placeholder.png'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</p>
                          <p className="text-xs text-gray-500 mt-1">ID: {product._id.slice(-8)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{product.category?.name || 'N/A'}</p>
                          {product.subCategories && product.subCategories.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {product.subCategories.map(s => s.name).join(', ')}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{product.country || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <span className="text-xs text-gray-500 line-through ml-2">{formatCurrency(product.comparePrice)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-gray-700'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product.stockStatus)}`}>
                            {product.stockStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.isNew ? (
                            <div className="flex flex-col items-start gap-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <IoSparklesSharp className="w-3 h-3" />
                                New
                              </span>
                              {remainingTime && (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                  <FiClock className="w-3 h-3" />
                                  {remainingTime}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            product.isFeatured ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {product.isFeatured ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* ✅ NEW: Mark as New Button */}
                            {!product.isNew ? (
                              <button
                                onClick={() => handleMarkAsNew(product._id)}
                                className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all duration-200 cursor-pointer group relative"
                                title="Mark as New (48-hour promotion)"
                              >
                                <IoSparklesSharp className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRemoveNewStatus(product._id)}
                                className="p-2 text-orange-600 hover:text-white hover:bg-orange-600 rounded-lg transition-all duration-200 cursor-pointer"
                                title="Remove New status"
                              >
                                <FiAward className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => navigate(`/products/edit/${product._id}`)}
                              className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
                              title="Edit product"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ open: true, id: product._id })}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                              title="Delete product"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-16 text-center border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <FiPackage className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">No products found</p>
                <p className="text-xs text-gray-400 mt-1">
                  {hasActiveFilters() ? 'Try clearing your filters' : 'Add your first product to get started'}
                </p>
              </div>
            </div>
          ) : (
            products.map((product) => {
              const remainingTime = getNewRemainingTime(product);
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={product.images?.[0]?.url || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {product.stockStatus === 'Out of Stock' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {/* ✅ NEW: New Badge with Timer */}
                    {product.isNew && (
                      <div className="absolute top-2 left-2">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded flex items-center gap-1">
                            <IoSparklesSharp className="w-3 h-3" />
                            NEW
                          </span>
                          {remainingTime && (
                            <span className="px-2 py-0.5 bg-black/70 text-white text-[10px] rounded flex items-center gap-1">
                              <FiClock className="w-2 h-2" />
                              {remainingTime}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {product.isFeatured && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black text-white text-xs font-bold rounded">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {product.category?.name || 'Uncategorized'}
                    </p>
                    {product.country && (
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <FiMapPin className="w-3 h-3" /> {product.country}
                      </p>
                    )}
                    {product.material && (
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <FiBox className="w-3 h-3" /> {product.material}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-black">
                        {formatCurrency(product.price)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product.stockStatus)}`}>
                        {product.stockStatus}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {/* ✅ NEW: Mark as New Button in Grid View */}
                      {!product.isNew ? (
                        <button
                          onClick={() => handleMarkAsNew(product._id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all duration-200 text-sm"
                          title="Mark as New"
                        >
                          <IoSparklesSharp className="w-3 h-3" />
                          Mark New
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRemoveNewStatus(product._id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-all duration-200 text-sm"
                          title="Remove New"
                        >
                          <FiAward className="w-3 h-3" />
                          Remove New
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/products/edit/${product._id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, id: product._id })}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <Pagination 
          page={page} 
          pages={pages} 
          onPageChange={(newPage) => {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone and will remove all associated data including images."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
};

export default ProductsPage;