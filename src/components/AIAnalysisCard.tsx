import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, Briefcase, Zap, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AIAnalysisCardProps {
    analysis: {
        summary: string;
        strengths: string[];
        weaknesses: string[];
        roadmap: string[];
        careerOutlook: string;
    };
    isLoading?: boolean;
}

export const AIAnalysisCard = ({ analysis, isLoading }: AIAnalysisCardProps) => {
    if (isLoading) {
        return (
            <Card className="glass-card overflow-hidden border-primary/20 bg-primary/5">
                <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                        <Brain className="w-12 h-12 text-primary animate-pulse" />
                        <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
                    </div>
                    <p className="text-primary font-medium animate-pulse">AI is analyzing your coding persona...</p>
                </CardContent>
            </Card>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            <Card className="glass-card overflow-hidden border-primary/30 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain className="w-24 h-24 text-primary" />
                </div>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Brain className="w-6 h-6 text-primary" />
                        <span className="gradient-text">AI Profile Intelligence</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <motion.p variants={item} className="text-lg text-foreground/90 leading-relaxed italic">
                        "{analysis.summary}"
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <motion.div variants={item} className="space-y-3">
                            <h3 className="flex items-center gap-2 font-bold text-emerald-400">
                                <Zap className="w-4 h-4" />
                                Key Strengths
                            </h3>
                            <ul className="space-y-2">
                                {analysis.strengths.map((s, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-muted-foreground bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                                        <span className="text-emerald-500">•</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Weaknesses/Improvement */}
                        <motion.div variants={item} className="space-y-3">
                            <h3 className="flex items-center gap-2 font-bold text-amber-400">
                                <AlertCircle className="w-4 h-4" />
                                Areas for Growth
                            </h3>
                            <ul className="space-y-2">
                                {analysis.weaknesses.map((w, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-muted-foreground bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                                        <span className="text-amber-400">•</span> {w}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Roadmap */}
                    <motion.div variants={item} className="space-y-4 pt-4 border-t border-border/50">
                        <h3 className="flex items-center gap-2 font-bold text-primary">
                            <Target className="w-5 h-5" />
                            Strategic Roadmap
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {analysis.roadmap.map((step, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                        {i + 1}
                                    </div>
                                    <span className="text-sm text-muted-foreground">{step}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Career Outlook */}
                    <motion.div variants={item} className="pt-4 mt-4 bg-primary/5 p-4 rounded-2xl border border-primary/20">
                        <h4 className="flex items-center gap-2 font-bold text-foreground mb-2">
                            <Briefcase className="w-4 h-4 text-primary" />
                            Career Potential
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {analysis.careerOutlook}
                        </p>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
