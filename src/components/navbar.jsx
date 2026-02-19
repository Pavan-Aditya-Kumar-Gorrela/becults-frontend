import { useState, useEffect } from 'react';
import { MenuIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.jpg';

const navlinks = [
  { href: '#cohorts',      text: 'Cohorts',      id: 'cohorts'      },
  { href: '#about',        text: 'About',        id: 'about'        },
  { href: '#testimonials', text: 'Testimonials', id: 'testimonials' },
  { href: '#contact',      text: 'Contact',      id: 'contact'      },
  { href: '#meet-our-team', text: 'Meet Our Team', id:'meet-our-team'},
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href) => {
    const el = document.getElementById(href.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 60 }}
        className={`fixed top-0 left-0 right-0 z-50 h-16 px-6 md:px-10 flex items-center justify-between
          bg-[#010409]/90 backdrop-blur-md border-b border-[#21262d] transition-shadow duration-300
          ${scrolled ? 'shadow-xl shadow-black/40' : ''}`}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="shrink-0 mr-10 opacity-80 hover:opacity-100 transition-opacity"
        >
          <img src={Logo} alt="logo" className="h-30   w-auto" />
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1 flex-1">
          {navlinks.map(({ id, text, href }) => (
            <button
              key={id}
              onClick={() => handleNavClick(href)}
              className="flex items-center px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-[#7d8590] hover:text-[#c9d1d9] hover:bg-[#161b22] transition-all duration-200"
            >
              {text}
            </button>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#7d8590] hover:text-[#e6edf3] bg-[#0d1117] hover:bg-[#161b22] border border-[#21262d] hover:border-[#30363d] rounded-xl transition-all duration-200 active:scale-[0.97]"
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-white bg-[#1f6feb] hover:bg-[#388bfd] rounded-xl transition-all duration-200 shadow-lg shadow-[#1f6feb]/20 hover:shadow-[#1f6feb]/30 active:scale-[0.97]"
          >
            Get started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-[#161b22] border border-transparent hover:border-[#21262d] transition-all active:scale-90"
        >
          <MenuIcon className="w-5 h-5 text-[#7d8590]" />
        </button>
      </motion.nav>

      {/* Mobile drawer */}
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
                <img src={Logo} alt="logo" className="h-6 w-auto opacity-80" />
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
                {navlinks.map(({ id, text, href }) => (
                  <button
                    key={id}
                    onClick={() => handleNavClick(href)}
                    className="w-full flex items-center px-3 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22] border border-transparent transition-all"
                  >
                    {text}
                  </button>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="p-4 border-t border-[#21262d] space-y-2">
                <button
                  onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                  className="w-full py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] rounded-xl text-xs font-mono uppercase tracking-wider text-white font-semibold transition-all active:scale-[0.97] shadow-lg shadow-[#1f6feb]/15"
                >
                  Get started
                </button>
                <button
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="w-full py-2.5 bg-[#0d1117] hover:bg-[#161b22] border border-[#21262d] hover:border-[#30363d] rounded-xl text-xs font-mono uppercase tracking-wider text-[#7d8590] hover:text-[#e6edf3] transition-all active:scale-[0.97]"
                >
                  Log in
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}