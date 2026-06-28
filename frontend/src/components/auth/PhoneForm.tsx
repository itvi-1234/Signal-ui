import React, { useState } from 'react';

export default function PhoneForm({ onSubmit, loading }: { onSubmit: (phone: string, username: string, isLogin: boolean) => void, loading: boolean }) {
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-signal-sidebar-dark p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(phone, username, isLogin); }} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm text-signal-text-secondary mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required={!isLogin} className="w-full bg-signal-surface-dark text-white rounded p-3" />
          </div>
        )}
        <div>
          <label className="block text-sm text-signal-text-secondary mb-1">{isLogin ? 'Phone or Username' : 'Phone Number'}</label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-signal-surface-dark text-white rounded p-3" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-signal-blue text-white rounded py-3">{loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}</button>
      </form>
      <div className="mt-4 text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-signal-text-secondary hover:text-white text-sm">
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
