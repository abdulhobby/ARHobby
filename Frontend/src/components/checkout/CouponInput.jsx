// CouponInput.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyCoupon, removeCoupon, clearCouponError } from '../../features/coupon/couponSlice';
import { formatCurrency } from '../../utils/helpers';
import { FiTag, FiX, FiCheck, FiPercent, FiGift } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CouponInput = ({ orderAmount }) => {
  const [code, setCode] = useState('');
  const dispatch = useDispatch();
  const { appliedCoupon, loading, error } = useSelector((state) => state.coupon);

  const handleApply = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    dispatch(applyCoupon({ code: code.trim(), orderAmount }))
      .unwrap()
      .then((data) => toast.success(data.message))
      .catch((err) => toast.error(err));
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
    setCode('');
    toast.success('Coupon removed');
  };

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-border-green/30">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
          <FiTag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-text-primary">Coupon Code</h3>
          <p className="text-xs sm:text-sm text-text-light">Apply coupon for extra savings</p>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {appliedCoupon ? (
          /* Applied Coupon State */
          <div className="animate-fade-in">
            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border-2 border-primary border-dashed">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <FiGift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-lg tracking-wider">
                      {appliedCoupon.code}
                    </span>
                    <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <FiCheck className="w-3 h-3" />
                      Applied
                    </span>
                  </div>
                  <span className="text-primary-dark font-semibold text-sm">
                    You save {formatCurrency(appliedCoupon.discount)}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleRemove}
                className="p-2.5 rounded-xl text-error hover:bg-error/10 cursor-pointer transition-all duration-300 group"
                title="Remove coupon"
              >
                <FiX className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            
            {/* Savings Badge */}
            <div className="mt-3 flex items-center justify-center gap-2 py-2 px-4 bg-primary-100 rounded-lg">
              <FiPercent className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary-dark">
                Coupon discount will be applied at checkout
              </span>
            </div>
          </div>
        ) : (
          /* Input State */
          <form onSubmit={handleApply} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light">
                  <FiTag className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    if (error) dispatch(clearCouponError());
                  }}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border bg-bg-secondary text-text-primary placeholder:text-text-light font-medium tracking-wider uppercase transition-all duration-300 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !code.trim()}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-primary text-white font-semibold cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:shadow-none flex items-center justify-center gap-2 min-w-[120px]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Applying...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    Apply
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg animate-slide-down">
                <FiX className="w-4 h-4 text-error flex-shrink-0" />
                <p className="text-sm text-error font-medium">{error}</p>
              </div>
            )}

            {/* Hint */}
            <p className="text-xs text-text-light text-center pt-1">
              Enter your coupon code above to get exclusive discounts
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default CouponInput;