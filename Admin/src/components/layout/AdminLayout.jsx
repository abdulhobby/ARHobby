// AdminLayout.jsx - Grid version
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] min-h-screen">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block">
        <Sidebar isOpen={false} onClose={() => {}} />
      </div>
      
      {/* Mobile Sidebar (overlay) */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-sm text-gray-500">
              © 2025 AR Hobby. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors duration-200 cursor-pointer">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors duration-200 cursor-pointer">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;