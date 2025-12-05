'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlanItem } from '@/components/PlanItem';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  X,
  PlusCircle,
  FolderPlus,
  Folder,
  MoreVertical,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

const DEFAULT_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Cenas básicas',
    scenes: [
      { id: '1-1', title: 'Geral', segments: [] },
      { id: '1-2', title: 'Desenhar', segments: [] },
      { id: '1-3', title: 'Etiquetar', segments: [] },
      { id: '1-3', title: 'Planos de Seção', segments: [] },
    ],
  },
  {
    id: '2',
    name: 'Isométricas',
    scenes: [{ id: '2-1', title: 'Isométrica', segments: [] }],
  },
];

export default function ScenesComponent() {
  const [groups, setGroups] = useState<Group[]>(DEFAULT_GROUPS);
  const [newGroupName, setNewGroupName] = useState('');
  const [newSceneTitle, setNewSceneTitle] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('root');
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);

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

  return (
    <>
      {/* Dialog para Criar Grupo */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Grupo</DialogTitle>
            <DialogDescription>
              Organize suas cenas em grupos personalizados.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Input
                id='group-name'
                label='Nome do Grupo'
                placeholder='Ex: Arquitetônico'
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyPress={handleGroupDialogKeyPress}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsGroupDialogOpen(false);
                setNewGroupName('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddGroup}>
              <Folder className='w-4 h-4 mr-2' />
              Criar Grupo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Criar Cena */}
      <Dialog open={isSceneDialogOpen} onOpenChange={setIsSceneDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Cena</DialogTitle>
            <DialogDescription>
              Crie uma nova cena e escolha em qual grupo ela ficará.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Input
                id='scene-title'
                label='Nome da Cena'
                placeholder='Ex: Vista Frontal'
                value={newSceneTitle}
                onChange={(e) => setNewSceneTitle(e.target.value)}
                onKeyPress={handleSceneDialogKeyPress}
                autoFocus
              />
            </div>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-foreground'>
                Grupo (Opcional)
              </label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className='h-11 rounded-xl border-2 w-full'>
                  <SelectValue placeholder='Sem Grupo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='root'>Sem Grupo</SelectItem>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
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
                setIsSceneDialogOpen(false);
                setNewSceneTitle('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddScene}>
              <FileText className='w-4 h-4 mr-2' />
              Criar Cena
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            <FileText className='w-4 h-4' />
            Cenas
          </h2>
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
                <FolderPlus className='w-4 h-4 mr-2 text-blue-600' />
                Adicionar Grupo
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => setIsSceneDialogOpen(true)}
              >
                <PlusCircle className='w-4 h-4 mr-2 text-green-600' />
                Adicionar Cena
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {groups.length > 0 && (
          <div className='space-y-4'>
            <Accordion type='single' collapsible className='w-full space-y-2'>
              {groups.map((group) => (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className='border rounded-xl overflow-hidden bg-muted/20 px-0'
                >
                  <AccordionTrigger className='px-4 py-3 hover:no-underline bg-muted/50 data-[state=open]:bg-muted/70 group'>
                    <div className='flex items-center justify-between w-full pr-2'>
                      <div className='flex items-center gap-2 font-medium text-sm'>
                        <Folder className='w-4 h-4 text-gray-500' />
                        {group.name}
                        {/* {group.scenes.length > 0 && (
                          <span className='text-xs text-muted-foreground'>
                            ({group.scenes.length})
                          </span>
                        )} */}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group.id);
                        }}
                        className='opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity'
                        title='Excluir grupo'
                      >
                        <X className='w-4 h-4' />
                      </button>
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
                              onEdit={() => {
                                const newName = prompt(
                                  'Digite o novo nome:',
                                  scene.title
                                );
                                if (newName?.trim()) {
                                  setGroups(
                                    groups.map((g) => ({
                                      ...g,
                                      scenes: g.scenes.map((s) =>
                                        s.id === scene.id
                                          ? { ...s, title: newName.trim() }
                                          : s
                                      ),
                                    }))
                                  );
                                  toast.success('Cena editada!');
                                }
                              }}
                              onDuplicate={() => {
                                setGroups(
                                  groups.map((g) => {
                                    if (g.id === group.id) {
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
                              }}
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

        {groups.length === 0 && (
          <div className='p-8 text-center border-2 border-dashed rounded-xl bg-muted/10'>
            <FileText className='w-12 h-12 mx-auto mb-3 text-muted-foreground/50' />
            <p className='text-sm text-muted-foreground'>
              Nenhum grupo cadastrado
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              Adicione um grupo para começar
            </p>
          </div>
        )}
      </div>
    </>
  );
}
