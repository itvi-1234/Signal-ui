import React from 'react';

export default function TypingIndicator({ isTyping, name }: { isTyping: boolean, name?: string }) {
  if (!isTyping) return null;
  return (
    <div className="text-xs text-signal-text-secondary ml-2 italic">
      {name ? `${name} is typing...` : 'Typing...'}
    </div>
  );
}
