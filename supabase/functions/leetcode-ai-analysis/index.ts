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
        const mistralKey = Deno.env.get('MISTRAL_API_KEY');

        if (!mistralKey) {
            return new Response(
                JSON.stringify({ error: 'Mistral API key not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const prompt = `
      Analyze this LeetCode profile and provide a professional evaluation.
      
      User: ${profile.username}
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

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mistralKey}`,
            },
            body: JSON.stringify({
                model: 'mistral-tiny',
                messages: [
                    { role: 'system', content: 'You are an expert technical recruiter and competitive programming coach.' },
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
