import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <div className="p-3 border-b border-signal-divider flex-shrink-0">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-2.5 text-signal-text-secondary" />
        <input
          type="text"
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-signal-surface-dark text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-signal-blue text-sm"
        />
      </div>
    </div>
  );
}
