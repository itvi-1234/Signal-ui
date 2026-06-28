import React from 'react';
import Avatar from '../shared/Avatar';
import { Edit, Settings } from 'lucide-react';

export default function SidebarHeader({ user, onNewChat, onSettings }: { user: any, onNewChat: () => void, onSettings: () => void }) {
  return (
    <div className="h-[60px] flex items-center justify-between px-4 border-b border-signal-divider flex-shrink-0">
      <div className="flex items-center space-x-3">
        <Avatar name={user?.display_name || ''} url={user?.avatar_url} size="sm" />
        <span className="font-medium text-white truncate max-w-[120px]">{user?.display_name}</span>
      </div>
      <div className="flex space-x-2 text-signal-text-secondary">
        <button onClick={onNewChat} className="p-2 hover:bg-signal-divider rounded-full transition">
          <Edit size={20} />
        </button>
        <button onClick={onSettings} className="p-2 hover:bg-signal-divider rounded-full transition">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}
