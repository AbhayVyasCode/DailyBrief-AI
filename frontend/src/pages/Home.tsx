import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { ArrowRight, Zap, Volume2, Languages, Play, Bot, Newspaper, TrendingUp, Settings, Search, Video, Sparkles, Home as HomeIcon, FileText } from 'lucide-react';
import LogoWall from '../components/LogoWall';
import dashboardMockup from '../assets/novabrief_dashboard_mockup.png';
import chatMockup from '../assets/novabrief_ai_chat_mockup.png';
import PremiumGlobe from '../components/PremiumGlobe';
import type { Marker } from 'cobe';

const regions = [
  {
    id: 'americas',
    name: 'Americas',
    flag: '🇺🇸',
    longitude: -75,
    sources: [
      { name: 'The New York Times', region: 'US Desk', stats: '130M+ Readers', color: '#0f172a', flag: '🇺🇸', lat: 40.7128, lon: -74.006 },
      { name: 'CNN', region: 'Cable News', stats: '95M+ Viewers', color: '#cc0000', flag: '🇺🇸', lat: 33.749, lon: -84.388 },
      { name: 'O Globo', region: 'Brazil', stats: '25M+ Readers', color: '#1e40af', flag: '🇧🇷', lat: -22.9068, lon: -43.1729 }
    ]
  },
  {
    id: 'europe',
    name: 'Europe',
    flag: '🇪🇺',
    longitude: 15,
    sources: [
      { name: 'BBC News', region: 'UK Desk', stats: '100M+ Readers', color: '#bb1919', flag: '🇬🇧', lat: 51.5074, lon: -0.1278 },
      { name: 'Le Monde', region: 'France', stats: '15M+ Readers', color: '#111827', flag: '🇫🇷', lat: 48.8566, lon: 2.3522 },
      { name: 'Der Spiegel', region: 'Germany', stats: '12M+ Readers', color: '#e50000', flag: '🇩🇪', lat: 53.5511, lon: 9.9937 }
    ]
  },
  {
    id: 'mea',
    name: 'Middle East & Africa',
    flag: '🇦🇪',
    longitude: 40,
    sources: [
      { name: 'Al Jazeera', region: 'Qatar', stats: '80M+ Readers', color: '#d97706', flag: '🇶🇦', lat: 25.2854, lon: 51.5310 },
      { name: 'Sky News Arabia', region: 'UAE Desk', stats: '30M+ Viewers', color: '#0284c7', flag: '🇦🇪', lat: 25.2048, lon: 55.2708 },
      { name: 'Mail & Guardian', region: 'S. Africa', stats: '5M+ Readers', color: '#16a34a', flag: '🇿🇦', lat: -33.9249, lon: 18.4241 }
    ]
  },
  {
    id: 'asiapacific',
    name: 'Asia-Pacific',
    flag: '🇯🇵',
    longitude: 105,
    sources: [
      { name: 'The Yomiuri Shimbun', region: 'Japan', stats: '10M+ Circ.', color: '#8b5cf6', flag: '🇯🇵', lat: 35.6762, lon: 139.6503 },
      { name: 'NDTV', region: 'India', stats: '50M+ Viewers', color: '#dc2626', flag: '🇮🇳', lat: 28.6139, lon: 77.2090 },
      { name: 'SCMP', region: 'Hong Kong', stats: '18M+ Readers', color: '#005a9c', flag: '🇭🇰', lat: 22.3193, lon: 114.1694 }
    ]
  }
];

const Home = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeRegion, setActiveRegion] = useState(regions[0]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/feed', label: 'Feed', icon: Newspaper },
    { href: '/trends', label: 'Trends', icon: TrendingUp },
    { href: '/videos', label: 'Videos', icon: Video },
    { href: '/tools', label: 'AI Tools', icon: Sparkles },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  // Build markers for cobe with IDs matching source indices
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
    <main className="relative min-h-screen bg-[#f8f9fa] text-[#0b132b] overflow-x-clip font-sans pb-20">
      {/* Premium Background: Subtle dot grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]" 
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient gradient meshes */}
      <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-500/[0.04] to-indigo-500/[0.03] rounded-full blur-[80px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tl from-purple-500/[0.04] to-pink-500/[0.02] rounded-full blur-[80px] pointer-events-none z-0" />

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
              className="w-10 h-10 bg-gradient-to-br from-[#4255d4] to-[#6366f1] rounded-xl flex items-center justify-center shadow-lg shadow-[#4255d4]/20"
            >
              <span className="text-white font-extrabold text-xl tracking-tighter">N</span>
            </motion.div>
            <span className="font-extrabold text-xl text-[#0b132b] tracking-tight">NovaBrief</span>
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
          <div className="relative w-full aspect-[16/10] max-h-[580px] rounded-2xl p-[1.5px] z-10"
            style={{ background: 'linear-gradient(135deg, rgba(66,85,212,0.3), rgba(229,231,235,0.8), rgba(168,85,247,0.3))' }}
          >
            <div className="w-full h-full rounded-[14px] bg-white/90 p-1.5 flex items-center justify-center relative"
              style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)' }}
            >
              <div className="w-full h-full bg-[#111] rounded-xl overflow-hidden flex items-center justify-center p-[1px]">
                <img
                  src={dashboardMockup}
                  alt="NovaBrief Reader Dashboard Mockup"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-[10px]"
                />
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

      {/* Bento Grid Features Section */}
      <section className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-0 py-32 space-y-20">
        <div className="max-w-[800px] space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-[#4255d4]/10 text-[#4255d4] font-mono text-[10.5px] uppercase tracking-[0.2em] font-bold border border-[#4255d4]/20">
            Intelligent Features
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#0f172a] uppercase font-sans">
            A smarter way to consume the news.
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
            NovaBrief packages full article scraping, text-to-speech, translation, and video curation into a single responsive, hardware-accelerated grid system.
          </p>
        </div>

        <motion.div 
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Card 1: Summaries (Col Span 2) */}
          <motion.div
            variants={revealItem}
            className="lg:col-span-2 relative p-[1px] rounded-3xl bg-transparent overflow-visible flex group"
          >

            <div className="w-full h-full bg-white/60 backdrop-blur-md rounded-3xl border border-gray-200/50 p-8 flex flex-col justify-between space-y-8 shadow-sm hover:shadow-md hover:border-[#4255d4]/30 transition-all duration-300 relative z-10">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Zap className="w-5.5 h-5.5 fill-blue-600/10" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0f172a]">Instant AI Summaries</h3>
                <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
                  Scrapes the main text of any article, stripping advertisements, paywalls, and script noise. Gemini AI delivers structured briefings in under 300 words.
                </p>
              </div>

              {/* Custom Split-Pane Mockup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-2">
                {/* Original Article block */}
                <div className="bg-gray-50/70 border border-gray-200/30 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Source Document</span>
                    <span>4,820 Words</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200/60 rounded-full w-full" />
                    <div className="h-3 bg-gray-200/60 rounded-full w-5/6" />
                    <div className="h-3 bg-gray-200/60 rounded-full w-11/12" />
                    <div className="h-3 bg-gray-200/40 rounded-full w-3/4" />
                  </div>
                </div>

                {/* AI Executive Summary block */}
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                    <span>Gemini Curation</span>
                    <span>240 Words</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Efficiency benchmark yields 40% speedup.
                    </li>
                    <li className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Baseline transformer parameters intact.
                    </li>
                    <li className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Training latency significantly decreased.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Translation (Col Span 1) */}
          <motion.div
            variants={revealItem}
            className="lg:col-span-1 relative p-[1px] rounded-3xl bg-transparent overflow-visible flex group"
          >

            <div className="w-full h-full bg-white/60 backdrop-blur-md rounded-3xl border border-gray-200/50 p-8 flex flex-col justify-between space-y-8 shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all duration-300 relative z-10">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Languages className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0f172a]">Neural Translation</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Translate summarized updates seamlessly between English and Hindi, preserving context, tone, and formatting in high-contrast layouts.
                </p>
              </div>

              {/* Translation bubbles mockup */}
              <div className="flex flex-col gap-3 w-full pt-2">
                {/* English bubble */}
                <div className="self-start max-w-[85%] bg-gray-50/80 border border-gray-200/40 p-3.5 rounded-2xl rounded-tl-sm space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">English</span>
                  <p className="text-xs font-semibold text-gray-700">AI research groups validate transformer architectural gains.</p>
                </div>
                {/* Hindi bubble */}
                <div className="self-end max-w-[85%] bg-purple-500/10 border border-purple-500/20 p-3.5 rounded-2xl rounded-tr-sm space-y-1">
                  <span className="text-[9px] font-bold text-purple-500 uppercase tracking-wider block text-right">हिन्दी</span>
                  <p className="text-xs font-semibold text-purple-900 text-right leading-relaxed">अनुसंधान समूहों ने ट्रांसफार्मर संरचनात्मक लाभों को सत्यापित किया।</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Audio TTS (Col Span 1) */}
          <motion.div
            variants={revealItem}
            className="lg:col-span-1 relative p-[1px] rounded-3xl bg-transparent overflow-visible flex group"
          >

            <div className="w-full h-full bg-white/60 backdrop-blur-md rounded-3xl border border-gray-200/50 p-8 flex flex-col justify-between space-y-8 shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all duration-300 relative z-10">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Volume2 className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0f172a]">Text-to-Speech</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Listen to news cards or custom text blocks with integrated natural text-to-speech engine, generated dynamically to support eyes-free productivity.
                </p>
              </div>

              {/* Waveform Player widget */}
              <div className="bg-gray-50/70 border border-gray-200/40 rounded-2xl p-4.5 flex items-center justify-between gap-4 w-full pt-2">
                <button 
                  onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                  className="w-11 h-11 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center cursor-pointer transition-colors shadow-md shadow-orange-500/20 flex-shrink-0"
                >
                  {isAudioPlaying ? (
                    <div className="flex gap-0.5 items-center justify-center w-5 h-5">
                      <span className="w-0.5 h-3 bg-current animate-pulse" />
                      <span className="w-0.5 h-4 bg-current animate-pulse" />
                      <span className="w-0.5 h-2 bg-current animate-pulse" />
                    </div>
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>{isAudioPlaying ? 'Streaming Audio' : 'Text to Speech'}</span>
                    <span>0:18</span>
                  </div>
                  {/* Waveform visualization */}
                  <div className="h-8 flex items-end gap-[3px] overflow-hidden">
                    {[12, 28, 16, 32, 24, 8, 36, 20, 28, 14, 26, 10, 32, 18, 22, 12].map((height, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full ${isAudioPlaying ? 'bg-orange-500' : 'bg-gray-300'}`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Video Curation (Col Span 2) */}
          <motion.div
            variants={revealItem}
            className="lg:col-span-2 relative p-[1px] rounded-3xl bg-transparent overflow-visible flex group"
          >

            <div className="w-full h-full bg-white/60 backdrop-blur-md rounded-3xl border border-gray-200/50 p-8 flex flex-col justify-between space-y-8 shadow-sm hover:shadow-md hover:border-red-500/30 transition-all duration-300 relative z-10">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <Play className="w-5.5 h-5.5 fill-red-500/10" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0f172a]">Get instant and related news videos</h3>
                <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
                  Pulls relevant HD broadcast updates uploaded in the last 7 days. Video lists are sorted dynamically by view counts to display the most trending briefs first.
                </p>
              </div>

              {/* Custom Video Mockup block */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full pt-2">
                {/* Active Player */}
                <div className="md:col-span-7 aspect-video bg-gray-900 rounded-2xl overflow-hidden relative flex items-center justify-center group/video cursor-pointer border border-gray-800">
                  {/* Subtle static grid mesh in player */}
                  <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover/video:scale-110 transition-transform duration-300 z-10 shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  {/* Bottom Video Progress overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-center justify-between text-[10px] text-gray-300 font-mono">
                    <span>NASA Artemis Launch Briefing</span>
                    <span>1:42 / 3:15</span>
                  </div>
                </div>

                {/* Playlist list */}
                <div className="md:col-span-5 flex flex-col gap-2 justify-between">
                  <div className="p-3 bg-gray-50/80 border border-gray-200/40 rounded-xl flex items-center gap-3 hover:bg-gray-100/80 transition-colors cursor-pointer">
                    <div className="w-10 h-7 rounded bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <Play className="w-3 h-3 text-gray-500 fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-700 truncate">EU Climate Policy Summit</p>
                      <p className="text-[9px] text-gray-400">12k views • 2h ago</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50/80 border border-gray-200/40 rounded-xl flex items-center gap-3 hover:bg-gray-100/80 transition-colors cursor-pointer">
                    <div className="w-10 h-7 rounded bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <Play className="w-3 h-3 text-gray-500 fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-700 truncate">Global Semiconductor Shortage</p>
                      <p className="text-[9px] text-gray-400">45k views • 5h ago</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50/80 border border-gray-200/40 rounded-xl flex items-center gap-3 hover:bg-gray-100/80 transition-colors cursor-pointer">
                    <div className="w-10 h-7 rounded bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <Play className="w-3 h-3 text-gray-500 fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-700 truncate">Federal Interest Rate Policy</p>
                      <p className="text-[9px] text-gray-400">8k views • 1d ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Desire / Chat Interactive Mockup Section - Variant 4 (Neo-Minimalist Slate) */}
      <section className="relative z-10 border-t border-gray-200/50 bg-transparent py-32">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-0 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Responsive text and buttons */}
          <div className="lg:col-span-5 space-y-6">
            <span className="px-4 py-1.5 rounded-full bg-[#4255d4]/10 text-[#4255d4] font-mono text-[10.5px] uppercase tracking-[0.2em] font-bold border border-[#4255d4]/20">
              Interactive AI
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#0f172a] uppercase font-sans">
              Conversations in Context.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Ask about current events, trend patterns, or specific timelines. The assistant triggers DuckDuckGo searches in the background to inject verified news context into the chat loop.
            </p>
            <div className="pt-2">
              <Link to="/feed">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  className="px-8 py-4 bg-[#4255d4] hover:bg-[#3647b5] text-white rounded-full font-bold text-base hover:shadow-lg hover:shadow-blue-500/10 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  Launch Assistant
                  <Bot className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Mockup Image */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[450px] p-[1px] bg-transparent rounded-3xl overflow-visible flex group">
              {/* Ambient purple/blue glow backdrop matching Variant 4 */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#4255d4]/15 to-purple-500/15 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <img
                src={chatMockup}
                alt="AI Chat Mockup"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover rounded-3xl border border-gray-200/50 shadow-xl group-hover:shadow-2xl group-hover:border-[#4255d4]/30 transition-all duration-300 relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Globe Visualization Section - Dotted Earth Globe with Active Region Cards */}
      <section className="relative z-10 w-full py-32 border-t border-gray-200/50 bg-transparent flex flex-col items-center overflow-hidden">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#4255d4]/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[100px]" />
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-[#4255d4]/[0.03] rounded-full blur-[80px]" />
        </div>

        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-0 relative">
          <div className="text-center max-w-[800px] space-y-4 mb-20 mx-auto">
            <span className="px-4 py-1.5 rounded-full bg-[#4255d4]/10 text-[#4255d4] font-mono text-[10.5px] uppercase tracking-[0.2em] font-bold border border-[#4255d4]/20">
              Global Coverage
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#0f172a] uppercase font-sans">
              Real-Time Regional Coverage
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              As the Earth rotates, NovaBrief dynamically shifts focus to parse, filter, and summarize primary feeds from top outlets in the active region.
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
                    onClick={() => setActiveRegion(region)}
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
                <PremiumGlobe onRegionChange={handleRegionChange} markers={globeMarkers} />
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
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
                              style={{ backgroundColor: source.color }}
                            >
                              {source.name[0]}
                            </div>
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

      {/* Action / CTA & Footer Section */}
      <section className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-0 py-28">
        <div className="p-1 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 border border-border rounded-[3rem] shadow-2xl overflow-hidden relative">
          <div className="bg-card rounded-[calc(3rem-0.25rem)] border border-border/50 p-12 lg:p-20 text-center space-y-8 relative overflow-hidden">
            {/* Glow Orb inside CTA card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-special leading-none">
                Ready for a smarter briefing?
              </h2>
              <p className="text-muted-foreground text-lg">
                Create a free account to customize your categories, filter paywalled sources, and access full AI-curated speech updates.
              </p>
              <div className="pt-4 flex justify-center">
                <Link to="/feed">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="px-10 py-5 bg-foreground text-background font-bold text-lg rounded-full flex items-center gap-4 hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/10 cursor-pointer"
                  >
                    Get Started Free
                    <div className="w-6 h-6 rounded-full bg-background/10 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-background" />
                    </div>
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-24 border-t border-border/50 text-xs text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-special tracking-tighter">NovaBrief</span>
            <span className="text-muted-foreground opacity-60">|</span>
            <span>© {new Date().getFullYear()} NovaBrief Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="#features" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#features" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#features" className="hover:text-foreground transition-colors">API Docs</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Github</a>
          </div>
        </footer>
      </section>
    </main>
  );
};

export default Home;
