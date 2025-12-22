import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DifficultyBadge } from '@/components/common/DifficultyBadge';
import { 
  Search, 
  Filter,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Code2,
  Tag
} from 'lucide-react';
import { mockProblems } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type Difficulty = 'all' | 'easy' | 'medium' | 'hard';

export default function Practice() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = Array.from(new Set(mockProblems.flatMap(p => p.tags)));

  const filteredProblems = mockProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesDifficulty = difficulty === 'all' || problem.difficulty === difficulty;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => problem.tags.includes(tag));
    return matchesSearch && matchesDifficulty && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Practice Problems</h1>
          <p className="text-muted-foreground">
            Sharpen your skills with {mockProblems.length}+ curated interview problems.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary/50 border-border"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Difficulty:</span>
            {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
              <Button
                key={d}
                variant={difficulty === d ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDifficulty(d)}
                className={cn(
                  difficulty === d && d === 'easy' && 'bg-success hover:bg-success/90',
                  difficulty === d && d === 'medium' && 'bg-warning hover:bg-warning/90 text-warning-foreground',
                  difficulty === d && d === 'hard' && 'bg-destructive hover:bg-destructive/90'
                )}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer transition-colors"
              onClick={() => toggleTag(tag)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        {/* Problems List */}
        <div className="space-y-3">
          {filteredProblems.map((problem, index) => (
            <Link key={problem.id} to={`/practice/${problem.slug}`}>
              <Card 
                variant="interactive"
                className="p-5 animate-fade-in"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="flex items-center gap-4">
                  {/* Problem Number */}
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm font-mono font-medium">
                    {problem.id}
                  </div>

                  {/* Problem Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold truncate">{problem.title}</h3>
                      <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {problem.solveCount.toLocaleString()} solved
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {problem.successRate}% success
                      </span>
                      <div className="hidden md:flex items-center gap-1.5">
                        {problem.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Solve Status - Mock */}
                  <div className="flex items-center gap-3">
                    {Math.random() > 0.5 && (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    )}
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <Card variant="glass" className="p-12 text-center">
            <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No problems found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query.
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
