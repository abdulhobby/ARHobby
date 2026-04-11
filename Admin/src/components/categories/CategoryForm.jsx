// CategoryForm.jsx
import { useState, useEffect } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

const CategoryForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '', description: '', order: 0, isActive: true
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        order: initialData.order || 0,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
      if (initialData.image?.url) setExistingImage(initialData.image);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setExistingImage(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('order', formData.order);
    submitData.append('isActive', formData.isActive);
    if (image) submitData.append('image', image);
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
              placeholder="Enter category name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 resize-none"
              placeholder="Enter category description"
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Settings</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center h-full pt-8">
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
                Active Category
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Category Image */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Category Image</h3>

        <div className="space-y-4">
          {/* Existing Image */}
          {existingImage && !preview && (
            <div className="relative inline-block">
              <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={existingImage.url}
                  alt="Category"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -top-2 -right-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Current
              </span>
            </div>
          )}

          {/* Preview New Image */}
          {preview && (
            <div className="relative inline-block">
              <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-black">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 cursor-pointer shadow-lg"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Button */}
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer border border-gray-300">
            <FiUpload className="w-5 h-5" />
            <span className="font-medium">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
          <p className="text-xs text-gray-500">Recommended: Square image, at least 500x500px</p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Saving...
            </span>
          ) : (
            initialData ? 'Update Category' : 'Create Category'
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;