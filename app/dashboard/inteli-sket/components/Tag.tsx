'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface TagProps {
  name: string;
  color: number[];
  visible: boolean;
  rgbToHex: (r: number, g: number, b: number) => string;
  onToggleVisibility: (name: string, visible: boolean) => Promise<void>;
  onDelete: (name: string) => Promise<void>;
}

export default function Tag({
  name,
  color,
  visible,
  rgbToHex,
  onToggleVisibility,
  onDelete,
}: TagProps) {
  return (
    <div
      className='flex items-center gap-2 p-2 rounded hover:bg-accent/20 text-sm group border border-border/50'
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        checked={visible}
        onCheckedChange={(checked) => onToggleVisibility(name, !!checked)}
        className='h-4 w-4'
        onClick={(e) => e.stopPropagation()}
      />
      <div
        className='w-3 h-3 rounded-full border border-white/20'
        style={{
          backgroundColor: rgbToHex(color[0], color[1], color[2]),
        }}
      />
      <span className='flex-1'>{name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(name);
        }}
        className='opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity'
      >
        <X className='w-4 h-4' />
      </button>
    </div>
  );
}
