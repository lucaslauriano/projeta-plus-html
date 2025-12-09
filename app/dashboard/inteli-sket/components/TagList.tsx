'use client';

import React from 'react';
import { Folder, RefreshCw, X } from 'lucide-react';
import Tag from './Tag';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { LayersData } from '@/types/global';

interface TagListProps {
  data: LayersData;
  isBusy: boolean;
  countTags: () => number;
  rgbToHex: (r: number, g: number, b: number) => string;
  deleteFolder: (name: string) => Promise<void>;
  deleteLayer: (name: string) => Promise<void>;
  toggleVisibility: (name: string, visible: boolean) => Promise<void>;
  updateTagColor?: (name: string, color: string) => Promise<void>;
  updateTagName?: (oldName: string, newName: string) => Promise<void>;
}

export default function TagList({
  data,
  isBusy,
  rgbToHex,
  deleteFolder,
  deleteLayer,
  toggleVisibility,
  updateTagColor,
  updateTagName,
}: TagListProps) {
  return (
    <div className='space-y-4'>
      <div className='max-h-[450px] overflow-y-auto'>
        {isBusy ? (
          <div className='flex justify-center items-center h-full text-muted-foreground'>
            <RefreshCw className='w-6 h-6 animate-spin mr-2' />
            Carregando...
          </div>
        ) : (
          <div className='space-y-2 pb-2 '>
            <Accordion
              type='single'
              collapsible
              className='w-full space-y-2 pb-2'
            >
              {data.folders.map((folder, i) => (
                <AccordionItem
                  key={i}
                  value={`folder-${i}`}
                  className='border rounded-xl overflow-hidden bg-muted/20 px-0 data-[state=open]:border-b-0'
                >
                  <AccordionTrigger className='px-3 py-3 hover:no-underline bg-muted/50 data-[state=open]:bg-gray-500/20 group'>
                    <div className='flex items-center justify-between w-full pr-2'>
                      <div className='flex items-center gap-2 font-medium text-sm'>
                        <Folder className='w-4 h-4 text-gray-500' />
                        {folder.name}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFolder(folder.name);
                        }}
                        className='opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity'
                        title='Excluir pasta'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='p-0'>
                    <div
                      className='p-2 space-y-1'
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {folder.tags.map((tag, j) => (
                        <Tag
                          key={j}
                          name={tag.name}
                          color={tag.color}
                          visible={tag.visible}
                          rgbToHex={rgbToHex}
                          onToggleVisibility={toggleVisibility}
                          onDelete={deleteLayer}
                          onUpdateColor={updateTagColor}
                          onUpdateName={updateTagName}
                        />
                      ))}
                      {folder.tags.length === 0 && (
                        <div className='text-xs text-muted-foreground px-2 italic py-2'>
                          Vazio
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {data.tags.map((tag, i) => (
              <Tag
                key={i}
                name={tag.name}
                color={tag.color}
                visible={tag.visible}
                rgbToHex={rgbToHex}
                onToggleVisibility={toggleVisibility}
                onDelete={deleteLayer}
                onUpdateColor={updateTagColor}
                onUpdateName={updateTagName}
              />
            ))}

            {data.folders.length === 0 && data.tags.length === 0 && (
              <div className='text-center text-muted-foreground py-8'>
                Nenhuma tag encontrada
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
