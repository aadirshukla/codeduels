import { User, Problem, Match, LeaderboardEntry, Tier } from '@/types';

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

export const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    starterCode: {
      python: 'def twoSum(nums: List[int], target: int) -> List[int]:\n    pass',
    },
    testCases: [],
    tags: ['Array', 'Hash Table'],
    solveCount: 15420,
    successRate: 78.5,
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'easy',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
    ],
    constraints: ['1 <= s.length <= 10^4'],
    starterCode: {
      python: 'def isValid(s: str) -> bool:\n    pass',
    },
    testCases: [],
    tags: ['String', 'Stack'],
    solveCount: 12350,
    successRate: 72.3,
  },
  {
    id: '3',
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'medium',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
      },
    ],
    constraints: ['1 <= intervals.length <= 10^4'],
    starterCode: {
      python: 'def merge(intervals: List[List[int]]) -> List[List[int]]:\n    pass',
    },
    testCases: [],
    tags: ['Array', 'Sorting'],
    solveCount: 8920,
    successRate: 65.2,
  },
  {
    id: '4',
    title: 'LRU Cache',
    slug: 'lru-cache',
    difficulty: 'medium',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
      },
    ],
    constraints: ['1 <= capacity <= 3000'],
    starterCode: {
      python: 'class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass',
    },
    testCases: [],
    tags: ['Hash Table', 'Linked List', 'Design'],
    solveCount: 6540,
    successRate: 58.7,
  },
  {
    id: '5',
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'hard',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
      },
    ],
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000'],
    starterCode: {
      python: 'def findMedianSortedArrays(nums1: List[int], nums2: List[int]) -> float:\n    pass',
    },
    testCases: [],
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    solveCount: 3210,
    successRate: 42.1,
  },
  {
    id: '6',
    title: 'Regular Expression Matching',
    slug: 'regular-expression-matching',
    difficulty: 'hard',
    description: 'Given an input string s and a pattern p, implement regular expression matching with support for \'.\' and \'*\'.',
    examples: [
      {
        input: 's = "aa", p = "a*"',
        output: 'true',
      },
    ],
    constraints: ['1 <= s.length <= 20', '1 <= p.length <= 20'],
    starterCode: {
      python: 'def isMatch(s: str, p: str) -> bool:\n    pass',
    },
    testCases: [],
    tags: ['String', 'Dynamic Programming', 'Recursion'],
    solveCount: 2150,
    successRate: 35.8,
  },
];

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
