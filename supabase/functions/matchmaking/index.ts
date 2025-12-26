import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId, elo } = await req.json();
    console.log(`Matchmaking request from user ${userId} with ELO ${elo}`);

    // Get all users in queue (excluding current user)
    const { data: queueEntries, error: queueError } = await supabase
      .from('match_queue')
      .select('*')
      .neq('user_id', userId)
      .order('queued_at', { ascending: true });

    if (queueError) {
      console.error('Error fetching queue:', queueError);
      throw queueError;
    }

    console.log(`Found ${queueEntries?.length || 0} other users in queue`);

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

    console.log(`Found match: ${userId} vs ${bestMatch.user_id} (ELO diff: ${smallestDiff})`);

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
      console.error('Error creating match:', matchError);
      throw matchError;
    }

    console.log(`Match created: ${match.id}`);

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
    console.error('Matchmaking error:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
