import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { trackOrder } from '../features/order/orderSlice';
import OrderTimeline from '../components/order/OrderTimeline';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';
import { 
  FiCopy, 
  FiPackage, 
  FiTruck, 
  FiMapPin, 
  FiExternalLink,
  FiArrowLeft,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiBox
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const TrackOrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, trackingInfo, loading } = useSelector((state) => state.order);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(trackOrder(id));
  }, [id, dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(trackOrder(id));
    setTimeout(() => setIsRefreshing(false), 1000);
    toast.success('Tracking info updated!');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Tracking number copied!');
  };

  const getStatusConfig = (status) => {
    const configs = {
      'Pending': { 
        icon: FiClock, 
        color: 'text-warning', 
        bg: 'bg-warning/10',
        border: 'border-warning/20'
      },
      'Processing': { 
        icon: FiBox, 
        color: 'text-info', 
        bg: 'bg-info/10',
        border: 'border-info/20'
      },
      'Shipped': { 
        icon: FiTruck, 
        color: 'text-primary', 
        bg: 'bg-primary/10',
        border: 'border-primary/20'
      },
      'Delivered': { 
        icon: FiCheckCircle, 
        color: 'text-success', 
        bg: 'bg-success/10',
        border: 'border-success/20'
      },
      'Cancelled': { 
        icon: FiAlertCircle, 
        color: 'text-error', 
        bg: 'bg-error/10',
        border: 'border-error/20'
      },
    };
    return configs[status] || configs['Pending'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <SEO title="Track Order" />
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-text-secondary">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center px-4">
        <SEO title="Order Not Found" />
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10 text-error" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Order Not Found</h2>
          <p className="text-text-secondary mb-6">
            We couldn't find the order you're looking for. Please check the order ID and try again.
          </p>
          <Link 
            to="/orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark 
                     text-white rounded-xl font-semibold transition-all duration-300 cursor-pointer
                     shadow-lg shadow-primary/30"
          >
            <FiPackage className="w-5 h-5" />
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-bg-secondary">
      <SEO title={`Track Order #${order.orderNumber}`} />

      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <Link 
            to={`/order/${id}`}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary 
                     transition-colors duration-300 mb-4 cursor-pointer group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Back to Order Details</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl 
                            flex items-center justify-center shadow-lg shadow-primary/20">
                <FiTruck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  Track Your Order
                </h1>
                <p className="text-text-secondary mt-0.5">
                  Order #{order.orderNumber}
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 
                       text-primary rounded-xl font-medium transition-all duration-300 cursor-pointer
                       disabled:opacity-50 self-start sm:self-auto"
            >
              <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
          <div className={`p-6 sm:p-8 ${statusConfig.bg} border-b ${statusConfig.border}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center 
                            ${statusConfig.bg} border-2 ${statusConfig.border}`}>
                <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary mb-1">Current Status</p>
                <h2 className={`text-2xl sm:text-3xl font-bold ${statusConfig.color}`}>
                  {order.orderStatus}
                </h2>
                <p className="text-text-secondary mt-1">
                  {order.orderStatus === 'Pending' && 'Your order is being processed'}
                  {order.orderStatus === 'Processing' && 'Your order is being prepared for shipment'}
                  {order.orderStatus === 'Shipped' && 'Your order is on its way!'}
                  {order.orderStatus === 'Delivered' && 'Your order has been delivered'}
                  {order.orderStatus === 'Cancelled' && 'This order has been cancelled'}
                </p>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          {order.orderStatus === 'Shipped' && (
            <div className="px-6 sm:px-8 py-4 bg-primary-50 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <FiMapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Estimated Delivery</p>
                  <p className="font-semibold text-text-primary">
                    {order.estimatedDelivery || '5-7 Business Days'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Information */}
        {trackingInfo ? (
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <FiTruck className="w-5 h-5 text-primary" />
                Tracking Information
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Carrier Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div>
                  <p className="text-sm text-text-light uppercase tracking-wider mb-1">Carrier</p>
                  <p className="text-lg font-semibold text-text-primary">{trackingInfo.carrier}</p>
                </div>
                <div className="hidden sm:block w-px h-12 bg-border"></div>
                <div className="flex-1">
                  <p className="text-sm text-text-light uppercase tracking-wider mb-1">Tracking Number</p>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-1.5 bg-bg-secondary rounded-lg text-sm font-mono 
                                   text-text-primary border border-border">
                      {trackingInfo.trackingNumber}
                    </code>
                    <button
                      onClick={() => copyToClipboard(trackingInfo.trackingNumber)}
                      className="p-2 text-text-light hover:text-primary hover:bg-primary/10 
                               rounded-lg transition-all duration-300 cursor-pointer"
                      title="Copy tracking number"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Track Button */}
              <a
                href={trackingInfo.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 px-6
                         bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold
                         transition-all duration-300 cursor-pointer shadow-lg shadow-primary/30
                         hover:shadow-xl hover:shadow-primary/40"
              >
                <FiExternalLink className="w-5 h-5" />
                Track on {trackingInfo.carrier} Website
              </a>

              {/* Tracking Updates */}
              {trackingInfo.updates && trackingInfo.updates.length > 0 && (
                <div className="pt-6 border-t border-border">
                  <h4 className="font-semibold text-text-primary mb-4">Tracking Updates</h4>
                  <div className="space-y-4">
                    {trackingInfo.updates.map((update, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-primary' : 'bg-border'
                          }`}></div>
                          {index < trackingInfo.updates.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-text-primary">{update.status}</p>
                          <p className="text-sm text-text-secondary">{update.location}</p>
                          <p className="text-xs text-text-light mt-1">{update.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* No Tracking Info Available */
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
            <div className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiClock className="w-10 h-10 text-warning" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Tracking Not Yet Available
              </h3>
              <p className="text-text-secondary max-w-md mx-auto mb-6">
                Tracking information will be available once your order has been shipped. 
                We'll notify you via email when your package is on its way.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 text-warning 
                            rounded-lg text-sm font-medium">
                <FiClock className="w-4 h-4" />
                Estimated shipping: 1-2 business days
              </div>
            </div>
          </div>
        )}

        {/* Order Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <FiClock className="w-5 h-5 text-primary" />
              Order Progress
            </h3>
          </div>
          <div className="p-6">
            <OrderTimeline statusHistory={order.statusHistory} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to={`/order/${id}`}
            className="flex items-center justify-center gap-2 py-4 px-6
                     bg-white hover:bg-bg-secondary text-text-primary rounded-xl font-semibold
                     transition-all duration-300 cursor-pointer border border-border
                     hover:border-primary/30 hover:text-primary"
          >
            <FiPackage className="w-5 h-5" />
            View Order Details
          </Link>
          
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 py-4 px-6
                     bg-white hover:bg-bg-secondary text-text-primary rounded-xl font-semibold
                     transition-all duration-300 cursor-pointer border border-border
                     hover:border-primary/30 hover:text-primary"
          >
            <FiArrowLeft className="w-5 h-5" />
            All Orders
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 
                      border border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-text-primary mb-1">Need Help With Your Order?</h4>
              <p className="text-sm text-text-secondary">
                Our customer support team is available to assist you with any questions.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3
                       bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold
                       transition-all duration-300 cursor-pointer shadow-md shadow-primary/20
                       whitespace-nowrap"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;