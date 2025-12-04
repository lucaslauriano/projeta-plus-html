'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  FileText,
  X,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  PlusCircle,
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

interface Plan {
  id: string;
  title: string;
  segments: Segment[];
}

const DEFAULT_PLANS: Plan[] = [
  { id: '1', title: 'Detalhamento', segments: [] },
  { id: '2', title: 'Cenas Básicas', segments: [] },
  { id: '3', title: 'Plantas', segments: [] },
  { id: '4', title: 'Civil', segments: [] },
  { id: '5', title: 'Revestimentos', segments: [] },
  { id: '6', title: 'Pontos Técnicos', segments: [] },
  { id: '7', title: 'Iluminação', segments: [] },
  { id: '8', title: 'Forro', segments: [] },
];

export default function PlansComponent() {
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState<{
    [planId: string]: string;
  }>({});

  const handleAddSegment = (planId: string) => {
    const segmentName = newSegmentName[planId]?.trim();
    if (!segmentName) {
      toast.error('Digite um nome para a segmentação');
      return;
    }

    setPlans(
      plans.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            segments: [
              ...plan.segments,
              { id: Date.now().toString(), name: segmentName },
            ],
          };
        }
        return plan;
      })
    );

    setNewSegmentName({ ...newSegmentName, [planId]: '' });
    toast.success('Segmentação adicionada!');
  };

  const handleDeleteSegment = (planId: string, segmentId: string) => {
    const confirmed = confirm('Deseja realmente remover esta segmentação?');
    if (!confirmed) return;

    setPlans(
      plans.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            segments: plan.segments.filter((seg) => seg.id !== segmentId),
          };
        }
        return plan;
      })
    );

    toast.success('Segmentação removida!');
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

    setPlans([...plans, newPlan]);
    setNewPlanTitle('');
    setIsCreateDialogOpen(false);
    toast.success('Planta adicionada com sucesso!');
  };

  const handleDeletePlan = (id: string) => {
    const confirmed = confirm('Deseja realmente remover esta planta?');
    if (!confirmed) return;

    setPlans(plans.filter((plan) => plan.id !== id));
    toast.success('Planta removida com sucesso!');
  };

  const handleDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlan();
    }
  };

  return (
    <>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Planta</DialogTitle>
            <DialogDescription>
              Digite o título da nova planta que você deseja adicionar.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Input
                id='plan-title'
                placeholder='Ex: Planta de Situação'
                value={newPlanTitle}
                onChange={(e) => setNewPlanTitle(e.target.value)}
                onKeyPress={handleDialogKeyPress}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsCreateDialogOpen(false);
                setNewPlanTitle('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddPlan}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            <FileText className='w-4 h-4' />
            Plantas
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='p-1 hover:bg-muted rounded-md transition-colors'>
                <MoreVertical className='w-4 h-4 text-muted-foreground' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem
                className='cursor-pointer justify-between'
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Criar
                <PlusCircle className='w-4 h-4 mr-2 ' />
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-foreground justify-between focus:text-foreground cursor-pointer'
                onClick={() => setPlans([])}
              >
                Deletar Todas
                <Trash2 className='w-4 h-4 mr-2' />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {plans.length > 0 && (
          <div className='space-y-4'>
            <Accordion type='single' collapsible className='w-full space-y-2'>
              {plans.map((plan) => (
                <AccordionItem
                  key={plan.id}
                  value={plan.id}
                  className='border rounded-xl overflow-hidden bg-muted/20 px-0'
                >
                  <AccordionTrigger className='px-4 py-3 hover:no-underline bg-muted/50 data-[state=open]:bg-muted/70 group'>
                    <div className='flex items-center justify-between w-full pr-2'>
                      <div className='flex items-center gap-2 font-medium text-sm'>
                        <FileText className='w-4 h-4 text-primary' />
                        {plan.title}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan.id);
                        }}
                        className='opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity p-1'
                        title='Excluir planta'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='p-4'>
                    <div className='space-y-3'>
                      <div className='flex gap-2 items-end'>
                        <Input
                          type='text'
                          placeholder='Criar Novo'
                          value={newSegmentName[plan.id] || ''}
                          onChange={(e) =>
                            setNewSegmentName({
                              ...newSegmentName,
                              [plan.id]: e.target.value,
                            })
                          }
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddSegment(plan.id);
                            }
                          }}
                          className='flex-1'
                        />
                        <Button
                          size='icon'
                          variant='default'
                          onClick={() => handleAddSegment(plan.id)}
                        >
                          <Plus className='w-4 h-4' />
                        </Button>
                      </div>

                      <div className='space-y-2'>
                        {plan.segments.map((segment) => (
                          <div
                            key={segment.id}
                            className='flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors'
                          >
                            <span className='text-sm font-medium'>
                              {segment.name}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className='p-1 hover:bg-accent rounded-md transition-colors'>
                                  <MoreVertical className='w-4 h-4 text-muted-foreground' />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end' className='w-40'>
                                <DropdownMenuItem
                                  className='text-destructive focus:text-destructive cursor-pointer'
                                  onClick={() =>
                                    handleDeleteSegment(plan.id, segment.id)
                                  }
                                >
                                  <Trash2 className='w-4 h-4 mr-2' />
                                  Deletar
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer'>
                                  <PlusCircle className='w-4 h-4 mr-2 text-green-600' />
                                  Criar
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer'>
                                  <Edit className='w-4 h-4 mr-2 text-orange-600' />
                                  Editar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>

                      {plan.segments.length === 0 && (
                        <div className='text-center py-4 text-sm text-muted-foreground italic'>
                          Nenhuma segmentação adicionada
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {plans.length === 0 && (
          <div className='p-8 text-center border-2 border-dashed rounded-xl bg-muted/10'>
            <FileText className='w-12 h-12 mx-auto mb-3 text-muted-foreground/50' />
            <p className='text-sm text-muted-foreground'>
              Nenhuma planta cadastrada
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              Adicione uma planta para começar
            </p>
          </div>
        )}
      </div>
    </>
  );
}
