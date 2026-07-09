import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from '../components/NewsCard';
import { newsApi } from '../services/api';
import type { NewsItem } from '../services/types';
import { Loader2, TrendingUp, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { id: 'All', icon: '🔥' },
  { id: 'General', icon: '📰' },
  { id: 'Technology', icon: '💻' },
  { id: 'Business', icon: '💼' },
  { id: 'Science', icon: '🔬' },
  { id: 'Health', icon: '🏥' },
  { id: 'Entertainment', icon: '🎬' },
  { id: 'Sports', icon: '⚽' },
];

const Trends = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await newsApi.getTrends(category);
      setNews(response.news);
    } catch (err) {
      console.error('Error fetching trends:', err);
      setError('Failed to fetch trending news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <header className="relative text-center max-w-3xl mx-auto mb-12 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Trending Now</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-special mb-4"
        >
          Discover What's{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
            Hot
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto"
        >
          Top stories across 30+ categories, updated in real-time.
        </motion.p>
      </header>

      {/* Category Pills */}
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex flex-wrap items-center justify-center gap-2 p-2 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              {selectedCategory === cat.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-[#4255d4] to-[#6366f1] rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="text-xs">{cat.icon}</span>
                {cat.id}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Refresh button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchTrends(selectedCategory)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 border border-gray-200/50 rounded-full transition-colors disabled:opacity-50 text-sm font-medium text-gray-600"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </motion.button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <Loader2 className="w-10 h-10 animate-spin text-primary relative z-10" />
          </div>
          <p className="text-muted-foreground animate-pulse text-lg font-medium">
            Curating {selectedCategory === 'All' ? 'trending' : selectedCategory} stories...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="bg-destructive/10 text-destructive p-8 rounded-2xl max-w-md mx-auto border border-destructive/20">
            <p className="font-semibold text-lg mb-3">Something went wrong</p>
            <p className="mb-5 opacity-90 text-sm">{error}</p>
            <button
              onClick={() => fetchTrends(selectedCategory)}
              className="px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors shadow-lg"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      )}

      {/* News Grid */}
      {!loading && !error && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
        </AnimatePresence>
      )}

      {/* Empty State */}
      {!loading && !error && news.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <p className="text-muted-foreground text-xl">No stories found in this category.</p>
        </motion.div>
      )}
    </div>
  );
};

export default Trends;
