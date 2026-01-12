import { forwardRef } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Trophy, Target, Flame, Code2, Star, Award } from 'lucide-react';
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
  legitimacyProbability?: number; // 0-1
  lastUpdated?: string; // ISO string
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking?: number;
    streak: number;
    contestRating?: number;
  };
  indicators: LegitimacyIndicator[];
}

type ValidityStatus = 'valid' | 'caution' | 'suspicious';

const getValidityStatus = (
  legitimacyScore: number,
  indicators: LegitimacyIndicator[]
): ValidityStatus => {
  const hasSuspicious = indicators.some((i) => i.status === 'suspicious');
  const hasWarning = indicators.some((i) => i.status === 'warning');

  if (legitimacyScore < 50 || hasSuspicious) return 'suspicious';
  if (legitimacyScore < 70 || hasWarning) return 'caution';
  return 'valid';
};

const statusConfig = {
  valid: {
    label: 'VERIFIED PROFILE',
    icon: ShieldCheck,
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/50',
    textColor: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/30',
  },
  caution: {
    label: 'NEEDS REVIEW',
    icon: Shield,
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-400',
    glowColor: 'shadow-amber-500/30',
  },
  suspicious: {
    label: 'SUSPICIOUS ACTIVITY',
    icon: ShieldAlert,
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-400',
    glowColor: 'shadow-red-500/30',
  },
};

export const ShareableCard = forwardRef<HTMLDivElement, ShareableCardProps>(
  ({ username, avatar, scores, legitimacyProbability, lastUpdated, stats, indicators }, ref) => {
    const status = getValidityStatus(scores.legitimacy, indicators);
    const config = statusConfig[status];
    const StatusIcon = config.icon;

    const achievements = [
      {
        icon: Target,
        label: 'Problems Solved',
        value: stats.totalSolved.toLocaleString(),
      },
      {
        icon: Trophy,
        label: 'Global Rank',
        value: stats.ranking ? `#${stats.ranking.toLocaleString()}` : 'N/A',
      },
      {
        icon: Star,
        label: 'Contest Rating',
        value: stats.contestRating ? stats.contestRating.toLocaleString() : 'Unrated',
      },
      {
        icon: Flame,
        label: 'Current Streak',
        value: `${stats.streak} days`,
      },
      {
        icon: Code2,
        label: 'Hard Problems',
        value: stats.hardSolved.toString(),
      },
    ];

    return (
      <div
        ref={ref}
        className="w-[1080px] h-[1350px] bg-gradient-to-br from-[hsl(220,20%,8%)] to-[hsl(220,20%,4%)] p-12 flex flex-col shadow-2xl rounded-3xl border border-[hsl(220,14%,18%)]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, hsl(38 92% 50%), hsl(25 95% 53%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            LEETCODE ANALYZER
          </h1>
          <p className="text-[hsl(220,9%,55%)] text-xl">Profile Verification Report</p>
        </div>

        {/* Profile Section */}
        <div className="flex items-center justify-center gap-6 mb-10">
          {avatar && (
            <img
              src={avatar}
              alt={username}
              className="w-24 h-24 rounded-full border-4 border-[hsl(38,92%,50%)]"
            />
          )}
          <div className="text-center">
            <p className="text-3xl font-bold text-[hsl(60,9%,98%)]">@{username}</p>
          </div>
        </div>

        {/* Status Badge & Legitimacy Probability */}
        <div className="flex flex-col items-center mb-10">
          <div
            className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl px-12 py-8 flex flex-col items-center shadow-2xl ${config.glowColor}`}
          >
            <StatusIcon className={`w-20 h-20 ${config.textColor} mb-4`} />
            <span className={`text-3xl font-bold ${config.textColor}`}>{config.label}</span>
            <span className="text-[hsl(220,9%,55%)] text-xl mt-2">
              Legitimacy Score: {scores.legitimacy}/100
            </span>
            {typeof legitimacyProbability === 'number' && (
              <div className="w-full mt-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg text-[hsl(220,9%,55%)] font-medium">Legitimacy Probability</span>
                  <span className="text-lg font-bold text-emerald-400">{Math.round(legitimacyProbability * 100)}%</span>
                </div>
                <div className="w-full h-4 bg-[hsl(220,14%,14%)] rounded-full overflow-hidden">
                  <div
                    className="h-4 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(legitimacyProbability * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          {lastUpdated && (
            <span className="mt-2 text-sm text-[hsl(220,9%,55%)]">Last updated: {new Date(lastUpdated).toLocaleString()}</span>
          )}
        </div>

        {/* Top Achievements */}
        <div className="bg-[hsl(220,18%,10%)] rounded-2xl p-8 mb-8 border border-[hsl(220,14%,18%)]">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-[hsl(38,92%,50%)]" />
            <h2 className="text-2xl font-bold text-[hsl(60,9%,98%)]">TOP ACHIEVEMENTS</h2>
          </div>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-[hsl(220,14%,18%)] last:border-0"
              >
                <div className="flex items-center gap-4">
                  <achievement.icon className="w-6 h-6 text-[hsl(38,92%,50%)]" />
                  <span className="text-xl text-[hsl(220,9%,55%)]">{achievement.label}</span>
                </div>
                <span className="text-2xl font-bold text-[hsl(60,9%,98%)]">{achievement.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Problem Breakdown */}
        <div className="bg-[hsl(220,18%,10%)] rounded-2xl p-8 mb-8 border border-[hsl(220,14%,18%)]">
          <h2 className="text-2xl font-bold text-[hsl(60,9%,98%)] mb-6">PROBLEM BREAKDOWN</h2>
          <div className="flex justify-between">
            <div className="text-center flex-1">
              <p className="text-4xl font-bold text-emerald-400">{stats.easySolved}</p>
              <p className="text-lg text-[hsl(220,9%,55%)]">Easy</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-4xl font-bold text-amber-400">{stats.mediumSolved}</p>
              <p className="text-lg text-[hsl(220,9%,55%)]">Medium</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-4xl font-bold text-red-400">{stats.hardSolved}</p>
              <p className="text-lg text-[hsl(220,9%,55%)]">Hard</p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-[hsl(220,18%,10%)] rounded-2xl p-8 border border-[hsl(220,14%,18%)]">
          <h2 className="text-2xl font-bold text-[hsl(60,9%,98%)] mb-6">SCORE BREAKDOWN</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 bg-[hsl(220,14%,14%)] rounded-xl">
              <p className="text-5xl font-bold text-[hsl(38,92%,50%)]">{scores.overall}</p>
              <p className="text-lg text-[hsl(220,9%,55%)]">Overall</p>
            </div>
            <div className="text-center p-4 bg-[hsl(220,14%,14%)] rounded-xl">
              <p className="text-5xl font-bold text-[hsl(60,9%,98%)]">{scores.consistency}</p>
              <p className="text-lg text-[hsl(220,9%,55%)]">Consistency</p>
            </div>
            <div className="text-center p-4 bg-[hsl(220,14%,14%)] rounded-xl">
              <p className="text-5xl font-bold text-[hsl(60,9%,98%)]">{scores.diversity}</p>
              <p className="text-lg text-[hsl(220,9%,55%)]">Diversity</p>
            </div>
            <div className="text-center p-4 bg-[hsl(220,14%,14%)] rounded-xl">
              <p className="text-5xl font-bold text-[hsl(60,9%,98%)]">{scores.legitimacy}</p>
              <p className="text-lg text-[hsl(220,9%,55%)]">Legitimacy</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center">
          <p className="text-[hsl(220,9%,55%)] text-lg">
            Generated by LeetCode Analyzer • {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    );
  }
);

ShareableCard.displayName = 'ShareableCard';
