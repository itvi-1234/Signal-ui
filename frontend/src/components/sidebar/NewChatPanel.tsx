import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Avatar from '../shared/Avatar';
import { ChevronLeft, Users, AtSign, Hash, Search, Check, ArrowRight } from 'lucide-react';
import { User } from '@/types';
import toast from 'react-hot-toast';

export default function NewChatPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<User[]>([]);
  
  // 'initial' | 'select_members' | 'name_group'
  const [mode, setMode] = useState<'initial' | 'select_members' | 'name_group'>('initial');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/users/search?q=').then(res => setContacts(res.data)).catch(console.error);
  }, []);

  const handleStartChat = async (userId: string) => {
    try {
      const convRes = await api.post('/conversations/direct', { user_id: userId });
      onClose();
      router.push(`/chat/${convRes.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'An error occurred');
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedIds.size === 0) return;
    setLoading(true);
    try {
      const res = await api.post('/groups', {
        name: groupName,
        member_ids: Array.from(selectedIds)
      });
      onClose();
      router.push(`/chat/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const filtered = contacts.filter(c => c.display_name.toLowerCase().includes(search.toLowerCase()) || c.username?.toLowerCase().includes(search.toLowerCase()));

  if (mode === 'name_group') {
    return (
      <div className="absolute inset-0 z-30 flex flex-col" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="h-[60px] flex items-center px-4 flex-shrink-0 relative">
          <button onClick={() => setMode('select_members')} className="absolute left-4 text-[#C6C6C6] hover:text-[#E9E9E9] transition-colors">
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <h1 className="flex-1 text-center text-[15px] font-bold text-[#E9E9E9]">Name this group</h1>
        </div>
        <div className="p-4 flex flex-col items-center flex-1 overflow-y-auto scrollbar-thin pb-20">
          <div className="relative w-24 h-24 bg-[#DCE0FF] rounded-full flex items-center justify-center mb-8">
            <Users size={48} className="text-[#3B45FD]" />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
          </div>
          
          <div className="w-full px-2">
            <input
              type="text"
              placeholder="Group name (required)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-transparent text-[#E9E9E9] text-[15px] p-3 focus:outline-none border border-[#5E5E5E] focus:border-[#2C6BED] rounded-[6px] transition-colors mb-6 placeholder:text-[#848484]"
              autoFocus
            />
            
            <div className="flex items-center justify-between mb-8">
              <span className="text-[#E9E9E9] text-[14px]">Disappearing messages</span>
              <button className="bg-[#343434] hover:bg-[#3B3B3B] px-3 py-1.5 rounded-full flex items-center text-[#E9E9E9] text-[13px] transition-colors">
                Off <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1"><path d="m6 9 6 6 6-6"/></svg>
              </button>
            </div>

            <h2 className="text-[14px] font-bold text-[#E9E9E9] mb-4">Members</h2>
            <div className="flex flex-col gap-1">
              {Array.from(selectedIds).map(id => {
                const user = contacts.find(c => c.id === id);
                if (!user) return null;
                return (
                  <div key={id} className="flex items-center py-2">
                    <Avatar name={user.display_name} url={user.avatar_url} size="sm" />
                    <span className="text-[14px] text-[#E9E9E9] ml-4 flex items-center gap-1.5">
                      {user.display_name}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#848484]">
                        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
                      </svg>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating action button */}
        <div className="absolute bottom-6 right-6 z-40 bg-[#1A1A1A]">
          <button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || loading}
            className="bg-[#2C6BED] hover:bg-[#1851B4] disabled:bg-[#3B3B3B] disabled:text-[#848484] text-white px-6 py-2.5 rounded-[8px] font-semibold text-[14px] shadow-lg transition-colors"
          >
            {loading ? '...' : 'Create'}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'select_members') {
    return (
      <div className="absolute inset-0 z-30 flex flex-col" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="h-[60px] flex items-center px-4 flex-shrink-0 relative">
          <button onClick={() => { setMode('initial'); setSelectedIds(new Set()); }} className="absolute left-4 text-[#C6C6C6] hover:text-[#E9E9E9] transition-colors">
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <h1 className="flex-1 text-center text-[15px] font-bold text-[#E9E9E9]">Choose members</h1>
        </div>
        
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-[#B9B9B9]" strokeWidth={2} />
            <input
              type="text"
              placeholder="Name, username, or number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#3B3B3B] text-[#E9E9E9] text-[14px] rounded-[6px] pl-9 pr-3 py-[7px] focus:outline-none placeholder:text-[#848484]"
            />
          </div>
        </div>

        {selectedIds.size > 0 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2 flex-shrink-0 border-b border-[#2A2A2A]">
            {Array.from(selectedIds).map(id => {
              const user = contacts.find(c => c.id === id);
              if (!user) return null;
              return (
                <div key={id} className="flex items-center bg-[#3B3B3B] rounded-full pl-1 pr-2 py-1">
                  <Avatar name={user.display_name} url={user.avatar_url} size="xs" />
                  <span className="text-[13px] text-[#E9E9E9] ml-2 mr-2">{user.display_name.split(' ')[0]}</span>
                  <button onClick={() => toggleSelection(id)} className="text-[#B9B9B9] hover:text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
        


        <div className="flex-1 overflow-y-auto scrollbar-thin mt-2 pb-20 relative">
          <h2 className="px-4 text-[14px] font-bold text-[#E9E9E9] mb-3">Contacts</h2>
          {filtered.map(contact => (
            <div
              key={contact.id}
              onClick={() => toggleSelection(contact.id)}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-[#2A2A2A] transition-colors"
            >
              <Avatar name={contact.display_name} url={contact.avatar_url} size="sm" />
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-[14px] text-[#E9E9E9] truncate">{contact.display_name}</p>
              </div>
              <div className="flex-shrink-0 ml-3">
                {selectedIds.has(contact.id) ? (
                  <div className="w-5 h-5 rounded-full bg-[#2C6BED] flex items-center justify-center">
                    <Check size={14} strokeWidth={3} className="text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-[1.5px] border-[#5E5E5E]" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating action button */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={() => setMode('name_group')}
            className="bg-[#2C6BED] hover:bg-[#1851B4] text-white px-5 py-2.5 rounded-[8px] font-semibold text-[14px] shadow-lg transition-colors"
          >
            {selectedIds.size > 0 ? 'Next' : 'Skip'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Header */}
      <div className="h-[60px] flex items-center px-4 flex-shrink-0 relative">
        <button onClick={onClose} className="absolute left-4 text-[#C6C6C6] hover:text-[#E9E9E9] transition-colors">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <h1 className="flex-1 text-center text-[15px] font-bold text-[#E9E9E9]">New chat</h1>
      </div>

      {/* Search */}
      <div className="px-4 pb-3 flex-shrink-0">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3 text-[#B9B9B9]" strokeWidth={2} />
          <input
            type="text"
            placeholder="Name, username, or number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#3B3B3B] text-[#E9E9E9] text-[14px] rounded-[6px] pl-9 pr-3 py-[7px] focus:outline-none placeholder:text-[#848484]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Actions */}
        <div className="py-2">
          <button onClick={() => setMode('select_members')} className="w-full flex items-center px-4 py-3 hover:bg-[#2A2A2A] transition-colors">
            <div className="w-[38px] h-[38px] rounded-full bg-[#343434] flex items-center justify-center text-[#E9E9E9] mr-4 flex-shrink-0">
              <Users size={18} strokeWidth={2} />
            </div>
            <span className="text-[14px] text-[#E9E9E9]">New group</span>
          </button>
          <button className="w-full flex items-center px-4 py-3 hover:bg-[#2A2A2A] transition-colors">
            <div className="w-[38px] h-[38px] rounded-full bg-[#343434] flex items-center justify-center text-[#E9E9E9] mr-4 flex-shrink-0">
              <AtSign size={18} strokeWidth={2} />
            </div>
            <span className="text-[14px] text-[#E9E9E9]">Find by username</span>
          </button>
          <button className="w-full flex items-center px-4 py-3 hover:bg-[#2A2A2A] transition-colors">
            <div className="w-[38px] h-[38px] rounded-full bg-[#343434] flex items-center justify-center text-[#E9E9E9] mr-4 flex-shrink-0">
              <Hash size={18} strokeWidth={2} />
            </div>
            <span className="text-[14px] text-[#E9E9E9]">Find by phone number</span>
          </button>
        </div>

        {/* Contacts */}
        {filtered.length > 0 && (
          <div className="mt-2 pb-4">
            <h2 className="px-4 text-[14px] font-bold text-[#E9E9E9] mb-3">Contacts</h2>
            {filtered.map(contact => (
              <div
                key={contact.id}
                onClick={() => handleStartChat(contact.id)}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-[#2A2A2A] transition-colors"
              >
                <Avatar name={contact.display_name} url={contact.avatar_url} size="sm" />
                <div className="ml-4 flex-1 min-w-0 flex items-center">
                  <p className="text-[14px] text-[#E9E9E9] truncate flex items-center gap-1.5">
                    {contact.display_name}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#848484]">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
                    </svg>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
