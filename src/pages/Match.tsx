import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DifficultyBadge } from '@/components/common/DifficultyBadge';
import { TierBadge } from '@/components/common/TierBadge';
import { useMatch } from '@/hooks/useMatch';
import { getTierFromElo } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { 
  Play, 
  Send, 
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Code2,
  FileText,
  Terminal,
  Loader2,
  Swords,
  AlertTriangle,
  Trophy,
  Timer
} from 'lucide-react';

export default function Match() {
  const { matchId } = useParams<{ matchId: string }>();
  const {
    status,
    match,
    problem,
    opponent,
    timeRemaining,
    formattedTime,
    graceTimeRemaining,
    formattedGraceTime,
    mySubmissions,
    opponentSubmissions,
    isSubmitting,
    lastTestResult,
    submitCode,
    user,
    profile,
  } = useMatch(matchId || '');

  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  // Initialize code with starter code
  useEffect(() => {
    if (problem?.starterCode?.python && !code) {
      setCode(problem.starterCode.python);
    }
  }, [problem, code]);

  const handleRunCode = async () => {
    await submitCode(code, false);
  };

  const handleSubmit = async () => {
    await submitCode(code, true);
  };

  // Loading state
  if (status === 'loading') {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">Loading match...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Not found
  if (status === 'not_found' || !match || !problem) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Swords className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Match Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This match doesn't exist or you don't have access to it.
          </p>
          <Link to="/compete">
            <Button>Back to Compete</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Waiting for match to start
  if (status === 'waiting') {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="h-32 w-32 mx-auto rounded-full border-4 border-primary/30 flex items-center justify-center animate-pulse">
                <div className="h-24 w-24 rounded-full border-4 border-primary/50 flex items-center justify-center">
                  <Swords className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Starting Match...</h2>
            <p className="text-muted-foreground">Get ready to compete!</p>
            {opponent && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                    {(profile?.username?.[0] || 'Y').toUpperCase()}
                  </div>
                  <p className="text-sm mt-1">{profile?.username || 'You'}</p>
                </div>
                <span className="text-lg font-bold text-primary">VS</span>
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                    {(opponent.username?.[0] || 'O').toUpperCase()}
                  </div>
                  <p className="text-sm mt-1">{opponent.username || 'Opponent'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // Match completed
  if (status === 'completed') {
    const isWinner = match.winner_id === user?.id;
    const isDraw = !match.winner_id;

    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className={`h-24 w-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              isWinner ? 'bg-success/20 text-success' : isDraw ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'
            }`}>
              <Trophy className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              {isWinner ? 'Victory!' : isDraw ? 'Draw' : 'Defeat'}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {isWinner 
                ? 'Congratulations! You solved the problem better than your opponent.'
                : isDraw 
                ? 'Both players performed equally well.'
                : 'Better luck next time!'}
            </p>

            {/* Match Summary */}
            <Card className="p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">Match Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Problem</span>
                  <span className="font-medium">{problem.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Your Best</span>
                  <span className="font-mono">
                    {mySubmissions[0]?.tests_passed || 0}/{mySubmissions[0]?.tests_total || 0} tests
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Opponent</span>
                  <span className="font-mono">
                    {opponentSubmissions[0]?.tests_passed || 0}/{opponentSubmissions[0]?.tests_total || 0} tests
                  </span>
                </div>
              </div>
            </Card>

            <div className="flex gap-4 justify-center">
              <Link to="/compete">
                <Button size="lg">
                  <Swords className="h-5 w-5 mr-2" />
                  Play Again
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="outline" size="lg">
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate timer urgency
  const isLowTime = timeRemaining < 300; // Less than 5 minutes
  const isCriticalTime = timeRemaining < 60; // Less than 1 minute
  const myFinalSubmission = mySubmissions.find(s => s.is_final);
  const opponentFinalSubmission = opponentSubmissions.find(s => s.is_final);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Match Header */}
      <div className="border-b border-border bg-card/50 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              <span className="font-semibold">Ranked Match</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">#{problem.id}</span>
              <span className="font-medium">{problem.title}</span>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
          </div>

          {/* Timer Section */}
          <div className="flex items-center gap-4">
            {/* Grace Timer Alert */}
            {graceTimeRemaining !== null && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Grace: {formattedGraceTime}
              </Badge>
            )}

            {/* Main Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
              isCriticalTime 
                ? 'bg-destructive/20 text-destructive animate-pulse' 
                : isLowTime 
                ? 'bg-warning/20 text-warning' 
                : 'bg-secondary text-foreground'
            }`}>
              <Clock className="h-5 w-5" />
              {formattedTime}
            </div>

            {/* Players */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center text-sm font-bold border-2 border-success/50">
                  {(profile?.username?.[0] || 'Y').toUpperCase()}
                </div>
                {myFinalSubmission && (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">vs</span>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center text-sm font-bold border-2 border-destructive/50">
                  {(opponent?.username?.[0] || 'O').toUpperCase()}
                </div>
                {opponentFinalSubmission && (
                  <CheckCircle2 className="h-4 w-4 text-warning" />
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRunCode}
              disabled={isSubmitting || !!myFinalSubmission}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Run
            </Button>
            <Button 
              size="sm" 
              onClick={handleSubmit}
              disabled={isSubmitting || !!myFinalSubmission}
              className={myFinalSubmission ? 'bg-success' : ''}
            >
              {myFinalSubmission ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submitted
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-border overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-4 mt-4 w-fit">
              <TabsTrigger value="description" className="gap-2">
                <FileText className="h-4 w-4" />
                Description
              </TabsTrigger>
              <TabsTrigger value="submissions" className="gap-2">
                <Terminal className="h-4 w-4" />
                Submissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 p-4 overflow-y-auto">
              {/* Description */}
              <div className="prose prose-invert prose-sm max-w-none mb-8">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {problem.description}
                </div>
              </div>

              {/* Examples */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold">Examples</h3>
                {problem.examples.map((example, i) => (
                  <Card key={i} className="p-4 bg-secondary/30">
                    <div className="space-y-2 font-mono text-sm">
                      <div>
                        <span className="text-muted-foreground">Input: </span>
                        <span className="text-foreground">{example.input}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Output: </span>
                        <span className="text-primary">{example.output}</span>
                      </div>
                      {example.explanation && (
                        <div className="text-muted-foreground pt-2 border-t border-border/50 font-sans">
                          <span className="font-medium">Explanation: </span>
                          {example.explanation}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Constraints */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Constraints</h3>
                <ul className="space-y-1 text-sm">
                  {problem.constraints.map((constraint, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground font-mono">
                      <span className="text-primary">•</span>
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-6">
                {/* My Submissions */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Your Submissions
                  </h3>
                  {mySubmissions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No submissions yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {mySubmissions.map((sub, i) => (
                        <Card key={sub.id} className="p-3 bg-secondary/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {sub.tests_passed === sub.tests_total ? (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              ) : (
                                <XCircle className="h-4 w-4 text-destructive" />
                              )}
                              <span className="font-mono text-sm">
                                {sub.tests_passed}/{sub.tests_total} tests
                              </span>
                              {sub.is_final && (
                                <Badge variant="secondary" className="text-xs">Final</Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(sub.submitted_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Opponent Submissions (limited info) */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Swords className="h-4 w-4" />
                    Opponent Activity
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {opponentFinalSubmission 
                      ? '✓ Opponent has submitted their final solution.'
                      : opponentSubmissions.length > 0 
                      ? `Opponent has made ${opponentSubmissions.length} attempt(s).`
                      : 'Opponent has not submitted yet.'}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Language Selector */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Python 3</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCode(problem?.starterCode?.python || '')}
              disabled={!!myFinalSubmission}
            >
              Reset Code
            </Button>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-[#1e1e2e] text-foreground font-mono text-sm p-4 resize-none focus:outline-none disabled:opacity-50"
              spellCheck={false}
              placeholder="Write your solution here..."
              disabled={!!myFinalSubmission}
            />
          </div>

          {/* Test Results Panel */}
          <div className="border-t border-border">
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Test Results</span>
            </div>
            <div className="p-4 bg-secondary/20 max-h-48 overflow-y-auto">
              {lastTestResult === null ? (
                <p className="text-sm text-muted-foreground">
                  Click "Run" to test your code against the test cases.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-lg">
                    {lastTestResult.all_passed ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <span className="text-success font-semibold">All tests passed!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-destructive" />
                        <span className="text-destructive font-semibold">
                          {lastTestResult.tests_passed}/{lastTestResult.tests_total} tests passed
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: lastTestResult.tests_total }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                          i < lastTestResult.tests_passed
                            ? 'bg-success/20 text-success'
                            : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
