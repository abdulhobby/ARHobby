import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import { FiPackage } from 'react-icons/fi';

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-bg-primary rounded-2xl border-2 border-border-light p-8">
        <EmptyState
          icon={<FiPackage />}
          title="No Products Found"
          message="Try adjusting your filters or search query to find what you're looking for."
          actionText="Browse All Products"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
      {products.map((product, index) => (
        <div
          key={product._id}
          className="animate-[fadeIn_0.5s_ease-out_both]"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;