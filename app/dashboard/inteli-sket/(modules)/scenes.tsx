'use client';

import React, { useState, useMemo } from 'react';
import { PlanItem } from '@/components/PlanItem';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SceneGroup, useScenes } from '@/hooks/useScenes';
import {
  AddGroupDialog,
  AddSceneDialog,
} from '@/app/dashboard/inteli-sket/components/scene-group-dialogs';
import {
  ScenesSkeleton,
  ScenesEmptyState,
  ScenesLoadingState,
} from '@/app/dashboard/inteli-sket/components/scenes-skeleton';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';
import { ViewConfigEditDialog } from '@/app/dashboard/inteli-sket/components/view-config-edit-dialog';
import { GroupAccordion } from '@/app/dashboard/inteli-sket/components/group-accordion';

type Scene = SceneGroup['segments'][number];

function ScenesComponent() {
  const {
    data,
    setData,
    availableStyles,
    availableLayers,
    currentState,
    isBusy,
    isLoading,
    // addScene,
    // updateScene,
    // deleteScene,
    applySceneConfig,
    saveToJson,
    loadFromJson,
    loadDefault,
    loadFromFile,
    getCurrentState,
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

  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => a.name.localeCompare(b.name)),
    [groups]
  );

  const handleAddGroup = () => {
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

    setGroups(updatedGroups);
    setNewGroupName('');
    setIsGroupDialogOpen(false);

    setTimeout(() => {
      saveToJson();
    }, 100);

    toast.success('Grupo adicionado com sucesso!');
  };

  const handleAddScene = () => {
    if (!newSceneTitle.trim()) {
      toast.error('Digite um título para a cena');
      return;
    }

    const newSegment = {
      id: Date.now().toString(),
      name: newSceneTitle.trim(),
      code: newSceneTitle.trim().toLowerCase().replace(/\s+/g, '_'),
      style: currentState?.style || 'FM_VISTAS',
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

    setNewSceneTitle('');
    setIsSceneDialogOpen(false);

    // Salvar no JSON após adicionar
    setTimeout(() => {
      saveToJson();
    }, 100);

    toast.success('Cena adicionada com sucesso!');
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    const confirmed = confirm(
      `Deseja realmente remover o grupo "${group?.name}" e todas as suas ${
        group?.segments.length || 0
      } cena(s)?`
    );
    if (!confirmed) return;

    setGroups(groups.filter((group) => group.id !== groupId));

    // Salvar no JSON após deletar
    setTimeout(() => {
      saveToJson();
    }, 100);

    toast.success('Grupo removido com sucesso!');
  };

  const handleEditGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    const newName = prompt('Digite o novo nome do grupo:', group.name);
    if (!newName || newName.trim() === '') {
      toast.error('Nome inválido');
      return;
    }

    if (newName.trim() === group.name) {
      return; // Nenhuma mudança
    }

    setGroups(
      groups.map((g) => (g.id === groupId ? { ...g, name: newName.trim() } : g))
    );

    // Salvar no JSON após editar
    setTimeout(() => {
      saveToJson();
    }, 100);

    toast.success('Grupo renomeado com sucesso!');
  };

  const handleDeleteScene = (groupId: string, segmentId: string) => {
    const confirmed = confirm('Deseja realmente remover esta cena?');
    if (!confirmed) return;

    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            segments: group.segments.filter(
              (segment) => segment.id !== segmentId
            ),
          };
        }
        return group;
      })
    );

    // Salvar no JSON após deletar
    setTimeout(() => {
      saveToJson();
    }, 100);

    toast.success('Cena removida com sucesso!');
  };

  const handleDuplicateScene = (groupId: string, segment: Scene) => {
    setGroups(
      groups.map((g) => {
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
      })
    );

    // Salvar no JSON após duplicar
    setTimeout(() => {
      saveToJson();
    }, 100);

    toast.success('Cena duplicada!');
  };

  const handleApplyScene = async (segment: Scene) => {
    // Segment já tem todas as configurações necessárias
    await applySceneConfig(segment.name, {
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

    // Segment já tem todas as configurações
    setEditSceneStyle(segment.style || availableStyles[0] || 'FM_VISTAS');
    setEditCameraType(segment.cameraType || 'iso_perspectiva');
    setEditActiveLayers(segment.activeLayers || ['Layer0']);

    setIsEditDialogOpen(true);
  };

  // TODO: Implement apply current state functionality
  const handleApplyCurrentState = async () => {
    await getCurrentState();
    if (currentState) {
      setEditSceneStyle(currentState.style);
      setEditCameraType(currentState.cameraType);
      setEditActiveLayers(currentState.activeLayers);
      toast.success('Estado atual aplicado!');
    }
  };

  const handleSelectAllLayers = () => {
    setEditActiveLayers(availableLayers);
  };

  const handleSelectNoLayers = () => {
    setEditActiveLayers([]);
  };

  const handleSaveEditScene = async () => {
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

    // Atualizar estado local
    setData({
      ...data,
      groups: updatedGroups,
    });

    // Salvar no JSON (não mexe no modelo do SketchUp)
    await saveToJson();

    setIsEditDialogOpen(false);
    setEditingScene(null);
    toast.success('Configuração salva no JSON!');
  };

  return (
    <>
      <AddGroupDialog
        isOpen={isGroupDialogOpen}
        onOpenChange={setIsGroupDialogOpen}
        groupName={newGroupName}
        onGroupNameChange={setNewGroupName}
        onAdd={handleAddGroup}
        onKeyPress={handleGroupDialogKeyPress}
      />

      <AddSceneDialog
        isOpen={isSceneDialogOpen}
        onOpenChange={setIsSceneDialogOpen}
        sceneTitle={newSceneTitle}
        onSceneTitleChange={setNewSceneTitle}
        selectedGroup={selectedGroup}
        onSelectedGroupChange={setSelectedGroup}
        groups={groups}
        onAdd={handleAddScene}
        onKeyPress={handleSceneDialogKeyPress}
      />

      <ViewConfigEditDialog
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
        onImportStyle={() => {
          // TODO: Implement import style functionality
          toast.info('Funcionalidade de importar estilo em desenvolvimento');
        }}
      />

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            Cenas
            {isLoading && <Loader2 className='w-4 h-4 animate-spin' />}
          </h2>
          <div className='flex items-center gap-2'>
            <ViewConfigMenu
              isBusy={isBusy}
              entityLabel='Cena'
              onAddGroup={() => setIsGroupDialogOpen(true)}
              onAddItem={() => setIsSceneDialogOpen(true)}
              onLoadFromJson={loadFromJson}
              onLoadDefault={loadDefault}
              onLoadFromFile={loadFromFile}
              onSaveToJson={saveToJson}
            />
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
    </>
  );
}

export default React.memo(ScenesComponent);
