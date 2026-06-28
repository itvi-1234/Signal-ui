import { useChatStore } from '../store/chatStore';

export function useConversations() {
  const conversations = useChatStore(state => state.conversations);
  return { conversations };
}
