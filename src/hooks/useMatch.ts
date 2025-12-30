import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getProblemBySlug } from '@/lib/problems-data';
import type { Problem } from '@/types';

export type MatchStatus = 'loading' | 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'not_found';

interface Opponent {
  id: string;
  username: string | null;
  elo: number;
}

interface Submission {
  id: string;
  user_id: string;
  tests_passed: number;
  tests_total: number;
  is_final: boolean;
  submitted_at: string;
  code_length: number;
}

interface MatchData {
  id: string;
  player1_id: string;
  player2_id: string;
  problem_slug: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  time_limit_seconds: number;
  winner_id: string | null;
  first_correct_submission_at: string | null;
  grace_timer_ends_at: string | null;
}

export function useMatch(matchId: string) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [status, setStatus] = useState<MatchStatus>('loading');
  const [match, setMatch] = useState<MatchData | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [graceTimeRemaining, setGraceTimeRemaining] = useState<number | null>(null);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [opponentSubmissions, setOpponentSubmissions] = useState<Submission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<{
    tests_passed: number;
    tests_total: number;
    all_passed: boolean;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch match data
  const fetchMatch = useCallback(async () => {
    if (!matchId || !user) return;

    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching match:', error);
      setStatus('not_found');
      return;
    }

    // Verify user is a player
    if (data.player1_id !== user.id && data.player2_id !== user.id) {
      setStatus('not_found');
      return;
    }

    setMatch(data as MatchData);
    setStatus(data.status as MatchStatus);

    // Fetch problem
    const problemData = getProblemBySlug(data.problem_slug);
    setProblem(problemData || null);

    // Fetch opponent profile
    const opponentId = data.player1_id === user.id ? data.player2_id : data.player1_id;
    const { data: opponentData } = await supabase
      .from('profiles')
      .select('id, username, elo')
      .eq('id', opponentId)
      .single();

    if (opponentData) {
      setOpponent(opponentData);
    }

    // Fetch existing submissions
    const { data: submissions } = await supabase
      .from('submissions')
      .select('*')
      .eq('match_id', matchId)
      .order('submitted_at', { ascending: false });

    if (submissions) {
      setMySubmissions(submissions.filter((s: Submission) => s.user_id === user.id) as Submission[]);
      setOpponentSubmissions(submissions.filter((s: Submission) => s.user_id !== user.id) as Submission[]);
    }
  }, [matchId, user]);

  // Start match when ready
  const startMatch = useCallback(async () => {
    if (!match || match.status !== 'waiting') return;

    try {
      const { error } = await supabase.rpc('start_match', { match_id: match.id });
      if (error) throw error;
      
      // Refetch to get updated status
      fetchMatch();
    } catch (error) {
      console.error('Error starting match:', error);
    }
  }, [match, fetchMatch]);

  // Submit code for grading
  const submitCode = useCallback(async (code: string, isFinal: boolean = false) => {
    if (!match || isSubmitting) return null;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('grade-submission', {
        body: {
          matchId: match.id,
          code,
          isFinal,
        },
      });

      if (error) throw error;

      if (data.submission) {
        setLastTestResult({
          tests_passed: data.submission.tests_passed,
          tests_total: data.submission.tests_total,
          all_passed: data.submission.all_passed,
        });

        // Refresh submissions
        fetchMatch();

        if (data.submission.all_passed) {
          toast({
            title: '🎉 All tests passed!',
            description: isFinal ? 'Your submission has been locked in.' : 'You can submit again or wait for your opponent.',
          });
        } else {
          toast({
            title: `${data.submission.tests_passed}/${data.submission.tests_total} tests passed`,
            description: 'Keep trying!',
            variant: data.submission.tests_passed > 0 ? 'default' : 'destructive',
          });
        }

        if (data.matchEnded) {
          toast({
            title: 'Match Complete!',
            description: data.winnerId === user?.id ? 'You won!' : data.winnerId ? 'You lost.' : 'It\'s a draw!',
          });
          fetchMatch();
        }
      }

      return data;
    } catch (error) {
      console.error('Error submitting code:', error);
      toast({
        title: 'Submission failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [match, isSubmitting, user, fetchMatch, toast]);

  // Calculate time remaining
  useEffect(() => {
    if (!match || match.status !== 'in_progress') return;

    const calculateTime = () => {
      if (match.start_time) {
        const startTime = new Date(match.start_time).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, match.time_limit_seconds - elapsed);
        setTimeRemaining(remaining);

        // Check grace timer
        if (match.grace_timer_ends_at) {
          const graceEnd = new Date(match.grace_timer_ends_at).getTime();
          const graceRemaining = Math.max(0, Math.floor((graceEnd - now) / 1000));
          setGraceTimeRemaining(graceRemaining);
        }

        // Match expired - check timeout
        if (remaining === 0 || (match.grace_timer_ends_at && graceTimeRemaining === 0)) {
          supabase.functions.invoke('check-match-timeout', {
            body: { matchId: match.id }
          }).then(() => fetchMatch());
        }
      }
    };

    calculateTime();
    timerRef.current = setInterval(calculateTime, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [match, graceTimeRemaining, fetchMatch]);

  // Subscribe to match updates
  useEffect(() => {
    if (!matchId || !user) return;

    const channel = supabase
      .channel(`match-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          console.log('Match update:', payload);
          if (payload.new) {
            setMatch(payload.new as MatchData);
            setStatus((payload.new as MatchData).status as MatchStatus);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'submissions',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          console.log('New submission:', payload);
          const newSubmission = payload.new as Submission;
          
          if (newSubmission.user_id === user.id) {
            setMySubmissions(prev => [newSubmission, ...prev]);
          } else {
            setOpponentSubmissions(prev => [newSubmission, ...prev]);
            
            // Notify about opponent submission
            if (newSubmission.is_final) {
              toast({
                title: 'Opponent submitted!',
                description: `Your opponent has locked in their solution.`,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, user, toast]);

  // Initial fetch
  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  // Auto-start match after loading
  useEffect(() => {
    if (match?.status === 'waiting') {
      // Wait a moment then start
      const timeout = setTimeout(() => {
        startMatch();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [match?.status, startMatch]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    status,
    match,
    problem,
    opponent,
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    graceTimeRemaining,
    formattedGraceTime: graceTimeRemaining !== null ? formatTime(graceTimeRemaining) : null,
    mySubmissions,
    opponentSubmissions,
    isSubmitting,
    lastTestResult,
    submitCode,
    user,
    profile,
  };
}
