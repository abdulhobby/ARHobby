import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/order/orderSlice';
import OrderCard from '../components/order/OrderCard';
import Pagination from '../components/common/Pagination';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import SEO from '../components/common/SEO';
import { FiPackage, FiFilter, FiSearch, FiShoppingBag } from 'react-icons/fi';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, totalOrders, page, pages, loading } = useSelector((state) => state.order);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchMyOrders({ page: currentPage, status: filterStatus !== 'all' ? filterStatus : undefined }));
  }, [dispatch, currentPage, filterStatus]);

  const statusFilters = [
    { value: 'all', label: 'All Orders' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  const filteredOrders = orders.filter(order => 
    searchQuery === '' || 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-bg-secondary py-5">
      <SEO title="My Orders" />
      
      {/* Page Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl 
                            flex items-center justify-center shadow-lg shadow-primary/20">
                <FiPackage className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My Orders</h1>
                <p className="text-text-secondary mt-1">
                  {totalOrders} {totalOrders === 1 ? 'order' : 'orders'} placed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <ProfileSidebar />
            </div>
          </aside>

          {/* Orders Content */}
          <main className="flex-1 min-w-0">
            
            {/* Filters & Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-4 sm:p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                    <input
                      type="text"
                      placeholder="Search by order number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-bg-secondary
                               text-text-primary placeholder:text-text-light transition-all duration-300
                               focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20
                               focus:bg-white"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <FiFilter className="w-5 h-5 text-text-light hidden sm:block" />
                  <div className="flex flex-wrap gap-2">
                    {statusFilters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => {
                          setFilterStatus(filter.value);
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 
                                  cursor-pointer whitespace-nowrap
                                  ${filterStatus === filter.value 
                                    ? 'bg-primary text-white shadow-md shadow-primary/30' 
                                    : 'bg-bg-secondary text-text-secondary hover:bg-primary/10 hover:text-primary'
                                  }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-border p-12">
                <Loader />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-border">
                <EmptyState
                  icon={
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 
                                  rounded-full flex items-center justify-center mx-auto">
                      <FiPackage className="w-12 h-12 text-primary" />
                    </div>
                  }
                  title="No Orders Found"
                  message={
                    searchQuery 
                      ? `No orders match "${searchQuery}"`
                      : filterStatus !== 'all'
                        ? `No ${filterStatus.toLowerCase()} orders found`
                        : "You haven't placed any orders yet. Start shopping to see your orders here."
                  }
                  actionText="Start Shopping"
                  actionLink="/shop"
                  actionIcon={<FiShoppingBag className="w-5 h-5" />}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Results Info */}
                <div className="flex items-center justify-between text-sm text-text-secondary px-1">
                  <span>
                    Showing {filteredOrders.length} of {totalOrders} orders
                  </span>
                  {pages > 1 && (
                    <span>
                      Page {page} of {pages}
                    </span>
                  )}
                </div>

                {/* Order Cards */}
                <div className="space-y-4">
                  {filteredOrders.map((order, index) => (
                    <div 
                      key={order._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <OrderCard order={order} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination 
                      page={page} 
                      pages={pages} 
                      onPageChange={setCurrentPage} 
                    />
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;