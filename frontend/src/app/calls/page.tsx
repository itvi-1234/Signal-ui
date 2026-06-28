"use client";
import LeftRail from '@/components/sidebar/LeftRail';
import { Phone, Link } from 'lucide-react';

export default function CallsPage() {
  return (
    <div className="flex h-screen bg-signal-bg-dark text-signal-text-primary overflow-hidden">
      <LeftRail />
      {/* Left panel */}
      <div className="w-[220px] flex-shrink-0 bg-signal-sidebar-dark border-r border-signal-divider flex flex-col">
        <div className="h-[52px] flex items-center justify-between px-4">
          <h1 className="text-[17px] font-semibold text-white">Calls</h1>
        </div>
        <div className="px-3 pb-2">
          <div className="w-full bg-signal-surface-dark h-7 rounded-md" />
        </div>
        <div className="flex items-center space-x-3 px-4 py-2.5 hover:bg-signal-hover cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-signal-surface-dark flex items-center justify-center">
            <Link size={16} className="text-signal-blue" />
          </div>
          <span className="text-[14px] text-signal-blue">Create a Call Link</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-end pb-8 text-center px-4">
          <p className="text-signal-text-secondary text-sm font-medium">No calls</p>
          <p className="text-signal-text-muted text-xs mt-1">Recent calls will appear here.</p>
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center bg-signal-bg-dark">
        <Phone size={40} className="text-signal-text-secondary mb-3 opacity-40" />
        <p className="text-signal-text-secondary text-sm">Click <Phone size={14} className="inline" /> to start a new voice or video call.</p>
      </div>
    </div>
  );
}
