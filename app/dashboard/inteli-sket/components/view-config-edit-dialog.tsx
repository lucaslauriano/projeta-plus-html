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
import { Upload, Search } from 'lucide-react';
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
  onImportStyle,
  onStyleChange,
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
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>{title}</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-3 py-2 overflow-y-auto flex-1'>
          {/* Campo para editar o nome */}
          {onItemTitleChange && (
            <div className='space-y-1.5'>
              <label className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                Nome:
              </label>
              <Input
                type='text'
                placeholder='Nome da configuração'
                value={itemTitle}
                onChange={(e) => onItemTitleChange(e.target.value)}
                className='h-9 rounded-xl border-2'
              />
            </div>
          )}

          {/* Campo para editar o código */}
          {onItemCodeChange && (
            <div className='space-y-1.5'>
              <label className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                Código:
                <span className='text-xs text-muted-foreground font-normal'>
                  (usado como nome da cena)
                </span>
              </label>
              <Input
                type='text'
                placeholder='Ex: gnrl, draw, plans'
                value={itemCode || ''}
                onChange={(e) => onItemCodeChange(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                className='h-9 rounded-xl border-2'
              />
            </div>
          )}

          <div className='w-full flex items-end justify-between gap-x-3'>
            <div className='space-y-1.5 w-2/3 items-center justify-center'>
              <label className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                Estilo:
              </label>
              <Select value={style} onValueChange={onStyleChange}>
                <SelectTrigger className='h-9 rounded-xl border-2 w-full'>
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

          <div className='space-y-1.5'>
            <label className='flex items-center gap-2 text-sm font-semibold text-foreground'>
              Tipo de Câmera:
            </label>
            <Select value={cameraType} onValueChange={onCameraTypeChange}>
              <SelectTrigger className='h-9 rounded-xl border-2 w-full'>
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
              Camadas Ativas ({availableLayers.length} disponíveis
              {layerFilter && `, ${filteredLayers.length} filtradas`}):
            </label>

            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Filtrar camadas...'
                value={layerFilter}
                onChange={(e) => setLayerFilter(e.target.value)}
                className='pl-9 h-9 rounded-xl border-2'
              />
            </div>

            <div className='flex items-center gap-2 flex-wrap'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleSelectAllFiltered}
                className='h-8 text-xs'
              >
                Todos
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleSelectNoneFiltered}
                className='h-8 text-xs'
              >
                Nenhum
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={onApplyCurrentState}
                disabled={isBusy}
                className='h-8 text-xs'
              >
                Estado Atual
              </Button>
            </div>
            <div className='space-y-1.5 max-h-[150px] overflow-y-auto p-3 bg-muted/30 rounded-xl border border-border/50'>
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
        <DialogFooter>
          <Button variant='outline' onClick={onCancel} size='sm'>
            Cancelar
          </Button>
          <Button onClick={onSave} size='sm'>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
