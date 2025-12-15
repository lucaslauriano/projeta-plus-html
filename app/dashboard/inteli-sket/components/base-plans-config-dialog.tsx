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
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface BasePlansConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableStyles: string[];
  availableLayers: string[];
  onImportStyle?: () => void;
  baseStyle: string;
  baseLayers: string[];
  ceilingStyle: string;
  ceilingLayers: string[];
  onBaseStyleChange: (style: string) => void;
  onBaseLayersChange: (layers: string[]) => void;
  onCeilingStyleChange: (style: string) => void;
  onCeilingLayersChange: (layers: string[]) => void;
  onApplyCurrentState: () => void;
  isBusy?: boolean;
}

export function BasePlansConfigDialog({
  isOpen,
  onOpenChange,
  availableStyles,
  availableLayers,
  onImportStyle,
  baseStyle,
  baseLayers,
  ceilingStyle,
  ceilingLayers,
  onBaseStyleChange,
  onBaseLayersChange,
  onCeilingStyleChange,
  onCeilingLayersChange,
  onApplyCurrentState,
  isBusy = false,
}: BasePlansConfigDialogProps) {
  const [layerFilter, setLayerFilter] = useState('');
  const [activeTab, setActiveTab] = useState('base');

  const filteredLayers = useMemo(() => {
    if (!layerFilter.trim()) {
      return availableLayers;
    }
    const searchTerm = layerFilter.toLowerCase();
    return availableLayers.filter((layer) =>
      layer.toLowerCase().includes(searchTerm)
    );
  }, [availableLayers, layerFilter]);

  const currentStyle = activeTab === 'base' ? baseStyle : ceilingStyle;
  const currentLayers = activeTab === 'base' ? baseLayers : ceilingLayers;

  const handleStyleChange = (style: string) => {
    if (activeTab === 'base') {
      onBaseStyleChange(style);
    } else {
      onCeilingStyleChange(style);
    }
  };

  const handleLayerToggle = (layer: string, checked: boolean) => {
    const updateLayers = activeTab === 'base' ? onBaseLayersChange : onCeilingLayersChange;
    const layers = activeTab === 'base' ? baseLayers : ceilingLayers;

    if (checked) {
      updateLayers([...layers, layer]);
    } else {
      updateLayers(layers.filter((l) => l !== layer));
    }
  };

  const handleSelectAllFiltered = () => {
    const updateLayers = activeTab === 'base' ? onBaseLayersChange : onCeilingLayersChange;
    const layers = activeTab === 'base' ? baseLayers : ceilingLayers;
    const newActiveLayers = [...new Set([...layers, ...filteredLayers])];
    updateLayers(newActiveLayers);
  };

  const handleSelectNoneFiltered = () => {
    const updateLayers = activeTab === 'base' ? onBaseLayersChange : onCeilingLayersChange;
    const layers = activeTab === 'base' ? baseLayers : ceilingLayers;
    const newActiveLayers = layers.filter(
      (layer) => !filteredLayers.includes(layer)
    );
    updateLayers(newActiveLayers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px] max-h-[90vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            Configurações das Plantas Base e Forro
          </DialogTitle>
          <DialogDescription className='text-start text-sm text-muted-foreground'>
            Configure os estilos e camadas que serão usados nas plantas de base e forro
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='base'>Planta Base</TabsTrigger>
            <TabsTrigger value='ceiling'>Planta de Forro</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className='flex flex-col gap-3 py-2 overflow-y-auto flex-1'>
            <div className='w-full flex items-end justify-between gap-x-3'>
              <div className='space-y-1.5 w-2/3 items-center justify-center'>
                <label className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                  Estilo:
                </label>
                <Select value={currentStyle} onValueChange={handleStyleChange}>
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
              <div className='space-y-1.5 max-h-[200px] overflow-y-auto p-3 bg-muted/30 rounded-xl border border-border/50'>
                {filteredLayers.length > 0 ? (
                  <div className='space-y-1.5'>
                    {filteredLayers.map((layer) => (
                      <div key={layer} className='flex items-center space-x-2'>
                        <Checkbox
                          id={`layer-${activeTab}-${layer}`}
                          checked={currentLayers.includes(layer)}
                          onCheckedChange={(checked) =>
                            handleLayerToggle(layer, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`layer-${activeTab}-${layer}`}
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
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

