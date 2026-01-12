export interface LeetCodeProfile {
  username: string;
  avatar: string;
  realName?: string;
  location?: string;
  aboutMe?: string;
  ranking: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
  streak: number;
  activeDays: number;
  contestRating: number;
  contestsAttended: number;
  topPercentage: number;
  languages: { name: string; value: number }[];
  recentSubmissions: { date: string; count: number }[];
  badges: { name: string; icon: string }[];
}

export interface LegitimacyIndicator {
  label: string;
  status: 'good' | 'warning' | 'suspicious';
  description: string;
}

export interface AnalysisResult {
  profile: LeetCodeProfile;
  scores: {
    overall: number;
    consistency: number;
    diversity: number;
    legitimacy: number;
    complexity: number;
    accuracy: number;
  };
  legitimacyProbability: number;
  indicators: LegitimacyIndicator[];
}
