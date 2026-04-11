import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiUser, FiPackage, FiMapPin, FiChevronRight } from 'react-icons/fi';

const ProfileSidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const links = [
    { path: '/profile', icon: <FiUser />, label: 'Profile' },
    { path: '/orders', icon: <FiPackage />, label: 'My Orders' },
    { path: '/addresses', icon: <FiMapPin />, label: 'Addresses' },
  ];

  return (
    <div
      className="bg-bg-primary rounded-2xl border-2 border-border-light shadow-sm overflow-hidden 
                 sticky top-24"
    >
      {/* Profile Header */}
      <div className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-800 p-6 sm:p-8">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)`,
          }}
        ></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Avatar */}
          {user?.avatar?.url ? (
            <div className="relative mb-4">
              <img
                src={user.avatar.url}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/30 
                         shadow-xl"
              />
              {/* Online Indicator */}
              <div
                className="absolute bottom-1 right-1 w-5 h-5 bg-primary-light border-2 border-white 
                           rounded-full shadow-sm"
              ></div>
            </div>
          ) : (
            <div className="relative mb-4">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/15 backdrop-blur-sm 
                           border-4 border-white/30 flex items-center justify-center shadow-xl"
              >
                <FiUser className="text-3xl sm:text-4xl text-white/90" />
              </div>
              <div
                className="absolute bottom-1 right-1 w-5 h-5 bg-primary-light border-2 border-white 
                           rounded-full shadow-sm"
              ></div>
            </div>
          )}

          {/* User Info */}
          <h3 className="text-lg sm:text-xl font-bold text-text-white mb-1 truncate max-w-full">
            {user?.name}
          </h3>
          <p className="text-white/70 text-xs sm:text-sm truncate max-w-full">
            {user?.email}
          </p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute -bottom-px left-0 right-0">
          <svg viewBox="0 0 400 30" fill="none" className="w-full">
            <path
              d="M0 30V15C50 5 100 0 200 8C300 16 350 5 400 0V30H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 sm:p-4 space-y-1.5">
        {links.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`group flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl 
                        cursor-pointer transition-all duration-300 relative overflow-hidden
                        ${
                          isActive
                            ? 'bg-primary text-text-white shadow-lg shadow-primary/25 font-bold'
                            : 'text-text-secondary hover:bg-primary-50 hover:text-primary font-medium'
                        }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/50 
                             rounded-r-full"
                ></div>
              )}

              {/* Icon */}
              <span
                className={`text-lg flex-shrink-0 transition-transform duration-300 
                           ${isActive ? '' : 'group-hover:scale-110'}`}
              >
                {link.icon}
              </span>

              {/* Label */}
              <span className="text-sm sm:text-base">{link.label}</span>

              {/* Arrow */}
              <FiChevronRight
                className={`ml-auto text-sm transition-all duration-300
                           ${
                             isActive
                               ? 'opacity-80'
                               : 'opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
                           }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2">
        <div className="bg-bg-secondary rounded-xl p-3 sm:p-4 border border-border-light">
          <p className="text-[10px] sm:text-xs text-text-light text-center leading-relaxed">
            Member since{' '}
            <span className="font-semibold text-text-secondary">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;