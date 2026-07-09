import { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, Zap, Search, ArrowRight } from 'lucide-react';
import { newsApi } from '../services/api';
import type { NewsItem } from '../services/types';

const Feed = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [query, setQuery] = useState('');

  const fetchNews = async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      let categories: string[] = ['Technology', 'World'];
      const savedPrefs = localStorage.getItem('dailybrief_preferences');
      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          if (parsed.categories && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
            categories = parsed.categories;
          }
        } catch (e) {
          console.error('Failed to parse preferences', e);
        }
      }

      if (search) {
        const response = await newsApi.searchNews(search);
        setNews(response.news);
      } else {
        const response = await newsApi.getFeed(categories);
        setNews(response.news);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
      fetchNews(query);
    }
  };

  const handleRefresh = () => {
    fetchNews(searchQuery || undefined);
  };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#f8f9fa]" />
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-500/[0.04] to-indigo-500/[0.03] rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tl from-purple-500/[0.04] to-pink-500/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <header className="relative text-center max-w-3xl mx-auto pt-20 pb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4255d4]/10 text-[#4255d4] font-medium text-sm mb-6"
          >
            <Zap className="w-4 h-4" />
            <span>Live AI News Feed</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-[#0f172a] mb-4"
          >
            Discover the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4255d4] via-[#6366f1] to-[#a855f7]">
              Extraordinary
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg max-w-xl mx-auto"
          >
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : "AI-curated insights from the world's most trusted sources."}
          </motion.p>
        </header>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto sticky top-20 z-20"
        >
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#4255d4] transition-colors" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for news topics..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4255d4]/20 focus:border-[#4255d4] transition-all text-sm"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3.5 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={loading}
              className="p-3.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50 text-gray-500"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </form>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-[#4255d4]/20 blur-xl rounded-full animate-pulse" />
              <Loader2 className="w-10 h-10 animate-spin text-[#4255d4] relative z-10" />
            </div>
            <p className="text-gray-400 animate-pulse text-sm font-medium">Curating your feed...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md mx-auto border border-red-100">
              <p className="font-semibold text-lg mb-2">Something went wrong</p>
              <p className="mb-5 opacity-80 text-sm">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-gray-400 text-lg">No stories found. Try exploring a different topic.</p>
          </motion.div>
        )}

        {/* News Grid */}
        {!loading && !error && news.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2"
          >
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NewsCard
                  index={index}
                  title={item.title}
                  summary={item.summary}
                  source={item.source}
                  date={item.published_at}
                  category={item.category}
                  url={item.url}
                  imageUrl={item.image_url}
                  sentiment={item.sentiment}
                  sentimentScore={item.sentiment_score}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feed;
