// CouponsPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCoupons, deleteCoupon } from '../features/coupons/adminCouponSlice';
import ConfirmModal from '../components/common/ConfirmModal';
import Loader from '../components/common/Loader';
import { formatCurrency, formatDate } from '../utils/helpers';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiPercent, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CouponsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coupons, loading } = useSelector((state) => state.adminCoupon);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleDelete = () => {
    dispatch(deleteCoupon(deleteModal.id))
      .unwrap()
      .then(() => toast.success('Coupon deleted successfully'))
      .catch((err) => toast.error(err));
    setDeleteModal({ open: false, id: null });
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Coupons
            <span className="ml-3 text-lg font-normal text-gray-500">({coupons.length})</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage discount codes and promotions</p>
        </div>
        <Link
          to="/coupons/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg font-medium"
        >
          <FiPlus className="w-5 h-5" />
          Add Coupon
        </Link>
      </div>

      {/* Coupons Grid - Mobile View */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {coupons.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <FiTag className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">No coupons found</p>
              <p className="text-xs text-gray-400 mt-1">Create your first coupon to offer discounts</p>
            </div>
          </div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm font-bold bg-black text-white px-3 py-1 rounded">
                      {coupon.code}
                    </code>
                    {!coupon.isActive && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        Inactive
                      </span>
                    )}
                    {isExpired(coupon.endDate) && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                        Expired
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {coupon.type === 'percentage' ? (
                      <>
                        <FiPercent className="w-4 h-4" />
                        <span className="font-semibold text-gray-900">{coupon.value}% OFF</span>
                      </>
                    ) : (
                      <>
                        <FiDollarSign className="w-4 h-4" />
                        <span className="font-semibold text-gray-900">{formatCurrency(coupon.value)} OFF</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/coupons/edit/${coupon._id}`)}
                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, id: coupon._id })}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-gray-600">
                {coupon.minOrderAmount && (
                  <p>Min Order: <span className="font-medium text-gray-900">{formatCurrency(coupon.minOrderAmount)}</span></p>
                )}
                <p>Used: <span className="font-medium text-gray-900">{coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</span></p>
                <p>Valid: <span className="font-medium text-gray-900">{formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}</span></p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Coupons Table - Desktop View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Min Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Used
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-gray-100 rounded-full mb-4">
                        <FiTag className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">No coupons found</p>
                      <p className="text-xs text-gray-400 mt-1">Create your first coupon to offer discounts</p>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm font-bold bg-black text-white px-3 py-1 rounded">
                        {coupon.code}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {coupon.type === 'percentage' ? (
                          <>
                            <FiPercent className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Percentage</span>
                          </>
                        ) : (
                          <>
                            <FiDollarSign className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Fixed</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {coupon.type === 'percentage' 
                          ? `${coupon.value}%` 
                          : formatCurrency(coupon.value)
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {coupon.minOrderAmount ? formatCurrency(coupon.minOrderAmount) : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {coupon.usedCount}
                        {coupon.usageLimit && (
                          <span className="text-gray-500">/{coupon.usageLimit}</span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600">
                        <p className="font-medium text-gray-900">{formatDate(coupon.startDate)}</p>
                        <p className="text-gray-500">{formatDate(coupon.endDate)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          coupon.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {isExpired(coupon.endDate) && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Expired
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/coupons/edit/${coupon._id}`)}
                          className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
                          aria-label="Edit coupon"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: coupon._id })}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                          aria-label="Delete coupon"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
};

export default CouponsPage;