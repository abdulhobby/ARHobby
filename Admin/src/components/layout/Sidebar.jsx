// Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiGrid, FiShoppingBag, FiTag, FiUsers, FiMail, FiX } from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/products', icon: <FiPackage />, label: 'Products' },
    { path: '/categories', icon: <FiGrid />, label: 'Categories' },
    { path: '/carts', icon: <FiGrid />, label: 'Carts' },
    { path: '/orders', icon: <FiShoppingBag />, label: 'Orders' },
    { path: '/coupons', icon: <FiTag />, label: 'Coupons' },
    { path: '/users', icon: <FiUsers />, label: 'Users' },
    { path: '/contacts', icon: <FiMail />, label: 'Contacts' },
    { path: '/campaigns', icon: <FiMail />, label: 'Campaigns' },
    { path: '/subscribers', icon: <FiMail />, label: 'Subscribers' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-black text-white z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
        border-r border-gray-800
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-800 relative">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AR Hobby
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">Admin Panel</p>
          
          {/* Close button - mobile only */}
          <button 
            onClick={onClose}
            className="lg:hidden absolute top-6 right-6 p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label="Close sidebar"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 cursor-pointer
                    group relative overflow-hidden
                    ${isActive(item.path)
                      ? 'bg-white text-black font-medium shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <span className={`
                    text-xl transition-transform duration-200
                    ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive(item.path) && (
                    <span className="absolute right-2 w-1.5 h-1.5 bg-black rounded-full"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="px-4 py-3 bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-400">Version 1.0.0</p>
            <p className="text-xs text-gray-500 mt-1">© 2024 AR Hobby</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;