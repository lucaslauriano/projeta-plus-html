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
import { useScenes } from '@/hooks/useScenes';
import { SceneEditDialog } from './scene-edit-dialog';
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

interface Scene {
  id: string;
  title: string;
  segments: Segment[];
}

interface Group {
  id: string;
  name: string;
  scenes: Scene[];
}

function ScenesComponent() {
  const {
    data,
    setData,
    availableStyles,
    availableLayers,
    currentState,
    isBusy,
    isLoading,
    addScene,
    updateScene,
    deleteScene,
    applySceneConfig,
    saveToJson,
    loadFromJson,
    loadDefault,
    loadFromFile,
    getCurrentState,
  } = useScenes();

  const groups = data.groups;
  const setGroups = (newGroups: Group[] | ((prev: Group[]) => Group[])) => {
    if (typeof newGroups === 'function') {
      setData((prev) => ({ ...prev, groups: newGroups(prev.groups) }));
    } else {
      setData((prev) => ({ ...prev, groups: newGroups }));
    }
  };

  const [newGroupName, setNewGroupName] = useState('');
  const [newSceneTitle, setNewSceneTitle] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('root');
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [editSceneName, setEditSceneName] = useState('');
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

    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      scenes: [],
    };

    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setIsGroupDialogOpen(false);
    toast.success('Grupo adicionado com sucesso!');
  };

  const handleAddScene = () => {
    if (!newSceneTitle.trim()) {
      toast.error('Digite um título para a cena');
      return;
    }

    const newScene: Scene = {
      id: Date.now().toString(),
      title: newSceneTitle.trim(),
      segments: [],
    };

    if (selectedGroup === 'root') {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: newSceneTitle.trim(),
        scenes: [],
      };
      setGroups([...groups, newGroup]);
    } else {
      setGroups(
        groups.map((group) => {
          if (group.id === selectedGroup) {
            return {
              ...group,
              scenes: [...group.scenes, newScene],
            };
          }
          return group;
        })
      );
    }

    setNewSceneTitle('');
    setIsSceneDialogOpen(false);
    toast.success('Cena adicionada com sucesso!');
  };

  const handleDeleteGroup = (groupId: string) => {
    const confirmed = confirm(
      'Deseja realmente remover este grupo e todas as suas cenas?'
    );
    if (!confirmed) return;

    setGroups(groups.filter((group) => group.id !== groupId));
    toast.success('Grupo removido com sucesso!');
  };

  const handleDeleteScene = (groupId: string, sceneId: string) => {
    const confirmed = confirm('Deseja realmente remover esta cena?');
    if (!confirmed) return;

    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            scenes: group.scenes.filter((scene) => scene.id !== sceneId),
          };
        }
        return group;
      })
    );
    toast.success('Cena removida com sucesso!');
  };

  const handleDuplicateScene = (groupId: string, scene: Scene) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            scenes: [
              ...g.scenes,
              {
                id: Date.now().toString(),
                title: `${scene.title} (cópia)`,
                segments: [...scene.segments],
              },
            ],
          };
        }
        return g;
      })
    );
    toast.success('Cena duplicada!');
  };

  const handleApplyScene = async (scene: Scene) => {
    // Buscar configuração da cena no data.scenes (do JSON)
    const sceneConfig = data.scenes.find(
      (s) => s.id === scene.id || s.name === scene.title
    );

    if (!sceneConfig) {
      toast.error('Configuração da cena não encontrada no JSON');
      return;
    }

    await applySceneConfig(scene.title, {
      style: sceneConfig.style,
      cameraType: sceneConfig.cameraType,
      activeLayers: sceneConfig.activeLayers,
    });

    toast.success(`Cena "${scene.title}" aplicada!`);
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

  const handleEditScene = (scene: Scene) => {
    setEditingScene(scene);
    setEditSceneName(scene.title);

    // Buscar configuração da cena no data.scenes (do JSON)
    const sceneConfig = data.scenes.find(
      (s) => s.id === scene.id || s.name === scene.title
    );

    if (sceneConfig) {
      setEditSceneStyle(sceneConfig.style || availableStyles[0] || 'FM_VISTAS');
      setEditCameraType(sceneConfig.cameraType || 'iso_perspectiva');
      setEditActiveLayers(sceneConfig.activeLayers || ['Layer0']);
    } else {
      setEditSceneStyle(availableStyles[0] || 'FM_VISTAS');
      setEditCameraType('iso_perspectiva');
      setEditActiveLayers(['Layer0']);
    }

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

    // Atualizar configuração no data.scenes (JSON)
    const updatedScenes = data.scenes.map((s) => {
      if (s.id === editingScene.id || s.name === editingScene.title) {
        return {
          ...s,
          name: editSceneName.trim(),
          style: editSceneStyle,
          cameraType: editCameraType,
          activeLayers: editActiveLayers,
        };
      }
      return s;
    });

    // Se a cena não existe no data.scenes, adicionar
    const sceneExists = data.scenes.some(
      (s) => s.id === editingScene.id || s.name === editingScene.title
    );

    if (!sceneExists) {
      updatedScenes.push({
        id: editingScene.id,
        name: editSceneName.trim(),
        style: editSceneStyle,
        cameraType: editCameraType,
        activeLayers: editActiveLayers,
      });
    }

    // Atualizar groups (UI)
    const updatedGroups = groups.map((g) => ({
      ...g,
      scenes: g.scenes.map((s) =>
        s.id === editingScene.id ? { ...s, title: editSceneName.trim() } : s
      ),
    }));

    // Atualizar estado local
    setData({
      groups: updatedGroups,
      scenes: updatedScenes,
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

      <SceneEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        sceneTitle={editingScene?.title || ''}
        style={editSceneStyle}
        onStyleChange={setEditSceneStyle}
        cameraType={editCameraType}
        onCameraTypeChange={setEditCameraType}
        activeLayers={editActiveLayers}
        onActiveLayersChange={setEditActiveLayers}
        availableStyles={availableStyles}
        availableLayers={availableLayers}
        isBusy={isBusy}
        onSave={handleSaveEditScene}
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
            {isLoading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <FileText className='w-4 h-4' />
            )}
            Cenas
          </h2>
          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='p-1 hover:bg-accent rounded-md transition-colors'>
                  <MoreVertical className='w-4 h-4 text-muted-foreground' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={() => setIsGroupDialogOpen(true)}
                >
                  <FolderPlus className='w-4 h-4 mr-2 ' />
                  Adicionar Grupo
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={() => setIsSceneDialogOpen(true)}
                >
                  <PlusCircle className='w-4 h-4 mr-2' />
                  Adicionar Cena
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={loadFromJson}
                >
                  <FolderOpen className='w-4 h-4 mr-2' />
                  Carregar Salvo
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={loadDefault}
                >
                  <Download className='w-4 h-4 mr-2' />
                  Carregar Padrão
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={loadFromFile}
                >
                  <Upload className='w-4 h-4 mr-2' />
                  Importar Arquivo
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={saveToJson}
                  disabled={isBusy}
                >
                  <Save className='w-4 h-4 mr-2' />
                  Salvar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading && sortedGroups.length > 0 && <ScenesSkeleton />}

        {!isLoading && sortedGroups.length > 0 && (
          <div className='space-y-4'>
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
                        <Folder className='w-4 h-4 text-gray-500' />
                        {group.name}
                      </div>
                      <div className='flex  items-center justify-end gap-2'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            //TODO: Implement edit folder method
                            //editFolderName(group.name);
                          }}
                          className='opacity-0 group-hover:opacity-100 transition-opacity'
                          title='Editar'
                        >
                          <Edit className='w-4 h-4' />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            //TODO: Implement delete folder method
                            //deleteFolder(group.name);
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
                      {group.scenes.length > 0 ? (
                        <div className='space-y-2'>
                          {group.scenes.map((scene) => (
                            <PlanItem
                              key={scene.id}
                              title={scene.title}
                              onEdit={() => handleEditScene(scene)}
                              onLoadFromJson={() => handleApplyScene(scene)}
                              onDuplicate={() =>
                                handleDuplicateScene(group.id, scene)
                              }
                              onDelete={() =>
                                handleDeleteScene(group.id, scene.id)
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <div className='text-center py-4 text-sm text-muted-foreground italic'>
                          Nenhuma cena neste grupo
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {isLoading && sortedGroups.length === 0 && <ScenesLoadingState />}

        {!isLoading && sortedGroups.length === 0 && <ScenesEmptyState />}
      </div>
    </>
  );
}

export default React.memo(ScenesComponent);
