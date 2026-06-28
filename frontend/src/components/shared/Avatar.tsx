import React from 'react';

// Distinct avatar colors derived from name initial
const COLORS = [
  '#5C6BC0','#7E57C2','#EC407A','#42A5F5','#26A69A',
  '#66BB6A','#EF5350','#FFA726','#AB47BC','#26C6DA',
];

function getColor(name: string) {
  const code = (name?.charCodeAt(0) || 65) - 65;
  return COLORS[Math.abs(code) % COLORS.length];
}

interface AvatarProps {
  url?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  showOnlineDot?: boolean; // explicit opt-in
}

export default function Avatar({ url, name, size = 'md', isOnline, showOnlineDot = false }: AvatarProps) {
  const sizeClasses: Record<string, string> = {
    xs:  'w-7 h-7 text-[11px]',
    sm:  'w-9 h-9 text-sm',
    md:  'w-10 h-10 text-[15px]',
    lg:  'w-14 h-14 text-xl',
    xl:  'w-20 h-20 text-3xl',
  };

  const dotSizeClasses: Record<string, string> = {
    xs:  'w-2 h-2 border border-[#1C1C1F]',
    sm:  'w-2.5 h-2.5 border-2 border-[#1C1C1F]',
    md:  'w-3 h-3 border-2 border-[#1C1C1F]',
    lg:  'w-3.5 h-3.5 border-2 border-[#1C1C1F]',
    xl:  'w-4 h-4 border-2 border-[#1C1C1F]',
  };

  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const bgColor = getColor(name || '?');

  return (
    <div
      className={`relative flex-shrink-0 rounded-full text-white flex items-center justify-center overflow-hidden font-semibold select-none ${sizeClasses[size]}`}
      style={{ backgroundColor: url ? 'transparent' : bgColor }}
    >
      {url ? (
        <img src={url} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}

      {/* Online indicator dot — only shown when explicitly opted in */}
      {showOnlineDot && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ${dotSizeClasses[size]} ${
            isOnline ? 'bg-[#22c55e]' : 'bg-[#8696A0]'
          }`}
        />
      )}
    </div>
  );
}
