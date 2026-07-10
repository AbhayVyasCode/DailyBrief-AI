import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, TrendingUp, Settings, Search, Video, Sparkles, Home, Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/feed', label: 'Feed', icon: Newspaper },
  { href: '/trends', label: 'Trends', icon: TrendingUp },
  { href: '/videos', label: 'Videos', icon: Video },
  { href: '/tools', label: 'AI Tools', icon: Sparkles },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic header styles on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolled 
          ? 'bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-200/50 shadow-md shadow-black/[0.03]' 
          : 'bg-transparent border-b border-transparent shadow-none'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 h-[72px] flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-black/[0.08]"
          >
            <img src="/dailybrief-icon.jpg" alt="DailyBrief AI" className="w-full h-full object-cover" />
          </motion.div>
          <span className="font-extrabold text-[18px] text-[#0f172a] dark:text-white tracking-tight group-hover:text-[#4255d4] transition-colors duration-250">
            DailyBrief AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-full p-1 border border-gray-200/40 dark:border-slate-800/40 shadow-sm">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 rounded-full flex items-center gap-2 text-[13px] font-bold tracking-tight transition-all duration-250 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-500 hover:text-[#4255d4] dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="header-nav-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-[#4255d4] to-indigo-600 rounded-full"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{link.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Clerk Actions & Hamburger */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.02, y: -0.5 }}
                whileTap={{ scale: 0.98 }}
                className="px-4.5 py-2 rounded-full bg-[#0f172a] hover:bg-[#1f293d] text-white font-bold text-xs shadow-md shadow-[#0f172a]/10 cursor-pointer transition-colors"
              >
                Sign In
              </motion.button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* Hamburger toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl border border-gray-200/50 bg-white/60 backdrop-blur flex items-center justify-center text-gray-600 hover:text-[#4255d4] transition-all cursor-pointer shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden w-full bg-white dark:bg-[#0f172a] border-b border-gray-100 dark:border-slate-800 overflow-hidden shadow-lg"
          >
            <div className="px-5 py-6 flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-[14px] font-bold transition-all ${
                      isActive
                        ? 'bg-[#4255d4]/8 text-[#4255d4] border-l-4 border-[#4255d4] pl-3.5'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-slate-800/50 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#4255d4]' : 'text-gray-400'}`} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
