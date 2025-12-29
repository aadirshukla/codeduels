-- Drop the existing permissive update policy
DROP POLICY IF EXISTS "System can update matches" ON public.matches;

-- Create a SECURITY DEFINER function for match start (server-side only)
CREATE OR REPLACE FUNCTION public.start_match(match_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.matches
  SET status = 'in_progress', start_time = now()
  WHERE id = match_id
    AND status = 'waiting';
END;
$$;

-- Create a SECURITY DEFINER function to finalize match with winner
CREATE OR REPLACE FUNCTION public.finalize_match(
  p_match_id uuid,
  p_winner_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_match RECORD;
BEGIN
  -- Get the match
  SELECT * INTO v_match FROM public.matches WHERE id = p_match_id;
  
  -- Validate match exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Match not found';
  END IF;
  
  -- Validate match is in progress
  IF v_match.status != 'in_progress' THEN
    RAISE EXCEPTION 'Match is not in progress';
  END IF;
  
  -- Validate winner is a player in the match
  IF p_winner_id IS NOT NULL AND p_winner_id != v_match.player1_id AND p_winner_id != v_match.player2_id THEN
    RAISE EXCEPTION 'Winner must be a player in the match';
  END IF;
  
  -- Update the match
  UPDATE public.matches
  SET 
    status = 'completed',
    end_time = now(),
    winner_id = p_winner_id
  WHERE id = p_match_id
    AND status = 'in_progress';
    
  -- Update winner stats
  IF p_winner_id IS NOT NULL THEN
    UPDATE public.profiles SET wins = wins + 1 WHERE id = p_winner_id;
    
    -- Update loser stats
    IF p_winner_id = v_match.player1_id THEN
      UPDATE public.profiles SET losses = losses + 1 WHERE id = v_match.player2_id;
    ELSE
      UPDATE public.profiles SET losses = losses + 1 WHERE id = v_match.player1_id;
    END IF;
  END IF;
END;
$$;

-- Create a function to cancel a match (no winner)
CREATE OR REPLACE FUNCTION public.cancel_match(p_match_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.matches
  SET status = 'cancelled', end_time = now()
  WHERE id = p_match_id
    AND status IN ('waiting', 'in_progress');
END;
$$;