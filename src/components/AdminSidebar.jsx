import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, UserCheck,X,Clock, LogOut, BookOpen, BarChart3, Settings, MessageSquare } from 'lucide-react';

export default function AdminSidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Sidebar is always open; remove mobile toggle

  const menuItems = [
    {
      icon: BarChart3,
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: BookOpen,
      label: 'Cohorts',
      path: '/admin/cohorts',
    },
    {
      icon: MessageSquare,
      label: 'Community Channels',
      path: '/admin/channels',
    },
    
    {
      icon: Settings,
      label: 'Settings',
      path: '/admin/settings',
    },
  ];

  // Helper to check if a menu item is active
  function isActive(path) {
    return location.pathname === path;
  }

  function handleLogout() {
    if (onLogout) onLogout();
    navigate('/login');
  }

  // Sidebar is always open on desktop, so set isOpen to true
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="sticky top-0 left-0 w-64 min-h-screen bg-slate-900 border-r border-slate-800 z-40 flex flex-col shadow-lg"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow">
              <UserCheck/>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin</h1>
              <p className="text-xs text-slate-400">Control Panel</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-slate-800">
          <p className="text-sm text-slate-400 mb-1">Logged in as</p>
          <p className="font-semibold text-white truncate">{user?.fullName}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-6">
          <ul className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition text-left
                      ${active ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800/70'}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-base">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
