// AddProductPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct, clearSuccess, clearError } from '../features/products/adminProductSlice';
import ProductForm from '../components/products/ProductForm';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.adminProduct);

  useEffect(() => {
    if (success) {
      toast.success('Product created successfully');
      dispatch(clearSuccess());
      navigate('/products');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch, navigate]);

  const handleSubmit = (formData) => {
    dispatch(createProduct(formData));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Add New Product
          </h1>
          <p className="text-sm text-gray-500 mt-1">Add a new product to your inventory</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default AddProductPage;