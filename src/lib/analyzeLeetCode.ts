import { LeetCodeProfile, LegitimacyIndicator, AnalysisResult } from '@/types/leetcode';

// Calculate consistency score based on submission patterns
const calculateConsistencyScore = (profile: LeetCodeProfile): number => {
  const { streak, activeDays, totalSolved } = profile;
  
  // Streak contribution (max 30 points)
  const streakScore = Math.min(streak / 30 * 30, 30);
  
  // Active days contribution (max 40 points)
  const activeDaysScore = Math.min(activeDays / 200 * 40, 40);
  
  // Problems per active day ratio (max 30 points)
  const problemsPerDay = activeDays > 0 ? totalSolved / activeDays : 0;
  const ratioScore = problemsPerDay > 0.5 && problemsPerDay < 5 ? 30 : 
                    problemsPerDay >= 5 ? 15 : problemsPerDay * 60;
  
  return Math.round(streakScore + activeDaysScore + ratioScore);
};

// Calculate diversity score based on problem difficulty and languages
const calculateDiversityScore = (profile: LeetCodeProfile): number => {
  const { easySolved, mediumSolved, hardSolved, totalSolved, languages } = profile;
  
  if (totalSolved === 0) return 0;
  
  // Difficulty distribution (max 50 points)
  const easyRatio = easySolved / totalSolved;
  const mediumRatio = mediumSolved / totalSolved;
  const hardRatio = hardSolved / totalSolved;
  
  // Ideal distribution: ~30% easy, ~50% medium, ~20% hard
  const distributionScore = 50 - Math.abs(0.3 - easyRatio) * 50 
                           - Math.abs(0.5 - mediumRatio) * 30 
                           - Math.abs(0.2 - hardRatio) * 40;
  
  // Language diversity (max 50 points)
  const languageCount = languages.length;
  const languageScore = Math.min(languageCount * 10, 50);
  
  return Math.round(Math.max(0, distributionScore + languageScore));
};

// Calculate legitimacy score and generate indicators
const analyzeLegitimacy = (profile: LeetCodeProfile): { score: number; indicators: LegitimacyIndicator[] } => {
  const indicators: LegitimacyIndicator[] = [];
  let score = 100;
  
  const { totalSolved, activeDays, streak, hardSolved, contestRating, contestsAttended, recentSubmissions } = profile;
  
  // Check 1: Problems per active day ratio
  const problemsPerDay = activeDays > 0 ? totalSolved / activeDays : 0;
  if (problemsPerDay > 8) {
    score -= 20;
    indicators.push({
      label: 'High Problem-per-Day Ratio',
      status: 'suspicious',
      description: `Average of ${problemsPerDay.toFixed(1)} problems per active day is unusually high.`,
    });
  } else if (problemsPerDay > 5) {
    score -= 10;
    indicators.push({
      label: 'Elevated Problem-per-Day Ratio',
      status: 'warning',
      description: `Average of ${problemsPerDay.toFixed(1)} problems per day is above typical patterns.`,
    });
  } else {
    indicators.push({
      label: 'Normal Solving Pace',
      status: 'good',
      description: `Average of ${problemsPerDay.toFixed(1)} problems per day is within normal range.`,
    });
  }
  
  // Check 2: Hard problems vs contest rating
  if (hardSolved > 100 && contestRating < 1600 && contestsAttended > 5) {
    score -= 15;
    indicators.push({
      label: 'Hard/Contest Mismatch',
      status: 'warning',
      description: 'High hard problem count but relatively low contest rating suggests possible copy-paste solving.',
    });
  } else if (hardSolved > 50 || contestRating > 1800) {
    indicators.push({
      label: 'Skills Verified by Contests',
      status: 'good',
      description: 'Contest performance aligns with problem-solving statistics.',
    });
  }
  
  // Check 3: Submission pattern consistency
  const recentCounts = recentSubmissions.slice(0, 30).map(s => s.count);
  const avgRecent = recentCounts.reduce((a, b) => a + b, 0) / (recentCounts.length || 1);
  const hasSpikes = recentCounts.some(c => c > avgRecent * 5 && c > 10);
  
  if (hasSpikes) {
    score -= 10;
    indicators.push({
      label: 'Irregular Submission Spikes',
      status: 'warning',
      description: 'Unusual spikes in daily submissions detected, which may indicate batch solving.',
    });
  } else {
    indicators.push({
      label: 'Consistent Submission Pattern',
      status: 'good',
      description: 'Submission activity shows natural, consistent patterns.',
    });
  }
  
  // Check 4: Active streak vs total solved
  if (streak > 100 && totalSolved < 200) {
    indicators.push({
      label: 'Great Consistency',
      status: 'good',
      description: `${streak}-day streak demonstrates genuine dedication to learning.`,
    });
  } else if (streak > 30) {
    indicators.push({
      label: 'Healthy Streak',
      status: 'good',
      description: `${streak}-day active streak shows regular practice habits.`,
    });
  }
  
  // Check 5: Language usage patterns
  const topLanguagePercentage = profile.languages.length > 0 
    ? (profile.languages[0].value / totalSolved) * 100 
    : 0;
  
  if (topLanguagePercentage > 95 && profile.languages.length === 1) {
    indicators.push({
      label: 'Single Language Focus',
      status: 'warning',
      description: 'Using only one language might indicate automated solving.',
    });
    score -= 5;
  } else if (profile.languages.length >= 2) {
    indicators.push({
      label: 'Multi-language Proficiency',
      status: 'good',
      description: `Uses ${profile.languages.length} programming languages, showing versatility.`,
    });
  }
  
  return { score: Math.max(0, score), indicators };
};

// Calculate overall score
const calculateOverallScore = (
  consistencyScore: number,
  diversityScore: number,
  legitimacyScore: number
): number => {
  // Weighted average
  return Math.round(
    consistencyScore * 0.25 +
    diversityScore * 0.25 +
    legitimacyScore * 0.5
  );
};


// Calculate legitimacy probability (0-1) based on key metrics and legitimacy score
const calculateLegitimacyProbability = (profile: LeetCodeProfile, legitimacyScore: number): number => {
  // Heuristic: combine normalized metrics and legitimacy score
  const { activeDays, totalSolved, recentSubmissions } = profile;
  const submissionCount = recentSubmissions.reduce((sum, s) => sum + s.count, 0);

  // Normalize metrics (cap at reasonable upper bounds)
  const normActiveDays = Math.min(activeDays, 365) / 365; // 1 year max
  const normSolved = Math.min(totalSolved, 1000) / 1000;
  const normSubmissions = Math.min(submissionCount, 5000) / 5000;
  const normLegitimacy = legitimacyScore / 100;

  // Weighted sum (tune weights as needed)
  const probability = 0.25 * normActiveDays + 0.25 * normSolved + 0.2 * normSubmissions + 0.3 * normLegitimacy;
  return Math.max(0, Math.min(1, probability));
};

export const analyzeProfile = (profile: LeetCodeProfile): AnalysisResult => {
  const consistencyScore = calculateConsistencyScore(profile);
  const diversityScore = calculateDiversityScore(profile);
  const { score: legitimacyScore, indicators } = analyzeLegitimacy(profile);
  const overallScore = calculateOverallScore(consistencyScore, diversityScore, legitimacyScore);
  const legitimacyProbability = calculateLegitimacyProbability(profile, legitimacyScore);
  return {
    profile,
    scores: {
      overall: overallScore,
      consistency: consistencyScore,
      diversity: diversityScore,
      legitimacy: legitimacyScore,
    },
    legitimacyProbability,
    indicators,
  };
};
