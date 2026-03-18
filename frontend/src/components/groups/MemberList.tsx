'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { GroupMember } from '@/lib/types';

interface MemberListProps {
  members: GroupMember[];
}

export function MemberList({ members }: MemberListProps) {
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
                <p className="text-sm font-medium text-zinc-200">{member.display_name}</p>
                <p className="text-xs text-zinc-500">{member.email}</p>
              </div>
            </div>
            {member.role === 'admin' && <Badge>admin</Badge>}
          </div>
        ))}
      </div>
    </Card>
  );
}
