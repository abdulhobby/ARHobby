// AddCouponPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createCoupon, clearSuccess, clearError } from '../features/coupons/adminCouponSlice';
import CouponForm from '../components/coupons/CouponForm';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AddCouponPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.adminCoupon);

  useEffect(() => {
    if (success) {
      toast.success('Coupon created successfully');
      dispatch(clearSuccess());
      navigate('/coupons');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch, navigate]);

  const handleSubmit = (data) => {
    dispatch(createCoupon(data));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/coupons"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Add New Coupon
          </h1>
          <p className="text-sm text-gray-500 mt-1">Create a new discount coupon</p>
        </div>
      </div>

      {/* Form */}
      <CouponForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default AddCouponPage;