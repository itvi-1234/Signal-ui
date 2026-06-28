import { create } from 'zustand';
import { Conversation, Message } from '@/types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // keyed by conversation_id
  typingUsers: Record<string, string[]>; // conversation_id -> user_ids
  setConversations: (list: Conversation[]) => void;
  setActiveConversationId: (id: string | null) => void;
  upsertConversation: (conversation: Conversation) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessageStatus: (messageId: string, conversationId: string, status: 'sent' | 'delivered' | 'read', userId: string) => void;
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},
  setConversations: (list) => set({ conversations: list }),
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  upsertConversation: (conv) => set((state) => {
    let updated: typeof state.conversations;
    const exists = state.conversations.find((c) => c.id === conv.id);
    if (exists) {
      updated = state.conversations.map((c) => c.id === conv.id ? { ...c, ...conv } : c);
    } else {
      updated = [conv, ...state.conversations];
    }
    // Always keep sorted by most recent activity
    return {
      conversations: [...updated].sort((a, b) => {
        const ta = a.last_message_at ? new Date(a.last_message_at).getTime() : new Date(a.created_at).getTime();
        const tb = b.last_message_at ? new Date(b.last_message_at).getTime() : new Date(b.created_at).getTime();
        return tb - ta;
      })
    };
  }),
  setMessages: (convId, msgs) => set((state) => ({
    messages: { ...state.messages, [convId]: msgs }
  })),
  addMessage: (convId, msg) => set((state) => {
    const existing = state.messages[convId] || [];
    // prevent duplicate if optimistic UI already added it
    if (existing.find(m => m.id === msg.id)) return state;
    return {
      messages: { ...state.messages, [convId]: [...existing, msg] }
    };
  }),
  updateMessageStatus: (msgId, convId, status, userId) => set((state) => {
    const convMsgs = state.messages[convId];
    if (!convMsgs) return state;
    return {
      messages: {
        ...state.messages,
        [convId]: convMsgs.map(m => {
          if (m.id === msgId) {
            const existingStatusIndex = m.statuses.findIndex(s => s.user_id === userId);
            const newStatuses = [...m.statuses];
            if (existingStatusIndex >= 0) {
              newStatuses[existingStatusIndex] = { ...newStatuses[existingStatusIndex], status };
            } else {
              newStatuses.push({ user_id: userId, status, updated_at: new Date().toISOString() });
            }
            return { ...m, statuses: newStatuses };
          }
          return m;
        })
      }
    };
  }),
  setTyping: (convId, userId, isTyping) => set((state) => {
    const currentTyping = state.typingUsers[convId] || [];
    let newTyping = [...currentTyping];
    if (isTyping && !newTyping.includes(userId)) {
      newTyping.push(userId);
    } else if (!isTyping) {
      newTyping = newTyping.filter(id => id !== userId);
    }
    return { typingUsers: { ...state.typingUsers, [convId]: newTyping } };
  }),
}));
