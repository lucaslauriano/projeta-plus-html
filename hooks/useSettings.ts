import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';
import type { GlobalSettings, RubyResponse } from '@/types/global';

export function useSettings() {
  const {
    callSketchupMethod,
    isLoading: contextLoading,
    isAvailable,
  } = useSketchup();
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] =
    useState<GlobalSettings | null>(null);

  useEffect(() => {
    window.handleGlobalSettings = (loadedSettings: GlobalSettings) => {
      setSettings(loadedSettings);
      setOriginalSettings(loadedSettings);
      setIsLoading(false);
      setHasChanges(false);
    };

    window.handleSettingUpdate = (response: RubyResponse) => {
      setIsLoading(false);
      if (response.success) {
        toast.success(response.message);

        if (response.setting_key && response.updated_value !== undefined) {
          setSettings((prev) =>
            prev
              ? {
                  ...prev,
                  [response.setting_key as keyof GlobalSettings]:
                    response.updated_value,
                }
              : null
          );
          setOriginalSettings((prev) =>
            prev
              ? {
                  ...prev,
                  [response.setting_key as keyof GlobalSettings]:
                    response.updated_value,
                }
              : null
          );
        }

        if (response.setting_key === 'language') {
        }
      } else {
        toast.error(response.message);
        console.error('Setting update error:', response.message);
      }
    };

    window.handleFolderSelection = (response: RubyResponse) => {
      setIsLoading(false);
      if (response.success) {
        toast.success(response.message);

        if (response.setting_key && response.path) {
          setSettings((prev) =>
            prev
              ? {
                  ...prev,
                  [response.setting_key as keyof GlobalSettings]: response.path,
                }
              : null
          );
          setOriginalSettings((prev) =>
            prev
              ? {
                  ...prev,
                  [response.setting_key as keyof GlobalSettings]: response.path,
                }
              : null
          );
        }
      } else {
        toast.error(response.message);
        console.error('Folder selection error:', response.message);
      }
    };

    return () => {
      if (window.handleGlobalSettings) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete window.handleGlobalSettings;
      }
      if (window.handleSettingUpdate) {
        delete window.handleSettingUpdate;
      }
      if (window.handleFolderSelection) {
        delete window.handleFolderSelection;
      }
    };
  }, []);

  // Carregar configurações do backend
  const loadSettings = useCallback(async () => {
    if (!isAvailable) {
      toast.error('SketchUp API não disponível');
      return;
    }

    setIsLoading(true);
    await callSketchupMethod('loadGlobalSettings');
  }, [isAvailable, callSketchupMethod]);

  // Atualizar configuração local (sem salvar)
  const updateLocalSetting = useCallback(
    (key: keyof GlobalSettings, value: unknown) => {
      setSettings((prev) => {
        if (!prev) return null;
        const newSettings = { ...prev, [key]: value };

        // Verificar se há mudanças comparando com original
        const hasChangesNow =
          JSON.stringify(newSettings) !== JSON.stringify(originalSettings);
        setHasChanges(hasChangesNow);

        return newSettings;
      });
    },
    [originalSettings]
  );

  const saveSetting = useCallback(
    async (key: keyof GlobalSettings, value: unknown) => {
      if (!isAvailable) {
        toast.error('SketchUp API não disponível');
        return;
      }

      setIsLoading(true);

      const payload = { key, value };
      await callSketchupMethod('updateSetting', payload);
    },
    [isAvailable, callSketchupMethod]
  );

  // Salvar todas as configurações alteradas
  const saveAllChanges = useCallback(async () => {
    if (!settings || !originalSettings || !hasChanges) {
      return;
    }

    setIsLoading(true);

    try {
      // Encontrar todas as chaves que mudaram
      const changedKeys = Object.keys(settings).filter(
        (key) =>
          settings[key as keyof GlobalSettings] !==
          originalSettings[key as keyof GlobalSettings]
      );

      // Salvar cada configuração alterada
      for (const key of changedKeys) {
        if (key !== 'frontend_options') {
          // Não salvar opções do frontend
          await saveSetting(
            key as keyof GlobalSettings,
            settings[key as keyof GlobalSettings]
          );
        }
      }

      setHasChanges(false);
      toast.success('Todas as configurações foram salvas!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [settings, originalSettings, hasChanges, saveSetting]);

  // Selecionar pasta
  const selectFolder = useCallback(
    async (settingKey: keyof GlobalSettings, dialogTitle: string) => {
      if (!isAvailable) {
        toast.error('SketchUp API não disponível');
        return;
      }

      setIsLoading(true);

      const payload = { setting_key: settingKey, dialog_title: dialogTitle };
      await callSketchupMethod('selectFolderPath', payload);
    },
    [isAvailable, callSketchupMethod]
  );

  // Descartar alterações
  const discardChanges = useCallback(() => {
    if (originalSettings) {
      setSettings({ ...originalSettings });
      setHasChanges(false);
    }
  }, [originalSettings]);

  return {
    settings,
    isLoading: isLoading || contextLoading,
    hasChanges,
    isAvailable,
    saveSetting,
    loadSettings,
    selectFolder,
    discardChanges,
    saveAllChanges,
    updateLocalSetting,
  };
}
