'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PokeButton } from '@/components/poke/PokeButton';
import { useAuthStore, useFriendsStore } from '@/lib/store';
import { friendsApi } from '@/lib/api';
import { UserPlus } from 'lucide-react';
import type { GroupMember } from '@/lib/types';
import Link from 'next/link';

interface MemberListProps {
  members: GroupMember[];
  groupId?: string;
}

export function MemberList({ members, groupId }: MemberListProps) {
  const { user } = useAuthStore();
  const { friendIds } = useFriendsStore();
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  return (
    <Card padding={false}>
      <div className="border-b border-zinc-800 px-6 py-4">
        <h3 className="text-sm font-medium text-zinc-300">
          Members ({members.length})
        </h3>
      </div>
      <div className="divide-y divide-zinc-800/50">
        {members.map((member) => (
          <div key={member.user_id} className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                {member.display_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Link href={`/user/${member.user_id}`} className="text-sm font-medium text-zinc-200 hover:text-emerald-400 transition-colors">{member.display_name}</Link>
                  {friendIds.includes(member.user_id) && (
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">Friend</span>
                  )}
                  {!friendIds.includes(member.user_id) && member.user_id !== user?.id && (
                    sentRequests.has(member.user_id) ? (
                      <span className="text-[9px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full">Sent</span>
                    ) : (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await friendsApi.sendRequest(member.user_id);
                            setSentRequests(prev => new Set(prev).add(member.user_id));
                          } catch {}
                        }}
                        className="text-[9px] text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded-full transition-colors flex items-center gap-0.5"
                      >
                        <UserPlus className="h-2.5 w-2.5" /> Add
                      </button>
                    )
                  )}
                </div>
                {member.role && <p className="text-xs text-zinc-500 capitalize">{member.role}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {member.role === 'admin' && <Badge>admin</Badge>}
              {user && member.user_id !== user.id && (
                <PokeButton
                  toUserId={member.user_id}
                  toName={member.display_name}
                  groupId={groupId}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
