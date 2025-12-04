'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PrintAttributes } from '@/app/dashboard/annotation/components/print-attributes';
import { useComponentUpdater } from '@/hooks/useComponentUpdater';

type AttributeType =
  | 'scale'
  | 'environment'
  | 'usage'
  | 'usagePrefix'
  | 'situation';
type SituationType = '1' | '2' | '3' | '4';

type SelectionType = AttributeType | SituationType;

const situacaoOptions = ['1', '2', '3', '4'] as const;

export function ElectricalChangeAtributes() {
  const { updateComponentAttributes, defaults, isLoading } =
    useComponentUpdater();

  const [selectedOption, setSelectedOption] = useState<SelectionType>(
    defaults.last_attribute as SelectionType
  );
  const [inputValue, setInputValue] = useState(defaults.last_value);
  const [selectedSituation, setSelectedSituation] = useState<SituationType>(
    defaults.last_situation_type as SituationType
  );

  useEffect(() => {
    setSelectedOption(defaults.last_attribute as SelectionType);
    setInputValue(defaults.last_value);
    setSelectedSituation(defaults.last_situation_type as SituationType);
  }, [defaults]);

  const fieldConfig: Record<
    'scale' | 'environment' | 'usage' | 'usagePrefix',
    { label: string; placeholder: string }
  > = {
    scale: { label: 'Escala:', placeholder: 'Ex: 1:50' },
    environment: { label: 'Ambiente:', placeholder: 'Ex: Sala' },
    usage: { label: 'Uso:', placeholder: 'Ex: Iluminação' },
    usagePrefix: { label: 'Prefixo do uso:', placeholder: 'Ex: IL' },
  };

  const isInputFieldSelected = !(situacaoOptions as readonly string[]).includes(
    selectedOption
  );

  const getFieldConfig = () => {
    if (isInputFieldSelected && selectedOption in fieldConfig) {
      return fieldConfig[selectedOption as keyof typeof fieldConfig];
    }
    return { label: '', placeholder: '' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isInputFieldSelected && !inputValue.trim()) {
      alert('Por favor, insira um valor válido');
      return;
    }

    // Determine which attribute_type to send
    const attributeType = isInputFieldSelected ? selectedOption : 'situation'; // Always 'situation' for situation types

    await updateComponentAttributes({
      attribute_type: attributeType,
      new_value: isInputFieldSelected ? inputValue : '',
      situation_type: selectedSituation, // Send the numeric value (1,2,3,4)
    });
  };

  useEffect(() => {
    if ((situacaoOptions as readonly string[]).includes(selectedOption)) {
      setInputValue('');
    }
  }, [selectedOption]);

  return (
    <div className='w-full max-w-lg mx-auto space-y-5'>
      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Atributos Section */}
        <div className='space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50'>
          <div className='space-y-2'>
            <h3 className='text-sm font-semibold text-foreground'>
              Modificar Atributos
            </h3>
            <p className='text-xs text-muted-foreground'>
              Selecione os componentes dinâmicos de pontos técnicos no modelo e
              defina o tipo de atributo a modificar.
            </p>
          </div>

          <RadioGroup
            value={selectedOption}
            onValueChange={(value) => {
              const newValue = value as SelectionType;
              setSelectedOption(newValue);

              if ((situacaoOptions as readonly string[]).includes(newValue)) {
                setSelectedSituation(newValue as SituationType);
              }
            }}
            disabled={isLoading}
            className='space-y-4'
          >
            <div className='grid grid-cols-2 gap-3'>
              <RadioGroupItem value='scale' id='scale' label='Escala' />
              <RadioGroupItem
                value='environment'
                id='environment'
                label='Ambiente'
              />
              <RadioGroupItem value='usage' id='usage' label='Uso' />
              <RadioGroupItem
                value='usagePrefix'
                id='usagePrefix'
                label='Prefixo'
              />
            </div>
            <Input
              id='inputValue'
              type='text'
              prefix={
                isInputFieldSelected && selectedOption === 'scale'
                  ? '1:'
                  : undefined
              }
              label={
                isInputFieldSelected
                  ? getFieldConfig().label
                  : 'Campo desabilitado'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required={isInputFieldSelected}
              disabled={isLoading || !isInputFieldSelected}
              placeholder={
                isInputFieldSelected
                  ? getFieldConfig().placeholder
                  : 'Selecione um atributo primeiro'
              }
            />
          </RadioGroup>

          <Button
            type='submit'
            size='sm'
            disabled={isLoading}
            className='w-full'
          >
            {isLoading ? 'Executando...' : 'Aplicar Alterações'}
          </Button>
        </div>

        {/* Situação Section */}
        <div className='space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50'>
          <div className='space-y-2'>
            <h3 className='text-sm font-semibold text-foreground'>Situação</h3>
            <p className='text-xs text-muted-foreground'>
              Selecione os componentes dinâmicos de pontos técnicos no modelo e
              defina o status da situação.
            </p>
          </div>

          <RadioGroup
            value={selectedOption}
            onValueChange={(value) => {
              const newValue = value as SelectionType;
              setSelectedOption(newValue);

              if ((situacaoOptions as readonly string[]).includes(newValue)) {
                setSelectedSituation(newValue as SituationType);
              }
            }}
            disabled={isLoading}
          >
            <div className='grid grid-cols-2 gap-3'>
              <RadioGroupItem value='1' id='new' label='Novo' />
              <RadioGroupItem value='2' id='existing' label='Existente' />
              <RadioGroupItem value='3' id='modify' label='Modificar' />
              <RadioGroupItem value='4' id='remove' label='Remover' />
            </div>
          </RadioGroup>

          <Button
            type='submit'
            size='sm'
            disabled={isLoading}
            className='w-full'
          >
            {isLoading ? 'Executando...' : 'Aplicar Alterações'}
          </Button>
        </div>
      </form>
      <PrintAttributes />
    </div>
  );
}
