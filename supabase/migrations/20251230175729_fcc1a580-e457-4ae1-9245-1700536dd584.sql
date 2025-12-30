-- Add columns to matches table for grace timer and first correct submission tracking
ALTER TABLE public.matches 
ADD COLUMN IF NOT EXISTS first_correct_submission_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS grace_timer_ends_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add columns to submissions table for scoring
ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS code_length INTEGER DEFAULT 0;

-- Create index for faster match lookups
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_submissions_match_id ON public.submissions(match_id);

-- Add UPDATE policy for matches so players can update match state
CREATE POLICY "Players can update their match status"
ON public.matches
FOR UPDATE
USING (auth.uid() = player1_id OR auth.uid() = player2_id)
WITH CHECK (auth.uid() = player1_id OR auth.uid() = player2_id);