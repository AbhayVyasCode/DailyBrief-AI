import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, Settings, Search, Video, Sparkles, Home } from 'lucide-react';
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

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-black/10"
          >
            <img src="/features/DailyBrief AI icon.jpg" alt="DailyBrief AI" className="w-full h-full object-cover" />
          </motion.div>
          <span className="font-extrabold text-xl text-[#0b132b] tracking-tight">DailyBrief AI</span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/50 backdrop-blur-md rounded-full px-2 py-1.5 border border-gray-200/50 shadow-sm">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-600 hover:text-[#4255d4] hover:bg-white/80'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="header-nav-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-[#4255d4] to-[#6366f1] rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{link.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-full bg-[#0b132b] text-white font-semibold text-sm hover:bg-[#1e293b] transition-colors shadow-lg shadow-[#0b132b]/10 cursor-pointer"
              >
                Sign In
              </motion.button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
