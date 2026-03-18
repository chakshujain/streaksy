import { cn } from '@/lib/cn';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
  variant?: 'default' | 'glass' | 'glow';
}

const variantStyles = {
  default: 'border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm',
  glass: 'glass',
  glow: 'border border-emerald-500/20 bg-zinc-900/50 backdrop-blur-sm glow-sm',
};

export function Card({ className, padding = true, variant = 'default', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        variantStyles[variant],
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
