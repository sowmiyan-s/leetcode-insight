import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const TrustCounter = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const { count } = await supabase
        .from('searches')
        .select('*', { count: 'exact', head: true });
      setCount(count ?? 0);
    };
    load();
  }, []);

  const display = count === null ? '—' : count.toLocaleString();

  const items = [
    { icon: Users, label: 'Profiles Analyzed', value: display },
    { icon: TrendingUp, label: 'Real-time LeetCode Data', value: 'Live' },
    { icon: Sparkles, label: 'AI Insights', value: 'Included' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8 grid grid-cols-3 gap-3 max-w-2xl mx-auto"
    >
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="glass-card px-3 py-3 flex flex-col items-center text-center"
        >
          <Icon className="w-4 h-4 text-primary mb-1" />
          <div className="text-base md:text-lg font-bold text-foreground leading-none">
            {value}
          </div>
          <div className="text-[10px] md:text-xs text-muted-foreground mt-1 leading-tight">
            {label}
          </div>
        </div>
      ))}
    </motion.div>
  );
};
