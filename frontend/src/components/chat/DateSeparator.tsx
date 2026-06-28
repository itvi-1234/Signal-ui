import React from 'react';

export default function DateSeparator({ dateString }: { dateString: string }) {
  return (
    <div className="flex justify-center my-4">
      <div className="bg-signal-sidebar-dark text-signal-text-secondary text-xs px-3 py-1 rounded-full uppercase tracking-wider">
        {dateString}
      </div>
    </div>
  );
}
