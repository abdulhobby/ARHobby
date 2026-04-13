// OrderSuccessPage.jsx (Fixed - Removed duplicate success header)
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../features/order/orderSlice';
import OrderSuccess from '../components/checkout/OrderSuccess';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';
import { FiPackage, FiHome, FiShoppingBag } from 'react-icons/fi';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, bankDetails, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [id, dispatch]);

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <SEO title="Order Placed" />
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-text-secondary">Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-bg-secondary">
      <SEO title="Order Placed Successfully" />

      {/* Simple Success Header - Single instance only */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
            Thank You for Your Order! 🎉
          </h1>
          <p className="mt-2 text-text-secondary">
            Order #{order.orderNumber} has been placed successfully
          </p>
        </div>
      </div>

      {/* Order Success Component - Contains payment details */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <OrderSuccess order={order} bankDetails={bankDetails} />
      </div>
    </div>
  );
};

export default OrderSuccessPage;