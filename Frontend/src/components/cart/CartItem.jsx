import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCartItem, removeFromCart } from '../../features/cart/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(
      updateCartItem({ productId: item.product._id, quantity: newQuantity })
    )
      .unwrap()
      .catch((err) => toast.error(err));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.product._id))
      .unwrap()
      .then(() => toast.success('Item removed from cart'))
      .catch((err) => toast.error(err));
  };

  return (
    <div
      className="group bg-bg-primary rounded-2xl border-2 border-border-light hover:border-primary/30 
                 shadow-sm hover:shadow-md transition-all duration-400 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
        {/* Product Image */}
        <Link
          to={`/product/${item.product?.slug}`}
          className="flex-shrink-0 cursor-pointer"
        >
          <div className="relative w-full sm:w-24 md:w-28 aspect-square sm:aspect-square rounded-xl overflow-hidden bg-bg-secondary">
            <img
              src={item.product?.images?.[0]?.url || '/placeholder.png'}
              alt={item.product?.name}
              className="w-full h-full object-cover transition-transform duration-500 
                       group-hover:scale-110"
            />
          </div>
        </Link>

        {/* Product Details & Controls */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Product Name & Price */}
          <div className="flex-1 mb-3 sm:mb-0">
            <Link
              to={`/product/${item.product?.slug}`}
              className="cursor-pointer"
            >
              <h3
                className="text-sm sm:text-base font-bold text-text-primary hover:text-primary 
                           transition-colors duration-300 line-clamp-2 leading-snug mb-1.5"
              >
                {item.product?.name}
              </h3>
            </Link>
            <p className="text-xs sm:text-sm text-text-light font-medium">
              Unit Price:{' '}
              <span className="text-text-secondary font-semibold">
                {formatCurrency(item.price)}
              </span>
            </p>
          </div>

          {/* Bottom Row: Quantity, Total, Remove */}
          <div className="flex items-center justify-between gap-3 flex-wrap mt-auto">
            {/* Quantity Controls */}
            <div className="flex items-center border-2 border-border-light rounded-xl overflow-hidden bg-bg-secondary">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center 
                          cursor-pointer transition-all duration-200
                          ${
                            item.quantity <= 1
                              ? 'text-text-light cursor-not-allowed opacity-50'
                              : 'text-text-secondary hover:bg-primary hover:text-text-white'
                          }`}
              >
                <FiMinus className="text-xs sm:text-sm" />
              </button>

              <span
                className="w-10 sm:w-12 h-9 sm:h-10 flex items-center justify-center 
                           text-sm font-bold text-text-primary bg-bg-primary 
                           border-x-2 border-border-light"
              >
                {item.quantity}
              </span>

              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center 
                         text-text-secondary hover:bg-primary hover:text-text-white 
                         cursor-pointer transition-all duration-200"
              >
                <FiPlus className="text-xs sm:text-sm" />
              </button>
            </div>

            {/* Item Total */}
            <div className="text-right flex-1 sm:flex-none">
              <p className="text-[10px] sm:text-xs text-text-light font-medium mb-0.5 hidden sm:block">
                Total
              </p>
              <p className="text-base sm:text-lg font-extrabold text-primary">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl
                       text-text-light hover:text-error hover:bg-red-50 border-2 border-transparent 
                       hover:border-red-200 cursor-pointer transition-all duration-300 
                       group/del"
              title="Remove item"
            >
              <FiTrash2 className="text-sm sm:text-base group-hover/del:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div
        className="h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent 
                   scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
      ></div>
    </div>
  );
};

export default CartItem;