// EditProductPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, updateProduct, clearProduct, clearSuccess, clearError } from '../features/products/adminProductSlice';
import ProductForm from '../components/products/ProductForm';
import Loader from '../components/common/Loader';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EditProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading, success, error } = useSelector((state) => state.adminProduct);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearProduct());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success('Product updated successfully');
      dispatch(clearSuccess());
      navigate('/products');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch, navigate]);

  const handleSubmit = (formData) => {
    dispatch(updateProduct({ id, formData }));
  };

  if (loading && !product) return <Loader />;

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
            Edit Product
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update product information
          </p>
        </div>
      </div>

      {/* Form */}
      {product && (
        <ProductForm 
          initialData={product} 
          onSubmit={handleSubmit} 
          loading={loading} 
        />
      )}
    </div>
  );
};

export default EditProductPage;