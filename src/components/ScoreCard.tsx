import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  score: number;
  label: string;
  description: string;
  delay?: number;
}

export const ScoreCard = ({ score, label, description, delay = 0 }: ScoreCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-emerald-500/5';
    if (score >= 60) return 'from-amber-500/20 to-amber-500/5';
    if (score >= 40) return 'from-orange-500/20 to-orange-500/5';
    return 'from-red-500/20 to-red-500/5';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "glass-card p-6 relative overflow-hidden",
        "bg-gradient-to-br",
        getScoreGradient(score)
      )}
    >
      {/* Score circle */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-muted"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeLinecap="round"
              className={getScoreColor(score)}
              initial={{ strokeDasharray: "0 226" }}
              animate={{ strokeDasharray: `${(score / 100) * 226} 226` }}
              transition={{ duration: 1, delay: delay + 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className={cn("text-2xl font-bold font-mono", getScoreColor(score))}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.5 }}
            >
              {score}
            </motion.span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{label}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};
