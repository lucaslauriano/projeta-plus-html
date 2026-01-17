'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { PlanItem } from '@/components/PlanItem';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SceneGroup, useScenes } from '@/hooks/useScenes';
import {
  ScenesSkeleton,
  ScenesEmptyState,
  ScenesLoadingState,
} from '@/app/dashboard/inteli-sket/components/scenes-skeleton';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';
import { GroupAccordion } from '@/app/dashboard/inteli-sket/components/group-accordion';
import { GroupNameEditDialog } from '@/app/dashboard/inteli-sket/components/group-name-edit-dialog';
import { AddItemDialog } from '@/app/dashboard/inteli-sket/components/add-item-dialog';
import { AddItemWithGroupDialog } from '@/app/dashboard/inteli-sket/components/add-item-with-group-dialog';
import { useConfirm } from '@/hooks/useConfirm';
import { ViewConfigDialog } from '@/app/dashboard/inteli-sket/components/view-config-dialog';

type Scene = SceneGroup['segments'][number];

function ScenesComponent() {
  const { confirm, ConfirmDialog } = useConfirm();
  const {
    data,
    setData,
    availableStyles,
    availableLayers,
    currentState,
    isBusy,
    isLoading,
    saveToJson,
    loadDefault,
    getCurrentState,
    applySceneConfig,
    // addScene,
    // updateScene,
    // deleteScene,
    // loadFromFile,
    // loadFromJson,
  } = useScenes();

  const groups = data.groups;

  const setGroups = (
    newGroups: SceneGroup[] | ((prev: SceneGroup[]) => SceneGroup[])
  ) => {
    const updatedGroups =
      typeof newGroups === 'function' ? newGroups(data.groups) : newGroups;

    setData({
      ...data,
      groups: updatedGroups,
    });
  };

  const [newGroupName, setNewGroupName] = useState('');
  const [newSceneTitle, setNewSceneTitle] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('root');
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [editSceneName, setEditSceneName] = useState('');
  const [editSceneCode, setEditSceneCode] = useState('');
  const [editSceneStyle, setEditSceneStyle] = useState('');
  const [editCameraType, setEditCameraType] = useState('');
  const [editActiveLayers, setEditActiveLayers] = useState<string[]>([]);

  const [isGroupEditDialogOpen, setIsGroupEditDialogOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');

  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => a.name.localeCompare(b.name)),
    [groups]
  );

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Digite um nome para o grupo');
      return;
    }

    const newGroup: SceneGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      segments: [],
    };

    const updatedGroups = [...groups, newGroup];
    const updatedData = {
      ...data,
      groups: updatedGroups,
    };

    setGroups(updatedGroups);
    setNewGroupName('');
    setIsGroupDialogOpen(false);

    await saveToJson(updatedData);

    toast.success('Grupo adicionado com sucesso!');
  };

  const handleAddScene = async () => {
    if (!newSceneTitle.trim()) {
      toast.error('Digite um título para a cena');
      return;
    }

    if (!selectedGroup.trim() || selectedGroup === 'root') {
      toast.error('Selecione um grupo para a cena');
      return;
    }

    const newSegment = {
      id: Date.now().toString(),
      name: newSceneTitle.trim(),
      code: newSceneTitle.trim().toLowerCase().replace(/\s+/g, '_'),
      style: currentState?.style || 'PRO_VISTAS',
      cameraType: currentState?.cameraType || 'iso_perspectiva',
      activeLayers: currentState?.activeLayers || [],
    };

    let updatedGroups: SceneGroup[];
    if (selectedGroup === 'root') {
      const newGroup: SceneGroup = {
        id: Date.now().toString(),
        name: newSceneTitle.trim(),
        segments: [newSegment],
      };
      updatedGroups = [...groups, newGroup];
      setGroups(updatedGroups);
    } else {
      updatedGroups = groups.map((group) => {
        if (group.id === selectedGroup) {
          return {
            ...group,
            segments: [...group.segments, newSegment],
          };
        }
        return group;
      });
      setGroups(updatedGroups);
    }

    const updatedData = {
      ...data,
      groups: updatedGroups,
    };

    setNewSceneTitle('');
    setIsSceneDialogOpen(false);

    await saveToJson(updatedData);

    toast.success('Cena adicionada com sucesso!');
  };

  const handleDeleteGroup = async (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    const confirmed = await confirm({
      title: 'Remover grupo',
      description: `Deseja realmente remover o grupo "${
        group?.name
      }" e todas as suas ${group?.segments.length || 0} cena(s)?`,
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });
    if (!confirmed) return;

    const updatedGroups = groups.filter((group) => group.id !== groupId);
    const updatedData = {
      ...data,
      groups: updatedGroups,
    };

    setGroups(updatedGroups);

    await saveToJson(updatedData);

    toast.success('Grupo removido com sucesso!');
  };

  const handleEditGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    setEditingGroupId(groupId);
    setEditingGroupName(group.name);
    setIsGroupEditDialogOpen(true);
  };

  const handleConfirmEditGroup = async () => {
    if (!editingGroupId || !editingGroupName.trim()) {
      toast.error('Nome inválido');
      return;
    }

    const group = groups.find((g) => g.id === editingGroupId);
    if (!group) return;

    if (editingGroupName.trim() === group.name) {
      setIsGroupEditDialogOpen(false);
      return;
    }

    const updatedGroups = groups.map((g) =>
      g.id === editingGroupId ? { ...g, name: editingGroupName.trim() } : g
    );
    const updatedData = {
      ...data,
      groups: updatedGroups,
    };

    setGroups(updatedGroups);

    await saveToJson(updatedData);

    toast.success('Grupo renomeado com sucesso!');
    setIsGroupEditDialogOpen(false);
    setEditingGroupId(null);
    setEditingGroupName('');
  };

  const handleDeleteScene = async (groupId: string, segmentId: string) => {
    const confirmed = await confirm({
      title: 'Remover cena',
      description: 'Deseja realmente remover esta cena?',
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });
    if (!confirmed) return;

    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          segments: group.segments.filter(
            (segment) => segment.id !== segmentId
          ),
        };
      }
      return group;
    });
    const updatedData = {
      ...data,
      groups: updatedGroups,
    };

    setGroups(updatedGroups);

    await saveToJson(updatedData);

    toast.success('Cena removida com sucesso!');
  };

  const handleDuplicateScene = async (groupId: string, segment: Scene) => {
    const updatedGroups = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          segments: [
            ...g.segments,
            {
              ...segment,
              id: Date.now().toString(),
              name: `${segment.name} (cópia)`,
            },
          ],
        };
      }
      return g;
    });
    const updatedData = {
      ...data,
      groups: updatedGroups,
    };

    setGroups(updatedGroups);

    await saveToJson(updatedData);

    toast.success('Cena duplicada!');
  };

  const handleApplyScene = async (segment: Scene) => {
    await applySceneConfig(segment.name, segment.code, {
      style: segment.style,
      cameraType: segment.cameraType,
      activeLayers: segment.activeLayers,
    });

    toast.success(`Cena "${segment.name}" aplicada!`);
  };

  const handleGroupDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGroup();
    }
  };

  const handleSceneDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddScene();
    }
  };

  const handleEditScene = (segment: Scene) => {
    setEditingScene(segment);
    setEditSceneName(segment.name);
    setEditSceneCode(
      segment.code || segment.name.toLowerCase().replace(/\s+/g, '_')
    );

    setEditSceneStyle(segment.style || availableStyles[0] || 'PRO_VISTAS');
    setEditCameraType(segment.cameraType || 'iso_perspectiva');
    setEditActiveLayers(segment.activeLayers || ['Layer0']);

    setIsEditDialogOpen(true);
  };

  const handleApplyCurrentState = async () => {
    try {
      await getCurrentState();
      if (currentState) {
        setEditActiveLayers(currentState.activeLayers);
        toast.success('Estado atual aplicado!');
      }
    } catch (error) {
      toast.error('Erro ao obter estado atual');
      console.error('Error getting current state:', error);
    }
  };

  const handleSelectAllLayers = () => {
    setEditActiveLayers(availableLayers);
  };

  const handleSelectNoLayers = () => {
    setEditActiveLayers([]);
  };

  const handleSaveEditScene = useCallback(async () => {
    if (!editSceneName.trim() || !editingScene) {
      toast.error('Digite um nome para a cena');
      return;
    }

    const updatedGroups = groups.map((g) => ({
      ...g,
      segments: g.segments.map((s) =>
        s.id === editingScene.id
          ? {
              ...s,
              name: editSceneName.trim(),
              code:
                editSceneCode.trim() ||
                editSceneName.trim().toLowerCase().replace(/\s+/g, '_'),
              style: editSceneStyle,
              cameraType: editCameraType,
              activeLayers: editActiveLayers,
            }
          : s
      ),
    }));

    const updatedData = {
      ...data,
      groups: updatedGroups,
    };

    setData(updatedData);

    await saveToJson(updatedData);

    setIsEditDialogOpen(false);
    setEditingScene(null);
  }, [
    data,
    groups,
    editSceneName,
    editingScene,
    editSceneCode,
    editSceneStyle,
    editCameraType,
    editActiveLayers,
    setData,
    saveToJson,
  ]);

  const menuItems = [
    {
      label: 'Criar grupo',
      action: () => setIsGroupDialogOpen(true),
      hasDivider: false,
    },
    {
      label: 'Criar cena',
      action: () => setIsSceneDialogOpen(true),
      hasDivider: true,
    },
    {
      label: 'Restaurar padrão',
      action: loadDefault,
      hasDivider: false,
    },
  ];

  return (
    <>
      <AddItemDialog
        title='Criar novo grupo'
        description='Organize suas cenas em grupos personalizados.'
        isOpen={isGroupDialogOpen}
        inputValue={newGroupName}
        inputLabel='Nome do grupo'
        inputPlaceholder='Ex: Arquitetônico'
        onAdd={handleAddGroup}
        onKeyPress={handleGroupDialogKeyPress}
        onOpenChange={setIsGroupDialogOpen}
        onInputChange={setNewGroupName}
      />

      <AddItemWithGroupDialog
        groups={groups}
        isOpen={isSceneDialogOpen}
        itemValue={newSceneTitle}
        selectedGroup={selectedGroup}
        title='Criar nova cena'
        description='Crie uma nova cena e escolha em qual grupo ela ficará.'
        itemLabel='Nome da cena'
        itemPlaceholder='Ex: Vista Frontal'
        onAdd={handleAddScene}
        onKeyPress={handleSceneDialogKeyPress}
        onOpenChange={setIsSceneDialogOpen}
        onItemValueChange={setNewSceneTitle}
        onSelectedGroupChange={setSelectedGroup}
      />

      <GroupNameEditDialog
        open={isGroupEditDialogOpen}
        onOpenChange={setIsGroupEditDialogOpen}
        groupName={editingGroupName}
        onGroupNameChange={setEditingGroupName}
        onConfirm={handleConfirmEditGroup}
        disabled={isBusy}
      />

      <ViewConfigDialog
        title='Configuração da Cena'
        itemTitle={editSceneName}
        itemCode={editSceneCode}
        onItemTitleChange={setEditSceneName}
        onItemCodeChange={setEditSceneCode}
        allowedCameraTypes={['iso_perspectiva', 'iso_ortogonal']}
        style={editSceneStyle}
        isBusy={isBusy}
        isOpen={isEditDialogOpen}
        onSave={handleSaveEditScene}
        cameraType={editCameraType}
        onOpenChange={setIsEditDialogOpen}
        activeLayers={editActiveLayers}
        onStyleChange={setEditSceneStyle}
        availableLayers={availableLayers}
        availableStyles={availableStyles}
        onCameraTypeChange={setEditCameraType}
        onActiveLayersChange={setEditActiveLayers}
        onCancel={() => {
          setIsEditDialogOpen(false);
          setEditingScene(null);
        }}
        onSelectAllLayers={handleSelectAllLayers}
        onSelectNoLayers={handleSelectNoLayers}
        onApplyCurrentState={handleApplyCurrentState}
      />

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            Cenas
            {isLoading && <Loader2 className='w-4 h-4 animate-spin' />}
          </h2>
          <div className='flex items-center gap-2'>
            <ViewConfigMenu menuItems={menuItems} />
          </div>
        </div>

        {isLoading && sortedGroups.length === 0 && <ScenesLoadingState />}

        {isLoading && sortedGroups.length > 0 && <ScenesSkeleton />}

        {!isLoading && sortedGroups.length === 0 && <ScenesEmptyState />}

        {!isLoading && sortedGroups.length > 0 && (
          <div className='space-y-4'>
            <GroupAccordion
              groups={sortedGroups}
              onEditGroup={handleEditGroup}
              onDeleteGroup={handleDeleteGroup}
              emptyMessage='Nenhuma cena neste grupo'
              iconPosition='right'
              renderSegment={(segment, groupId) => (
                <PlanItem
                  key={segment.id}
                  title={segment.name}
                  onEdit={() => handleEditScene(segment as Scene)}
                  onLoadFromJson={() => handleApplyScene(segment as Scene)}
                  onDuplicate={() =>
                    handleDuplicateScene(groupId, segment as Scene)
                  }
                  onDelete={() => handleDeleteScene(groupId, segment.id)}
                />
              )}
            />
          </div>
        )}
      </div>

      <ConfirmDialog />
    </>
  );
}

export default React.memo(ScenesComponent);
