import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult } from '@/types/leetcode';

interface AIAnalysis {
    summary: string;
    cognitive_synthesis: string;
    strengths: string[];
    weaknesses: string[];
    roadmap: string[];
    careerOutlook: string;
}

export const useLeetCodeAI = () => {
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateFallbackAnalysis = (data: AnalysisResult): AIAnalysis => {
        const { scores, profile } = data;

        // 1. Dynamic Strengths
        const strengths = [];
        if (scores.consistency > 80) strengths.push("Elite Operational Consistency");
        if (scores.diversity > 70) strengths.push("Broad Algorithmic Versatility");
        if (scores.legitimacy > 90) strengths.push("Verified Organic Growth");
        if (profile.hardSolved > 50) strengths.push("Mastery of Complex Systems");
        if (profile.contestRating > 1600) strengths.push("Competitive Pressure Handling");
        if (strengths.length === 0) strengths.push("Demonstrated Learning Capacity");

        // 2. Dynamic Weaknesses
        const weaknesses = [];
        if (profile.hardSolved < 10) weaknesses.push("Limited exposure to advanced complexity (Hard problems)");
        if (profile.contestRating === 0) weaknesses.push("Unverified performance under time constraints");
        if (profile.languages.length === 1) weaknesses.push("Single-language dependency limits architectural flexibility");
        if (profile.mediumSolved < profile.easySolved) weaknesses.push("Heavy reliance on foundational (Easy) problems");
        if (scores.consistency < 50) weaknesses.push("Irregular engagement patterns affect long-term retention");
        if (weaknesses.length === 0) weaknesses.push("Minor optimizations needed in edge-case handling");

        // 3. Dynamic Roadmap
        const roadmap = [];
        if (profile.hardSolved < 20) roadmap.push("Target 20 Hard problems focusing on DP and Graphs");
        if (!profile.contestRating) roadmap.push("Participate in 3 consecutive Weekly Contests");
        else if (profile.contestRating < 1600) roadmap.push("Analyze contest post-mortems to break 1600 rating");
        if (scores.diversity < 50) roadmap.push("Solve Top 50 Interview Questions in a second language");
        if (scores.consistency < 60) roadmap.push("Commit to a strict 21-day continuous submission streak");
        if (roadmap.length < 4) roadmap.push(" Contribute to system design discussions in LeetCode Discuss");

        // 4. Dynamic Career Outlook
        let outlook = "Building a solid foundation for junior engineering roles.";
        if (scores.overall > 85) outlook = "Strong candidate for Senior/Staff Engineer roles at top-tier tech firms (FAANG/HFT).";
        else if (scores.overall > 70) outlook = "Well-positioned for Mid-Senior Backend or Full Stack roles at product-based companies.";
        else if (scores.overall > 50) outlook = "Ready for Junior to Mid-level Software Engineering interviews.";

        return {
            summary: `This profile demonstrates a ${scores.overall > 60 ? 'robust' : 'developing'} grasp of algorithms, highlighted by a consistency score of ${scores.consistency}. Their pattern suggests a preference for ${profile.mediumSolved > profile.easySolved ? 'optimal complexity' : 'rapid foundational solving'}.`,
            cognitive_synthesis: `Demonstrates ${scores.consistency > 80 ? 'elite discipline' : 'steady effort'} with a focus on ${profile.hardSolved > 20 ? 'high-complexity architectures' : 'core fundamentals'}. ${profile.languages.length > 1 ? 'Polyglot engineer' : 'Specialist'} with ${scores.legitimacy > 90 ? 'verified authentic' : 'standard'} growth patterns.`,
            strengths: strengths.slice(0, 3),
            weaknesses: weaknesses.slice(0, 3),
            roadmap: roadmap.slice(0, 4),
            careerOutlook: outlook
        };
    };

    const generateAnalysis = async (data: AnalysisResult) => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const { data: aiData, error: fnError } = await supabase.functions.invoke('leetcode-ai-analysis', {
                body: {
                    profile: data.profile,
                    scores: data.scores,
                    indicators: data.indicators
                },
            });

            if (fnError) throw new Error(fnError.message);
            setAnalysis(aiData as AIAnalysis);
        } catch (err: any) {
            console.warn("AI Analysis failed, using fallback:", err.message);
            // Use local fallback if API fails
            setAnalysis(generateFallbackAnalysis(data));
        } finally {
            setIsLoading(false);
        }
    };

    return { analysis, isLoading, error, generateAnalysis };
};
