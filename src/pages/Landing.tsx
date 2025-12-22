import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Zap, 
  Swords, 
  Trophy, 
  Code2, 
  Shield, 
  Timer,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Play
} from 'lucide-react';

const features = [
  {
    icon: Swords,
    title: 'Real-Time 1v1 Battles',
    description: 'Face opponents head-to-head with synchronized starts, identical problems, and live progress tracking.',
  },
  {
    icon: Shield,
    title: 'Sandboxed Execution',
    description: 'Your code runs in isolated containers with strict CPU, memory, and runtime limits for fair competition.',
  },
  {
    icon: Trophy,
    title: 'ELO Ranking System',
    description: 'Climb through five competitive tiers from Beginner to Final Boss based on your performance.',
  },
  {
    icon: Timer,
    title: 'Time-Pressured Challenges',
    description: 'Strict time limits simulate real interview conditions, testing both speed and accuracy.',
  },
  {
    icon: TrendingUp,
    title: 'Detailed Analytics',
    description: 'Track your progress with comprehensive stats on accuracy, speed, and code efficiency.',
  },
  {
    icon: Code2,
    title: 'Interview-Ready Problems',
    description: 'Curated problem pool designed to match actual technical interview questions.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Coders' },
  { value: '500+', label: 'Problems' },
  { value: '1M+', label: 'Matches Played' },
  { value: '99.9%', label: 'Uptime' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl" />
        
        {/* Navbar */}
        <nav className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <span className="gradient-text">CodeDuel</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="sm">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="glass" className="mb-6 animate-fade-in">
              <Zap className="h-3 w-3 mr-1" />
              Now in Public Beta
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Compete. Code.
              <span className="block gradient-text">Conquer Interviews.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Real-time 1v1 coding battles that simulate technical interviews. 
              Climb the ranks, master algorithms, and prove you're interview-ready.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">
                  Start Competing
                  <Swords className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/practice">
                <Button variant="outline" size="xl">
                  <Play className="h-5 w-5" />
                  Try a Problem
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="glass" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Level Up
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete platform designed to prepare you for the most demanding technical interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="interactive"
                className="p-6 animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="glass" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three Steps to Victory
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Queue Up', description: 'Join the ranked matchmaking queue and get matched with a player of similar skill.' },
              { step: '02', title: 'Solve & Submit', description: 'Both players receive the same problem. Code, test, and submit before time runs out.' },
              { step: '03', title: 'Climb the Ranks', description: 'Winners gain ELO and climb through tiers. Track your progress and dominate the leaderboard.' },
            ].map((item, index) => (
              <div key={item.step} className="text-center animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card variant="glow" className="max-w-4xl mx-auto p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
            <div className="relative z-10">
              <Users className="h-12 w-12 mx-auto text-primary mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Prove Yourself?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of developers sharpening their skills through competitive coding. 
                Your next interview success starts here.
              </p>
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Free to start
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  No credit card required
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              <span>© 2024 CodeDuel. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
