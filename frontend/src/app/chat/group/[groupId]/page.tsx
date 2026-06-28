import ChatPane from '@/components/chat/ChatPane';

export default function GroupChatPage({ params }: { params: { groupId: string } }) {
  return <ChatPane conversationId={params.groupId} />;
}
