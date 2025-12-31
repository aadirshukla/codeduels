import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://przpywazavdzmrcdxlqr.lovableproject.com',
  'https://lovable.dev',
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000'
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
};

// Simple in-memory rate limiting (per-worker, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_REQUESTS_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const key = `timeout:${userId}`;
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      console.warn(`Rate limit exceeded for timeout check: ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait before trying again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { matchId } = await req.json();
    
    if (!matchId || typeof matchId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing matchId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking match timeout: ${matchId}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get match details
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (matchError || !match) {
      return new Response(
        JSON.stringify({ error: 'Match not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is a player
    if (match.player1_id !== user.id && match.player2_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'You are not a player in this match' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if match is still in progress
    if (match.status !== 'in_progress') {
      return new Response(
        JSON.stringify({ 
          ended: match.status === 'completed',
          status: match.status,
          winner_id: match.winner_id 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = Date.now();
    let shouldEnd = false;
    let endReason = '';

    // Check main timer expiration
    if (match.start_time) {
      const startTime = new Date(match.start_time).getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      
      if (elapsed >= match.time_limit_seconds) {
        shouldEnd = true;
        endReason = 'time_expired';
      }
    }

    // Check grace timer expiration
    if (match.grace_timer_ends_at) {
      const graceEnd = new Date(match.grace_timer_ends_at).getTime();
      if (now >= graceEnd) {
        shouldEnd = true;
        endReason = 'grace_timer_expired';
      }
    }

    if (!shouldEnd) {
      return new Response(
        JSON.stringify({ ended: false, status: 'in_progress' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Match ending due to: ${endReason}`);

    // Get all final submissions or best submissions
    const { data: submissions } = await supabase
      .from('submissions')
      .select('*')
      .eq('match_id', matchId)
      .order('tests_passed', { ascending: false })
      .order('submitted_at', { ascending: true })
      .order('code_length', { ascending: true });

    // Group by user and get best submission per player
    const player1Submissions = submissions?.filter((s: { user_id: string }) => s.user_id === match.player1_id) || [];
    const player2Submissions = submissions?.filter((s: { user_id: string }) => s.user_id === match.player2_id) || [];

    const player1Best = player1Submissions[0] as { tests_passed: number; submitted_at: string; code_length: number } | undefined;
    const player2Best = player2Submissions[0] as { tests_passed: number; submitted_at: string; code_length: number } | undefined;

    let winnerId = null;

    // Determine winner based on scoring rules
    if (player1Best && player2Best) {
      // Both submitted - compare
      if (player1Best.tests_passed > player2Best.tests_passed) {
        winnerId = match.player1_id;
      } else if (player2Best.tests_passed > player1Best.tests_passed) {
        winnerId = match.player2_id;
      } else {
        // Tie on accuracy - check time
        const p1Time = new Date(player1Best.submitted_at).getTime();
        const p2Time = new Date(player2Best.submitted_at).getTime();
        
        if (p1Time < p2Time) {
          winnerId = match.player1_id;
        } else if (p2Time < p1Time) {
          winnerId = match.player2_id;
        } else {
          // Tie on time - check code length
          if (player1Best.code_length < player2Best.code_length) {
            winnerId = match.player1_id;
          } else if (player2Best.code_length < player1Best.code_length) {
            winnerId = match.player2_id;
          }
        }
      }
    } else if (player1Best && !player2Best) {
      winnerId = match.player1_id;
    } else if (player2Best && !player1Best) {
      winnerId = match.player2_id;
    }

    // Update match
    await supabase
      .from('matches')
      .update({
        status: 'completed',
        end_time: new Date().toISOString(),
        winner_id: winnerId,
      })
      .eq('id', matchId);

    // Update ELO and stats
    if (winnerId) {
      const loserId = winnerId === match.player1_id ? match.player2_id : match.player1_id;
      
      const { data: winnerProfile } = await supabase
        .from('profiles')
        .select('elo, wins')
        .eq('id', winnerId)
        .single();
      
      const { data: loserProfile } = await supabase
        .from('profiles')
        .select('elo, losses')
        .eq('id', loserId)
        .single();

      if (winnerProfile && loserProfile) {
        const K = 32;
        const expectedWinner = 1 / (1 + Math.pow(10, (loserProfile.elo - winnerProfile.elo) / 400));
        const expectedLoser = 1 - expectedWinner;
        
        const winnerNewElo = Math.round(winnerProfile.elo + K * (1 - expectedWinner));
        const loserNewElo = Math.round(loserProfile.elo + K * (0 - expectedLoser));

        await supabase
          .from('profiles')
          .update({ elo: winnerNewElo, wins: winnerProfile.wins + 1 })
          .eq('id', winnerId);

        await supabase
          .from('profiles')
          .update({ elo: loserNewElo, losses: loserProfile.losses + 1 })
          .eq('id', loserId);
      }
    }

    console.log(`Match ${matchId} completed. Winner: ${winnerId || 'draw'}`);

    return new Response(
      JSON.stringify({ 
        ended: true, 
        status: 'completed',
        winner_id: winnerId,
        reason: endReason
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Check timeout error:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'An error occurred checking match status' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
