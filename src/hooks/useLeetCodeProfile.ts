import { useState } from 'react';
import { LeetCodeProfile } from '@/types/leetcode';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      console.log(`Fetching profile for: ${username}`);
      
      const { data, error: fnError } = await supabase.functions.invoke('leetcode-profile', {
        body: { username },
      });

      if (fnError) {
        console.error('Edge function error:', fnError);
        throw new Error(fnError.message || 'Failed to fetch profile');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Profile data received:', data);
      setProfile(data as LeetCodeProfile);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      console.error('Error:', message);
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
