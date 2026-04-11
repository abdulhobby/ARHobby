// CartSummary.jsx
import { formatCurrency } from '../../utils/helpers';
import { FiTruck, FiShield, FiGift } from 'react-icons/fi';

const CartSummary = ({ cart, discount, shippingCharge }) => {
  const subtotal = cart?.totalPrice || 0;
  const shipping =
    shippingCharge !== undefined
      ? shippingCharge
      : subtotal >= 1000
        ? 0
        : 80;
  const total = subtotal - (discount || 0) + shipping;
  const freeShippingRemaining = 1000 - subtotal;
  const freeShippingProgress = Math.min((subtotal / 1000) * 100, 100);

  return (
    <div
      className="bg-bg-primary rounded-2xl border-2 border-border-light shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark p-5 sm:p-6 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full"></div>

        <h3 className="text-lg sm:text-xl font-bold text-text-white relative z-10 flex items-center gap-2">
          <FiShield className="text-white/80" />
          Order Summary
        </h3>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-text-secondary font-medium">
            Subtotal{' '}
            <span className="text-text-light">({cart?.totalItems || 0} items)</span>
          </span>
          <span className="text-sm font-bold text-text-primary">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-primary font-medium flex items-center gap-1.5">
              <FiGift className="text-xs" />
              Discount
            </span>
            <span className="text-sm font-bold text-primary">
              -{formatCurrency(discount)}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-text-secondary font-medium flex items-center gap-1.5">
            <FiTruck className="text-xs text-text-light" />
            Shipping
          </span>
          <span
            className={`text-sm font-bold ${
              shipping === 0 ? 'text-primary' : 'text-text-primary'
            }`}
          >
            {shipping === 0 ? (
              <span className="inline-flex items-center gap-1">
                <span
                  className="px-2 py-0.5 bg-primary-100 text-primary text-[10px] font-bold 
                             rounded-full uppercase tracking-wider"
                >
                  Free
                </span>
              </span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        {/* Free Shipping Progress */}
        {subtotal < 1000 && subtotal > 0 && (
          <div className="bg-bg-secondary rounded-xl p-3.5 border border-border-light">
            <div className="flex items-center gap-2 mb-2">
              <FiTruck className="text-primary text-sm flex-shrink-0" />
              <p className="text-xs text-text-secondary leading-relaxed">
                Add{' '}
                <span className="font-bold text-primary">
                  {formatCurrency(freeShippingRemaining)}
                </span>{' '}
                more for{' '}
                <span className="font-bold text-primary">free shipping!</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full 
                         transition-all duration-700 ease-out relative"
                style={{ width: `${freeShippingProgress}%` }}
              >
                {/* Shimmer Effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                             animate-[shimmer_2s_infinite]"
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Free shipping achieved message */}
        {subtotal >= 1000 && (
          <div className="bg-primary-50 rounded-xl p-3 border border-primary-200 flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-primary-dark">
              You've unlocked free shipping!
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t-2 border-dashed border-border-light my-1"></div>

        {/* Total */}
        <div
          className="flex items-center justify-between py-3 bg-bg-secondary rounded-xl px-4 
                     border border-border-light"
        >
          <span className="text-base font-bold text-text-primary">Total</span>
          <span className="text-xl sm:text-2xl font-extrabold text-primary">
            {formatCurrency(total)}
          </span>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div
            className="flex items-center gap-2 bg-bg-secondary rounded-lg p-2.5 
                       border border-border-light"
          >
            <FiShield className="text-primary text-sm flex-shrink-0" />
            <span className="text-[10px] sm:text-xs text-text-light font-medium leading-tight">
              Secure Payment
            </span>
          </div>
          <div
            className="flex items-center gap-2 bg-bg-secondary rounded-lg p-2.5 
                       border border-border-light"
          >
            <FiTruck className="text-primary text-sm flex-shrink-0" />
            <span className="text-[10px] sm:text-xs text-text-light font-medium leading-tight">
              Fast Delivery
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;