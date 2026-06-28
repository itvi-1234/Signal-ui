import React from 'react';

export default function GroupInfoPanel({ group }: { group: any }) {
  return (
    <div className="p-4 bg-signal-sidebar-dark border-l border-signal-divider w-80">
      <h3 className="font-bold text-white mb-2">Group Info</h3>
      <p className="text-signal-text-secondary">{group?.name || 'Unnamed Group'}</p>
    </div>
  );
}
