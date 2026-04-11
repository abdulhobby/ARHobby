// CouponForm.jsx
import { useState, useEffect } from 'react';
import { FiTag, FiPercent, FiDollarSign, FiCalendar, FiInfo } from 'react-icons/fi';

const CouponForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    code: '', description: '', type: 'percentage', value: '',
    minOrderAmount: '', maxDiscount: '', usageLimit: '',
    perUserLimit: 1, startDate: '', endDate: '', isActive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        description: initialData.description || '',
        type: initialData.type || 'percentage',
        value: initialData.value || '',
        minOrderAmount: initialData.minOrderAmount || '',
        maxDiscount: initialData.maxDiscount || '',
        usageLimit: initialData.usageLimit || '',
        perUserLimit: initialData.perUserLimit || 1,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (submitData.minOrderAmount === '') delete submitData.minOrderAmount;
    if (submitData.maxDiscount === '') delete submitData.maxDiscount;
    if (submitData.usageLimit === '') delete submitData.usageLimit;
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiTag className="w-5 h-5" />
          Basic Information
        </h3>

        <div className="space-y-4">
          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              style={{ textTransform: 'uppercase' }}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 uppercase"
              placeholder="SAVE20"
            />
            <p className="text-xs text-gray-500 mt-1">Code will be automatically converted to uppercase</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
              placeholder="e.g., Get 20% off on all products"
            />
          </div>
        </div>
      </div>

      {/* Discount Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Discount Settings</h3>

        <div className="space-y-4">
          {/* Discount Type & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
              >
                <option value="percentage">
                  <FiPercent /> Percentage (%)
                </option>
                <option value="fixed">
                  <FiDollarSign /> Fixed Amount (₹)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value <span className="text-red-500">*</span>{' '}
                {formData.type === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                placeholder={formData.type === 'percentage' ? '20' : '100'}
              />
            </div>
          </div>

          {/* Min Order & Max Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Amount (₹)
              </label>
              <input
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                placeholder="500"
              />
              <p className="text-xs text-gray-500 mt-1">Optional - Leave empty for no minimum</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Discount (₹)
              </label>
              <input
                type="number"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                placeholder="200"
              />
              <p className="text-xs text-gray-500 mt-1">For percentage discounts only</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Usage Limits</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Usage Limit
            </label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
              placeholder="100"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Per User Limit <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="perUserLimit"
              value={formData.perUserLimit}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
              placeholder="1"
            />
            <p className="text-xs text-gray-500 mt-1">How many times each user can use this</p>
          </div>
        </div>
      </div>

      {/* Validity Period */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiCalendar className="w-5 h-5" />
          Validity Period
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
          <div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors duration-200">
              Active Coupon
            </span>
            <p className="text-xs text-gray-500">Users can use this coupon when active</p>
          </div>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[200px]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Saving...
            </span>
          ) : (
            initialData ? 'Update Coupon' : 'Create Coupon'
          )}
        </button>
      </div>
    </form>
  );
};

export default CouponForm;