// EditCouponPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCouponById, updateCoupon, clearCoupon, clearSuccess, clearError } from '../features/coupons/adminCouponSlice';
import CouponForm from '../components/coupons/CouponForm';
import Loader from '../components/common/Loader';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EditCouponPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coupon, loading, success, error } = useSelector((state) => state.adminCoupon);

  useEffect(() => {
    dispatch(fetchCouponById(id));
    return () => {
      dispatch(clearCoupon());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success('Coupon updated successfully');
      dispatch(clearSuccess());
      navigate('/coupons');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch, navigate]);

  const handleSubmit = (data) => {
    dispatch(updateCoupon({ id, data }));
  };

  if (loading && !coupon) return <Loader />;

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
            Edit Coupon
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update coupon details
          </p>
        </div>
      </div>

      {/* Form */}
      {coupon && (
        <CouponForm 
          initialData={coupon} 
          onSubmit={handleSubmit} 
          loading={loading} 
        />
      )}
    </div>
  );
};

export default EditCouponPage;