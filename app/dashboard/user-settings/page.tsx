'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettings } from '@/hooks/useSettings';
import PageHeader from '@/components/page-header';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { ThemePreview } from '@/components/theme-preview';
import { Loading } from '@/components/ui/loading';
import PageWrapper from '@/components/ui/page-wraper';

export default function GlobalSettingsPage() {
  const {
    settings,
    isLoading,
    hasChanges,
    loadSettings,
    updateLocalSetting,
    saveAllChanges,
    selectFolder,
  } = useSettings();

  useEffect(() => {
    // Carregar configurações quando o componente montar
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

      <div className='w-full'>
        <div className='flex w-full border-b border-border justify-center items-center '>
          <form className='grid grid-cols-1 gap-4'>
            {/* Language */}
            <div>
              <label
                htmlFor='language'
                className='block text-foreground text-sm font-bold mb-2'
              >
                Idioma:
              </label>
              <select
                id='language'
                className='shadow border border-border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:ring-2 focus:ring-primary'
                value={settings?.language}
                onChange={(e) => {
                  updateLocalSetting('language', e.target.value);
                }}
                disabled={isLoading}
              >
                {settings?.frontend_options.languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor='font'
                className='block text-foreground text-sm font-bold mb-2'
              >
                Fontes:
              </label>
              <select
                id='font'
                className='shadow border border-border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:ring-2 focus:ring-primary'
                value={settings?.font}
                onChange={(e) => {
                  updateLocalSetting('font', e.target.value);
                }}
                disabled={isLoading}
              >
                {settings?.frontend_options.fonts.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className=' w-full gap-y-4'>
              <label
                htmlFor='scale_numerator'
                className='block text-foreground text-sm font-bold mb-2'
              >
                Escala:
              </label>
              <div className='flex gap-2 w-full '>
                <Input
                  type='number'
                  id='scale_numerator'
                  disabled
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
                    updateLocalSetting(
                      'scale_denominator',
                      isNaN(val) ? 0 : val
                    );
                  }}
                  disabled={isLoading}
                  min='1'
                />
              </div>
              <p className='col-span-2 text-xs pt-2 text-gray-500'>
                Display: 1:{settings?.scale_denominator}
              </p>
            </div>

            {/* Cut Height */}
            <div>
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
            </div>

            {/* Styles Folder */}
            {/* <div>
              <label
                htmlFor='styles_folder'
                className='block text-foreground text-sm font-bold mb-2'
              >
                Styles Folder:
              </label>
              <div className='flex items-center space-x-2'>
                <Input
                  type='text'
                  id='styles_folder'
                  value={settings?.styles_folder || ''}
                  readOnly
                  disabled={isLoading}
                />
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() =>
                    selectFolder('styles_folder', 'Select Styles Folder')
                  }
                  disabled={isLoading}
                >
                  Select
                </Button>
              </div>
            </div> */}

            {/* Sheets Folder */}
            {/* <div>
              <label
                htmlFor='sheets_folder'
                className='block text-foreground text-sm font-bold mb-2'
              >
                Drawing Sheets Folder:
              </label>
              <div className='flex items-center space-x-2'>
                <Input
                  type='text'
                  id='sheets_folder'
                  value={settings?.sheets_folder || ''}
                  readOnly
                  disabled={isLoading}
                />
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() =>
                    selectFolder(
                      'sheets_folder',
                      'Select Drawing Sheets Folder'
                    )
                  }
                  disabled={isLoading}
                >
                  Select
                </Button>
              </div>
            </div> */}

            {/* Actions Buttons */}
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
        </div>

        <div className='mt-8 space-y-6'>
          <ThemeSelector />
          <ThemePreview />
        </div>
      </div>
    </PageWrapper>
  );
}
