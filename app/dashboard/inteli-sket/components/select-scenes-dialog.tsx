'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search, X, Filter } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

interface SelectScenesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableScenes: Array<{
    name: string;
    label?: string;
    description?: string;
  }>;
  selectedScenes: string[];
  onSelectedScenesChange: (scenes: string[]) => void;
  onConfirm: () => void;
  isBusy?: boolean;
}

export function SelectScenesDialog({
  isOpen,
  onOpenChange,
  availableScenes,
  selectedScenes,
  onSelectedScenesChange,
  onConfirm,
  isBusy = false,
}: SelectScenesDialogProps) {
  const [sceneFilter, setSceneFilter] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(
    null
  );

  const filteredScenes = useMemo(() => {
    let scenes = availableScenes;

    // Aplicar filtro rápido primeiro
    if (activeQuickFilter === 'ABCD') {
      // Cenas que terminam com A, B, C ou D (opcionalmente seguidas de números)
      scenes = scenes.filter((scene) =>
        /[_\s]?[ABCD](?:\d+)?$/i.test(scene.name)
      );
    } else if (activeQuickFilter === 'SUFFIX') {
      // Cenas que contêm "_" seguido de uma ou mais letras
      scenes = scenes.filter((scene) => /_[A-Za-z]+(?:\d+)?$/.test(scene.name));
    }

    // Aplicar filtro de busca por texto
    if (sceneFilter.trim()) {
      const searchTerm = sceneFilter.toLowerCase();
      scenes = scenes.filter((scene) =>
        scene.name.toLowerCase().includes(searchTerm)
      );
    }

    return scenes;
  }, [availableScenes, sceneFilter, activeQuickFilter]);

  const handleSceneToggle = (sceneName: string, checked: boolean) => {
    if (checked) {
      onSelectedScenesChange([...selectedScenes, sceneName]);
    } else {
      onSelectedScenesChange(selectedScenes.filter((s) => s !== sceneName));
    }
  };

  const handleSelectAll = () => {
    const allFiltered = filteredScenes.map((s) => s.name);
    const newSelection = [...new Set([...selectedScenes, ...allFiltered])];
    onSelectedScenesChange(newSelection);
  };

  const handleSelectNone = () => {
    const filtered = filteredScenes.map((s) => s.name);
    const newSelection = selectedScenes.filter((s) => !filtered.includes(s));
    onSelectedScenesChange(newSelection);
  };

  const handleQuickFilter = (filterType: string) => {
    if (activeQuickFilter === filterType) {
      setActiveQuickFilter(null); // Remove filter if already active
    } else {
      setActiveQuickFilter(filterType);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px] max-h-[90vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex text-start gap-2'>
            Selecionar Cenas para Duplicar
          </DialogTitle>
          <DialogDescription className='text-start text-sm text-muted-foreground'>
            Selecione as cenas que deseja duplicar com as configurações do
            segmento
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-3 overflow-y-auto flex-1'>
          <div className='relative'>
            <Input
              leftIcon={<Search className='w-4 h-4 text-muted-foreground' />}
              rightIcon={
                sceneFilter && (
                  <X
                    className='w-4 h-4 text-muted-foreground cursor-pointer'
                    onClick={() => setSceneFilter('')}
                  />
                )
              }
              type='text'
              placeholder='Filtrar cenas...'
              value={sceneFilter}
              onChange={(e) => setSceneFilter(e.target.value)}
              className='pl-9'
            />
            {sceneFilter && (
              <X
                className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer'
                onClick={() => setSceneFilter('')}
              />
            )}
          </div>

          <div className='flex items-center gap-2 flex-wrap'>
            <Filter className='w-3.5 h-3.5 text-muted-foreground' />
            <Button
              variant={activeQuickFilter === 'ABCD' ? 'default' : 'outline'}
              size='sm'
              onClick={() => handleQuickFilter('ABCD')}
              className='h-7 text-xs px-2'
            >
              ABCD
            </Button>
            <div className='h-4 w-px bg-border mx-1' />
            <Button
              variant='outline'
              size='sm'
              onClick={handleSelectAll}
              className='h-7 text-xs px-2'
            >
              Todos
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handleSelectNone}
              className='h-7 text-xs px-2'
            >
              Nenhum
            </Button>
            <span className='text-xs text-muted-foreground ml-auto'>
              {selectedScenes.length} selecionada(s)
            </span>
          </div>

          <div className='space-y-1.5 max-h-[300px] overflow-y-auto p-3 bg-muted/30 rounded-md border border-border/50'>
            {filteredScenes.length > 0 ? (
              <div className='space-y-1.5'>
                {filteredScenes.map((scene) => (
                  <div key={scene.name} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`scene-${scene.name}`}
                      checked={selectedScenes.includes(scene.name)}
                      onCheckedChange={(checked) =>
                        handleSceneToggle(scene.name, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`scene-${scene.name}`}
                      className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
                    >
                      {scene.name}
                      {scene.label && scene.label !== scene.name && (
                        <span className='text-muted-foreground ml-1'>
                          ({scene.label})
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-3 text-xs text-muted-foreground italic'>
                Nenhuma cena encontrada
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='!flex !flex-row !justify-between gap-2 w-full'>
          <Button
            size='sm'
            className='flex-1'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            size='sm'
            className='flex-1'
            onClick={onConfirm}
            disabled={isBusy || selectedScenes.length === 0}
          >
            Duplicar ({selectedScenes.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
