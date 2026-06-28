export interface User {
  id: string;
  phone_number: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  is_online: boolean;
  last_seen?: string;
  created_at: string;
}

export interface Contact {
  id: string;
  owner_id: string;
  contact_id: string;
  nickname?: string;
  created_at: string;
  contact_user: User;
}

export interface MessageReaction {
  id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface MessageStatus {
  user_id: string;
  status: 'sent' | 'delivered' | 'read';
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  reply_to_id?: string;
  created_at: string;
  edited_at?: string;
  is_deleted: boolean;
  disappears_at?: string;
  statuses: MessageStatus[];
  reactions: MessageReaction[];
}

export interface ConversationParticipant {
  user_id: string;
  joined_at: string;
  is_admin: boolean;
  user: User;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  created_at: string;
  last_message_at?: string;
  participants: ConversationParticipant[];
  last_message?: Message;
  unread_count: number;
  name?: string;
  avatar_url?: string;
}

export interface GroupMeta {
  id: string;
  conversation_id: string;
  name: string;
  description: string;
  avatar_url?: string;
  created_by: string;
  created_at: string;
}
