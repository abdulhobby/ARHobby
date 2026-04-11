// StatCard.jsx
const StatCard = ({ title, value, icon, color = 'black' }) => {
  // Color variants
  const colorClasses = {
    black: 'bg-black text-white',
    gray: 'bg-gray-700 text-white',
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    red: 'bg-red-600 text-white',
    yellow: 'bg-yellow-500 text-white',
    purple: 'bg-purple-600 text-white',
  };

  const bgColorClasses = {
    black: 'bg-black/5',
    gray: 'bg-gray-100',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    yellow: 'bg-yellow-50',
    purple: 'bg-purple-50',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={`
          flex items-center justify-center w-12 h-12 rounded-lg
          ${colorClasses[color] || colorClasses.black}
          group-hover:scale-110 transition-transform duration-200
        `}>
          <div className="text-xl">
            {icon}
          </div>
        </div>

        {/* Decorative element */}
        <div className={`
          w-20 h-20 rounded-full opacity-10
          ${bgColorClasses[color] || bgColorClasses.black}
          absolute -top-4 -right-4 blur-2xl
        `}></div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600 mb-1">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </h3>
      </div>

      {/* Bottom accent */}
      <div className={`
        h-1 w-0 group-hover:w-full rounded-full mt-4
        ${colorClasses[color] || colorClasses.black}
        transition-all duration-300
      `}></div>
    </div>
  );
};

export default StatCard;