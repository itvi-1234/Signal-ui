"use client";
import React, { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import { wsClient } from '@/lib/wsClient';
import { useChatStore } from '@/store/chatStore';
import { Send, Smile, Mic, Plus, Image as ImageIcon, File as FileIcon } from 'lucide-react';

export default function MessageInput({ conversationId }: { conversationId: string }) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  
  const { addMessage, upsertConversation, conversations } = useChatStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target as Node)) {
        setShowAttachmentMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let typingTimeout: NodeJS.Timeout;

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      wsClient.send('typing_start', { conversation_id: conversationId });
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setIsTyping(false);
      wsClient.send('typing_stop', { conversation_id: conversationId });
    }, 2000);
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    
    const msgText = text;
    setText('');
    
    try {
      const res = await api.post(`/messages/${conversationId}`, {
        content: msgText,
        message_type: 'text'
      });
      // Add the real message to the store immediately
      addMessage(conversationId, res.data);
      
      // Update sidebar
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        upsertConversation({
          ...conv,
          last_message: res.data,
          last_message_at: res.data.created_at
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  const handleAttachmentClick = (type: 'image' | 'file') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*,video/*' : '*/*';
      fileInputRef.current.click();
    }
    setShowAttachmentMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`File attached: ${file.name}\n(Ready for backend upload)`);
      // Future implementation: upload file logic
    }
  };

  return (
    <div className="flex items-end gap-2 px-4 py-2 w-full mx-auto pb-3 relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        className="hidden" 
      />
      
      {/* Emoji Button (Left Outside) */}
      <div className="relative flex-shrink-0 mb-0.5" ref={emojiPickerRef}>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-1.5 transition-colors rounded-full hover:bg-white/5"
          style={{ color: 'rgba(255,255,255,0.55)' }}
          title="Emoji"
        >
          <Smile size={22} strokeWidth={1.5} />
        </button>

        {/* Mock Emoji Picker Popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-[50px] left-0 w-[320px] bg-[#2A2A2A] rounded-xl shadow-2xl border border-[#3B3B3B] z-50 flex flex-col overflow-hidden">
            <div className="flex px-2 pt-2 gap-1 mb-1">
              <button className="flex-1 bg-[#3B3B3B] text-[#E9E9E9] text-[13px] font-medium py-1.5 rounded-full">Emoji</button>
              <button className="flex-1 text-[#B9B9B9] hover:bg-white/5 text-[13px] font-medium py-1.5 rounded-full transition-colors">Stickers</button>
              <button className="flex-1 text-[#B9B9B9] hover:bg-white/5 text-[13px] font-medium py-1.5 rounded-full transition-colors">GIFs</button>
            </div>
            <div className="px-3 py-2">
              <div className="bg-[#1A1A1A] rounded-[6px] px-3 py-1.5 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#848484" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Search emoji" className="bg-transparent text-[13px] text-[#E9E9E9] focus:outline-none w-full placeholder:text-[#848484]" />
              </div>
            </div>
            <div className="px-3 pb-2 flex-1 overflow-y-auto h-[220px] scrollbar-thin">
              <h3 className="text-[#B9B9B9] text-[12px] font-semibold mb-2">Smileys & People</h3>
              <div className="grid grid-cols-8 gap-1 text-[22px]">
                {['😀','😃','😄','😁','😆','😅','😂','🤣','🥲','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🤩','🥳','😏','😒','😞'].map((emoji, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleEmojiClick(emoji)}
                    className="hover:bg-[#3B3B3B] rounded cursor-pointer transition-colors w-8 h-8 flex items-center justify-center"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-10 bg-[#2A2A2A] border-t border-[#3B3B3B] flex items-center px-4 gap-6 text-[#848484]">
              <button className="text-[#B9B9B9]">
                <Smile size={18} />
              </button>
              <button className="hover:text-[#B9B9B9] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12.5 2h-7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-9" />
                  <path d="M20 9l-7.5-7.5" />
                  <path d="M12.5 2v7.5H20" />
                </svg>
              </button>
              <button className="hover:text-[#B9B9B9] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input Bubble */}
      <div
        className="flex-1 flex items-end rounded-[20px] px-4 py-1.5 border border-transparent focus-within:border-[#3B3B3B] transition-colors"
        style={{ backgroundColor: '#2A2A2A' }}
      >
        <textarea
          value={text}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          placeholder="Message"
          className="flex-1 bg-transparent text-white py-[5px] max-h-32 min-h-[24px] resize-none focus:outline-none placeholder:text-white/45 scrollbar-thin"
          style={{
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '-0.006em'
          }}
          rows={1}
        />
      </div>

      {/* Right Actions (Outside) */}
      <div className="flex items-center gap-1 flex-shrink-0 mb-0.5 relative">
        {!text.trim() ? (
          <button
            className="p-1.5 transition-colors rounded-full hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.55)' }}
            title="Voice message"
          >
            <Mic size={22} strokeWidth={1.5} />
          </button>
        ) : (
          <button 
            onClick={handleSend}
            className="w-[36px] h-[36px] text-white rounded-full transition-colors flex items-center justify-center hover:opacity-90"
            style={{ backgroundColor: '#2C6BED' }}
          >
            <Send size={18} className="ml-0.5" />
          </button>
        )}

        <div className="relative" ref={attachmentMenuRef}>
          <button
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="p-1.5 transition-colors rounded-full hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.55)' }}
            title="Attach file"
          >
            <Plus size={22} strokeWidth={1.5} />
          </button>

          {/* Attachment Menu Popover */}
          {showAttachmentMenu && (
            <div className="absolute bottom-[50px] right-0 w-[220px] bg-[#2A2A2A] rounded-2xl shadow-2xl overflow-hidden z-50 border border-[#3B3B3B]">
              <button 
                onClick={() => handleAttachmentClick('image')}
                className="w-full text-left px-5 py-3.5 hover:bg-[#3B3B3B] flex items-center gap-4 text-[#E9E9E9] transition-colors"
              >
                <ImageIcon size={20} strokeWidth={1.5} /> 
                <span className="text-[15px]">Photos & videos</span>
              </button>
              <button 
                onClick={() => handleAttachmentClick('file')}
                className="w-full text-left px-5 py-3.5 hover:bg-[#3B3B3B] flex items-center gap-4 text-[#E9E9E9] transition-colors"
              >
                <FileIcon size={20} strokeWidth={1.5} /> 
                <span className="text-[15px]">File</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
