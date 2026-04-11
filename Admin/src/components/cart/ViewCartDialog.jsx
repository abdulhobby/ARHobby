import React from 'react';
import { FiX, FiTrash2, FiShoppingBag } from 'react-icons/fi';

const ViewCartDialog = ({ open, cart, onClose, onRemoveItem }) => {
  if (!open || !cart) return null;

  const getImageUrl = (images) => {
    if (images && images.length > 0) {
      return images[0];
    }
    return '/placeholder-image.jpg';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Cart Details</h2>
            <p className="text-sm text-gray-500 mt-1">{cart.user?.name || 'User'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* User Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">User Name</p>
                <p className="text-sm font-medium text-gray-900">{cart.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900">{cart.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(cart.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="mb-6 flex justify-between items-center p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{cart.totalItems || 0}</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div>
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-2xl font-bold text-gray-900">${(cart.totalPrice || 0).toFixed(2)}</p>
            </div>
          </div>

          {/* Items Table */}
          {cart.items && cart.items.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Cart is empty</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Product</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Quantity</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Price</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Total</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <tr key={item.product?._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(item.product?.images)}
                            alt={item.product?.name}
                            className="w-10 h-10 object-cover rounded"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                          <span className="text-sm text-gray-900">{item.product?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-gray-900">{item.quantity}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-gray-900">${item.price?.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onRemoveItem(cart.user?._id, item.product?._id)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                          title="Remove Item"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCartDialog;