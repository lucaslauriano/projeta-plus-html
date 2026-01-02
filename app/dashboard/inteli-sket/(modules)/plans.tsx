'use client';

import React, { useMemo, useState } from 'react';
import { PlanItem } from '@/components/PlanItem';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePlans } from '@/hooks/usePlans';
import type { PlanGroup } from '@/hooks/usePlans';
import { GroupAccordion } from '@/app/dashboard/inteli-sket/components/group-accordion';
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
import { LevelsManagerDialog } from '@/app/dashboard/inteli-sket/components/levels-manager-dialog';
import { Button } from '@/components/ui/button';
import { ViewConfigEditDialog } from '@/app/dashboard/inteli-sket/components/view-config-edit-dialog';
import { BasePlansConfigDialog } from '@/app/dashboard/inteli-sket/components/base-plans-config-dialog';
import { GroupNameEditDialog } from '@/app/dashboard/inteli-sket/components/group-name-edit-dialog';
import { useBasePlans } from '@/hooks/useBasePlans';
import { usePlansDialogs } from '@/hooks/usePlansDialogs';
import { usePlanEditor } from '@/hooks/usePlanEditor';
import type { Plan } from '@/hooks/usePlanEditor';
import { useBasePlansConfig } from '@/hooks/useBasePlansConfig';

function PlansComponent() {
  const {
    data,
    isBusy,
    isLoading,
    currentState,
    availableStyles,
    availableLayers,
    setData,
    saveToJson,
    loadDefault,
    loadFromFile,
    loadFromJson,
    getCurrentState,
    applyPlanConfig,
  } = usePlans();

  const {
    data: basePlansData,
    availableStyles: bp_availableStyles,
    availableLayers: bp_availableLayerss,
    savePlans,
    isBusy: isBusyPlans,
  } = useBasePlans();

  // Hook para gerenciar dialogs
  const { groupDialog, planDialog, editDialog, levelsDialog, configDialog } =
    usePlansDialogs();

  // Hook para gerenciar base plans config
  const {
    baseStyle,
    baseLayers,
    ceilingStyle,
    ceilingLayers,
    updateBaseStyle,
    updateBaseLayers,
    updateCeilingStyle,
    updateCeilingLayers,
    saveConfig,
  } = useBasePlansConfig(
    basePlansData,
    savePlans as unknown as (
      plans: unknown,
      showToast?: boolean
    ) => Promise<void>
  );

  // Hook para gerenciar edição de plantas
  const editor = usePlanEditor(
    { groups: data.groups, plans: [] },
    availableStyles,
    availableLayers,
    getCurrentState,
    currentState,
    setData as (data: unknown) => void,
    saveToJson
  );

  const groups = data.groups;
  const setGroups = (
    newGroups: PlanGroup[] | ((prev: PlanGroup[]) => PlanGroup[])
  ) => {
    const updatedGroups =
      typeof newGroups === 'function' ? newGroups(data.groups) : newGroups;

    setData({
      ...data,
      groups: updatedGroups,
    });
  };

  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => a.name.localeCompare(b.name)),
    [groups]
  );

  // ========================================
  // STATE - Group Edit Dialog
  // ========================================
  const [isGroupEditDialogOpen, setIsGroupEditDialogOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');

  // ========================================
  // HANDLERS - Group Management
  // ========================================

  const handleAddGroup = async () => {
    if (!groupDialog.name.trim()) {
      toast.error('Digite um nome para o grupo');
      return;
    }

    const newGroup: PlanGroup = {
      id: Date.now().toString(),
      name: groupDialog.name.trim(),
      segments: [],
    };

    setGroups([...groups, newGroup]);
    groupDialog.reset();
    await saveToJson();
    toast.success('Grupo adicionado com sucesso!');
  };

  const handleDeleteGroup = async (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    const confirmed = confirm(
      `Deseja realmente remover o grupo "${group?.name}" e todas as suas ${
        (group?.segments || []).length
      } planta(s)?`
    );
    if (!confirmed) return;

    setGroups(groups.filter((g) => g.id !== groupId));
    await saveToJson();
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

    setGroups(
      groups.map((g) =>
        g.id === editingGroupId ? { ...g, name: editingGroupName.trim() } : g
      )
    );
    await saveToJson();
    toast.success('Grupo renomeado com sucesso!');
    setIsGroupEditDialogOpen(false);
    setEditingGroupId(null);
    setEditingGroupName('');
  };

  // ========================================
  // HANDLERS - Plan Management
  // ========================================

  const handleAddPlan = async () => {
    if (!planDialog.title.trim()) {
      toast.error('Digite um título para a planta');
      return;
    }

    const newSegment = {
      id: Date.now().toString(),
      name: planDialog.title.trim(),
      code: planDialog.title.trim().toLowerCase().replace(/\s+/g, '_'),
      style: currentState?.style || 'PRO_PLANTAS',
      cameraType: currentState?.cameraType || 'topo_ortogonal',
      activeLayers: currentState?.activeLayers || [],
    };

    if (planDialog.selectedGroup === 'root') {
      const newGroup: PlanGroup = {
        id: Date.now().toString(),
        name: planDialog.title.trim(),
        segments: [newSegment],
      };
      setGroups([...groups, newGroup]);
    } else {
      setGroups(
        groups.map((group) => {
          if (group.id === planDialog.selectedGroup) {
            return {
              ...group,
              segments: [...(group.segments || []), newSegment],
            };
          }
          return group;
        })
      );
    }

    planDialog.reset();
    await saveToJson();
    toast.success('Planta adicionada com sucesso!');
  };

  const handleDeletePlan = async (groupId: string, segmentId: string) => {
    const confirmed = confirm('Deseja realmente remover esta planta?');
    if (!confirmed) return;

    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            segments: (group.segments || []).filter(
              (segment) => segment.id !== segmentId
            ),
          };
        }
        return group;
      })
    );
    await saveToJson();
    toast.success('Planta removida com sucesso!');
  };

  const handleDuplicatePlan = async (groupId: string, segment: Plan) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            segments: [
              ...(g.segments || []),
              {
                ...segment,
                id: Date.now().toString(),
                name: `${segment.name!} (cópia)`,
              },
            ],
          };
        }
        return g;
      })
    );
    await saveToJson();
    toast.success('Planta duplicada!');
  };

  const handleApplyPlan = async (segment: Plan) => {
    // Segment já tem todas as configurações necessárias
    await applyPlanConfig(segment.name!, {
      style: segment.style,
      cameraType: segment.cameraType,
      activeLayers: segment.activeLayers,
    });

    toast.success(`Planta "${segment.name}" aplicada!`);
  };

  // ========================================
  // HANDLERS - Editor
  // ========================================

  const handleEditPlan = (plan: Plan) => {
    editor.openEditor(plan);
    editDialog.open(
      plan as unknown as {
        id: string;
        title: string;
        segments: { id: string; name: string }[];
      }
    );
  };

  const handleSaveEditPlan = async () => {
    const success = await editor.saveEdits(groups);
    if (success) {
      editDialog.close();
    }
  };

  const handleCancelEdit = () => {
    editor.closeEditor();
    editDialog.close();
  };

  // ========================================
  // HANDLERS - Keyboard
  // ========================================

  const handleGroupDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddGroup();
  };

  const handlePlanDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddPlan();
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <>
      <AddGroupDialog
        onAdd={handleAddGroup}
        isOpen={groupDialog.isOpen}
        groupName={groupDialog.name}
        onKeyPress={handleGroupDialogKeyPress}
        onOpenChange={groupDialog.setOpen}
        onGroupNameChange={groupDialog.setName}
      />

      <GroupNameEditDialog
        open={isGroupEditDialogOpen}
        onOpenChange={setIsGroupEditDialogOpen}
        groupName={editingGroupName}
        onGroupNameChange={setEditingGroupName}
        onConfirm={handleConfirmEditGroup}
        disabled={isBusy}
      />

      <AddSceneDialog
        onAdd={handleAddPlan}
        groups={groups}
        isOpen={planDialog.isOpen}
        onKeyPress={handlePlanDialogKeyPress}
        sceneTitle={planDialog.title}
        onOpenChange={planDialog.setOpen}
        selectedGroup={planDialog.selectedGroup}
        onSceneTitleChange={planDialog.setTitle}
        onSelectedGroupChange={planDialog.setSelectedGroup}
      />

      <ViewConfigEditDialog
        title='Configuração da Planta'
        style={editor.editPlanStyle}
        onSave={handleSaveEditPlan}
        isBusy={isBusy}
        isOpen={editDialog.isOpen}
        onCancel={handleCancelEdit}
        cameraType={editor.editCameraType}
        onOpenChange={editDialog.setOpen}
        activeLayers={editor.editActiveLayers}
        onStyleChange={editor.setEditPlanStyle}
        availableStyles={availableStyles}
        availableLayers={availableLayers}
        onSelectNoLayers={editor.selectNoLayers}
        onSelectAllLayers={editor.selectAllLayers}
        onCameraTypeChange={editor.setEditCameraType}
        onApplyCurrentState={editor.applyCurrentState}
        onActiveLayersChange={editor.setEditActiveLayers}
        itemTitle={editor.editPlanName}
        itemCode={editor.editPlanCode}
        onItemTitleChange={editor.setEditPlanName}
        onItemCodeChange={editor.setEditPlanCode}
        allowedCameraTypes={[
          'topo_perspectiva',
          'topo_ortogonal',
          'iso_invertida_perspectiva',
          'iso_invertida_ortogonal',
        ]}
      />

      <BasePlansConfigDialog
        onSave={() => saveConfig(true)}
        isOpen={configDialog.isOpen}
        isBusy={isBusy || isBusyPlans}
        baseStyle={baseStyle}
        baseLayers={baseLayers}
        onOpenChange={configDialog.setOpen}
        ceilingStyle={ceilingStyle}
        ceilingLayers={ceilingLayers}
        availableStyles={bp_availableStyles}
        availableLayers={bp_availableLayerss}
        onBaseStyleChange={updateBaseStyle}
        onBaseLayersChange={updateBaseLayers}
        onCeilingStyleChange={updateCeilingStyle}
        onCeilingLayersChange={updateCeilingLayers}
        onApplyCurrentState={() => toast.info('Aplicando estado atual...')}
      />

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            Plantas {isLoading && <Loader2 className='w-4 h-4 animate-spin' />}
          </h2>
          <div className='flex items-center gap-2'>
            <ViewConfigMenu
              isBusy={isBusy}
              onAddItem={planDialog.open}
              onAddGroup={groupDialog.open}
              onEdit={configDialog.open}
              entityLabel='Planta'
              onSaveToJson={saveToJson}
              onLoadDefault={loadDefault}
              onLoadFromJson={loadFromJson}
              onLoadFromFile={loadFromFile}
            />
          </div>
        </div>

        <div className='flex flex-col gap-3 w-full'>
          <Button
            size='sm'
            className='w-full flex items-center gap-3 justify-center'
            variant='default'
            onClick={levelsDialog.open}
          >
            <Plus className='w-5 h-5' />
            <span>Gerenciar Níveis</span>
          </Button>
        </div>

        <LevelsManagerDialog
          isOpen={levelsDialog.isOpen}
          onOpenChange={levelsDialog.setOpen}
        />

        {isLoading && sortedGroups.length === 0 && <ScenesLoadingState />}

        {isLoading && sortedGroups.length > 0 && <ScenesSkeleton />}

        {!isLoading && sortedGroups.length === 0 && <ScenesEmptyState />}

        {!isLoading && sortedGroups.length > 0 && (
          <GroupAccordion
            groups={sortedGroups}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
            emptyMessage='Nenhuma planta neste grupo'
            iconPosition='right'
            renderSegment={(segment, groupId) => (
              <PlanItem
                key={segment.id}
                title={segment.name}
                onEdit={() => handleEditPlan(segment as unknown as Plan)}
                onLoadFromJson={() =>
                  handleApplyPlan(segment as unknown as Plan)
                }
                onDuplicate={() =>
                  handleDuplicatePlan(groupId, segment as unknown as Plan)
                }
                onDelete={() => handleDeletePlan(groupId, segment.id)}
              />
            )}
          />
        )}
      </div>
    </>
  );
}

export default React.memo(PlansComponent);
