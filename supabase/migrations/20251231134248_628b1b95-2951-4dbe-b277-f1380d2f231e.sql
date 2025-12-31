-- Drop the permissive INSERT policy on matches table
-- Edge functions use service role which bypasses RLS, so no policy is needed
DROP POLICY IF EXISTS "System can create matches" ON public.matches;