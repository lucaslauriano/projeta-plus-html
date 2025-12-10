'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Edit, Trash2, X } from 'lucide-react';

interface TagProps {
  name: string;
  color: number[];
  visible: boolean;
  rgbToHex: (r: number, g: number, b: number) => string;
  onToggleVisibility: (name: string, visible: boolean) => Promise<void>;
  onDelete: (name: string) => Promise<void>;
  onUpdateColor?: (name: string, color: string) => Promise<void>;
  onUpdateName?: (oldName: string, newName: string) => Promise<void>;
}

export default function Tag({
  name,
  color,
  rgbToHex,
  onDelete,
  onUpdateColor,
  onUpdateName,
}: TagProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentColor = rgbToHex(color[0], color[1], color[2]);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (onUpdateColor) {
      await onUpdateColor(name, newColor);
    }
  };

  const handleNameDoubleClick = () => {
    if (onUpdateName) {
      setEditedName(name);
      setIsEditingName(true);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameBlur = async () => {
    const trimmedName = editedName.trim();
    if (trimmedName && trimmedName !== name && onUpdateName) {
      await onUpdateName(name, trimmedName);
    } else {
      setEditedName(name);
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setEditedName(name);
      setIsEditingName(false);
    }
  };

  return (
    <div
      className='flex items-center gap-2 p-2 rounded-lg hover:bg-accent/20 text-sm group border border-border/50'
      onClick={(e) => e.stopPropagation()}
    >
      {/* Color picker - sempre visível */}
      <input
        type='color'
        value={currentColor}
        onChange={handleColorChange}
        disabled={!onUpdateColor}
        className='w-5 h-5 rounded cursor-pointer border border-border disabled:cursor-not-allowed '
        style={{ padding: 0, border: 'none', borderRadius: '0.375rem' }}
        title='Editar cor'
      />

      {/* Nome editável ao duplo clique */}
      {isEditingName ? (
        <input
          ref={inputRef}
          type='text'
          value={editedName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          onKeyDown={handleNameKeyDown}
          className='flex-1 px-2 py-1 text-sm border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50'
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className='flex-1 cursor-text text-sm'
          onDoubleClick={handleNameDoubleClick}
          title='Duplo clique para editar'
        >
          {name}
        </span>
      )}
      <div className='flex  items-center justify-end gap-2'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNameDoubleClick();
          }}
          className='opacity-0 group-hover:opacity-100 transition-opacity'
        >
          <Edit className='w-4 h-4' />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(name);
          }}
          className='opacity-0 group-hover:opacity-100 transition-opacity'
        >
          <Trash2 className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}
