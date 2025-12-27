import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlatformStats {
  totalPlayers: number;
  totalMatches: number;
  highestElo: number;
}

export function usePlatformStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PlatformStats>({
    totalPlayers: 0,
    totalMatches: 0,
    highestElo: 1000,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      // Fetch total players count
      const { count: playersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total completed matches count
      const { count: matchesCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Fetch highest ELO
      const { data: topPlayer } = await supabase
        .from('profiles')
        .select('elo')
        .order('elo', { ascending: false })
        .limit(1)
        .maybeSingle();

      setStats({
        totalPlayers: playersCount || 0,
        totalMatches: matchesCount || 0,
        highestElo: topPlayer?.elo || 1000,
      });

      setLoading(false);
    };

    fetchStats();

    // Subscribe to real-time updates
    const profilesChannel = supabase
      .channel('platform-stats-profiles')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    const matchesChannel = supabase
      .channel('platform-stats-matches')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(matchesChannel);
    };
  }, []);

  return { stats, loading };
}
