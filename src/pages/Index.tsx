import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ScoreCard } from '@/components/ScoreCard';
import { StatsGrid } from '@/components/StatsGrid';
import { LanguageChart } from '@/components/LanguageChart';
import { LegitimacyIndicators } from '@/components/LegitimacyIndicators';
import { SubmissionHeatmap } from '@/components/SubmissionHeatmap';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useLeetCodeProfile } from '@/hooks/useLeetCodeProfile';
import { analyzeProfile } from '@/lib/analyzeLeetCode';
import { Github } from 'lucide-react';

const Index = () => {
  const { profile, isLoading, fetchProfile } = useLeetCodeProfile();

  const analysis = useMemo(() => {
    if (!profile) return null;
    return analyzeProfile(profile);
  }, [profile]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">LC</span>
            </div>
            <span className="font-semibold text-lg">Profile Analyzer</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4">
        <HeroSection onAnalyze={fetchProfile} isLoading={isLoading} />

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton />
            </motion.div>
          )}

          {analysis && !isLoading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 pb-20"
            >
              {/* Profile Header */}
              <ProfileHeader
                username={analysis.profile.username}
                avatar={analysis.profile.avatar}
                realName={analysis.profile.realName}
                location={analysis.profile.location}
                aboutMe={analysis.profile.aboutMe}
              />

              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ScoreCard
                  score={analysis.scores.overall}
                  label="Overall Score"
                  description="Combined profile quality rating"
                  delay={0}
                />
                <ScoreCard
                  score={analysis.scores.consistency}
                  label="Consistency"
                  description="Practice regularity & streak"
                  delay={0.1}
                />
                <ScoreCard
                  score={analysis.scores.legitimacy}
                  label="Legitimacy"
                  description="Authenticity assessment"
                  delay={0.2}
                />
              </div>

              {/* Stats Grid */}
              <StatsGrid
                stats={{
                  totalSolved: analysis.profile.totalSolved,
                  easySolved: analysis.profile.easySolved,
                  mediumSolved: analysis.profile.mediumSolved,
                  hardSolved: analysis.profile.hardSolved,
                  ranking: analysis.profile.ranking,
                  streak: analysis.profile.streak,
                  activeDays: analysis.profile.activeDays,
                  contestRating: analysis.profile.contestRating,
                }}
              />

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LanguageChart languages={analysis.profile.languages} />
                <LegitimacyIndicators
                  indicators={analysis.indicators}
                  overallScore={analysis.scores.legitimacy}
                />
              </div>

              {/* Submission Heatmap */}
              <SubmissionHeatmap submissions={analysis.profile.recentSubmissions} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-auto">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            LeetCode Profile Analyzer • Built with React & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
