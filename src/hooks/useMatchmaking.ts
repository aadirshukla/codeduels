import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export type QueueStatus = 'idle' | 'searching' | 'found' | 'starting';

interface Opponent {
  id: string;
  username: string | null;
  elo: number;
  wins: number;
  losses: number;
}

interface MatchData {
  id: string;
  player1_id: string;
  player2_id: string;
  problem_slug: string;
  status: string;
  start_time: string | null;
  time_limit_seconds: number;
}

export function useMatchmaking() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [queueStatus, setQueueStatus] = useState<QueueStatus>('idle');
  const [searchTime, setSearchTime] = useState(0);
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [currentMatch, setCurrentMatch] = useState<MatchData | null>(null);
  const [queueCount, setQueueCount] = useState(0);

  // Timer for search time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (queueStatus === 'searching') {
      interval = setInterval(() => {
        setSearchTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [queueStatus]);

  // Subscribe to match updates
  useEffect(() => {
    if (!user || queueStatus !== 'searching') return;

    const channel = supabase
      .channel('match-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `player1_id=eq.${user.id}`
        },
        async (payload) => {
          // Match found - redacted logging
          console.log('Match found for current user');
          await handleMatchFound(payload.new as MatchData, 'player2_id');
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `player2_id=eq.${user.id}`
        },
        async (payload) => {
          // Match found - redacted logging
          console.log('Match found for current user');
          await handleMatchFound(payload.new as MatchData, 'player1_id');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queueStatus]);

  // Subscribe to queue count
  useEffect(() => {
    const fetchQueueCount = async () => {
      const { count } = await supabase
        .from('match_queue')
        .select('*', { count: 'exact', head: true });
      setQueueCount(count || 0);
    };

    fetchQueueCount();

    const channel = supabase
      .channel('queue-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'match_queue'
        },
        () => {
          fetchQueueCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMatchFound = async (match: MatchData, opponentField: 'player1_id' | 'player2_id') => {
    // Fetch opponent profile
    const { data: opponentData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', match[opponentField])
      .single();

    if (opponentData) {
      setOpponent(opponentData);
    }
    
    setCurrentMatch(match);
    setQueueStatus('found');

    // Remove from queue
    await supabase
      .from('match_queue')
      .delete()
      .eq('user_id', user?.id);

    // Start match after delay
    setTimeout(() => {
      setQueueStatus('starting');
      setTimeout(() => {
        navigate(`/match/${match.id}`);
      }, 2000);
    }, 2000);
  };

  const joinQueue = useCallback(async () => {
    if (!user || !profile) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to join the queue.',
        variant: 'destructive'
      });
      return;
    }

    setQueueStatus('searching');
    setSearchTime(0);

    // Add to queue
    const { error: queueError } = await supabase
      .from('match_queue')
      .insert({
        user_id: user.id,
        elo: profile.elo
      });

    if (queueError) {
      console.error('Error joining queue:', queueError);
      if (queueError.code === '23505') {
        // Already in queue
        toast({
          title: 'Already in queue',
          description: 'You are already searching for a match.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to join queue. Please try again.',
          variant: 'destructive'
        });
        setQueueStatus('idle');
      }
      return;
    }

    // Call matchmaking edge function
    try {
      const { data, error } = await supabase.functions.invoke('matchmaking', {
        body: { userId: user.id, elo: profile.elo }
      });

      // Log status without sensitive details
      if (error) {
        console.error('Matchmaking failed');
      } else if (data?.status) {
        console.log('Matchmaking status:', data.status);
      }
    } catch (err) {
      console.error('Matchmaking request failed');
    }
  }, [user, profile, toast]);

  const leaveQueue = useCallback(async () => {
    if (!user) return;

    await supabase
      .from('match_queue')
      .delete()
      .eq('user_id', user.id);

    setQueueStatus('idle');
    setSearchTime(0);
    setOpponent(null);
    setCurrentMatch(null);
  }, [user]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    queueStatus,
    searchTime,
    formattedSearchTime: formatTime(searchTime),
    opponent,
    currentMatch,
    queueCount,
    joinQueue,
    leaveQueue,
    profile
  };
}
