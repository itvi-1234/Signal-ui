"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/me', {
        display_name: displayName,
        bio
      });
      setUser(res.data);
      toast.success('Profile updated');
      router.push('/chat');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-signal-bg-dark h-full">
      <div className="bg-signal-sidebar-dark p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Set up your profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-signal-text-secondary mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-signal-surface-dark text-white rounded p-3 focus:outline-none focus:ring-1 focus:ring-signal-blue"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-signal-text-secondary mb-1">Bio (Optional)</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-signal-surface-dark text-white rounded p-3 focus:outline-none focus:ring-1 focus:ring-signal-blue"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !displayName}
            className="w-full bg-signal-blue text-white rounded py-3 font-medium hover:bg-opacity-90 disabled:opacity-50 transition"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}
