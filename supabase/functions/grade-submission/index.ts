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

// Input validation constants
const MAX_CODE_LENGTH = 50000; // 50KB max code size
const ALLOWED_LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'cpp', 'c'];

// Simple in-memory rate limiting (per-worker, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_SUBMISSIONS_PER_MINUTE = 30;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const key = `submission:${userId}`;
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_SUBMISSIONS_PER_MINUTE) {
    return false;
  }
  
  record.count++;
  return true;
}

// Problem test cases - in production this would be from a database
const PROBLEM_TEST_CASES: Record<string, { input: string; expected: string; isHidden: boolean }[]> = {
  'two-sum': [
    { input: '[2,7,11,15], 9', expected: '[0,1]', isHidden: false },
    { input: '[3,2,4], 6', expected: '[1,2]', isHidden: false },
    { input: '[3,3], 6', expected: '[0,1]', isHidden: true },
    { input: '[1,2,3,4,5], 9', expected: '[3,4]', isHidden: true },
  ],
  'reverse-string': [
    { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]', isHidden: false },
    { input: '["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]', isHidden: false },
    { input: '["a"]', expected: '["a"]', isHidden: true },
    { input: '["A","B","C","D"]', expected: '["D","C","B","A"]', isHidden: true },
  ],
  'palindrome-number': [
    { input: '121', expected: 'true', isHidden: false },
    { input: '-121', expected: 'false', isHidden: false },
    { input: '10', expected: 'false', isHidden: true },
    { input: '12321', expected: 'true', isHidden: true },
  ],
  'fizzbuzz': [
    { input: '3', expected: '["1","2","Fizz"]', isHidden: false },
    { input: '5', expected: '["1","2","Fizz","4","Buzz"]', isHidden: false },
    { input: '15', expected: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', isHidden: true },
  ],
  'valid-anagram': [
    { input: '"anagram", "nagaram"', expected: 'true', isHidden: false },
    { input: '"rat", "car"', expected: 'false', isHidden: false },
    { input: '"", ""', expected: 'true', isHidden: true },
    { input: '"aacc", "ccac"', expected: 'false', isHidden: true },
  ],
  'merge-sorted-arrays': [
    { input: '[1,2,3,0,0,0], 3, [2,5,6], 3', expected: '[1,2,2,3,5,6]', isHidden: false },
    { input: '[1], 1, [], 0', expected: '[1]', isHidden: false },
    { input: '[0], 0, [1], 1', expected: '[1]', isHidden: true },
  ],
  'binary-search': [
    { input: '[-1,0,3,5,9,12], 9', expected: '4', isHidden: false },
    { input: '[-1,0,3,5,9,12], 2', expected: '-1', isHidden: false },
    { input: '[5], 5', expected: '0', isHidden: true },
  ],
  'longest-common-prefix': [
    { input: '["flower","flow","flight"]', expected: '"fl"', isHidden: false },
    { input: '["dog","racecar","car"]', expected: '""', isHidden: false },
    { input: '[""]', expected: '""', isHidden: true },
  ],
  'valid-parentheses': [
    { input: '"()"', expected: 'true', isHidden: false },
    { input: '"()[]{}"', expected: 'true', isHidden: false },
    { input: '"(]"', expected: 'false', isHidden: true },
    { input: '"([)]"', expected: 'false', isHidden: true },
  ],
  'maximum-subarray': [
    { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6', isHidden: false },
    { input: '[1]', expected: '1', isHidden: false },
    { input: '[5,4,-1,7,8]', expected: '23', isHidden: true },
  ],
};

const GRACE_TIMER_SECONDS = 360; // 6 minutes

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
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      console.warn(`Rate limit exceeded for user: ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please wait before trying again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { matchId, code, language, isFinal } = await req.json();
    
    // Input validation
    if (!matchId || typeof matchId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing matchId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate code length
    if (code.length > MAX_CODE_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate language if provided
    const submissionLanguage = language && typeof language === 'string' && ALLOWED_LANGUAGES.includes(language.toLowerCase()) 
      ? language.toLowerCase() 
      : 'python';

    console.log(`Grading submission for match: ${matchId}, isFinal: ${isFinal}, language: ${submissionLanguage}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get match details
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (matchError || !match) {
      console.error('Match not found:', matchError);
      return new Response(
        JSON.stringify({ error: 'Match not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is a player in this match
    if (match.player1_id !== user.id && match.player2_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'You are not a player in this match' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if match is still in progress
    if (match.status !== 'in_progress') {
      return new Response(
        JSON.stringify({ error: 'Match is not in progress' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get test cases for this problem
    const testCases = PROBLEM_TEST_CASES[match.problem_slug] || [];
    const totalTests = testCases.length;
    
    // Simple mock grading - in production this would execute the code
    // For now, we simulate test results based on code length and content
    let passedTests = 0;
    
    // Mock execution: pass tests based on code quality indicators
    const hasReturn = code.includes('return');
    const hasFunction = code.includes('def ') || code.includes('function');
    const codeLength = code.trim().length;
    
    if (hasFunction && hasReturn && codeLength > 20) {
      // Random but deterministic based on code content
      const hash = code.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
      passedTests = Math.min(totalTests, Math.floor((hash % 100) / 100 * totalTests) + 1);
    }

    const allPassed = passedTests === totalTests;
    const score = passedTests * 100 + (allPassed ? (10000 - codeLength) : 0);

    // Create submission record
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        match_id: matchId,
        user_id: user.id,
        code: code,
        language: submissionLanguage,
        tests_passed: passedTests,
        tests_total: totalTests,
        is_final: isFinal || allPassed,
        score: score,
        code_length: codeLength,
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error creating submission:', submissionError);
      return new Response(
        JSON.stringify({ error: 'Failed to save submission' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Submission created: ${passedTests}/${totalTests} tests passed, score: ${score}`);

    // If this is a correct solution and no grace timer set yet
    if (allPassed && !match.first_correct_submission_at) {
      const graceEndsAt = new Date(Date.now() + GRACE_TIMER_SECONDS * 1000).toISOString();
      
      await supabase
        .from('matches')
        .update({
          first_correct_submission_at: new Date().toISOString(),
          grace_timer_ends_at: graceEndsAt,
        })
        .eq('id', matchId);

      console.log(`Grace timer started, ends at: ${graceEndsAt}`);
    }

    // Check if match should end (both players submitted or grace timer)
    const { data: allSubmissions } = await supabase
      .from('submissions')
      .select('*')
      .eq('match_id', matchId)
      .eq('is_final', true);

    const player1FinalSubmission = allSubmissions?.find((s: { user_id: string }) => s.user_id === match.player1_id);
    const player2FinalSubmission = allSubmissions?.find((s: { user_id: string }) => s.user_id === match.player2_id);

    let matchEnded = false;
    let winnerId = null;

    // Both players have final submissions - determine winner
    if (player1FinalSubmission && player2FinalSubmission) {
      matchEnded = true;
      
      // Scoring: accuracy first, then time, then code length
      const p1 = player1FinalSubmission as { tests_passed: number; submitted_at: string; code_length: number; user_id: string };
      const p2 = player2FinalSubmission as { tests_passed: number; submitted_at: string; code_length: number; user_id: string };
      
      if (p1.tests_passed > p2.tests_passed) {
        winnerId = match.player1_id;
      } else if (p2.tests_passed > p1.tests_passed) {
        winnerId = match.player2_id;
      } else {
        // Tie on accuracy - check time
        const p1Time = new Date(p1.submitted_at).getTime();
        const p2Time = new Date(p2.submitted_at).getTime();
        
        if (p1Time < p2Time) {
          winnerId = match.player1_id;
        } else if (p2Time < p1Time) {
          winnerId = match.player2_id;
        } else {
          // Tie on time - check code length (shorter wins)
          if (p1.code_length < p2.code_length) {
            winnerId = match.player1_id;
          } else if (p2.code_length < p1.code_length) {
            winnerId = match.player2_id;
          }
          // Complete tie - no winner
        }
      }

      console.log(`Match ended - both submitted. Winner: ${winnerId || 'draw'}`);
    }

    if (matchEnded) {
      // Update match status
      await supabase
        .from('matches')
        .update({
          status: 'completed',
          end_time: new Date().toISOString(),
          winner_id: winnerId,
        })
        .eq('id', matchId);

      // Use finalize_match RPC to handle ELO and stats updates atomically
      // Note: finalize_match requires auth context, so we update stats directly here
      if (winnerId) {
        const loserId = winnerId === match.player1_id ? match.player2_id : match.player1_id;
        
        // Get profiles for ELO calculation
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

          // Update winner's ELO and wins (FIXED: was using winnerProfile.elo instead of winnerProfile.wins)
          await supabase
            .from('profiles')
            .update({ elo: winnerNewElo, wins: winnerProfile.wins + 1 })
            .eq('id', winnerId);
          
          // Update loser's ELO and losses
          await supabase
            .from('profiles')
            .update({ elo: loserNewElo, losses: loserProfile.losses + 1 })
            .eq('id', loserId);
          
          console.log(`ELO updated - Winner: ${winnerNewElo}, Loser: ${loserNewElo}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        submission: {
          id: submission.id,
          tests_passed: passedTests,
          tests_total: totalTests,
          all_passed: allPassed,
          score: score,
        },
        matchEnded,
        winnerId,
        graceTimerActive: allPassed && !match.first_correct_submission_at,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Grade submission error:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your submission' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
