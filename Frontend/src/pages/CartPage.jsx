// CartPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, clearCart } from '../features/cart/cartSlice';
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
  FiPackage,
  FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      dispatch(clearCart())
        .unwrap()
        .then(() => toast.success('Cart cleared successfully'))
        .catch((err) => toast.error(err || 'Failed to clear cart'));
    }
  };

  const handleProceedToCheckout = () => {
    // Store cart data in sessionStorage before navigating
    if (cart && cart.items && cart.items.length > 0) {
      const checkoutData = {
        items: cart.items,
        subtotal: cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        timestamp: Date.now()
      };
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      navigate('/checkout');
    } else {
      toast.error('Your cart is empty');
    }
  };

  if (loading) return <Loader />;

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 sm:py-12 px-4">
        <SEO title="Cart - Empty" />
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

  // Calculate correct totals
  const subtotal = cart.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const totalItems = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const shipping = subtotal >= 1500 ? 0 : 79;
  const total = subtotal + shipping;

  const features = [
    { icon: FiShield, text: "100% Authentic" },
    { icon: FiTruck, text: "Secure Shipping" },
    { icon: FiRefreshCw, text: "Easy Returns" },
    { icon: FiLock, text: "Secure Checkout" }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white pb-24 lg:pb-8 py-5">
      <SEO title="Shopping Cart" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
                <FiShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-sm text-gray-500">
                  {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
                </p>
              </div>
            </div>

            {/* Clear Cart Button */}
            <button
              onClick={handleClearCart}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 
                       text-red-600 rounded-xl font-medium transition-all duration-300 
                       cursor-pointer border border-red-200 hover:border-red-300
                       shadow-sm hover:shadow-md"
            >
              <FiTrash2 className="w-4 h-4" />
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Cart Items Section */}
          <div className="flex-1 min-w-0">
            {/* Items Header */}
            <div className="hidden md:flex items-center justify-between p-4 bg-primary-50 rounded-t-2xl border border-primary-100">
              <span className="text-sm font-semibold text-primary">Product Details</span>
              <div className="flex items-center gap-12">
                <span className="text-sm font-semibold text-primary w-32 text-center">Quantity</span>
                <span className="text-sm font-semibold text-primary w-28 text-right">Total</span>
                <span className="text-sm font-semibold text-primary w-12 text-center">Action</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-2xl md:rounded-t-none border border-gray-200 md:border-t-0 shadow-sm divide-y divide-gray-100">
              {cart.items.map((item, index) => (
                <div
                  key={item.product?._id || index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>

            {/* Continue Shopping Link */}
            <div className="mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-all duration-300 cursor-pointer group"
              >
                <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
              </Link>
            </div>

            {/* Trust Badges - Mobile */}
            <div className="flex lg:hidden flex-wrap items-center justify-center gap-4 mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <IconComponent className="w-4 h-4 text-primary" />
                    <span>{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Proceed to Checkout Button - Desktop */}
            <div className="hidden lg:block mt-8">
              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] group text-lg"
              >
                <FiLock className="w-5 h-5" />
                Proceed to Checkout
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Cart Summary Section */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="space-y-4 sm:space-y-6">
              <CartSummary
                subtotal={subtotal}
                totalItems={totalItems}
                shipping={shipping}
                total={total}
                onClearCart={handleClearCart}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 shadow-lg p-4 z-40">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-xl font-bold text-primary">
              ₹{total.toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleProceedToCheckout}
            className="flex-1 max-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            Checkout
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-24 lg:hidden"></div>
    </div>
  );
};

export default CartPage;