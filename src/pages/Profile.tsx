import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TierBadge } from '@/components/common/TierBadge';
import { StatCard } from '@/components/common/StatCard';
import { 
  Trophy, 
  Target,
  Clock,
  Calendar,
  Settings,
  LogOut,
  CheckCircle2,
  XCircle,
  Swords
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserStats';
import { TIER_THRESHOLDS } from '@/types';

export default function Profile() {
  const { user, signOut, loading: authLoading } = useAuth();
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

  const memberSince = stats.createdAt.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const totalMatches = stats.wins + stats.losses;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card variant="glow" className="mb-8 overflow-hidden">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />
            
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-24 w-24 rounded-2xl bg-secondary flex items-center justify-center text-4xl font-bold ring-4 ring-primary/30">
                    {stats.username[0].toUpperCase()}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{stats.username}</h1>
                    <TierBadge tier={stats.tier} size="lg" />
                  </div>
                  <p className="text-muted-foreground mb-4">{stats.email}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Member since {memberSince}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      {totalMatches} matches played
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-destructive hover:text-destructive"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* ELO Display */}
              <div className="mt-8 p-6 rounded-xl bg-secondary/50 border border-border/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Trophy className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-4xl font-bold font-mono">{stats.elo}</p>
                      <p className="text-sm text-muted-foreground">Current ELO Rating</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-8">
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
            icon={Target}
          />
          <StatCard
            title="Win Rate"
            value={`${stats.winRate}%`}
            subtitle="overall performance"
            icon={Clock}
          />
        </div>

        {/* Match History */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Match History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMatches.length > 0 ? (
              recentMatches.map((match) => (
                <div 
                  key={match.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    match.isWinner ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                  }`}>
                    {match.isWinner ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">vs {match.opponent.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{match.problem_slug}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono text-sm font-semibold ${match.isWinner ? 'text-success' : 'text-destructive'}`}>
                      {match.isWinner ? 'Victory' : 'Defeat'}
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
      </div>
    </Layout>
  );
}
