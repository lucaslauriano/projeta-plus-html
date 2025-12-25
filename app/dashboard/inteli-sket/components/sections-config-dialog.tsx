'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import { Upload, Search, X } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

interface SectionsConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableStyles: string[];
  availableLayers: string[];
  onImportStyle?: () => void;
  onSave: () => void;
  style: string;
  activeLayers: string[];
  onStyleChange: (style: string) => void;
  onLayersChange: (layers: string[]) => void;
  onApplyCurrentState: (availableLayers: string[]) => void;
  isBusy?: boolean;
}

export function SectionsConfigDialog({
  isOpen,
  onOpenChange,
  availableStyles,
  availableLayers,
  onImportStyle,
  style,
  onSave,
  activeLayers,
  onStyleChange,
  onLayersChange,
  onApplyCurrentState,
  isBusy = false,
}: SectionsConfigDialogProps) {
  const [layerFilter, setLayerFilter] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'none' | 'current'>(
    'all'
  );

  const filteredLayers = useMemo(() => {
    if (!layerFilter.trim()) {
      return availableLayers;
    }
    const searchTerm = layerFilter.toLowerCase();
    return availableLayers.filter((layer) =>
      layer.toLowerCase().includes(searchTerm)
    );
  }, [availableLayers, layerFilter]);

  const handleLayerToggle = (layer: string, checked: boolean) => {
    if (checked) {
      onLayersChange([...activeLayers, layer]);
    } else {
      onLayersChange(activeLayers.filter((l) => l !== layer));
    }
  };

  const handleSelectAllFiltered = () => {
    const newActiveLayers = [...new Set([...activeLayers, ...filteredLayers])];
    onLayersChange(newActiveLayers);
  };

  const handleSelectNoneFiltered = () => {
    const newActiveLayers = activeLayers.filter(
      (layer) => !filteredLayers.includes(layer)
    );
    onLayersChange(newActiveLayers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px] max-h-[90vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex text-start gap-2 '>
            Configurações de Seções
          </DialogTitle>
          <DialogDescription className='text-start text-sm text-muted-foreground'>
            Configure os estilos e camadas que serão usados na criação de todas
            as seções (Cortes Gerais, Vistas Automáticas e Cortes Individuais)
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-3 overflow-y-auto flex-1'>
          <div className='w-full flex items-end justify-between gap-x-3'>
            <div className='space-y-1.5 items-center justify-center w-full'>
              <label className='flex items-center gap-2 text-sm font-semibold text-foreground w-full'>
                Estilo:
              </label>
              <Select value={style} onValueChange={onStyleChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selecione um estilo' />
                </SelectTrigger>
                <SelectContent className='max-h-[200px]'>
                  {availableStyles.map((styleOption) => (
                    <SelectItem key={styleOption} value={styleOption}>
                      {styleOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {onImportStyle && (
              <Button
                size='sm'
                variant='outline'
                onClick={onImportStyle}
                className='w-fit h-9'
              >
                <Upload className='w-4 h-4' />
              </Button>
            )}
          </div>

          <div className='space-y-2'>
            <label className='flex items-center gap-2 text-sm font-semibold text-foreground'>
              Camadas Ativas
            </label>

            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Filtrar camadas...'
                value={layerFilter}
                onChange={(e) => setLayerFilter(e.target.value)}
                className='pl-9 '
              />
              {layerFilter && (
                <X
                  className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer'
                  onClick={() => setLayerFilter('')}
                />
              )}
            </div>

            <div className='flex items-center gap-2 flex-wrap mt-4'>
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size='sm'
                onClick={() => {
                  setFilterType('all');
                  handleSelectAllFiltered();
                }}
                className='h-8 text-xs rounded-4xl'
              >
                Todos
              </Button>
              <Button
                variant={filterType === 'none' ? 'default' : 'outline'}
                size='sm'
                onClick={() => {
                  setFilterType('none');
                  handleSelectNoneFiltered();
                }}
                className='h-8 text-xs rounded-4xl'
              >
                Nenhum
              </Button>
              <Button
                variant={filterType === 'current' ? 'default' : 'outline'}
                size='sm'
                onClick={() => {
                  setFilterType('current');
                  onApplyCurrentState(availableLayers);
                }}
                disabled={isBusy}
                className='h-8 text-xs rounded-4xl'
              >
                Estado Atual
              </Button>
            </div>
            <div className='space-y-1.5 max-h-[200px] overflow-y-auto p-3 bg-muted/30 rounded-md border border-border/50'>
              {filteredLayers.length > 0 ? (
                <div className='space-y-1.5'>
                  {filteredLayers.map((layer) => (
                    <div key={layer} className='flex items-center space-x-2'>
                      <Checkbox
                        id={`layer-sections-${layer}`}
                        checked={activeLayers.includes(layer)}
                        onCheckedChange={(checked) =>
                          handleLayerToggle(layer, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`layer-sections-${layer}`}
                        className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
                      >
                        {layer}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-3 text-xs text-muted-foreground italic'>
                  Nenhuma camada encontrada
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className='!flex !flex-row !justify-between gap-2 w-full'>
          <Button
            size='sm'
            className='flex-1'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
          <Button className='flex-1' onClick={onSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

