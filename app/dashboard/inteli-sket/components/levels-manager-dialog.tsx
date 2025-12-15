'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Loader2,
  Building2,
  Check,
  Trash2,
  Settings2,
} from 'lucide-react';
import { useLevels } from '@/hooks/useLevels';
import { toast } from 'sonner';
import { BasePlansConfigDialog } from './base-plans-config-dialog';
import { useBasePlans } from '@/hooks/useBasePlans';

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

interface LevelsManagerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LevelsManagerDialog({
  isOpen,
  onOpenChange,
}: LevelsManagerDialogProps) {
  const {
    levels,
    isBusy,
    addLevel,
    removeLevel,
    createBaseScene,
    createCeilingScene,
  } = useLevels();

  const {
    data: basePlansData,
    availableStyles,
    availableLayers,
    savePlans,
    isBusy: isBusyPlans,
  } = useBasePlans();

  const [heightInput, setHeightInput] = useState('0.00');
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [baseStyle, setBaseStyle] = useState('FM_VISTAS');
  const [baseLayers, setBaseLayers] = useState<string[]>(['Layer0']);
  const [ceilingStyle, setCeilingStyle] = useState('FM_VISTAS');
  const [ceilingLayers, setCeilingLayers] = useState<string[]>(['Layer0']);
  const [isInitialized, setIsInitialized] = useState(false);

  // Função para salvar as configurações
  const saveConfig = async (showToast: boolean = false) => {
    const plans = [
      {
        id: 'base',
        name: 'Base',
        style: baseStyle,
        activeLayers: baseLayers,
      },
      {
        id: 'forro',
        name: 'Forro',
        style: ceilingStyle,
        activeLayers: ceilingLayers,
      },
    ];

    console.log('[LevelsManagerDialog] Salvando configurações:', plans);
    await savePlans(plans, showToast);
  };

  // Funções que salvam após alteração
  const handleBaseStyleChange = (style: string) => {
    setBaseStyle(style);
    if (isInitialized) {
      setTimeout(() => {
        saveConfig(false); // Não mostrar toast no salvamento automático
      }, 100);
    }
  };

  const handleBaseLayersChange = (layers: string[]) => {
    setBaseLayers(layers);
    if (isInitialized) {
      setTimeout(() => {
        saveConfig(false); // Não mostrar toast no salvamento automático
      }, 100);
    }
  };

  const handleCeilingStyleChange = (style: string) => {
    setCeilingStyle(style);
    if (isInitialized) {
      setTimeout(() => {
        saveConfig(false); // Não mostrar toast no salvamento automático
      }, 100);
    }
  };

  const handleCeilingLayersChange = (layers: string[]) => {
    setCeilingLayers(layers);
    if (isInitialized) {
      setTimeout(() => {
        saveConfig(false); // Não mostrar toast no salvamento automático
      }, 100);
    }
  };

  function handleAddLevel() {
    const height = parseFloat(heightInput.replace(',', '.'));

    if (isNaN(height)) {
      toast.error('Digite uma altura válida');
      return;
    }

    addLevel(height);
    setHeightInput('0.00');
  }

  // Load initial data from JSON
  useEffect(() => {
    if (basePlansData.plans.length > 0 && !isInitialized) {
      const basePlan = basePlansData.plans.find((p) => p.id === 'base');
      const ceilingPlan = basePlansData.plans.find((p) => p.id === 'forro');

      if (basePlan) {
        setBaseStyle(basePlan.style);
        setBaseLayers(basePlan.activeLayers);
      }
      if (ceilingPlan) {
        setCeilingStyle(ceilingPlan.style);
        setCeilingLayers(ceilingPlan.activeLayers);
      }

      setIsInitialized(true);
    }
  }, [basePlansData, isInitialized]);

  function formatHeight(meters: number): string {
    return meters.toFixed(2) + 'm';
  }

  const handleApplyCurrentState = () => {
    // TODO: Implementar lógica para aplicar o estado atual do modelo
    toast.info('Aplicando estado atual...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-h-[900px] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <div>
              <DialogTitle className='flex text-start gap-2 text-xl'>
                Gerenciador de Níveis
              </DialogTitle>
              <DialogDescription className='text-start text-sm text-muted-foreground'>
                Configure os níveis do projeto e crie as cenas de planta baixa e
                forro
              </DialogDescription>
            </div>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setIsConfigDialogOpen(true)}
              className='flex items-center gap-2'
            >
              <Settings2 className='w-4 h-4' />
              Configurar Plantas
            </Button>
          </div>
        </DialogHeader>

        <div className='space-y-3 w-full'>
          <div className='flex gap-4 items-end justify-between'>
            <div className='w-full'>
              <Input
                id='height'
                type='text'
                label='Altura do Nível (m)'
                value={heightInput}
                onChange={(e) => setHeightInput(e.target.value)}
                className='h-8'
                placeholder='Ex: 0.00'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddLevel();
                  }
                }}
              />
            </div>

            <Button
              size='sm'
              variant='default'
              onClick={handleAddLevel}
              disabled={isBusy}
            >
              {isBusy ? (
                <Loader2 className='w-4 h-4 animate-spin ' />
              ) : (
                <Plus className='w-4 h-4 ' />
              )}
              Adicionar
            </Button>
          </div>

          {levels.length === 0 ? (
            <div className='w-full text-center py-12 text-muted-foreground'>
              <Building2 className='w-16 h-16 mx-auto mb-4 opacity-20' />
              <p className='text-lg mb-2'>Nenhum nível cadastrado ainda</p>
              <p className='text-sm'>
                Adicione o primeiro nível acima para começar
              </p>
            </div>
          ) : (
            <div className='border rounded-lg overflow-hidden w-full max-h-[400px] overflow-y-auto'>
              <Table className='w-full'>
                <TableHeader>
                  <TableRow className='bg-muted/50'>
                    <TableHead className='font-semibold'>Nível</TableHead>

                    <TableHead className='font-semibold'>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levels.map((level) => (
                    <TableRow key={level.number} className='hover:bg-muted/30'>
                      <TableCell className='font-medium'>
                        <span className='text-muted-foreground text-sm'>
                          {level.name}
                          <p className='flex items-center gap-2  text-muted-foreground text-sm'>
                            Nível: {formatHeight(level.height_meters)}
                          </p>
                        </span>
                      </TableCell>

                      <TableCell className='flex gap-2'>
                        <Button
                          size='sm'
                          className='cursor-pointer justify-between w-fit'
                          onClick={() => createBaseScene(level.number)}
                          disabled={isBusy}
                        >
                          {level.has_base ? (
                            <Check className='w-3 h-3 mr-2' />
                          ) : (
                            <Plus className='w-3 h-3 mr-2' />
                          )}
                          Base
                        </Button>

                        <Button
                          size='sm'
                          className='cursor-pointer justify-between w-fit'
                          onClick={() => createCeilingScene(level.number)}
                          disabled={isBusy}
                        >
                          {level.has_ceiling ? (
                            <Check className='w-3 h-3 mr-2' />
                          ) : (
                            <Plus className='w-3 h-3 mr-2' />
                          )}
                          Forro
                        </Button>

                        <Button
                          size='sm'
                          variant='destructive'
                          className='cursor-pointer justify-between w-fit'
                          onClick={() => removeLevel(level.number)}
                          disabled={isBusy}
                        >
                          <Trash2 className='w-3 h-3 mr-2' />
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>

      <BasePlansConfigDialog
        onSave={saveConfig}
        isOpen={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
        availableStyles={availableStyles}
        availableLayers={availableLayers}
        baseStyle={baseStyle}
        baseLayers={baseLayers}
        ceilingStyle={ceilingStyle}
        ceilingLayers={ceilingLayers}
        onBaseStyleChange={handleBaseStyleChange}
        onBaseLayersChange={handleBaseLayersChange}
        onCeilingStyleChange={handleCeilingStyleChange}
        onCeilingLayersChange={handleCeilingLayersChange}
        onApplyCurrentState={handleApplyCurrentState}
        isBusy={isBusy || isBusyPlans}
      />
    </Dialog>
  );
}
