import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, Settings as SettingsIcon, Globe } from 'lucide-react';

const CATEGORIES = [
  'Technology', 'Business', 'Science', 'Health', 'Entertainment',
  'Sports', 'Politics', 'World', 'Environment', 'Finance',
  'Education', 'Travel', 'Food', 'Fashion', 'Art',
];

const Settings = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Technology', 'Science']);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dailybrief_preferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setSelectedCategories(prefs.categories || ['Technology', 'Science']);
    }
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setSaved(false);
  };

  const savePreferences = () => {
    localStorage.setItem('dailybrief_preferences', JSON.stringify({ categories: selectedCategories }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#f8f9fa]" />
        <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-violet-500/[0.04] to-purple-500/[0.03] rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tl from-indigo-500/[0.04] to-violet-500/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-8 pt-20 pb-16">
        {/* Header */}
        <header className="text-center mb-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-600 font-medium text-sm mb-5">
            <SettingsIcon className="w-4 h-4" />
            <span>Configuration</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-black tracking-tight text-[#0f172a] mb-3">
            Customize Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-500">Experience</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
            Tailor the interface and content to match your personal workflow.
          </motion.p>
        </header>

        {/* Settings Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0f172a]">Content Preferences</h2>
                <p className="text-xs text-gray-400">Select topics for your feed.</p>
              </div>
            </div>
            <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg">
              {selectedCategories.length} selected
            </span>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((category, i) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  selectedCategories.includes(category)
                    ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-md'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={savePreferences}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                saved
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-[#0f172a] text-white hover:bg-[#1e293b] shadow-md'
              }`}
            >
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.div key="saved" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Saved</span>
                  </motion.div>
                ) : (
                  <motion.div key="save" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
