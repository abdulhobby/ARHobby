// AddressForm.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAddress } from '../../features/address/addressSlice';
import { INDIAN_STATES, ADDRESS_LABELS } from '../../utils/constants';
import toast from 'react-hot-toast';
import { FiUser, FiPhone, FiMapPin, FiHome, FiCheck, FiX, FiSave } from 'react-icons/fi';

const AddressForm = ({ onSuccess, onCancel, initialData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    pincode: initialData?.pincode || '',
    country: initialData?.country || 'India',
    label: initialData?.label || 'Home',
    isDefault: initialData?.isDefault || false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(addAddress(formData))
      .unwrap()
      .then((data) => {
        toast.success('Address added successfully');
        if (onSuccess) onSuccess(data.address);
      })
      .catch((err) => toast.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-border-light p-4 sm:p-6 lg:p-8 shadow-sm animate-fade-in"
    >
      {/* Form Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-100 flex items-center justify-center">
          <FiMapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-text-primary">
            {initialData ? 'Edit Address' : 'Add New Address'}
          </h3>
          <p className="text-sm text-text-light">Fill in your shipping details</p>
        </div>
      </div>

      {/* Personal Info Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="group">
          <label className="label-text flex items-center gap-2">
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
            className="input-field group-hover:border-primary-300"
          />
        </div>
        <div className="group">
          <label className="label-text flex items-center gap-2">
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
            className="input-field group-hover:border-primary-300"
          />
        </div>
      </div>

      {/* Address Line 1 */}
      <div className="mb-4 sm:mb-6 group">
        <label className="label-text flex items-center gap-2">
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
          className="input-field group-hover:border-primary-300"
        />
      </div>

      {/* Address Line 2 */}
      <div className="mb-4 sm:mb-6 group">
        <label className="label-text flex items-center gap-2">
          <FiMapPin className="w-4 h-4 text-primary" />
          Address Line 2 <span className="text-text-light">(Optional)</span>
        </label>
        <input 
          type="text" 
          name="addressLine2" 
          value={formData.addressLine2} 
          onChange={handleChange}
          placeholder="Landmark, Area, Colony"
          className="input-field group-hover:border-primary-300"
        />
      </div>

      {/* City, State, Pincode Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="group">
          <label className="label-text">
            City <span className="text-error">*</span>
          </label>
          <input 
            type="text" 
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
            required
            placeholder="Enter city"
            className="input-field group-hover:border-primary-300"
          />
        </div>
        <div className="group">
          <label className="label-text">
            State <span className="text-error">*</span>
          </label>
          <select 
            name="state" 
            value={formData.state} 
            onChange={handleChange} 
            required
            className="select-field group-hover:border-primary-300"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="group sm:col-span-2 lg:col-span-1">
          <label className="label-text">
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
            className="input-field group-hover:border-primary-300"
          />
        </div>
      </div>

      {/* Label and Default Address Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 bg-bg-secondary rounded-xl border border-border-green/30">
        <div className="flex-1">
          <label className="label-text">Address Label</label>
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
          <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
            Set as default address
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-border-light">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl border-2 border-border text-text-secondary font-semibold cursor-pointer transition-all duration-300 hover:border-error hover:text-error hover:bg-error/5 active:scale-95 flex items-center justify-center gap-2"
          >
            <FiX className="w-5 h-5" />
            Cancel
          </button>
        )}
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
              Save Address
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;