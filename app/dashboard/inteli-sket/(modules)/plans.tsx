'use client';

import React, { useState, useMemo } from 'react';
import { PlanItem } from '@/components/PlanItem';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Edit, Trash2, Folder, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePlans, PlanGroup } from '@/hooks/usePlans';
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
import { PlanEditDialog } from '@/app/dashboard/inteli-sket/components/plan-edit-dialog';

interface Segment {
  id: string;
  name: string;
}

interface Plan {
  id: string;
  title: string;
  segments: Segment[];
}

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

  const [newGroupName, setNewGroupName] = useState('');
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('root');
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLevelsDialogOpen, setIsLevelsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanStyle, setEditPlanStyle] = useState('');
  const [editCameraType, setEditCameraType] = useState('');
  const [editActiveLayers, setEditActiveLayers] = useState<string[]>([]);

  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => a.name.localeCompare(b.name)),
    [groups]
  );

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Digite um nome para o grupo');
      return;
    }

    const newGroup: PlanGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      plans: [],
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    setNewGroupName('');
    setIsGroupDialogOpen(false);

    await saveToJson();

    toast.success('Grupo adicionado com sucesso!');
  };

  const handleAddPlan = async () => {
    if (!newPlanTitle.trim()) {
      toast.error('Digite um título para a planta');
      return;
    }

    const newPlan: Plan = {
      id: Date.now().toString(),
      title: newPlanTitle.trim(),
      segments: [],
    };

    let updatedGroups: PlanGroup[];
    if (selectedGroup === 'root') {
      const newGroup: PlanGroup = {
        id: Date.now().toString(),
        name: newPlanTitle.trim(),
        plans: [],
      };
      updatedGroups = [...groups, newGroup];
      setGroups(updatedGroups);
    } else {
      updatedGroups = groups.map((group) => {
        if (group.id === selectedGroup) {
          return {
            ...group,
            plans: [...group.plans, newPlan],
          };
        }
        return group;
      });
      setGroups(updatedGroups);
    }

    setNewPlanTitle('');
    setIsPlanDialogOpen(false);

    await saveToJson();

    toast.success('Planta adicionada com sucesso!');
  };

  const handleDeleteGroup = async (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    const confirmed = confirm(
      `Deseja realmente remover o grupo "${group?.name}" e todas as suas ${
        group?.plans.length || 0
      } planta(s)?`
    );
    if (!confirmed) return;

    setGroups(groups.filter((group) => group.id !== groupId));

    await saveToJson();

    toast.success('Grupo removido com sucesso!');
  };

  const handleEditGroup = async (groupId: string) => {
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

    await saveToJson();

    toast.success('Grupo renomeado com sucesso!');
  };

  const handleDeletePlan = async (groupId: string, planId: string) => {
    const confirmed = confirm('Deseja realmente remover esta planta?');
    if (!confirmed) return;

    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            plans: group.plans.filter((plan) => plan.id !== planId),
          };
        }
        return group;
      })
    );

    await saveToJson();

    toast.success('Planta removida com sucesso!');
  };

  const handleDuplicatePlan = async (groupId: string, plan: Plan) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            plans: [
              ...g.plans,
              {
                id: Date.now().toString(),
                title: `${plan.title} (cópia)`,
                segments: [...plan.segments],
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

  const handleGroupDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGroup();
    }
  };

  const handlePlanDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlan();
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setEditPlanName(plan.title);

    const planConfig = data.plans.find(
      (p) => p.id === plan.id || p.name === plan.title
    );

    if (planConfig) {
      setEditPlanStyle(planConfig.style || availableStyles[0] || 'FM_PLANTAS');
      setEditCameraType(planConfig.cameraType || 'topo_ortogonal');
      setEditActiveLayers(planConfig.activeLayers || ['Layer0']);
    } else {
      setEditPlanStyle(availableStyles[0] || 'FM_PLANTAS');
      setEditCameraType('topo_ortogonal');
      setEditActiveLayers(['Layer0']);
    }

    setIsEditDialogOpen(true);
  };

  const handleApplyCurrentState = async () => {
    await getCurrentState();
    if (currentState) {
      setEditPlanStyle(currentState.style);
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

  const handleSaveEditPlan = async () => {
    if (!editPlanName.trim() || !editingPlan) {
      toast.error('Digite um nome para a planta');
      return;
    }

    const updatedPlans = data.plans.map((p) => {
      if (p.id === editingPlan.id || p.name === editingPlan.title) {
        return {
          ...p,
          name: editPlanName.trim(),
          style: editPlanStyle,
          cameraType: editCameraType,
          activeLayers: editActiveLayers,
        };
      }
      return p;
    });

    const planExists = data.plans.some(
      (p) => p.id === editingPlan.id || p.name === editingPlan.title
    );

    if (!planExists) {
      updatedPlans.push({
        id: editingPlan.id,
        name: editPlanName.trim(),
        style: editPlanStyle,
        cameraType: editCameraType,
        activeLayers: editActiveLayers,
      });
    }

    const updatedGroups = groups.map((g) => ({
      ...g,
      plans: g.plans.map((p) =>
        p.id === editingPlan.id ? { ...p, title: editPlanName.trim() } : p
      ),
    }));

    setData({
      groups: updatedGroups,
      plans: updatedPlans,
    });

    await saveToJson();

    setIsEditDialogOpen(false);
    setEditingPlan(null);
    toast.success('Configuração salva no JSON!');
  };

  const handleApplyPlan = async (plan: Plan) => {
    const planConfig = data.plans.find(
      (p) => p.id === plan.id || p.name === plan.title
    );

    if (!planConfig) {
      toast.error('Configuração da planta não encontrada no JSON');
      return;
    }

    await applyPlanConfig(plan.title, {
      style: planConfig.style,
      cameraType: planConfig.cameraType,
      activeLayers: planConfig.activeLayers,
    });

    toast.success(`Planta "${plan.title}" aplicada!`);
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
        isOpen={isPlanDialogOpen}
        onOpenChange={setIsPlanDialogOpen}
        sceneTitle={newPlanTitle}
        onSceneTitleChange={setNewPlanTitle}
        selectedGroup={selectedGroup}
        onSelectedGroupChange={setSelectedGroup}
        groups={groups}
        onAdd={handleAddPlan}
        onKeyPress={handlePlanDialogKeyPress}
      />

      <PlanEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        planTitle={editPlanName}
        style={editPlanStyle}
        onStyleChange={setEditPlanStyle}
        cameraType={editCameraType}
        onCameraTypeChange={setEditCameraType}
        activeLayers={editActiveLayers}
        onActiveLayersChange={setEditActiveLayers}
        availableStyles={availableStyles}
        availableLayers={availableLayers}
        isBusy={isBusy}
        onSave={handleSaveEditPlan}
        onPlanTitleChange={setEditPlanName}
        onCancel={() => {
          setIsEditDialogOpen(false);
          setEditingPlan(null);
        }}
        onSelectAllLayers={handleSelectAllLayers}
        onSelectNoLayers={handleSelectNoLayers}
        onApplyCurrentState={handleApplyCurrentState}
      />

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            Plantas {isLoading && <Loader2 className='w-4 h-4 animate-spin' />}
          </h2>
          <div className='flex items-center gap-2'>
            <ViewConfigMenu
              isBusy={isBusy}
              onAddItem={() => setIsPlanDialogOpen(true)}
              onAddGroup={() => setIsGroupDialogOpen(true)}
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
            className='w-full flex items-center gap-3 justify-center text-base'
            variant='default'
            onClick={() => setIsLevelsDialogOpen(true)}
          >
            <Plus className='w-5 h-5' />
            <span>Gerenciar Níveis</span>
          </Button>
        </div>

        <LevelsManagerDialog
          isOpen={isLevelsDialogOpen}
          onOpenChange={setIsLevelsDialogOpen}
        />

        {isLoading && sortedGroups.length === 0 && <ScenesLoadingState />}

        {isLoading && sortedGroups.length > 0 && <ScenesSkeleton />}

        {!isLoading && sortedGroups.length === 0 && <ScenesEmptyState />}

        {!isLoading && sortedGroups.length > 0 && (
          <Accordion type='single' collapsible className='w-full space-y-2'>
            {sortedGroups.map((group) => (
              <AccordionItem
                key={group.id}
                value={group.id}
                className='border rounded-xl overflow-hidden bg-muted/20 px-0'
              >
                <AccordionTrigger className='px-4 py-2 hover:no-underline bg-muted/50 data-[state=open]:bg-muted/70 group data-[state=open]:rounded-bl-none data-[state=open]:rounded-br-none'>
                  <div className='flex items-center justify-between w-full pr-2'>
                    <div className='flex items-center gap-2 font-medium text-sm'>
                      <Folder className='w-4 h-4 text-muted-foreground' />
                      {group.name}
                    </div>
                    <div className='flex  items-center justify-end gap-2 text-muted-foreground'>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGroup(group.id);
                        }}
                        className='opacity-0 group-hover:opacity-100 transition-opacity'
                        title='Editar'
                      >
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group.id);
                        }}
                        className='opacity-0 group-hover:opacity-100 transition-opacity'
                        title='Excluir pasta'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='p-4'>
                  <div className='space-y-3'>
                    {group.plans.length > 0 ? (
                      <div className='space-y-2'>
                        {group.plans.map((plan) => (
                          <PlanItem
                            key={plan.id}
                            title={plan.title}
                            onEdit={() => handleEditPlan(plan as Plan)}
                            onLoadFromJson={() => handleApplyPlan(plan as Plan)}
                            onDuplicate={() =>
                              handleDuplicatePlan(group.id, plan as Plan)
                            }
                            onDelete={() => handleDeletePlan(group.id, plan.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-4 text-sm text-muted-foreground italic'>
                        Nenhuma planta neste grupo
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </>
  );
}

export default React.memo(PlansComponent);
