import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTierFromElo } from '@/lib/utils';
import { Tier } from '@/types';

interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    elo: number;
    tier: Tier;
    wins: number;
    losses: number;
  };
}

export function useLeaderboard(limit = 50) {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username, elo, wins, losses')
        .order('elo', { ascending: false })
        .limit(limit);

      if (fetchError) {
        console.error('Error fetching leaderboard:', fetchError);
        setError(fetchError.message);
        setLeaderboard([]);
      } else if (data) {
        const entries: LeaderboardEntry[] = data.map((profile, index) => ({
          rank: index + 1,
          user: {
            id: profile.id,
            username: profile.username || 'Anonymous',
            elo: profile.elo,
            tier: getTierFromElo(profile.elo),
            wins: profile.wins,
            losses: profile.losses,
          },
        }));
        setLeaderboard(entries);
      }

      setLoading(false);
    };

    fetchLeaderboard();

    // Subscribe to real-time updates on profiles
    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          // Refetch leaderboard when profiles change
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return { leaderboard, loading, error };
}
