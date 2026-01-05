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
import { Search, X } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog';

interface ViewConfigEditDialogProps {
  title: string;
  itemTitle: string;
  itemCode?: string;
  style: string;
  isOpen: boolean;
  onSave: () => void;
  isBusy?: boolean;
  onCancel: () => void;
  cameraType: string;
  activeLayers: string[];
  onOpenChange: (open: boolean) => void;
  onStyleChange: (style: string) => void;
  onImportStyle?: () => void;
  availableStyles: string[];
  availableLayers: string[];
  onSelectNoLayers: () => void;
  onSelectAllLayers: () => void;
  onCameraTypeChange: (type: string) => void;
  onApplyCurrentState: () => void;
  onActiveLayersChange: (layers: string[]) => void;
  allowedCameraTypes: string[];
  onItemTitleChange?: (title: string) => void;
  onItemCodeChange?: (code: string) => void;
}

const CAMERA_TYPE_LABELS: Record<string, string> = {
  iso_perspectiva: '📐 Isométrica + Perspectiva',
  iso_ortogonal: '📐 Isométrica + Ortogonal',
  iso_invertida_perspectiva: '🔄 Vista Invertida + Perspectiva',
  iso_invertida_ortogonal: '🔄 Vista Invertida + Ortogonal',
  topo_perspectiva: '⬇️ Vista de Topo + Perspectiva',
  topo_ortogonal: '⬇️ Vista de Topo + Ortogonal',
};

export function ViewConfigEditDialog({
  title,
  itemTitle,
  itemCode,
  isOpen,
  style,
  isBusy = false,
  cameraType,
  activeLayers,
  availableLayers,
  availableStyles,
  allowedCameraTypes,
  onSave,
  onCancel,
  onOpenChange,
  onStyleChange,
  // onImportStyle,
  // onSelectNoLayers,
  // onSelectAllLayers,
  onCameraTypeChange,
  onActiveLayersChange,
  onApplyCurrentState,
  onItemTitleChange,
  onItemCodeChange,
}: ViewConfigEditDialogProps) {
  const [layerFilter, setLayerFilter] = useState('');

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
      onActiveLayersChange([...activeLayers, layer]);
    } else {
      onActiveLayersChange(activeLayers.filter((l) => l !== layer));
    }
  };

  const handleSelectAllFiltered = () => {
    const newActiveLayers = [...new Set([...activeLayers, ...filteredLayers])];
    onActiveLayersChange(newActiveLayers);
  };

  const handleSelectNoneFiltered = () => {
    const newActiveLayers = activeLayers.filter(
      (layer) => !filteredLayers.includes(layer)
    );
    onActiveLayersChange(newActiveLayers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] h-[95vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>{title}</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-2 py-2 overflow-y-auto flex-1'>
          {(onItemTitleChange || onItemCodeChange) && (
            <div className='flex gap-3'>
              {onItemTitleChange && (
                <div className='flex-1'>
                  <Input
                    id='item-title'
                    label='Nome'
                    type='text'
                    placeholder='Nome da configuração'
                    value={itemTitle}
                    onChange={(e) => onItemTitleChange(e.target.value)}
                  />
                </div>
              )}

              {onItemCodeChange && (
                <div className='flex-1'>
                  <Input
                    id='item-code'
                    type='text'
                    label='Código'
                    placeholder='Ex: gnrl, draw, plans'
                    value={itemCode || ''}
                    onChange={(e) =>
                      onItemCodeChange(
                        e.target.value.toLowerCase().replace(/\s+/g, '_')
                      )
                    }
                  />
                </div>
              )}
            </div>
          )}

          <div className='w-full flex items-end justify-between gap-x-3'>
            <Select label='Estilo' value={style} onValueChange={onStyleChange}>
              <SelectTrigger id='item-style-trigger'>
                <SelectValue placeholder='Selecione um estilo' />
              </SelectTrigger>
              <SelectContent>
                {availableStyles.map((styleOption) => (
                  <SelectItem key={styleOption} value={styleOption}>
                    {styleOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-1.5'>
            <Select
              value={cameraType}
              onValueChange={onCameraTypeChange}
              label='Tipo de Câmera'
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione o tipo de câmera' />
              </SelectTrigger>
              <SelectContent>
                {allowedCameraTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {CAMERA_TYPE_LABELS[type] || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <label className='flex items-center gap-2 text-sm font-semibold text-foreground'>
              Camadas Ativas
            </label>

            <div className='relative'>
              <Input
                leftIcon={<Search className='w-4 h-4 text-muted-foreground' />}
                rightIcon={
                  layerFilter && (
                    <X
                      className='w-4 h-4 text-muted-foreground cursor-pointer'
                      onClick={() => setLayerFilter('')}
                    />
                  )
                }
                type='text'
                placeholder='Filtrar camadas...'
                value={layerFilter}
                onChange={(e) => setLayerFilter(e.target.value)}
                className='pl-9'
              />
              {layerFilter && (
                <X
                  className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer'
                  onClick={() => setLayerFilter('')}
                />
              )}
            </div>

            <div className='flex items-center gap-2 flex-wrap'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleSelectAllFiltered}
                className='h-8 text-xs flex-1'
              >
                Todos
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleSelectNoneFiltered}
                className='h-8 text-xs flex-1'
              >
                Nenhum
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={onApplyCurrentState}
                disabled={isBusy}
                className='h-8 text-xs flex-1'
              >
                Estado Atual
              </Button>
            </div>
            <div className=' max-h-[188px] overflow-y-auto p-3 bg-muted/30 rounded-xl border border-border/50'>
              {filteredLayers.length > 0 ? (
                <div className='space-y-1.5'>
                  {filteredLayers.map((layer) => (
                    <div key={layer} className='flex items-center space-x-2'>
                      <Checkbox
                        id={`layer-${layer}`}
                        checked={activeLayers.includes(layer)}
                        onCheckedChange={(checked) =>
                          handleLayerToggle(layer, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`layer-${layer}`}
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
            variant='outline'
            onClick={onCancel}
            className='flex-1'
          >
            Cancelar
          </Button>
          <Button onClick={onSave} size='sm' className='flex-1'>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
