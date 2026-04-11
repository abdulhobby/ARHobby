// AddCategoryPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createCategory, clearSuccess, clearError } from '../features/categories/adminCategorySlice';
import CategoryForm from '../components/categories/CategoryForm';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AddCategoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.adminCategory);

  useEffect(() => {
    if (success) {
      toast.success('Category created successfully');
      dispatch(clearSuccess());
      navigate('/categories');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch, navigate]);

  const handleSubmit = (formData) => {
    dispatch(createCategory(formData));
  };

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
            Add New Category
          </h1>
          <p className="text-sm text-gray-500 mt-1">Create a new product category</p>
        </div>
      </div>

      {/* Form */}
      <CategoryForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default AddCategoryPage;