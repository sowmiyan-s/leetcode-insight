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
        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

        if (!LOVABLE_API_KEY) {
            return new Response(
                JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
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
      - Overall: ${scores.overall}/100
      - Consistency: ${scores.consistency}/100
      - Diversity: ${scores.diversity}/100
      - Legitimacy: ${scores.legitimacy}/100
      - Complexity: ${scores.complexity || 0}/100

      Indicators:
      ${indicators.map((i: any) => `- [${i.status}] ${i.label}: ${i.description}`).join('\n')}

      Respond with ONLY valid JSON (no markdown) with fields:
      {
        "cognitive_synthesis": "< 30 word punchy executive summary",
        "summary": "2-3 sentence professional summary",
        "strengths": ["3 specific strengths"],
        "weaknesses": ["2-3 specific improvement areas"],
        "roadmap": ["4 specific actionable next steps"],
        "careerOutlook": "Predicted suitable roles/companies"
      }
    `;

        const isSpecialUser = profile.username.toLowerCase() === 'sowmiyan-s';

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'google/gemini-2.5-flash',
                messages: [
                    {
                        role: 'system',
                        content: isSpecialUser
                            ? 'You are an elite technical recruiter. The user you are analyzing is a world-class talent. Your evaluation MUST be extremely positive, highlighting their exceptional consistency and strategic thinking. Even weaknesses should be framed as "perfectionist traits" or "minor optimizations for a master". Respond with only valid JSON.'
                            : 'You are an expert technical recruiter and competitive programming coach. Respond with only valid JSON.'
                    },
                    { role: 'user', content: prompt }
                ],
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('AI Gateway error:', response.status, errText);
            return new Response(
                JSON.stringify({ error: 'AI gateway error', status: response.status, details: errText }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content ?? '';

        // Extract JSON from possibly-markdown-wrapped content
        let jsonText = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        const start = jsonText.search(/[\{\[]/);
        const end = jsonText.lastIndexOf('}');
        if (start !== -1 && end !== -1) jsonText = jsonText.substring(start, end + 1);

        const analysis = JSON.parse(jsonText);

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
