'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { pokesApi } from '@/lib/api';
import { Hand } from 'lucide-react';

interface PokeButtonProps {
  toUserId: string;
  toName: string;
  groupId?: string;
  size?: 'sm' | 'md';
}

export function PokeButton({ toUserId, toName, groupId, size = 'sm' }: PokeButtonProps) {
  const [poked, setPoked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePoke = async () => {
    setLoading(true);
    setError('');
    try {
      await pokesApi.poke(toUserId, groupId);
      setPoked(true);
      setTimeout(() => setPoked(false), 10000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Failed to poke');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (poked) {
    return (
      <span className="text-xs text-emerald-400 flex items-center gap-1">
        <Hand className="h-3 w-3" /> Poked!
      </span>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size={size}
        onClick={handlePoke}
        loading={loading}
        className="flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
        title={`Poke ${toName}`}
      >
        <Hand className="h-3.5 w-3.5" />
        <span className="text-xs">Poke</span>
      </Button>
      {error && (
        <div className="absolute top-full left-0 mt-1 whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-[10px] text-red-400 border border-zinc-700 z-10">
          {error}
        </div>
      )}
    </div>
  );
}
