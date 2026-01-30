import { useState } from 'react';
import { MenuIcon, XIcon, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.jpg'

export default function Navbar({ user = null, onLogout = null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  
  const navlinks = [
    {
      href: '#cohorts',
      text: 'Cohorts',
      id: 'cohorts',
    },
    {
      href: '#about',
      text: 'About',
      id: 'about',
    },
    {
      href: '#testimonials',
      text: 'Testimonials',
      id: 'testimonials',
    },
    {
      href: '#contact',
      text: 'Contact',
      id: 'contact',
    },
  ];

  const handleNavClick = (href) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowUserMenu(false);
  };

  const handleProfile = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  const isLoggedIn = !!localStorage.getItem('token');
  const loggedInUser = user || (isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}') : null);
  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-black/30 border-b border-slate-700/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 250, damping: 70, mass: 1 }}
      >
      
        <a href='#' onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className='mr-20 flex-5 cursor-pointer hover:opacity-80 transition'>
          <img src={Logo} alt="logo" width="50%" height="10px" />
        </a>

        <div className="hidden lg:flex items-center gap-8 transition duration-500">
          {navlinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.href)}
              className="text-slate-200 hover:text-white transition duration-300 font-medium"
            >
              {link.text}
            </button>
          ))}
        </div>

        <div className="hidden lg:block space-x-5 ml-8">
          {isLoggedIn && loggedInUser ? (
            <div className="relative inline-block">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition text-white rounded-md active:scale-95 font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                {loggedInUser.fullName?.split(' ')[0]}
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50"
                >
                  <div className="p-4 border-b border-slate-700">
                    <p className="text-sm text-slate-400">Signed in as</p>
                    <p className="font-semibold text-white">{loggedInUser.email}</p>
                  </div>
                  <button
                    onClick={handleProfile}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 transition text-slate-200 font-medium flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 transition text-red-400 font-medium flex items-center gap-2 border-t border-slate-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={handleGetStarted}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md active:scale-95 font-medium"
              >
                Get started
              </button>
              <button 
                onClick={handleLogin}
                className="hover:bg-slate-300/20 transition px-6 py-2 border border-slate-400 rounded-md active:scale-95 font-medium"
              >
                Login
              </button>
            </>
          )}
        </div>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden active:scale-90 transition"
        >
          <MenuIcon className="size-6" />
        </button>
      </motion.nav>
      <motion.div
        className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-all duration-400 ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {navlinks.map((link) => (
          <button
            key={link.id}
            onClick={() => handleNavClick(link.href)}
            className="text-white hover:text-slate-300 transition duration-300 font-medium text-xl"
          >
            {link.text}
          </button>
        ))}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => {
              handleGetStarted();
              setIsMenuOpen(false);
            }}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md active:scale-95 font-medium"
          >
            Get started
          </button>
          <button
            onClick={() => {
              handleLogin();
              setIsMenuOpen(false);
            }}
            className="px-6 py-2 border border-slate-400 hover:bg-slate-300/20 transition rounded-md active:scale-95 font-medium"
          >
            Login
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
