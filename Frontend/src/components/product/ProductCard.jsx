// components/product/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import { FiShoppingCart, FiEye, FiClock, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (product.stockStatus === 'Out of Stock') {
      toast.error('Product is out of stock');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
      .unwrap()
      .then(() => toast.success('Added to cart'))
      .catch((err) => toast.error(err));
  };

  const discountPercent =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : 0;

  // ✅ Check if product is marked as new and still valid
  const isNewProduct = product.isNew === true && product.isNewValid !== false;
  const showNewBadge = isNewProduct;
  const remainingTime = product.newRemainingTime;

  return (
    <div
      className="group relative bg-white rounded-2xl border border-gray-200 
                 hover:border-primary/40 shadow-sm hover:shadow-xl 
                 transition-all duration-500 ease-out overflow-hidden
                 transform hover:-translate-y-2"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-square bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <img
            src={product.images?.[0]?.url || '/placeholder.png'}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out
                     group-hover:scale-110 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.stockStatus === 'Out of Stock' && (
              <span className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                Out of Stock
              </span>
            )}
            {discountPercent > 0 && (
              <span className="inline-flex items-center px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                {discountPercent}% OFF
              </span>
            )}
            {/* ✅ Show NEW badge when product.isNew === true */}
            {showNewBadge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                <FiStar className="w-3 h-3" />
                NEW
              </span>
            )}
          </div>

          {/* Quick View Button */}
          <div
            className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 
                     transform translate-y-2 group-hover:translate-y-0 
                     transition-all duration-400"
          >
            <div
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full 
                       flex items-center justify-center shadow-lg
                       hover:bg-primary hover:text-white text-gray-600
                       cursor-pointer transition-all duration-300"
              title="Quick View"
            >
              <FiEye className="text-sm" />
            </div>
          </div>

          {/* Add to Cart Floating Button */}
          {product.stockStatus !== 'Out of Stock' && (
            <div
              className="absolute bottom-3 left-3 right-3 z-10 
                         opacity-0 group-hover:opacity-100 
                         transform translate-y-4 group-hover:translate-y-0 
                         transition-all duration-400 delay-75"
            >
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl 
                         text-xs sm:text-sm font-bold cursor-pointer transition-all duration-300
                         shadow-xl bg-primary hover:bg-primary-dark text-white"
              >
                <FiShoppingCart className="text-sm" />
                Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
          )}
          
          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 
                    group-hover:text-primary transition-colors duration-300 
                    leading-snug mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-extrabold text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
          
          {/* ✅ Show remaining time if available and product is new */}
          {showNewBadge && remainingTime && (
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <FiClock className="w-3 h-3" />
              <span className="font-medium">{remainingTime}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Mobile Add to Cart */}
      {product.stockStatus !== 'Out of Stock' && (
        <div className="px-4 pb-4 lg:hidden">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl 
                     text-xs sm:text-sm font-bold cursor-pointer transition-all duration-300
                     bg-primary hover:bg-primary-dark text-white shadow-md"
          >
            <FiShoppingCart className="text-sm" />
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;