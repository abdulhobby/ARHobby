// RevenueChart.jsx
import { formatCurrency } from '../../utils/helpers';
import { FiTrendingUp, FiBarChart2 } from 'react-icons/fi';

const RevenueChart = ({ monthlyRevenue }) => {
  if (!monthlyRevenue || monthlyRevenue.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <FiBarChart2 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">No revenue data</p>
          <p className="text-xs text-gray-400 mt-1">Revenue data will appear here</p>
        </div>
      </div>
    );
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FiTrendingUp className="w-5 h-5" />
          Monthly Revenue
        </h3>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-64">
          {monthlyRevenue.map((item) => {
            const heightPercentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
            
            return (
              <div
                key={item._id}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                {/* Bar */}
                <div className="relative w-full flex flex-col justify-end h-48">
                  <div
                    className="w-full bg-gradient-to-t from-black to-gray-700 rounded-t-lg transition-all duration-500 hover:from-gray-800 hover:to-gray-600 cursor-pointer"
                    style={{ height: `${heightPercentage}%`, minHeight: item.revenue > 0 ? '8px' : '0' }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                      <div className="font-bold">{formatCurrency(item.revenue)}</div>
                      <div className="text-gray-300">{item.orders} orders</div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
                    </div>
                  </div>
                </div>

                {/* Month Label */}
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">
                    {months[item._id - 1]}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {formatCurrency(item.revenue)}
                  </p>
                  <p className="text-xs text-gray-400 hidden lg:block">
                    {item.orders} orders
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;