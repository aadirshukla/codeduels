import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/common/TierBadge';
import { 
  Trophy, 
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Flame,
  Users,
  Calendar
} from 'lucide-react';
import { mockLeaderboard, mockUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type TimeFilter = 'all' | 'season' | 'weekly' | 'daily';

export default function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

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

  const getEloChangeIcon = (change?: number) => {
    if (!change || change === 0) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    return <TrendingDown className="h-4 w-4 text-destructive" />;
  };

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
          <div className="flex items-center gap-2">
            {(['all', 'season', 'weekly', 'daily'] as const).map((filter) => (
              <Button
                key={filter}
                variant={timeFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeFilter(filter)}
              >
                {filter === 'all' ? 'All Time' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Your Rank Card */}
        <Card variant="glow" className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary font-mono">#127</div>
              <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-xl font-bold">
                {mockUser.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-lg">{mockUser.username}</p>
                <div className="flex items-center gap-2">
                  <TierBadge tier={mockUser.tier} size="sm" />
                  <span className="text-muted-foreground text-sm">You</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold font-mono">{mockUser.elo}</p>
                <p className="text-xs text-muted-foreground">ELO</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{mockUser.wins}</p>
                <p className="text-xs text-muted-foreground">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{Math.round((mockUser.wins / (mockUser.wins + mockUser.losses)) * 100)}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">10,423</p>
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
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-sm text-muted-foreground">Highest ELO</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">Season 3</p>
                <p className="text-sm text-muted-foreground">42 days left</p>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Rank</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Player</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Tier</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">ELO</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">W/L</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaderboard.map((entry, index) => (
                    <tr 
                      key={entry.user.id}
                      className={cn(
                        "border-b border-border/50 hover:bg-secondary/30 transition-colors",
                        index < 3 && "bg-primary/5"
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
                          <span className="font-medium">{entry.user.username}</span>
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
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-1">
                          {getEloChangeIcon(entry.eloChange)}
                          <span className={cn(
                            "font-mono text-sm",
                            entry.eloChange && entry.eloChange > 0 && "text-success",
                            entry.eloChange && entry.eloChange < 0 && "text-destructive",
                            (!entry.eloChange || entry.eloChange === 0) && "text-muted-foreground"
                          )}>
                            {entry.eloChange && entry.eloChange > 0 ? '+' : ''}{entry.eloChange || 0}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="default" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <span className="text-muted-foreground px-2">...</span>
          <Button variant="outline" size="sm">42</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </Layout>
  );
}
