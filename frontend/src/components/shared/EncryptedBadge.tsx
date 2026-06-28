import React from 'react';
import { Lock } from 'lucide-react';

export default function EncryptedBadge() {
  return (
    <div className="flex items-center justify-center space-x-1 text-signal-text-secondary text-xs my-4">
      <Lock size={12} />
      <span>Messages and calls are end-to-end encrypted.</span>
    </div>
  );
}
