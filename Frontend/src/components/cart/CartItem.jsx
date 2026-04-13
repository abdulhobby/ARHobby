// CartItem.jsx
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCartItem, removeFromCart } from '../../features/cart/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import { FiMinus, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useState } from 'react';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > (item.product?.stock || 99)) {
      toast.error(`Only ${item.product?.stock} items available`);
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(
        updateCartItem({ productId: item.product._id, quantity: newQuantity })
      ).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await dispatch(removeFromCart(item.product._id)).unwrap();
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err || 'Failed to remove item');
    }
  };

  const itemTotal = (item.price || 0) * (item.quantity || 0);

  return (
    <div className="group bg-white hover:bg-gray-50/50 transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 relative">

        {/* Remove Button - Top Right Corner */}
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 sm:relative sm:top-0 sm:right-0
                   w-8 h-8 flex items-center justify-center rounded-full
                   bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700
                   border border-red-200 hover:border-red-300
                   cursor-pointer transition-all duration-300
                   shadow-sm hover:shadow-md z-10
                   sm:w-10 sm:h-10"
          title="Remove item"
        >
          <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Product Image */}
        <Link
          to={`/product/${item.product?.slug}`}
          className="flex-shrink-0 cursor-pointer group/image"
        >
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
            <img
              src={item.product?.images?.[0]?.url || '/placeholder.png'}
              alt={item.product?.name}
              className="w-full h-full object-cover transition-transform duration-500 
                       group-hover/image:scale-110"
              loading="lazy"
            />
            {item.product?.stockStatus === 'Out of Stock' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xs font-bold">Out of Stock</span>
              </div>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Product Name & Price */}
          <div className="flex-1 mb-3">
            <Link
              to={`/product/${item.product?.slug}`}
              className="cursor-pointer"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 hover:text-primary 
                         transition-colors duration-300 line-clamp-2 leading-snug mb-2">
                {item.product?.name}
              </h3>
            </Link>

            {/* Mobile Price Display */}
            <div className="sm:hidden flex items-baseline gap-2 mb-2">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(item.price)}
              </span>
              {item.product?.comparePrice > item.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(item.product.comparePrice)}
                </span>
              )}
            </div>

            {/* Product Meta Info */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              {item.product?.category && (
                <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                  {item.product.category.name}
                </span>
              )}
              {item.product?.condition && (
                <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                  {item.product.condition}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Row: Quantity, Total, Remove (Desktop) */}
          <div className="flex items-center justify-between gap-4 flex-wrap mt-auto">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-sm">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center 
                          cursor-pointer transition-all duration-200
                          ${(item.quantity <= 1 || isUpdating)
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-primary hover:text-white'
                  }`}
              >
                <FiMinus className="text-xs sm:text-sm" />
              </button>

              <span className="w-10 sm:w-12 h-9 sm:h-10 flex items-center justify-center 
                           text-sm font-semibold text-gray-900 bg-white 
                           border-x border-gray-200">
                {isUpdating ? '...' : item.quantity}
              </span>

              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center 
                         text-gray-600 hover:bg-primary hover:text-white 
                         cursor-pointer transition-all duration-200"
              >
                <FiPlus className="text-xs sm:text-sm" />
              </button>
            </div>

            {/* Item Total */}
            <div className="text-right flex-1 sm:flex-none">
              <p className="text-xs text-gray-400 mb-0.5 hidden sm:block">Total</p>
              <p className="text-lg sm:text-xl font-extrabold text-primary">
                {formatCurrency(itemTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border Accent */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent 
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>
  );
};

export default CartItem;