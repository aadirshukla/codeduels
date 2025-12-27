import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getTierFromElo } from '@/lib/utils';
import { Tier } from '@/types';

interface UserStats {
  id: string;
  username: string;
  email: string;
  elo: number;
  tier: Tier;
  wins: number;
  losses: number;
  winRate: number;
  createdAt: Date;
  avatarUrl: string | null;
}

interface MatchWithDetails {
  id: string;
  status: string;
  winner_id: string | null;
  problem_slug: string;
  created_at: string;
  start_time: string | null;
  end_time: string | null;
  player1_id: string;
  player2_id: string;
  opponent: {
    id: string;
    username: string;
    elo: number;
  };
  isWinner: boolean;
}

export function useUserStats() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentMatches, setRecentMatches] = useState<MatchWithDetails[]>([]);

  useEffect(() => {
    if (!user || !profile) {
      setStats(null);
      setRecentMatches([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      // Calculate user stats from profile
      const totalMatches = profile.wins + profile.losses;
      const winRate = totalMatches > 0 ? Math.round((profile.wins / totalMatches) * 100) : 0;

      setStats({
        id: profile.id,
        username: profile.username || 'Anonymous',
        email: user.email || '',
        elo: profile.elo,
        tier: getTierFromElo(profile.elo),
        wins: profile.wins,
        losses: profile.losses,
        winRate,
        createdAt: new Date(profile.created_at),
        avatarUrl: profile.avatar_url,
      });

      // Fetch recent matches
      const { data: matches, error } = await supabase
        .from('matches')
        .select('*')
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching matches:', error);
        setRecentMatches([]);
      } else if (matches) {
        // Fetch opponent profiles for each match
        const matchesWithOpponents = await Promise.all(
          matches.map(async (match) => {
            const opponentId = match.player1_id === user.id ? match.player2_id : match.player1_id;
            
            const { data: opponentProfile } = await supabase
              .from('profiles')
              .select('id, username, elo')
              .eq('id', opponentId)
              .maybeSingle();

            return {
              id: match.id,
              status: match.status,
              winner_id: match.winner_id,
              problem_slug: match.problem_slug,
              created_at: match.created_at,
              start_time: match.start_time,
              end_time: match.end_time,
              player1_id: match.player1_id,
              player2_id: match.player2_id,
              opponent: {
                id: opponentId,
                username: opponentProfile?.username || 'Unknown',
                elo: opponentProfile?.elo || 1000,
              },
              isWinner: match.winner_id === user.id,
            };
          })
        );

        setRecentMatches(matchesWithOpponents);
      }

      setLoading(false);
    };

    fetchData();
  }, [user, profile]);

  return { stats, recentMatches, loading };
}
