import { useState } from 'react';
import { MenuIcon, XIcon, User, LogOut, Home, Settings, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.jpg';

export default function LoggedInNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const navlinks = [
    {
      href: '#',
      text: 'Home',
      id: 'home',
      icon: Home,
      onClick: () => navigate('/home'),
    },
    {
      href: '#',
      text: 'Explore',
      id: 'explore',
      icon: BookOpen,
      onClick: () => navigate('/explore'),
    },
    {
      href: '#',
      text: 'Upcoming Cohorts',
      id: 'upcoming-cohorts',
      icon: Settings,
      onClick: () => navigate('/upcoming-cohorts'),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowUserMenu(false);
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  const handleHome = () => {
    navigate('/home');
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-700"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 70, mass: 1 }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate('/home')}
          className="mr-20 flex-5 cursor-pointer hover:opacity-80 transition"
        >
          <img src={Logo} alt="logo" width="50%" height="10px" />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 transition duration-500 flex-1">
          {navlinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={link.onClick}
                className="text-slate-300 hover:text-white transition duration-300 font-medium flex items-center gap-2 group"
              >
                <Icon className="w-4 h-4 group-hover:text-blue-400 transition" />
                {link.text}
              </button>
            );
          })}
        </div>

        {/* User Menu - Desktop */}
        <div className="hidden lg:flex items-center space-x-4 ml-8">
          <div className="relative inline-block">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition text-white rounded-md font-medium flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              {user.fullName?.split(' ')[0] || 'User'}
            </motion.button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-50"
              >
                <div className="p-4 border-b border-slate-700">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Signed in as</p>
                  <p className="font-semibold text-white mt-1">{user.fullName}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>

                <button
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-3 hover:bg-slate-800 transition text-slate-200 font-medium flex items-center gap-3 border-b border-slate-700"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  View Profile
                </button>

                <button
                  onClick={() => navigate('/home')}
                  className="w-full text-left px-4 py-3 hover:bg-slate-800 transition text-slate-200 font-medium flex items-center gap-3 border-b border-slate-700"
                >
                  <Home className="w-4 h-4 text-blue-400" />
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-slate-800 transition text-red-400 font-medium flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden active:scale-90 transition"
        >
          <MenuIcon className="size-6 text-white" />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className={`fixed inset-0 z-[100] bg-black/90 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-all duration-400 ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {navlinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              onClick={() => {
                link.onClick();
                setIsMenuOpen(false);
              }}
              className="text-white hover:text-blue-400 transition duration-300 font-medium text-xl flex items-center gap-2"
            >
              <Icon className="w-5 h-5" />
              {link.text}
            </button>
          );
        })}

        <div className="border-t border-slate-700 pt-8 w-full max-w-xs">
          <div className="p-4 bg-slate-800 rounded-lg mb-4 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Signed in as</p>
            <p className="font-semibold text-white mt-1">{user.fullName}</p>
          </div>

          <button
            onClick={handleProfile}
            className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 transition text-white rounded-md active:scale-95 font-medium flex items-center gap-2 justify-center mb-2"
          >
            <User className="w-4 h-4" />
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-red-600/20 hover:bg-red-600/30 transition text-red-400 rounded-md active:scale-95 font-medium flex items-center gap-2 justify-center border border-red-600/50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <button
          onClick={() => setIsMenuOpen(false)}
          className="active:ring-3 active:ring-white absolute top-6 right-6 aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
        >
          <XIcon />
        </button>
      </motion.div>
    </>
  );
}
