import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/common/TierBadge';
import { 
  Swords, 
  Users, 
  Clock, 
  Trophy,
  Loader2,
  X,
  Zap,
  Shield
} from 'lucide-react';
import { mockUser, mockLeaderboard } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type QueueStatus = 'idle' | 'searching' | 'found' | 'starting';

export default function Compete() {
  const [queueStatus, setQueueStatus] = useState<QueueStatus>('idle');
  const [searchTime, setSearchTime] = useState(0);
  const [opponent, setOpponent] = useState<typeof mockLeaderboard[0]['user'] | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (queueStatus === 'searching') {
      interval = setInterval(() => {
        setSearchTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [queueStatus]);

  useEffect(() => {
    if (queueStatus === 'searching' && searchTime >= 5) {
      // Simulate finding an opponent
      setOpponent(mockLeaderboard[5].user);
      setQueueStatus('found');
      setTimeout(() => setQueueStatus('starting'), 3000);
    }
  }, [searchTime, queueStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQueue = () => {
    setQueueStatus('searching');
    setSearchTime(0);
  };

  const handleCancel = () => {
    setQueueStatus('idle');
    setSearchTime(0);
    setOpponent(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="glass" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Ranked Match
            </Badge>
            <h1 className="text-4xl font-bold mb-3">Find Your Opponent</h1>
            <p className="text-muted-foreground">
              Queue into ranked matchmaking and battle against players of similar skill.
            </p>
          </div>

          {/* Queue Status Card */}
          <Card variant="glow" className="mb-8 overflow-hidden">
            <CardContent className="p-8">
              {queueStatus === 'idle' && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-8 mb-8">
                    {/* Your Profile */}
                    <div className="text-center">
                      <div className="h-20 w-20 mx-auto rounded-full bg-secondary flex items-center justify-center text-2xl font-bold mb-3">
                        {mockUser.username[0].toUpperCase()}
                      </div>
                      <p className="font-semibold">{mockUser.username}</p>
                      <TierBadge tier={mockUser.tier} size="sm" />
                      <p className="text-sm text-muted-foreground mt-1 font-mono">{mockUser.elo} ELO</p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <Swords className="h-10 w-10 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">VS</span>
                    </div>

                    {/* Unknown Opponent */}
                    <div className="text-center">
                      <div className="h-20 w-20 mx-auto rounded-full bg-secondary/50 border-2 border-dashed border-border flex items-center justify-center mb-3">
                        <span className="text-3xl text-muted-foreground">?</span>
                      </div>
                      <p className="font-semibold text-muted-foreground">Opponent</p>
                      <Badge variant="outline" className="text-xs">Searching...</Badge>
                    </div>
                  </div>

                  <Button variant="hero" size="xl" onClick={handleQueue}>
                    <Swords className="h-5 w-5" />
                    Enter Queue
                  </Button>
                </div>
              )}

              {queueStatus === 'searching' && (
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="h-32 w-32 mx-auto rounded-full border-4 border-primary/30 flex items-center justify-center animate-pulse">
                      <div className="h-24 w-24 rounded-full border-4 border-primary/50 flex items-center justify-center animate-pulse" style={{ animationDelay: '0.2s' }}>
                        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Searching for opponent...</h3>
                  <p className="text-3xl font-mono font-bold text-primary mb-2">{formatTime(searchTime)}</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Finding a player around {mockUser.elo} ±150 ELO
                  </p>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                    Cancel Queue
                  </Button>
                </div>
              )}

              {(queueStatus === 'found' || queueStatus === 'starting') && opponent && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-8 mb-8">
                    {/* Your Profile */}
                    <div className="text-center animate-slide-in-right" style={{ animationDelay: '0s' }}>
                      <div className="h-20 w-20 mx-auto rounded-full bg-secondary flex items-center justify-center text-2xl font-bold mb-3 ring-4 ring-success/50">
                        {mockUser.username[0].toUpperCase()}
                      </div>
                      <p className="font-semibold">{mockUser.username}</p>
                      <TierBadge tier={mockUser.tier} size="sm" />
                      <p className="text-sm text-muted-foreground mt-1 font-mono">{mockUser.elo}</p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <Swords className="h-10 w-10 text-primary animate-glow" />
                      <span className="text-sm font-bold text-primary">MATCH FOUND</span>
                    </div>

                    {/* Opponent */}
                    <div className="text-center animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                      <div className="h-20 w-20 mx-auto rounded-full bg-secondary flex items-center justify-center text-2xl font-bold mb-3 ring-4 ring-destructive/50">
                        {opponent.username[0].toUpperCase()}
                      </div>
                      <p className="font-semibold">{opponent.username}</p>
                      <TierBadge tier={opponent.tier} size="sm" />
                      <p className="text-sm text-muted-foreground mt-1 font-mono">{opponent.elo}</p>
                    </div>
                  </div>

                  {queueStatus === 'starting' && (
                    <div className="animate-fade-in">
                      <div className="flex items-center justify-center gap-2 text-lg font-semibold text-primary">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Starting match...
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-muted-foreground">Players Online</p>
                </div>
              </div>
            </Card>
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">~15s</p>
                  <p className="text-sm text-muted-foreground">Avg. Queue Time</p>
                </div>
              </div>
            </Card>
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Swords className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">342</p>
                  <p className="text-sm text-muted-foreground">Active Matches</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Match Rules */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Match Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">30 Minute Time Limit</p>
                    <p className="text-muted-foreground">Complete the problem before time runs out.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Swords className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Same Problem</p>
                    <p className="text-muted-foreground">Both players solve the identical challenge.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Trophy className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Accuracy First</p>
                    <p className="text-muted-foreground">Test cases passed, then speed, then efficiency.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">ELO Changes</p>
                    <p className="text-muted-foreground">Win or lose rating based on opponent skill.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
