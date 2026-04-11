// OrderDetailPage.jsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, updateOrderStatus, downloadInvoice } from '../features/orders/adminOrderSlice';
import OrderStatusUpdate from '../components/orders/OrderStatusUpdate';
import OrderInvoice from '../components/orders/OrderInvoice';
import Loader from '../components/common/Loader';
import { formatCurrency, formatDate, formatDateTime } from '../utils/helpers';
import { FiMapPin, FiUser, FiMail, FiPhone, FiPackage, FiTruck, FiFileText, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [id, dispatch]);

  const handleStatusUpdate = (data) => {
    dispatch(updateOrderStatus({ id, data }))
      .unwrap()
      .then(() => toast.success('Order updated successfully'))
      .catch((err) => toast.error(err));
  };

  const handleInvoiceDownload = () => {
    dispatch(downloadInvoice(id));
  };

  if (loading || !order) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <FiClock className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
              order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {order.orderStatus}
            </span>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
              order.paymentStatus === 'Verified' ? 'bg-green-100 text-green-700' :
              order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items & Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiPackage className="w-5 h-5" />
                Order Items
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Discount {order.coupon?.code && `(${order.coupon.code})`}
                  </span>
                  <span className="font-medium text-green-600">
                    -{formatCurrency(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">
                  {order.shippingCharge === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatCurrency(order.shippingCharge)
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-black">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiClock className="w-5 h-5" />
              Status History
            </h3>
            <div className="space-y-3">
              {order.statusHistory?.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {entry.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(entry.date)}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-xs text-gray-600">{entry.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Customer & Shipping Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser className="w-5 h-5" />
              Customer
            </h3>
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">
                {order.user?.name}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiMail className="w-4 h-4" />
                <span>{order.user?.email}</span>
              </div>
              {order.user?.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiPhone className="w-4 h-4" />
                  <span>{order.user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiMapPin className="w-5 h-5" />
              Shipping Address
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiTruck className="w-5 h-5" />
                Tracking
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Tracking Number</p>
                  <code className="text-sm bg-gray-100 px-3 py-1.5 rounded font-mono">
                    {order.trackingNumber}
                  </code>
                </div>
                <a
                  href="https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                >
                  Track on India Post
                </a>
              </div>
            </div>
          )}

          {/* Customer Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiFileText className="w-5 h-5" />
                Customer Notes
              </h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {order.notes}
              </p>
            </div>
          )}

          {/* Admin Notes */}
          {order.adminNotes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiFileText className="w-5 h-5" />
                Admin Notes
              </h3>
              <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                {order.adminNotes}
              </p>
            </div>
          )}

          {/* Invoice */}
          <OrderInvoice order={order} onDownload={handleInvoiceDownload} />

          {/* Status Update */}
          <OrderStatusUpdate order={order} onUpdate={handleStatusUpdate} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;