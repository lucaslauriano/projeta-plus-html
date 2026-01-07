'use client';

import React from 'react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ViewConfigMenuProps {
  menuItems?: Array<{ label: string; action: () => void; hasDivider: boolean }>;
}

export function ViewConfigMenu({ menuItems = [] }: ViewConfigMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='p-1 hover:bg-accent rounded-md transition-colors'>
          <MoreVertical className='w-4 h-4 text-muted-foreground' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <DropdownMenuItem className='cursor-pointer' onClick={item.action}>
              {item.label}
            </DropdownMenuItem>
            {item.hasDivider && (
              <hr className='my-1 border-muted-foreground/20' />
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
