export type Tier = 'beginner' | 'intermediate' | 'expert' | 'interview' | 'finalboss';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  elo: number;
  tier: Tier;
  wins: number;
  losses: number;
  streak: number;
  problemsSolved: number;
  createdAt: Date;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  examples: Example[];
  constraints: string[];
  starterCode: Record<string, string>;
  testCases: TestCase[];
  tags: string[];
  solveCount: number;
  successRate: number;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Match {
  id: string;
  player1: User;
  player2: User;
  problem: Problem;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  winner?: User;
  startedAt?: Date;
  endedAt?: Date;
  timeLimit: number; // in seconds
}

export interface Submission {
  id: string;
  matchId?: string;
  problemId: string;
  userId: string;
  code: string;
  language: string;
  status: 'pending' | 'running' | 'accepted' | 'wrong_answer' | 'time_limit' | 'runtime_error' | 'compile_error';
  testsPassed: number;
  testsTotal: number;
  runtime?: number; // in ms
  memory?: number; // in KB
  createdAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  eloChange?: number;
}

export interface MatchResult {
  winner: User;
  loser: User;
  winnerSubmission: Submission;
  loserSubmission?: Submission;
  eloChange: number;
}

export const TIER_THRESHOLDS: Record<Tier, { min: number; max: number }> = {
  beginner: { min: 0, max: 999 },
  intermediate: { min: 1000, max: 1499 },
  expert: { min: 1500, max: 1999 },
  interview: { min: 2000, max: 2499 },
  finalboss: { min: 2500, max: Infinity },
};

export const TIER_NAMES: Record<Tier, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  expert: 'Expert',
  interview: 'Interview Ready',
  finalboss: 'Final Boss',
};
