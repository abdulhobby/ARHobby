// DashboardPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../features/dashboard/dashboardSlice';
import StatCard from '../components/common/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentOrders from '../components/dashboard/RecentOrders';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/helpers';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiGrid, FiAlertCircle, FiCheck, FiClock } from 'react-icons/fi';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading || !stats) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={<FiDollarSign />} 
          color="black"
        />
        <StatCard 
          title="Verified Revenue" 
          value={formatCurrency(stats.verifiedRevenue)} 
          icon={<FiCheck />} 
          color="green"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<FiShoppingBag />} 
          color="black"
        />
        <StatCard 
          title="Pending Orders" 
          value={stats.pendingOrders} 
          icon={<FiClock />} 
          color="yellow"
        />
        <StatCard 
          title="Delivered Orders" 
          value={stats.deliveredOrders} 
          icon={<FiCheck />} 
          color="green"
        />
        <StatCard 
          title="Total Products" 
          value={stats.activeProducts} 
          icon={<FiPackage />} 
          color="black"
        />
        <StatCard 
          title="Categories" 
          value={stats.totalCategories} 
          icon={<FiGrid />} 
          color="purple"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<FiUsers />} 
          color="blue"
        />
        <StatCard 
          title="Out of Stock" 
          value={stats.outOfStockProducts} 
          icon={<FiAlertCircle />} 
          color="red"
        />
        <StatCard 
          title="Cancelled" 
          value={stats.cancelledOrders} 
          icon={<FiAlertCircle />} 
          color="red"
        />
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart monthlyRevenue={stats.monthlyRevenue} />
        </div>
        <div className="xl:col-span-1">
          <RecentOrders orders={stats.recentOrders} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;