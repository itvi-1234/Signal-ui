import { useChatStore } from '../store/chatStore';

export function useTyping(conversationId: string) {
  const typingUsers = useChatStore(state => state.typingUsers[conversationId] || []);
  return { typingUsers };
}
