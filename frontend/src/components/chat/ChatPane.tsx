"use client";
import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { Conversation, Message } from '@/types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import Avatar from '../shared/Avatar';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { Virtuoso } from 'react-virtuoso';
import { wsClient } from '@/lib/wsClient';
import GroupSettingsModal from './GroupSettingsModal';

export default function ChatPane({ conversationId }: { conversationId: string }) {
  const { user } = useAuthStore();
  const { messages, setMessages, updateMessageStatus, conversations, typingUsers } = useChatStore();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const virtuosoRef = useRef<any>(null);

  useEffect(() => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) setConversation(conv);
  }, [conversations, conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${conversationId}`);
        setMessages(conversationId, res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (!conversations.find(c => c.id === conversationId)) {
      api.get(`/conversations/${conversationId}`).then(res => setConversation(res.data));
    }

    fetchMessages();
  }, [conversationId, setMessages, conversations]);

  useEffect(() => {
    const unreadMsgs = messages[conversationId]?.filter(m => 
      m.sender_id !== user?.id && 
      !m.statuses.some(s => s.user_id === user?.id && s.status === 'read')
    );

    if (unreadMsgs && unreadMsgs.length > 0) {
      unreadMsgs.forEach(msg => {
        api.put(`/messages/${msg.id}/status`, { status: 'read' }).catch(console.error);
        wsClient.send('message_read', { message_id: msg.id, conversation_id: conversationId });
      });
    }
  }, [messages, conversationId, user?.id]);

  const msgs = messages[conversationId] || [];

  let name = conversation?.name || 'Unknown';
  let avatarUrl = conversation?.avatar_url;

  if (conversation?.type === 'direct') {
    const otherParticipant = conversation.participants.find(p => p.user_id !== user?.id);
    if (otherParticipant) {
      name = otherParticipant.user.display_name;
      avatarUrl = otherParticipant.user.avatar_url;
    }
  }

  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Signal Desktop: header-height: 52px, bg = --color-legacy-conversation-header-bg dark = #121212 */}
      <div
        className="flex items-center justify-between px-4 z-10 flex-shrink-0"
        style={{
          height: '52px',
          backgroundColor: '#121212', // $color-gray-95 — conversation header bg
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            if (conversation?.type === 'group') {
              setShowGroupSettings(true);
            }
          }}
        >
          <Avatar name={name} url={avatarUrl} size="sm" />
          <div>
            <h2
              className="font-semibold text-white"
              style={{ fontSize: '14px', letterSpacing: '-0.006em' }}
            >
              {name}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[
            <Phone key="ph" size={20} />,
            <Video key="vid" size={20} />,
            <MoreVertical key="more" size={20} />
          ].map((icon, i) => (
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

      <div className="flex-1 overflow-hidden relative">
        {loading ? (
          <div className="flex items-center justify-center h-full text-signal-text-secondary">Loading...</div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={msgs}
            initialTopMostItemIndex={msgs.length - 1}
            itemContent={(index, msg) => (
              <div className="px-4 py-1" key={msg.id}>
                <MessageBubble message={msg} isOwn={msg.sender_id === user?.id} />
              </div>
            )}
            followOutput="smooth"
            style={{ height: '100%' }}
          />
        )}
        
        {typingUsers[conversationId]?.length > 0 && (
          <div className="absolute bottom-2 left-4 bg-signal-sidebar-dark rounded-full px-4 py-2 text-signal-text-secondary text-sm flex items-center shadow-lg border border-signal-divider">
            <span className="flex space-x-1">
              <span className="w-1.5 h-1.5 bg-signal-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-signal-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-signal-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        )}
      </div>

      <div className="p-3 z-10 flex-shrink-0" style={{ backgroundColor: '#1A1A1A' }}>
        <MessageInput conversationId={conversationId} />
      </div>

      {showGroupSettings && (
        <GroupSettingsModal 
          conversationId={conversationId} 
          onClose={() => setShowGroupSettings(false)} 
        />
      )}
    </div>
  );
}
