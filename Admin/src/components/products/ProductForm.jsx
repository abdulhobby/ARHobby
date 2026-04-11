// components/ProductForm.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../features/categories/adminCategorySlice';
import { PRODUCT_CONDITIONS, PRODUCT_RARITIES } from '../../utils/helpers';
import { FiUpload, FiX, FiImage, FiAlertCircle, FiSearch, FiFileText } from 'react-icons/fi';

const ProductForm = ({ initialData, onSubmit, loading }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.adminCategory);

  const [formData, setFormData] = useState({
    name: '', description: '', category: '', country: '', year: '',
    condition: 'Good', denomination: '', material: '', weight: '',
    dimensions: '', rarity: 'Common', additionalInfo: '', price: '',
    comparePrice: '', stock: '', isFeatured: false, isActive: true, isNew: false, tags: '',
    // SEO Fields
    seoMetaTitle: '', seoMetaDescription: '', seoMetaKeywords: '',
    seoOgTitle: '', seoOgDescription: '', seoCanonicalUrl: ''
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [seoPreview, setSeoPreview] = useState({ title: '', description: '', url: '' });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category?._id || initialData.category || '',
        country: initialData.country || '',
        year: initialData.year || '',
        condition: initialData.condition || 'Good',
        denomination: initialData.denomination || '',
        material: initialData.material || '',
        weight: initialData.weight || '',
        dimensions: initialData.dimensions || '',
        rarity: initialData.rarity || 'Common',
        additionalInfo: initialData.additionalInfo || '',
        price: initialData.price || '',
        comparePrice: initialData.comparePrice || '',
        stock: initialData.stock || '',
        isFeatured: initialData.isFeatured || false,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        isNew: initialData.isNew || false,
        tags: initialData.tags?.join(', ') || '',
        // SEO Fields
        seoMetaTitle: initialData.seo?.metaTitle || '',
        seoMetaDescription: initialData.seo?.metaDescription || '',
        seoMetaKeywords: initialData.seo?.metaKeywords?.join(', ') || '',
        seoOgTitle: initialData.seo?.ogTitle || '',
        seoOgDescription: initialData.seo?.ogDescription || '',
        seoCanonicalUrl: initialData.seo?.canonicalUrl || ''
      });
      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  // Update SEO preview when relevant fields change
  useEffect(() => {
    const metaTitle = formData.seoMetaTitle || formData.name;
    const metaDescription = formData.seoMetaDescription || formData.description?.substring(0, 160);
    const slug = initialData?.slug || formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    setSeoPreview({
      title: metaTitle,
      description: metaDescription,
      url: `${window.location.origin}/products/${slug}`
    });
  }, [formData.seoMetaTitle, formData.seoMetaDescription, formData.name, formData.description, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (publicId) => {
    setExistingImages(prev => prev.filter(img => img.public_id !== publicId));
    setRemoveImages(prev => [...prev, publicId]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();

    Object.keys(formData).forEach(key => {
      if (formData[key] !== '' && formData[key] !== undefined && formData[key] !== null) {
        if (typeof formData[key] === 'boolean') {
          submitData.append(key, formData[key].toString());
        } else {
          submitData.append(key, formData[key]);
        }
      }
    });

    images.forEach(image => {
      submitData.append('images', image);
    });

    if (removeImages.length > 0) {
      submitData.append('removeImages', JSON.stringify(removeImages));
    }

    onSubmit(submitData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <FiFileText className="w-4 h-4" /> },
    { id: 'details', label: 'Collectible Details', icon: <FiImage className="w-4 h-4" /> },
    { id: 'pricing', label: 'Pricing & Stock', icon: <FiImage className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO & Metadata', icon: <FiSearch className="w-4 h-4" /> },
    { id: 'images', label: 'Images', icon: <FiImage className="w-4 h-4" /> }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Basic Information Tab */}
      {activeTab === 'basic' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiFileText className="w-5 h-5" />
            Basic Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter product name"
              />
              <p className="text-xs text-gray-500 mt-1">
                {70 - (formData.seoMetaTitle || formData.name).length} characters remaining for meta title
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 resize-none"
                placeholder="Enter detailed product description"
              />
              <p className="text-xs text-gray-500 mt-1">
                {5000 - formData.description.length} characters remaining
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  placeholder="e.g., India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  placeholder="e.g., 1950"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-black transition-colors duration-200"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors duration-200">
                  Featured Product
                </span>
              </label>

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

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-black transition-colors duration-200"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors duration-200">
                  Mark as New Product
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Collectible Details Tab */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Collectible Details</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
                >
                  {PRODUCT_CONDITIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Denomination
                </label>
                <input
                  type="text"
                  name="denomination"
                  value={formData.denomination}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  placeholder="e.g., 1 Rupee"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  placeholder="e.g., Silver"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  placeholder="e.g., 10g"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  placeholder="e.g., 25mm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rarity
                </label>
                <select
                  name="rarity"
                  value={formData.rarity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
                >
                  {PRODUCT_RARITIES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 resize-none"
                placeholder="Any additional details about the product"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pricing & Stock Tab */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing & Stock</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare Price (₹)
                </label>
                <input
                  type="number"
                  name="comparePrice"
                  value={formData.comparePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">Original price for discount display</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                placeholder="rare, vintage, silver"
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas. Used for search and filtering.</p>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* Google Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiSearch className="w-5 h-5" />
              Google Search Preview
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                {seoPreview.title || 'Product Title'}
              </div>
              <div className="text-green-700 text-sm mt-1">
                {seoPreview.url}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                {seoPreview.description || 'Product description will appear here...'}
              </div>
            </div>
          </div>

          {/* SEO Fields */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Meta Tags & SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                  <span className="text-gray-400 ml-2">(Recommended: 50-60 characters)</span>
                </label>
                <input
                  type="text"
                  name="seoMetaTitle"
                  value={formData.seoMetaTitle}
                  onChange={handleChange}
                  maxLength="70"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Leave empty to auto-generate from product name"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    {70 - (formData.seoMetaTitle || formData.name).length} characters remaining
                  </p>
                  {!formData.seoMetaTitle && (
                    <p className="text-xs text-blue-600">Auto-generated from product name</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                  <span className="text-gray-400 ml-2">(Recommended: 150-160 characters)</span>
                </label>
                <textarea
                  name="seoMetaDescription"
                  value={formData.seoMetaDescription}
                  onChange={handleChange}
                  maxLength="160"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 resize-none"
                  placeholder="Leave empty to auto-generate from description"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    {160 - (formData.seoMetaDescription || formData.description?.substring(0, 160) || '').length} characters remaining
                  </p>
                  {!formData.seoMetaDescription && (
                    <p className="text-xs text-blue-600">Auto-generated from product description</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                  <span className="text-gray-400 ml-2">(Separate with commas)</span>
                </label>
                <input
                  type="text"
                  name="seoMetaKeywords"
                  value={formData.seoMetaKeywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  placeholder="coin, currency, collectible, rare, vintage"
                />
                <p className="text-xs text-gray-500 mt-1">Helps search engines understand your content better</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Open Graph (Social Media) Settings</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Title (Facebook/Twitter)
                    </label>
                    <input
                      type="text"
                      name="seoOgTitle"
                      value={formData.seoOgTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Leave empty to use product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Description
                    </label>
                    <textarea
                      name="seoOgDescription"
                      value={formData.seoOgDescription}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 resize-none"
                      placeholder="Leave empty to use meta description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      name="seoCanonicalUrl"
                      value={formData.seoCanonicalUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                      placeholder="https://yourdomain.com/products/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Prevents duplicate content issues</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiImage className="w-5 h-5" />
            Product Images
          </h3>

          <div className="space-y-4">
            {existingImages.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Existing Images:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {existingImages.map((img, idx) => (
                    <div key={img.public_id} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={img.url}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(img.public_id)}
                        className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-xs font-bold rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previews.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">New Images:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-black">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 cursor-pointer shadow-lg"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                      {existingImages.length === 0 && index === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer border border-gray-300">
                <FiUpload className="w-5 h-5" />
                <span className="font-medium">Upload Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  hidden
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                You can upload multiple images. The first image will be the primary image and used for OG tags.
                <br />
                Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB each.
              </p>
            </div>
          </div>
        </div>
      )}

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
            initialData ? 'Update Product' : 'Create Product'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;