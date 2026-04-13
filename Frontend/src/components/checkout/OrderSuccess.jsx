// OrderSuccess.jsx
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import { FiCheckCircle, FiCopy, FiExternalLink, FiPackage, FiShoppingBag, FiArrowRight, FiSmartphone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import QR from '../../assets/my-qr.jpeg'

const OrderSuccess = ({ order, bankDetails }) => {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="min-h-screen bg-bg-secondary py-6 sm:py-8 lg:py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Payment Details Card - Only payment info, no duplicate success message */}
        <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden mb-6 animate-fade-in">
          {/* Card Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-border-green/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                <FiSmartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-text-primary">Complete Your Payment</h2>
                <p className="text-sm text-text-light">Scan QR code or use UPI to pay</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded-xl border-2 border-primary border-dashed">
              <div className="text-center">
                <p className="text-sm text-text-secondary mb-1">Amount to Pay</p>
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* QR Code Section */}
            <div className="p-4 sm:p-5 bg-bg-secondary rounded-xl border border-border-light text-center">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <FiSmartphone className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-text-primary">Scan QR Code to Pay</h3>
              </div>

              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white rounded-2xl shadow-md inline-block">
                  {/* QR Code Image - Replace with your actual QR code image URL */}
                  <img
                    src={QR}
                    alt="UPI QR Code"
                    className="w-48 h-48 sm:w-56 sm:h-56"
                  />
                  {/* Or use a QR code generation library like qrcode.react */}
                </div>
              </div>
              <p className="text-sm text-text-secondary">Scan this QR code with any UPI app (Google Pay, PhonePe, Paytm)</p>
            </div>

            {/* UPI Section */}
            <div className="p-4 sm:p-5 bg-bg-secondary rounded-xl border border-border-light">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <FiSmartphone className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-text-primary">UPI Payment</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg group">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-light">UPI ID</p>
                    <p className="font-semibold text-text-primary font-mono">6388870150@ptyes</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard('6388870150@ptyes', 'UPI ID')}
                    className="p-2.5 rounded-lg bg-primary-50 text-primary hover:bg-primary hover:text-white cursor-pointer transition-all duration-300"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg group">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-light">Mobile Number (Google Pay / PhonePe / Paytm)</p>
                    <p className="font-semibold text-text-primary font-mono text-lg">6388870150</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard('6388870150', 'Mobile number')}
                    className="p-2.5 rounded-lg bg-primary-50 text-primary hover:bg-primary hover:text-white cursor-pointer transition-all duration-300"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Payment Apps Buttons */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <a
                  href="tez://pay?pa=6388870150@ptyes&pn=Store&am=0"
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  <span>📱</span> GPay
                </a>
                <a
                  href="phonepe://pay?pa=6388870150@ptyes&pn=Store&am=0"
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
                >
                  <span>📱</span> PhonePe
                </a>
                <a
                  href="paytmmp://pay?pa=6388870150@ptyes&pn=Store&am=0"
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <span>📱</span> Paytm
                </a>
              </div>
            </div>

            {/* WhatsApp Section */}
            <div className="p-4 sm:p-5 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text-secondary mb-2">
                    After payment, please send the payment screenshot via WhatsApp to:
                  </p>
                  <a
                    href="https://wa.me/917081434589"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-green-500 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    7081434589
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-fade-in">
          <Link
            to={`/order/${order._id}`}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-95 group"
          >
            <FiPackage className="w-5 h-5" />
            View Order Details
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-primary font-semibold rounded-xl border-2 border-primary cursor-pointer transition-all duration-300 hover:bg-primary-50 active:scale-95"
          >
            <FiPackage className="w-5 h-5" />
            My Orders
          </Link>

          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-secondary-light hover:shadow-lg active:scale-95"
          >
            <FiShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-200 text-center animate-fade-in">
          <p className="text-sm text-primary-dark">
            <strong>Note:</strong> Your order will be processed within 24 hours after payment verification.
            Please send payment screenshot on WhatsApp after completing the payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;