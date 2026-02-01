import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, BookOpen, Clock, Settings, Home, MessageSquare } from 'lucide-react';

export default function AdminNavbar() {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const adminMenuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: BookOpen,
      label: 'Cohort Control Panel',
      path: '/admin/cohorts',
    },
    {
      icon: MessageSquare,
      label: 'Community Channels',
      path: '/admin/channels',
    },
    {
      icon: Clock,
      label: 'Upcoming Cohorts',
      path: '/admin/upcoming-cohorts',
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/admin/settings',
    },
  ];

  const getCurrentPageLabel = () => {
    const item = adminMenuItems.find(item => item.path === location.pathname);
    return item?.label || 'Admin Panel';
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Page Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">ADMIN PANEL</p>
              <p className="text-sm font-semibold text-white">{getCurrentPageLabel()}</p>
            </div>
          </div>

          {/* Right Section - Navigation Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg font-semibold text-white transition"
            >
              <span>Navigate to</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </motion.button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden"
              >
                {adminMenuItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.a
                      key={item.path}
                      href={item.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setIsDropdownOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 transition ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <div className="text-left flex-1">
                        <p className="text-sm font-semibold">{item.label}</p>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </motion.a>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
