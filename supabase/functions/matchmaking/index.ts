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

// Helper to get CORS headers based on origin
const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
};

// Problems pool for random selection
const PROBLEM_POOL = [
  'two-sum',
  'reverse-string',
  'palindrome-number',
  'fizzbuzz',
  'valid-anagram',
  'merge-sorted-arrays',
  'binary-search',
  'longest-common-prefix',
  'valid-parentheses',
  'maximum-subarray'
];

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Get authenticated user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's auth token to verify identity
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      console.log('Authentication failed');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;

    // Create service client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's ELO from their profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('elo')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.log('Failed to fetch user profile');
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const elo = profile?.elo || 1000;
    
    // Log without exposing user IDs
    console.log(`Matchmaking request: ELO ${elo}`);

    // Get all users in queue (excluding current user)
    const { data: queueEntries, error: queueError } = await supabase
      .from('match_queue')
      .select('*')
      .neq('user_id', userId)
      .order('queued_at', { ascending: true });

    if (queueError) {
      console.error('Error fetching queue');
      throw queueError;
    }

    console.log(`Queue size: ${queueEntries?.length || 0}`);

    if (!queueEntries || queueEntries.length === 0) {
      // No opponents available, user stays in queue
      return new Response(
        JSON.stringify({ status: 'waiting', message: 'Waiting for opponent' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find best match based on ELO difference
    const ELO_RANGE = 150;
    let bestMatch = null;
    let smallestDiff = Infinity;

    for (const entry of queueEntries) {
      const diff = Math.abs(entry.elo - elo);
      if (diff <= ELO_RANGE && diff < smallestDiff) {
        bestMatch = entry;
        smallestDiff = diff;
      }
    }

    // If no match within range, expand search
    if (!bestMatch && queueEntries.length > 0) {
      // Find closest ELO match regardless of range
      for (const entry of queueEntries) {
        const diff = Math.abs(entry.elo - elo);
        if (diff < smallestDiff) {
          bestMatch = entry;
          smallestDiff = diff;
        }
      }
    }

    if (!bestMatch) {
      return new Response(
        JSON.stringify({ status: 'waiting', message: 'No suitable opponent found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log without exposing user IDs
    console.log(`Match found with ELO diff: ${smallestDiff}`);

    // Select random problem
    const problemSlug = PROBLEM_POOL[Math.floor(Math.random() * PROBLEM_POOL.length)];

    // Create match
    const startTime = new Date(Date.now() + 5000).toISOString(); // Start in 5 seconds
    
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert({
        player1_id: userId,
        player2_id: bestMatch.user_id,
        problem_slug: problemSlug,
        status: 'waiting',
        start_time: startTime,
        time_limit_seconds: 1800 // 30 minutes
      })
      .select()
      .single();

    if (matchError) {
      console.error('Error creating match');
      throw matchError;
    }

    console.log('Match created successfully');

    // Remove both players from queue
    await supabase
      .from('match_queue')
      .delete()
      .in('user_id', [userId, bestMatch.user_id]);

    console.log('Players removed from queue');

    return new Response(
      JSON.stringify({ 
        status: 'matched', 
        matchId: match.id,
        opponent: bestMatch.user_id,
        problem: problemSlug
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Matchmaking error occurred');
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
