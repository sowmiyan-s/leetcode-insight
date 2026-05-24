import { useState, useRef, useEffect } from 'react';
import { LeetCodeProfile } from '@/types/leetcode';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useLeetCodeProfile = (pollingIntervalMs: number = 0) => {
  const [profile, setProfile] = useState<LeetCodeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toast } = useToast();

  const fetchProfile = async (usernameToFetch?: string) => {
    const user = usernameToFetch || username;
    if (!user) return;
    setIsLoading(true);
    setError(null);
    setProfile(null);

    try {
      console.log(`Fetching profile for: ${user}`);
      const { data, error: fnError } = await supabase.functions.invoke('leetcode-profile', {
        body: { username: user },
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
          ? `Could not find LeetCode user "${user}"`
          : 'Failed to fetch profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start polling when username is set and pollingIntervalMs > 0
  useEffect(() => {
    if (username && pollingIntervalMs > 0) {
      pollingRef.current = setInterval(() => {
        fetchProfile();
      }, pollingIntervalMs);
      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
      };
    }
    return undefined;
  }, [username, pollingIntervalMs]);

  // Set username and fetch profile
  const startProfilePolling = (user: string) => {
    setUsername(user);
    fetchProfile(user);
  };

  return { profile, isLoading, error, fetchProfile: startProfilePolling };
};
