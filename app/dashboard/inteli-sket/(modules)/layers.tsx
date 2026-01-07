'use client';

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useLayers } from '@/hooks/useLayers';
import TagList from '@/app/dashboard/inteli-sket/components/TagList';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';
import { AddItemDialog } from '@/app/dashboard/inteli-sket/components/add-item-dialog';
import AddLayerWithGroupDialogs from '@/app/dashboard/inteli-sket/components/add-layer-with-group-dialogs';

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

  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#ffffff');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('root');
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [importConfirmOpen, setImportConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [clearAllConfirmOpen, setClearAllConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    name: string;
    type: 'tag' | 'folder';
  } | null>(null);

  const [loadCustomConfirmOpen, setLoadCustomConfirmOpen] = useState(false);
  const [loadModelConfirmOpen, setLoadModelConfirmOpen] = useState(false);
  const [saveCustomConfirmOpen, setSaveCustomConfirmOpen] = useState(false);
  const [restoreDefaultConfirmOpen, setRestoreDefaultConfirmOpen] =
    useState(false);

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

  const menuItems = [
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
      action: () => setLoadCustomConfirmOpen(true),
      hasDivider: false,
    },
    {
      label: 'Importar do modelo',
      action: () => setLoadModelConfirmOpen(true),
      hasDivider: true,
    },
    {
      label: 'Salvar personalizado',
      action: () => setSaveCustomConfirmOpen(true),
      hasDivider: false,
    },
    {
      label: 'Restaurar padrão',
      action: () => setRestoreDefaultConfirmOpen(true),
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
        title={
          itemToDelete?.type === 'folder' ? 'Excluir Pasta' : 'Excluir Tag'
        }
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
        variant='destructive'
        title='Limpar todas as etiquetas'
        onConfirm={clearAll}
        description='Tem certeza que deseja remover todas as pastas e etiquetas? Esta ação não pode ser desfeita.'
        confirmText='Limpar'
        onOpenChange={setClearAllConfirmOpen}
      />

      <ConfirmDialog
        title='Aplicar no Modelo'
        confirmText='Aplicar'
        description={`Deseja aplicar ${countTags()} etiqueta(s) no modelo SketchUp?`}
        open={importConfirmOpen}
        onConfirm={importToModel}
        onOpenChange={setImportConfirmOpen}
      />

      <ConfirmDialog
        title='Importar Personalizado'
        description='Deseja carregar suas etiquetas personalizadas salvas? As etiquetas atuais serão substituídas.'
        confirmText='Importar'
        open={loadCustomConfirmOpen}
        onOpenChange={setLoadCustomConfirmOpen}
        onConfirm={() => {
          loadMyTags();
          setLoadCustomConfirmOpen(false);
        }}
      />

      <ConfirmDialog
        title='Importar do Modelo'
        description='Deseja importar as etiquetas (layers/tags) do modelo SketchUp atual? As etiquetas atuais serão substituídas.'
        confirmText='Importar'
        open={loadModelConfirmOpen}
        onOpenChange={setLoadModelConfirmOpen}
        onConfirm={() => {
          loadLayers();
          setLoadModelConfirmOpen(false);
        }}
      />

      <ConfirmDialog
        title='Salvar Personalizado'
        description={`Deseja salvar suas ${countTags()} etiqueta(s) atuais como configuração personalizada?`}
        confirmText='Salvar'
        open={saveCustomConfirmOpen}
        onOpenChange={setSaveCustomConfirmOpen}
        onConfirm={() => {
          saveToJson();
          setSaveCustomConfirmOpen(false);
        }}
      />

      <ConfirmDialog
        title='Restaurar Padrão'
        description='Deseja restaurar as etiquetas padrão? Todas as etiquetas atuais serão substituídas.'
        confirmText='Restaurar'
        variant='destructive'
        open={restoreDefaultConfirmOpen}
        onOpenChange={setRestoreDefaultConfirmOpen}
        onConfirm={() => {
          loadDefaultTags();
          setRestoreDefaultConfirmOpen(false);
        }}
      />

      <AddItemDialog
        title='Criar nova pasta'
        inputLabel='Nome da Pasta'
        description='Organize suas tags em pastas personalizadas.'
        inputPlaceholder='Ex: Estrutura'
        isOpen={isFolderDialogOpen}
        inputValue={newFolderName}
        onAdd={handleAddFolder}
        onOpenChange={setIsFolderDialogOpen}
        onInputChange={setNewFolderName}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleAddFolder();
          }
        }}
      />

      <AddLayerWithGroupDialogs
        folders={data.folders}
        isTagDialogOpen={isTagDialogOpen}
        setIsTagDialogOpen={setIsTagDialogOpen}
        newTagName={newTagName}
        setNewTagName={setNewTagName}
        newTagColor={newTagColor}
        setNewTagColor={setNewTagColor}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        handleAddTag={handleAddTag}
      />

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              Etiquetas
            </h2>
          </div>
          <ViewConfigMenu menuItems={menuItems} />
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
