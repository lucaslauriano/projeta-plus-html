'use client';

import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Edit, Trash2, Folder, Plus } from 'lucide-react';

export interface GroupItem {
  id: string;
  name: string;
}

export interface GroupWithSegments<T = GroupItem> extends GroupItem {
  segments: T[];
}

interface GroupAccordionProps<T> {
  groups: GroupWithSegments<T>[];
  onEditGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddSegment?: (groupId: string) => void;
  renderSegment: (segment: T, groupId: string) => React.ReactNode;
  emptyMessage?: string;
  iconPosition?: 'left' | 'right';
}

export function GroupAccordion<T extends { id: string }>({
  groups,
  onEditGroup,
  onDeleteGroup,
  onAddSegment,
  renderSegment,
  emptyMessage = 'Nenhum item neste grupo',
  iconPosition = 'left',
}: GroupAccordionProps<T>) {
  return (
    <Accordion type='single' collapsible className='w-full space-y-2'>
      {groups.map((group) => (
        <AccordionItem
          key={group.id}
          value={group.id}
          className='border rounded-[8px] overflow-hidden bg-muted/20 px-0'
        >
          <div className='relative group'>
            <AccordionTrigger
              iconPosition={iconPosition}
              className='hover:no-underline bg-muted/50 data-[state=open]:bg-muted/70 data-[state=open]:rounded-bl-none data-[state=open]:rounded-br-none w-full'
            >
              <div className='flex items-center gap-2 font-medium text-sm'>
                <Folder className='w-4 h-4 text-gray-500' />
                {group.name}
              </div>
            </AccordionTrigger>
            <div
              className={`absolute ${
                iconPosition === 'left' ? 'left-12' : 'right-12'
              } top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground pointer-events-none z-10`}
            >
              {onAddSegment && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSegment(group.id);
                  }}
                  className='opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto hover:text-foreground'
                  title='Criar segmento'
                  role='button'
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      onAddSegment(group.id);
                    }
                  }}
                >
                  <Plus className='w-4 h-4' />
                </span>
              )}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onEditGroup(group.id);
                }}
                className='opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto hover:text-foreground'
                title='Editar'
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onEditGroup(group.id);
                  }
                }}
              >
                <Edit className='w-4 h-4' />
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGroup(group.id);
                }}
                className='opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto hover:text-destructive'
                title='Excluir pasta'
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onDeleteGroup(group.id);
                  }
                }}
              >
                <Trash2 className='w-4 h-4' />
              </span>
            </div>
          </div>
          <AccordionContent className='p-4'>
            <div className='space-y-3'>
              {(group.segments || []).length > 0 ? (
                <div className='space-y-2'>
                  {(group.segments || []).map((segment) =>
                    renderSegment(segment, group.id)
                  )}
                </div>
              ) : (
                <div className='text-center py-4 text-sm text-muted-foreground italic'>
                  {emptyMessage}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
