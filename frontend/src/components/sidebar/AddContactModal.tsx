"use client";
import React, { useState } from 'react';
import { X, UserPlus, Search } from 'lucide-react';
import { api } from '@/lib/api';
import Avatar from '../shared/Avatar';
import { User } from '@/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AddContactModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (userId: string) => {
    try {
      const res = await api.post('/conversations/direct', { user_id: userId });
      onClose();
      router.push(`/chat/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Could not start chat');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={onClose}>
      <div
        className="bg-[#1C1C1F] rounded-2xl shadow-2xl w-full max-w-sm border border-[#2A2A2E] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2E]">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-[#3A76F0]" />
            <h2 className="text-white font-semibold text-[15px]">Add Contact</h2>
          </div>
          <button onClick={onClose} className="text-[#8696A0] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search form */}
        <div className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8696A0]" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Username or phone number"
                className="w-full bg-[#111115] text-white text-[13.5px] rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3A76F0] border border-[#2A2A2E] focus:border-transparent transition-all placeholder:text-[#4A5568]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#3A76F0] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-[#3A76F0]/90 disabled:opacity-50 transition-all"
            >
              {loading ? '...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="max-h-60 overflow-y-auto pb-3">
          {searched && results.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[#8696A0] text-sm">No users found</p>
              <p className="text-[#4A5568] text-xs mt-1">Try searching by username or phone</p>
            </div>
          )}
          {results.map(u => (
            <div
              key={u.id}
              onClick={() => handleStartChat(u.id)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#232326] cursor-pointer transition-colors"
            >
              <Avatar name={u.display_name} url={u.avatar_url} size="sm" isOnline={u.is_online} showOnlineDot />
              <div className="flex-1 min-w-0">
                <p className="text-white text-[14px] font-medium truncate">{u.display_name}</p>
                <p className="text-[#8696A0] text-[12px] truncate">@{u.username || u.phone_number}</p>
              </div>
              <button className="text-[#3A76F0] text-[13px] font-medium hover:text-white transition-colors flex-shrink-0">
                Message
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
