'use client';

import React from 'react';
import { Edit, RefreshCw, Trash2 } from 'lucide-react';
import Tag from './Tag';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { LayersData } from '@/types/global';

interface TagListProps {
  data: LayersData;
  isBusy: boolean;
  countTags: () => number;
  rgbToHex: (r: number, g: number, b: number) => string;
  deleteFolder: (name: string) => void;
  deleteLayer: (name: string) => void;
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
  updateTagColor,
  updateTagName,
}: TagListProps) {
  const sortedFolders = [...data.folders].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className='mt-4 pt-2 border *:border-border rounded-md pl-2 max-h-[412px] overflow-y-auto'>
      <div className=' '>
        {isBusy ? (
          <div className='flex justify-center items-center h-full text-muted-foreground'>
            <RefreshCw className='w-6 h-6 animate-spin mr-2' />
            Carregando...
          </div>
        ) : (
          <div className=''>
            <Accordion
              type='single'
              collapsible
              className='w-full space-y-2 pb-2'
            >
              {sortedFolders.map((folder, i) => (
                <AccordionItem
                  key={i}
                  value={`folder-${i}`}
                  className='overflow-hidden px-0 data-[state=open]:border-b-0'
                >
                  <AccordionTrigger
                    iconPosition='left'
                    className='hover:no-underline group data-[state=open]:rounded-bl-none data-[state=open]:rounded-br-none'
                  >
                    <div className='flex items-center justify-between w-full pr-2 '>
                      <div className='flex items-center gap-2 font-medium text-sm'>
                        <p className=' text-xs'>{folder.name}</p>
                      </div>
                      <div className='flex items-center justify-end gap-2 text-muted-foreground'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            //TODO: Implement edit folder method
                            //deleteFolder(folder.name);
                          }}
                          className='opacity-0 group-hover:opacity-100 transition-opacity'
                          title='Editar'
                        >
                          <Edit className='w-3 h-3' />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFolder(folder.name);
                          }}
                          className='opacity-0 group-hover:opacity-100 transition-opacity'
                          title='Excluir pasta'
                        >
                          <Trash2 className='w-3 h-3' />
                        </button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='p-0'>
                    <div
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
                onDelete={deleteLayer}
                onUpdateColor={updateTagColor}
                onUpdateName={updateTagName}
              />
            ))}

            {sortedFolders.length === 0 && data.tags.length === 0 && (
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
