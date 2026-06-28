"use client";
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Signal Desktop NavTabs — exact $NavTabs__width: 80px from _variables.scss
// Background: $color-gray-90 = #1B1B1B
// Icon active: white, inactive: rgba(255,255,255,0.55) = $color-white-alpha-55

export default function LeftRail({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  // Signal Desktop uses SVG icons from images/icons/v3/ — we replicate them as inline SVG

  return (
    <div
      className="flex-shrink-0 flex flex-col items-center h-full py-2 z-20"
      style={{
        width: '64px',
        backgroundColor: '#2E2E2E', // $color-gray-80
        borderRight: '1px solid rgba(255,255,255,0.08)', // subtle separator
      }}
    >
      {/* Hamburger / Menu toggle — Signal's NavTabsToggle */}
      <button
        onClick={onToggleSidebar}
        className="flex flex-col items-center justify-center transition-colors group hover:bg-white/10 active:bg-white/5"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          color: 'rgba(255,255,255,0.55)',
          marginBottom: '4px',
          padding: '10px 10px',
        }}
        title="Toggle left pane"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ width: '18px', height: '2px', backgroundColor: 'currentColor', borderRadius: '1px' }} />
          <div style={{ width: '18px', height: '2px', backgroundColor: 'currentColor', borderRadius: '1px' }} />
          <div style={{ width: '18px', height: '2px', backgroundColor: 'currentColor', borderRadius: '1px' }} />
        </div>
      </button>

      {/* Nav items */}
      <div className="flex flex-col items-center w-full flex-1" style={{ gap: '0px' }}>

        {/* Chats */}
        <NavItem
          href="/chat"
          title="Chats"
          isActive={isActive('/chat')}
          onClick={() => router.push('/chat')}
          icon={
            isActive('/chat') ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.03 2 11c0 2.825 1.455 5.348 3.731 6.963-.448 1.838-1.573 3.328-1.706 3.502-.132.174.002.404.218.404.912 0 2.85-.296 4.316-1.127A10.82 10.82 0 0012 20c5.523 0 10-4.03 10-9s-4.477-9-10-9z"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                <path d="M12 3C6.477 3 2 7.03 2 12c0 2.825 1.455 5.348 3.731 6.963-.448 1.838-1.573 3.328-1.706 3.502-.132.174.002.404.218.404.912 0 2.85-.296 4.316-1.127A10.82 10.82 0 0012 21c5.523 0 10-4.03 10-9s-4.477-9-10-9z"/>
              </svg>
            )
          }
        />

        {/* Calls */}
        <NavItem
          href="/calls"
          title="Calls"
          isActive={isActive('/calls')}
          onClick={() => router.push('/calls')}
          icon={
            isActive('/calls') ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.82a19.79 19.79 0 01-3-8.64A2 2 0 012.07 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.94a16 16 0 006.29 6.29l1.3-1.3a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            )
          }
        />

        {/* Stories */}
        <NavItem
          href="/stories"
          title="Stories"
          isActive={isActive('/stories')}
          onClick={() => router.push('/stories')}
          badge="1"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="7" y="7" width="14" height="14" rx="3" />
              <path d="M7 17H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
            </svg>
          }
        />
      </div>

      {/* Settings pinned to bottom — NavTabs__Item--Settings */}
      <NavItem
        href="/settings"
        title="Settings"
        isActive={pathname.startsWith('/settings')}
        onClick={() => router.push('/settings')}
        icon={
          pathname.startsWith('/settings') ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          )
        }
      />
    </div>
  );
}

// NavItem — matches Signal's NavTabs__Item structure
function NavItem({
  isActive,
  onClick,
  icon,
  badge,
  title,
}: {
  href: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex flex-col items-center justify-center gap-1 transition-colors w-full"
      style={{
        height: '48px', // reduced height to lessen gap
        padding: '2px 0',
        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
        position: 'relative',
      }}
    >
      {/* Active indicator pill — Signal uses a small pill on selected tab */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '24px',
            backgroundColor: '#2C6BED', // ultramarine
            borderRadius: '0 4px 4px 0',
          }}
        />
      )}

      {/* Icon with selection bg */}
      <div className="relative">
        <div
          style={{
            width: '36px', // reduced pill width
            height: '36px', // reduced pill height
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            backgroundColor: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
            transition: 'background-color 120ms ease-out',
          }}
        >
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { width: 20, height: 20 }) : icon}
        </div>
        
        {badge && (
          <div
            className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white text-[10px] font-bold"
            style={{
              backgroundColor: '#F44336', // Signal red
              width: '16px',
              height: '16px',
              border: '2px solid #2E2E2E' // matching LeftRail background
            }}
          >
            {badge}
          </div>
        )}
      </div>
    </button>
  );
}
