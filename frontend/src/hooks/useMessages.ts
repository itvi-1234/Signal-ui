import { useChatStore } from '../store/chatStore';

export function useMessages(conversationId: string) {
  const messages = useChatStore(state => state.messages[conversationId] || []);
  return { messages };
}
