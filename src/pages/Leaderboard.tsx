import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TierBadge } from '@/components/common/TierBadge';
import { 
  Trophy, 
  Medal,
  Crown,
  Flame,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { usePlatformStats } from '@/hooks/usePlatformStats';
import { getTierFromElo } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function Leaderboard() {
  const { profile } = useAuth();
  const { leaderboard, loading } = useLeaderboard(50);
  const { stats: platformStats } = usePlatformStats();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-warning" />;
      case 2:
        return <Medal className="h-5 w-5 text-muted-foreground" />;
      case 3:
        return <Medal className="h-5 w-5 text-warning/70" />;
      default:
        return null;
    }
  };

  // Find current user's rank
  const currentUserRank = profile 
    ? leaderboard.findIndex(entry => entry.user.id === profile.id) + 1 
    : null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              Global Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Top performers ranked by ELO rating
            </p>
          </div>
        </div>

        {/* Your Rank Card */}
        {profile && (
          <Card variant="glow" className="mb-8 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-primary font-mono">
                  {currentUserRank && currentUserRank <= 50 ? `#${currentUserRank}` : 'Unranked'}
                </div>
                <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-xl font-bold">
                  {(profile.username || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-lg">{profile.username || 'Anonymous'}</p>
                  <div className="flex items-center gap-2">
                    <TierBadge tier={getTierFromElo(profile.elo)} size="sm" />
                    <span className="text-muted-foreground text-sm">You</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono">{profile.elo}</p>
                  <p className="text-xs text-muted-foreground">ELO</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{profile.wins}</p>
                  <p className="text-xs text-muted-foreground">Wins</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {profile.wins + profile.losses > 0 
                      ? Math.round((profile.wins / (profile.wins + profile.losses)) * 100) 
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Row */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{platformStats.totalPlayers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Players</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{platformStats.highestElo.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Highest ELO</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{platformStats.totalMatches.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Matches Played</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Top Players</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 border-2 border-primary border-r-transparent rounded-full animate-spin" />
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No players yet. Be the first!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Rank</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Player</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Tier</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">ELO</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">W/L</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => {
                      const winRate = entry.user.wins + entry.user.losses > 0
                        ? Math.round((entry.user.wins / (entry.user.wins + entry.user.losses)) * 100)
                        : 0;
                      const isCurrentUser = profile?.id === entry.user.id;
                      
                      return (
                        <tr 
                          key={entry.user.id}
                          className={cn(
                            "border-b border-border/50 hover:bg-secondary/30 transition-colors",
                            index < 3 && "bg-primary/5",
                            isCurrentUser && "bg-primary/10"
                          )}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {getRankIcon(entry.rank)}
                              <span className={cn(
                                "font-mono font-bold",
                                index < 3 && "text-primary"
                              )}>
                                #{entry.rank}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">
                                {entry.user.username[0].toUpperCase()}
                              </div>
                              <span className="font-medium">
                                {entry.user.username}
                                {isCurrentUser && <span className="text-primary ml-2">(You)</span>}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <TierBadge tier={entry.user.tier} size="sm" showIcon={false} />
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="font-mono font-semibold">{entry.user.elo}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="text-success">{entry.user.wins}</span>
                            <span className="text-muted-foreground mx-1">/</span>
                            <span className="text-destructive">{entry.user.losses}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="font-mono">{winRate}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
