// OrderTimeline.jsx
import { formatDateTime } from '../../utils/helpers';
import { 
  FiCheck, 
  FiClock, 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiAlertCircle,
  FiShoppingCart,
  FiCreditCard,
  FiBox,
  FiMapPin
} from 'react-icons/fi';

const OrderTimeline = ({ statusHistory }) => {
  if (!statusHistory || statusHistory.length === 0) return null;

  // Get icon based on status
  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'order placed':
      case 'placed':
        return FiShoppingCart;
      case 'payment confirmed':
      case 'paid':
        return FiCreditCard;
      case 'processing':
      case 'confirmed':
        return FiBox;
      case 'shipped':
      case 'dispatched':
        return FiTruck;
      case 'out for delivery':
        return FiMapPin;
      case 'delivered':
      case 'completed':
        return FiCheckCircle;
      case 'cancelled':
      case 'failed':
        return FiAlertCircle;
      default:
        return FiClock;
    }
  };

  // Get color based on status
  const getStatusColors = (status, isLatest) => {
    const statusLower = status?.toLowerCase();
    
    if (statusLower === 'cancelled' || statusLower === 'failed') {
      return {
        bg: 'bg-red-100',
        border: 'border-red-500',
        icon: 'text-red-500',
        line: 'bg-red-200'
      };
    }
    
    if (isLatest) {
      return {
        bg: 'bg-primary',
        border: 'border-primary',
        icon: 'text-white',
        line: 'bg-primary-200'
      };
    }
    
    return {
      bg: 'bg-primary-100',
      border: 'border-primary',
      icon: 'text-primary',
      line: 'bg-primary-200'
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-border-green/30">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
          <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-text-primary">Order Timeline</h3>
          <p className="text-xs sm:text-sm text-text-light">Track your order progress</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 sm:p-6">
        <div className="relative">
          {statusHistory.map((entry, index) => {
            const isLatest = index === 0;
            const isLast = index === statusHistory.length - 1;
            const IconComponent = getStatusIcon(entry.status);
            const colors = getStatusColors(entry.status, isLatest);
            
            return (
              <div 
                key={index} 
                className={`relative flex gap-4 ${!isLast ? 'pb-6 sm:pb-8' : ''}`}
              >
                {/* Timeline Line */}
                {!isLast && (
                  <div 
                    className={`absolute left-5 sm:left-6 top-12 sm:top-14 w-0.5 h-[calc(100%-3rem)] sm:h-[calc(100%-3.5rem)] ${colors.line}`}
                  ></div>
                )}

                {/* Icon Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div 
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center shadow-md transition-all duration-300 ${isLatest ? 'animate-pulse-green scale-110' : ''}`}
                  >
                    <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon}`} />
                  </div>
                  
                  {/* Checkmark for completed steps */}
                  {!isLatest && entry.status?.toLowerCase() !== 'cancelled' && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                      <FiCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pt-1 ${isLatest ? 'animate-fade-in' : ''}`}>
                  <div className={`p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                    isLatest 
                      ? 'bg-primary-50 border-2 border-primary-200 shadow-md shadow-primary/10' 
                      : 'bg-bg-secondary border border-border-light hover:border-primary-200'
                  }`}>
                    {/* Status and Time */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 mb-2">
                      <p className={`font-bold text-sm sm:text-base ${
                        isLatest ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {entry.status}
                        {isLatest && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-primary text-white text-xs font-medium">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs sm:text-sm text-text-light">
                        <FiClock className="w-3.5 h-3.5" />
                        {formatDateTime(entry.date)}
                      </p>
                    </div>
                    
                    {/* Note */}
                    {entry.note && (
                      <div className="mt-2 pt-2 border-t border-border-light">
                        <p className="text-sm text-text-secondary flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                          {entry.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 pt-4 border-t border-border-light">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-light">Order Progress</span>
            <span className="font-semibold text-primary">
              {statusHistory.length} update{statusHistory.length > 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min((statusHistory.length / 5) * 100, 100)}%` 
              }}
            ></div>
          </div>
          
          {/* Status Labels */}
          <div className="mt-2 flex justify-between text-xs text-text-light">
            <span>Placed</span>
            <span>Processing</span>
            <span>Shipped</span>
            <span>Delivered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;