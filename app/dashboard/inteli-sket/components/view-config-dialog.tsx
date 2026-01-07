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

// Configuração para um único item (modo normal)
interface SingleConfigProps {
  itemTitle: string;
  itemCode?: string;
  style: string;
  cameraType: string;
  activeLayers: string[];
  onStyleChange: (style: string) => void;
  onCameraTypeChange: (type: string) => void;
  onActiveLayersChange: (layers: string[]) => void;
  onItemTitleChange?: (title: string) => void;
  onItemCodeChange?: (code: string) => void;
}

// Configuração para múltiplas tabs (modo base/ceiling)
interface MultiTabConfig {
  code?: string;
  style: string;
  layers: string[];
  updateCode?: (code: string) => void;
  updateStyle: (style: string) => void;
  updateLayers: (layers: string[]) => void;
}

interface MultiTabConfigProps {
  baseConfig: MultiTabConfig;
  ceilingConfig: MultiTabConfig;
}

// Props base compartilhadas
interface BaseViewConfigDialogProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onSave: () => void;
  isBusy?: boolean;
  onOpenChange: (open: boolean) => void;
  availableStyles: string[];
  availableLayers: string[];
  onApplyCurrentState: (availableLayers: string[]) => void;
  onCancel?: () => void;
}

// Props para modo single (normal)
interface SingleModeProps extends BaseViewConfigDialogProps, SingleConfigProps {
  mode?: 'single';
  allowedCameraTypes: string[];
  onSelectNoLayers: () => void;
  onSelectAllLayers: () => void;
}

// Props para modo multi-tab (base/ceiling)
interface MultiTabModeProps
  extends BaseViewConfigDialogProps,
    MultiTabConfigProps {
  mode: 'multi-tab';
}

type ViewConfigDialogProps = SingleModeProps | MultiTabModeProps;

const CAMERA_TYPE_LABELS: Record<string, string> = {
  iso_perspectiva: '📐 Isométrica + Perspectiva',
  iso_ortogonal: '📐 Isométrica + Ortogonal',
  iso_invertida_perspectiva: '🔄 Vista Invertida + Perspectiva',
  iso_invertida_ortogonal: '🔄 Vista Invertida + Ortogonal',
  topo_perspectiva: '⬇️ Vista de Topo + Perspectiva',
  topo_ortogonal: '⬇️ Vista de Topo + Ortogonal',
};

export function ViewConfigDialog(props: ViewConfigDialogProps) {
  const {
    title,
    description,
    isOpen,
    isBusy = false,
    availableLayers,
    availableStyles,
    onSave,
    onOpenChange,
    onApplyCurrentState,
  } = props;

  const mode =
    'mode' in props && props.mode === 'multi-tab' ? 'multi-tab' : 'single';

  const [layerFilter, setLayerFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'base' | 'ceiling'>('base');

  // Determinar configuração atual baseado no modo
  const currentConfig = useMemo(() => {
    if (mode === 'multi-tab') {
      const multiProps = props as MultiTabModeProps;
      return activeTab === 'base'
        ? multiProps.baseConfig
        : multiProps.ceilingConfig;
    } else {
      const singleProps = props as SingleModeProps;
      return {
        code: singleProps.itemCode,
        style: singleProps.style,
        layers: singleProps.activeLayers,
        cameraType: singleProps.cameraType,
        updateCode: singleProps.onItemCodeChange,
        updateStyle: singleProps.onStyleChange,
        updateLayers: singleProps.onActiveLayersChange,
        updateCameraType: singleProps.onCameraTypeChange,
      };
    }
  }, [mode, props, activeTab]);

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
    const currentLayers = currentConfig.layers;
    const newLayers = checked
      ? [...currentLayers, layer]
      : currentLayers.filter((l) => l !== layer);
    currentConfig.updateLayers(newLayers);
  };

  const handleSelectAllFiltered = () => {
    const newActiveLayers = [
      ...new Set([...currentConfig.layers, ...filteredLayers]),
    ];
    currentConfig.updateLayers(newActiveLayers);
  };

  const handleSelectNoneFiltered = () => {
    const newActiveLayers = currentConfig.layers.filter(
      (layer) => !filteredLayers.includes(layer)
    );
    currentConfig.updateLayers(newActiveLayers);
  };

  const handleCancel = () => {
    if (mode === 'single') {
      const singleProps = props as SingleModeProps;
      singleProps.onCancel?.();
    } else {
      onOpenChange(false);
    }
  };

  // Renderizar configuração única (single mode)
  const renderSingleConfig = () => {
    const singleProps = props as SingleModeProps;

    return (
      <div className='flex flex-col gap-2 py-2 overflow-y-auto flex-1'>
        {(singleProps.onItemTitleChange || singleProps.onItemCodeChange) && (
          <div className='flex gap-3'>
            {singleProps.onItemTitleChange && (
              <div className='flex-1'>
                <Input
                  id='item-title'
                  label='Nome'
                  type='text'
                  placeholder='Nome da configuração'
                  value={singleProps.itemTitle}
                  onChange={(e) =>
                    singleProps.onItemTitleChange!(e.target.value)
                  }
                />
              </div>
            )}

            {singleProps.onItemCodeChange && (
              <div className='flex-1'>
                <Input
                  id='item-code'
                  type='text'
                  label='Código'
                  placeholder='Ex: gnrl, draw, plans'
                  value={singleProps.itemCode || ''}
                  onChange={(e) =>
                    singleProps.onItemCodeChange!(
                      e.target.value.toLowerCase().replace(/\s+/g, '_')
                    )
                  }
                />
              </div>
            )}
          </div>
        )}

        <div className='w-full flex items-end justify-between gap-x-3'>
          <Select
            label='Estilo'
            value={currentConfig.style}
            onValueChange={currentConfig.updateStyle}
          >
            <SelectTrigger className='w-full'>
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

        {'cameraType' in currentConfig && (
          <div className='space-y-1.5'>
            <Select
              value={currentConfig.cameraType}
              onValueChange={currentConfig.updateCameraType!}
              label='Tipo de Câmera'
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione o tipo de câmera' />
              </SelectTrigger>
              <SelectContent>
                {singleProps.allowedCameraTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {CAMERA_TYPE_LABELS[type] || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {renderLayersSection()}
      </div>
    );
  };

  // Renderizar configuração multi-tab (base/ceiling)
  const renderMultiTabConfig = () => {
    return (
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'base' | 'ceiling')}
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
                value={currentConfig.style}
                onValueChange={currentConfig.updateStyle}
                label='Estilo'
              >
                <SelectTrigger className='w-full'>
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

            {currentConfig.updateCode && (
              <div className='flex-1'>
                <Input
                  id='item-code'
                  type='text'
                  label='Código'
                  placeholder='Ex: base, ceiling'
                  value={currentConfig.code || ''}
                  onChange={(e) =>
                    currentConfig.updateCode!(
                      e.target.value.toLowerCase().replace(/\s+/g, '_')
                    )
                  }
                />
              </div>
            )}
          </div>

          {renderLayersSection()}
        </TabsContent>
      </Tabs>
    );
  };

  // Renderizar seção de camadas (compartilhada)
  const renderLayersSection = () => (
    <div className='space-y-2'>
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
      </div>

      <div className='flex items-center gap-2 flex-wrap mt-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleSelectAllFiltered}
          className='h-8 text-xs rounded-4xl'
        >
          Todos
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={handleSelectNoneFiltered}
          className='h-8 text-xs rounded-4xl'
        >
          Nenhum
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onApplyCurrentState(availableLayers as string[])}
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
                  id={`layer-${mode}-${activeTab}-${layer}`}
                  checked={currentConfig.layers.includes(layer)}
                  onCheckedChange={(checked) =>
                    handleLayerToggle(layer, checked as boolean)
                  }
                />
                <label
                  htmlFor={`layer-${mode}-${activeTab}-${layer}`}
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
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px] h-[95vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex text-start gap-2'>{title}</DialogTitle>
          {description && (
            <DialogDescription className='flex text-start items-center justify-start text-xs text-muted-foreground'>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {mode === 'single' ? renderSingleConfig() : renderMultiTabConfig()}

        <DialogFooter className='!flex !flex-row !justify-between gap-2 w-full'>
          <Button
            size='sm'
            variant='outline'
            onClick={handleCancel}
            className='flex-1'
          >
            {mode === 'single' ? 'Cancelar' : 'Fechar'}
          </Button>
          <Button onClick={onSave} size='sm' className='flex-1'>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
