import { Link } from 'react-router-dom';
import { Brain, ExternalLink } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur mt-20">
            <div className="container py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <Brain className="h-6 w-6 text-primary" />
                            <span className="text-lg font-bold tracking-tight">
                                LeetCode<span className="text-primary italic">Insight</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Advanced AI-powered profile analyzer for LeetCode enthusiasts.
                            Get deep insights into your problem-solving patterns and behavioral statistics.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a
                                    href="https://leetcode.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    LeetCode <ExternalLink className="h-3 w-3" />
                                </a>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} LeetCode Insight. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-widest">System Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
