-- Create enum for match status
CREATE TYPE public.match_status AS ENUM ('waiting', 'in_progress', 'completed', 'cancelled');

-- Create profiles table for user data and ELO
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  elo INTEGER NOT NULL DEFAULT 1000,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create match queue table
CREATE TABLE public.match_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  elo INTEGER NOT NULL,
  queued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  player2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_slug TEXT NOT NULL,
  status match_status NOT NULL DEFAULT 'waiting',
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  time_limit_seconds INTEGER NOT NULL DEFAULT 1800,
  winner_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'python',
  tests_passed INTEGER NOT NULL DEFAULT 0,
  tests_total INTEGER NOT NULL DEFAULT 0,
  execution_time_ms INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_final BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Match queue policies
CREATE POLICY "Users can view the queue" 
ON public.match_queue FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can add themselves to queue" 
ON public.match_queue FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove themselves from queue" 
ON public.match_queue FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Players can view their matches" 
ON public.matches FOR SELECT TO authenticated 
USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "System can create matches" 
ON public.matches FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "System can update matches" 
ON public.matches FOR UPDATE TO authenticated 
USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- Submissions policies
CREATE POLICY "Players can view match submissions" 
ON public.submissions FOR SELECT TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.matches 
  WHERE matches.id = submissions.match_id 
  AND (matches.player1_id = auth.uid() OR matches.player2_id = auth.uid())
));

CREATE POLICY "Players can create submissions" 
ON public.submissions FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data ->> 'username');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for match queue and matches
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;