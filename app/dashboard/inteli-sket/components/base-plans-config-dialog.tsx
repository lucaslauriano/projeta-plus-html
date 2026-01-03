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
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BasePlansConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableStyles: string[];
  availableLayers: string[];
  onSave: () => void;
  baseStyle: string;
  baseLayers: string[];
  baseCode?: string;
  ceilingStyle: string;
  ceilingLayers: string[];
  ceilingCode?: string;
  onBaseStyleChange: (style: string) => void;
  onBaseLayersChange: (layers: string[]) => void;
  onBaseCodeChange?: (code: string) => void;
  onCeilingStyleChange: (style: string) => void;
  onCeilingLayersChange: (layers: string[]) => void;
  onCeilingCodeChange?: (code: string) => void;
  onApplyCurrentState: () => void;
  isBusy?: boolean;
}

export function BasePlansConfigDialog({
  isOpen,
  onOpenChange,
  availableStyles,
  availableLayers,
  baseStyle,
  onSave,
  baseLayers,
  baseCode,
  ceilingStyle,
  ceilingLayers,
  ceilingCode,
  onBaseStyleChange,
  onBaseLayersChange,
  onBaseCodeChange,
  onCeilingStyleChange,
  onCeilingLayersChange,
  onCeilingCodeChange,
  onApplyCurrentState,
  isBusy = false,
}: BasePlansConfigDialogProps) {
  const [layerFilter, setLayerFilter] = useState('');
  const [activeTab, setActiveTab] = useState('base');
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

  const currentStyle = activeTab === 'base' ? baseStyle : ceilingStyle;
  const currentLayers = activeTab === 'base' ? baseLayers : ceilingLayers;
  const currentCode = activeTab === 'base' ? baseCode : ceilingCode;

  const handleStyleChange = (style: string) => {
    if (activeTab === 'base') {
      onBaseStyleChange(style);
    } else {
      onCeilingStyleChange(style);
    }
  };

  const handleCodeChange = (code: string) => {
    if (activeTab === 'base' && onBaseCodeChange) {
      onBaseCodeChange(code);
    } else if (activeTab === 'ceiling' && onCeilingCodeChange) {
      onCeilingCodeChange(code);
    }
  };

  const handleLayerToggle = (layer: string, checked: boolean) => {
    const updateLayers =
      activeTab === 'base' ? onBaseLayersChange : onCeilingLayersChange;
    const layers = activeTab === 'base' ? baseLayers : ceilingLayers;

    if (checked) {
      updateLayers([...layers, layer]);
    } else {
      updateLayers(layers.filter((l) => l !== layer));
    }
  };

  const handleSelectAllFiltered = () => {
    const updateLayers =
      activeTab === 'base' ? onBaseLayersChange : onCeilingLayersChange;
    const layers = activeTab === 'base' ? baseLayers : ceilingLayers;
    const newActiveLayers = [...new Set([...layers, ...filteredLayers])];
    updateLayers(newActiveLayers);
  };

  const handleSelectNoneFiltered = () => {
    const updateLayers =
      activeTab === 'base' ? onBaseLayersChange : onCeilingLayersChange;
    const layers = activeTab === 'base' ? baseLayers : ceilingLayers;
    const newActiveLayers = layers.filter(
      (layer) => !filteredLayers.includes(layer)
    );
    updateLayers(newActiveLayers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px] h-[95vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex text-start gap-2 '>
            Configurações Base e Forro
          </DialogTitle>
          <DialogDescription className='text-start text-sm text-muted-foreground'>
            Configure os estilos e camadas que serão usados nas plantas de base
            e forro
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full flex flex-col flex-1 overflow-hidden'
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='base'>Planta Base</TabsTrigger>
            <TabsTrigger value='ceiling'>Planta de Forro</TabsTrigger>
          </TabsList>

          <TabsContent
            value={activeTab}
            className='flex flex-col gap-3 overflow-y-auto flex-1 mt-2'
          >
            <div className='w-full flex items-end justify-between gap-x-3'>
              <div className='flex-1'>
                <Select
                  value={currentStyle}
                  onValueChange={handleStyleChange}
                  label='Estilo'
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione um estilo' />
                  </SelectTrigger>
                  <SelectContent className=''>
                    {availableStyles.map((styleOption) => (
                      <SelectItem key={styleOption} value={styleOption}>
                        {styleOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex-1'>
                <Input
                  id='item-code'
                  type='text'
                  label='Código'
                  placeholder='Ex: base, ceiling'
                  value={currentCode || ''}
                  onChange={(e) =>
                    handleCodeChange(
                      e.target.value.toLowerCase().replace(/\s+/g, '_')
                    )
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <Input
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
                    onApplyCurrentState();
                  }}
                  disabled={isBusy}
                  className='h-8 text-xs rounded-4xl'
                >
                  Estado Atual
                </Button>
              </div>
              <div className='space-y-1.5 max-h-[260px] overflow-y-auto p-3 bg-muted/30 rounded-md border border-border/50'>
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
