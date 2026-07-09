import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { ArrowRight, Zap, Volume2, Languages, Play, Bot, Newspaper, TrendingUp, Settings, Search, Video, Sparkles, Home as HomeIcon, FileText, BookOpen } from 'lucide-react';
import LogoWall from '../components/LogoWall';
import FeatureShowcase from '../components/FeatureShowcase';
import CTABackground from '../components/CTABackground';
import Footer from '../components/Footer';
import PremiumGlobe from '../components/PremiumGlobe';
import type { Marker } from 'cobe';

const regions = [
  {
    id: 'americas',
    name: 'Americas',
    flag: '🇺🇸',
    longitude: -75,
    sources: [
      { name: 'The New York Times', region: 'US Desk', stats: '130M+ Readers', color: '#0f172a', flag: '🇺🇸', lat: 40.7128, lon: -74.006, logo: 'https://cdn.brandfetch.io/ida5pjO05F/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667566812797' },
      { name: 'CNN', region: 'Cable News', stats: '95M+ Viewers', color: '#cc0000', flag: '🇺🇸', lat: 33.749, lon: -84.388, logo: 'https://cdn.brandfetch.io/idhidc5593/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1721816108390' },
      { name: 'O Globo', region: 'Brazil', stats: '25M+ Readers', color: '#1e40af', flag: '🇧🇷', lat: -22.9068, lon: -43.1729, logo: 'https://cdn.brandfetch.io/idnDVRGJl3/w/320/h/320/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1781755677905' }
    ]
  },
  {
    id: 'europe',
    name: 'Europe',
    flag: '🇪🇺',
    longitude: 15,
    sources: [
      { name: 'BBC News', region: 'UK Desk', stats: '100M+ Readers', color: '#bb1919', flag: '🇬🇧', lat: 51.5074, lon: -0.1278, logo: 'https://cdn.brandfetch.io/idNQsCsD6X/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1777662657597' },
      { name: 'Le Monde', region: 'France', stats: '15M+ Readers', color: '#111827', flag: '🇫🇷', lat: 48.8566, lon: 2.3522, logo: 'https://cdn.brandfetch.io/idRhM8sw7p/w/1080/h/1080/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1778152535542' },
      { name: 'Der Spiegel', region: 'Germany', stats: '12M+ Readers', color: '#e50000', flag: '🇩🇪', lat: 53.5511, lon: 9.9937, logo: 'https://cdn.brandfetch.io/idBp3yFRhE/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1781719367200' }
    ]
  },
  {
    id: 'mea',
    name: 'Middle East & Africa',
    flag: '🇦🇪',
    longitude: 40,
    sources: [
      { name: 'Al Jazeera', region: 'Qatar', stats: '80M+ Readers', color: '#d97706', flag: '🇶🇦', lat: 25.2854, lon: 51.5310, logo: 'https://cdn.brandfetch.io/idF4kPeaPe/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1781716269866' },
      { name: 'Sky News Arabia', region: 'UAE Desk', stats: '30M+ Viewers', color: '#0284c7', flag: '🇦🇪', lat: 25.2048, lon: 55.2708, logo: 'https://cdn.brandfetch.io/id6Mq6uhOk/w/300/h/300/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1773058403989' },
      { name: 'Mail & Guardian', region: 'S. Africa', stats: '5M+ Readers', color: '#16a34a', flag: '🇿🇦', lat: -33.9249, lon: 18.4241, logo: 'https://cdn.brandfetch.io/id-O8jA71n/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1781824876085' }
    ]
  },
  {
    id: 'asiapacific',
    name: 'Asia-Pacific',
    flag: '🇯🇵',
    longitude: 105,
    sources: [
      { name: 'News On Japan', region: 'Japan', stats: '10M+ Circ.', color: '#8b5cf6', flag: '🇯🇵', lat: 35.6762, lon: 139.6503, logo: 'https://cdn.brandfetch.io/idjVI7H1i0/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1781860922342' },
      { name: 'NDTV', region: 'India', stats: '50M+ Viewers', color: '#dc2626', flag: '🇮🇳', lat: 28.6139, lon: 77.2090, logo: 'https://cdn.brandfetch.io/idCIBdadOR/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1774321079668' },
      { name: 'SCMP', region: 'Hong Kong', stats: '18M+ Readers', color: '#005a9c', flag: '🇭🇰', lat: 22.3193, lon: 114.1694, logo: 'https://cdn.brandfetch.io/idqyZMY8gD/w/192/h/192/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1781717765813' }
    ]
  }
];

const REGION_LONGITUDES: Record<string, number> = {
  americas: -75,
  europe: 15,
  mea: 40,
  asiapacific: 120,
};

const Home = () => {
  const [activeRegion, setActiveRegion] = useState(regions[0]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const location = useLocation();

  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f8f9fa';
    return () => {
      document.body.style.backgroundColor = prevBg;
    };
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.15 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/feed', label: 'Feed', icon: Newspaper },
    { href: '/trends', label: 'Trends', icon: TrendingUp },
    { href: '/videos', label: 'Videos', icon: Video },
    { href: '/tools', label: 'AI Tools', icon: Sparkles },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  // Globe markers (stick to globe surface via cobe)
  const globeMarkers: Marker[] = activeRegion.sources.map((source, i) => ({
    location: [source.lat, source.lon] as [number, number],
    size: 0.06,
    id: `src-${i}`,
  }));

  const activeRegionIdRef = useRef(activeRegion.id);
  activeRegionIdRef.current = activeRegion.id;

  const handleRegionChange = useRef((regionId: string) => {
    if (regionId !== activeRegionIdRef.current) {
      const found = regions.find(r => r.id === regionId);
      if (found) {
        activeRegionIdRef.current = found.id;
        setActiveRegion(found);
      }
    }
  }).current;

  const [targetPhi, setTargetPhi] = useState(0.2618); // Initialize to Americas center (15 degrees)

  const handleRegionClick = (region: typeof regions[0]) => {
    activeRegionIdRef.current = region.id;
    setActiveRegion(region);
    
    const targetLon = REGION_LONGITUDES[region.id];
    if (targetLon !== undefined) {
      const newTargetPhi = ((targetLon + 90) * Math.PI) / 180;
      setTargetPhi(newTargetPhi);
    }
  };

  // Connection lines removed for performance — the globe + region cards still work
  const revealContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const revealItem = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 16 }
    }
  };

  return (
    <main className="relative min-h-screen bg-[#f8f9fa] text-[#0b132b] overflow-x-clip font-sans pb-0">
      {/* Premium Background: Subtle dot grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]" 
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient gradient meshes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-500/[0.04] to-indigo-500/[0.03] rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tl from-purple-500/[0.04] to-pink-500/[0.02] rounded-full blur-[80px]" />
      </div>

      {/* Enhanced Premium Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
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

      {/* Hero Section - Premium Enhanced v2 */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={revealContainer}
        className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-0 pt-8 md:pt-10 pb-16 flex flex-col items-center text-center"
      >
        {/* Staggered Word Reveal Headline */}
        <motion.h1
          variants={revealItem}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black tracking-[-0.03em] leading-[1.1] text-[#0f172a] mx-auto mb-5 font-sans max-w-[800px]"
          style={{ textWrap: 'balance' }}
        >
          The{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-[#4255d4] via-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
              AI-Native
            </span>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#4255d4] via-[#6366f1] to-[#a855f7] rounded-full"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
          {' '}Platform for{' '}
          <br className="hidden md:block" />
          News Intelligence.
        </motion.h1>

        {/* Enhanced Subtitle with typing effect feel */}
        <motion.p
          variants={revealItem}
          className="text-base md:text-lg text-gray-500 max-w-[560px] mx-auto leading-relaxed mb-8 font-medium"
          style={{ textWrap: 'balance' }}
        >
          Cut through the noise with real-time AI analysis, multi-source tracking, and personalized insights delivered in seconds.
        </motion.p>

        {/* Premium CTA Buttons with glow ring */}
        <motion.div variants={revealItem} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link to="/feed">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-7 py-3.5 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-[14px] rounded-full shadow-xl shadow-[#0f172a]/20 cursor-pointer transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              {/* Animated ring on hover */}
              <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-[#4255d4] via-[#6366f1] to-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
              <div className="absolute -inset-[1px] rounded-full bg-[#0f172a] group-hover:bg-[#1e293b] transition-colors" />
              <span className="relative z-10">Start Reading</span>
              <div className="relative z-10 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 group-hover:translate-x-0.5 transition-all duration-300">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group px-7 py-3.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-[14px] rounded-full cursor-pointer transition-all duration-300 shadow-md shadow-gray-200/50 flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-[#4255d4]/10 flex items-center justify-center transition-colors">
              <Play className="w-3 h-3 text-gray-400 group-hover:text-[#4255d4] transition-colors ml-0.5" />
            </div>
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Enhanced Trust strip with avatars + live counter */}
        <motion.div variants={revealItem} className="flex flex-wrap items-center justify-center gap-4 mb-10 text-[12px] text-gray-400">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{
                  background: `linear-gradient(135deg, ${['#3b82f6','#8b5cf6','#ec4899','#f59e0b'][i]}, ${['#2563eb','#7c3aed','#db2777','#d97706'][i]})`
                }} />
              ))}
            </div>
            <span className="font-semibold text-gray-600">50k+</span>
            <span className="text-gray-400">active readers</span>
          </div>
          <span className="w-px h-3.5 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="font-semibold text-gray-600">30+</span>
            <span className="text-gray-400">categories</span>
          </div>
          <span className="w-px h-3.5 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <Bot className="w-3 h-3 text-[#4255d4]" />
            <span className="font-semibold text-gray-600">Gemini</span>
            <span className="text-gray-400">AI powered</span>
          </div>
          <span className="w-px h-3.5 bg-gray-200 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1.5">
            <Languages className="w-3 h-3 text-purple-400" />
            <span className="font-semibold text-gray-600">Bilingual</span>
            <span className="text-gray-400">EN / HI</span>
          </div>
        </motion.div>

        {/* Premium Mockup Card - Enhanced v2 */}
        <motion.div
          variants={revealItem}
          className="relative w-full max-w-[1000px] mx-auto z-10 flex items-center justify-center"
        >
          {/* Ambient glow */}
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/8 to-purple-500/8 rounded-[40px] blur-[60px] pointer-events-none" />

          {/* No CSS animations — all static for performance */}

          {/* Floating annotation: AI Summary */}
          <div className="absolute -left-2 md:-left-20 top-[18%] z-30 hidden sm:block">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/95 rounded-2xl border border-gray-200/60 shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-extrabold text-gray-800 leading-tight">AI Summary</p>
                <p className="text-[9px] text-gray-400 font-semibold">Instant analysis</p>
              </div>
              <div className="ml-1 px-1.5 py-0.5 bg-emerald-50 rounded text-[8px] font-bold text-emerald-600">
                0.3s
              </div>
            </div>
          </div>

          {/* Floating annotation: Translation */}
          <div className="absolute -right-2 md:-right-16 top-[58%] z-30 hidden sm:block">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/95 rounded-2xl border border-gray-200/60 shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                <Languages className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-extrabold text-gray-800 leading-tight">Translation</p>
                <p className="text-[9px] text-gray-400 font-semibold">Hindi / English</p>
              </div>
            </div>
          </div>

          {/* Floating annotation: Audio */}
          <div className="absolute -right-0 md:-right-12 top-[10%] z-30 hidden sm:block">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/95 rounded-2xl border border-gray-200/60 shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-extrabold text-gray-800 leading-tight">Audio Brief</p>
                <p className="text-[9px] text-gray-400 font-semibold">Listen on the go</p>
              </div>
            </div>
          </div>

          {/* Floating annotation: Live Sources */}
          <div className="absolute -left-1 md:-left-14 bottom-[8%] z-30 hidden sm:block">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/95 rounded-2xl border border-gray-200/60 shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">15+</span>
              </div>
              <div className="text-left">
                <p className="text-[11px] font-extrabold text-gray-800 leading-tight">Live Sources</p>
                <p className="text-[9px] text-gray-400 font-semibold">Real-time sync</p>
              </div>
            </div>
          </div>

          {/* Card Frame */}
          <div className="relative w-full aspect-[16/9] max-h-[580px] rounded-2xl p-[1.5px] z-10"
            style={{ background: 'linear-gradient(135deg, rgba(66,85,212,0.3), rgba(229,231,235,0.8), rgba(168,85,247,0.3))' }}
          >
            <div className="w-full h-full rounded-[14px] bg-white/90 p-1.5 flex items-center justify-center relative"
              style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)' }}
            >
              <div className="relative w-full h-full bg-[#111] rounded-xl overflow-hidden flex items-center justify-center p-[1px]">
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  className="w-full h-full object-cover rounded-[10px]"
                  style={{ WebkitMediaControls: 'none' } as React.CSSProperties}
                >
                  <source src="/DailyBrief AI news video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* DailyBrief AI logo overlay — covers the Gemini logo at bottom-right of video */}
                <div className="absolute bottom-[10%] right-[7%] z-20 w-[8%] aspect-square rounded-xl overflow-hidden shadow-2xl border-2 border-white/30">
                  <img
                    src="/dailybrief-icon.jpg"
                    alt="DailyBrief AI"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Below-Hero Feature Pills */}
        <motion.div
          variants={revealItem}
          className="flex flex-wrap items-center justify-center gap-3 mt-10"
        >
          {[
            { icon: FileText, label: "Smart Summaries", color: "from-blue-500 to-indigo-500" },
            { icon: Languages, label: "Neural Translation", color: "from-purple-500 to-violet-500" },
            { icon: Volume2, label: "Text-to-Speech", color: "from-amber-500 to-orange-500" },
            { icon: Play, label: "Video Analysis", color: "from-red-500 to-pink-500" },
          ].map((feat) => (
            <motion.div
              key={feat.label}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white/80 backdrop-blur-md rounded-full border border-gray-200/50 shadow-sm hover:shadow-md hover:border-gray-300/50 transition-all duration-300 cursor-default"
            >
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${feat.color} flex items-center justify-center`}>
                <feat.icon className="w-3 h-3 text-white" />
              </div>
              <span className="text-[12px] font-semibold text-gray-600">{feat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Credibility / Logo Wall */}
      <LogoWall />

      {/* Intelligent Features — Scroll-Pinned Showcase */}
      <FeatureShowcase />

      {/* How It Works — Premium Animated */}
      <section className="relative z-10 border-t border-gray-200/50 pt-28 pb-16 overflow-hidden">
        {/* Animated gradient mesh background */}
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -25, 20, 0], y: [0, 15, -25, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] bg-purple-500/[0.04] rounded-full blur-[100px] pointer-events-none"
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30 - i * 10, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#4255d4]/30 pointer-events-none"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          />
        ))}

        {/* Background grid dots */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.25]"
          style={{
            backgroundImage: 'radial-gradient(circle, #c4c9d4 0.7px, transparent 0.7px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="w-full max-w-[1000px] mx-auto px-5 md:px-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="inline-block px-4 py-1.5 rounded-full bg-[#4255d4]/10 text-[#4255d4] font-mono text-[10.5px] uppercase tracking-[0.2em] font-bold border border-[#4255d4]/20 mb-5"
            >
              Simple Process
            </motion.span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[#0f172a] leading-tight mb-3">
              How DailyBrief AI works
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
              Three steps from question to insight. No clutter, no paywalls, no noise.
            </p>
          </motion.div>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 relative">
            {/* SVG arrows overlay — advanced animations */}
            <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMid meet">
              <defs>
                {/* Glow filter for dots */}
                <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Line glow filter */}
                <filter id="lineGlow" x="-20%" y="-100%" width="140%" height="300%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* ===== ARROW 1 ===== */}
              {/* Glow shadow line (behind main line) */}
              <motion.line
                x1="310" y1="12" x2="448" y2="12"
                stroke="#ef4444"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.3"
                filter="url(#lineGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.3 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              />
              {/* Main line */}
              <motion.line
                x1="310" y1="12" x2="448" y2="12"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Arrowhead with spring bounce */}
              <motion.polygon
                points="443,4 458,12 443,20"
                fill="#ef4444"
                filter="url(#glow)"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 500, damping: 12, delay: 1 }}
                style={{ transformOrigin: '443px 12px' }}
              />
              {/* Traveling glow dot */}
              <motion.circle
                r="3"
                fill="#ef4444"
                filter="url(#glow)"
                initial={{ cx: 310, cy: 12, opacity: 0 }}
                whileInView={{ cx: [310, 448], opacity: [0, 1, 1, 0] }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
              />
              {/* Particle trail dots */}
              {[0, 0.15, 0.3].map((offset, pi) => (
                <motion.circle
                  key={`p1-${pi}`}
                  r="1.5"
                  fill="#ef4444"
                  opacity="0.4"
                  initial={{ cx: 310, cy: 12, opacity: 0 }}
                  whileInView={{ cx: [310, 448], opacity: [0, 0.6, 0.3, 0] }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + offset, ease: 'easeInOut' }}
                />
              ))}

              {/* ===== ARROW 2 ===== */}
              {/* Glow shadow line */}
              <motion.line
                x1="640" y1="12" x2="778" y2="12"
                stroke="#ef4444"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.3"
                filter="url(#lineGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.3 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              />
              {/* Main line */}
              <motion.line
                x1="640" y1="12" x2="778" y2="12"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Arrowhead with spring bounce */}
              <motion.polygon
                points="773,4 788,12 773,20"
                fill="#ef4444"
                filter="url(#glow)"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 500, damping: 12, delay: 1.3 }}
                style={{ transformOrigin: '773px 12px' }}
              />
              {/* Traveling glow dot */}
              <motion.circle
                r="3"
                fill="#ef4444"
                filter="url(#glow)"
                initial={{ cx: 640, cy: 12, opacity: 0 }}
                whileInView={{ cx: [640, 778], opacity: [0, 1, 1, 0] }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8, ease: 'easeInOut' }}
              />
              {/* Particle trail dots */}
              {[0, 0.15, 0.3].map((offset, pi) => (
                <motion.circle
                  key={`p2-${pi}`}
                  r="1.5"
                  fill="#ef4444"
                  opacity="0.4"
                  initial={{ cx: 640, cy: 12, opacity: 0 }}
                  whileInView={{ cx: [640, 778], opacity: [0, 0.6, 0.3, 0] }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.8 + offset, ease: 'easeInOut' }}
                />
              ))}
            </svg>

            {[
              {
                step: '01',
                title: 'Search',
                desc: 'Type any topic — AI, sports, crypto, geopolitics. DailyBrief AI scans sources in real-time.',
                stat: '500+',
                statLabel: 'Sources',
                icon: Search,
                gradient: 'from-blue-500 to-indigo-500',
                glow: 'shadow-blue-500/25',
                hoverBorder: 'hover:border-blue-400/40',
                bg: 'bg-blue-50/80',
              },
              {
                step: '02',
                title: 'AI Curates',
                desc: 'Gemini filters, summarizes, and categorizes. You get structured briefings, not noise.',
                stat: '<1s',
                statLabel: 'Latency',
                icon: Zap,
                gradient: 'from-purple-500 to-violet-500',
                glow: 'shadow-purple-500/25',
                hoverBorder: 'hover:border-purple-400/40',
                bg: 'bg-purple-50/80',
              },
              {
                step: '03',
                title: 'Stay Informed',
                desc: 'Read summaries, listen via TTS, translate to Hindi, or watch related videos.',
                stat: '30+',
                statLabel: 'Categories',
                icon: BookOpen,
                gradient: 'from-emerald-500 to-teal-500',
                glow: 'shadow-emerald-500/25',
                hoverBorder: 'hover:border-emerald-400/40',
                bg: 'bg-emerald-50/80',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.18,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`relative z-10 text-center group p-6 rounded-2xl border border-gray-100 ${item.hoverBorder} bg-white/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl ${item.glow} cursor-default`}
              >
                {/* Large background step number with yellow underline */}
                <div className="absolute top-2 right-3 select-none pointer-events-none z-0">
                  <div className="text-[80px] font-black leading-none text-gray-200/80">
                    {item.step}
                  </div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.18 + 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-[4px] bg-yellow-400 rounded-full origin-left mt-1"
                  />
                </div>

                {/* Hover glow overlay */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${item.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 pointer-events-none`} />

                {/* Icon cluster */}
                <div className="relative mx-auto mb-5 w-[76px] h-[76px]">
                  {/* Outer rotating ring */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileInView={{ rotate: 360 }}
                    viewport={{ once: true }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-[-6px] rounded-full border-[1.5px] border-dashed border-gray-200/60"
                  />
                  {/* Pulsing bg ring */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: i * 0.18 + 0.2 }}
                    className={`absolute inset-0 rounded-full ${item.bg}`}
                  />
                  {/* Main icon */}
                  <motion.div
                    whileHover={{ scale: 1.12, rotate: 8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                    className={`relative w-[76px] h-[76px] mx-auto rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl ${item.glow} cursor-pointer z-10`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  {/* Step badge with spring */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18, delay: i * 0.18 + 0.45 }}
                    className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 z-20 shadow-lg"
                  >
                    {item.step}
                  </motion.div>
                </div>

                {/* Text */}
                <motion.h3
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.18 + 0.3 }}
                  className="text-base md:text-lg font-bold text-[#0f172a] mb-2"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.18 + 0.4 }}
                  className="text-gray-400 text-[13px] leading-relaxed max-w-[280px] mx-auto mb-4"
                >
                  {item.desc}
                </motion.p>

                {/* Stat badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.18 + 0.5 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100"
                >
                  <span className={`text-sm font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>{item.stat}</span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{item.statLabel}</span>
                </motion.div>

                {/* Bottom accent line on hover */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-16 h-[2px] bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-500`} />
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center mt-16"
          >
            <Link to="/feed">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-9 py-4 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm rounded-full shadow-xl shadow-[#0f172a]/20 transition-all inline-flex items-center gap-2.5 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10">Try it now</span>
                <motion.div
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
                {/* Shimmer sweep */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Globe Visualization Section - Dotted Earth Globe with Active Region Cards */}
      <section className="relative z-10 w-full pt-16 pb-32 border-t border-gray-200/50 bg-transparent flex flex-col items-center overflow-hidden">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#4255d4]/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[100px]" />
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-[#4255d4]/[0.03] rounded-full blur-[80px]" />
        </div>

        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-0 relative">
          <div className="text-center max-w-[800px] space-y-3 mb-16 mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#0f172a] leading-tight">
              Real-Time Regional Coverage
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              As the Earth rotates, DailyBrief AI dynamically shifts focus to parse and summarize feeds from top outlets.
            </p>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center relative">
            {/* Left Column: Region Pills + Globe */}
            <div className="lg:col-span-7 flex flex-col items-center relative">
              {/* Region Indicator Pills */}
              <div className="flex items-center gap-2 mb-6">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => handleRegionClick(region)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
                      activeRegion.id === region.id
                        ? 'bg-[#4255d4] text-white border-[#4255d4] shadow-lg shadow-[#4255d4]/20'
                        : 'bg-white/60 text-gray-500 border-gray-200/50 hover:bg-white hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-1.5">{region.flag}</span>
                    {region.name}
                  </button>
                ))}
              </div>

              <div className="flex justify-center items-center relative h-[450px] lg:h-[500px] w-full">
                <PremiumGlobe 
                  targetPhi={targetPhi}
                  onRegionChange={handleRegionChange} 
                  markers={globeMarkers} 
                />
              </div>
            </div>

            {/* Right Column: Active Regional Feed Card */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start w-full">
              <div className="w-full max-w-[420px] bg-white/75 rounded-3xl border border-gray-200/50 p-8 shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <span className="text-[9px] font-bold text-[#4255d4] uppercase tracking-widest">Active Regional Grid</span>
                    <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tight mt-1">
                      <span className="mr-2">{activeRegion.flag}</span>
                      {activeRegion.name}
                    </h3>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-mono font-bold text-gray-400">LIVE SYNC</span>
                  </div>
                </div>

                {/* Stack of Active Region Sources */}
                <div className="space-y-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeRegion.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >
                      {activeRegion.sources.map((source, i) => (
                        <motion.div
                          key={i}
                          ref={(el) => { cardRefs.current[i] = el; }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-4 bg-gray-50/50 border border-gray-200/30 rounded-2xl p-4 hover:bg-white hover:border-[#4255d4]/20 hover:shadow-md transition-all duration-300"
                        >
                          <div className="relative">
                            {source.logo ? (
                              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                                <img
                                  src={source.logo}
                                  alt={source.name}
                                  className="w-7 h-7 object-contain"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                            ) : (
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
                                style={{ backgroundColor: source.color }}
                              >
                                {source.name[0]}
                              </div>
                            )}
                            <span className="absolute -bottom-1 -right-1 text-sm leading-none">{source.flag}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-sm text-gray-800 truncate">{source.name}</span>
                              <span className="text-[8px] font-bold text-[#4255d4] uppercase tracking-wider bg-blue-50 px-1.5 py-0.5 rounded">
                                {source.region}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 mt-0.5">{source.stats}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[9px] font-mono text-gray-400">LIVE</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — 21st.dev Rectangle Style with Glow */}
      <section className="relative z-10 w-full max-w-[1200px] mx-auto px-5 md:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Animated canvas background */}
          <CTABackground />

          {/* Yellow-orange glow border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/40 via-amber-600/20 to-amber-500/40 p-[1px] pointer-events-none z-20">
            <div className="w-full h-full rounded-[calc(1rem-1px)] bg-transparent" />
          </div>

          {/* Inner glow on edges */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none z-20"
            style={{
              boxShadow: 'inset 0 0 60px rgba(245,158,11,0.08), inset 0 0 120px rgba(245,158,11,0.04)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-8 py-16 md:px-20 md:py-20 text-center">
            {/* Badge with pulse */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-7"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
              <span className="text-[11px] font-semibold text-gray-400 tracking-wide">Get started</span>
            </motion.div>

            {/* Title with gradient word */}
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-[2.75rem] font-bold tracking-[-0.02em] text-white leading-[1.15] mb-5"
            >
              Start building with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">
                DailyBrief AI
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-gray-400 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed"
            >
              Get started with DailyBrief AI and build your personalized news experience in no time.
            </motion.p>

            {/* CTA Button with glow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="relative inline-block"
            >
              <div className="absolute inset-0 bg-amber-500/20 rounded-lg blur-xl" />
              <Link to="/feed">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative px-8 py-3.5 bg-white hover:bg-gray-50 text-[#0f172a] font-semibold text-sm rounded-lg transition-all inline-flex items-center gap-2.5 cursor-pointer shadow-lg shadow-white/10"
                >
                  Get Started
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Home;
