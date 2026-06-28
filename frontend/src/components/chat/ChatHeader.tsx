import React from 'react';
import Avatar from '../shared/Avatar';
import { Phone, Video, MoreVertical } from 'lucide-react';

export default function ChatHeader({ name, avatarUrl }: { name: string, avatarUrl?: string }) {
  return (
    // Signal Desktop: header-height: 52px, bg = --color-legacy-conversation-header-bg dark = #121212
    <div
      className="flex items-center justify-between px-4 z-10 flex-shrink-0"
      style={{
        height: '52px',
        backgroundColor: '#121212', // $color-gray-95 — conversation header bg
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-3">
        <Avatar name={name} url={avatarUrl} size="sm" />
        <div>
          {/* Signal: font-body-1-bold, 14px/semibold */}
          <h2
            className="font-semibold text-white"
            style={{ fontSize: '14px', letterSpacing: '-0.006em' }}
          >
            {name}
          </h2>
        </div>
      </div>
      {/* Signal action icons: color = rgba(255,255,255,0.55) */}
      <div className="flex items-center gap-1">
        {[<Phone key="ph" size={20} />, <Video key="vid" size={20} />, <MoreVertical key="more" size={20} />].map((icon, i) => (
          <button
            key={i}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
