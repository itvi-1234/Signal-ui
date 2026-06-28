import React, { useState } from 'react';

export default function ProfileSetup({ onSubmit, loading, initialName = '', initialBio = '' }: { onSubmit: (name: string, bio: string) => void, loading: boolean, initialName?: string, initialBio?: string }) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);

  return (
    <div className="bg-signal-sidebar-dark p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile Setup</h1>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(name, bio); }} className="space-y-4">
        <div>
          <label className="block text-sm text-signal-text-secondary mb-1">Display Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-signal-surface-dark text-white rounded p-3" />
        </div>
        <div>
          <label className="block text-sm text-signal-text-secondary mb-1">Bio</label>
          <input type="text" value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-signal-surface-dark text-white rounded p-3" />
        </div>
        <button type="submit" disabled={loading || !name} className="w-full bg-signal-blue text-white rounded py-3">Save</button>
      </form>
    </div>
  );
}
