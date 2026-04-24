import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const diagnosisLevel = (score) => {
  if (score <= 35) return 'Critical Growth Leakage';
  if (score <= 60) return 'Under-Visible / Under-Converted';
  if (score <= 85) return 'Strong Base, Weak System';
  if (score <= 105) return 'Growth Ready';
  return 'Scalable Visibility Engine';
};
