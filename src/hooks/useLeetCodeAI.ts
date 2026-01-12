import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult } from '@/types/leetcode';

interface AIAnalysis {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    roadmap: string[];
    careerOutlook: string;
}

export const useLeetCodeAI = () => {
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateAnalysis = async (data: AnalysisResult) => {
        setIsLoading(true);
        setError(null);
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
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { analysis, isLoading, error, generateAnalysis };
};
