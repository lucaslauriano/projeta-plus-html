'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Lock, InfoIcon, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import PageWrapper from '@/components/ui/page-wraper';

export default function FurnitureDashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [componentSelected] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('mobiliario');

  // Dimensions
  const [keepProportionWidth, setKeepProportionWidth] = useState(false);
  const [keepProportionDepth, setKeepProportionDepth] = useState(false);
  const [keepProportionHeight, setKeepProportionHeight] = useState(false);
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [height, setHeight] = useState('');

  // Additional fields
  const [dimensionFormat, setDimensionFormat] = useState('LxPxA');
  const [finalDimension, setFinalDimension] = useState('');
  const [environment, setEnvironment] = useState('');
  const [value, setValue] = useState('');
  const [link, setLink] = useState('');
  const [observations, setObservations] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular chamada API
    setTimeout(() => {
      setIsLoading(false);
      console.log('Form submitted:', {
        name,
        color,
        brand,
        type,
        dimensions: { width, depth, height },
        dimensionFormat,
        finalDimension,
        environment,
        value,
        link,
        observations,
      });
    }, 1000);
  };

  return (
    <TooltipProvider>
      <PageWrapper>
        <PageHeader
          title='Mobiliário'
          description='Organize e posicione móveis no projeto'
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
                  <p className='text-xs font-semibold text-foreground'>
                    💡 Dica:
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Marque o checkbox 🔒 para manter a proporção baseada nessa
                    dimensão. Altere os valores e o objeto será redimensionado
                    automaticamente!
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          }
        />

        {/* Status Alert */}
        <Alert
          className={cn(
            'mb-4 text-sm',
            componentSelected
              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
              : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900'
          )}
        >
          <Target
            className={cn(
              'h-5 w-5',
              componentSelected ? 'text-green-600' : 'text-blue-600'
            )}
          />
          <AlertTitle
            className={cn(
              componentSelected
                ? 'text-green-900 dark:text-green-100'
                : 'text-blue-900 dark:text-blue-100'
            )}
          >
            Status
          </AlertTitle>
          <AlertDescription
            className={cn(
              componentSelected
                ? 'text-green-800 dark:text-green-200'
                : 'text-blue-800 dark:text-blue-200'
            )}
          >
            {componentSelected
              ? 'Componente selecionado'
              : 'Selecione um componente ou grupo'}
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className='space-y-6 pb-8'>
          {/* Basic Information */}
          <div className='space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50'>
            <div className='space-y-1 mb-3'>
              <h3 className='text-sm font-semibold text-foreground'>
                Informações Básicas
              </h3>
              <p className='text-xs text-muted-foreground'>
                Dados principais do mobiliário
              </p>
            </div>

            <Input
              id='name'
              type='text'
              label='Nome'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              placeholder='Ex: Mesa de Jantar'
            />

            <Input
              id='color'
              type='text'
              label='Cor'
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={isLoading}
              placeholder='Ex: Branco'
            />

            <Input
              id='brand'
              type='text'
              label='Marca'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              disabled={isLoading}
              placeholder='Ex: Tok&Stok'
            />

            <Select value={type} onValueChange={setType}>
              <label className='block text-sm font-semibold mb-2 text-foreground'>
                Tipo
              </label>
              <SelectTrigger className='h-11 rounded-xl border-2'>
                <SelectValue placeholder='Selecione o tipo' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='mobiliario'>Mobiliário</SelectItem>
                <SelectItem value='decoracao'>Decoração</SelectItem>
                <SelectItem value='eletrodomestico'>Eletrodoméstico</SelectItem>
                <SelectItem value='iluminacao'>Iluminação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dimensions Section */}
          <div className='space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50'>
            <div className='flex items-center justify-between mb-3'>
              <div className='space-y-1'>
                <h3 className='text-sm font-semibold text-foreground'>
                  Dimensões (Redimensionamento ao vivo)
                </h3>
                <p className='text-xs text-muted-foreground'>
                  Configure as medidas do mobiliário
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
                  <div className='space-y-2'>
                    <p className='text-xs font-semibold text-foreground'>
                      💡 Dica:
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Marque o checkbox 🔒 para manter a proporção baseada nessa
                      dimensão. Altere os valores e o objeto será redimensionado
                      automaticamente!
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className='space-y-3'>
              {/* Width */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Checkbox
                    id='keepProportionWidth'
                    checked={keepProportionWidth}
                    onCheckedChange={(checked) =>
                      setKeepProportionWidth(checked === true)
                    }
                    disabled={isLoading}
                  />
                  <Lock className='h-3.5 w-3.5 text-warning' />
                  <label
                    htmlFor='keepProportionWidth'
                    className='text-sm font-semibold text-foreground'
                  >
                    Largura (cm):
                  </label>
                </div>
                <Input
                  id='width'
                  type='text'
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  disabled={isLoading || !keepProportionWidth}
                  placeholder='Ex: 120'
                />
              </div>

              {/* Depth */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Checkbox
                    id='keepProportionDepth'
                    checked={keepProportionDepth}
                    onCheckedChange={(checked) =>
                      setKeepProportionDepth(checked === true)
                    }
                    disabled={isLoading}
                  />
                  <Lock className='h-3.5 w-3.5 text-warning' />
                  <label
                    htmlFor='keepProportionDepth'
                    className='text-sm font-semibold text-foreground'
                  >
                    Profundidade (cm):
                  </label>
                </div>
                <Input
                  id='depth'
                  type='text'
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  disabled={isLoading || !keepProportionDepth}
                  placeholder='Ex: 80'
                />
              </div>

              {/* Height */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Checkbox
                    id='keepProportionHeight'
                    checked={keepProportionHeight}
                    onCheckedChange={(checked) =>
                      setKeepProportionHeight(checked === true)
                    }
                    disabled={isLoading}
                  />
                  <Lock className='h-3.5 w-3.5 text-warning' />
                  <label
                    htmlFor='keepProportionHeight'
                    className='text-sm font-semibold text-foreground'
                  >
                    Altura (cm):
                  </label>
                </div>
                <Input
                  id='height'
                  type='text'
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  disabled={isLoading || !keepProportionHeight}
                  placeholder='Ex: 75'
                />
              </div>
            </div>
          </div>

          {/* Format and Additional Info */}
          <div className='space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50'>
            <div className='space-y-1 mb-3'>
              <h3 className='text-sm font-semibold text-foreground'>
                Informações Adicionais
              </h3>
              <p className='text-xs text-muted-foreground'>
                Detalhes complementares do mobiliário
              </p>
            </div>

            <Select value={dimensionFormat} onValueChange={setDimensionFormat}>
              <label className='block text-sm font-semibold mb-2 text-foreground'>
                Formato da Dimensão
              </label>
              <SelectTrigger className='h-11 rounded-xl border-2'>
                <SelectValue placeholder='Selecione o formato' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='LxPxA'>L x P x A</SelectItem>
                <SelectItem value='LxAxP'>L x A x P</SelectItem>
                <SelectItem value='AxLxP'>A x L x P</SelectItem>
                <SelectItem value='AxPxL'>A x P x L</SelectItem>
                <SelectItem value='PxLxA'>P x L x A</SelectItem>
                <SelectItem value='PxAxL'>P x A x L</SelectItem>
              </SelectContent>
            </Select>

            <Input
              id='finalDimension'
              type='text'
              label='Dimensão Final'
              value={finalDimension}
              onChange={(e) => setFinalDimension(e.target.value)}
              disabled={isLoading}
              placeholder='Ex: 120 x 80 x 75'
            />

            <Input
              id='environment'
              type='text'
              label='Ambiente'
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              disabled={isLoading}
              placeholder='Ex: Sala de Jantar'
            />

            <Input
              id='value'
              type='text'
              label='Valor'
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isLoading}
              placeholder='Ex: R$ 150,00'
            />

            <Input
              id='link'
              type='text'
              label='Link'
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={isLoading}
              placeholder='Ex: https://...'
            />

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
                onChange={(e) => setObservations(e.target.value)}
                disabled={isLoading}
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

          {/* Submit Button */}
          <Button
            type='submit'
            size='lg'
            disabled={isLoading}
            className='w-full'
          >
            {isLoading ? 'Salvando...' : 'Salvar Atributos'}
          </Button>
        </form>
      </PageWrapper>
    </TooltipProvider>
  );
}
