import { useState, useEffect, useRef } from 'react';
import { MenuIcon, XIcon, User, LogOut, Home, BookOpen, Calendar, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.jpg';

const navlinks = [
  { text: 'Home',     id: 'home',             icon: Home,     path: '/home' },
  { text: 'Explore',  id: 'explore',          icon: BookOpen, path: '/explore' },
  { text: 'Upcoming', id: 'upcoming-cohorts', icon: Calendar, path: '/upcoming-cohorts' },
];

export default function LoggedInNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowUserMenu(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  const initials = user.fullName
    ? user.fullName.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 60 }}
        className={`fixed top-0 left-0 right-0 z-50 h-16 px-6 md:px-10 flex items-center justify-between
          bg-[#010409]/95 backdrop-blur-md border-b border-[#21262d] transition-shadow duration-300
          ${scrolled ? 'shadow-xl shadow-black/40' : ''}`}
      >
        {/* ── Logo ── */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2.5 group shrink-0 mr-10"
        >
          <img src={Logo} alt="logo" className="h-40 w-auto opacity-90 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* ── Desktop nav links ── */}
        <div className="hidden lg:flex items-center gap-1 flex-1">
          {navlinks.map(({ id, text, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 group ${
                  active
                    ? 'text-[#58a6ff] bg-[#1f6feb]/8'
                    : 'text-[#7d8590] hover:text-[#c9d1d9] hover:bg-[#161b22]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${active ? 'text-[#58a6ff]' : 'group-hover:text-[#c9d1d9]'}`} />
                {text}
                {active && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1f6feb]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Desktop user menu ── */}
        <div className="hidden lg:flex items-center" ref={dropdownRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all duration-200 group ${
              showUserMenu
                ? 'bg-[#161b22] border-[#30363d]'
                : 'bg-[#0d1117] border-[#21262d] hover:bg-[#161b22] hover:border-[#30363d]'
            }`}
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-lg bg-[#1f6feb]/20 border border-[#1f6feb]/30 flex items-center justify-center text-[11px] font-bold font-mono text-[#58a6ff]">
              {initials}
            </div>
            <span className="text-xs font-mono text-[#c9d1d9] max-w-[100px] truncate">
              {user.fullName?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown className={`w-3 h-3 text-[#484f58] transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-6 top-14 w-64 bg-[#0d1117] border border-[#21262d] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50"
              >
                {/* User info */}
                <div className="px-4 py-4 border-b border-[#21262d]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1f6feb]/15 border border-[#1f6feb]/25 flex items-center justify-center text-sm font-bold font-mono text-[#58a6ff]">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#e6edf3] truncate">{user.fullName}</p>
                      <p className="text-[11px] font-mono text-[#7d8590] truncate">{user.email}</p>
                    </div>
                  </div>
                  {user.isAdmin && (
                    <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 bg-[#d29922]/10 border border-[#d29922]/20 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d29922]" />
                      <span className="text-[10px] font-mono font-semibold text-[#d29922] uppercase tracking-wider">Admin</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-1.5">
                  <button
                    onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22] transition-all group"
                  >
                    <div className="p-1.5 rounded-lg bg-[#21262d] group-hover:bg-[#58a6ff]/10 transition-colors">
                      <User className="w-3.5 h-3.5 group-hover:text-[#58a6ff] transition-colors" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-wider">View Profile</span>
                  </button>

                  <div className="my-1 mx-2 h-px bg-[#21262d]" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#7d8590] hover:text-[#f85149] hover:bg-[#f85149]/5 transition-all group"
                  >
                    <div className="p-1.5 rounded-lg bg-[#21262d] group-hover:bg-[#f85149]/10 transition-colors">
                      <LogOut className="w-3.5 h-3.5 group-hover:text-[#f85149] transition-colors" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-wider">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-[#161b22] border border-transparent hover:border-[#21262d] transition-all active:scale-90"
        >
          <MenuIcon className="w-5 h-5 text-[#7d8590]" />
        </button>
      </motion.nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-[100] w-72 bg-[#0d1117] border-l border-[#21262d] flex flex-col lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#21262d]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1f6feb]/15 border border-[#1f6feb]/25 flex items-center justify-center text-sm font-bold font-mono text-[#58a6ff]">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#e6edf3] truncate">{user.fullName}</p>
                    <p className="text-[10px] font-mono text-[#7d8590] truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[#161b22] border border-transparent hover:border-[#21262d] transition-all"
                >
                  <XIcon className="w-4 h-4 text-[#7d8590]" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 p-3 space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#484f58] px-3 py-2">Navigation</p>
                {navlinks.map(({ id, text, icon: Icon, path }) => {
                  const active = isActive(path);
                  return (
                    <button
                      key={id}
                      onClick={() => { navigate(path); setIsMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                        active
                          ? 'bg-[#1f6feb]/10 border border-[#1f6feb]/20 text-[#58a6ff]'
                          : 'text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22] border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="font-mono text-xs uppercase tracking-wider">{text}</span>
                      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1f6feb]" />}
                    </button>
                  );
                })}
              </div>

              {/* Bottom actions */}
              <div className="p-3 border-t border-[#21262d] space-y-1">
                <button
                  onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22] border border-transparent transition-all group"
                >
                  <div className="p-1.5 rounded-lg bg-[#21262d] group-hover:bg-[#58a6ff]/10 transition-colors">
                    <User className="w-3.5 h-3.5 group-hover:text-[#58a6ff] transition-colors" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider">View Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-[#7d8590] hover:text-[#f85149] hover:bg-[#f85149]/5 border border-transparent hover:border-[#f85149]/10 transition-all group"
                >
                  <div className="p-1.5 rounded-lg bg-[#21262d] group-hover:bg-[#f85149]/10 transition-colors">
                    <LogOut className="w-3.5 h-3.5 group-hover:text-[#f85149] transition-colors" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}