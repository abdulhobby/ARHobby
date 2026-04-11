// AddressesPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, updateAddress, addAddress } from '../features/address/addressSlice';
import AddressCard from '../components/profile/AddressCard';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import SEO from '../components/common/SEO';
import { INDIAN_STATES, ADDRESS_LABELS } from '../utils/constants';
import { 
  FiPlus, 
  FiX, 
  FiMapPin, 
  FiUser, 
  FiPhone, 
  FiHome, 
  FiSave,
  FiCheck,
  FiEdit3
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AddressesPage = () => {
  const dispatch = useDispatch();
  const { addresses, loading } = useSelector((state) => state.address);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '', country: 'India',
    label: 'Home', isDefault: false
  });

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName || '',
      phone: address.phone || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || 'India',
      label: address.label || 'Home',
      isDefault: address.isDefault || false
    });
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setFormData({
      fullName: '', phone: '', addressLine1: '', addressLine2: '',
      city: '', state: '', pincode: '', country: 'India',
      label: 'Home', isDefault: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      dispatch(updateAddress({ id: editingAddress._id, data: formData }))
        .unwrap()
        .then(() => { toast.success('Address updated successfully'); resetForm(); dispatch(fetchAddresses()); })
        .catch((err) => toast.error(err));
    } else {
      dispatch(addAddress(formData))
        .unwrap()
        .then(() => { toast.success('Address added successfully'); resetForm(); dispatch(fetchAddresses()); })
        .catch((err) => toast.error(err));
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      <SEO title="My Addresses" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <FiMapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My Addresses</h1>
                  <p className="text-sm text-text-light">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
                </div>
              </div>
              <button 
                onClick={() => { resetForm(); setShowForm(!showForm); }}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 active:scale-95 ${
                  showForm 
                    ? 'bg-white text-error border-2 border-error hover:bg-error/5' 
                    : 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30'
                }`}
              >
                {showForm ? (
                  <>
                    <FiX className="w-5 h-5" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <FiPlus className="w-5 h-5" />
                    <span>Add New Address</span>
                  </>
                )}
              </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
              <div className="bg-white rounded-2xl border border-border-light shadow-sm mb-6 overflow-hidden animate-slide-down">
                {/* Form Header */}
                <div className="flex items-center gap-3 p-4 sm:p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-border-green/30">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                    {editingAddress ? <FiEdit3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <FiPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <p className="text-sm text-text-light">Fill in your shipping details</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                        <FiUser className="w-4 h-4 text-primary" />
                        Full Name <span className="text-error">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        required
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 group-hover:border-primary-300"
                      />
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                        <FiPhone className="w-4 h-4 text-primary" />
                        Phone Number <span className="text-error">*</span>
                      </label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        required
                        placeholder="Enter 10-digit mobile number"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 group-hover:border-primary-300"
                      />
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div className="mb-4 sm:mb-6 group">
                    <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                      <FiHome className="w-4 h-4 text-primary" />
                      Address Line 1 <span className="text-error">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="addressLine1" 
                      value={formData.addressLine1} 
                      onChange={handleChange} 
                      required
                      placeholder="House/Flat No., Building Name, Street"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 group-hover:border-primary-300"
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div className="mb-4 sm:mb-6 group">
                    <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                      <FiMapPin className="w-4 h-4 text-primary" />
                      Address Line 2 <span className="text-text-light">(Optional)</span>
                    </label>
                    <input 
                      type="text" 
                      name="addressLine2" 
                      value={formData.addressLine2} 
                      onChange={handleChange}
                      placeholder="Landmark, Area, Colony"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 group-hover:border-primary-300"
                    />
                  </div>

                  {/* City, State, Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        City <span className="text-error">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange} 
                        required
                        placeholder="Enter city"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 group-hover:border-primary-300"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        State <span className="text-error">*</span>
                      </label>
                      <select 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange} 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary cursor-pointer transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 group-hover:border-primary-300"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="group sm:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Pincode <span className="text-error">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="pincode" 
                        value={formData.pincode} 
                        onChange={handleChange} 
                        required
                        placeholder="6-digit pincode"
                        maxLength={6}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 group-hover:border-primary-300"
                      />
                    </div>
                  </div>

                  {/* Label and Default */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 bg-bg-secondary rounded-xl border border-border-light">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-text-primary mb-2">Address Label</label>
                      <div className="flex flex-wrap gap-2">
                        {ADDRESS_LABELS.map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, label: l }))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ${
                              formData.label === l 
                                ? 'bg-primary text-white shadow-md shadow-primary/30' 
                                : 'bg-white text-text-secondary border border-border hover:border-primary hover:text-primary'
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <label className="flex items-center gap-3 cursor-pointer group p-3 bg-white rounded-xl border border-border hover:border-primary transition-all duration-300">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          name="isDefault" 
                          checked={formData.isDefault} 
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-6 h-6 rounded-md border-2 border-border peer-checked:border-primary peer-checked:bg-primary transition-all duration-300 flex items-center justify-center">
                          {formData.isDefault && <FiCheck className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors whitespace-nowrap">
                        Set as default
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-border-light">
                    <button 
                      type="button" 
                      onClick={resetForm}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl border-2 border-border text-text-secondary font-semibold cursor-pointer transition-all duration-300 hover:border-error hover:text-error hover:bg-error/5 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <FiX className="w-5 h-5" />
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-5 h-5" />
                          {editingAddress ? 'Update Address' : 'Save Address'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address Cards Grid */}
            {addresses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {addresses.map((address, index) => (
                  <div 
                    key={address._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <AddressCard address={address} onEdit={handleEdit} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {addresses.length === 0 && !showForm && (
              <div className="bg-white rounded-2xl border border-border-light shadow-sm p-8 sm:p-12 text-center animate-fade-in">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
                  <FiMapPin className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">No Addresses Found</h3>
                <p className="text-text-light mb-6 max-w-sm mx-auto">
                  Add your first delivery address to start shopping
                </p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-95"
                >
                  <FiPlus className="w-5 h-5" />
                  Add Your First Address
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && addresses.length === 0 && (
              <div className="bg-white rounded-2xl border border-border-light shadow-sm p-8 sm:p-12 text-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-text-light">Loading your addresses...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;