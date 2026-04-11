// OrderStatusUpdate.jsx
import { useState } from 'react';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../utils/helpers';
import { FiRefreshCw, FiTruck, FiCreditCard, FiMessageSquare } from 'react-icons/fi';

const OrderStatusUpdate = ({ order, onUpdate, loading }) => {
  const [orderStatus, setOrderStatus] = useState(order?.orderStatus || '');
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || '');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [adminNotes, setAdminNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {};
    if (orderStatus && orderStatus !== order?.orderStatus) data.orderStatus = orderStatus;
    if (paymentStatus && paymentStatus !== order?.paymentStatus) data.paymentStatus = paymentStatus;
    if (trackingNumber && trackingNumber !== order?.trackingNumber) data.trackingNumber = trackingNumber;
    if (adminNotes) data.adminNotes = adminNotes;

    if (Object.keys(data).length === 0) return;
    onUpdate(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FiRefreshCw className="w-5 h-5" />
        Update Order Status
      </h3>

      <div className="space-y-4">
        {/* Order Status & Payment Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiTruck className="w-4 h-4" />
              Order Status
            </label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
            >
              {ORDER_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiCreditCard className="w-4 h-4" />
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
            >
              {PAYMENT_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tracking Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tracking Number (India Post)
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
            placeholder="Enter India Post tracking number"
          />
          <p className="text-xs text-gray-500 mt-1">
            e.g., RR123456789IN
          </p>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FiMessageSquare className="w-4 h-4" />
            Admin Notes
          </label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 resize-none"
            placeholder="Add notes about this update..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Updating...
            </span>
          ) : (
            'Update Order'
          )}
        </button>
      </div>
    </form>
  );
};

export default OrderStatusUpdate;