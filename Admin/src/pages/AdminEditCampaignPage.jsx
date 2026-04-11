// pages/admin/AdminEditCampaignPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiImage,
  FiPlus,
  FiTrash2,
  FiSave,
  FiClock,
  FiUsers,
  FiLoader,
  FiX,
  FiSearch,
  FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { campaignAPI, productAPI } from '../services/adminApi';

const AdminEditCampaignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    type: 'promotional',
    products: [],
    sendImmediately: true,
    scheduleDate: '',
    targetSegment: 'all'
  });
  const [campaign, setCampaign] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchProduct, setSearchProduct] = useState('');

  useEffect(() => {
    fetchCampaignAndProducts();
  }, [id]);

  const fetchCampaignAndProducts = async () => {
    try {
      setLoading(true);
      const [campaignRes, productsRes] = await Promise.all([
        campaignAPI.getById(id),
        productAPI.getAll({ limit: 1000 })
      ]);

      const campaignData = campaignRes.data.campaign;
      setCampaign(campaignData);
      setFormData({
        title: campaignData.title,
        description: campaignData.description,
        subject: campaignData.subject,
        type: campaignData.type,
        products: campaignData.products || [],
        sendImmediately: campaignData.sendImmediately,
        scheduleDate: campaignData.scheduleDate
          ? new Date(campaignData.scheduleDate).toISOString().slice(0, 16)
          : '',
        targetSegment: campaignData.targetSegment
      });

      if (campaignData.bannerImage?.url) {
        setBannerPreview(campaignData.bannerImage.url);
      }

      setAvailableProducts(productsRes.data.products || []);
    } catch (error) {
      toast.error('Failed to fetch campaign data');
      navigate('/admin/campaigns');
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
    setShowProductModal(false);
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
      if (bannerImage) form.append('bannerImage', bannerImage);

      await campaignAPI.update(id, form);
      toast.success('Campaign updated successfully');
      navigate('/admin/campaigns');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = (availableProducts || []).filter(p =>
    (p?.name || '').toLowerCase().includes(searchProduct.toLowerCase()) &&
    !formData.products.find(fp => fp.product === p._id)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-gray-900 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiX className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Campaign not found</p>
        </div>
      </div>
    );
  }

  if (campaign.status !== 'draft') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiClock className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cannot Edit Campaign</h2>
          <p className="text-gray-600 mb-6">
            Only draft campaigns can be edited. This campaign is currently {campaign.status}.
          </p>
          <button
            onClick={() => navigate(`/admin/campaigns/${id}`)}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            View Campaign Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(`/admin/campaigns/${id}`)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4 font-semibold transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Campaign
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Campaign</h1>
          <p className="text-gray-600 mt-2">Update your campaign details and settings</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Details</h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g., Summer Sale 2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={2000}
                  placeholder="Write an engaging description for your campaign"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/2000</p>
              </div>

              {/* Email Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  maxLength={200}
                  placeholder="Make it compelling and short"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.subject.length}/200</p>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                >
                  <option value="promotional">Promotional</option>
                  <option value="announcement">Announcement</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="product-showcase">Product Showcase</option>
                </select>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {bannerPreview ? (
                    <div className="relative inline-block">
                      <img src={bannerPreview} alt="Banner" className="max-h-64 rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setBannerImage(null);
                          setBannerPreview(null);
                        }}
                        className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="banner-upload"
                      />
                      <label htmlFor="banner-upload" className="cursor-pointer">
                        <p className="text-gray-700 font-semibold hover:underline">Click to upload</p>
                        <p className="text-sm text-gray-500">or drag and drop</p>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <button
                type="button"
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                Add Product
              </button>
            </div>

            {formData.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.products.map((item) => {
                  const product = availableProducts.find(p => p._id === item.product);
                  if (!product) return null;
                  return (
                    <div key={item.product} className="border border-gray-200 rounded-lg overflow-hidden">
                      {product?.images?.[0]?.url && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{product?.name}</h4>
                        <p className="text-gray-900 font-bold mb-3">Rs. {product?.price}</p>
                        <div className="flex gap-2">
                          <label className="flex items-center gap-2 flex-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.featured}
                              onChange={() => handleToggleFeatured(item.product)}
                              className="w-4 h-4 rounded text-gray-900"
                            />
                            <span className="text-sm text-gray-600">Featured</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(item.product)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">No products added yet</p>
                <button
                  type="button"
                  onClick={() => setShowProductModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  <FiPlus className="w-5 h-5" />
                  Add Product
                </button>
              </div>
            )}
          </div>

          {/* Send Settings Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiClock className="w-6 h-6" />
              Send Settings
            </h2>

            <div className="space-y-4">
              {/* Send Immediately */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sendImmediately}
                    onChange={(e) => setFormData(prev => ({ ...prev, sendImmediately: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-gray-900 cursor-pointer"
                  />
                  <span className="text-gray-900 font-medium">Send Immediately</span>
                </label>
              </div>

              {/* Schedule Date */}
              {!formData.sendImmediately && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    Schedule Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduleDate"
                    value={formData.scheduleDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                    required={!formData.sendImmediately}
                  />
                </div>
              )}

              {/* Target Segment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  Target Segment
                </label>
                <select
                  name="targetSegment"
                  value={formData.targetSegment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                >
                  <option value="all">All Subscribers</option>
                  <option value="active">Active Subscribers</option>
                  <option value="inactive">Inactive Subscribers</option>
                  <option value="custom">Custom List</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/campaigns/${id}`)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Product Selection Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
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

            <div className="p-6 space-y-3">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <button
                    key={product._id}
                    onClick={() => handleAddProduct(product)}
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
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
                      <p className="text-sm text-gray-600">Rs. {product.price}</p>
                    </div>
                    <FiPlus className="w-5 h-5 text-gray-700" />
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No products available to add</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEditCampaignPage;