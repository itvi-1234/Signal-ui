"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import LeftRail from '@/components/sidebar/LeftRail';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  useWebSocket();
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="flex h-screen text-white overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
      <LeftRail onToggleSidebar={() => setShowSidebar(v => !v)} />
      {showSidebar && <Sidebar />}
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
        {children}
      </main>
    </div>
  );
}
