import { motion } from 'framer-motion';
import { Trophy, Target, Flame, Calendar, Code, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  delay?: number;
  variant?: 'default' | 'easy' | 'medium' | 'hard';
}

const StatItem = ({ icon, label, value, subValue, delay = 0, variant = 'default' }: StatItemProps) => {
  const variantStyles = {
    default: 'text-foreground',
    easy: 'stat-easy',
    medium: 'stat-medium',
    hard: 'stat-hard',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-5 flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground truncate">{label}</p>
        <p className={cn("text-2xl font-bold font-mono", variantStyles[variant])}>{value}</p>
        {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
      </div>
    </motion.div>
  );
};

interface StatsGridProps {
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
    streak: number;
    activeDays: number;
    contestRating: number;
  };
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatItem
        icon={<Target className="w-6 h-6 text-primary" />}
        label="Total Solved"
        value={stats.totalSolved}
        delay={0.1}
      />
      <StatItem
        icon={<Trophy className="w-6 h-6 text-amber-400" />}
        label="Global Ranking"
        value={`#${stats.ranking.toLocaleString()}`}
        delay={0.15}
      />
      <StatItem
        icon={<Flame className="w-6 h-6 text-orange-400" />}
        label="Current Streak"
        value={`${stats.streak} days`}
        delay={0.2}
      />
      <StatItem
        icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
        label="Contest Rating"
        value={stats.contestRating}
        delay={0.25}
      />
      <StatItem
        icon={<Code className="w-6 h-6 text-emerald-400" />}
        label="Easy"
        value={stats.easySolved}
        variant="easy"
        delay={0.3}
      />
      <StatItem
        icon={<Code className="w-6 h-6 text-amber-400" />}
        label="Medium"
        value={stats.mediumSolved}
        variant="medium"
        delay={0.35}
      />
      <StatItem
        icon={<Code className="w-6 h-6 text-red-400" />}
        label="Hard"
        value={stats.hardSolved}
        variant="hard"
        delay={0.4}
      />
      <StatItem
        icon={<Calendar className="w-6 h-6 text-blue-400" />}
        label="Active Days"
        value={stats.activeDays}
        delay={0.45}
      />
    </div>
  );
};
