// CheckoutPage.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchCart } from '../features/cart/cartSlice';
import { createOrder, clearError } from '../features/order/orderSlice';
import { removeCoupon } from '../features/coupon/couponSlice';
import AddressSelector from '../components/checkout/AddressSelector';
import CouponInput from '../components/checkout/CouponInput';
import CartSummary from '../components/cart/CartSummary';
import OrderTerms from '../components/checkout/OrderTerms';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import {
  FiShoppingBag,
  FiLock,
  FiArrowLeft,
  FiPackage,
  FiFileText,
  FiCheckCircle,
  FiShield,
  FiTruck,
  FiCreditCard,
  FiChevronRight,
  FiHome,
  FiAlertCircle
} from 'react-icons/fi';
import { formatCurrency } from '../utils/helpers';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useSelector((state) => state.cart);
  const { loading: orderLoading, error, orderPlaced, order } = useSelector((state) => state.order);
  const { appliedCoupon } = useSelector((state) => state.coupon);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (orderPlaced && order) {
      navigate(`/order-success/${order._id}`);
    }
  }, [orderPlaced, order, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Update step based on completion
  useEffect(() => {
    if (selectedAddress) setCurrentStep(2);
    if (selectedAddress && termsAccepted) setCurrentStep(3);
  }, [selectedAddress, termsAccepted]);

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    // Calculate order totals
    const subtotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const discount = appliedCoupon?.discount || 0;
    const shipping = subtotal >= 1000 ? 0 : 80;
    const total = subtotal - discount + shipping;

    const orderData = {
      shippingAddress: {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        addressLine1: selectedAddress.addressLine1,
        addressLine2: selectedAddress.addressLine2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        country: selectedAddress.country || 'India'
      },
      couponCode: appliedCoupon?.code || '',
      notes,
      termsAccepted,
      items: cart.items.map(item => ({
        product: item.product?._id || item.productId,
        name: item.product?.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product?.images?.[0]?.url
      })),
      subtotal,
      discount,
      shippingCharge: shipping,
      totalAmount: total
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then(() => {
        dispatch(removeCoupon());
        toast.success('Order placed successfully!');
      })
      .catch((err) => {
        toast.error(err || 'Failed to place order');
      });
  };

  if (cartLoading) return <Loader />;

  if (!cart || cart.items?.length === 0) {
    navigate('/cart');
    return null;
  }

  // Calculate totals for display
  const subtotal = cart.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const totalItems = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const discount = appliedCoupon?.discount || 0;
  const shipping = subtotal >= 1000 ? 0 : 80;
  const total = subtotal - discount + shipping;

  const steps = [
    { id: 1, name: 'Address', icon: FiTruck },
    { id: 2, name: 'Review', icon: FiPackage },
    { id: 3, name: 'Payment', icon: FiCreditCard }
  ];

  const canPlaceOrder = selectedAddress && termsAccepted;

  return (
    <div className="bg-bg-secondary py-5">
      <SEO title="Checkout" />

      {/* Header */}
      <div className="bg-white border-b border-border-light sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm py-3 border-b border-border-light">
            <Link to="/" className="flex items-center gap-1 text-text-light hover:text-primary transition-colors cursor-pointer">
              <FiHome className="w-4 h-4" />
            </Link>
            <FiChevronRight className="w-4 h-4 text-border" />
            <Link to="/cart" className="text-text-light hover:text-primary transition-colors cursor-pointer">
              Cart
            </Link>
            <FiChevronRight className="w-4 h-4 text-border" />
            <span className="text-text-primary font-medium">Checkout</span>
          </nav>

          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <FiLock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Secure Checkout</h1>
                  <p className="text-sm text-text-light">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your order</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep >= step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${isActive
                        ? 'bg-primary-50 text-primary'
                        : 'text-text-light'
                        }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                          ? 'bg-primary text-white'
                          : isActive
                            ? 'bg-primary-100 text-primary'
                            : 'bg-gray-100 text-text-light'
                          }`}>
                          {isCompleted ? (
                            <FiCheckCircle className="w-5 h-5" />
                          ) : (
                            <StepIcon className="w-4 h-4" />
                          )}
                        </div>
                        <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-text-light'}`}>
                          {step.name}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mx-1 ${isCompleted ? 'bg-primary' : 'bg-gray-200'}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Left Column - Forms */}
          <div className="flex-1 space-y-6">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors cursor-pointer group"
            >
              <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Cart
            </Link>

            <div className="animate-fade-in">
              <AddressSelector
                selectedAddress={selectedAddress}
                onSelectAddress={setSelectedAddress}
              />
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-border-green/30">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                  <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Order Items</h3>
                  <p className="text-sm text-text-light">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="divide-y divide-border-light">
                {cart.items.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center gap-4 p-4 hover:bg-bg-secondary transition-colors"
                  >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-bg-secondary border border-border-light flex-shrink-0">
                      <img
                        src={item.product?.images?.[0]?.url || '/placeholder.png'}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary text-sm sm:text-base truncate">
                        {item.product?.name}
                      </p>
                      <p className="text-sm text-text-light mt-1">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary inside items */}
              <div className="p-4 bg-gray-50 border-t border-border-light">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-medium text-text-primary">{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="font-medium text-green-600">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-text-primary'}`}>
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="border-t border-border-light pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-text-primary">Total</span>
                      <span className="font-bold text-primary text-lg">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-border-green/30">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                  <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Order Notes</h3>
                  <p className="text-sm text-text-light">Optional instructions</p>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for your order... (e.g., packaging preferences, delivery notes)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bg-secondary text-text-primary placeholder:text-text-light resize-none transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 focus:bg-white"
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <OrderTerms
                accepted={termsAccepted}
                onAcceptChange={setTermsAccepted}
              />
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="lg:sticky lg:top-40 space-y-6">
              <CouponInput orderAmount={subtotal} />

              {/* Cart Summary with calculated values */}
              <CartSummary
                subtotal={subtotal}
                totalItems={totalItems}
                shipping={shipping}
                total={total}
                discount={discount}
              />

              {/* Place Order Button */}
              <div className="bg-white rounded-2xl border border-border-light shadow-sm p-4 sm:p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {!selectedAddress && (
                  <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-xl mb-4">
                    <FiAlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
                    <p className="text-sm text-warning font-medium">Please select a shipping address</p>
                  </div>
                )}
                {selectedAddress && !termsAccepted && (
                  <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-xl mb-4">
                    <FiAlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
                    <p className="text-sm text-warning font-medium">Please accept terms & conditions</p>
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading || !canPlaceOrder}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 cursor-pointer ${canPlaceOrder
                    ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {orderLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <FiLock className="w-5 h-5" />
                      <span>Place Order {formatCurrency(total)}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border-light">
                  <FiShield className="w-4 h-4 text-primary" />
                  <span className="text-sm text-text-light">Secure & Encrypted</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-border-light">
                  <FiShield className="w-5 h-5 text-primary" />
                  <span className="text-xs text-text-secondary">100% Authentic</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-border-light">
                  <FiTruck className="w-5 h-5 text-primary" />
                  <span className="text-xs text-text-secondary">Secure Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-border-light shadow-lg p-4 z-40">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <p className="text-xs text-text-light">Total Amount</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(total)}</p>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={orderLoading || !canPlaceOrder}
            className={`flex-1 max-w-[180px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${canPlaceOrder
              ? 'bg-primary text-white hover:bg-primary-dark active:scale-95'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            {orderLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <FiLock className="w-4 h-4" />
                Place Order
              </>
            )}
          </button>
        </div>
      </div>

      <div className="h-24 lg:hidden"></div>
    </div>
  );
};

export default CheckoutPage;