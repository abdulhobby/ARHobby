// CartPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCart } from '../features/cart/cartSlice';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import SEO from '../components/common/SEO';
import { 
  FiShoppingCart, 
  FiArrowRight, 
  FiArrowLeft, 
  FiShield, 
  FiTruck, 
  FiRefreshCw,
  FiLock,
  FiPackage
} from 'react-icons/fi';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) return <Loader />;

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-bg-secondary py-8 sm:py-12 px-4">
        <SEO title="Cart" />
        <div className="max-w-2xl mx-auto">
          <EmptyState
            icon={<FiShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />}
            title="Your Cart is Empty"
            message="Looks like you haven't added any items to your cart yet. Start exploring our collection of rare currencies and coins."
            actionText="Start Shopping"
            actionLink="/shop"
          />
        </div>
      </div>
    );
  }

  const features = [
    { icon: FiShield, text: "100% Authentic" },
    { icon: FiTruck, text: "Secure Shipping" },
    { icon: FiRefreshCw, text: "Easy Returns" },
    { icon: FiLock, text: "Secure Checkout" }
  ];

  return (
    <div className="min-h-screen bg-bg-secondary pb-24 lg:pb-8">
      <SEO title="Shopping Cart" />
      
      {/* Header */}
      <div className="bg-white border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <FiShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Shopping Cart</h1>
                <p className="text-sm text-text-light">
                  {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart
                </p>
              </div>
            </div>
            
            {/* Trust Badges - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-sm text-text-secondary">
                    <IconComponent className="w-4 h-4 text-primary" />
                    <span>{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Cart Items Section */}
          <div className="flex-1 min-w-0">
            {/* Items Header */}
            <div className="hidden sm:flex items-center justify-between p-4 bg-primary-50 rounded-t-2xl border border-primary-100">
              <span className="text-sm font-semibold text-primary">Product</span>
              <div className="flex items-center gap-16">
                <span className="text-sm font-semibold text-primary">Quantity</span>
                <span className="text-sm font-semibold text-primary w-24 text-right">Total</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-2xl sm:rounded-t-none border border-border-light sm:border-t-0 shadow-sm divide-y divide-border-light">
              {cart.items.map((item, index) => (
                <div 
                  key={item._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>

            {/* Continue Shopping Link */}
            <div className="mt-4 sm:mt-6">
              <Link 
                to="/shop"
                className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors cursor-pointer group"
              >
                <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
              </Link>
            </div>

            {/* Trust Badges - Mobile */}
            <div className="flex lg:hidden flex-wrap items-center justify-center gap-4 mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-sm text-text-secondary">
                    <IconComponent className="w-4 h-4 text-primary" />
                    <span>{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary Section - No sticky positioning to prevent overlap */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="space-y-4 sm:space-y-6">
              {/* Cart Summary */}
              <CartSummary cart={cart} />

              {/* Action Buttons - Moved outside sticky container */}
              <div className="bg-white rounded-2xl border border-border-light shadow-sm p-4 sm:p-6 space-y-3">
                <Link 
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] group text-lg"
                >
                  <FiLock className="w-5 h-5" />
                  Proceed to Checkout
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/shop"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-xl border-2 border-primary cursor-pointer transition-all duration-300 hover:bg-primary-50 active:scale-[0.98]"
                >
                  <FiPackage className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </div>

              {/* Security Note */}
              <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-xl border border-primary-100">
                <FiShield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Secure Checkout</p>
                  <p className="text-xs text-text-light mt-1">
                    Your payment information is processed securely. We do not store credit card details.
                  </p>
                </div>
              </div>

              {/* Help Section */}
              <div className="text-center">
                <p className="text-sm text-text-light">
                  Need help? <Link to="/contact" className="text-primary font-medium hover:underline cursor-pointer">Contact us</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-border-light shadow-lg p-4 z-40">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <p className="text-xs text-text-light">Total Amount</p>
            <p className="text-xl font-bold text-primary">
              ₹{cart.totalAmount?.toLocaleString() || '0'}
            </p>
          </div>
          <Link 
            to="/checkout"
            className="flex-1 max-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark active:scale-95"
          >
            Checkout
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-24 lg:hidden"></div>
    </div>
  );
};

export default CartPage;