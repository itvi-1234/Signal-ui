import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

export default function NewChatModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const searchRes = await api.get(`/users/search?q=${phone}`);
      const users = searchRes.data;
      
      if (users.length === 0) {
        toast.error('User not found');
        setLoading(false);
        return;
      }
      
      const convRes = await api.post('/conversations/direct', {
        user_id: users[0].id
      });
      
      onClose();
      router.push(`/chat/${convRes.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-signal-sidebar-dark rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">New Chat</h2>
          <button onClick={onClose} className="text-signal-text-secondary hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-signal-text-secondary mb-1">Phone Number or Username</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-signal-surface-dark text-white rounded p-3 focus:outline-none focus:ring-1 focus:ring-signal-blue"
              placeholder="Enter username..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-signal-blue text-white rounded py-3 font-medium hover:bg-opacity-90 disabled:opacity-50 transition"
          >
            {loading ? 'Starting...' : 'Start Chat'}
          </button>
        </form>
      </div>
    </div>
  );
}
