import { useEffect } from 'react';
import { wsClient } from '@/lib/wsClient';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types';

export function useWebSocket() {
  const { user, accessToken } = useAuthStore();
  const { addMessage, updateMessageStatus, setTyping, upsertConversation } = useChatStore();

  useEffect(() => {
    if (!user || !accessToken) return;

    wsClient.connect(user.id, accessToken);

    const handleNewMessage = (msg: Message) => {
      addMessage(msg.conversation_id, msg);
      
      const conv = useChatStore.getState().conversations.find(c => c.id === msg.conversation_id);
      if (conv) {
        upsertConversation({
          ...conv,
          last_message: msg,
          last_message_at: msg.created_at,
          unread_count: msg.sender_id !== user.id ? (conv.unread_count || 0) + 1 : conv.unread_count
        });
      }

      // If we received a message from someone else, let them know it was delivered to us
      if (msg.sender_id !== user.id) {
        import('@/lib/api').then(({ api }) => {
          api.put(`/messages/${msg.id}/status`, { status: 'delivered' }).catch(console.error);
        });
        wsClient.send('message_delivered', { message_id: msg.id, conversation_id: msg.conversation_id });
      }
    };

    const handleMessageStatus = (payload: any) => {
      const { message_id, status, user_id } = payload;
      const messages = useChatStore.getState().messages;
      for (const convId in messages) {
        if (messages[convId].some(m => m.id === message_id)) {
          updateMessageStatus(message_id, convId, status, user_id);
          break;
        }
      }
    };

    const handleTyping = (payload: any) => {
      const { conversation_id, user_id, is_typing } = payload;
      setTyping(conversation_id, user_id, is_typing);
    };

    wsClient.on('new_message', handleNewMessage);
    wsClient.on('message_status', handleMessageStatus);
    wsClient.on('typing_indicator', handleTyping);

    return () => {
      wsClient.off('new_message', handleNewMessage);
      wsClient.off('message_status', handleMessageStatus);
      wsClient.off('typing_indicator', handleTyping);
      wsClient.disconnect();
    };
  }, [user, accessToken, addMessage, updateMessageStatus, setTyping]);
}
