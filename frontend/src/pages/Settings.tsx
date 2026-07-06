import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Check, Layout, Globe } from "lucide-react";

const CATEGORIES = [
  "Technology", "Business", "Science", "Health", "Entertainment",
  "Sports", "Politics", "World", "Environment", "Finance",
  "Education", "Travel", "Food", "Fashion", "Art",
];

const Settings = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Technology", "Science"]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("novabrief_preferences");
    if (saved) {
      const prefs = JSON.parse(saved);
      setSelectedCategories(prefs.categories || ["Technology", "Science"]);
    }
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setSaved(false);
  };

  const savePreferences = () => {
    localStorage.setItem(
      "novabrief_preferences",
      JSON.stringify({ categories: selectedCategories })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 py-8 pb-20">
      <header className="relative z-10 space-y-4 mb-12 text-center md:text-left">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
        >
          <Layout className="w-3 h-3" />
          <span>Configuration</span>
        </motion.div>
        
        <motion.h1
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="text-4xl md:text-5xl font-bold tracking-tight text-special"
        >
          Customize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Experience</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-2xl"
        >
          Tailor the interface and content to match your personal workflow.
        </motion.p>
      </header>

      <div className="max-w-3xl mx-auto">
        {/* Interests Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
        >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-special">Content Preferences</h2>
                            <p className="text-sm text-muted-foreground">Select topics for your feed.</p>
                        </div>
                    </div>
                    <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">
                        {selectedCategories.length} selected
                    </span>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-wrap gap-3"
                >
                    {CATEGORIES.map((category) => (
                    <motion.button
                        key={category}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleCategory(category)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        selectedCategories.includes(category)
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                            : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-foreground"
                        }`}
                    >
                        {category}
                    </motion.button>
                    ))}
                </motion.div>

                <div className="mt-10 flex justify-end">
                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={savePreferences}
                        className={`relative overflow-hidden flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                        saved
                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-primary/30"
                        }`}
                    >
                        <AnimatePresence mode="wait">
                            {saved ? (
                                <motion.div
                                    key="saved"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>Changes Saved</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="save"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Save Preferences</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
