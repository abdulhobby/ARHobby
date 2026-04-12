// frontend/src/pages/admin/SubCategoryList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  fetchSubCategories, 
  deleteSubCategory, 
  setFilters,
  clearFilters 
} from '../features/subCategory/adminSubCategorySlice';
import { fetchCategories } from '../features/categories/adminCategorySlice';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiX, 
  FiGrid,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const SubCategoryList = () => {
  const dispatch = useDispatch();
  const { subCategories, totalCount, loading, filters } = useSelector((state) => state.adminSubCategory);
  const { categories } = useSelector((state) => state.adminCategory);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      ...filters,
      page: currentPage,
      limit: itemsPerPage
    };
    if (searchTerm) params.search = searchTerm;
    dispatch(fetchSubCategories(params));
  }, [dispatch, filters, currentPage, searchTerm]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteSubCategory(id)).unwrap();
      toast.success('Sub-category deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error || 'Failed to delete sub-category');
    }
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category?.name || 'Unknown';
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sub-Categories</h1>
          <p className="text-gray-600 mt-1">Manage product sub-categories for better organization</p>
        </div>
        <Link
          to="/subcategories/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Add Sub-Category
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sub-categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Clear Filters */}
          {(filters.category || filters.isActive || searchTerm) && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black border border-gray-300 rounded-lg hover:border-black transition-all duration-200"
            >
              <FiRefreshCw className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Sub-Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : subCategories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiGrid className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sub-Categories Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filters.category || filters.isActive 
              ? "No sub-categories match your filters. Try adjusting your search criteria."
              : "Get started by creating your first sub-category."}
          </p>
          {(searchTerm || filters.category || filters.isActive) ? (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <FiRefreshCw className="w-4 h-4" />
              Clear Filters
            </button>
          ) : (
            <Link
              to="/admin/subcategories/new"
              className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              <FiPlus className="w-5 h-5" />
              Create Sub-Category
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subCategories.map((subCategory) => (
              <div
                key={subCategory._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {subCategory.image?.url ? (
                    <img
                      src={subCategory.image.url}
                      alt={subCategory.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiGrid className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      to={`/admin/subcategories/edit/${subCategory._id}`}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200"
                    >
                      <FiEdit2 className="w-4 h-4 text-gray-700" />
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(subCategory._id)}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-all duration-200"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      subCategory.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {subCategory.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {subCategory.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Category: {getCategoryName(subCategory.category)}
                  </p>
                  {subCategory.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {subCategory.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCheckCircle className="w-4 h-4" />
                      <span>{subCategory.productCount || 0} products</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(subCategory.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} sub-categories
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-black text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FiTrash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Sub-Category?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this sub-category? This action cannot be undone.
              Products using this sub-category will be updated.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoryList;