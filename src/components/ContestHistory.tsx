import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, Trophy } from 'lucide-react';

export interface ContestHistoryEntry {
  contestTitle: string;
  rating: number;
  ranking: number;
  date: string;
}

interface ContestHistoryProps {
  history: ContestHistoryEntry[];
  currentRating: number;
}

export const ContestHistory = ({ history, currentRating }: ContestHistoryProps) => {
  if (!history || history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Contest Rating History
        </h3>
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          No contest history available. Participate in contests to see your rating progression!
        </div>
      </motion.div>
    );
  }

  // Calculate stats
  const ratings = history.map((h) => h.rating);
  const maxRating = Math.max(...ratings);
  const minRating = Math.min(...ratings);
  const avgRating = Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
  const trend = history.length >= 2 
    ? history[history.length - 1].rating - history[0].rating 
    : 0;

  // Format data for chart (reverse to show oldest first)
  const chartData = [...history].reverse().map((entry, index) => ({
    name: `#${index + 1}`,
    rating: Math.round(entry.rating),
    contest: entry.contestTitle,
    ranking: entry.ranking,
    date: entry.date,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-border/50 shadow-xl">
          <p className="font-semibold text-sm">{data.contest}</p>
          <p className="text-primary font-mono text-lg">{data.rating}</p>
          <p className="text-xs text-muted-foreground">Rank: #{data.ranking?.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{data.date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Contest Rating History
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="font-mono font-bold text-primary">{currentRating}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Peak</p>
            <p className="font-mono font-bold text-emerald-400">{Math.round(maxRating)}</p>
          </div>
          <div className={`flex items-center gap-1 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-mono">{trend >= 0 ? '+' : ''}{Math.round(trend)}</span>
          </div>
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={11}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={11}
              tickLine={false}
              domain={[Math.floor(minRating * 0.95), Math.ceil(maxRating * 1.05)]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={avgRating} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="5 5" 
              opacity={0.5}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <span>Contests: {history.length}</span>
        <span>Avg: {avgRating}</span>
        <span>Low: {Math.round(minRating)}</span>
      </div>
    </motion.div>
  );
};
