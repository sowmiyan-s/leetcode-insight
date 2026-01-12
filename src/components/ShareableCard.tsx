import { forwardRef } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Trophy, Target, Flame, Code2, Star, Award, Brain, Zap, Globe } from 'lucide-react';
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
  if (scores.legitimacy < 60) return "The Enigmatic Coder";
  if (scores.overall > 90) return "The Grandmaster";
  if (scores.consistency > 85) return "The Unstoppable Climber";
  if (scores.diversity > 85) return "The Polyglot Architect";
  if (scores.overall > 70) return "Elite Problem Solver";
  return "Rising Challenger";
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
        className="w-[1080px] h-[1350px] bg-[hsl(220,30%,4%)] p-0 flex flex-col relative overflow-hidden"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />

        {/* Top Header Bar */}
        <div className="h-4 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="p-12 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-6 h-6 text-primary" />
                <span className="text-primary font-bold tracking-[0.3em] text-sm uppercase">Intelligence Report</span>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter">
                LEETCODE <span className="text-primary">INSIGHT</span>
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[hsl(220,9%,55%)] font-mono text-sm uppercase tracking-widest">Serial Index</p>
              <p className="text-white font-mono font-bold">LC-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            </div>
          </div>

          {/* Profile Hero Section */}
          <div className="flex items-center gap-8 mb-12 bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
            <div className="relative">
              <img
                src={avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`}
                alt={username}
                className="w-32 h-32 rounded-3xl border-2 border-primary/50 object-cover"
              />
              <div className="absolute -bottom-3 -right-3 bg-primary text-black font-black px-4 py-1 rounded-full text-xs skew-x-[-12deg]">
                VERIFIED
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-1 tracking-tight">@{username}</h2>
              <div className="flex items-center gap-3">
                <span className="text-xl text-primary font-bold">{persona}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="text-[hsl(220,9%,55%)] flex items-center gap-1">
                  <Globe className="w-4 h-4" /> Global Ranking: {stats.ranking ? `#${stats.ranking.toLocaleString()}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 flex-1">
            {/* Left Column: Stats & Radar */}
            <div className="col-span-7 space-y-8">
              {/* Radar Chart & Key Scores */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[hsl(220,9%,55%)] text-xs font-bold uppercase tracking-widest mb-1">Overall Core Score</p>
                      <p className="text-6xl font-black text-primary">{scores.overall}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[hsl(220,9%,55%)] text-[10px] font-bold uppercase mb-1">Consistency</p>
                        <p className="text-xl font-bold text-white">{scores.consistency}/100</p>
                      </div>
                      <div>
                        <p className="text-[hsl(220,9%,55%)] text-[10px] font-bold uppercase mb-1">Diversity</p>
                        <p className="text-xl font-bold text-white">{scores.diversity}/100</p>
                      </div>
                    </div>
                  </div>

                  {/* Custom SVG Radar */}
                  <div className="relative">
                    <svg width={size} height={size} className="drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                      {/* Background hex */}
                      <polygon points="100,20 169,140 31,140" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
                      <circle cx={center} cy={center} r={r} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
                      <circle cx={center} cy={center} r={r / 2} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
                      {/* Active Path */}
                      <polygon
                        points={radarPath}
                        fill="rgba(249,115,22,0.2)"
                        stroke="rgba(249,115,22,1)"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Solved Stats Grid */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Easy', value: stats.easySolved, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                  { label: 'Medium', value: stats.mediumSolved, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                  { label: 'Hard', value: stats.hardSolved, color: 'text-red-400', bg: 'bg-red-400/10' },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} p-6 rounded-2xl border border-white/5 text-center`}>
                    <p className={`text-4xl font-black ${s.color} mb-1`}>{s.value}</p>
                    <p className="text-xs text-[hsl(220,9%,55%)] font-bold uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Language Proficiency */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> Language Specialization
                </h3>
                <div className="space-y-4">
                  {(stats.languages || []).slice(0, 3).map((l, i) => {
                    const percentage = (l.value / stats.totalSolved) * 100;
                    return (
                      <div key={l.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white font-medium">{l.name}</span>
                          <span className="text-[hsl(220,9%,55%)]">{l.value} solved</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
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

            {/* Right Column: AI & Legitimacy */}
            <div className="col-span-5 space-y-8">
              {/* AI Key Insight */}
              <div className="bg-primary p-8 rounded-3xl text-black h-fit shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Brain className="w-24 h-24" />
                </div>
                <h3 className="font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4" /> AI Key Insight
                </h3>
                <p className="text-lg font-bold italic leading-relaxed">
                  "{aiAnalysis?.summary || "AI is finalizing the evaluation of this profile's trajectory and potential."}"
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-black uppercase">
                  {aiAnalysis?.strengths.slice(0, 2).map(s => (
                    <span key={s} className="bg-black text-primary px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              {/* Legitimacy Breakdown */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authenticity Verification
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-[hsl(220,9%,55%)] font-bold uppercase">Confidence Index</span>
                      <span className="text-emerald-400 font-bold">{Math.round((legitimacyProbability || 0) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${Math.round((legitimacyProbability || 0) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {indicators.slice(0, 3).map((ind, i) => (
                      <div key={i} className="flex gap-3 items-start p-3 bg-white/5 rounded-xl text-[10px]">
                        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${ind.status === 'good' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <div>
                          <p className="text-white font-bold mb-0.5">{ind.label}</p>
                          <p className="text-[hsl(220,9%,55%)] leading-tight line-clamp-2">{ind.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Mini Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <Flame className="w-6 h-6 text-orange-500 mb-2" />
                  <p className="text-2xl font-black text-white">{stats.streak}</p>
                  <p className="text-[10px] text-[hsl(220,9%,55%)] font-bold uppercase">Max Streak</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <Star className="w-6 h-6 text-yellow-400 mb-2" />
                  <p className="text-2xl font-black text-white">{stats.contestRating || '---'}</p>
                  <p className="text-[10px] text-[hsl(220,9%,55%)] font-bold uppercase">Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-[hsl(220,9%,55%)] text-xs font-medium">Generated by</p>
              <p className="text-white font-black tracking-widest text-lg">LEETCODE INSIGHT AI</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[hsl(220,9%,55%)] text-[10px] font-bold uppercase">Verification Date</p>
                <p className="text-white font-mono text-sm">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</p>
              </div>
              {/* Fake QR code area */}
              <div className="w-16 h-16 bg-white p-1 rounded-lg">
                <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://leetcode.com/u/${username}')] bg-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ShareableCard.displayName = 'ShareableCard';
