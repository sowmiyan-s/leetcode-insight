import { useMemo, useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { HowItWorks } from '@/components/HowItWorks';
import { TrustCounter } from '@/components/TrustCounter';
import { ErrorState } from '@/components/ErrorState';
import { ShareButtons } from '@/components/ShareButtons';
import { ContestHistory } from '@/components/ContestHistory';
import { ProfileComparison } from '@/components/ProfileComparison';
import { useLeetCodeProfile } from '@/hooks/useLeetCodeProfile';
import { useLeetCodeAI } from '@/hooks/useLeetCodeAI';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { analyzeProfile } from '@/lib/analyzeLeetCode';
import { AnalysisResult } from '@/types/leetcode';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialUsername = searchParams.get('u') || '';
  
  const { profile, isLoading, error, fetchProfile } = useLeetCodeProfile();
  const { profile: profileB, isLoading: isLoadingB, fetchProfile: fetchProfileB } = useLeetCodeProfile();
  const { analysis: aiAnalysis, isLoading: isAiLoading, generateAnalysis } = useLeetCodeAI();
  const { addToHistory } = useSearchHistory();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const shareableCardRef = useRef<HTMLDivElement>(null);

  // Auto-load profile from URL param
  useEffect(() => {
    if (initialUsername && !profile && !isLoading) {
      fetchProfile(initialUsername);
    }
  }, []);

  const analysis = useMemo(() => {
    if (!profile) return null;
    return analyzeProfile(profile);
  }, [profile]);

  const analysisB = useMemo(() => {
    if (!profileB) return null;
    return analyzeProfile(profileB);
  }, [profileB]);

  // Log search to database when analysis is complete
  useEffect(() => {
    if (analysis && profile) {
      const logSearch = async () => {
        try {
          await supabase.from('searches').insert({
            username: profile.username,
            score: analysis.scores.overall,
            user_agent: navigator.userAgent,
            profile_data: profile as any,
          });
        } catch (error) {
          console.error('Failed to log search:', error);
        }
      };
      logSearch();
    }
  }, [analysis?.scores.overall, profile?.username]);

  // Trigger AI analysis when profile is loaded
  useEffect(() => {
    if (analysis && !isAiLoading && !isCompareMode) {
      generateAnalysis(analysis);
    }
  }, [analysis, isCompareMode]);

  // Trigger confetti for high scores
  useEffect(() => {
    if (analysis && analysis.scores.overall >= 85 && !hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fb923c', '#fdba74'],
      });
    }
  }, [analysis, hasTriggeredConfetti]);

  // Reset confetti flag when profile changes
  useEffect(() => {
    setHasTriggeredConfetti(false);
  }, [profile?.username]);

  const handleAnalyze = (username: string) => {
    setIsCompareMode(false);
    setSearchParams({ u: username });
    fetchProfile(username);
  };

  const handleCompare = (usernameA: string, usernameB: string) => {
    setIsCompareMode(true);
    setSearchParams({ u: usernameA, vs: usernameB });
    fetchProfile(usernameA);
    fetchProfileB(usernameB);
  };

  const handleUsernameAnalyzed = (username: string, avatar?: string) => {
    addToHistory(username, profile?.avatar || avatar);
  };

  // Update history when profile loads
  useEffect(() => {
    if (profile) {
      addToHistory(profile.username, profile.avatar);
    }
  }, [profile]);

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

  const handleRetry = () => {
    if (profile?.username) {
      fetchProfile(profile.username);
    }
  };

  const handleTryExample = (username: string) => {
    handleAnalyze(username);
  };

  const showComparison = isCompareMode && analysis && analysisB && !isLoading && !isLoadingB;
  const showSingleProfile = analysis && !isLoading && !isCompareMode;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container max-w-6xl mx-auto px-4 pt-8 md:pt-12 flex-1">
        <HeroSection 
          onAnalyze={handleAnalyze}
          onCompare={handleCompare}
          isLoading={isLoading || isLoadingB}
          initialUsername={initialUsername}
          onUsernameAnalyzed={handleUsernameAnalyzed}
        />

        {/* Trust signals + How it works show only before any analysis */}
        {!analysis && !isLoading && !error && (
          <>
            <TrustCounter />
            <HowItWorks />
          </>
        )}

        <AnimatePresence mode="wait">
          {/* Loading State */}
          {(isLoading || isLoadingB) && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton />
            </motion.div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ErrorState
                error={error}
                onRetry={handleRetry}
                onTryExample={handleTryExample}
              />
            </motion.div>
          )}

          {/* Comparison View */}
          {showComparison && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 pb-20"
            >
              <ProfileComparison profileA={analysis} profileB={analysisB} />
            </motion.div>
          )}

          {/* Single Profile View */}
          {showSingleProfile && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 md:space-y-12 pb-20"
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  variant="gradient"
                  size="lg"
                  className="gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all w-full sm:w-auto"
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

              {/* Share Buttons */}
              <ShareButtons 
                username={analysis.profile.username} 
                overallScore={analysis.scores.overall} 
              />

              {/* Score Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <LanguageChart languages={analysis.profile.languages} />

                {/* Radar Chart */}
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

              {/* Contest History */}
              {analysis.profile.contestHistory && analysis.profile.contestHistory.length > 0 && (
                <ContestHistory
                  history={analysis.profile.contestHistory}
                  currentRating={analysis.profile.contestRating}
                />
              )}

              <div className="grid grid-cols-1 gap-6 md:gap-8">
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
