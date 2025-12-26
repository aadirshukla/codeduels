import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Tier } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTierFromElo(elo: number): Tier {
  if (elo >= 2500) return 'finalboss';
  if (elo >= 2000) return 'interview';
  if (elo >= 1500) return 'expert';
  if (elo >= 1000) return 'intermediate';
  return 'beginner';
}
