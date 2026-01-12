import { Link } from 'react-router-dom';
import { Brain, Sparkles } from 'lucide-react';

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <div className="relative">
                        <Brain className="h-8 w-8 text-primary" />
                        <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-accent animate-pulse" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        LeetCode<span className="text-primary italic">Insight</span>
                    </span>
                </Link>
                <nav className="flex items-center gap-6">
                    <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        Analyze
                    </Link>
                    <Link to="/privacy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        Privacy
                    </Link>
                    <a
                        href="https://leetcode.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        LeetCode
                    </a>
                </nav>
            </div>
        </header>
    );
};
