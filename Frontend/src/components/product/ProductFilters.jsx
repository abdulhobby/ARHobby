// frontend/src/components/product/ProductFilters.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../features/category/categorySlice';
import { fetchSubCategories } from '../../features/subCategory/subCategorySlice';
import {
  SORT_OPTIONS,
  STOCK_OPTIONS,
  PRODUCT_CONDITIONS,
} from '../../utils/constants';
import { FiFilter, FiX, FiSearch, FiChevronDown } from 'react-icons/fi';
import API from '../../services/api'; // Import your API instance

const ProductFilters = ({
  filters,
  onFilterChange,
  showCategoryFilter = true,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { categories } = useSelector((state) => state.category);
  const { subCategories } = useSelector((state) => state.subCategory);
  const [countries, setCountries] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    if (subCategories.length === 0) {
      dispatch(fetchSubCategories());
    }
    fetchFilterOptions();
  }, [dispatch, categories.length, subCategories.length]);

  const fetchFilterOptions = async () => {
    setLoadingOptions(true);
    try {
      // Use the API instance instead of raw fetch
      const response = await API.get('/products/filter-options');
      console.log('Filter options response:', response.data);
      
      if (response.data.success) {
        setCountries(response.data.countries || []);
        setMaterials(response.data.materials || []);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
      // Fallback to empty arrays
      setCountries([]);
      setMaterials([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value, page: 1 };
    onFilterChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      keyword: '',
      category: '',
      subCategory: '',
      country: '',
      material: '',
      stockStatus: '',
      condition: '',
      sort: 'new-to-old',
      minPrice: '',
      maxPrice: '',
      page: 1,
    };
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return filters.category || filters.subCategory || filters.country || 
           filters.material || filters.stockStatus || filters.condition || 
           filters.minPrice || filters.maxPrice || filters.keyword;
  };

  const activeFilterCount = [
    filters.category,
    filters.subCategory,
    filters.country,
    filters.material,
    filters.stockStatus,
    filters.condition,
    filters.minPrice || filters.maxPrice,
    filters.keyword,
  ].filter(Boolean).length;

  const selectClasses = `w-full px-4 py-2.5 rounded-xl border-2 border-border-light bg-bg-primary 
                         text-text-primary text-sm appearance-none cursor-pointer
                         focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-200 
                         transition-all duration-300`;

  const labelClasses = 'text-sm font-semibold text-text-primary mb-2 block tracking-wide';

  return (
    <div>
      {/* Mobile Filter Bar */}
      <div className="lg:hidden flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-primary border-2 border-border-light 
                   rounded-xl text-sm font-semibold text-text-secondary cursor-pointer
                   hover:border-primary hover:text-primary transition-all duration-300 
                   shadow-sm hover:shadow-md relative"
        >
          <FiFilter className="text-base" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-text-white 
                         text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="relative flex-1 max-w-[200px]">
          <select
            value={filters.sort || 'new-to-old'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className={selectClasses}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-secondary/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-bg-primary shadow-2xl 
                       overflow-y-auto animate-[slideInRight_0.3s_ease-out]">
            <div className="sticky top-0 z-10 bg-bg-primary border-b border-border-light 
                         px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <FiFilter className="text-primary" />
                Filters
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-10 h-10 rounded-full hover:bg-bg-secondary flex items-center 
                         justify-center cursor-pointer transition-colors duration-200"
              >
                <FiX className="text-xl text-text-secondary" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <FilterContent 
                filters={filters}
                handleChange={handleChange}
                categories={categories}
                subCategories={subCategories}
                countries={countries}
                materials={materials}
                loadingOptions={loadingOptions}
                showCategoryFilter={showCategoryFilter}
                labelClasses={labelClasses}
                selectClasses={selectClasses}
              />

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-text-white 
                         font-bold rounded-xl cursor-pointer transition-all duration-300 
                         shadow-lg hover:shadow-xl text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar Filters */}
      <div className="hidden lg:block">
        <div className="bg-bg-primary rounded-2xl border-2 border-border-light shadow-sm 
                     p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-light">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                <FiFilter className="text-primary text-sm" />
              </div>
              Filters
            </h3>
            {hasActiveFilters() && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-error 
                         hover:text-red-700 cursor-pointer transition-colors duration-200 
                         px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                <FiX className="text-sm" />
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-6">
            <FilterContent 
              filters={filters}
              handleChange={handleChange}
              categories={categories}
              subCategories={subCategories}
              countries={countries}
              materials={materials}
              loadingOptions={loadingOptions}
              showCategoryFilter={showCategoryFilter}
              labelClasses={labelClasses}
              selectClasses={selectClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterContent = ({ 
  filters, handleChange, categories, subCategories, 
  countries, materials, loadingOptions, showCategoryFilter, 
  labelClasses, selectClasses 
}) => {
  // Filter sub-categories based on selected category
  const filteredSubCategories = filters.category
    ? subCategories.filter(sc => sc.category === filters.category)
    : subCategories;

  return (
    <>
      {/* Search */}
      <div>
        <h4 className={labelClasses}>Search</h4>
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light text-sm" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.keyword || ''}
            onChange={(e) => handleChange('keyword', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-border-light bg-bg-secondary 
                     text-text-primary text-sm placeholder:text-text-light
                     focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-200 
                     focus:bg-bg-primary transition-all duration-300"
          />
        </div>
      </div>

      {/* Category */}
      {showCategoryFilter && (
        <div>
          <h4 className={labelClasses}>Category</h4>
          <div className="relative">
            <select
              value={filters.category || ''}
              onChange={(e) => {
                handleChange('category', e.target.value);
                handleChange('subCategory', '');
              }}
              className={selectClasses}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
          </div>
        </div>
      )}

      {/* Sub-Category */}
      {filteredSubCategories.length > 0 && (
        <div>
          <h4 className={labelClasses}>Filter by Banknotes, Coins....</h4>
          <div className="relative">
            <select
              value={filters.subCategory || ''}
              onChange={(e) => handleChange('subCategory', e.target.value)}
              className={selectClasses}
            >
              <option value="">All</option>
              {filteredSubCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
          </div>
        </div>
      )}

      {/* Country Filter */}
      <div>
        <h4 className={labelClasses}>Country</h4>
        <div className="relative">
          <select
            value={filters.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
            className={selectClasses}
            disabled={loadingOptions}
          >
            <option value="">All Countries</option>
            {!loadingOptions && countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
        </div>
        {loadingOptions && (
          <p className="text-xs text-text-light mt-1">Loading countries...</p>
        )}
      </div>

      {/* Material Filter */}
      <div>
        <h4 className={labelClasses}>Material</h4>
        <div className="relative">
          <select
            value={filters.material || ''}
            onChange={(e) => handleChange('material', e.target.value)}
            className={selectClasses}
            disabled={loadingOptions}
          >
            <option value="">All Materials</option>
            {!loadingOptions && materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
        </div>
        {loadingOptions && (
          <p className="text-xs text-text-light mt-1">Loading materials...</p>
        )}
      </div>

      {/* Availability */}
      <div>
        <h4 className={labelClasses}>Availability</h4>
        <div className="space-y-2">
          {STOCK_OPTIONS.filter(opt => opt.value !== '').map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer 
                        transition-all duration-200 border-2
                        ${
                          filters.stockStatus === opt.value
                            ? 'border-primary bg-primary-50 text-primary'
                            : 'border-transparent hover:bg-bg-secondary text-text-secondary'
                        }`}
            >
              <input
                type="radio"
                name="stockStatus"
                value={opt.value}
                checked={filters.stockStatus === opt.value}
                onChange={(e) => handleChange('stockStatus', e.target.value)}
                className="w-4 h-4 text-primary border-border focus:ring-primary cursor-pointer
                         accent-primary"
              />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h4 className={labelClasses}>Condition</h4>
        <div className="relative">
          <select
            value={filters.condition || ''}
            onChange={(e) => handleChange('condition', e.target.value)}
            className={selectClasses}
          >
            <option value="">All Conditions</option>
            {PRODUCT_CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className={labelClasses}>Price Range</h4>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-xs font-medium">
              ₹
            </span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-full pl-7 pr-2 py-2.5 rounded-xl border-2 border-border-light bg-bg-secondary 
                       text-text-primary text-sm placeholder:text-text-light
                       focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-200 
                       transition-all duration-300"
            />
          </div>
          <span className="text-text-light text-xs font-semibold flex-shrink-0 px-1">to</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-xs font-medium">
              ₹
            </span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-full pl-7 pr-2 py-2.5 rounded-xl border-2 border-border-light bg-bg-secondary 
                       text-text-primary text-sm placeholder:text-text-light
                       focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-200 
                       transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Sort (Desktop) */}
      <div className="hidden lg:block">
        <h4 className={labelClasses}>Sort By</h4>
        <div className="relative">
          <select
            value={filters.sort || 'new-to-old'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className={selectClasses}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
        </div>
      </div>
    </>
  );
};

export default ProductFilters;