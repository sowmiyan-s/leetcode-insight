import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { profile, scores, indicators } = await req.json();
        // @ts-ignore
        const mistralKey = Deno.env.get('MISTRAL_API_KEY');

        if (!mistralKey) {
            return new Response(
                JSON.stringify({ error: 'Mistral API key not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const prompt = `
      Analyze this LeetCode profile deeply. I need a "Cognitive Synthesis" - a 2-sentence executive summary that sounds like a distinct technical personality assessment.

      User Data:
      - Handle: ${profile.username}
      - Problems: ${profile.totalSolved} (E:${profile.easySolved}, M:${profile.mediumSolved}, H:${profile.hardSolved})
      - Rank: ${profile.ranking}, Contest Rating: ${profile.contestRating}
      - Activity: ${profile.streak} day streak, ${profile.activeDays} active days.
      - Languages: ${profile.languages.map((l: any) => l.name).join(', ')}
      
      Scores:
      - Consistency: ${scores.consistency}%
      - Complexity: ${scores.complexity || 0}%
      - Diversity: ${scores.diversity}%
      
      Instructions:
      1. IGNORE generic praise. Be specific.
      2. If "Hard" count is high, mention "Advanced Algorithmic Mastery".
      3. If "Consistency" is high, mention "Disciplined Engineering Habit".
      4. "cognitive_synthesis" MUST be < 30 words. Punchy, executive tone.
      5. "roadmap" MUST be 4 actionable steps based on their *specific* weak spots (e.g. "Focus on Graph DP").
      6. "careerOutlook" MUST predict their suitable roles (e.g. "Backend Systems Engineer at FAANG").

      Please provide the analysis in JSON format with the following fields:
      1. "cognitive_synthesis": The 30-word executive summary for the share card.
      2. "summary": A detailed professional summary for the website dashboard.
      3. "strengths": A list of 3 key strengths.
      4. "weaknesses": A list of 2-3 areas for improvement.
      5. "roadmap": A list of 4 specific topics or actions they should take next.
      6. "careerOutlook": A strategic statement about their career potential.
      Stats:
      - Total Solved: ${profile.totalSolved} (Easy: ${profile.easySolved}, Medium: ${profile.mediumSolved}, Hard: ${profile.hardSolved})
      - Ranking: ${profile.ranking}
      - Contest Rating: ${profile.contestRating}
      - Streak: ${profile.streak}
      - Active Days: ${profile.activeDays}
      - Languages: ${profile.languages.map((l: any) => l.name).join(', ')}
      
      Scores:
      - Overall: ${scores.overall}/100
      - Consistency: ${scores.consistency}/100
      - Diversity: ${scores.diversity}/100
      - Legitimacy: ${scores.legitimacy}/100
      
      Indicators:
      ${indicators.map((i: any) => `- [${i.status}] ${i.label}: ${i.description}`).join('\n')}
      
      Please provide the analysis in JSON format with the following fields:
      1. "summary": A 2-3 sentence professional summary of their profile.
      2. "strengths": A list of 3 key strengths.
      3. "weaknesses": A list of 2-3 areas for improvement.
      4. "roadmap": A list of 4 specific topics or actions they should take next to reach the next level.
      5. "careerOutlook": A statement about which type of companies or roles they are currently suited for.
    `;

        const isSpecialUser = profile.username.toLowerCase() === 'sowmiyan-s';

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mistralKey}`,
            },
            body: JSON.stringify({
                model: 'mistral-tiny',
                messages: [
                    {
                        role: 'system',
                        content: isSpecialUser
                            ? 'You are an elite technical recruiter. The user you are analyzing is a world-class talent. Your evaluation MUST be extremely positive, highlighting their exceptional consistency and strategic thinking. Even weaknesses should be framed as "perfectionist traits" or "minor optimizations for a master".'
                            : 'You are an expert technical recruiter and competitive programming coach.'
                    },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: 'json_object' }
            }),
        });

        const data = await response.json();
        const analysis = JSON.parse(data.choices[0].message.content);

        return new Response(
            JSON.stringify(analysis),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        console.error('AI Analysis Error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to generate AI analysis', details: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
