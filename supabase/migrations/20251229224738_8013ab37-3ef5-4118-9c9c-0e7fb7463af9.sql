-- Fix SECURITY DEFINER functions to add proper authorization checks
-- This ensures only players in the match can call these functions

-- Drop and recreate start_match with authorization check
CREATE OR REPLACE FUNCTION public.start_match(match_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Authorization check: caller must be a player in the match
  IF NOT EXISTS (
    SELECT 1 FROM public.matches 
    WHERE id = match_id 
    AND (player1_id = auth.uid() OR player2_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Unauthorized: You are not a player in this match';
  END IF;

  UPDATE public.matches
  SET status = 'in_progress', start_time = now()
  WHERE id = match_id
    AND status = 'waiting';
END;
$function$;

-- Drop and recreate cancel_match with authorization check
CREATE OR REPLACE FUNCTION public.cancel_match(p_match_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Authorization check: caller must be a player in the match
  IF NOT EXISTS (
    SELECT 1 FROM public.matches 
    WHERE id = p_match_id 
    AND (player1_id = auth.uid() OR player2_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Unauthorized: You are not a player in this match';
  END IF;

  UPDATE public.matches
  SET status = 'cancelled', end_time = now()
  WHERE id = p_match_id
    AND status IN ('waiting', 'in_progress');
END;
$function$;

-- Drop and recreate finalize_match with authorization check for caller
CREATE OR REPLACE FUNCTION public.finalize_match(p_match_id uuid, p_winner_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_match RECORD;
BEGIN
  -- Get the match
  SELECT * INTO v_match FROM public.matches WHERE id = p_match_id;
  
  -- Validate match exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Match not found';
  END IF;
  
  -- Authorization check: caller must be a player in the match
  IF auth.uid() != v_match.player1_id AND auth.uid() != v_match.player2_id THEN
    RAISE EXCEPTION 'Unauthorized: You are not a player in this match';
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
$function$;