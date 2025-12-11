'use client';

import React, { useState, useMemo } from 'react';
import { PlanItem } from '@/components/PlanItem';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Edit,
  Save,
  Trash2,
  Folder,
  Upload,
  Loader2,
  Download,
  FileText,
  PlusCircle,
  FolderPlus,
  MoreVertical,
  FolderOpen,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePlans, PlanGroup } from '@/hooks/usePlans';
import { PlanEditDialog } from './plan-edit-dialog';
import { AddGroupDialog, AddSceneDialog } from './scene-group-dialogs';
import {
  ScenesSkeleton,
  ScenesEmptyState,
  ScenesLoadingState,
} from './scenes-skeleton';

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
    setData,
    availableStyles,
    availableLayers,
    currentState,
    isBusy,
    isLoading,
    applyPlanConfig,
    saveToJson,
    loadFromJson,
    loadDefault,
    loadFromFile,
    getCurrentState,
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
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanStyle, setEditPlanStyle] = useState('');
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

    const newGroup: PlanGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      plans: [],
    };

    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setIsGroupDialogOpen(false);
    toast.success('Grupo adicionado com sucesso!');
  };

  const handleAddPlan = () => {
    if (!newPlanTitle.trim()) {
      toast.error('Digite um título para a planta');
      return;
    }

    const newPlan: Plan = {
      id: Date.now().toString(),
      title: newPlanTitle.trim(),
      segments: [],
    };

    if (selectedGroup === 'root') {
      const newGroup: PlanGroup = {
        id: Date.now().toString(),
        name: newPlanTitle.trim(),
        plans: [],
      };
      setGroups([...groups, newGroup]);
    } else {
      setGroups(
        groups.map((group) => {
          if (group.id === selectedGroup) {
            return {
              ...group,
              plans: [...group.plans, newPlan],
            };
          }
          return group;
        })
      );
    }

    setNewPlanTitle('');
    setIsPlanDialogOpen(false);
    toast.success('Planta adicionada com sucesso!');
  };

  const handleDeleteGroup = (groupId: string) => {
    const confirmed = confirm(
      'Deseja realmente remover este grupo e todas as suas plantas?'
    );
    if (!confirmed) return;

    setGroups(groups.filter((group) => group.id !== groupId));
    toast.success('Grupo removido com sucesso!');
  };

  const handleDeletePlan = (groupId: string, planId: string) => {
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
    toast.success('Planta removida com sucesso!');
  };

  const handleDuplicatePlan = (groupId: string, plan: Plan) => {
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
        onCancel={() => {
          setIsEditDialogOpen(false);
          setEditingPlan(null);
        }}
        onSelectAllLayers={handleSelectAllLayers}
        onSelectNoLayers={handleSelectNoLayers}
        onApplyCurrentState={handleApplyCurrentState}
      />

      <div className='flex flex-col gap-4 h-full'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            {isLoading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <FileText className='w-4 h-4' />
            )}
            Plantas
          </h2>
          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='p-2 hover:bg-accent rounded-md transition-colors'>
                  <Download className='w-4 h-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={loadFromJson}>
                  <FolderOpen className='w-4 h-4 mr-2' />
                  Carregar Salvo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={loadDefault}>
                  <Download className='w-4 h-4 mr-2' />
                  Carregar Padrão
                </DropdownMenuItem>
                <DropdownMenuItem onClick={loadFromFile}>
                  <Upload className='w-4 h-4 mr-2' />
                  Importar Arquivo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={saveToJson}
              className='p-2 hover:bg-accent rounded-md transition-colors'
            >
              <Save className='w-4 h-4' />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='p-2 hover:bg-accent rounded-md transition-colors'>
                  <PlusCircle className='w-4 h-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setIsGroupDialogOpen(true)}>
                  <FolderPlus className='w-4 h-4 mr-2' />
                  Adicionar Grupo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsPlanDialogOpen(true)}>
                  <FileText className='w-4 h-4 mr-2' />
                  Adicionar Planta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading && sortedGroups.length === 0 && <ScenesLoadingState />}

        {isLoading && sortedGroups.length > 0 && <ScenesSkeleton />}

        {!isLoading && sortedGroups.length === 0 && <ScenesEmptyState />}

        {!isLoading && sortedGroups.length > 0 && (
          <Accordion
            type='multiple'
            defaultValue={sortedGroups.map((g) => g.id)}
            className='w-full space-y-2'
          >
            {sortedGroups.map((group) => (
              <AccordionItem
                key={group.id}
                value={group.id}
                className='border rounded-lg overflow-hidden bg-card'
              >
                <AccordionTrigger className='px-4 py-3 hover:bg-accent/5 transition-colors hover:no-underline'>
                  <div className='flex items-center justify-between w-full pr-2'>
                    <div className='flex items-center gap-2'>
                      <Folder className='w-4 h-4 text-primary' />
                      <span className='font-medium'>{group.name}</span>
                      <span className='text-xs text-muted-foreground'>
                        ({group.plans.length})
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className='p-1 hover:bg-accent rounded-md transition-colors'
                        >
                          <MoreVertical className='w-4 h-4 text-muted-foreground' />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            const newName = prompt(
                              'Digite o novo nome:',
                              group.name
                            );
                            if (newName?.trim()) {
                              setGroups(
                                groups.map((g) =>
                                  g.id === group.id
                                    ? { ...g, name: newName.trim() }
                                    : g
                                )
                              );
                              toast.success('Grupo renomeado!');
                            }
                          }}
                        >
                          <Edit className='w-4 h-4 mr-2' />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-destructive focus:text-destructive'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group.id);
                          }}
                        >
                          <Trash2 className='w-4 h-4 mr-2' />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='px-4 pb-3 pt-1'>
                  <div className='space-y-2'>
                    {group.plans.map((plan) => (
                      <PlanItem
                        key={plan.id}
                        title={plan.title}
                        onEdit={() => handleEditPlan(plan)}
                        onLoadFromJson={() => handleApplyPlan(plan)}
                        onDuplicate={() => handleDuplicatePlan(group.id, plan)}
                        onDelete={() => handleDeletePlan(group.id, plan.id)}
                      />
                    ))}
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
