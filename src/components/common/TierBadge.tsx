import { Badge } from '@/components/ui/badge';
import { Tier, TIER_NAMES } from '@/types';
import { cn } from '@/lib/utils';
import { Shield, Sword, Crown, Star, Flame } from 'lucide-react';

interface TierBadgeProps {
  tier: Tier;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const tierIcons: Record<Tier, typeof Shield> = {
  beginner: Shield,
  intermediate: Sword,
  expert: Crown,
  interview: Star,
  finalboss: Flame,
};

export function TierBadge({ tier, showIcon = true, size = 'md' }: TierBadgeProps) {
  const Icon = tierIcons[tier];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <Badge 
      variant={tier}
      className={cn("gap-1.5 font-medium", sizeClasses[size])}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {TIER_NAMES[tier]}
    </Badge>
  );
}
