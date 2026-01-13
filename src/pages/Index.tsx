import { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { HeroSection } from '@/components/HeroSection';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ScoreCard } from '@/components/ScoreCard';
import { StatsGrid } from '@/components/StatsGrid';
import { LanguageChart } from '@/components/LanguageChart';
import { LegitimacyIndicators } from '@/components/LegitimacyIndicators';
import { SubmissionHeatmap } from '@/components/SubmissionHeatmap';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ShareableCard } from '@/components/ShareableCard';
import { AIAnalysisCard } from '@/components/AIAnalysisCard';
import { RadarChart } from '@/components/RadarChart';
import { Footer } from '@/components/Footer';
import { useLeetCodeProfile } from '@/hooks/useLeetCodeProfile';
import { useLeetCodeAI } from '@/hooks/useLeetCodeAI';
import { analyzeProfile } from '@/lib/analyzeLeetCode';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

const Index = () => {
  const { profile, isLoading, fetchProfile } = useLeetCodeProfile();
  const { analysis: aiAnalysis, isLoading: isAiLoading, generateAnalysis } = useLeetCodeAI();
  const [isExporting, setIsExporting] = useState(false);
  const shareableCardRef = useRef<HTMLDivElement>(null);

  const analysis = useMemo(() => {
    if (!profile) return null;
    return analyzeProfile(profile);
  }, [profile]);

  useEffect(() => {
    if (analysis && !isAiLoading) {
      generateAnalysis(analysis);
    }
  }, [analysis]);

  const handleExport = async () => {
    if (!shareableCardRef.current || !analysis) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(shareableCardRef.current, {
        quality: 1,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `leetcode-${analysis.profile.username}-analysis.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container max-w-6xl mx-auto px-4 pt-12 flex-1">
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
              className="space-y-12 pb-20"
            >
              {/* Profile Header */}
              <ProfileHeader
                username={analysis.profile.username}
                avatar={analysis.profile.avatar}
                realName={analysis.profile.realName}
                location={analysis.profile.location}
                aboutMe={analysis.profile.aboutMe}
                totalSolved={analysis.profile.totalSolved}
              />

              {/* Export Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  variant="gradient"
                  size="lg"
                  className="gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Report Card
                    </>
                  )}
                </Button>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              {/* AI Analysis Row */}
              <AnimatePresence mode="wait">
                {(aiAnalysis || isAiLoading) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <AIAnalysisCard analysis={aiAnalysis!} isLoading={isAiLoading} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <LanguageChart languages={analysis.profile.languages} />

                {/* Radar Chart (New) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card p-6 flex flex-col items-center justify-center min-h-[300px]"
                >
                  <h3 className="text-lg font-bold mb-6 text-center w-full">Skill Composition</h3>
                  <RadarChart
                    data={{
                      consistency: analysis.scores.consistency,
                      legitimacy: analysis.scores.legitimacy,
                      diversity: analysis.scores.diversity,
                      complexity: analysis.scores.complexity,
                      accuracy: analysis.scores.accuracy
                    }}
                    size={280}
                    className="text-primary"
                    securityColor="primary"
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <LegitimacyIndicators
                  indicators={analysis.indicators}
                  overallScore={analysis.scores.legitimacy}
                  legitimacyProbability={analysis.legitimacyProbability}
                  activeDays={analysis.profile.activeDays}
                  totalSolved={analysis.profile.totalSolved}
                  submissionCount={analysis.profile.recentSubmissions.reduce((sum, s) => sum + s.count, 0)}
                />
              </div>

              {/* Submission Heatmap */}
              <SubmissionHeatmap submissions={analysis.profile.recentSubmissions} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Hidden Shareable Card for Export */}
      {analysis && (
        <div className="fixed left-[-9999px] top-0">
          <ShareableCard
            ref={shareableCardRef}
            username={analysis.profile.username}
            avatar={analysis.profile.avatar}
            scores={analysis.scores}
            stats={{
              totalSolved: analysis.profile.totalSolved,
              easySolved: analysis.profile.easySolved,
              mediumSolved: analysis.profile.mediumSolved,
              hardSolved: analysis.profile.hardSolved,
              ranking: analysis.profile.ranking,
              streak: analysis.profile.streak,
              contestRating: analysis.profile.contestRating,
              languages: analysis.profile.languages,
            }}
            aiAnalysis={aiAnalysis || undefined}
            indicators={analysis.indicators}
            legitimacyProbability={analysis.legitimacyProbability}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Index;
