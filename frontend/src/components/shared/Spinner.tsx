import React from 'react';

export default function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex justify-center items-center">
      <div 
        className="animate-spin rounded-full border-t-2 border-b-2 border-signal-blue"
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
}
