// AddressSelector.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses } from '../../features/address/addressSlice';
import AddressForm from './AddressForm';
import { FiPlus, FiMapPin, FiPhone, FiUser, FiCheck, FiChevronDown, FiHome, FiBriefcase } from 'react-icons/fi';

const AddressSelector = ({ selectedAddress, onSelectAddress }) => {
  const dispatch = useDispatch();
  const { addresses, loading } = useSelector((state) => state.address);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
      onSelectAddress(defaultAddress);
    }
  }, [addresses, selectedAddress, onSelectAddress]);

  const handleAddressAdded = (newAddress) => {
    setShowAddForm(false);
    onSelectAddress(newAddress);
  };

  const getLabelIcon = (label) => {
    switch (label?.toLowerCase()) {
      case 'home': return <FiHome className="w-4 h-4" />;
      case 'work': case 'office': return <FiBriefcase className="w-4 h-4" />;
      default: return <FiMapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-border-green/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <FiMapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-text-primary">Shipping Address</h3>
            <p className="text-sm text-text-light">Select or add a delivery address</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-95"
        >
          <FiPlus className={`w-5 h-5 transition-transform duration-300 ${showAddForm ? 'rotate-45' : ''}`} />
          <span>{showAddForm ? 'Close' : 'Add New'}</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-4 sm:p-6 border-b border-border-light bg-bg-secondary animate-slide-down">
          <AddressForm
            onSuccess={handleAddressAdded}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-8 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-light">Loading addresses...</p>
        </div>
      )}

      {/* Address List */}
      {!loading && addresses.length > 0 && (
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto">
          {addresses.map((address, index) => (
            <div
              key={address._id}
              onClick={() => onSelectAddress(address)}
              className={`relative p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${selectedAddress?._id === address._id
                  ? 'border-primary bg-primary-50 shadow-md shadow-primary/10'
                  : 'border-border-light bg-white hover:border-primary-300 hover:bg-primary-50/50'
                }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Radio Button */}
              <div className="flex items-start gap-4">
                <div className="relative mt-1">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress?._id === address._id}
                    onChange={() => onSelectAddress(address)}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${selectedAddress?._id === address._id
                      ? 'border-primary bg-primary'
                      : 'border-border group-hover:border-primary-400'
                    }`}>
                    {selectedAddress?._id === address._id && (
                      <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Address Content */}
                <div className="flex-1 min-w-0">
                  {/* Name and Phone */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <span className="flex items-center gap-1.5 text-text-primary font-semibold text-sm sm:text-base">
                      <FiUser className="w-4 h-4 text-primary" />
                      {address.fullName}
                    </span>
                    <span className="hidden sm:inline text-border">|</span>
                    <span className="flex items-center gap-1.5 text-text-secondary text-sm">
                      <FiPhone className="w-3.5 h-3.5 text-primary" />
                      {address.phone}
                    </span>
                  </div>

                  {/* Address Lines */}
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {address.addressLine1}
                  </p>
                  {address.addressLine2 && (
                    <p className="text-text-light text-sm">{address.addressLine2}</p>
                  )}
                  <p className="text-text-secondary text-sm mt-1">
                    {address.city}, {address.state} - <span className="font-medium">{address.pincode}</span>
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-white text-xs font-medium">
                        <FiCheck className="w-3 h-3" />
                        Default
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-100 text-primary text-xs font-medium">
                      {getLabelIcon(address.label)}
                      {address.label}
                    </span>
                  </div>
                </div>

                {/* Selected Indicator */}
                {selectedAddress?._id === address._id && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse-green">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && addresses.length === 0 && !showAddForm && (
        <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4 animate-bounce-subtle">
            <FiMapPin className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-text-primary mb-2">No addresses found</h4>
          <p className="text-text-light mb-6 max-w-sm">
            Please add a shipping address to continue with your order.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-95"
          >
            <FiPlus className="w-5 h-5" />
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;