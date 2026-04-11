import { useDispatch } from 'react-redux';
import {
  deleteAddress,
  setDefaultAddress,
} from '../../features/address/addressSlice';
import { FiEdit2, FiTrash2, FiStar, FiPhone, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AddressCard = ({ address, onEdit }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      dispatch(deleteAddress(address._id))
        .unwrap()
        .then(() => toast.success('Address deleted'))
        .catch((err) => toast.error(err));
    }
  };

  const handleSetDefault = () => {
    dispatch(setDefaultAddress(address._id))
      .unwrap()
      .then(() => toast.success('Default address updated'))
      .catch((err) => toast.error(err));
  };

  return (
    <div
      className={`group relative bg-bg-primary rounded-2xl border-2 overflow-hidden
                  transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg
                  ${
                    address.isDefault
                      ? 'border-primary shadow-md shadow-primary/10'
                      : 'border-border-light hover:border-primary/40 shadow-sm'
                  }`}
    >
      {/* Top Accent Bar */}
      {address.isDefault && (
        <div className="h-1 bg-gradient-to-r from-primary via-primary-light to-primary"></div>
      )}

      <div className="p-5 sm:p-6">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Label Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold 
                         uppercase tracking-wider
                         ${
                           address.isDefault
                             ? 'bg-primary-100 text-primary-dark'
                             : 'bg-bg-secondary text-text-secondary'
                         }`}
            >
              <FiMapPin className="text-[10px]" />
              {address.label}
            </span>

            {/* Default Badge */}
            {address.isDefault && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-text-white 
                           text-[10px] font-bold rounded-full shadow-sm"
              >
                <FiStar className="text-[10px]" />
                Default
              </span>
            )}
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-1.5 mb-5">
          <p className="text-base sm:text-lg font-bold text-text-primary">
            {address.fullName}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {address.addressLine1}
          </p>
          {address.addressLine2 && (
            <p className="text-sm text-text-secondary leading-relaxed">
              {address.addressLine2}
            </p>
          )}
          <p className="text-sm text-text-secondary">
            {address.city}, {address.state} -{' '}
            <span className="font-semibold text-text-primary">
              {address.pincode}
            </span>
          </p>
          <p className="text-sm text-text-secondary flex items-center gap-1.5 pt-1">
            <FiPhone className="text-primary text-xs" />
            <span className="font-medium">{address.phone}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className="flex items-center gap-2 flex-wrap pt-4 border-t border-border-light/80"
        >
          {!address.isDefault && (
            <button
              onClick={handleSetDefault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold 
                       text-primary bg-primary-50 hover:bg-primary-100 border border-primary-200
                       cursor-pointer transition-all duration-300 hover:shadow-sm"
            >
              <FiStar className="text-sm" />
              Set Default
            </button>
          )}

          <button
            onClick={() => onEdit(address)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold 
                     text-text-secondary bg-bg-secondary hover:bg-bg-tertiary border border-border-light
                     cursor-pointer transition-all duration-300 hover:shadow-sm hover:text-primary 
                     hover:border-primary-200"
          >
            <FiEdit2 className="text-sm" />
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold 
                     text-error bg-red-50 hover:bg-red-100 border border-red-200
                     cursor-pointer transition-all duration-300 hover:shadow-sm ml-auto"
          >
            <FiTrash2 className="text-sm" />
            Delete
          </button>
        </div>
      </div>

      {/* Hover Corner Decorations */}
      <div
        className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/0 
                   group-hover:border-primary/20 rounded-tr-xl transition-all duration-500"
      ></div>
      <div
        className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/0 
                   group-hover:border-primary/20 rounded-bl-xl transition-all duration-500"
      ></div>
    </div>
  );
};

export default AddressCard;