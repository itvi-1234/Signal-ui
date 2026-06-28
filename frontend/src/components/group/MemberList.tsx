import React from 'react';
import Avatar from '../shared/Avatar';

export default function MemberList({ members }: { members: any[] }) {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-signal-text-secondary uppercase mb-2">Members</h4>
      {members?.map((m, i) => (
        <div key={i} className="flex items-center space-x-3 mb-2">
          <Avatar name={m.user?.display_name || 'U'} size="sm" />
          <span className="text-white text-sm">{m.user?.display_name}</span>
        </div>
      ))}
    </div>
  );
}
