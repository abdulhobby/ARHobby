import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../features/category/categorySlice';

const CategorySection = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading)
    return (
      <div className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-64 bg-bg-tertiary rounded-lg"></div>
              <div className="h-4 w-96 bg-bg-tertiary rounded-lg"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-52 bg-bg-tertiary rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-bg-primary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-100/40 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-50/60 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-dark text-xs sm:text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
            Categories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Browse our diverse collection of currencies and coins
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className="group relative bg-bg-primary rounded-2xl border-2 border-border-light 
                       hover:border-primary shadow-sm hover:shadow-xl 
                       transition-all duration-500 ease-out cursor-pointer
                       overflow-hidden transform hover:-translate-y-2"
            >
              {/* Image Container */}
              {category.image?.url && (
                <div className="relative overflow-hidden aspect-square rounded-t-xl">
                  <img
                    src={category.image.url}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 
                             group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              )}

              {/* Content */}
              <div className="p-4 sm:p-5 text-center">
                <h3 className="text-sm sm:text-base font-bold text-text-primary group-hover:text-primary 
                             transition-colors duration-300 mb-1 line-clamp-1">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-text-light font-medium">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    {category.productCount} items
                  </span>
                </p>
              </div>

              {/* Hover Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary transform scale-x-0 
                            group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;