// frontend/src/pages/SubCategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createSubCategory, 
  updateSubCategory, 
  fetchSubCategoryById,
  clearSubCategory 
} from '../features/subCategory/adminSubCategorySlice';
import { fetchCategories } from '../features/categories/adminCategorySlice';
import { FiUpload, FiX, FiImage, FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SubCategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSubCategory, loading } = useSelector((state) => state.adminSubCategory);
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCategories());
    if (isEditMode) {
      dispatch(fetchSubCategoryById(id));
    }
    return () => {
      if (isEditMode) {
        dispatch(clearSubCategory());
      }
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (currentSubCategory && isEditMode) {
      setFormData({
        name: currentSubCategory.name || '',
        description: currentSubCategory.description || '',
        isActive: currentSubCategory.isActive !== undefined ? currentSubCategory.isActive : true
      });
      if (currentSubCategory.image?.url) {
        setImagePreview(currentSubCategory.image.url);
      }
    }
  }, [currentSubCategory, isEditMode]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Sub-category name is required';
    if (formData.name.length > 100) newErrors.name = 'Name cannot exceed 100 characters';
    if (formData.description.length > 500) newErrors.description = 'Description cannot exceed 500 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('isActive', formData.isActive);
    if (image) {
      submitData.append('image', image);
    }

    try {
      if (isEditMode) {
        await dispatch(updateSubCategory({ id, formData: submitData })).unwrap();
        toast.success('Sub-category updated successfully');
      } else {
        await dispatch(createSubCategory(submitData)).unwrap();
        toast.success('Sub-category created successfully');
      }
      navigate('/subcategories');
    } catch (error) {
      toast.error(error || `Failed to ${isEditMode ? 'update' : 'create'} sub-category`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/subcategories')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Sub-Category' : 'Create New Sub-Category'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode 
              ? 'Update sub-category details and settings'
              : 'Add a new sub-category to organize products better'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Banknotes, Coins, Stamps"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {100 - formData.name.length} characters remaining
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of this sub-category"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {500 - formData.description.length} characters remaining
              </p>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-black transition-colors duration-200"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors duration-200">
                  Active
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Inactive sub-categories won't appear in filters
              </p>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sub-Category Image</h2>
          
          {imagePreview ? (
            <div className="relative inline-block">
              <div className="w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black transition-all duration-200 group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 text-gray-400 group-hover:text-black transition-colors duration-200" />
                <p className="text-sm text-gray-500 mt-2">Upload Image</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
          <p className="text-xs text-gray-500 mt-3">
            Recommended size: 400x400px. This image will be displayed for the sub-category.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/subcategories')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                {isEditMode ? 'Update Sub-Category' : 'Create Sub-Category'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubCategoryForm;