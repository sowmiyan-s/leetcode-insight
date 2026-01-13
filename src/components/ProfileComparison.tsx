import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus, Trophy, Target, Flame, Code, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnalysisResult } from '@/types/leetcode';
import { RadarChart } from './RadarChart';
import { cn } from '@/lib/utils';

interface ProfileComparisonProps {
  profileA: AnalysisResult;
  profileB: AnalysisResult;
}

const ComparisonStat = ({
  label,
  icon,
  valueA,
  valueB,
  suffix = '',
  higherIsBetter = true,
}: {
  label: string;
  icon: React.ReactNode;
  valueA: number;
  valueB: number;
  suffix?: string;
  higherIsBetter?: boolean;
}) => {
  const diff = valueA - valueB;
  const aWins = higherIsBetter ? diff > 0 : diff < 0;
  const bWins = higherIsBetter ? diff < 0 : diff > 0;
  const isDraw = diff === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 gap-4 items-center py-3 border-b border-border/30 last:border-b-0"
    >
      {/* Profile A Value */}
      <div className={cn(
        "text-right font-mono text-lg font-bold",
        aWins && "text-emerald-400",
        bWins && "text-muted-foreground"
      )}>
        <span className="flex items-center justify-end gap-1">
          {aWins && <ArrowUp className="w-4 h-4" />}
          {valueA.toLocaleString()}{suffix}
        </span>
      </div>

      {/* Label */}
      <div className="flex flex-col items-center text-center">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mb-1">
          {icon}
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
        {!isDraw && (
          <span className={cn(
            "text-xs font-mono mt-1",
            Math.abs(diff) > 0 && (aWins ? "text-emerald-400" : "text-red-400")
          )}>
            {diff > 0 ? '+' : ''}{diff.toLocaleString()}{suffix}
          </span>
        )}
      </div>

      {/* Profile B Value */}
      <div className={cn(
        "text-left font-mono text-lg font-bold",
        bWins && "text-emerald-400",
        aWins && "text-muted-foreground"
      )}>
        <span className="flex items-center gap-1">
          {valueB.toLocaleString()}{suffix}
          {bWins && <ArrowUp className="w-4 h-4" />}
        </span>
      </div>
    </motion.div>
  );
};

export const ProfileComparison = ({ profileA, profileB }: ProfileComparisonProps) => {
  const a = profileA.profile;
  const b = profileB.profile;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Headers */}
      <div className="grid grid-cols-2 gap-4">
        {[profileA, profileB].map((analysis, idx) => (
          <motion.div
            key={analysis.profile.username}
            initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 text-center"
          >
            <Avatar className="w-20 h-20 mx-auto mb-4 ring-2 ring-primary/30">
              <AvatarImage src={analysis.profile.avatar} />
              <AvatarFallback className="text-xl bg-primary/20">
                {analysis.profile.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-lg">{analysis.profile.username}</h3>
            {analysis.profile.realName && (
              <p className="text-sm text-muted-foreground">{analysis.profile.realName}</p>
            )}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
              <span className="text-xs text-muted-foreground">Score:</span>
              <span className="font-mono font-bold text-primary">{analysis.scores.overall}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dual Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-bold text-center mb-6">Skill Comparison</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="text-center">
            <RadarChart
              data={{
                consistency: profileA.scores.consistency,
                legitimacy: profileA.scores.legitimacy,
                diversity: profileA.scores.diversity,
                complexity: profileA.scores.complexity,
                accuracy: profileA.scores.accuracy,
              }}
              size={200}
              showLabels={true}
              securityColor="primary"
            />
            <p className="mt-2 text-sm font-medium text-primary">{a.username}</p>
          </div>
          <div className="hidden md:block text-4xl text-muted-foreground/30 font-bold">VS</div>
          <div className="text-center">
            <RadarChart
              data={{
                consistency: profileB.scores.consistency,
                legitimacy: profileB.scores.legitimacy,
                diversity: profileB.scores.diversity,
                complexity: profileB.scores.complexity,
                accuracy: profileB.scores.accuracy,
              }}
              size={200}
              showLabels={true}
              className="text-accent"
              securityColor="accent"
            />
            <p className="mt-2 text-sm font-medium text-accent">{b.username}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-bold text-center mb-6">Head-to-Head Stats</h3>
        
        <ComparisonStat
          label="Total Solved"
          icon={<Target className="w-4 h-4 text-primary" />}
          valueA={a.totalSolved}
          valueB={b.totalSolved}
        />
        <ComparisonStat
          label="Hard Problems"
          icon={<Code className="w-4 h-4 text-red-400" />}
          valueA={a.hardSolved}
          valueB={b.hardSolved}
        />
        <ComparisonStat
          label="Contest Rating"
          icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
          valueA={a.contestRating}
          valueB={b.contestRating}
        />
        <ComparisonStat
          label="Global Rank"
          icon={<Trophy className="w-4 h-4 text-amber-400" />}
          valueA={a.ranking}
          valueB={b.ranking}
          higherIsBetter={false}
        />
        <ComparisonStat
          label="Current Streak"
          icon={<Flame className="w-4 h-4 text-orange-400" />}
          valueA={a.streak}
          valueB={b.streak}
          suffix=" days"
        />
        <ComparisonStat
          label="Active Days"
          icon={<Target className="w-4 h-4 text-blue-400" />}
          valueA={a.activeDays}
          valueB={b.activeDays}
        />
      </motion.div>

      {/* Winner Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 text-center bg-gradient-to-br from-primary/10 to-accent/10"
      >
        {profileA.scores.overall > profileB.scores.overall ? (
          <>
            <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">
              {a.username} leads with {profileA.scores.overall - profileB.scores.overall} points!
            </h3>
          </>
        ) : profileB.scores.overall > profileA.scores.overall ? (
          <>
            <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">
              {b.username} leads with {profileB.scores.overall - profileA.scores.overall} points!
            </h3>
          </>
        ) : (
          <>
            <Minus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">It's a tie!</h3>
          </>
        )}
        <p className="text-muted-foreground">
          Both profiles show strong problem-solving skills. Keep grinding!
        </p>
      </motion.div>
    </motion.div>
  );
};
