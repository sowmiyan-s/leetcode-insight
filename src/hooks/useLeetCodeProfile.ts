import { useState } from 'react';
import { LeetCodeProfile } from '@/types/leetcode';
import { useToast } from '@/hooks/use-toast';

// LeetCode GraphQL API endpoint (public)
const LEETCODE_API = 'https://leetcode.com/graphql';

const fetchLeetCodeProfile = async (username: string): Promise<LeetCodeProfile> => {
  // Query for user profile
  const profileQuery = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          aboutMe
          countryName
          ranking
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        languageProblemCount {
          languageName
          problemsSolved
        }
        userCalendar {
          streak
          totalActiveDays
          submissionCalendar
        }
      }
      allQuestionsCount {
        difficulty
        count
      }
    }
  `;

  // Query for contest rating
  const contestQuery = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
      }
    }
  `;

  try {
    // Fetch profile data
    const profileResponse = await fetch(LEETCODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: profileQuery,
        variables: { username },
      }),
    });

    const profileData = await profileResponse.json();
    
    if (!profileData.data?.matchedUser) {
      throw new Error('User not found');
    }

    const user = profileData.data.matchedUser;
    const allQuestions = profileData.data.allQuestionsCount;

    // Fetch contest data
    const contestResponse = await fetch(LEETCODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: contestQuery,
        variables: { username },
      }),
    });

    const contestData = await contestResponse.json();
    const contestInfo = contestData.data?.userContestRanking || {};

    // Parse submission calendar
    const calendar = user.userCalendar?.submissionCalendar 
      ? JSON.parse(user.userCalendar.submissionCalendar) 
      : {};
    
    const recentSubmissions = Object.entries(calendar)
      .map(([timestamp, count]) => ({
        date: new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0],
        count: count as number,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    // Parse solved problems by difficulty
    const solvedByDifficulty = user.submitStatsGlobal?.acSubmissionNum || [];
    const easySolved = solvedByDifficulty.find((s: any) => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = solvedByDifficulty.find((s: any) => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = solvedByDifficulty.find((s: any) => s.difficulty === 'Hard')?.count || 0;
    const totalSolved = easySolved + mediumSolved + hardSolved;

    // Parse total questions
    const easyTotal = allQuestions.find((q: any) => q.difficulty === 'Easy')?.count || 0;
    const mediumTotal = allQuestions.find((q: any) => q.difficulty === 'Medium')?.count || 0;
    const hardTotal = allQuestions.find((q: any) => q.difficulty === 'Hard')?.count || 0;

    // Parse languages
    const languages = (user.languageProblemCount || [])
      .filter((l: any) => l.problemsSolved > 0)
      .map((l: any) => ({
        name: l.languageName,
        value: l.problemsSolved,
      }))
      .sort((a: any, b: any) => b.value - a.value);

    return {
      username: user.username,
      avatar: user.profile?.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
      realName: user.profile?.realName,
      location: user.profile?.countryName,
      aboutMe: user.profile?.aboutMe,
      ranking: user.profile?.ranking || 0,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      easyTotal,
      mediumTotal,
      hardTotal,
      streak: user.userCalendar?.streak || 0,
      activeDays: user.userCalendar?.totalActiveDays || 0,
      contestRating: Math.round(contestInfo.rating || 0),
      contestsAttended: contestInfo.attendedContestsCount || 0,
      topPercentage: contestInfo.topPercentage || 0,
      languages,
      recentSubmissions,
      badges: [],
    };
  } catch (error) {
    console.error('Error fetching LeetCode profile:', error);
    throw error;
  }
};

export const useLeetCodeProfile = () => {
  const [profile, setProfile] = useState<LeetCodeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = async (username: string) => {
    setIsLoading(true);
    setError(null);
    setProfile(null);

    try {
      const data = await fetchLeetCodeProfile(username);
      setProfile(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(message);
      toast({
        title: 'Error',
        description: message === 'User not found' 
          ? `Could not find LeetCode user "${username}"` 
          : 'Failed to fetch profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading, error, fetchProfile };
};
