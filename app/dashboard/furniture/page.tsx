'use client';

import { useEffect, useMemo, useState } from 'react';
import { InfoIcon, Save, Target } from 'lucide-react';
import PageHeader from '@/components/page-header';
import PageWrapper from '@/components/ui/page-wraper';
import SelectionStatusAlert from '@/app/dashboard/furniture/components/selection-status-alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useFurniture } from '@/hooks/useFurniture';
import { DEFAULT_TYPES, DIMENSION_FORMAT_OPTIONS } from '@/lib/consts';
import PageContent from '@/components/ui/page-content';
import { Label } from '@/components/ui/label';

type DimensionFormat = (typeof DIMENSION_FORMAT_OPTIONS)[number]['value'];

type FurnitureForm = {
  name: string;
  color: string;
  brand: string;
  type: string;
  dimensionFormat: DimensionFormat;
  finalDimension: string;
  environment: string;
  value: string;
  link: string;
  observations: string;
  width: string;
  depth: string;
  height: string;
  keepWidth: boolean;
  keepDepth: boolean;
  keepHeight: boolean;
};

const INITIAL_FURNITURE_FORM: FurnitureForm = {
  name: '',
  color: '',
  brand: '',
  type: '',
  dimensionFormat: 'L x P x A',
  finalDimension: '',
  environment: '',
  value: '',
  link: '',
  observations: '',
  width: '',
  depth: '',
  height: '',
  keepWidth: false,
  keepDepth: false,
  keepHeight: false,
};

export default function FurnitureDashboardPage() {
  const {
    attributes,
    dimensionPreview,
    availableTypes,
    isBusy,
    isAvailable,
    saveFurnitureAttributes,
    requestDimensionPreview,
    resizeIndependentLive,
    captureSelectedComponent,
    resetForm,
  } = useFurniture();

  const [furnitureForm, setFurnitureForm] = useState<FurnitureForm>(
    INITIAL_FURNITURE_FORM
  );

  function setFurnitureField<K extends keyof FurnitureForm>(
    key: K,
    value: FurnitureForm[K]
  ) {
    setFurnitureForm((prev) => ({ ...prev, [key]: value }));
  }

  const {
    name,
    color,
    brand,
    type,
    dimensionFormat,
    finalDimension,
    environment,
    value,
    link,
    observations,
    width,
    depth,
    height,
    keepWidth,
    keepDepth,
    keepHeight,
  } = furnitureForm;

  const typeOptions = useMemo(
    () => (availableTypes.length ? availableTypes : DEFAULT_TYPES),
    [availableTypes]
  );

  const isSelected = attributes?.selected ?? false;

  useEffect(() => {
    setFurnitureForm((prev) => {
      if (!attributes || !attributes.selected) {
        return {
          ...prev,
          ...INITIAL_FURNITURE_FORM,
          keepWidth: prev.keepWidth,
          keepDepth: prev.keepDepth,
          keepHeight: prev.keepHeight,
        };
      }

      const newForm = {
        ...prev,
        name: attributes.name,
        color: attributes.color,
        brand: attributes.brand,
        type: attributes.type,
        dimensionFormat: attributes.dimension_format as DimensionFormat,
        finalDimension: attributes.dimension,
        environment: attributes.environment,
        value: attributes.value,
        link: attributes.link,
        observations: attributes.observations,
        width: attributes.width,
        depth: attributes.depth,
        height: attributes.height,
      };
      return newForm;
    });
  }, [attributes, isSelected]);

  useEffect(() => {
    if (!isAvailable) {
      setFurnitureForm((prev) => ({
        ...prev,
        ...INITIAL_FURNITURE_FORM,
      }));
    }
  }, [isAvailable]);

  useEffect(() => {
    if (dimensionPreview) {
      setFurnitureField('finalDimension', dimensionPreview);
    }
  }, [dimensionPreview]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  useEffect(() => {
    if (!attributes?.selected) return;
    if (!width || !depth || !height) return;
    const controller = setTimeout(() => {
      void requestDimensionPreview({
        width,
        depth,
        height,
        dimension_format: dimensionFormat,
      });
    }, 400);
    return () => clearTimeout(controller);
  }, [
    attributes?.selected,
    width,
    depth,
    height,
    dimensionFormat,
    requestDimensionPreview,
  ]);

  useEffect(() => {
    if (!attributes?.selected) return;
    if (!width || !depth || !height) return;

    const hasChanged =
      width !== attributes.width ||
      depth !== attributes.depth ||
      height !== attributes.height;

    if (!hasChanged) return;

    const controller = setTimeout(() => {
      void resizeIndependentLive({
        width,
        depth,
        height,
      });
    }, 500);

    return () => clearTimeout(controller);
  }, [
    attributes?.selected,
    attributes?.width,
    attributes?.depth,
    attributes?.height,
    width,
    depth,
    height,
    resizeIndependentLive,
  ]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy || !isSelected) return;
    await saveFurnitureAttributes({
      entity_id: attributes?.entity_id,
      name,
      color,
      brand,
      type,
      dimension_format: dimensionFormat,
      dimension: finalDimension,
      environment,
      value,
      link,
      observations,
      width,
      depth,
      height,
    });
    resetForm();
  };

  if (!isAvailable) {
    return (
      <TooltipProvider>
        <PageWrapper>
          <PageHeader
            title='Mobiliário'
            description='Gerencie os atributos do componente selecionado no SketchUp'
          />
          <PageContent>
            <Alert className='border border-dashed'>
              <AlertTitle>SketchUp API indisponível</AlertTitle>
              <AlertDescription>
                Abra este painel a partir do SketchUp para sincronizar os dados
                do componente selecionado. Sem a API ativa não dá para carregar
                nem salvar atributos.
              </AlertDescription>
            </Alert>
          </PageContent>
        </PageWrapper>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <PageWrapper>
        <PageHeader
          title='Mobiliário'
          description='Gerencie os atributos do componente selecionado no SketchUp'
          icon={
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type='button'
                  className='p-2 rounded-lg hover:bg-accent/50 transition-colors'
                >
                  <InfoIcon className='h-4 w-4 text-muted-foreground' />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side='left'
                className='max-w-[200px] p-4 bg-popover border-border'
              >
                <div className='space-y-2'>
                  <p className='text-xs text-muted-foreground'>
                    Sempre que houver um componente válido selecionado no
                    SketchUp, os dados aparecem automaticamente aqui. Ajuste os
                    campos e salve para atualizar a definição do componente.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          }
        />

        <PageContent>
          <SelectionStatusAlert isSelected={isSelected} />

          <div className='mb-6'>
            <Button
              size='sm'
              type='button'
              onClick={() => captureSelectedComponent()}
              disabled={isBusy}
              className='w-full flex items-center justify-center space-2'
            >
              <Target className='h-4 w-4' />
              {isBusy ? 'Capturando...' : 'Selecionar Componente'}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50'>
              <div className='flex items-center justify-between mb-3'>
                <div className='space-y-1'>
                  <h3 className='text-sm font-semibold text-foreground'>
                    Dimensões
                  </h3>
                  <p className='text-xs text-muted-foreground'>
                    Redimensionamento automático.
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type='button'
                      className='p-2 rounded-lg hover:bg-accent/50 transition-colors'
                    >
                      <InfoIcon className='h-4 w-4 text-muted-foreground' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side='left'
                    className='max-w-[200px] p-4 bg-popover border-border'
                  >
                    <p className='text-xs text-muted-foreground'>
                      As dimensões são aplicadas automaticamente enquanto você
                      digita. Não é necessário salvar. Cuidado com a posição do
                      componente no modelo. A largura é sempre o eixo X e a
                      profundidade o eixo Y. A altura é o eixo Z.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className='space-y-3'>
                <div className='space-y-2'>
                  <div className='flex items-center space-2'>
                    <label
                      htmlFor='keep-width'
                      className='text-sm font-semibold text-foreground'
                    >
                      Largura (cm):
                    </label>
                  </div>
                  <Input
                    id='width'
                    type='text'
                    value={width}
                    onChange={(e) => setFurnitureField('width', e.target.value)}
                    disabled={isBusy || keepWidth}
                    placeholder='Ex: 120'
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center space-2'>
                    <label
                      htmlFor='keep-depth'
                      className='text-sm font-semibold text-foreground'
                    >
                      Profundidade (cm):
                    </label>
                  </div>
                  <Input
                    id='depth'
                    type='text'
                    value={depth}
                    onChange={(e) => setFurnitureField('depth', e.target.value)}
                    disabled={isBusy || keepDepth}
                    placeholder='Ex: 80'
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center space-2'>
                    <label
                      htmlFor='keep-height'
                      className='text-sm font-semibold text-foreground'
                    >
                      Altura (cm):
                    </label>
                  </div>
                  <Input
                    id='height'
                    type='text'
                    value={height}
                    onChange={(e) =>
                      setFurnitureField('height', e.target.value)
                    }
                    disabled={isBusy || keepHeight}
                    placeholder='Ex: 75'
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor='dimensionFormat'
                  className='flex justify-between '
                >
                  Formato da dimensão
                </Label>
                <Select
                  value={dimensionFormat}
                  onValueChange={(selected) =>
                    setFurnitureField(
                      'dimensionFormat',
                      selected as DimensionFormat
                    )
                  }
                  disabled={isBusy}
                >
                  <SelectTrigger className='h-11 rounded-xl border-2'>
                    <SelectValue placeholder='Selecione o formato' />
                  </SelectTrigger>
                  <SelectContent>
                    {DIMENSION_FORMAT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                id='finalDimension'
                type='text'
                label='Dimensão final'
                value={finalDimension}
                onChange={(e) =>
                  setFurnitureField('finalDimension', e.target.value)
                }
                disabled={isBusy}
                placeholder='Ex: 120 x 80 x 75 cm'
              />
            </div>

            <div className='space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50'>
              <div className='space-y-1 mb-3'>
                <h3 className='text-sm font-semibold text-foreground'>
                  Informações básicas
                </h3>
                <p className='text-xs text-muted-foreground'>
                  Dados principais do mobiliário (requer salvar)
                </p>
              </div>

              <Input
                id='name'
                type='text'
                label='Nome'
                value={name}
                onChange={(e) => setFurnitureField('name', e.target.value)}
                required
                disabled={isBusy}
                placeholder='Ex: Mesa de Jantar'
              />

              <Input
                id='color'
                type='text'
                label='Cor'
                value={color}
                onChange={(e) => setFurnitureField('color', e.target.value)}
                disabled={isBusy}
                placeholder='Ex: Branco'
              />

              <Input
                id='brand'
                type='text'
                label='Marca'
                value={brand}
                onChange={(e) => setFurnitureField('brand', e.target.value)}
                disabled={isBusy}
                placeholder='Ex: Tok&Stok'
              />

              <div>
                <label className='block text-sm font-semibold mb-2 text-foreground'>
                  Tipo
                </label>
                <Select
                  value={type}
                  onValueChange={(selected) =>
                    setFurnitureField('type', selected)
                  }
                  disabled={isBusy}
                >
                  <SelectTrigger className='h-11 rounded-xl border-2'>
                    <SelectValue placeholder='Selecione o tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50'>
              <div className='space-y-1 mb-3'>
                <h3 className='text-sm font-semibold text-foreground'>
                  Informações complementares
                </h3>
                <p className='text-xs text-muted-foreground'>
                  Ambiente, valor e link de referência
                </p>
              </div>

              <Input
                id='environment'
                type='text'
                label='Ambiente'
                value={environment}
                onChange={(e) =>
                  setFurnitureField('environment', e.target.value)
                }
                disabled={isBusy}
                placeholder='Ex: Sala de jantar'
              />

              <Input
                id='value'
                type='text'
                label='Valor'
                value={value}
                onChange={(e) => setFurnitureField('value', e.target.value)}
                disabled={isBusy}
                placeholder='Ex: R$ 150,00'
              />

              <Input
                id='link'
                type='text'
                label='Link'
                value={link}
                onChange={(e) => setFurnitureField('link', e.target.value)}
                disabled={isBusy}
                placeholder='Ex: https://...'
              />
            </div>

            <div className='space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50'>
              <div className='space-y-1 mb-3'>
                <h3 className='text-sm font-semibold text-foreground'>
                  Observações
                </h3>
                <p className='text-xs text-muted-foreground'>
                  Informações adicionais e notas
                </p>
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='observations'
                  className='block text-sm font-semibold text-foreground'
                >
                  Observações
                </label>
                <textarea
                  id='observations'
                  value={observations}
                  onChange={(e) =>
                    setFurnitureField('observations', e.target.value)
                  }
                  disabled={isBusy}
                  placeholder='Informações adicionais...'
                  rows={4}
                  className={cn(
                    'flex w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm font-medium transition-all',
                    'placeholder:text-muted-foreground/60',
                    'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'resize-none'
                  )}
                />
              </div>
            </div>

            <div className='flex flex-col space-y-3 p-1'>
              <Button
                size='sm'
                type='submit'
                disabled={isBusy || !isSelected}
                className='w-full flex items-center justify-center space-2'
              >
                <Save className='h-4 w-4' />
                {isBusy ? 'Sincronizando...' : 'Salvar atributos'}
              </Button>

              <Button
                type='button'
                size='sm'
                variant='outline'
                disabled={isBusy}
                onClick={() => {
                  setFurnitureForm((prev) => ({
                    ...prev,
                    name: '',
                    color: '',
                    brand: '',
                    type: '',
                    environment: '',
                    value: '',
                    link: '',
                    observations: '',
                    finalDimension: '',
                  }));
                }}
              >
                Limpar
              </Button>
            </div>
          </form>
        </PageContent>
      </PageWrapper>
    </TooltipProvider>
  );
}
