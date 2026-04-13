// CartSummary.jsx
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import { 
  FiTruck, 
  FiShield, 
  FiGift, 
  FiClock, 
  FiCheckCircle,
  FiLock,
  FiArrowRight,
  FiPackage,
  FiTrash2
} from 'react-icons/fi';

const CartSummary = ({ subtotal, totalItems, shipping, total, onClearCart }) => {
  const freeShippingRemaining = Math.max(0, 1000 - subtotal);
  const freeShippingProgress = Math.min((subtotal / 1000) * 100, 100);
  const isFreeShipping = subtotal >= 1000;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full"></div>

        <h3 className="text-lg sm:text-xl font-bold text-white relative z-10 flex items-center gap-2">
          <FiShield className="text-white/80" />
          Order Summary
        </h3>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Items Count */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600 font-medium">
            Total Items
          </span>
          <span className="text-sm font-bold text-gray-900">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-600 font-medium">
            Subtotal
          </span>
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-600 font-medium flex items-center gap-1.5">
            <FiTruck className="text-sm text-gray-400" />
            Shipping
          </span>
          <span className={`text-sm font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {shipping === 0 ? (
              <span className="inline-flex items-center gap-1">
                <FiCheckCircle className="w-4 h-4" />
                Free
              </span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        {/* Free Shipping Progress */}
        {!isFreeShipping && subtotal > 0 && (
          <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <FiTruck className="text-amber-600 text-sm flex-shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Add{' '}
                <span className="font-bold text-amber-900">
                  {formatCurrency(freeShippingRemaining)}
                </span>{' '}
                more for{' '}
                <span className="font-bold text-amber-900">FREE shipping!</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full 
                         transition-all duration-700 ease-out relative"
                style={{ width: `${freeShippingProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                              animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        )}

        {/* Free shipping achieved message */}
        {isFreeShipping && (
          <div className="bg-green-50 rounded-xl p-3 border border-green-200 flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <FiCheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="text-xs font-semibold text-green-800">
              Congratulations! You've unlocked free shipping!
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t-2 border-dashed border-gray-200 my-2"></div>

        {/* Total */}
        <div className="flex items-center justify-between py-3 bg-gradient-to-r from-gray-50 to-white rounded-xl px-4 border border-gray-200">
          <span className="text-base font-bold text-gray-900">Total Amount</span>
          <span className="text-xl sm:text-2xl font-extrabold text-primary">
            {formatCurrency(total)}
          </span>
        </div>

        {/* Tax Note */}
        <p className="text-xs text-gray-400 text-center">
          Inclusive of all taxes and GST
        </p>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onClearCart}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-semibold rounded-xl border-2 border-red-200 cursor-pointer transition-all duration-300 hover:bg-red-50 hover:border-red-300 active:scale-[0.98]"
          >
            <FiTrash2 className="w-5 h-5" />
            Clear Cart
          </button>
          
          <Link 
            to="/shop"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:border-gray-300 active:scale-[0.98]"
          >
            <FiPackage className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;