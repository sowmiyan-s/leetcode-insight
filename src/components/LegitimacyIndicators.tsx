import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Indicator {
  label: string;
  status: 'good' | 'warning' | 'suspicious';
  description: string;
}

interface LegitimacyIndicatorsProps {
  indicators: Indicator[];
  overallScore: number;
}

export const LegitimacyIndicators = ({ indicators, overallScore }: LegitimacyIndicatorsProps) => {
  const getOverallStatus = (score: number) => {
    if (score >= 80) return { icon: ShieldCheck, label: 'Highly Authentic', color: 'text-emerald-400' };
    if (score >= 60) return { icon: Shield, label: 'Mostly Authentic', color: 'text-amber-400' };
    return { icon: ShieldAlert, label: 'Suspicious Patterns', color: 'text-red-400' };
  };

  const status = getOverallStatus(overallScore);
  const StatusIcon = status.icon;

  const getStatusIcon = (status: 'good' | 'warning' | 'suspicious') => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'suspicious':
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusBg = (status: 'good' | 'warning' | 'suspicious') => {
    switch (status) {
      case 'good':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'suspicious':
        return 'bg-red-500/10 border-red-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Legitimacy Analysis</h3>
        <div className={cn("flex items-center gap-2", status.color)}>
          <StatusIcon className="w-5 h-5" />
          <span className="text-sm font-medium">{status.label}</span>
        </div>
      </div>

      <div className="space-y-3">
        {indicators.map((indicator, index) => (
          <motion.div
            key={indicator.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border",
              getStatusBg(indicator.status)
            )}
          >
            {getStatusIcon(indicator.status)}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{indicator.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{indicator.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border/50">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            This analysis is based on patterns in submission history, problem-solving consistency, 
            and typical behavior metrics. It's not a definitive determination but rather an indicator 
            of profile authenticity.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
