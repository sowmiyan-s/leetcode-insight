import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface SubmissionHeatmapProps {
  submissions: { date: string; count: number }[];
}

export const SubmissionHeatmap = ({ submissions }: SubmissionHeatmapProps) => {
  const submissionMap = useMemo(() => {
    const map = new Map<string, number>();
    submissions.forEach(s => map.set(s.date, s.count));
    return map;
  }, [submissions]);

  const weeks = useMemo(() => {
    const weeksData: { date: Date; count: number }[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 365);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let currentWeek: { date: Date; count: number }[] = [];
    const current = new Date(startDate);

    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      currentWeek.push({
        date: new Date(current),
        count: submissionMap.get(dateStr) || 0,
      });

      if (current.getDay() === 6) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }

      current.setDate(current.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeksData.push(currentWeek);
    }

    return weeksData;
  }, [submissionMap]);

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-secondary';
    if (count <= 2) return 'bg-emerald-900/60';
    if (count <= 5) return 'bg-emerald-700/70';
    if (count <= 10) return 'bg-emerald-500/80';
    return 'bg-emerald-400';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', '', 'Tue', '', 'Thu', '', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-card p-6 overflow-hidden"
    >
      <h3 className="text-lg font-semibold mb-4">Submission Activity</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Month labels */}
          <div className="flex mb-2 ml-8">
            {weeks.map((week, i) => {
              if (i % 4 === 0 && week[0]) {
                return (
                  <span key={i} className="text-xs text-muted-foreground w-12">
                    {months[week[0].date.getMonth()]}
                  </span>
                );
              }
              return null;
            })}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              {days.map((day, i) => (
                <span key={i} className="text-xs text-muted-foreground h-3 leading-3">
                  {day}
                </span>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: 0.4 + weekIndex * 0.01,
                      }}
                      className={cn(
                        "w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125",
                        getIntensity(day.count)
                      )}
                      title={`${day.date.toDateString()}: ${day.count} submissions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-secondary" />
              <div className="w-3 h-3 rounded-sm bg-emerald-900/60" />
              <div className="w-3 h-3 rounded-sm bg-emerald-700/70" />
              <div className="w-3 h-3 rounded-sm bg-emerald-500/80" />
              <div className="w-3 h-3 rounded-sm bg-emerald-400" />
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
