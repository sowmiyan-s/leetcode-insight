import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LEETCODE_API = 'https://leetcode.com/graphql';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();

    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching LeetCode profile for: ${username}`);

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

    // Fetch profile data
    const profileResponse = await fetch(LEETCODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: profileQuery,
        variables: { username },
      }),
    });

    const profileData = await profileResponse.json();
    console.log('Profile response received:', JSON.stringify(profileData).slice(0, 200));

    if (!profileData.data?.matchedUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user = profileData.data.matchedUser;
    const allQuestions = profileData.data.allQuestionsCount;

    // Fetch contest data
    const contestResponse = await fetch(LEETCODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com',
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

    const profile = {
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

    console.log(`Successfully fetched profile for: ${username}`);

    return new Response(
      JSON.stringify(profile),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error fetching LeetCode profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to fetch profile', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
