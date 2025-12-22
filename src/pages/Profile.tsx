import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/common/TierBadge';
import { StatCard } from '@/components/common/StatCard';
import { 
  Trophy, 
  Target,
  Flame,
  Clock,
  Calendar,
  Settings,
  LogOut,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Code2,
  Award
} from 'lucide-react';
import { mockUser, mockRecentMatches } from '@/lib/mock-data';
import { TIER_THRESHOLDS } from '@/types';

export default function Profile() {
  const winRate = Math.round((mockUser.wins / (mockUser.wins + mockUser.losses)) * 100);
  const memberSince = mockUser.createdAt.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

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
                    {mockUser.username[0].toUpperCase()}
                  </div>
                  {mockUser.streak > 0 && (
                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-warning text-warning-foreground text-sm font-bold">
                      <Flame className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{mockUser.username}</h1>
                    <TierBadge tier={mockUser.tier} size="lg" />
                  </div>
                  <p className="text-muted-foreground mb-4">{mockUser.email}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Member since {memberSince}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      Top 1.2% globally
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
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
                      <p className="text-4xl font-bold font-mono">{mockUser.elo}</p>
                      <p className="text-sm text-muted-foreground">Current ELO Rating</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-8">
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
          />
          <StatCard
            title="Problems Solved"
            value={mockUser.problemsSolved}
            subtitle="lifetime total"
            icon={Target}
          />
          <StatCard
            title="Best Ranking"
            value="#42"
            subtitle="peak position"
            icon={Award}
          />
          <StatCard
            title="Avg. Solve Time"
            value="14:23"
            subtitle="minutes per problem"
            icon={Clock}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Match History */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Recent Match History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...mockRecentMatches, ...mockRecentMatches].slice(0, 6).map((match, index) => {
                const isWinner = match.winner?.id === mockUser.id;
                const opponent = match.player1.id === mockUser.id ? match.player2 : match.player1;
                
                return (
                  <div 
                    key={`${match.id}-${index}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isWinner ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {isWinner ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">vs {opponent.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{match.problem.title}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-sm font-semibold ${isWinner ? 'text-success' : 'text-destructive'}`}>
                        {isWinner ? '+18' : '-12'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(match.endedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Performance by Difficulty */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance by Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { difficulty: 'Easy', solved: 84, total: 100, successRate: 92 },
                { difficulty: 'Medium', solved: 52, total: 120, successRate: 78 },
                { difficulty: 'Hard', solved: 20, total: 80, successRate: 61 },
              ].map((item) => (
                <div key={item.difficulty} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          item.difficulty === 'Easy' ? 'success' : 
                          item.difficulty === 'Medium' ? 'warning' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {item.difficulty}
                      </Badge>
                      <span className="text-muted-foreground">{item.solved}/{item.total} solved</span>
                    </div>
                    <span className="font-medium">{item.successRate}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.difficulty === 'Easy' ? 'bg-success' :
                        item.difficulty === 'Medium' ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${(item.solved / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border mt-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  Top Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Arrays', 'Dynamic Programming', 'Trees', 'Graphs', 'Hash Tables'].map((cat) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card variant="glass" className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Flame, title: 'Hot Streak', desc: '10 wins in a row', unlocked: true },
                { icon: Trophy, title: 'Expert', desc: 'Reach Expert tier', unlocked: true },
                { icon: Target, title: 'Century', desc: 'Solve 100 problems', unlocked: true },
                { icon: Clock, title: 'Speed Demon', desc: 'Solve Hard in < 10 min', unlocked: false },
              ].map((achievement) => (
                <div 
                  key={achievement.title}
                  className={`p-4 rounded-xl border ${
                    achievement.unlocked 
                      ? 'bg-primary/5 border-primary/30' 
                      : 'bg-secondary/30 border-border opacity-50'
                  }`}
                >
                  <achievement.icon className={`h-8 w-8 mb-3 ${
                    achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className="font-semibold">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
