import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Calendar } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import { newsApi } from '../services/api';
import type { NewsItem } from '../services/types';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setSearched(true); setError(null);
    try {
      const response = await newsApi.searchNews(query, date || undefined);
      setNews(response.news);
    } catch (err) { setError('Failed to search. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#f8f9fa]" />
        <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/[0.04] to-teal-500/[0.03] rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tl from-blue-500/[0.04] to-cyan-500/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-8 pt-20 pb-16">
        {/* Header */}
        <header className="text-center mb-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium text-sm mb-5">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-black tracking-tight text-[#0f172a] mb-3">
            Search <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">News</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
            Search for any topic and get AI-curated results.
          </motion.p>
        </header>

        {/* Search Form */}
        <motion.form initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onSubmit={handleSearch} className="max-w-2xl mx-auto space-y-3 mb-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#4255d4] transition-colors" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for any news topic..." className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4255d4]/20 focus:border-[#4255d4] transition-all text-sm" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4255d4]/20 focus:border-[#4255d4] transition-all text-sm" />
            </div>
            <button type="submit" disabled={loading || !query.trim()} className="px-8 py-3 bg-[#0f172a] text-white rounded-xl font-semibold text-sm hover:bg-[#1e293b] transition-colors disabled:opacity-50 flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </div>
        </motion.form>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#4255d4]" />
            <p className="text-gray-400 text-sm">Searching with AI...</p>
          </div>
        )}

        {/* Error */}
        {error && <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100"><p className="text-red-600 font-medium text-sm">{error}</p></div>}

        {/* Empty */}
        {!loading && searched && news.length === 0 && !error && <div className="text-center py-16"><p className="text-gray-400 text-sm">No results found for "{query}"</p></div>}

        {/* Results */}
        {!loading && news.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-sm font-bold text-[#0f172a] mb-4">Found {news.length} results for "{query}"</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {news.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <NewsCard index={index} title={item.title} summary={item.summary} source={item.source} date={item.published_at} category={item.category} url={item.url} imageUrl={item.image_url} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
