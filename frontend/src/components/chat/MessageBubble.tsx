import React from 'react';
import { Message } from '@/types';
import { formatMessageTime } from '@/lib/dateUtils';
import { Check, CheckCheck } from 'lucide-react';

export default function MessageBubble({ message, isOwn }: { message: Message, isOwn: boolean }) {
  const time = formatMessageTime(message.created_at);

  let statusIcon = null;
  if (isOwn) {
    const isRead = message.statuses?.some(s => s.status === 'read');
    const isDelivered = message.statuses?.some(s => s.status === 'delivered');
    
    if (isRead) {
      // Read = Signal blue tint ticks (exact from Signal Desktop $color-ios-blue-tint)
      statusIcon = <CheckCheck size={14} strokeWidth={2.5} className="ml-1" style={{ color: '#89B4F8' }} />;
    } else if (isDelivered) {
      // Delivered = white/55% opacity double check
      statusIcon = <CheckCheck size={14} strokeWidth={2.5} className="ml-1 text-white/55" />;
    } else {
      // Sent = single white/55% opacity check
      statusIcon = <Check size={14} strokeWidth={2.5} className="ml-1 text-white/55" />;
    }
  }

  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} my-0.5 px-4`}>
      <div 
        className={`
          relative group select-text
          max-w-[306px] min-w-[60px]
          px-3 py-2
          ${isOwn
            // Outgoing: Signal ultramarine #2C6BED, border-radius 18px, collapsed top-right = 4px
            ? 'rounded-[18px] rounded-tr-[4px] text-white'
            // Incoming: Signal gray-75 #3B3B3B, border-radius 18px, collapsed top-left = 4px
            : 'rounded-[18px] rounded-tl-[4px] text-white'
          }
        `}
        style={{
          backgroundColor: isOwn ? '#2C6BED' : '#3B3B3B',
        }}
      >
        {/* Message text — Signal uses 14px/body-large */}
        <div
          className="text-[14px] leading-5 tracking-[-0.006em] pb-4 pr-8 whitespace-pre-wrap break-words"
          style={{ wordBreak: 'break-word' }}
        >
          {message.content}
        </div>
        
        {/* Timestamp + status — Signal places these at bottom-right, inline */}
        <div className="absolute bottom-[5px] right-[8px] flex items-center gap-0.5">
          <span
            className="text-[11px] leading-none"
            style={{
              color: isOwn ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
              letterSpacing: '0.005em',
            }}
          >
            {time}
          </span>
          {statusIcon}
        </div>
      </div>
    </div>
  );
}
