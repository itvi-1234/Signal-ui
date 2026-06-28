"use client";
import LeftRail from '@/components/sidebar/LeftRail';
import { Layers } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Avatar from '@/components/shared/Avatar';

export default function StoriesPage() {
  const { user } = useAuthStore();
  return (
    <div className="flex h-screen bg-signal-bg-dark text-signal-text-primary overflow-hidden">
      <LeftRail />
      <div className="w-[220px] flex-shrink-0 bg-signal-sidebar-dark border-r border-signal-divider flex flex-col">
        <div className="h-[52px] flex items-center px-4">
          <h1 className="text-[17px] font-semibold text-white">Stories</h1>
        </div>
        <div className="px-3 pb-2">
          <div className="w-full bg-signal-surface-dark h-7 rounded-md" />
        </div>
        <div className="flex items-center space-x-3 px-4 py-2.5 hover:bg-signal-hover cursor-pointer">
          <div className="relative">
            <Avatar name={user?.display_name || 'U'} size="md" />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-signal-blue rounded-full flex items-center justify-center text-white text-[10px] font-bold leading-none">+</div>
          </div>
          <div>
            <p className="text-[14px] text-white font-medium">My Story</p>
            <p className="text-[12px] text-signal-text-secondary">Add a story</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-end pb-8 text-center px-4">
          <p className="text-signal-text-secondary text-sm font-medium">No stories</p>
          <p className="text-signal-text-muted text-xs mt-1">New updates will appear here.</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center bg-signal-bg-dark">
        <Layers size={40} className="text-signal-text-secondary mb-3 opacity-40" />
        <p className="text-signal-text-secondary text-sm">Click + to add an update.</p>
      </div>
    </div>
  );
}
