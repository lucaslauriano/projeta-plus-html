'use client';

import React, { useState } from 'react';
import {
  Folder,
  Tag,
  Trash2,
  Download,
  Upload,
  Save,
  FileJson,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLayers } from '@/hooks/useLayers';
import TagList from './TagList';

export default function LayersComponent() {
  const {
    data,
    isBusy,
    countTags,
    rgbToHex,
    loadLayers,
    addFolder,
    addTag,
    deleteFolder,
    deleteLayer,
    toggleVisibility,
    saveToJson,
    loadFromJson,
    loadDefaultTags,
    importToModel,
    clearAll,
  } = useLayers();

  const [newFolderName, setNewFolderName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#ffffff');
  const [selectedFolder, setSelectedFolder] = useState<string>('root');

  const handleAddFolder = async () => {
    if (await addFolder(newFolderName)) {
      setNewFolderName('');
    }
  };

  const handleAddTag = async () => {
    if (await addTag(newTagName, newTagColor, selectedFolder)) {
      setNewTagName('');
    }
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold flex items-center gap-2'>
          <Tag className='w-4 h-4' />
          Gerenciador de Tags
        </h2>
        <Badge variant='secondary'>{countTags()} tags</Badge>
      </div>

      <div className='space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50'>
        <div className='space-y-1'>
          <h3 className='text-sm font-semibold text-foreground'>
            Adicionar Pasta
          </h3>
          <p className='text-xs text-muted-foreground'>
            Organize suas tags em pastas
          </p>
        </div>

        <div className='flex flex-col gap-0 items-start'>
          <div className='w-full'>
            <Input
              type='text'
              label='Nome da Pasta'
              placeholder='Ex: Estrutura'
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </div>
          <div className='w-full justify-center items-center flex pt-4'>
            <Button variant='default' size='lg' onClick={handleAddFolder}>
              <Folder className='w-4 h-4 mr-2' />
              Criar Pasta
            </Button>
          </div>
        </div>
      </div>

      <div className='space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50'>
        <div className='space-y-1'>
          <h3 className='text-sm font-semibold text-foreground'>
            Adicionar Tag
          </h3>
          <p className='text-xs text-muted-foreground'>
            Crie tags com cores personalizadas
          </p>
        </div>

        <div className='space-y-3'>
          <div className='flex gap-3 items-end'>
            <div className='flex-1'>
              <Input
                type='text'
                label='Nome da Tag'
                placeholder='Ex: Paredes'
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-semibold mb-2 text-foreground'>
                Cor
              </label>
              <input
                type='color'
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className='h-11 w-16 rounded-xl cursor-pointer border-2 border-border p-1'
              />
            </div>
          </div>

          <div className='flex flex-col gap-0 items-start'>
            <div className='w-full'>
              <label className='block text-sm font-semibold mb-2 text-foreground'>
                Pasta (Opcional)
              </label>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className='h-11 rounded-xl border-2 w-full'>
                  <SelectValue placeholder='Sem Pasta' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='root'>Sem Pasta</SelectItem>
                  {data.folders.map((f, i) => (
                    <SelectItem key={i} value={f.name}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='w-full justify-center items-center flex pt-4'>
              <Button
                size='lg'
                onClick={handleAddTag}
                className='flex items-center gap-2'
              >
                <Tag className='w-4 h-4' />
                Criar Tag
              </Button>
            </div>
          </div>
        </div>
      </div>

      <TagList
        data={data}
        isBusy={isBusy}
        countTags={countTags}
        rgbToHex={rgbToHex}
        deleteFolder={deleteFolder}
        deleteLayer={deleteLayer}
        toggleVisibility={toggleVisibility}
      />

      <div className='flex justify-center w-full'>
        <span className='inline-flex rounded-md shadow-sm'>
          <button
            type='button'
            onClick={loadLayers}
            disabled={isBusy}
            className='relative inline-flex flex-col items-center justify-center rounded-l-md bg-primary px-3 py-3 text-xs font-medium text-primary-foreground ring-1 ring-inset ring-primary-foreground/20 hover:bg-primary/90 focus:z-10 disabled:opacity-50 gap-1 '
            title='Trazer do Modelo'
          >
            <Download className='w-5 h-5' />
          </button>
          <button
            type='button'
            onClick={loadDefaultTags}
            className='relative -ml-px inline-flex flex-col items-center justify-center bg-primary px-3 py-3 text-xs font-medium text-primary-foreground ring-1 ring-inset ring-primary-foreground/20 hover:bg-primary/90 focus:z-10 gap-1'
            title='Redefinir (Tags Padrão)'
          >
            <FileJson className='w-5 h-5' />
          </button>
          <button
            type='button'
            onClick={saveToJson}
            className='relative -ml-px inline-flex flex-col items-center justify-center bg-primary px-3 py-3 text-xs font-medium text-primary-foreground ring-1 ring-inset ring-primary-foreground/20 hover:bg-primary/90 focus:z-10 gap-1'
            title='Salvar JSON'
          >
            <Save className='w-5 h-5' />
          </button>
          <button
            type='button'
            onClick={importToModel}
            className='relative -ml-px inline-flex flex-col items-center justify-center bg-primary px-3 py-3 text-xs font-medium text-primary-foreground ring-1 ring-inset ring-primary-foreground/20 hover:bg-primary/90 focus:z-10 gap-1 '
            title='Importar no Modelo'
          >
            <Upload className='w-5 h-5' />
          </button>
          <button
            type='button'
            onClick={clearAll}
            className='relative -ml-px inline-flex flex-col items-center justify-center rounded-r-md bg-primary px-3 py-3 text-xs font-medium text-primary-foreground ring-1 ring-inset ring-destructive-foreground/20 hover:bg-destructive/80 focus:z-10 gap-1 '
            title='Limpar'
          >
            <Trash2 className='w-5 h-5' />
          </button>
        </span>
      </div>
    </div>
  );
}
