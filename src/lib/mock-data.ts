import { User, Problem, Match, LeaderboardEntry, Tier } from '@/types';
import { problemsDatabase } from './problems-data';

export const mockUser: User = {
  id: '1',
  username: 'codemaster',
  email: 'user@example.com',
  elo: 1547,
  tier: 'expert',
  wins: 42,
  losses: 18,
  streak: 5,
  problemsSolved: 156,
  createdAt: new Date('2024-01-15'),
};

// Re-export problems from dedicated file
export const mockProblems = problemsDatabase;

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user: { ...mockUser, id: '10', username: 'algorithm_king', elo: 2847, tier: 'finalboss' as Tier, wins: 312, losses: 45 }, eloChange: 15 },
  { rank: 2, user: { ...mockUser, id: '11', username: 'code_ninja', elo: 2756, tier: 'finalboss' as Tier, wins: 287, losses: 52 }, eloChange: -8 },
  { rank: 3, user: { ...mockUser, id: '12', username: 'binary_wizard', elo: 2698, tier: 'finalboss' as Tier, wins: 265, losses: 61 }, eloChange: 12 },
  { rank: 4, user: { ...mockUser, id: '13', username: 'recursive_master', elo: 2612, tier: 'finalboss' as Tier, wins: 243, losses: 58 }, eloChange: 0 },
  { rank: 5, user: { ...mockUser, id: '14', username: 'stack_overflow', elo: 2534, tier: 'finalboss' as Tier, wins: 228, losses: 67 }, eloChange: 22 },
  { rank: 6, user: { ...mockUser, id: '15', username: 'leetcode_pro', elo: 2489, tier: 'interview' as Tier, wins: 215, losses: 72 }, eloChange: -5 },
  { rank: 7, user: { ...mockUser, id: '16', username: 'dynamic_dp', elo: 2401, tier: 'interview' as Tier, wins: 198, losses: 69 }, eloChange: 18 },
  { rank: 8, user: { ...mockUser, id: '17', username: 'graph_theory', elo: 2356, tier: 'interview' as Tier, wins: 185, losses: 74 }, eloChange: 7 },
  { rank: 9, user: { ...mockUser, id: '18', username: 'sorting_algo', elo: 2287, tier: 'interview' as Tier, wins: 172, losses: 81 }, eloChange: -12 },
  { rank: 10, user: { ...mockUser, id: '19', username: 'hash_table', elo: 2234, tier: 'interview' as Tier, wins: 165, losses: 78 }, eloChange: 9 },
];

export const mockRecentMatches: Match[] = [
  {
    id: '1',
    player1: mockUser,
    player2: { ...mockUser, id: '2', username: 'opponent1', elo: 1520 },
    problem: mockProblems[0],
    status: 'completed',
    winner: mockUser,
    startedAt: new Date(Date.now() - 3600000),
    endedAt: new Date(Date.now() - 3000000),
    timeLimit: 1800,
  },
  {
    id: '2',
    player1: mockUser,
    player2: { ...mockUser, id: '3', username: 'opponent2', elo: 1580 },
    problem: mockProblems[2],
    status: 'completed',
    winner: { ...mockUser, id: '3', username: 'opponent2', elo: 1580 },
    startedAt: new Date(Date.now() - 86400000),
    endedAt: new Date(Date.now() - 84600000),
    timeLimit: 1800,
  },
];
