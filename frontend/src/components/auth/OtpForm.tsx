import React, { useState } from 'react';

export default function OtpForm({ onSubmit, loading }: { onSubmit: (otp: string) => void, loading: boolean }) {
  const [otp, setOtp] = useState('');

  return (
    <div className="bg-signal-sidebar-dark p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-2 text-center">Verification</h1>
      <p className="text-signal-text-secondary text-sm text-center mb-6">Enter the mock OTP (123456)</p>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(otp); }} className="space-y-4">
        <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} placeholder="------" className="w-full bg-signal-surface-dark text-white rounded p-3 text-center tracking-widest text-xl" />
        <button type="submit" disabled={loading || otp.length < 6} className="w-full bg-signal-blue text-white rounded py-3">Verify</button>
      </form>
    </div>
  );
}
