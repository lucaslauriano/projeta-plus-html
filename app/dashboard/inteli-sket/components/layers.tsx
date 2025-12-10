'use client';

import React, { useState } from 'react';
import {
  Tag,
  Save,
  Trash2,
  Upload,
  Folder,
  TagIcon,
  FileJson,
  Download,
  FolderPlus,
  MoreVertical,
  FolderArchive,
  FolderDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select';
import { useLayers } from '@/hooks/useLayers';
import TagList from './TagList';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    updateTagColor,
    updateTagName,
    saveToJson,
    loadDefaultTags,
    loadMyTags,
    importToModel,
    clearAll,
  } = useLayers();

  const [newFolderName, setNewFolderName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#ffffff');
  const [selectedFolder, setSelectedFolder] = useState<string>('root');
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  const handleAddFolder = async () => {
    if (await addFolder(newFolderName)) {
      setNewFolderName('');
      setIsFolderDialogOpen(false);
    }
  };

  const handleAddTag = async () => {
    if (await addTag(newTagName, newTagColor, selectedFolder)) {
      setNewTagName('');
      setIsTagDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Pasta</DialogTitle>
            <DialogDescription>
              Organize suas tags em pastas personalizadas.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Input
                id='folder-name'
                label='Nome da Pasta'
                placeholder='Ex: Estrutura'
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddFolder();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsFolderDialogOpen(false);
                setNewFolderName('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddFolder}>
              <Folder className='w-4 h-4 mr-2' />
              Criar Pasta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tag</DialogTitle>
            <DialogDescription>
              Crie tags com cores personalizadas para organizar seu modelo.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Input
                id='tag-name'
                label='Nome da Tag'
                placeholder='Ex: Paredes'
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  }
                }}
                autoFocus
              />
            </div>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-foreground'>
                Cor
              </label>
              <input
                type='color'
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className='h-11 w-full rounded-xl cursor-pointer border-2 border-border p-1'
              />
            </div>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-foreground'>
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
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsTagDialogOpen(false);
                setNewTagName('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddTag}>
              <Tag className='w-4 h-4 mr-2' />
              Criar Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              <Tag className='w-4 h-4' />
              Etiquetas
            </h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='p-1 hover:bg-accent rounded-md transition-colors'>
                <MoreVertical
                  className='w-4 h-4 text-muted-foreground'
                  size={16}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => setIsFolderDialogOpen(true)}
              >
                <FolderPlus className='w-4 h-4 mr-2 text-blue-600' />
                Adicionar Pasta
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => setIsTagDialogOpen(true)}
              >
                <TagIcon className='w-4 h-4 mr-2 text-green-600' />
                Adicionar Tag
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TagList
          data={data}
          isBusy={isBusy}
          rgbToHex={rgbToHex}
          countTags={countTags}
          deleteLayer={deleteLayer}
          deleteFolder={deleteFolder}
          updateTagName={updateTagName}
          updateTagColor={updateTagColor}
          toggleVisibility={toggleVisibility}
        />
      </div>

      <div className='absolute bottom-0 -left-2 right-0 z-40 flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60  mt-auto'>
        <div className='w-full max-w-2xl mx-auto px-4'>
          <div className='flex items-center justify-center h-12 bg-card rounded-xl shadow-lg'>
            <div className='grid grid-cols-6 w-full'>
              <button
                type='button'
                title='Redefinir (Tags Padrão)'
                onClick={loadDefaultTags}
                className='inline-flex flex-col items-center justify-center rounded-l-xl hover:bg-accent transition-colors group'
              >
                <FileJson className='w-5 h-5 text-muted-foreground group-hover:text-foreground' />
                <span className='sr-only'>JSON</span>
              </button>
              <button
                type='button'
                title='Trazer do Modelo'
                disabled={isBusy}
                onClick={() => loadLayers()}
                className='inline-flex flex-col items-center justify-center hover:bg-accent transition-colors group'
              >
                <Download className='w-5 h-5 text-muted-foreground group-hover:text-foreground' />
                <span className='sr-only'>Download</span>
              </button>
              <div className='flex items-center justify-center'>
                <button
                  type='button'
                  title='Minhas Tags (Arquivo do Usuário)'
                  onClick={loadMyTags}
                  className='inline-flex flex-col items-center justify-center hover:bg-accent transition-colors group p-4'
                >
                  <FolderDown className='w-5 h-5' />
                  <span className='sr-only'>New item</span>
                </button>
              </div>
              <button
                type='button'
                title='Salvar JSON'
                onClick={saveToJson}
                className='inline-flex flex-col items-center justify-center hover:bg-accent transition-colors group'
              >
                <Save className='w-5 h-5' />
                <span className='sr-only'>Save</span>
              </button>
              <button
                type='button'
                title='Importar no Modelo'
                onClick={importToModel}
                className='inline-flex flex-col items-center justify-center  hover:bg-accent transition-colors group'
              >
                <Upload className='w-5 h-5 text-muted-foreground group-hover:text-foreground' />
                <span className='sr-only'>Upload</span>
              </button>

              <button
                type='button'
                title='Limpar'
                onClick={clearAll}
                className='inline-flex flex-col items-center justify-center rounded-r-xl hover:bg-accent transition-colors group'
              >
                <Trash2 className='w-5 h-5 text-muted-foreground group-hover:text-destructive' />
                <span className='sr-only'>Delete</span>
              </button>
            </div>
          </div>
        </div>
        {/* <div className='flex justify-center w-full'>
          <span className='inline-flex rounded-md shadow-sm'>
     
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
              onClick={loadMyTags}
              className='relative -ml-px inline-flex flex-col items-center justify-center bg-primary px-3 py-3 text-xs font-medium text-primary-foreground ring-1 ring-inset ring-primary-foreground/20 hover:bg-primary/90 focus:z-10 gap-1'
              title='Minhas Tags (Arquivo do Usuário)'
            >
              <Folder className='w-5 h-5' />
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
     
          </span>
        </div> */}
      </div>
    </>
  );
}
