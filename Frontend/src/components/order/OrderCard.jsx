// OrderCard.jsx
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';
import { FiPackage, FiCalendar, FiEye, FiTruck, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

const OrderCard = ({ order }) => {
  // Custom status badge styles based on status
  const getStatusBadgeStyles = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'delivered':
      case 'completed':
        return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'shipped':
      case 'in transit':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentBadgeStyles = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'paid':
      case 'completed':
        return 'bg-primary-50 text-primary border-primary-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'failed':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden group">
      {/* Order Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-primary-50 to-white border-b border-border-light">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30 flex-shrink-0">
              <FiPackage className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-text-primary text-base sm:text-lg">
                Order #{order.orderNumber}
              </p>
              <p className="flex items-center gap-1.5 text-sm text-text-light">
                <FiCalendar className="w-3.5 h-3.5" />
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border ${getStatusBadgeStyles(order.orderStatus)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse"></span>
            {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4 sm:p-5">
        <div className="space-y-3">
          {order.items.slice(0, 3).map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 sm:gap-4 p-3 bg-bg-secondary rounded-xl border border-border-light hover:border-primary-200 transition-colors"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white border border-border-light flex-shrink-0">
                <img 
                  src={item.image || '/placeholder.png'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {item.quantity > 1 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {item.quantity}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm sm:text-base truncate mb-1">
                  {item.name}
                </p>
                <p className="text-sm text-text-light">
                  Qty: <span className="font-medium text-text-secondary">{item.quantity}</span>
                  <span className="mx-2 text-border">×</span>
                  <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="font-bold text-primary">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
          
          {/* More items indicator */}
          {order.items.length > 3 && (
            <div className="flex items-center justify-center gap-2 py-3 bg-primary-50 rounded-xl border border-primary-100">
              <FiShoppingBag className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-primary">
                +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Footer */}
      <div className="p-4 sm:p-5 bg-bg-secondary border-t border-border-light">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Total and Payment Status */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-xl border border-border-light">
              <span className="text-sm text-text-light">Total: </span>
              <span className="text-lg sm:text-xl font-bold text-primary">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${getPaymentBadgeStyles(order.paymentStatus)}`}>
              Payment: {order.paymentStatus}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              to={`/order/${order._id}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-primary text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-95 text-sm"
            >
              <FiEye className="w-4 h-4" />
              <span>View Details</span>
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {order.trackingNumber && (
              <Link 
                to={`/track-order/${order._id}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white text-primary font-semibold rounded-xl border-2 border-primary cursor-pointer transition-all duration-300 hover:bg-primary-50 active:scale-95 text-sm"
              >
                <FiTruck className="w-4 h-4" />
                <span>Track Order</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;