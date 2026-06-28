"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        user_id: userId,
        otp
      });
      const { access_token, refresh_token, user } = res.data;
      const { useAuthStore } = await import('@/store/authStore');
      useAuthStore.getState().setToken(access_token);
      useAuthStore.getState().setUser(user);
      
      toast.success('Verified successfully');
      router.push('/auth/profile');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-signal-sidebar-dark p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-2 text-center">Verification</h1>
      <p className="text-signal-text-secondary text-sm text-center mb-6">Enter the mock OTP (123456)</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full bg-signal-surface-dark text-white rounded p-3 text-center tracking-widest text-xl focus:outline-none focus:ring-1 focus:ring-signal-blue"
            required
            maxLength={6}
            placeholder="------"
          />
        </div>
        <button
          type="submit"
          disabled={loading || otp.length < 6}
          className="w-full bg-signal-blue text-white rounded py-3 font-medium hover:bg-opacity-90 disabled:opacity-50 transition"
        >
          Verify
        </button>
      </form>
    </div>
  );
}

export default function OtpPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-signal-bg-dark h-full">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <OtpContent />
      </Suspense>
    </div>
  );
}
