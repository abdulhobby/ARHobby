// TopBar.jsx
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../../features/auth/adminAuthSlice';
import NotificationDropdown from './NotificationDropdown';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TopBar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.adminAuth);

  const handleLogout = () => {
    dispatch(adminLogout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label="Open menu"
          >
            <FiMenu className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-gray-800">Welcome back!</h2>
            <p className="text-sm text-gray-500">Manage your store efficiently</p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Dropdown */}
          <NotificationDropdown />

          {/* User Info */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="p-2 bg-black text-white rounded-lg">
              <FiUser className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg group"
            aria-label="Logout"
          >
            <FiLogOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-200" />
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;