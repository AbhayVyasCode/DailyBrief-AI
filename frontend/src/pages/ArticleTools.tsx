import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Languages, Volume2, Loader2, Copy, Check, Link as LinkIcon, Sparkles } from 'lucide-react';
import newsApi from '../services/api';

const ArticleTools = () => {
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'summarize' | 'translate' | 'speak'>('summarize');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<'hi' | 'en'>('hi');
  const [textToSpeak, setTextToSpeak] = useState('');
  const [speakLanguage, setSpeakLanguage] = useState<'hi' | 'en'>('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!url) { setError('Please enter a valid article URL'); return; }
    setLoading(true); setError('');
    try {
      const response = await newsApi.summarizeArticle(url);
      setSummary(response.summary);
      setArticleTitle(response.title || 'Article Summary');
    } catch (err: any) { setError(err.response?.data?.detail || 'Failed to summarize article'); }
    finally { setLoading(false); }
  };

  const handleTranslate = async () => {
    if (!summary && !translatedText) { setError('Please summarize the article first'); return; }
    setLoading(true); setError('');
    try {
      const response = await newsApi.translateText(summary || translatedText, targetLanguage);
      setTranslatedText(response.translated_text);
    } catch (err: any) { setError(err.response?.data?.detail || 'Failed to translate'); }
    finally { setLoading(false); }
  };

  const handleSpeak = async () => {
    const text = textToSpeak || translatedText || summary;
    if (!text) { setError('No text available to speak.'); return; }
    setLoading(true); setError(''); setIsPlaying(true);
    try {
      const audioBlob = await newsApi.speakText(text, speakLanguage);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => { setIsPlaying(false); URL.revokeObjectURL(audioUrl); };
    } catch (err: any) { setError(err.response?.data?.detail || 'Failed to generate speech'); setIsPlaying(false); }
    finally { setLoading(false); }
  };

  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#f8f9fa]" />
        <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-500/[0.04] to-purple-500/[0.03] rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tl from-indigo-500/[0.04] to-blue-500/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-8 pt-20 pb-16">
        {/* Header */}
        <header className="text-center mb-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4255d4]/10 text-[#4255d4] font-medium text-sm mb-5">
            <Sparkles className="w-4 h-4" />
            <span>AI Tools</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-black tracking-tight text-[#0f172a] mb-3">
            AI Article <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4255d4] to-[#a855f7]">Tools</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
            Transform how you consume news with our suite of AI-powered tools.
          </motion.p>
        </header>

        {/* Main Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* URL Input */}
          <div className="p-6 border-b border-gray-100">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Article URL</label>
            <div className="relative group">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4255d4] transition-colors" />
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste any article URL here..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4255d4]/20 focus:border-[#4255d4] transition-all text-sm" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            {[
              { id: 'summarize' as const, label: 'Summarize', icon: FileText },
              { id: 'translate' as const, label: 'Translate', icon: Languages },
              { id: 'speak' as const, label: 'Smart Reader', icon: Volume2 },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-[#4255d4]' : 'text-gray-400 hover:text-gray-600'}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 inset-x-0 h-[2px] bg-[#4255d4] rounded-full" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 min-h-[350px]">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                  {error}
                </motion.div>
              )}

              {activeTab === 'summarize' && (
                <motion.div key="summarize" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5">
                  <div className="text-center py-6">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-3"><FileText className="w-6 h-6" /></div>
                    <h3 className="text-lg font-bold text-[#0f172a] mb-1">Get the Gist Instantly</h3>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto">Our AI analyzes the article and creates a concise summary.</p>
                  </div>
                  <button onClick={handleSummarize} disabled={loading || !url} className="w-full bg-[#0f172a] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1e293b] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4" /> Generate Summary</>}
                  </button>
                  {summary && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                        <h3 className="font-bold text-sm text-[#0f172a] line-clamp-1">{articleTitle}</h3>
                        <button onClick={() => copyToClipboard(summary)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{summary}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'translate' && (
                <motion.div key="translate" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setTargetLanguage('hi')} className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold flex flex-col items-center gap-1 ${targetLanguage === 'hi' ? 'border-[#4255d4] bg-[#4255d4]/5 text-[#4255d4]' : 'border-gray-200 bg-white hover:border-gray-300 text-gray-400'}`}>
                      <span className="text-xl">अ</span>Hindi
                    </button>
                    <button onClick={() => setTargetLanguage('en')} className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold flex flex-col items-center gap-1 ${targetLanguage === 'en' ? 'border-[#4255d4] bg-[#4255d4]/5 text-[#4255d4]' : 'border-gray-200 bg-white hover:border-gray-300 text-gray-400'}`}>
                      <span className="text-xl">A</span>English
                    </button>
                  </div>
                  <button onClick={handleTranslate} disabled={loading || (!summary && !translatedText)} className="w-full bg-[#0f172a] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1e293b] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Translating...</> : <><Languages className="w-4 h-4" /> Translate</>}
                  </button>
                  {translatedText && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-sm text-[#0f172a]">Translation</h3>
                        <button onClick={() => copyToClipboard(translatedText)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{translatedText}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'speak' && (
                <motion.div key="speak" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5">
                  <div className="flex justify-center gap-2 bg-gray-100 p-1 rounded-xl w-fit mx-auto">
                    <button onClick={() => setSpeakLanguage('en')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${speakLanguage === 'en' ? 'bg-white shadow-sm text-[#0f172a]' : 'text-gray-400'}`}>English</button>
                    <button onClick={() => setSpeakLanguage('hi')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${speakLanguage === 'hi' ? 'bg-white shadow-sm text-[#0f172a]' : 'text-gray-400'}`}>Hindi</button>
                  </div>
                  <textarea value={textToSpeak} onChange={(e) => setTextToSpeak(e.target.value)} placeholder="Enter text to speak, or generate a summary first..." className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#4255d4]/20 text-sm leading-relaxed" />
                  <button onClick={handleSpeak} disabled={loading || isPlaying || (!textToSpeak && !translatedText && !summary)} className={`w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${isPlaying ? 'bg-red-500 text-white' : 'bg-[#0f172a] text-white hover:bg-[#1e293b]'} disabled:opacity-50`}>
                    {loading || isPlaying ? <><Loader2 className="w-4 h-4 animate-spin" /> {isPlaying ? 'Playing...' : 'Generating...'}</> : <><Volume2 className="w-4 h-4" /> Read Aloud</>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleTools;
