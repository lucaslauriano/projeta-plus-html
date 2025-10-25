'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PrintAttributes } from '@/app/dashboard/annotation/components/print-attributes';
import { useComponentUpdater } from '@/hooks/useComponentUpdater';

type SelectionType =
  | 'scale'
  | 'environment'
  | 'usage'
  | 'usagePrefix'
  | 'new'
  | 'existing'
  | 'modify'
  | 'remove';

const situacaoOptions = ['new', 'existing', 'modify', 'remove'] as const;

export function ElectricalChangeAtributes() {
  const { updateComponentAttributes, defaults, isLoading } =
    useComponentUpdater();

  const [selectedOption, setSelectedOption] = useState<SelectionType>(
    defaults.last_attribute as SelectionType
  );
  const [inputValue, setInputValue] = useState(defaults.last_value);
  const [selectedSituation, setSelectedSituation] = useState<SelectionType>(
    defaults.last_situation as SelectionType
  );
  const [lastFieldOption, setLastFieldOption] = useState<SelectionType>(
    defaults.last_attribute as SelectionType
  );

  useEffect(() => {
    setSelectedOption(defaults.last_attribute as SelectionType);
    setInputValue(defaults.last_value);
    setSelectedSituation(defaults.last_situation as SelectionType);
    setLastFieldOption(defaults.last_attribute as SelectionType);
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
    const attributeType = isInputFieldSelected
      ? selectedOption
      : lastFieldOption;

    await updateComponentAttributes({
      attribute_type: attributeType,
      new_value: isInputFieldSelected ? inputValue : '',
      situation: selectedSituation,
    });
  };

  useEffect(() => {
    if ((situacaoOptions as readonly string[]).includes(selectedOption)) {
      setInputValue('');
    }
  }, [selectedOption]);

  return (
    <>
      <div className='border border-border rounded-md p-4 mb-6'>
        <div className='w-full mx-auto'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='text-sm font-medium leading-none mb-3 block'>
                Selecione uma opção:
              </label>
              <RadioGroup
                value={selectedOption}
                onValueChange={(value) => {
                  const newValue = value as SelectionType;
                  setSelectedOption(newValue);

                  if (
                    !(situacaoOptions as readonly string[]).includes(newValue)
                  ) {
                    // Field option selected - track it
                    setLastFieldOption(newValue);
                  } else {
                    // Situation option selected - update situation
                    setSelectedSituation(newValue);
                  }
                }}
                disabled={isLoading}
                className='space-y-4'
              >
                {/* Attribute Type Section */}
                <div className='pb-3 border-b border-border'>
                  <p className='text-xs text-muted-foreground mb-3'>
                    Atributo:
                  </p>
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
                      label='Prefixo do uso'
                    />
                  </div>
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
                      : 'Desabilitado para situação'
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  required={isInputFieldSelected}
                  disabled={isLoading || !isInputFieldSelected}
                  placeholder={
                    isInputFieldSelected
                      ? getFieldConfig().placeholder
                      : 'Selecione uma entrada'
                  }
                />
                {/* Situation Section */}
                <div className='pt-1'>
                  <p className='text-xs text-muted-foreground mb-3'>
                    Situação:
                  </p>
                  <div className='flex flex-wrap gap-4'>
                    <RadioGroupItem value='new' id='new' label='Novo' />
                    <RadioGroupItem
                      value='existing'
                      id='existing'
                      label='Existente'
                    />
                    <RadioGroupItem
                      value='modify'
                      id='modify'
                      label='Modificar'
                    />
                    <RadioGroupItem
                      value='remove'
                      id='remove'
                      label='Remover'
                    />
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className='flex items-center justify-center mt-4'>
              <Button
                type='submit'
                size='lg'
                disabled={isLoading}
                className='min-w-[150px]'
              >
                {isLoading ? 'Executando...' : 'Anotação Elétrica'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <PrintAttributes />
    </>
  );
}
