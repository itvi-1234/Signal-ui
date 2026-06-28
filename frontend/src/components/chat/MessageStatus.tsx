import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

export default function MessageStatus({ status }: { status: 'sent' | 'delivered' | 'read' }) {
  if (status === 'read') return <CheckCheck size={14} className="text-signal-tick-blue ml-1" />;
  if (status === 'delivered') return <CheckCheck size={14} className="text-signal-text-secondary ml-1" />;
  return <Check size={14} className="text-signal-text-secondary ml-1" />;
}
