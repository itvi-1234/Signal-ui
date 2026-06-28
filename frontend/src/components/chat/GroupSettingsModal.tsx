import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserMinus, Shield } from 'lucide-react';
import Avatar from '../shared/Avatar';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function GroupSettingsModal({ conversationId, onClose }: { conversationId: string, onClose: () => void }) {
  const { user } = useAuthStore();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroup();
  }, [conversationId]);

  const fetchGroup = async () => {
    try {
      const res = await api.get(`/groups/${conversationId}`);
      setGroup(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await api.delete(`/groups/${conversationId}/remove/${userId}`);
      toast.success('Member removed');
      fetchGroup();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error removing member');
    }
  };

  if (loading) return null;
  if (!group) return null;

  const isAdmin = group.participants.find((p: any) => p.user_id === user?.id)?.is_admin;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-signal-sidebar-dark rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-signal-divider">
          <h2 className="text-lg font-semibold text-white">Group Settings</h2>
          <button onClick={onClose} className="text-signal-text-secondary hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col items-center mb-6">
            <Avatar name={group.name} size="xl" />
            <h3 className="text-xl font-semibold text-white mt-3">{group.name}</h3>
            <p className="text-signal-text-secondary text-sm">{group.participants.length} members</p>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-signal-text-secondary text-sm font-medium uppercase tracking-wide">Members</h4>
            </div>
            <div className="bg-signal-surface-dark rounded-lg overflow-hidden">
              {group.participants.map((p: any) => (
                <div key={p.user_id} className="flex items-center justify-between p-3 border-b border-signal-divider last:border-0 hover:bg-signal-hover transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar name={p.display_name} size="sm" />
                    <div>
                      <p className="text-white text-sm font-medium flex items-center">
                        {p.display_name} {p.user_id === user?.id && <span className="text-signal-text-secondary ml-1">(You)</span>}
                      </p>
                      {p.is_admin && (
                        <p className="text-signal-blue text-xs flex items-center mt-0.5">
                          <Shield size={12} className="mr-1" /> Admin
                        </p>
                      )}
                    </div>
                  </div>
                  {isAdmin && p.user_id !== user?.id && (
                    <button 
                      onClick={() => handleRemoveMember(p.user_id)}
                      className="text-signal-text-secondary hover:text-red-500 transition-colors"
                      title="Remove member"
                    >
                      <UserMinus size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
