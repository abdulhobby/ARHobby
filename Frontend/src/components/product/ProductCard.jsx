// components/product/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import { FiShoppingCart, FiEye, FiStar } from 'react-icons/fi';
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

  // Generate product schema for each card
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.[0]?.url,
    "description": product.description?.substring(0, 150),
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.price,
      "availability": product.stockStatus === 'In Stock' 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock"
    }
  };

  return (
    <>
      {/* Hidden schema for the product */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      
      <div
        className="group relative bg-transparent rounded-2xl border-2 border-border-light 
                   hover:border-primary/40 shadow-sm hover:shadow-xl 
                   transition-all duration-500 ease-out overflow-hidden
                   transform hover:-translate-y-2"
      >
        <Link to={`/product/${product.slug}`} className="block">
          {/* Image Container */}
          <div className="relative overflow-hidden aspect-square bg-bg-secondary">
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

            {/* Gradient Overlay on Hover */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.stockStatus === 'Out of Stock' && (
                <span
                  className="inline-flex items-center px-3 py-1 bg-error/90 backdrop-blur-sm 
                           text-white text-[10px] sm:text-xs font-bold rounded-full 
                           shadow-lg uppercase tracking-wider"
                >
                  Out of Stock
                </span>
              )}
              {discountPercent > 0 && (
                <span
                  className="inline-flex items-center px-3 py-1 bg-primary/90 backdrop-blur-sm 
                           text-white text-[10px] sm:text-xs font-bold rounded-full 
                           shadow-lg"
                >
                  {discountPercent}% OFF
                </span>
              )}
              {product.isNew && (
                <span
                  className="inline-flex items-center px-3 py-1 bg-success/90 backdrop-blur-sm 
                           text-white text-[10px] sm:text-xs font-bold rounded-full 
                           shadow-lg"
                >
                  New
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
                         hover:bg-primary hover:text-white text-text-secondary
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
                           shadow-xl backdrop-blur-sm bg-primary/90 hover:bg-primary text-white
                           hover:shadow-2xl"
                >
                  <FiShoppingCart className="text-sm" />
                  Add to Cart
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-3 h-3 fill-current text-warning" />
                ))}
              </div>
              <span className="text-xs text-text-light">(127)</span>
            </div>

            {/* Product Name */}
            <h3
              className="text-sm sm:text-base font-bold text-text-primary line-clamp-2 
                      group-hover:text-primary transition-colors duration-300 
                      leading-snug mb-1.5 min-h-[2.5rem]"
            >
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-lg sm:text-xl font-extrabold text-primary">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xs sm:text-sm text-text-light line-through font-medium">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Mobile Add to Cart */}
        {product.stockStatus !== 'Out of Stock' && (
          <div className="px-4 pb-4 sm:px-5 sm:pb-5 lg:hidden">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl 
                       text-xs sm:text-sm font-bold cursor-pointer transition-all duration-300
                       bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg"
            >
              <FiShoppingCart className="text-sm" />
              Add to Cart
            </button>
          </div>
        )}

        {/* Bottom Accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary-light to-primary 
                     transform scale-x-0 group-hover:scale-x-100 transition-transform duration-600 origin-center"
        />
      </div>
    </>
  );
};

export default ProductCard;