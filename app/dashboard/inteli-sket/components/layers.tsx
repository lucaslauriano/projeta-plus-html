'use client';

import React, { useState } from 'react';
import {
  Folder,
  Tag,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Save,
  FileJson,
  X,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useLayers } from '@/hooks/useLayers';

export default function LayersComponent() {
  const {
    data,
    isBusy,
    countTags,
    rgbToHex,
    loadLayers,
    addFolder,
    addTag,
    deleteLayer,
    toggleVisibility,
    saveToJson,
    loadFromJson,
    importToModel,
    clearAll,
  } = useLayers();

  const [newFolderName, setNewFolderName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#00d9ff');
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
          <Tag className='w-5 h-5' />
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

        <div className='flex flex-col gap-2 items-start'>
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

          <div className='flex flex-col gap-2 items-start'>
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

      <div className='border rounded-lg bg-card/50'>
        <div className='px-3 py-2 border-b flex items-center gap-2'>
          <h3 className='text-sm font-medium flex items-center gap-1'>
            📋 Lista de Tags
          </h3>
          <Badge variant='outline' className='text-xs'>
            {countTags()}
          </Badge>
        </div>
        <div className='h-[300px] p-3 overflow-y-auto'>
          {isBusy ? (
            <div className='flex justify-center items-center h-full text-muted-foreground'>
              <RefreshCw className='w-6 h-6 animate-spin mr-2' />
              Carregando...
            </div>
          ) : (
            <div className='space-y-2'>
              <Accordion type='single' collapsible className='w-full space-y-2'>
                {data.folders.map((folder, i) => (
                  <AccordionItem
                    key={i}
                    value={`folder-${i}`}
                    className='border rounded-md overflow-hidden bg-muted/20 px-0'
                  >
                    <AccordionTrigger className=' px-3 py-2 hover:no-underline hover:bg-yellow-500/20 data-[state=open]:bg-yellow-500/20 '>
                      <div className='flex items-center justify-between w-full pr-2'>
                        <div className='flex items-center gap-2 font-medium text-sm'>
                          <Folder className='w-4 h-4 text-yellow-500' />
                          {folder.name}
                        </div>
                        <Badge
                          variant='outline'
                          className='text-xs bg-green-500/20 border-green-500/30 ml-2'
                        >
                          {folder.tags.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='p-0'>
                      <div className='p-2 space-y-1'>
                        {folder.tags.map((tag, j) => (
                          <div
                            key={j}
                            className='flex items-center gap-2 px-2 py-1 rounded hover:bg-accent/50 text-sm group'
                          >
                            <Checkbox
                              checked={tag.visible}
                              onCheckedChange={(checked) =>
                                toggleVisibility(tag.name, !!checked)
                              }
                              className='h-3 w-3'
                            />
                            <div
                              className='w-3 h-3 rounded-full border border-white/20'
                              style={{
                                backgroundColor: rgbToHex(
                                  tag.color[0],
                                  tag.color[1],
                                  tag.color[2]
                                ),
                              }}
                            />
                            <span className='flex-1'>{tag.name}</span>
                            <button
                              onClick={() => deleteLayer(tag.name)}
                              className='opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity'
                            >
                              <X className='w-4 h-4' />
                            </button>
                          </div>
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
                <div
                  key={i}
                  className='flex items-center gap-2 px-3 py-2 rounded border hover:bg-accent/50 text-sm group'
                >
                  <Checkbox
                    checked={tag.visible}
                    onCheckedChange={(checked) =>
                      toggleVisibility(tag.name, !!checked)
                    }
                    className='h-3 w-3'
                  />
                  <div
                    className='w-3 h-3 rounded-full border border-white/20'
                    style={{
                      backgroundColor: rgbToHex(
                        tag.color[0],
                        tag.color[1],
                        tag.color[2]
                      ),
                    }}
                  />
                  <span className='flex-1'>{tag.name}</span>
                  <button
                    onClick={() => deleteLayer(tag.name)}
                    className='opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
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

      <div className='flex justify-center w-full'>
        <span className='inline-flex rounded-md shadow-sm'>
          <button
            type='button'
            onClick={loadLayers}
            disabled={isBusy}
            className='relative inline-flex flex-col items-center justify-center rounded-l-md bg-secondary px-4 py-4 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/20 hover:bg-secondary/90 focus:z-10 disabled:opacity-50 gap-1 '
            title='Trazer do Modelo'
          >
            <Download className='w-5 h-5' />
          </button>
          <button
            type='button'
            onClick={loadFromJson}
            className='relative -ml-px inline-flex flex-col items-center justify-center bg-secondary px-4 py-4 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/20 hover:bg-secondary/90 focus:z-10 gap-1'
            title='Carregar JSON'
          >
            <FileJson className='w-5 h-5' />
          </button>
          <button
            type='button'
            onClick={saveToJson}
            className='relative -ml-px inline-flex flex-col items-center justify-center bg-secondary px-4 py-4 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/20 hover:bg-secondary/90 focus:z-10 gap-1'
            title='Salvar JSON'
          >
            <Save className='w-5 h-5' />
          </button>
          <button
            type='button'
            onClick={importToModel}
            className='relative -ml-px inline-flex flex-col items-center justify-center bg-secondary px-4 py-4 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-primary-foreground/20 hover:bg-primary/90 focus:z-10 gap-1 '
            title='Importar no Modelo'
          >
            <Upload className='w-5 h-5' />
          </button>
          <button
            type='button'
            onClick={clearAll}
            className='relative -ml-px inline-flex flex-col items-center justify-center rounded-r-md bg-destructive px-4 py-4 text-xs font-medium text-destructive-foreground ring-1 ring-inset ring-destructive-foreground/20 hover:bg-destructive/90 focus:z-10 gap-1 '
            title='Limpar'
          >
            <Trash2 className='w-5 h-5' />
          </button>
        </span>
      </div>
    </div>
  );
}
