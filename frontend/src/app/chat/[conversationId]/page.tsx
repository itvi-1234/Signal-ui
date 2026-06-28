import ChatPane from '@/components/chat/ChatPane';

export default function ActiveChatPage({ params }: { params: { conversationId: string } }) {
  return <ChatPane conversationId={params.conversationId} />;
}
