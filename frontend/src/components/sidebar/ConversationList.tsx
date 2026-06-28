import React from 'react';
import ConversationItem from './ConversationItem';
import { Conversation } from '@/types';

export default function ConversationList({ conversations }: { conversations: Conversation[] }) {
  if (conversations.length === 0) {
    return <div className="p-4 text-center text-signal-text-secondary text-sm">No conversations found</div>;
  }
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map(conv => <ConversationItem key={conv.id} conversation={conv} />)}
    </div>
  );
}
