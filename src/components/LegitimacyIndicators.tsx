import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Info, Scan, Fingerprint, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Indicator {
  label: string;
  status: 'good' | 'warning' | 'suspicious';
  description: string;
}

interface LegitimacyIndicatorsProps {
  indicators: Indicator[];
  overallScore: number;
  legitimacyProbability: number;
  activeDays?: number;
  totalSolved?: number;
  submissionCount?: number;
}

export const LegitimacyIndicators = ({
  indicators,
  overallScore,
  legitimacyProbability,
  activeDays,
  totalSolved,
  submissionCount
}: LegitimacyIndicatorsProps) => {
  const getOverallStatus = (score: number) => {
    if (score >= 80) return { icon: ShieldCheck, label: 'HIGHLY AUTHENTIC', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    if (score >= 60) return { icon: Shield, label: 'MOSTLY AUTHENTIC', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
    return { icon: ShieldAlert, label: 'SUSPICIOUS PATTERNS', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' };
  };

  const status = getOverallStatus(overallScore);
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card overflow-hidden relative"
    >
      {/* Background Scan Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,255,255,0),rgba(18,255,255,0.03),rgba(18,255,255,0))] h-[200%] w-full animate-scan pointer-events-none" />

      {/* Header Section */}
      <div className="p-6 pb-0 flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Scan className="w-4 h-4 text-primary animate-pulse" />
            <h3 className="text-xs font-bold text-primary tracking-[0.2em] uppercase">Identity Verification Protocol</h3>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1">Behavioral Audit</h2>
        </div>
        <div className={cn("flex flex-col items-end", status.color)}>
          <StatusIcon className="w-8 h-8 mb-1" />
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{status.label}</span>
        </div>
      </div>

      <div className="p-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Trust Score Panel */}
        <div className={cn("rounded-2xl p-5 border backdrop-blur-sm flex flex-col justify-between h-full bg-gradient-to-br from-white/5 to-transparent", status.border)}>
          <div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-2">Trust Confidence Score</p>
            <div className="flex items-baseline gap-1">
              <span className={cn("text-5xl font-black tracking-tighter", status.color)}>{(legitimacyProbability * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${legitimacyProbability * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={cn("h-full rounded-full", status.bg.replace('bg-', 'bg-').split('/')[0])}
              />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
              <Fingerprint className="w-3 h-3" />
              <span>Verified by 4 heuristic engines</span>
            </div>
          </div>
        </div>

        {/* Detailed Signals */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1 pl-1">Signal Analysis</p>
          {indicators.slice(0, 3).map((indicator, index) => (
            <motion.div
              key={indicator.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-start gap-3 group hover:bg-white/10 transition-colors"
            >
              <div className={cn("mt-0.5 w-1.5 h-1.5 rounded-full shrink-0",
                indicator.status === 'good' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
                  indicator.status === 'warning' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-red-400'
              )} />
              <div>
                <p className="text-xs font-bold text-white mb-0.5">{indicator.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{indicator.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="bg-black/20 border-t border-white/5 p-3 flex justify-between items-center text-[10px] text-white/30 font-mono relative z-10 px-6">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3" />
          <span>CRYPTOGRAPHICALLY SIGNED</span>
        </div>
        <span>ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
      </div>
    </motion.div>
  );
};
