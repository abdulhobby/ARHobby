// NotificationDropdown.jsx
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNewOrders, markOrderViewed, markAllOrdersViewed } from '../../features/orders/adminOrderSlice';
import { formatDateTime, formatCurrency } from '../../utils/helpers';
import { FiBell, FiX, FiShoppingBag, FiCheck } from 'react-icons/fi';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { newOrders, newOrderCount } = useSelector((state) => state.adminOrder);
  const dropdownRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNewOrders());
    intervalRef.current = setInterval(() => {
      dispatch(fetchNewOrders());
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOrderClick = (orderId) => {
    dispatch(markOrderViewed(orderId));
    navigate(`/orders/${orderId}`);
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    dispatch(markAllOrdersViewed());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer group"
        aria-label="Notifications"
      >
        <FiBell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-black transition-colors duration-200" />
        
        {/* Badge */}
        {newOrderCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-black text-white text-xs font-bold rounded-full animate-pulse">
            {newOrderCount > 99 ? '99+' : newOrderCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-black text-white rounded-lg">
                <FiBell className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-gray-800">
                New Orders
                {newOrderCount > 0 && (
                  <span className="ml-2 text-sm text-gray-500">({newOrderCount})</span>
                )}
              </h3>
            </div>
            
            {newOrderCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
              >
                <FiCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {newOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <FiShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No new orders</p>
                <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {newOrders.map((order) => (
                  <div 
                    key={order._id}
                    onClick={() => handleOrderClick(order._id)}
                    className="p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center px-2 py-1 bg-black text-white text-xs font-bold rounded">
                            #{order.orderNumber}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            New
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-black">
                          {order.user?.name || 'Guest User'}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-base font-bold text-black">
                            {formatCurrency(order.totalAmount)}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(order.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Right indicator */}
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-black rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {newOrders.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => {
                  navigate('/orders');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-sm font-medium text-center text-black hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                View all orders
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;