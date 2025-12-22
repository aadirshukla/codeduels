import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  size?: 'sm' | 'md';
}

const difficultyConfig = {
  easy: {
    label: 'Easy',
    variant: 'success' as const,
    className: 'bg-success/20 text-success border-success/30',
  },
  medium: {
    label: 'Medium',
    variant: 'warning' as const,
    className: 'bg-warning/20 text-warning border-warning/30',
  },
  hard: {
    label: 'Hard',
    variant: 'destructive' as const,
    className: 'bg-destructive/20 text-destructive border-destructive/30',
  },
};

export function DifficultyBadge({ difficulty, size = 'md' }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];
  
  return (
    <Badge 
      className={cn(
        "font-medium border",
        config.className,
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-0.5'
      )}
    >
      {config.label}
    </Badge>
  );
}
