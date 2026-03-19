import { cn } from '@/lib/cn';

export function Spinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
  return (
    <div className={cn('animate-spin rounded-full border-2 border-emerald-500 border-t-transparent', sizes[size], className)} />
  );
}
