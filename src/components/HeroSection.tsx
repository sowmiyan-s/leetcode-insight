import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onAnalyze: (username: string) => void;
  isLoading: boolean;
}

export const HeroSection = ({ onAnalyze, isLoading }: HeroSectionProps) => {
  const [url, setUrl] = useState('');

  const extractUsername = (input: string): string => {
    // Handle full URL or just username
    const urlMatch = input.match(/leetcode\.com\/(?:u\/)?([^\/\s]+)/);
    if (urlMatch) return urlMatch[1];
    return input.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = extractUsername(url);
    if (username) {
      onAnalyze(username);
    }
  };

  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 pt-20 pb-10">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow" />
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 tracking-tight">
        <span className="gradient-text">LeetCode</span>{' '}
        <span className="text-foreground">Profile Analyzer</span>
        <div className="flex justify-center mt-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest animate-pulse">
            <Sparkles className="w-3 h-3" />
            AI-Enhanced Intelligence
          </span>
        </div>
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-10">
        Get deep insights into any LeetCode profile. Analyze problem-solving patterns,
        language expertise, and authenticity scores.
      </p>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl relative">
        <div className="glass-card p-2 flex gap-2">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter LeetCode username or profile URL"
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            disabled={!url.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Analyze</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Example usernames */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <span className="text-sm text-muted-foreground">Try:</span>
        {['neal_wu', 'tourist', 'jiangly'].map((name) => (
          <button
            key={name}
            onClick={() => {
              setUrl(name);
              onAnalyze(name);
            }}
            className="text-sm text-primary hover:text-accent transition-colors font-mono"
            disabled={isLoading}
          >
            {name}
          </button>
        ))}
      </div>
    </section>
  );
};
