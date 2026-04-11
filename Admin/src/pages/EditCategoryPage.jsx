// EditCategoryPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoryById, updateCategory, clearCategory, clearSuccess, clearError } from '../features/categories/adminCategorySlice';
import CategoryForm from '../components/categories/CategoryForm';
import Loader from '../components/common/Loader';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EditCategoryPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category, loading, success, error } = useSelector((state) => state.adminCategory);

  useEffect(() => {
    dispatch(fetchCategoryById(id));
    return () => {
      dispatch(clearCategory());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success('Category updated successfully');
      dispatch(clearSuccess());
      navigate('/categories');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch, navigate]);

  const handleSubmit = (formData) => {
    dispatch(updateCategory({ id, formData }));
  };

  if (loading && !category) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/categories"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Edit Category
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update category information
          </p>
        </div>
      </div>

      {/* Form */}
      {category && (
        <CategoryForm 
          initialData={category} 
          onSubmit={handleSubmit} 
          loading={loading} 
        />
      )}
    </div>
  );
};

export default EditCategoryPage;