import React from 'react';
import { Message } from '@/types';
import MessageBubble from './MessageBubble';
import { Virtuoso } from 'react-virtuoso';

export default function MessageList({ messages, userId, virtuosoRef }: { messages: Message[], userId: string, virtuosoRef: any }) {
  return (
    <Virtuoso
      ref={virtuosoRef}
      data={messages}
      initialTopMostItemIndex={messages.length - 1}
      itemContent={(index, msg) => (
        <div className="px-4 py-1" key={msg.id}>
          <MessageBubble message={msg} isOwn={msg.sender_id === userId} />
        </div>
      )}
      followOutput="smooth"
      style={{ height: '100%' }}
    />
  );
}
