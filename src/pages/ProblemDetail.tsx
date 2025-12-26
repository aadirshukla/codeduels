import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DifficultyBadge } from '@/components/common/DifficultyBadge';
import { 
  ArrowLeft, 
  Play, 
  Send, 
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Lightbulb,
  Code2,
  FileText,
  Terminal
} from 'lucide-react';
import { getProblemBySlug } from '@/lib/problems-data';
import { useState } from 'react';

export default function ProblemDetail() {
  const { slug } = useParams<{ slug: string }>();
  const problem = getProblemBySlug(slug || '');
  const [code, setCode] = useState(problem?.starterCode.python || '');
  const [activeTab, setActiveTab] = useState('description');
  const [testResults, setTestResults] = useState<null | { passed: boolean; output: string }[]>(null);

  if (!problem) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Code2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Problem Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The problem you're looking for doesn't exist.
          </p>
          <Link to="/practice">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Practice
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleRunCode = () => {
    // Mock test results for demo
    const mockResults = problem.testCases
      .filter(tc => !tc.isHidden)
      .map((tc, i) => ({
        passed: Math.random() > 0.3,
        output: tc.expectedOutput,
      }));
    setTestResults(mockResults);
  };

  const handleSubmit = () => {
    // Mock submission
    handleRunCode();
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/practice">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-mono">#{problem.id}</span>
                <h1 className="font-semibold">{problem.title}</h1>
                <DifficultyBadge difficulty={problem.difficulty} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRunCode}>
                <Play className="h-4 w-4 mr-2" />
                Run
              </Button>
              <Button size="sm" onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Submit
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
                <TabsTrigger value="solutions" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Hints
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="flex-1 p-4 overflow-y-auto">
                {/* Stats */}
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {problem.solveCount.toLocaleString()} solved
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    {problem.successRate}% success rate
                  </span>
                </div>

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

                {/* Tags */}
                <div>
                  <h3 className="font-semibold mb-3">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="solutions" className="flex-1 p-4">
                <Card className="p-6 bg-secondary/30">
                  <Lightbulb className="h-8 w-8 text-warning mb-4" />
                  <h3 className="font-semibold mb-2">Hints Available After Submission</h3>
                  <p className="text-sm text-muted-foreground">
                    Try solving the problem first. Hints and solutions will be available after you submit your first attempt.
                  </p>
                </Card>
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
              <Button variant="ghost" size="sm" onClick={() => setCode(problem.starterCode.python || '')}>
                Reset Code
              </Button>
            </div>

            {/* Code Editor Area */}
            <div className="flex-1 overflow-hidden">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-[#1e1e2e] text-foreground font-mono text-sm p-4 resize-none focus:outline-none"
                spellCheck={false}
                placeholder="Write your solution here..."
              />
            </div>

            {/* Test Results Panel */}
            <div className="border-t border-border">
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Test Results</span>
              </div>
              <div className="p-4 bg-secondary/20 max-h-48 overflow-y-auto">
                {testResults === null ? (
                  <p className="text-sm text-muted-foreground">
                    Click "Run" to test your code against the sample test cases.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {testResults.map((result, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className={result.passed ? 'text-success' : 'text-destructive'}>
                          Test Case {i + 1}: {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-border/50 text-sm text-muted-foreground">
                      {testResults.filter(r => r.passed).length}/{testResults.length} test cases passed
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
