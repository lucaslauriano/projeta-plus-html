'use client';

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useLayers } from '@/hooks/useLayers';
import TagList from '@/app/dashboard/inteli-sket/components/TagList';
import LayerDialogs from '@/app/dashboard/inteli-sket/components/layer-dialogs';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';

export default function LayersComponent() {
  const {
    data,
    isBusy,
    addTag,
    rgbToHex,
    clearAll,
    countTags,
    addFolder,
    loadLayers,
    loadMyTags,
    saveToJson,
    deleteLayer,
    deleteFolder,
    updateTagName,
    importToModel,
    updateTagColor,
    loadDefaultTags,
    toggleVisibility,
  } = useLayers();

  const [newFolderName, setNewFolderName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#ffffff');
  const [selectedFolder, setSelectedFolder] = useState<string>('root');
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    name: string;
    type: 'tag' | 'folder';
  } | null>(null);
  const [clearAllConfirmOpen, setClearAllConfirmOpen] = useState(false);
  const [importConfirmOpen, setImportConfirmOpen] = useState(false);

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

  const handleDeleteLayer = (name: string) => {
    setItemToDelete({ name, type: 'tag' });
    setDeleteConfirmOpen(true);
  };

  const handleDeleteFolder = (name: string) => {
    setItemToDelete({ name, type: 'folder' });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'tag') {
        await deleteLayer(itemToDelete.name);
      } else {
        await deleteFolder(itemToDelete.name);
      }
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleClearAll = () => {
    setClearAllConfirmOpen(true);
  };

  const handleImportToModel = () => {
    if (countTags() === 0) {
      return;
    }
    setImportConfirmOpen(true);
  };

  const menu = [
    {
      label: 'Criar pasta',
      action: () => setIsFolderDialogOpen(true),
      hasDivider: false,
    },
    {
      label: 'Criar etiqueta',
      action: () => setIsTagDialogOpen(true),
      hasDivider: true,
    },

    {
      label: 'Importar personalizado',
      action: () => loadMyTags(),
      hasDivider: false,
    },
    {
      label: 'Importar do modelo',
      action: () => loadLayers(),
      hasDivider: true,
    },
    {
      label: 'Salvar personalizado',
      action: () => saveToJson(),
      hasDivider: false,
    },
    {
      label: 'Restaurar padrão',
      action: () => loadDefaultTags(),
      hasDivider: false,
    },
    {
      label: 'Deletar todos',
      action: handleClearAll,
      hasDivider: false,
    },
  ];

  return (
    <>
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={itemToDelete?.type === 'folder' ? 'Excluir Pasta' : 'Excluir Tag'}
        description={
          itemToDelete?.type === 'folder'
            ? `Tem certeza que deseja excluir a pasta "${itemToDelete?.name}"? As tags da pasta serão movidas para fora.`
            : `Tem certeza que deseja excluir a tag "${itemToDelete?.name}"? Esta ação não pode ser desfeita.`
        }
        confirmText='Excluir'
        onConfirm={confirmDelete}
        variant='destructive'
      />

      <ConfirmDialog
        open={clearAllConfirmOpen}
        onOpenChange={setClearAllConfirmOpen}
        title='Limpar todas as etiquetas'
        description='Tem certeza que deseja remover todas as pastas e etiquetas? Esta ação não pode ser desfeita.'
        confirmText='Limpar tudo'
        onConfirm={clearAll}
        variant='destructive'
      />

      <ConfirmDialog
        open={importConfirmOpen}
        onOpenChange={setImportConfirmOpen}
        title='Aplicar no Modelo'
        description={`Deseja aplicar ${countTags()} etiqueta(s) no modelo SketchUp?`}
        confirmText='Aplicar'
        onConfirm={importToModel}
      />

      <LayerDialogs
        isFolderDialogOpen={isFolderDialogOpen}
        setIsFolderDialogOpen={setIsFolderDialogOpen}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        handleAddFolder={handleAddFolder}
        isTagDialogOpen={isTagDialogOpen}
        setIsTagDialogOpen={setIsTagDialogOpen}
        newTagName={newTagName}
        setNewTagName={setNewTagName}
        newTagColor={newTagColor}
        setNewTagColor={setNewTagColor}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        handleAddTag={handleAddTag}
        folders={data.folders}
      />

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              Etiquetas
            </h2>
          </div>
          <ViewConfigMenu isBusy={isBusy} entityLabel='Tag' menuItems={menu} />
        </div>

        <div className='flex items-center justify-center w-full'>
          <Button
            type='button'
            size='sm'
            title='Aplicar no Modelo'
            onClick={handleImportToModel}
            className='w-full'
          >
            <Upload className='w-5 h-5' />
            Aplicar no Modelo
          </Button>
        </div>

        <TagList
          data={data}
          isBusy={isBusy}
          rgbToHex={rgbToHex}
          countTags={countTags}
          deleteLayer={handleDeleteLayer}
          deleteFolder={handleDeleteFolder}
          updateTagName={updateTagName}
          updateTagColor={updateTagColor}
          toggleVisibility={toggleVisibility}
        />
      </div>
    </>
  );
}
