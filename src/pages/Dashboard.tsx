import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/common/StatCard';
import { TierBadge } from '@/components/common/TierBadge';
import { 
  Swords, 
  Trophy, 
  Target, 
  Flame, 
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Code2,
  Calendar
} from 'lucide-react';
import { mockUser, mockRecentMatches, mockProblems } from '@/lib/mock-data';
import { TIER_THRESHOLDS, TIER_NAMES } from '@/types';

export default function Dashboard() {
  const eloProgress = ((mockUser.elo - TIER_THRESHOLDS[mockUser.tier].min) / 
    (TIER_THRESHOLDS[mockUser.tier].max - TIER_THRESHOLDS[mockUser.tier].min)) * 100;
  
  const winRate = Math.round((mockUser.wins / (mockUser.wins + mockUser.losses)) * 100);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Welcome back, <span className="gradient-text">{mockUser.username}</span>
            </h1>
            <p className="text-muted-foreground">
              Ready to compete? Your next victory awaits.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/practice">
              <Button variant="outline">
                <Code2 className="h-4 w-4" />
                Practice
              </Button>
            </Link>
            <Link to="/compete">
              <Button variant="hero">
                <Swords className="h-4 w-4" />
                Find Match
              </Button>
            </Link>
          </div>
        </div>

        {/* ELO & Tier Progress */}
        <Card variant="glow" className="mb-8 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold font-mono">{mockUser.elo}</span>
                <TierBadge tier={mockUser.tier} size="lg" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress to next tier</span>
                  <span className="font-medium">
                    {TIER_THRESHOLDS[mockUser.tier].max === Infinity 
                      ? 'Max Tier' 
                      : `${TIER_THRESHOLDS[mockUser.tier].max - mockUser.elo} ELO to go`}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(eloProgress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{mockUser.wins}</p>
                <p className="text-xs text-muted-foreground">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{mockUser.losses}</p>
                <p className="text-xs text-muted-foreground">Losses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{winRate}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Current Streak"
            value={mockUser.streak}
            subtitle="consecutive wins"
            icon={Flame}
            trend={{ value: 20, isPositive: true }}
          />
          <StatCard
            title="Problems Solved"
            value={mockUser.problemsSolved}
            subtitle="lifetime total"
            icon={Target}
          />
          <StatCard
            title="Avg. Solve Time"
            value="12:34"
            subtitle="minutes per problem"
            icon={Clock}
          />
          <StatCard
            title="Weekly Rank"
            value="#127"
            subtitle="of 10,423 players"
            icon={TrendingUp}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Matches */}
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" />
                Recent Matches
              </CardTitle>
              <Link to="/history">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRecentMatches.map((match) => {
                const isWinner = match.winner?.id === mockUser.id;
                const opponent = match.player1.id === mockUser.id ? match.player2 : match.player1;
                
                return (
                  <div 
                    key={match.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isWinner ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {isWinner ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">vs {opponent.username}</p>
                      <p className="text-sm text-muted-foreground truncate">{match.problem.title}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-semibold ${isWinner ? 'text-success' : 'text-destructive'}`}>
                        {isWinner ? '+18' : '-12'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(match.endedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {mockRecentMatches.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Swords className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No matches yet. Start competing!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Problems */}
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Recommended For You
              </CardTitle>
              <Link to="/practice">
                <Button variant="ghost" size="sm">
                  Browse All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockProblems.slice(0, 4).map((problem) => (
                <Link
                  key={problem.id}
                  to={`/practice/${problem.slug}`}
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{problem.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={problem.difficulty === 'easy' ? 'success' : problem.difficulty === 'medium' ? 'warning' : 'destructive'}
                        className="text-xs"
                      >
                        {problem.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {problem.successRate}% success
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Activity Calendar Placeholder */}
        <Card variant="glass" className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Activity This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => {
                const intensity = Math.random();
                return (
                  <div
                    key={i}
                    className={`h-8 rounded-sm ${
                      intensity > 0.7 
                        ? 'bg-primary' 
                        : intensity > 0.4 
                        ? 'bg-primary/50' 
                        : intensity > 0.2 
                        ? 'bg-primary/20' 
                        : 'bg-secondary'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="h-3 w-3 rounded-sm bg-secondary" />
                <div className="h-3 w-3 rounded-sm bg-primary/20" />
                <div className="h-3 w-3 rounded-sm bg-primary/50" />
                <div className="h-3 w-3 rounded-sm bg-primary" />
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
