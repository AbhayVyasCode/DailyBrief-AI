import { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { motion } from 'framer-motion';
import { Loader2, Play, RefreshCw } from 'lucide-react';
import { newsApi } from '../services/api';
import type { NewsItem } from '../services/types';

const Videos = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideoNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await newsApi.getTrendingVideos(20);
      setNews(response.videos);
    } catch (err) {
      console.error('Error fetching video news:', err);
      setError('Failed to fetch video news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoNews();
  }, []);

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
        <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-red-500/[0.04] to-pink-500/[0.03] rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tl from-orange-500/[0.04] to-red-500/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <header className="relative text-center max-w-3xl mx-auto pt-20 pb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 font-medium text-sm mb-6"
          >
            <Play className="w-4 h-4" />
            <span>Video News</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-[#0f172a] mb-4"
          >
            Watch What's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-pink-500">
              Trending
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg max-w-xl mx-auto"
          >
            Watch trending news videos from around the web.
          </motion.p>
        </header>

        {/* Refresh button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchVideoNews}
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
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
              <Loader2 className="w-10 h-10 animate-spin text-red-500 relative z-10" />
            </div>
            <p className="text-gray-400 animate-pulse text-sm font-medium">Curating top videos...</p>
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
                onClick={fetchVideoNews}
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
            <p className="text-gray-400 text-lg">No videos found.</p>
          </motion.div>
        )}

        {/* Video Grid */}
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

export default Videos;
