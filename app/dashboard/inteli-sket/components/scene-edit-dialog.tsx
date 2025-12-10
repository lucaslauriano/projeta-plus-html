'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog';

interface SceneEditDialogProps {
  style: string;
  isOpen: boolean;
  onSave: () => void;
  isBusy?: boolean;
  onCancel: () => void;
  sceneTitle: string;
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
}

export function SceneEditDialog({
  isOpen,
  style,
  onSave,
  isBusy = false,
  onCancel,
  sceneTitle,
  cameraType,
  activeLayers,
  onOpenChange,
  onImportStyle,
  onStyleChange,
  availableLayers,
  availableStyles,
  onSelectNoLayers,
  onSelectAllLayers,
  onCameraTypeChange,
  onActiveLayersChange,
  onApplyCurrentState,
}: SceneEditDialogProps) {
  const handleLayerToggle = (layer: string, checked: boolean) => {
    if (checked) {
      onActiveLayersChange([...activeLayers, layer]);
    } else {
      onActiveLayersChange(activeLayers.filter((l) => l !== layer));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            Configuração da Cena: {sceneTitle}
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 py-4'>
          <div className='w-full flex items-end justify-between gap-x-4'>
            <div className='space-y-2 w-2/3 items-center justify-center'>
              <label className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                Estilo:
              </label>
              <Select value={style} onValueChange={onStyleChange}>
                <SelectTrigger className='h-11 rounded-xl border-2 w-full'>
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
            {onImportStyle && (
              <Button
                size='sm'
                variant='outline'
                onClick={onImportStyle}
                className='w-fit'
              >
                <Upload className='w-4 h-4' />
              </Button>
            )}
          </div>

          <div className='space-y-2'>
            <label className='flex items-center gap-2 text-sm font-semibold text-foreground'>
              Tipo de Câmera:
            </label>
            <Select value={cameraType} onValueChange={onCameraTypeChange}>
              <SelectTrigger className='h-11 rounded-xl border-2 w-full'>
                <SelectValue placeholder='Selecione o tipo de câmera' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='iso_perspectiva'>
                  📐 Isométrica + Perspectiva
                </SelectItem>
                <SelectItem value='iso_ortogonal'>
                  📐 Isométrica + Ortogonal
                </SelectItem>
                <SelectItem value='iso_invertida_perspectiva'>
                  🔄 Vista Invertida + Perspectiva
                </SelectItem>
                <SelectItem value='iso_invertida_ortogonal'>
                  🔄 Vista Invertida + Ortogonal
                </SelectItem>
                <SelectItem value='topo_perspectiva'>
                  ⬇️ Vista de Topo + Perspectiva
                </SelectItem>
                <SelectItem value='topo_ortogonal'>
                  ⬇️ Vista de Topo + Ortogonal
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-3'>
            <label className='flex items-center gap-2 text-sm font-semibold text-foreground'>
              Camadas Ativas ({availableLayers.length} disponíveis):
            </label>
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' onClick={onSelectAllLayers}>
                Todos
              </Button>
              <Button variant='outline' size='sm' onClick={onSelectNoLayers}>
                Nenhum
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={onApplyCurrentState}
                disabled={isBusy}
              >
                Estado Atual
              </Button>
            </div>
            <div className='space-y-2 max-h-[200px] overflow-y-auto p-4 bg-muted/30 rounded-xl border border-border/50'>
              <div className='space-y-2'>
                {availableLayers.map((layer) => (
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
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {layer}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
