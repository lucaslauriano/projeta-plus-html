'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettings } from '@/hooks/useSettings';
import PageHeader from '@/components/page-header';
import { Loading } from '@/components/ui/loading';
import PageWrapper from '@/components/ui/page-wraper';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select';
import PageContent from '@/components/ui/page-content';
import {
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';

export default function GlobalSettingsPage() {
  const {
    settings,
    isLoading,
    hasChanges,
    loadSettings,
    saveAllChanges,
    updateLocalSetting,
  } = useSettings();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  if (isLoading || !settings) {
    return <Loading message='Carregando configurações...' size='md' />;
  }

  return (
    <PageWrapper>
      <PageHeader
        title='Configurações'
        description='Configure as preferências e ajustes do sistema'
      />

      <PageContent>
        <form className='grid grid-cols-1 gap-4'>
          <Select
            label='Idioma:'
            value={settings?.language}
            onValueChange={(value: string) => {
              updateLocalSetting('language', value);
            }}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione um idioma' />
            </SelectTrigger>
            <SelectContent>
              {settings?.frontend_options.languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            label='Fontes:'
            value={settings?.font}
            onValueChange={(value: string) => {
              updateLocalSetting('font', value);
            }}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione uma fonte' />
            </SelectTrigger>
            <SelectContent>
              {settings?.frontend_options.fonts.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className=' w-full gap-y-4 '>
            <div className='flex flex-col gap-2 w-full items-start'>
              <Label htmlFor='scale_denominator' className='font-medium'>
                Escala
              </Label>
              <InputGroup>
                <InputGroupInput
                  id='scale_denominator'
                  value={settings?.scale_denominator?.toString() || ''}
                  className='!pl-1'
                  placeholder='50'
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    updateLocalSetting(
                      'scale_denominator',
                      isNaN(val) ? 0 : val
                    );
                  }}
                  disabled={isLoading}
                  min='1'
                />
                <InputGroupAddon>
                  <InputGroupText>1:</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <Input
            type='number'
            id='cut_height'
            label='Altura da seção (m):'
            value={settings?.cut_height?.toString() || ''}
            onChange={(e) => {
              const val = e.target.value;
              updateLocalSetting('cut_height', val);
            }}
            disabled={isLoading}
          />

          {hasChanges && (
            <div className='col-span-1 mt-6 flex gap-4 justify-end'>
              <Button
                size='sm'
                type='button'
                onClick={saveAllChanges}
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          )}
        </form>
      </PageContent>
    </PageWrapper>
  );
}
