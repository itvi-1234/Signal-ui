"use client";
import React, { useState } from 'react';
import LeftRail from '@/components/sidebar/LeftRail';
import { useAuthStore } from '@/store/authStore';
import Avatar from '@/components/shared/Avatar';
import {
  Globe2, Palette, MessageSquare, Phone,
  Bell, Lock, Database, Archive, Heart, ChevronRight, UserCog
} from 'lucide-react';

const sections = [
  { icon: Globe2,       label: 'General',             id: 'general' },
  { icon: Palette,      label: 'Appearance',          id: 'appearance' },
  { icon: MessageSquare,label: 'Chats',               id: 'chats' },
  { icon: Phone,        label: 'Calls',               id: 'calls' },
  { icon: Bell,         label: 'Notifications',       id: 'notifications' },
  { icon: Lock,         label: 'Privacy',             id: 'privacy' },
  { icon: Database,     label: 'Data usage',          id: 'data' },
  { icon: Archive,      label: 'Backups',             id: 'backups' },
  { icon: Heart,        label: 'Donate to Signal',    id: 'donate' },
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [active, setActive] = useState('general');

  // Resizing logic
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const isResizing = React.useRef(false);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !sidebarRef.current) return;
      const sidebarLeft = sidebarRef.current.getBoundingClientRect().left;
      let newWidth = e.clientX - sidebarLeft;
      if (newWidth < 220) newWidth = 220;
      if (newWidth > 600) newWidth = 600;
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div className="flex h-screen bg-signal-bg-dark text-signal-text-primary overflow-hidden">
      <LeftRail />

      {/* Settings sidebar */}
      <div 
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className="flex-shrink-0 flex flex-col bg-signal-sidebar-dark border-r border-signal-divider relative transition-none"
      >
        <div className="h-[52px] flex items-center px-4 flex-shrink-0">
          <h1 className="text-[17px] font-semibold text-white">Settings</h1>
        </div>

        {/* User row */}
        <div className="flex items-center space-x-3 px-3 py-2.5 mx-2 rounded-lg bg-signal-selected cursor-pointer mb-2">
          <Avatar name={user?.display_name || 'U'} url={user?.avatar_url} size="md" />
          <div className="min-w-0">
            <p className="text-white text-[14px] font-medium truncate">{user?.display_name}</p>
            <p className="text-signal-text-secondary text-[12px] truncate">{user?.phone_number || '+1234567890'}</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 overflow-y-auto mt-2">
          {sections.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left mb-0.5 ${
                active === id
                  ? 'bg-signal-selected text-white'
                  : 'text-signal-text-secondary hover:bg-signal-hover hover:text-white'
              }`}
            >
              <Icon size={18} strokeWidth={1.8} className="flex-shrink-0" />
              <span className="text-[13.5px]">{label}</span>
            </button>
          ))}
        </nav>

        {/* Log Out */}
        <div className="p-4 mt-auto">
          <button
            onClick={() => {
              useAuthStore.getState().logout();
              window.location.href = '/auth';
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left text-red-400 hover:bg-signal-hover hover:text-red-300"
          >
            <span className="text-[13.5px] font-medium">Log Out</span>
          </button>
        </div>

        {/* Resize Handle */}
        <div 
          onMouseDown={handleMouseDown}
          className="absolute top-0 right-0 w-[5px] h-full cursor-col-resize z-50 hover:bg-signal-divider active:bg-signal-divider transition-colors"
          style={{ transform: 'translateX(50%)' }}
        />
      </div>

      {/* Settings main panel */}
      <div className="flex-1 bg-signal-bg-dark flex flex-col overflow-hidden">
        <div className="h-[52px] flex items-center px-8 border-b border-signal-divider flex-shrink-0">
          <h2 className="text-[15px] font-medium text-white">
            {active === 'general' ? 'Profile' : sections.find(s => s.id === active)?.label}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          {active === 'general' && (
            <div className="w-full max-w-[460px]">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative cursor-pointer">
                  <Avatar name={user?.display_name || 'U'} url={user?.avatar_url} size="xl" />
                  <div className="absolute bottom-0 right-0 bg-signal-blue text-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm border-2 border-signal-bg-dark">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </div>
                <p className="text-signal-text-secondary text-[13px] mt-3 cursor-pointer hover:underline">Edit photo</p>
              </div>

              {/* Profile fields */}
              <div className="space-y-[1px] rounded-xl overflow-hidden bg-signal-sidebar-dark border border-signal-divider/50 shadow-sm">
                <div className="flex items-center px-4 py-3 hover:bg-signal-hover cursor-pointer transition-colors group">
                  <div className="w-8 flex justify-center text-signal-text-secondary flex-shrink-0">
                    <UserCog size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0 ml-3">
                    <p className="text-signal-text-secondary text-[11px] font-medium tracking-wide mb-0.5">NAME</p>
                    <p className="text-white text-[14px]">{user?.display_name}</p>
                  </div>
                  <ChevronRight size={18} className="text-signal-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center px-4 py-3 hover:bg-signal-hover cursor-pointer transition-colors group">
                  <div className="w-8 flex justify-center text-signal-text-secondary flex-shrink-0">
                    <MessageSquare size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0 ml-3">
                    <p className="text-signal-text-secondary text-[11px] font-medium tracking-wide mb-0.5">ABOUT</p>
                    <p className="text-signal-text-secondary text-[14px]">{user?.bio || 'Hey there! I am using SecureChat.'}</p>
                  </div>
                  <ChevronRight size={18} className="text-signal-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <p className="text-signal-text-muted text-[12px] mt-2 px-1 leading-relaxed">
                Your profile and changes to it will be visible to people you message, contacts and groups.
              </p>

              <div className="mt-8 space-y-[1px] rounded-xl overflow-hidden bg-signal-sidebar-dark border border-signal-divider/50 shadow-sm">
                <div className="flex items-center px-4 py-3 hover:bg-signal-hover cursor-pointer transition-colors group">
                  <div className="w-8 flex justify-center text-signal-text-secondary flex-shrink-0">
                    <Globe2 size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0 ml-3">
                    <p className="text-white text-[14px]">Username</p>
                    <p className="text-signal-text-secondary text-[13px] mt-0.5">@{user?.username}</p>
                  </div>
                  <ChevronRight size={18} className="text-signal-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <p className="text-signal-text-muted text-[12px] mt-2 px-1 leading-relaxed">
                People can message you using your optional username so you don&apos;t have to give out your phone number.
              </p>
            </div>
          )}

          {active !== 'general' && (
            <div className="flex flex-col items-center justify-center h-full text-signal-text-secondary text-sm pb-20">
              <p>{sections.find(s => s.id === active)?.label} settings</p>
              <p className="text-xs mt-1 text-signal-text-muted">Coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
