'use client';

import { useState } from 'react';
import { Shield, Snowflake, Zap, ShoppingBag, Coins } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { powerupsApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import type { PowerupInventory } from '@/lib/types';

const POWERUP_META: Record<string, { icon: React.ElementType; label: string; desc: string; color: string; bg: string }> = {
  streak_freeze: {
    icon: Snowflake,
    label: 'Streak Freeze',
    desc: 'Skip a day without breaking your streak',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/20 to-blue-500/20',
  },
  double_xp: {
    icon: Zap,
    label: 'Double XP',
    desc: 'Earn 2x points on your next solve',
    color: 'text-amber-400',
    bg: 'from-amber-500/20 to-orange-500/20',
  },
  streak_shield: {
    icon: Shield,
    label: 'Streak Shield',
    desc: 'Auto-protect streak for one missed day',
    color: 'text-purple-400',
    bg: 'from-purple-500/20 to-pink-500/20',
  },
};

export function PowerupsWidget() {
  const { data: inventory, refetch } = useAsync<PowerupInventory>(
    () => powerupsApi.getInventory().then(r => r.data),
    []
  );

  const { data: costsData } = useAsync(
    () => powerupsApi.getCosts().then(r => r.data.costs as Record<string, number>),
    []
  );

  const [buying, setBuying] = useState<string | null>(null);
  const [freezing, setFreezing] = useState(false);
  const [message, setMessage] = useState('');

  const handlePurchase = async (type: string) => {
    setBuying(type);
    setMessage('');
    try {
      await powerupsApi.purchase(type);
      setMessage(`${POWERUP_META[type].label} purchased!`);
      refetch();
      setTimeout(() => setMessage(''), 2000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setMessage(e.response?.data?.error || 'Purchase failed');
    } finally {
      setBuying(null);
    }
  };

  const handleFreeze = async () => {
    setFreezing(true);
    setMessage('');
    try {
      await powerupsApi.useFreeze();
      setMessage('Streak protected for today!');
      refetch();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setMessage(e.response?.data?.error || 'Failed to use freeze');
    } finally {
      setFreezing(false);
    }
  };

  if (!inventory) return null;

  const costs = costsData || { streak_freeze: 100, double_xp: 150, streak_shield: 200 };
  const freezeQty = inventory.powerups.find(p => p.powerup_type === 'streak_freeze')?.quantity ?? 0;

  return (
    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-5">
      {/* Header with points */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-emerald-400" />
          Power-ups
        </h3>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1">
          <Coins className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-sm font-bold text-amber-400">{inventory.points}</span>
          <span className="text-[10px] text-amber-400/60">pts</span>
        </div>
      </div>

      {/* Inventory */}
      <div className="space-y-2 mb-4">
        {Object.entries(POWERUP_META).map(([type, meta]) => {
          const qty = inventory.powerups.find(p => p.powerup_type === type)?.quantity ?? 0;
          const Icon = meta.icon;
          return (
            <div key={type} className="flex items-center justify-between rounded-xl bg-zinc-800/30 px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br', meta.bg)}>
                  <Icon className={cn('h-4 w-4', meta.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{meta.label}</p>
                  <p className="text-[10px] text-zinc-500">{meta.desc}</p>
                </div>
              </div>
              <span className={cn(
                'text-lg font-bold tabular-nums',
                qty > 0 ? meta.color : 'text-zinc-600'
              )}>
                {qty}
              </span>
            </div>
          );
        })}
      </div>

      {/* Use Freeze button */}
      {freezeQty > 0 && (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleFreeze}
          loading={freezing}
          className="w-full mb-3 gap-2"
        >
          <Snowflake className="h-3.5 w-3.5" />
          Use Streak Freeze
        </Button>
      )}

      {/* Shop */}
      <div className="border-t border-zinc-800/50 pt-3 mt-1">
        <p className="text-xs text-zinc-500 mb-2 font-medium">Shop</p>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(POWERUP_META).map(([type, meta]) => {
            const cost = costs[type] || 0;
            const canAfford = inventory.points >= cost;
            return (
              <button
                key={type}
                disabled={!canAfford || buying === type}
                onClick={() => handlePurchase(type)}
                className={cn(
                  'rounded-xl border p-2.5 text-center transition-all duration-200',
                  canAfford
                    ? 'border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/60 cursor-pointer'
                    : 'border-zinc-800/30 bg-zinc-900/20 opacity-50 cursor-not-allowed'
                )}
              >
                <meta.icon className={cn('h-5 w-5 mx-auto mb-1', meta.color)} />
                <p className="text-[10px] text-zinc-400 font-medium truncate">{meta.label}</p>
                <p className="text-xs font-bold text-amber-400 flex items-center justify-center gap-0.5 mt-0.5">
                  <Coins className="h-2.5 w-2.5" /> {cost}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message */}
      {message && (
        <p className={cn(
          'text-xs text-center mt-3 animate-fade-in',
          message.includes('failed') || message.includes('Not') ? 'text-red-400' : 'text-emerald-400'
        )}>
          {message}
        </p>
      )}
    </div>
  );
}
