import { Link, Navigate } from 'react-router-dom';
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
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserStats';
import { TIER_THRESHOLDS } from '@/types';
import { problemsDatabase } from '@/lib/problems-data';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { stats, recentMatches, loading } = useUserStats();

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (authLoading || loading || !stats) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 border-2 border-primary border-r-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const eloProgress = ((stats.elo - TIER_THRESHOLDS[stats.tier].min) / 
    (TIER_THRESHOLDS[stats.tier].max - TIER_THRESHOLDS[stats.tier].min)) * 100;

  const totalMatches = stats.wins + stats.losses;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Welcome back, <span className="gradient-text">{stats.username}</span>
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
                <span className="text-3xl font-bold font-mono">{stats.elo}</span>
                <TierBadge tier={stats.tier} size="lg" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress to next tier</span>
                  <span className="font-medium">
                    {TIER_THRESHOLDS[stats.tier].max === Infinity 
                      ? 'Max Tier' 
                      : `${TIER_THRESHOLDS[stats.tier].max - stats.elo} ELO to go`}
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
                <p className="text-2xl font-bold text-success">{stats.wins}</p>
                <p className="text-xs text-muted-foreground">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{stats.losses}</p>
                <p className="text-xs text-muted-foreground">Losses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.winRate}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Matches"
            value={totalMatches}
            subtitle="matches played"
            icon={Swords}
          />
          <StatCard
            title="Victories"
            value={stats.wins}
            subtitle="total wins"
            icon={Trophy}
          />
          <StatCard
            title="Current ELO"
            value={stats.elo}
            subtitle={stats.tier}
            icon={TrendingUp}
          />
          <StatCard
            title="Win Rate"
            value={`${stats.winRate}%`}
            subtitle="overall performance"
            icon={Target}
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
              {recentMatches.length > 0 ? (
                recentMatches.map((match) => (
                  <div 
                    key={match.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      match.isWinner ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {match.isWinner ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">vs {match.opponent.username}</p>
                      <p className="text-sm text-muted-foreground truncate">{match.problem_slug}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-semibold ${match.isWinner ? 'text-success' : 'text-destructive'}`}>
                        {match.isWinner ? '+ELO' : '-ELO'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(match.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
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
              {problemsDatabase.slice(0, 4).map((problem) => (
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

        {/* Member Since */}
        <Card variant="glass" className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">Member since {stats.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                <p className="text-sm text-muted-foreground">
                  {totalMatches} matches played • {stats.wins} victories
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
