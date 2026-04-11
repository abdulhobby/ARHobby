import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, downloadInvoice } from '../features/order/orderSlice';
import OrderTimeline from '../components/order/OrderTimeline';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import { 
  FiDownload, 
  FiMapPin, 
  FiCopy, 
  FiPackage, 
  FiCreditCard, 
  FiTruck,
  FiArrowLeft,
  FiExternalLink,
  FiCheckCircle,
  FiClock,
  FiPhone,
  FiUser
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, bankDetails, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [id, dispatch]);

  const handleDownloadInvoice = () => {
    dispatch(downloadInvoice(id));
  };

  const copyToClipboard = (text, label = 'Copied!') => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const getStatusBadgeStyles = (status) => {
    const statusStyles = {
      'Pending': 'bg-warning/10 text-warning border border-warning/20',
      'Processing': 'bg-info/10 text-info border border-info/20',
      'Shipped': 'bg-primary/10 text-primary border border-primary/20',
      'Delivered': 'bg-success/10 text-success border border-success/20',
      'Cancelled': 'bg-error/10 text-error border border-error/20',
      'Paid': 'bg-success/10 text-success border border-success/20',
      'Unpaid': 'bg-warning/10 text-warning border border-warning/20',
      'Failed': 'bg-error/10 text-error border border-error/20',
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  if (loading || !order) return <Loader />;

  return (
    <div className="min-h-screen bg-bg-secondary">
      <SEO title={`Order ${order.orderNumber}`} />
      
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <Link 
            to="/orders" 
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary 
                       transition-colors duration-300 mb-4 cursor-pointer group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Back to Orders</span>
          </Link>
          
          {/* Order Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl 
                            flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                <FiPackage className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  Order <span className="text-primary">#{order.orderNumber}</span>
                </h1>
                <div className="flex items-center gap-2 mt-1 text-text-secondary">
                  <FiClock className="w-4 h-4" />
                  <span className="text-sm">Placed on {formatDate(order.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeStyles(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeStyles(order.paymentStatus)}`}>
                <FiCreditCard className="w-4 h-4 inline mr-1.5" />
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Order Items & Summary */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Order Items Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <FiPackage className="w-5 h-5 text-primary" />
                  Order Items
                  <span className="ml-2 px-2.5 py-0.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </span>
                </h2>
              </div>
              
              <div className="divide-y divide-border">
                {order.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-4 sm:p-6 flex gap-4 hover:bg-bg-secondary/30 transition-colors duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-bg-secondary 
                                    border border-border">
                        <img 
                          src={item.image || '/placeholder.png'} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-xs 
                                     font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary text-sm sm:text-base line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                        <span>Qty: {item.quantity}</span>
                        <span>×</span>
                        <span className="font-medium text-text-primary">{formatCurrency(item.price)}</span>
                      </div>
                      {item.variant && (
                        <p className="mt-1 text-xs text-text-light">
                          Variant: {item.variant}
                        </p>
                      )}
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
                <h2 className="text-lg font-bold text-text-primary">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-medium text-text-primary">{formatCurrency(order.subtotal)}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4" />
                      Discount 
                      {order.coupon?.code && (
                        <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded">
                          {order.coupon.code}
                        </span>
                      )}
                    </span>
                    <span className="font-medium">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-text-secondary">
                  <span className="flex items-center gap-2">
                    <FiTruck className="w-4 h-4" />
                    Shipping
                  </span>
                  <span className={`font-medium ${order.shippingCharge === 0 ? 'text-success' : 'text-text-primary'}`}>
                    {order.shippingCharge === 0 ? (
                      <span className="flex items-center gap-1">
                        <FiCheckCircle className="w-4 h-4" />
                        Free
                      </span>
                    ) : formatCurrency(order.shippingCharge)}
                  </span>
                </div>
                
                <div className="h-px bg-border my-4"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-text-primary">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-primary" />
                  Order Timeline
                </h2>
              </div>
              <div className="p-6">
                <OrderTimeline statusHistory={order.statusHistory} />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Shipping Address Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <FiMapPin className="w-5 h-5 text-primary" />
                  Shipping Address
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FiUser className="w-4 h-4 text-text-light mt-0.5" />
                    <p className="font-semibold text-text-primary">{order.shippingAddress.fullName}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-4 h-4 text-text-light mt-0.5" />
                    <div className="text-text-secondary text-sm leading-relaxed">
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      <p className="font-medium text-text-primary">{order.shippingAddress.pincode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone className="w-4 h-4 text-text-light" />
                    <p className="text-text-secondary text-sm">{order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Information Card */}
            {order.trackingNumber && (
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-primary/5">
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <FiTruck className="w-5 h-5 text-primary" />
                    Tracking Information
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-text-light uppercase tracking-wider">
                      Tracking Number
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-bg-secondary rounded-lg text-sm font-mono text-text-primary">
                        {order.trackingNumber}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(order.trackingNumber, 'Tracking number copied!')}
                        className="p-2 text-text-light hover:text-primary hover:bg-primary/10 
                                 rounded-lg transition-all duration-300 cursor-pointer"
                        title="Copy tracking number"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <a 
                      href="https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 
                               bg-bg-secondary hover:bg-primary/10 text-text-primary hover:text-primary 
                               rounded-xl font-medium transition-all duration-300 cursor-pointer
                               border border-border hover:border-primary"
                    >
                      <FiExternalLink className="w-4 h-4" />
                      Track on India Post
                    </a>
                    
                    <Link 
                      to={`/track-order/${order._id}`}
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 
                               bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold 
                               transition-all duration-300 cursor-pointer shadow-lg shadow-primary/20
                               hover:shadow-xl hover:shadow-primary/30"
                    >
                      <FiTruck className="w-4 h-4" />
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Details Card - Show when pending */}
            {order.paymentStatus === 'Pending' && bankDetails && (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-warning/30 overflow-hidden">
                <div className="px-6 py-4 border-b border-warning/20 bg-warning/5">
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <FiCreditCard className="w-5 h-5 text-warning" />
                    Payment Details
                  </h3>
                  <p className="text-sm text-warning mt-1">Complete your payment to process the order</p>
                </div>
                <div className="p-6 space-y-4">
                  {/* Bank Name */}
                  <div>
                    <label className="text-xs font-medium text-text-light uppercase tracking-wider">Bank Name</label>
                    <p className="mt-1 font-semibold text-text-primary">{bankDetails.bankName}</p>
                  </div>
                  
                  {/* Account Number */}
                  <div>
                    <label className="text-xs font-medium text-text-light uppercase tracking-wider">Account Number</label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-bg-secondary rounded-lg text-sm font-mono text-text-primary">
                        {bankDetails.accountNumber}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account number copied!')}
                        className="p-2 text-text-light hover:text-primary hover:bg-primary/10 
                                 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* IFSC Code */}
                  <div>
                    <label className="text-xs font-medium text-text-light uppercase tracking-wider">IFSC Code</label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-bg-secondary rounded-lg text-sm font-mono text-text-primary">
                        {bankDetails.ifsc}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(bankDetails.ifsc, 'IFSC code copied!')}
                        className="p-2 text-text-light hover:text-primary hover:bg-primary/10 
                                 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* UPI ID */}
                  <div>
                    <label className="text-xs font-medium text-text-light uppercase tracking-wider">UPI ID</label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-bg-secondary rounded-lg text-sm font-mono text-text-primary">
                        {bankDetails.upi}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(bankDetails.upi, 'UPI ID copied!')}
                        className="p-2 text-text-light hover:text-primary hover:bg-primary/10 
                                 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Amount to Pay */}
                  <div className="p-4 bg-warning/10 rounded-xl border border-warning/20">
                    <label className="text-xs font-medium text-warning uppercase tracking-wider">Amount to Pay</label>
                    <p className="mt-1 text-2xl font-bold text-text-primary">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  
                  {/* WhatsApp Button */}
                  <a 
                    href={`https://wa.me/${bankDetails.whatsapp?.replace('+', '')}?text=Hi, I have made payment for Order %23${order.orderNumber}. Please find the payment screenshot attached.`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 
                             bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-semibold 
                             transition-all duration-300 cursor-pointer shadow-lg shadow-[#25D366]/30
                             hover:shadow-xl"
                  >
                    <BsWhatsapp className="w-5 h-5" />
                    Send Payment Proof on WhatsApp
                  </a>
                </div>
              </div>
            )}

            {/* Download Invoice */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-6">
                <button 
                  onClick={handleDownloadInvoice}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 
                           bg-secondary hover:bg-secondary-light text-white rounded-xl font-semibold 
                           transition-all duration-300 cursor-pointer shadow-lg shadow-secondary/20
                           hover:shadow-xl hover:shadow-secondary/30 active:scale-[0.98]"
                >
                  <FiDownload className="w-5 h-5" />
                  Download Invoice
                </button>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary/20">
              <h4 className="font-semibold text-text-primary mb-2">Need Help?</h4>
              <p className="text-sm text-text-secondary mb-4">
                Have questions about your order? Our support team is here to help.
              </p>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark 
                         font-medium text-sm transition-colors duration-300 cursor-pointer"
              >
                Contact Support
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;