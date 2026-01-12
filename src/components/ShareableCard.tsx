import { forwardRef } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Trophy, Target, Flame, Code2, Star, Award, Brain, Zap, Globe, Fingerprint } from 'lucide-react';
import { LegitimacyIndicator } from '@/types/leetcode';

interface ShareableCardProps {
  username: string;
  avatar?: string;
  scores: {
    overall: number;
    consistency: number;
    diversity: number;
    legitimacy: number;
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
    strengths: string[];
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

export const ShareableCard = forwardRef<HTMLDivElement, ShareableCardProps>(
  ({ username, avatar, scores, legitimacyProbability, stats, aiAnalysis, indicators }, ref) => {
    const persona = getPersona(scores);

    // SVG Radar Logic
    const size = 200;
    const center = size / 2;
    const r = 80;
    const points = [
      { label: 'Consistency', value: scores.consistency },
      { label: 'Legitimacy', value: scores.legitimacy },
      { label: 'Diversity', value: scores.diversity },
    ];

    const getPoint = (index: number, value: number) => {
      const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2;
      const dist = (value / 100) * r;
      return `${center + dist * Math.cos(angle)},${center + dist * Math.sin(angle)}`;
    };

    const radarPath = points.map((p, i) => getPoint(i, p.value)).join(' ');

    return (
      <div
        ref={ref}
        className="w-[1080px] h-[1350px] bg-[hsl(220,30%,2%)] p-0 flex flex-col relative overflow-hidden"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Dynamic Background Image Section */}
        {avatar && (
          <div className="absolute inset-0 z-0">
            <img
              src={avatar}
              alt=""
              className="w-full h-full object-cover scale-110 blur-[60px] opacity-20 brightness-50 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,2%)] via-transparent to-[hsl(220,30%,2%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(220,30%,2%)_100%)] opacity-80" />
          </div>
        )}

        {/* Decorative Patterns */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05] z-0" />
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2" />

        {/* Top Header Bar */}
        <div className="h-4 bg-gradient-to-r from-primary via-accent to-primary relative z-10" />

        <div className="p-16 flex-1 flex flex-col relative z-20">
          {/* Header */}
          <div className="flex justify-between items-start mb-16">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-primary animate-pulse" />
                <span className="text-primary font-bold tracking-[0.4em] text-xs uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  Neural Intelligence Node
                </span>
              </div>
              <h1 className="text-6xl font-black text-white tracking-tighter pt-4">
                LEETCODE <span className="text-primary italic">INSIGHT</span>
              </h1>
            </div>
            <div className="flex flex-col items-end">
              <Fingerprint className="w-12 h-12 text-white/20 mb-2" />
              <p className="text-[hsl(220,9%,55%)] font-mono text-[10px] uppercase tracking-[0.3em]">Cryptographic ID</p>
              <p className="text-white font-mono font-bold text-lg">#{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            </div>
          </div>

          {/* Profile Hero Section - Super Glassmorphism */}
          <div className="flex items-center gap-10 mb-12 bg-white/5 border border-white/20 p-10 rounded-[3rem] backdrop-blur-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:bg-primary/50 transition-all duration-500" />
              <img
                src={avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`}
                alt={username}
                className="w-40 h-40 rounded-[2.5rem] border-4 border-white/20 object-cover relative z-10 shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-black font-black px-6 py-2 rounded-2xl text-sm skew-x-[-8deg] shadow-xl z-20 border-2 border-black/10">
                {getRoleBadge(scores.overall)}
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">@{username}</h2>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-primary font-black uppercase tracking-wide bg-primary/10 px-4 py-1 rounded-xl border border-primary/20">{persona}</span>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-1 rounded-xl border border-white/10">
                  <Globe className="w-5 h-5 text-white/50" />
                  <span className="text-white/80 font-bold uppercase tracking-widest text-xs">
                    Ranked {stats.ranking ? `#${stats.ranking.toLocaleString()}` : 'Top Tier'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-10 flex-1">
            {/* Left Column: Analysis & Radar */}
            <div className="col-span-12 lg:col-span-7 space-y-10">
              {/* Radar Chart & Core Score */}
              <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/20 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-8">
                    <div>
                      <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-2">Aggregate Efficiency</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                          {scores.overall}
                        </p>
                        <span className="text-white/30 text-2xl font-black">/100</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Consistency Index</p>
                        <p className="text-2xl font-black text-white">{scores.consistency}%</p>
                        <div className="w-12 h-1 bg-primary/20 rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: `${scores.consistency}%` }} /></div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Diversity Metric</p>
                        <p className="text-2xl font-black text-white">{scores.diversity}%</p>
                        <div className="w-12 h-1 bg-accent/20 rounded-full"><div className="h-full bg-accent rounded-full" style={{ width: `${scores.diversity}%` }} /></div>
                      </div>
                    </div>
                  </div>

                  {/* Radar SVG */}
                  <div className="relative p-4 bg-white/5 rounded-full border border-white/10 backdrop-blur-md shadow-inner">
                    <svg width={size + 40} height={size + 40} className="drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                      <g transform="translate(20,20)">
                        <circle cx={center} cy={center} r={r} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 4" />
                        <circle cx={center} cy={center} r={r * 0.66} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
                        <circle cx={center} cy={center} r={r * 0.33} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" />

                        {/* Values */}
                        <polygon
                          points={radarPath}
                          fill="rgba(249,115,22,0.15)"
                          stroke="rgba(249,115,22,1)"
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                        {/* Points */}
                        {points.map((p, i) => {
                          const pts = getPoint(i, p.value).split(',');
                          return <circle key={i} cx={pts[0]} cy={pts[1]} r="5" fill="white" className="shadow-lg" />
                        })}
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Advanced Solved Grid */}
              <div className="grid grid-cols-3 gap-8">
                {[
                  { label: 'Basic', value: stats.easySolved, color: 'text-emerald-400', sub: 'Foundations' },
                  { label: 'Adv.', value: stats.mediumSolved, color: 'text-amber-400', sub: 'Algorithmics' },
                  { label: 'Expert', value: stats.hardSolved, color: 'text-red-500', sub: 'Complexity' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md text-center group hover:bg-white/10 transition-all">
                    <p className={`text-5xl font-black ${s.color} mb-1 drop-shadow-md`}>{s.value}</p>
                    <p className="text-xs text-white/40 font-black uppercase tracking-[0.2em]">{s.label}</p>
                    <p className="text-[10px] text-white/20 font-bold uppercase mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Language Stack */}
              <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md">
                <h3 className="text-white font-black text-sm mb-8 flex items-center gap-3 tracking-[0.3em] uppercase">
                  <Zap className="w-5 h-5 text-primary" /> Technical Stack Dominance
                </h3>
                <div className="grid grid-cols-2 gap-10">
                  {(stats.languages || []).slice(0, 4).map((l, i) => {
                    const percentage = (l.value / stats.totalSolved) * 100;
                    return (
                      <div key={l.name} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-white font-black text-lg">{l.name}</span>
                          <span className="text-primary font-mono text-sm font-bold">{Math.round(percentage)}%</span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full p-1 border border-white/10">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                            style={{ width: `${Math.min(100, percentage)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: AI Insights & Legitimacy */}
            <div className="col-span-12 lg:col-span-5 space-y-10">
              {/* AI Core Evaluation */}
              <div className="bg-primary p-12 rounded-[3rem] text-black shadow-[0_40px_80px_-20px_rgba(249,115,22,0.4)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                  <Brain className="w-48 h-48" />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 bg-black/10 w-fit px-4 py-1 rounded-full border border-black/5 mb-8">
                    <Brain className="w-5 h-5" />
                    <span className="font-black uppercase tracking-[0.2em] text-[10px]">Neural Protocol v2.4</span>
                  </div>
                  <p className="text-2xl font-black italic leading-tight mb-8">
                    "{aiAnalysis?.summary || "Neural engine is synthesizing behavioral patterns and algorithmic trajectories for high-fidelity profile validation..."}"
                  </p>
                  <div className="mt-auto space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Competency Strengths</p>
                    <div className="flex flex-wrap gap-2 text-xs font-black uppercase">
                      {(aiAnalysis?.strengths || ["Analytical Depth", "Constraint Mastery"]).slice(0, 3).map(s => (
                        <span key={s} className="bg-black text-primary px-4 py-2 rounded-xl shadow-lg border border-white/10">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legitimacy Confidence */}
              <div className="bg-white/10 border-2 border-emerald-500/30 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-xl">
                <h3 className="text-emerald-400 font-black text-sm mb-8 flex items-center gap-3 tracking-[0.3em] uppercase">
                  <ShieldCheck className="w-6 h-6" /> Authenticity Engine
                </h3>
                <div className="space-y-8">
                  <div className="p-6 bg-black/20 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs text-white/50 font-black uppercase tracking-widest">Confidence Index</span>
                      <span className="text-emerald-400 text-3xl font-black">{Math.round((legitimacyProbability || 0) * 100)}%</span>
                    </div>
                    <div className="h-4 bg-white/5 rounded-full p-1 border border-white/5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        style={{ width: `${Math.round((legitimacyProbability || 0) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {indicators.slice(0, 3).map((ind, i) => (
                      <div key={i} className="flex gap-4 items-start p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <div className={`mt-1.5 w-3 h-3 rounded-full shrink-0 animate-pulse ${ind.status === 'good' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <div>
                          <p className="text-white font-black text-xs uppercase mb-1">{ind.label}</p>
                          <p className="text-white/40 text-[10px] font-medium leading-relaxed">{ind.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
                  <Flame className="w-8 h-8 text-orange-500 mb-4" />
                  <p className="text-4xl font-black text-white">{stats.streak}</p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Activity Streak</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
                  <Trophy className="w-8 h-8 text-yellow-400 mb-4" />
                  <p className="text-4xl font-black text-white">{stats.contestRating || '1500+'}</p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Global Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="mt-16 pt-12 border-t border-white/10 flex justify-between items-end">
            <div className="space-y-2">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Protocol Node Analysis</p>
              <p className="text-white font-black tracking-[0.2em] text-2xl">LEETCODE<span className="text-primary italic">INSIGHT</span> AI</p>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-right space-y-1">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Timestamp</p>
                <p className="text-white font-mono text-lg font-bold">
                  {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                </p>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 blur-xl group-hover:bg-white/40 transition-all rounded-xl" />
                <div className="w-24 h-24 bg-white p-3 rounded-2xl relative z-10 shadow-2xl overflow-hidden">
                  <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://leetcode.com/u/${username}')] bg-cover contrast-125" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ShareableCard.displayName = 'ShareableCard';
