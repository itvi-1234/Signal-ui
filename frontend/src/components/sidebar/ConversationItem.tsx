"use client";
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Conversation } from '@/types';
import { useAuthStore } from '@/store/authStore';
import Avatar from '../shared/Avatar';
import { formatConversationTime } from '@/lib/dateUtils';
import { Users, CheckCheck, Check } from 'lucide-react';

export default function ConversationItem({ conversation }: { conversation: Conversation }) {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const isActive = params?.conversationId === conversation.id;

  let name = conversation.name || 'Unknown';
  let avatarUrl: string | undefined = conversation.avatar_url;
  let isOnline = false;
  let lastSeenText = '';
  let isGroup = conversation.type === 'group';

  if (conversation.type === 'direct') {
    const other = conversation.participants.find(p => p.user_id !== user?.id);
    if (other) {
      name = other.user.display_name;
      avatarUrl = other.user.avatar_url || undefined;
      isOnline = other.user.is_online;
      if (!isOnline && other.user.last_seen) {
        const diff = Date.now() - new Date(other.user.last_seen).getTime();
        const mins = Math.floor(diff / 60000);
        const hrs = Math.floor(mins / 60);
        const days = Math.floor(hrs / 24);
        if (mins < 1) lastSeenText = 'last seen just now';
        else if (mins < 60) lastSeenText = `last seen ${mins}m ago`;
        else if (hrs < 24) lastSeenText = `last seen ${hrs}h ago`;
        else if (days === 1) lastSeenText = 'last seen yesterday';
        else lastSeenText = `last seen ${days} days ago`;
      } else if (isOnline) {
        lastSeenText = 'online';
      }
    }
  }

  const lastMsg = conversation.last_message;
  const isOwnLast = lastMsg?.sender_id === user?.id;
  const lastMessageText = lastMsg?.content || '';
  const time = conversation.last_message_at
    ? formatConversationTime(conversation.last_message_at)
    : '';

  let tickIcon: React.ReactNode = null;
  if (isOwnLast && lastMsg) {
    const isRead = lastMsg.statuses?.some(s => s.status === 'read');
    const isDelivered = lastMsg.statuses?.some(s => s.status === 'delivered');
    if (isRead) {
      tickIcon = <CheckCheck size={12} strokeWidth={2.5} className="flex-shrink-0" style={{ color: '#89B4F8' }} />;
    } else if (isDelivered) {
      tickIcon = <CheckCheck size={12} strokeWidth={2.5} className="flex-shrink-0" style={{ color: 'rgba(255,255,255,0.55)' }} />;
    } else {
      tickIcon = <Check size={12} strokeWidth={2.5} className="flex-shrink-0" style={{ color: 'rgba(255,255,255,0.55)' }} />;
    }
  }

  const hasUnread = conversation.unread_count > 0;

  return (
    <div
      onClick={() => router.push(`/chat/${conversation.id}`)}
      className="flex items-center px-3 py-[9px] mx-[6px] rounded-[8px] cursor-pointer transition-colors mb-0.5"
      style={{
        backgroundColor: isActive ? '#3A3A3A' : 'transparent', // selected = elevated-tertiary
      }}
    >
      {/* Avatar with online dot for direct chats */}
      <div className="flex-shrink-0">
        <Avatar
          name={name}
          url={avatarUrl}
          isOnline={isOnline}
          showOnlineDot={!isGroup}
          size="md"
        />
      </div>

      {/* Content */}
      <div className="ml-3 flex-1 min-w-0 overflow-hidden">
        {/* Row 1: Name + Time */}
        <div className="flex justify-between items-baseline gap-1 mb-0.5">
          <div className="flex items-center gap-1 min-w-0">
            {isGroup && (
              <Users size={12} className="flex-shrink-0" style={{ color: 'rgba(255,255,255,0.55)' }} />
            )}
            <h3
              className="truncate text-white"
              style={{
                fontSize: '14px',
                fontWeight: hasUnread ? 600 : 400,
                letterSpacing: '-0.006em'
              }}
            >
              {name}
            </h3>
          </div>
          <span
            className="flex-shrink-0 tabular-nums"
            style={{
              fontSize: '11px',
              fontWeight: hasUnread ? 600 : 400,
              color: hasUnread ? '#FFFFFF' : 'rgba(255,255,255,0.55)'
            }}
          >
            {time}
          </span>
        </div>

        {/* Row 2: Last message preview + unread badge */}
        <div className="flex justify-between items-center gap-1 mt-[1px]">
          <div className="flex items-center gap-1 min-w-0">
            {tickIcon}
            <p
              className="truncate leading-snug w-full"
              style={{
                fontSize: '13px',
                fontWeight: hasUnread ? 600 : 400,
                color: hasUnread ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                letterSpacing: '-0.003em'
              }}
            >
              {lastMessageText || (
                <span style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                  {isGroup ? 'Group created' : lastSeenText || 'No messages yet'}
                </span>
              )}
            </p>
          </div>
          {hasUnread && (
            <span
              className="text-white text-[10px] font-bold min-w-[16px] h-[16px] px-1 rounded-full text-center flex-shrink-0 flex items-center justify-center leading-none"
              style={{ backgroundColor: '#2C6BED' }} // $color-ultramarine
            >
              {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
