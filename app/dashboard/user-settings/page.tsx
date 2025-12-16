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

          <div className=' w-full gap-y-4'>
            <div className='flex gap-2 w-full '>
              <Input
                type='number'
                disabled
                label='Escala:'
                value={settings?.scale_numerator?.toString() || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  updateLocalSetting('scale_numerator', isNaN(val) ? 0 : val);
                }}
                min='1'
              />
              <Input
                type='number'
                id='scale_denominator'
                value={settings?.scale_denominator?.toString() || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  updateLocalSetting('scale_denominator', isNaN(val) ? 0 : val);
                }}
                disabled={isLoading}
                min='1'
              />
            </div>
            <p className='col-span-2 text-xs pt-2 text-gray-500'>
              Display: 1:{settings?.scale_denominator}
            </p>
          </div>

          <Input
            type='text'
            id='cut_height'
            label='Altura de corte (m):'
            value={settings?.cut_height?.toString() || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              updateLocalSetting('cut_height', isNaN(val) ? 0 : val);
            }}
            disabled={isLoading}
          />

          {hasChanges && (
            <div className='col-span-1 mt-6 flex gap-4 justify-end'>
              <Button
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
