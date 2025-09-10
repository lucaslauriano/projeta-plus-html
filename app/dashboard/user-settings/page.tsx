// my-sketchup-login-app/app/dashboard/settings/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GlobalSettings, RubyResponse } from '@/types/global';

export default function GlobalSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sketchup, setSketchup] = useState<Window['sketchup'] | undefined>(
    undefined
  );

  useEffect(() => {
    setSketchup(window.sketchup);
  }, []);

  useEffect(() => {
    window.handleRubyResponse = (response: RubyResponse) => {
      setIsLoading(false);
      if (response.success) {
        setStatusMessage(`Success: ${response.message}`);
        console.log('Ruby Response Success:', response.message);
        if (response?.setting_key) {
          setSettings((prev) =>
            prev
              ? {
                  ...prev,
                  [response.setting_key!]:
                    response?.updated_value || response?.path,
                }
              : null
          );
        }
        // Se a configuração de idioma foi alterada, podemos precisar recarregar a UI do frontend.
        if (response?.setting_key === 'language' && response?.updated_value) {
          // Isso pode ser feito com uma biblioteca i18n do Next.js
          // Por exemplo, router.push(`/${response.updated_value}/dashboard/settings`)
          // Para simplicidade, vamos apenas logar e confiar que o Next.js i18n
          // já está configurado para mudar a linguagem automaticamente via URL/context.
          console.log(`Language changed to: ${response?.updated_value}`);
        }
      } else {
        setStatusMessage(`Error: ${response.message}`);
        console.error('Ruby Response Error:', response.message);
      }
    };

    window.handleGlobalSettings = (loadedSettings) => {
      console.log('Received global settings from Ruby:', loadedSettings);
      setSettings(loadedSettings);
      setIsLoading(false);
      // Aqui você também pode inicializar a linguagem do i18n do Next.js
      // se ainda não o fez (ex: via um context provider).
    };

    // Opcional: Adicionar um handler para `languageChanged` se você precisar de feedback imediato no frontend
    window.languageChanged = (langCode) => {
      console.log(
        `SketchUp notified language change to: ${langCode}. Frontend should re-render accordingly.`
      );
      // Dependendo da sua implementação i18n no Next.js, você pode disparar uma atualização aqui
      // Por exemplo, se você estiver usando `next-i18n`, pode ser necessário mudar a rota.
    };

    if (typeof window !== 'undefined' && window.sketchup) {
      setIsLoading(true);
      sketchup?.loadGlobalSettings();
    }

    return () => {
      if (window.handleRubyResponse) {
        (window.handleRubyResponse as unknown) = undefined;
      }
      if (window.handleGlobalSettings) {
        (window.handleGlobalSettings as unknown) = undefined;
      }
      if (window.languageChanged) {
        (window.languageChanged as unknown) = undefined;
      }
    };
  }, [sketchup]);

  const updateSetting = useCallback(
    (key: keyof GlobalSettings, value: unknown) => {
      setStatusMessage('');
      setIsLoading(true);

      const payload = {
        module_name: 'ProjetaPlus::Settings',
        function_name: 'update_setting',
        args: { key, value },
      };

      if (typeof window !== 'undefined' && window.sketchup) {
        sketchup?.executeExtensionFunction(JSON.stringify(payload));
        // Se for a configuração de idioma, envie também a ação `changeLanguage` para o Ruby
        if (key === 'language') {
          sketchup?.changeLanguage(value as string); // Envia o código do idioma
        }
      } else {
        console.warn('Simulating Ruby call (update_setting):', payload);
        setIsLoading(false);
        setStatusMessage('Simulation: Check console for Ruby call payload.');
        setSettings((prev) => (prev ? { ...prev, [key]: value } : null));
      }
    },
    [sketchup]
  );

  const handleSelectFolder = useCallback(
    (settingKey: keyof GlobalSettings, dialogTitle: string) => {
      setStatusMessage('');
      setIsLoading(true);

      const payload = {
        module_name: 'ProjetaPlus::Settings',
        function_name: 'select_folder_path',
        args: { setting_key: settingKey, dialog_title: dialogTitle },
      };

      if (typeof window !== 'undefined' && window.sketchup) {
        sketchup?.executeExtensionFunction(JSON.stringify(payload));
      } else {
        console.warn('Simulating Ruby call (select_folder_path):', payload);
        setIsLoading(false);
        setStatusMessage(
          'Simulation: Folder selection not available outside SketchUp.'
        );
      }
    },
    [sketchup]
  );

  if (isLoading || !settings) {
    return (
      <div className='flex justify-center items-center h-full'>
        <p className='text-gray-600'>Loading global settings...</p>
      </div>
    );
  }

  return (
    <div className='p-4'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>
          Global Settings
        </h1>

        <form className='grid grid-cols-1 gap-4'>
          {/* Language */}
          <div>
            <label
              htmlFor='language'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Language:
            </label>
            <select
              id='language'
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={settings?.language}
              onChange={(e) => {
                setSettings((prev) =>
                  prev ? { ...prev, language: e.target.value } : null
                );
                updateSetting('language', e.target.value);
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

          {/* Rest of the settings remain the same */}
          {/* Font */}
          <div>
            <label
              htmlFor='font'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Font:
            </label>
            <select
              id='font'
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={settings?.font}
              onChange={(e) => {
                setSettings((prev) =>
                  prev ? { ...prev, font: e.target.value } : null
                );
                updateSetting('font', e.target.value);
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

          {/* Measurement Unit */}
          <div>
            <label
              htmlFor='measurement_unit'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Measurement Unit:
            </label>
            <select
              id='measurement_unit'
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={settings?.measurement_unit}
              onChange={(e) => {
                setSettings((prev) =>
                  prev ? { ...prev, measurement_unit: e.target.value } : null
                );
                updateSetting('measurement_unit', e.target.value);
              }}
              disabled={isLoading}
            >
              {settings?.frontend_options.measurement_units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* Area Unit */}
          <div>
            <label
              htmlFor='area_unit'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Area Unit:
            </label>
            <select
              id='area_unit'
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={settings?.area_unit}
              onChange={(e) => {
                setSettings((prev) =>
                  prev ? { ...prev, area_unit: e.target.value } : null
                );
                updateSetting('area_unit', e.target.value);
              }}
              disabled={isLoading}
            >
              {settings?.frontend_options.area_units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* Scale (Numerator and Denominator) */}
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label
                htmlFor='scale_numerator'
                className='block text-gray-700 text-sm font-bold mb-2'
              >
                Scale (1):
              </label>
              <input
                type='number'
                id='scale_numerator'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                value={settings?.scale_numerator}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSettings((prev) =>
                    prev
                      ? { ...prev, scale_numerator: isNaN(val) ? 0 : val }
                      : null
                  );
                  updateSetting('scale_numerator', isNaN(val) ? 0 : val);
                }}
                disabled={isLoading}
                min='1'
              />
            </div>
            <div>
              <label
                htmlFor='scale_denominator'
                className='block text-gray-700 text-sm font-bold mb-2'
              >
                Scale (N):
              </label>
              <input
                type='number'
                id='scale_denominator'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                value={settings?.scale_denominator}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSettings((prev) =>
                    prev
                      ? { ...prev, scale_denominator: isNaN(val) ? 0 : val }
                      : null
                  );
                  updateSetting('scale_denominator', isNaN(val) ? 0 : val);
                }}
                disabled={isLoading}
                min='1'
              />
            </div>
            <p className='col-span-2 text-xs text-gray-500'>
              Display: 1:{settings?.scale_denominator}
            </p>
          </div>

          {/* Floor Level */}
          <div>
            <label
              htmlFor='floor_level'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Floor Level (m):
            </label>
            <input
              type='number'
              step='0.01'
              id='floor_level'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={settings?.floor_level}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSettings((prev) =>
                  prev ? { ...prev, floor_level: isNaN(val) ? 0 : val } : null
                );
                updateSetting('floor_level', isNaN(val) ? 0 : val);
              }}
              disabled={isLoading}
            />
          </div>

          {/* Cut Height */}
          <div>
            <label
              htmlFor='cut_height'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Cut Height (m):
            </label>
            <input
              type='number'
              step='0.01'
              id='cut_height'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={settings?.cut_height}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSettings((prev) =>
                  prev ? { ...prev, cut_height: isNaN(val) ? 0 : val } : null
                );
                updateSetting('cut_height', isNaN(val) ? 0 : val);
              }}
              disabled={isLoading}
            />
          </div>

          {/* Headroom Height */}
          <div>
            <label
              htmlFor='headroom_height'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Headroom Height (m):
            </label>
            <input
              type='number'
              step='0.01'
              id='headroom_height'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={settings?.headroom_height}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSettings((prev) =>
                  prev
                    ? { ...prev, headroom_height: isNaN(val) ? 0 : val }
                    : null
                );
                updateSetting('headroom_height', isNaN(val) ? 0 : val);
              }}
              disabled={isLoading}
            />
          </div>

          {/* Styles Folder */}
          <div>
            <label
              htmlFor='styles_folder'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Styles Folder:
            </label>
            <div className='flex items-center space-x-2'>
              <input
                type='text'
                id='styles_folder'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                value={settings?.styles_folder}
                readOnly
                disabled={isLoading}
              />
              <button
                type='button'
                onClick={() =>
                  handleSelectFolder('styles_folder', 'Select Styles Folder')
                }
                className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50'
                disabled={isLoading}
              >
                Select
              </button>
            </div>
          </div>

          {/* Sheets Folder */}
          <div>
            <label
              htmlFor='sheets_folder'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Drawing Sheets Folder:
            </label>
            <div className='flex items-center space-x-2'>
              <input
                type='text'
                id='sheets_folder'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                value={settings?.sheets_folder}
                readOnly
                disabled={isLoading}
              />
              <button
                type='button'
                onClick={() =>
                  handleSelectFolder(
                    'sheets_folder',
                    'Select Drawing Sheets Folder'
                  )
                }
                className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50'
                disabled={isLoading}
              >
                Select
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className='col-span-1 mt-4'>
              <p
                className={`text-sm ${
                  statusMessage.startsWith('Success')
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {statusMessage}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
