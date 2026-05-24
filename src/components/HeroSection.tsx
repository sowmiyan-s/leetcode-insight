import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Sparkles, GitCompare } from 'lucide-react';
import { SearchHistory } from './SearchHistory';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSectionProps {
  onAnalyze: (username: string) => void;
  onCompare?: (usernameA: string, usernameB: string) => void;
  isLoading: boolean;
  initialUsername?: string;
  onUsernameAnalyzed?: (username: string, avatar?: string) => void;
}

export const HeroSection = ({ 
  onAnalyze, 
  onCompare,
  isLoading, 
  initialUsername,
  onUsernameAnalyzed 
}: HeroSectionProps) => {
  const [url, setUrl] = useState(initialUsername || '');
  const [compareUrl, setCompareUrl] = useState('');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'primary' | 'compare' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { history, removeFromHistory, clearHistory } = useSearchHistory();

  useEffect(() => {
    if (initialUsername) setUrl(initialUsername);
  }, [initialUsername]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false);
        setFocusedInput(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const extractUsername = (input: string): string => {
    const urlMatch = input.match(/leetcode\.com\/(?:u\/)?([^\/\s]+)/);
    if (urlMatch) return urlMatch[1];
    return input.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = extractUsername(url);
    if (!username) return;

    if (isCompareMode && compareUrl.trim()) {
      const usernameB = extractUsername(compareUrl);
      if (usernameB && onCompare) onCompare(username, usernameB);
    } else {
      onAnalyze(username);
      onUsernameAnalyzed?.(username);
    }
    setShowHistory(false);
  };

  const handleHistorySelect = (username: string) => {
    if (focusedInput === 'compare') {
      setCompareUrl(username);
    } else {
      setUrl(username);
      if (!isCompareMode) {
        onAnalyze(username);
        onUsernameAnalyzed?.(username);
      }
    }
    setShowHistory(false);
  };

  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center px-4 pt-16 md:pt-20 pb-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow" />
      </div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />AI-Enhanced Analysis
        </span>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-6xl font-bold text-center mb-4 tracking-tight max-w-3xl">
        Verify & <span className="gradient-text">Showcase</span> Your LeetCode Talent
      </motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-base md:text-xl text-muted-foreground text-center max-w-2xl mb-8 px-4">
        Instantly score any LeetCode profile on consistency, complexity, and authenticity — then share a polished report card with the world.
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-4">
        <Button type="button" variant={isCompareMode ? "default" : "outline"} size="sm" onClick={() => setIsCompareMode(!isCompareMode)} className="gap-2">
          <GitCompare className="w-4 h-4" />{isCompareMode ? 'Exit Compare' : 'Compare Profiles'}
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-xl relative" ref={containerRef}>
        <form onSubmit={handleSubmit} className="glass-card p-2 flex flex-col gap-2">
          <div className="flex gap-2">
            <Input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onFocus={() => { setFocusedInput('primary'); setShowHistory(true); }} placeholder={isCompareMode ? "First username" : "Enter LeetCode username or URL"} className="flex-1 border-0 bg-transparent focus-visible:ring-0" disabled={isLoading} />
            {!isCompareMode && (
              <Button type="submit" variant="gradient" size="lg" disabled={!url.trim() || isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /><span className="hidden sm:inline">Analyze</span></>}
              </Button>
            )}
          </div>
          <AnimatePresence>
            {isCompareMode && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex gap-2">
                <Input type="text" value={compareUrl} onChange={(e) => setCompareUrl(e.target.value)} onFocus={() => { setFocusedInput('compare'); setShowHistory(true); }} placeholder="Second username to compare" className="flex-1 border-0 bg-transparent focus-visible:ring-0" disabled={isLoading} />
                <Button type="submit" variant="gradient" size="lg" disabled={!url.trim() || !compareUrl.trim() || isLoading}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><GitCompare className="w-5 h-5" /><span className="hidden sm:inline">Compare</span></>}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        <SearchHistory history={history} onSelect={handleHistorySelect} onRemove={removeFromHistory} onClear={clearHistory} isVisible={showHistory && focusedInput !== null} />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 flex flex-wrap justify-center items-center gap-2">
        <span className="text-sm text-muted-foreground">Try an example:</span>
        {['neal_wu', 'tourist', 'jiangly'].map((name) => (
          <button
            key={name}
            onClick={() => { setUrl(name); onAnalyze(name); onUsernameAnalyzed?.(name); }}
            className="text-sm px-3 py-1 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary transition-colors font-mono"
            disabled={isLoading}
          >
            {name}
          </button>
        ))}
      </motion.div>
    </section>
  );
};
