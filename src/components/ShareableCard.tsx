import { forwardRef } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Trophy, Target, Flame, Code2, Star, Award, Brain, Zap, Globe, Fingerprint } from 'lucide-react';
import { LegitimacyIndicator } from '@/types/leetcode';
import { RadarChart } from '@/components/RadarChart';

interface ShareableCardProps {
  username: string;
  avatar?: string;
  scores: {
    overall: number;
    consistency: number;
    diversity: number;
    legitimacy: number;
    complexity: number;
    accuracy: number;
  };
  legitimacyProbability?: number;
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking?: number;
    streak: number;
    contestRating?: number;
    languages?: { name: string; value: number }[];
  };
  aiAnalysis?: {
    summary: string;
    cognitive_synthesis?: string;
    strengths: string[];
    weaknesses: string[];
    roadmap: string[];
    careerOutlook: string;
  };
  indicators: LegitimacyIndicator[];
}

const getPersona = (scores: { consistency: number; diversity: number; legitimacy: number; overall: number }) => {
  if (scores.legitimacy < 45) return "The Initial Observer";
  if (scores.overall > 90) return "The Grandmaster";
  if (scores.overall > 80) return "The Elite Architect";
  if (scores.overall > 65) return "Expert Problem Solver";
  if (scores.overall > 40) return "Advanced Challenger";
  return "Rising Challenger";
};

const getRoleBadge = (overall: number) => {
  if (overall > 90) return "GRADMASTER";
  if (overall > 80) return "ELITE";
  if (overall > 65) return "EXPERT";
  if (overall > 40) return "ADVANCED";
  return "CHALLENGER";
};

const getSecurityLevel = (legitimacy: number) => {
  if (legitimacy >= 85) return {
    label: 'SECURE',
    description: 'LEGITIMATE USER PORTFOLIO',
    color: 'emerald-500',
    bg: 'bg-emerald-500',
    icon: ShieldCheck
  };
  if (legitimacy >= 60) return {
    label: 'MODERATE',
    description: 'CREDIBLE ACTIVITY PATTERNS',
    color: 'amber-500',
    bg: 'bg-amber-500',
    icon: Shield
  };
  return {
    label: 'RISK DETECTED',
    description: 'UNUSUAL BEHAVIORAL DATA',
    color: 'red-500',
    bg: 'bg-red-500',
    icon: ShieldAlert
  };
};

export const ShareableCard = forwardRef<HTMLDivElement, ShareableCardProps>(
  ({ username, avatar, scores, legitimacyProbability, stats, aiAnalysis, indicators }, ref) => {
    const persona = getPersona(scores);
    const security = getSecurityLevel(scores.legitimacy);
    const SecurityIcon = security.icon;

    // Deterministic Cryptographic ID
    const getCryptoId = (name: string) => {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i);
        hash |= 0;
      }
      const absHash = Math.abs(hash).toString(36).toUpperCase();
      return `NFI${absHash.substring(0, 5)}X${name.length}`;
    };

    const cryptoId = getCryptoId(username);
    const protocolVersion = `V${2 + Math.floor(scores.overall / 50)}.${Math.floor((scores.overall % 50) / 5)}`;

    // 5-Axis Radar Chart Logic
    const axes = [
      { label: 'Consistency', value: scores.consistency },
      { label: 'Legitimacy', value: scores.legitimacy },
      { label: 'Diversity', value: scores.diversity },
      { label: 'Complexity', value: scores.complexity },
      { label: 'Accuracy', value: scores.accuracy },
    ];


    return (
      <div
        ref={ref}
        className="w-[1080px] h-[1350px] bg-[hsl(220,30%,2%)] p-0 flex flex-col relative overflow-hidden text-white"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Dynamic Background */}
        {avatar && (
          <div className="absolute inset-0 z-0">
            <img src={avatar} alt="" className="w-full h-full object-cover scale-110 blur-[60px] opacity-20 brightness-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,2%)] via-transparent to-[hsl(220,30%,2%)]" />
            <div className={`absolute inset-0 bg-gradient-to-b from-${security.color}/20 via-transparent to-transparent opacity-40`} />
          </div>
        )}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05] z-0" />
        <div className={`absolute top-0 right-0 w-[1000px] h-[1000px] bg-${security.color}/10 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2`} />
        <div className={`h-4 bg-gradient-to-r from-${security.color} via-accent to-primary relative z-10`} />

        <div className="px-12 py-8 flex-1 flex flex-col relative z-20">
          {/* Top Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  AI ANALYTICAL ENGINE
                </span>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter pt-2">
                LEETCODE <span className="text-primary italic">INSIGHT</span>
              </h1>
            </div>
            <div className="flex flex-col items-end">
              <Fingerprint className="w-10 h-10 text-white/20 mb-1" />
              <p className="text-[hsl(220,9%,55%)] font-mono text-[9px] uppercase tracking-[0.3em]">REPORT SERIAL ID</p>
              <p className="text-white font-mono font-bold text-base">#{cryptoId}</p>
            </div>
          </div>

          {/* Hero Section */}
          <div className="flex items-center gap-8 mb-6 bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
              <img
                src={avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`}
                alt={username}
                className="w-32 h-32 rounded-[2rem] border-4 border-white/20 object-cover relative z-10 shadow-2xl"
              />
              <div className="absolute -bottom-3 -right-3 bg-primary text-black font-black px-4 py-1.5 rounded-xl text-[10px] skew-x-[-8deg] shadow-xl z-20 border-2 border-black/10">
                {getRoleBadge(scores.overall)}
              </div>
            </div>

            <div className="flex-1 flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-4xl font-black text-white tracking-tight">@{username}</h2>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-0.5 rounded-lg ${security.bg} text-black font-black text-[9px] tracking-widest uppercase`}>
                        <SecurityIcon className="w-3 h-3" />
                        {security.label}
                      </div>
                      <div className="h-4 w-px bg-white/20" />
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-0.5 rounded-lg border border-white/10">
                        <Globe className="w-3.5 h-3.5 text-white/50" />
                        <span className="text-white/80 font-bold uppercase tracking-widest text-[9px]">
                          Ranked {stats.ranking ? `#${stats.ranking.toLocaleString()}` : 'Top Tier'}
                        </span>
                      </div>
                    </div>
                    <p className={`text-[10px] font-black tracking-[0.15em] text-${security.color} font-mono mt-0.5`}>{security.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl text-primary font-black uppercase tracking-wide bg-primary/10 px-4 py-1 rounded-xl border border-primary/20">{persona}</span>
                  {scores.complexity > 60 && (
                    <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20 text-amber-500">
                      <Award className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Complex Mastery</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right pr-2">
                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">Total Verified</p>
                <p className="text-7xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
                  {stats.totalSolved}
                </p>
                <p className="text-primary font-black text-[10px] mt-1 tracking-[0.3em]">PROBLEMS RESOLVED</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
            {/* Main Column */}
            <div className="col-span-12 lg:col-span-7 space-y-4 flex flex-col h-full">
              {/* Radar & Detail */}
              <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl relative overflow-hidden flex-1 shrink-0">
                <div className="flex items-center justify-between h-full relative z-10">
                  <div className="space-y-6">
                    <div>
                      <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-1">Efficiency Metric</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-6xl font-black text-white tracking-tighter">{scores.overall}</p>
                        <span className="text-white/30 text-lg font-black">/100</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {axes.slice(0, 4).map(axis => (
                        <div key={axis.label} className="space-y-1">
                          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">{axis.label}</p>
                          <p className="text-lg font-black text-white">{Math.round(axis.value)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center p-4">
                    <RadarChart
                      data={{
                        consistency: scores.consistency,
                        legitimacy: scores.legitimacy,
                        diversity: scores.diversity,
                        complexity: scores.complexity,
                        accuracy: scores.accuracy
                      }}
                      size={300}
                      securityColor={security.color.split('-')[0]}
                    />
                  </div>
                </div>
              </div>

              {/* Difficulty Stats */}
              <div className="grid grid-cols-3 gap-4 h-24">
                {[
                  { label: 'Basic', value: stats.easySolved, color: 'text-emerald-400' },
                  { label: 'Adv.', value: stats.mediumSolved, color: 'text-amber-400' },
                  { label: 'Expert', value: stats.hardSolved, color: 'text-red-500' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-center text-center">
                    <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Tech Stack */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex-1 shrink-0 overflow-hidden">
                <h3 className="text-white font-black text-[10px] mb-4 flex items-center gap-3 tracking-[0.2em] uppercase">
                  <Zap className="w-4 h-4 text-primary" /> Technical Stack Dominance
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {(stats.languages || []).slice(0, 4).map((l) => {
                    const percentage = (l.value / stats.totalSolved) * 100;
                    return (
                      <div key={l.name} className="space-y-1.5">
                        <div className="flex justify-between items-end">
                          <span className="text-white font-black text-sm">{l.name}</span>
                          <span className="text-primary font-mono text-[10px] font-bold">{Math.round(percentage)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            style={{ width: `${Math.min(100, percentage)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI and Security Column */}
            <div className="col-span-12 lg:col-span-5 space-y-4 flex flex-col h-full">
              <div className="bg-gradient-to-br from-primary via-primary/90 to-accent p-6 rounded-[2.5rem] text-white h-1/2 flex flex-col shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                    <Code2 className="w-4 h-4 text-white" />
                    <span className="font-black uppercase tracking-widest text-[9px] text-white">PERFORMANCE SUMMARY {protocolVersion}</span>
                  </div>
                  <Star className="w-5 h-5 fill-white/20 text-white" />
                </div>
                <div className="flex-1 overflow-hidden pr-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-1">Cognitive Synthesis</p>
                  <p className="text-lg font-black italic leading-[1.3] tracking-tight text-white">
                    "{aiAnalysis?.cognitive_synthesis || aiAnalysis?.summary || "Analyzing pattern recognition and complexity trajectories to synthesize behavioral insights..."}"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-end">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/60">Evaluation</p>
                    <p className="font-black text-sm italic text-white">{persona}</p>
                  </div>
                  <Brain className="w-8 h-8 opacity-30 text-white" />
                </div>
              </div>

              <div className={`bg-white/5 border border-${security.color}/30 p-6 rounded-[2.5rem] flex-1 flex flex-col shadow-xl backdrop-blur-3xl`}>
                <h3 className={`text-${security.color} font-black text-[10px] mb-4 flex items-center gap-2 tracking-[0.2em] uppercase`}>
                  <ShieldCheck className="w-4 h-4" /> Authenticity Engine
                </h3>
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[9px] text-white/50 font-black uppercase tracking-widest">Confidence</span>
                      <span className={`text-${security.color} text-2xl font-black`}>{Math.round((legitimacyProbability || 0) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${security.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                        style={{ width: `${Math.round((legitimacyProbability || 0) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {indicators.slice(0, 3).map((ind, i) => (
                      <div key={i} className="flex gap-3 items-center p-2.5 bg-white/5 border border-white/5 rounded-xl">
                        <div className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${ind.status === 'good' ? 'bg-emerald-400' : ind.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'}`} />
                        <p className="text-white font-black text-[9px] uppercase truncate tracking-wider">{ind.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">AI BEHAVIORAL ANALYSIS</p>
              <p className="text-white font-black tracking-[0.2em] text-xl">LEETCODE<span className="text-primary italic">INSIGHT</span> AI</p>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-right">
                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">Date Issued</p>
                <p className="text-white font-mono text-base font-bold">
                  {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                </p>
              </div>
              <div className="w-20 h-20 bg-white p-2 rounded-xl group relative">
                <div className="absolute inset-0 bg-white/20 blur-xl group-hover:bg-white/40 transition-all" />
                <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://leetcode.com/u/${username}')] bg-cover relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
);

ShareableCard.displayName = 'ShareableCard';
