"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import ConversationItem from './ConversationItem';
import NewChatPanel from './NewChatPanel';
import AddContactModal from './AddContactModal';
import { Edit, MoreHorizontal, Archive, FolderPlus, Bell, Settings, UserPlus } from 'lucide-react';

export default function Sidebar() {
  const { conversations, setConversations } = useChatStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ——— Resizing ———
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  // ——— Fetch conversations ———
  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/conversations');
      // Sort by last_message_at descending
      const sorted = [...res.data].sort((a, b) => {
        const ta = a.last_message_at ? new Date(a.last_message_at).getTime() : new Date(a.created_at).getTime();
        const tb = b.last_message_at ? new Date(b.last_message_at).getTime() : new Date(b.created_at).getTime();
        return tb - ta;
      });
      setConversations(sorted);
    } catch (err) {
      console.error(err);
    }
  }, [setConversations]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ——— Close dropdown on outside click ———
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ——— Resize handlers ———
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !sidebarRef.current) return;
      const left = sidebarRef.current.getBoundingClientRect().left;
      let w = e.clientX - left;
      w = Math.min(Math.max(w, 220), 600);
      setSidebarWidth(w);
    };
    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // ——— Filter conversations by search ———
  const filtered = conversations.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    if (c.type === 'group' && c.name?.toLowerCase().includes(q)) return true;
    const other = c.participants.find(p => p.user_id !== user?.id);
    if (other?.user.display_name.toLowerCase().includes(q)) return true;
    if (other?.user.username?.toLowerCase().includes(q)) return true;
    const lastMsg = c.last_message?.content?.toLowerCase() || '';
    if (lastMsg.includes(q)) return true;
    return false;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  return (
    <>
      <div
        ref={sidebarRef}
        className="flex-shrink-0 flex flex-col h-full relative overflow-hidden"
        style={{ 
          width: `${sidebarWidth}px`,
          backgroundColor: '#2E2E2E', // $color-gray-80
          borderRight: '1px solid rgba(255,255,255,0.08)' 
        }}
      >
        {/* ——— Header ——— */}
        <div className="h-[52px] flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-semibold text-white">Chats</h1>
            {totalUnread > 0 && (
              <span className="text-white text-[10px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center leading-none" style={{ backgroundColor: '#2C6BED' }}>
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5" style={{ color: 'rgba(255,255,255,0.4)' }} ref={dropdownRef}>
            {/* New Chat */}
            <button
              onClick={() => setShowNewChat(true)}
              title="New chat"
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10 active:bg-white/5 text-white/45 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/>
              </svg>
            </button>

            {/* More menu */}
            <button
              onClick={() => setShowDropdown(v => !v)}
              title="More"
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10 active:bg-white/5 ${
                showDropdown ? 'text-white bg-white/10' : 'text-white/45 hover:text-white'
              }`}
            >
              <MoreHorizontal size={20} strokeWidth={2} />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-3 top-12 w-56 rounded-xl shadow-2xl py-1.5 z-50" style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 56px 0 rgba(0,0,0,0.4)' }}>
                <button
                  onClick={() => { setShowDropdown(false); setShowAddContact(true); }}
                  className="w-full flex items-center px-4 py-2.5 text-white text-[13px] transition-colors gap-3 hover:bg-white/5"
                >
                  <UserPlus size={15} style={{ color: 'rgba(255,255,255,0.45)' }} /> Add contact
                </button>
                <button className="w-full flex items-center px-4 py-2.5 text-white text-[13px] transition-colors gap-3 hover:bg-white/5">
                  <Archive size={15} style={{ color: 'rgba(255,255,255,0.45)' }} /> View Archive
                </button>
                <button className="w-full flex items-center px-4 py-2.5 text-white text-[13px] transition-colors gap-3 hover:bg-white/5">
                  <FolderPlus size={15} style={{ color: 'rgba(255,255,255,0.45)' }} /> Add chat folder
                </button>
                <button className="w-full flex items-center px-4 py-2.5 text-white text-[13px] transition-colors gap-3 hover:bg-white/5">
                  <Bell size={15} style={{ color: 'rgba(255,255,255,0.45)' }} /> Notification profile
                </button>
                <div className="h-px my-1 mx-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
                <button
                  onClick={() => { setShowDropdown(false); router.push('/settings'); }}
                  className="w-full flex items-center px-4 py-2.5 text-white text-[13px] transition-colors gap-3 hover:bg-white/5"
                >
                  <Settings size={15} style={{ color: 'rgba(255,255,255,0.45)' }} /> Settings
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ——— Search ——— */}
        <div className="px-3 pb-2 flex-shrink-0 flex items-center gap-2">
          <div className="flex-1 flex items-center rounded-[8px] px-2.5 gap-2" style={{ backgroundColor: '#1A1A1A' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-white text-signal-body-md py-[5.5px] focus:outline-none min-w-0 placeholder:text-white/45" style={{ fontSize: '13px' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[#8696A0] hover:text-white transition-colors flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
          <button className="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/10 active:bg-white/5 hover:text-white" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="10" y1="18" x2="14" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ——— Conversation List ——— */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 pb-20">
              {search ? (
                <>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-30">
                    <circle cx="11" cy="11" r="8" stroke="#8696A0" strokeWidth="1.5"/>
                    <path d="m21 21-4.35-4.35" stroke="#8696A0" strokeWidth="1.5"/>
                  </svg>
                  <p className="text-[#8696A0] text-sm font-medium">No results for &quot;{search}&quot;</p>
                  <p className="text-[#4A5568] text-xs mt-1">Try searching by name or message</p>
                </>
              ) : (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-20">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#8696A0"/>
                  </svg>
                  <p className="text-[#8696A0] text-sm font-medium">No chats yet</p>
                  <p className="text-[#4A5568] text-xs mt-1">Start a new chat with the ✏️ button above</p>
                </>
              )}
            </div>
          ) : (
            <div>
              {/* Search results label */}
              {search && (
                <p className="px-4 py-1.5 text-[11px] font-semibold text-[#8696A0] uppercase tracking-wider">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </p>
              )}
              {filtered.map(conv => (
                <ConversationItem key={conv.id} conversation={conv} />
              ))}
            </div>
          )}
        </div>

        {/* ——— New Chat Slide-out Panel ——— */}
        <div
          className={`absolute inset-0 transition-transform duration-200 ease-in-out z-40 ${
            showNewChat ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <NewChatPanel onClose={() => setShowNewChat(false)} />
        </div>

        {/* ——— Resize Handle ——— */}
        <div
          onMouseDown={handleMouseDown}
          title="Drag to resize"
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize z-50 transition-colors" style={{ }}
        />
      </div>

      {/* ——— Add Contact Modal (outside sidebar to escape overflow:hidden) ——— */}
      {showAddContact && <AddContactModal onClose={() => setShowAddContact(false)} />}
    </>
  );
}
