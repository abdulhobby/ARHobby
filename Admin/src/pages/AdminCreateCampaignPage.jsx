// pages/admin/AdminCreateCampaignPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiImage,
  FiPlus,
  FiTrash2,
  FiSend,
  FiClock,
  FiUsers,
  FiX,
  FiLoader,
  FiFileText,
  FiTag,
  FiChevronRight,
  FiAward,
  FiCheck,
  FiSearch
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { campaignAPI, productAPI } from '../services/adminApi';

const AdminCreateCampaignPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    type: 'promotional',
    products: [],
    sendImmediately: true,
    scheduleDate: '',
    targetSegment: 'all',
    customEmails: []
  });
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentTab, setCurrentTab] = useState('details');
  const [searchProduct, setSearchProduct] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productAPI.getAll({ limit: 1000 });
      setAvailableProducts(data.products || []);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (product) => {
    if (!formData.products.find(p => p.product === product._id)) {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, { product: product._id, featured: false }]
      }));
      toast.success(`${product.name} added to campaign`);
    }
  };

  const handleRemoveProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.product !== productId)
    }));
  };

  const handleToggleFeatured = (productId) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.product === productId ? { ...p, featured: !p.featured } : p
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.subject) {
      toast.error('Title, description, and subject are required');
      return;
    }

    if (!formData.sendImmediately && !formData.scheduleDate) {
      toast.error('Schedule date is required for scheduled campaigns');
      return;
    }

    try {
      setSaving(true);
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('subject', formData.subject);
      form.append('type', formData.type);
      form.append('products', JSON.stringify(formData.products));
      form.append('sendImmediately', formData.sendImmediately);
      form.append('scheduleDate', formData.scheduleDate);
      form.append('targetSegment', formData.targetSegment);
      form.append('customEmails', JSON.stringify(formData.customEmails));
      if (bannerImage) form.append('bannerImage', bannerImage);

      await campaignAPI.create(form);
      toast.success('Campaign created successfully');
      navigate('/admin/campaigns');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create campaign');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = (availableProducts || []).filter(p =>
    (p?.name || '').toLowerCase().includes(searchProduct.toLowerCase())
  );

  const selectedProductObjects = formData.products.map(p => ({
    ...availableProducts.find(ap => ap._id === p.product),
    featured: p.featured
  }));

  const tabs = [
    { id: 'details', label: 'Campaign Details', icon: FiFileText },
    { id: 'products', label: 'Featured Products', icon: FiTag },
    { id: 'sending', label: 'Send Settings', icon: FiSend }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/admin/campaigns')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4 font-semibold transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Campaigns
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">Set up a new email campaign to reach your subscribers</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              const isCompleted = (
                (tab.id === 'details' && formData.title && formData.description && formData.subject) ||
                (tab.id === 'products') ||
                (tab.id === 'sending')
              );

              return (
                <div key={tab.id} className="flex items-center flex-1">
                  <div className="flex items-center cursor-pointer" onClick={() => setCurrentTab(tab.id)}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        isActive
                          ? 'bg-gray-900 text-white ring-4 ring-gray-900/20'
                          : isCompleted
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isCompleted && !isActive ? '✓' : index + 1}
                    </div>
                    <span className={`ml-3 font-semibold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                      {tab.label}
                    </span>
                  </div>
                  {index < tabs.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 ${isCompleted ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Details Tab */}
          {currentTab === 'details' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FiFileText className="w-6 h-6 text-gray-700" />
                  Campaign Details
                </h2>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Campaign Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g., Summer Sale 2024, New Product Launch"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all"
                  required
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">Give your campaign a clear, descriptive title</p>
                  <span className="text-xs text-gray-500">{formData.title.length}/100</span>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Email Subject <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  maxLength={200}
                  placeholder="e.g., 🎉 Don't Miss Our Summer Sale - Up to 50% Off!"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all"
                  required
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">This appears in subscriber's inbox. Make it catchy!</p>
                  <span className="text-xs text-gray-500">{formData.subject.length}/200</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Campaign Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={2000}
                  placeholder="Write an engaging description. This will be displayed in the email content."
                  rows={5}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all resize-none"
                  required
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">Describe the campaign's main message and offer</p>
                  <span className="text-xs text-gray-500">{formData.description.length}/2000</span>
                </div>
              </div>

              {/* Type & Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Campaign Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all"
                  >
                    <option value="promotional">🏷️ Promotional</option>
                    <option value="announcement">📢 Announcement</option>
                    <option value="newsletter">📰 Newsletter</option>
                    <option value="product-showcase">⭐ Product Showcase</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Banner Image (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition-all">
                    {bannerPreview ? (
                      <div className="relative inline-block">
                        <img src={bannerPreview} alt="Preview" className="max-h-32 rounded" />
                        <button
                          type="button"
                          onClick={() => {
                            setBannerImage(null);
                            setBannerPreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FiImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="banner-upload"
                        />
                        <label htmlFor="banner-upload" className="cursor-pointer">
                          <p className="text-sm text-gray-700 font-semibold">Click to upload</p>
                          <p className="text-xs text-gray-500">Max 5MB</p>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin/campaigns')}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.title && formData.description && formData.subject) {
                      setCurrentTab('products');
                    } else {
                      toast.error('Please fill in all required fields');
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  Next: Add Products
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {currentTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Search and Add Products */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FiTag className="w-6 h-6 text-gray-700" />
                  Featured Products
                </h2>

                <div className="mb-6">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products to add..."
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                      onClick={() => setShowProductModal(true)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Click to open product selector</p>
                </div>

                {formData.products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedProductObjects.map((product, index) => (
                      <div key={product._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          {product?.images?.[0]?.url && (
                            <img
                              src={product.images[0].url}
                              alt={product?.name}
                              className="w-full h-40 object-cover"
                            />
                          )}
                          {product.featured && (
                            <div className="absolute top-2 right-2 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <FiAward className="w-3 h-3" />
                              Featured
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product?.name}</h4>
                          <p className="text-gray-900 font-bold mb-4">Rs. {product?.price}</p>
                          <div className="flex gap-2">
                            <label className="flex items-center gap-2 flex-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={product.featured}
                                onChange={() => handleToggleFeatured(product._id)}
                                className="w-4 h-4 rounded text-gray-900 cursor-pointer"
                              />
                              <span className="text-sm text-gray-600">Featured</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(product._id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FiTag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No products added yet</p>
                    <button
                      type="button"
                      onClick={() => setShowProductModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                      <FiPlus className="w-5 h-5" />
                      Add Products
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentTab('details')}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('sending')}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  Next: Send Settings
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Sending Tab */}
          {currentTab === 'sending' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FiSend className="w-6 h-6 text-gray-700" />
                Send Settings
              </h2>

              <div className="space-y-4">
                {/* Send Immediately */}
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="sendOption"
                    value="immediate"
                    checked={formData.sendImmediately}
                    onChange={() => setFormData(prev => ({ ...prev, sendImmediately: true }))}
                    className="w-5 h-5 text-gray-900 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <p className="font-semibold text-gray-900">Send Immediately</p>
                      <p className="text-sm text-gray-600">Email will be sent right away to all subscribers</p>
                    </label>
                  </div>
                </div>

                {/* Schedule for Later */}
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="sendOption"
                    value="scheduled"
                    checked={!formData.sendImmediately}
                    onChange={() => setFormData(prev => ({ ...prev, sendImmediately: false }))}
                    className="w-5 h-5 text-gray-900 cursor-pointer mt-1"
                  />
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <p className="font-semibold text-gray-900 mb-3">Schedule for Later</p>
                      <input
                        type="datetime-local"
                        value={formData.scheduleDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                        disabled={formData.sendImmediately}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <p className="text-sm text-gray-500 mt-2">Campaign will be sent at the scheduled time</p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Target Segment */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  Target Segment
                </label>
                <select
                  name="targetSegment"
                  value={formData.targetSegment}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all"
                >
                  <option value="all">All Subscribers</option>
                  <option value="active">Active Subscribers Only</option>
                  <option value="inactive">Inactive Subscribers (Re-engagement)</option>
                  <option value="custom">Custom List</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">Choose who should receive this campaign</p>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Title</p>
                    <p className="font-semibold text-gray-900">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{formData.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Products</p>
                    <p className="font-semibold text-gray-900">{formData.products.length} product(s)</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Send</p>
                    <p className="font-semibold text-gray-900">
                      {formData.sendImmediately
                        ? 'Immediately'
                        : formData.scheduleDate ? new Date(formData.scheduleDate).toLocaleString() : 'Not scheduled'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setCurrentTab('products')}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/campaigns')}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || (!formData.sendImmediately && !formData.scheduleDate)}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      Create Campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Product Selection Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Select Products</h2>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setSearchProduct('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Search */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                  autoFocus
                />
              </div>
            </div>

            {/* Products List */}
            <div className="overflow-y-auto flex-1">
              {filteredProducts.length > 0 ? (
                <div className="p-6 space-y-3">
                  {filteredProducts.map(product => {
                    const isSelected = formData.products.find(p => p.product === product._id);
                    return (
                      <button
                        key={product._id}
                        onClick={() => {
                          if (isSelected) {
                            handleRemoveProduct(product._id);
                          } else {
                            handleAddProduct(product);
                          }
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {product.images?.[0]?.url && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                          <p className="text-gray-900 font-bold mt-1">Rs. {product.price}</p>
                        </div>
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-gray-900 bg-gray-900'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <FiCheck className="w-4 h-4 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-600">No products found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {formData.products.length} product(s) selected
              </p>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setSearchProduct('');
                }}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreateCampaignPage;