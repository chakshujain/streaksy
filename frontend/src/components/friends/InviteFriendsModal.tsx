'use client';

import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { UserPlus, X, Check, Users, Flame, Loader2 } from 'lucide-react';
import { useFriends, Friend } from '@/hooks/useFriends';

interface InviteFriendsModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (userIds: string[]) => Promise<void>;
  title?: string;
  excludeUserIds?: string[];
}

export function InviteFriendsModal({
  open,
  onClose,
  onInvite,
  title = 'Invite Friends',
  excludeUserIds = [],
}: InviteFriendsModalProps) {
  const { friends, loading: friendsLoading } = useFriends();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableFriends = useMemo(() => {
    const excludeSet = new Set(excludeUserIds);
    return friends.filter((f) => !excludeSet.has(f.user_id));
  }, [friends, excludeUserIds]);

  function toggleFriend(userId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }

  async function handleInvite() {
    if (selected.size === 0) return;
    setSending(true);
    try {
      await onInvite(Array.from(selected));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelected(new Set());
        onClose();
      }, 1500);
    } finally {
      setSending(false);
    }
  }

  function handleClose() {
    if (sending) return;
    setSelected(new Set());
    setSuccess(false);
    onClose();
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-2xl mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <UserPlus className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Success state */}
          {success && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Check className="h-7 w-7 text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-emerald-400">Invites sent successfully!</p>
            </div>
          )}

          {/* Loading state */}
          {!success && friendsLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!success && !friendsLoading && availableFriends.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700">
                <Users className="h-7 w-7 text-zinc-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">No friends to invite</p>
                <p className="text-xs text-zinc-500 mt-1">Add friends first to invite them here.</p>
              </div>
              <Link
                href="/friends"
                onClick={handleClose}
                className="mt-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Find Friends &rarr;
              </Link>
            </div>
          )}

          {/* Friends list */}
          {!success && !friendsLoading && availableFriends.length > 0 && (
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1 -mr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
              {availableFriends.map((friend: Friend) => {
                const isSelected = selected.has(friend.user_id);
                return (
                  <button
                    key={friend.user_id}
                    onClick={() => toggleFriend(friend.user_id)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                        : 'hover:bg-zinc-800/60 border border-transparent'
                    }`}
                  >
                    {/* Avatar */}
                    {friend.avatar_url ? (
                      <img
                        src={friend.avatar_url}
                        alt={friend.display_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-sm font-bold text-zinc-300">
                        {getInitials(friend.display_name)}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-white">{friend.display_name}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Flame className="h-3 w-3 text-orange-400" />
                        <span>{friend.current_streak} day streak</span>
                        <span>&middot;</span>
                        <span>{friend.total_points.toLocaleString()} pts</span>
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-zinc-600 bg-zinc-800'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!success && !friendsLoading && availableFriends.length > 0 && (
          <div className="flex items-center justify-between border-t border-zinc-800 p-5">
            <button
              onClick={handleClose}
              disabled={sending}
              className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={selected.size === 0 || sending}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Send Invites{selected.size > 0 && ` (${selected.size})`}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
