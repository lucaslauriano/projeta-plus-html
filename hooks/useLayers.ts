'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSketchup } from '@/contexts/SketchupContext';
import type { LayersData, SketchUpFolder, SketchUpTag } from '@/types/global';

export function useLayers() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();
  const [data, setData] = useState<LayersData>({ folders: [], tags: [] });
  const [jsonPath, setJsonPath] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const clearPending = useCallback(() => {
    setPendingAction(null);
  }, []);

  const countTagsFromData = useCallback((layersData: LayersData) => {
    let count = layersData.tags.length;
    layersData.folders.forEach((f) => (count += f.tags.length));
    return count;
  }, []);

  const countTags = useCallback(() => {
    return countTagsFromData(data);
  }, [data, countTagsFromData]);

  const hexToRgb = useCallback((hex: string): number[] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }, []);

  const rgbToHex = useCallback((r: number, g: number, b: number) => {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }, []);

  useEffect(() => {
    window.handleAddFolderResult = (result: {
      success: boolean;
      message: string;
      folder?: { name: string };
    }) => {
      clearPending();
      if (result.success) {
        toast.success(`Pasta "${result.folder?.name}" criada no modelo`);
        // Reload layers to get updated state
        if (isAvailable) {
          callSketchupMethod('getLayers').catch(() => {});
        }
      } else {
        toast.error(result.message);
      }
    };

    window.handleAddTagResult = (result: {
      success: boolean;
      message: string;
      tag?: SketchUpTag;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(`Tag "${result.tag?.name}" criada no modelo`);
        // Reload layers to get updated state
        if (isAvailable) {
          callSketchupMethod('getLayers').catch(() => {});
        }
      } else {
        toast.error(result.message);
      }
    };

    window.handleGetLayersResult = (
      result: LayersData | { success: boolean; message: string }
    ) => {
      clearPending();
      if ('success' in result && result.success === false) {
        toast.error(`Erro ao carregar camadas: ${result.message}`);
      } else {
        setData(result as LayersData);
      }
    };

    window.handleImportLayersResult = (result: {
      success: boolean;
      message: string;
      count?: number;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(`${result.count || 0} tags importadas!`);
        loadLayers();
      } else {
        toast.error(result.message);
      }
    };

    window.handleDeleteFolderResult = (result: {
      success: boolean;
      message: string;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
        // Reload layers to get updated state
        if (isAvailable) {
          callSketchupMethod('getLayers').catch(() => {});
        }
      } else {
        toast.error(result.message);
      }
    };

    window.handleDeleteLayerResult = (result: {
      success: boolean;
      message: string;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
        // Reload layers to get updated state
        if (isAvailable) {
          callSketchupMethod('getLayers').catch(() => {});
        }
      } else {
        toast.error(result.message);
      }
    };

    window.handleToggleVisibilityResult = (result: {
      success: boolean;
      message: string;
    }) => {
      clearPending();
      if (!result.success) {
        toast.error(result.message);
        loadLayers();
      }
    };

    window.handleSaveToJsonResult = (result: {
      success: boolean;
      message: string;
      path?: string;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(`JSON salvo com ${countTags()} tags`);
      } else {
        toast.error(result.message);
      }
    };

    window.handleLoadFromFileResult = (
      result: LayersData & { success: boolean; message: string }
    ) => {
      clearPending();
      if (result.success) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { success, message, ...layersData } = result;
        setData(layersData);
        const count = countTagsFromData(layersData);
        toast.success(`${count} tags carregadas do arquivo`);
      } else {
        toast.error(result.message);
      }
    };

    window.handleLoadDefaultTagsResult = (
      result: LayersData & { success: boolean; message: string }
    ) => {
      clearPending();
      if (result.success) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { success, message, ...layersData } = result;
        setData(layersData);
        const count = countTagsFromData(layersData);
        toast.success(`${count} tags padrão carregadas`);
      } else {
        toast.error(result.message);
      }
    };

    window.handleGetJsonPathResult = (result: {
      success: boolean;
      path?: string;
    }) => {
      clearPending();
      if (result.success && result.path) {
        setJsonPath(result.path);
      }
    };

    return () => {
      delete window.handleAddFolderResult;
      delete window.handleAddTagResult;
      delete window.handleGetLayersResult;
      delete window.handleImportLayersResult;
      delete window.handleDeleteFolderResult;
      delete window.handleDeleteLayerResult;
      delete window.handleToggleVisibilityResult;
      delete window.handleSaveToJsonResult;
      delete window.handleLoadFromFileResult;
      delete window.handleLoadDefaultTagsResult;
      delete window.handleGetJsonPathResult;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clearPending,
    countTags,
    countTagsFromData,
    callSketchupMethod,
    isAvailable,
  ]);

  const loadLayers = useCallback(async () => {
    if (!isAvailable) {
      // Mock data for development
      setTimeout(() => {
        const mockData: LayersData = {
          folders: [
            {
              name: '2D',
              tags: [
                { name: '-2D-AMBIENTE', visible: true, color: [244, 244, 244] },
                {
                  name: '-2D-ESQUADRIA',
                  visible: true,
                  color: [244, 244, 244],
                },
                {
                  name: '-2D-ETIQUETAS',
                  visible: true,
                  color: [244, 244, 244],
                },
                {
                  name: '-2D-MOBILIARIO',
                  visible: true,
                  color: [244, 244, 244],
                },
                {
                  name: '-2D-PROJECOES',
                  visible: true,
                  color: [244, 244, 244],
                },
                {
                  name: '-2D-SIMBOLOGIAS',
                  visible: true,
                  color: [244, 244, 244],
                },
              ],
            },
          ],
          tags: [],
        };
        if (window.handleGetLayersResult)
          window.handleGetLayersResult(mockData);
      }, 500);
      return;
    }

    setPendingAction('load');
    await callSketchupMethod('getLayers');
  }, [callSketchupMethod, isAvailable]);

  const getJsonPath = useCallback(async () => {
    if (!isAvailable) {
      setJsonPath(
        'C:/Users/Franciell/AppData/Roaming/SketchUp/SketchUp 2026/SketchUp/Plugins/tags_data.json'
      );
      return;
    }

    setPendingAction('getPath');
    await callSketchupMethod('getJsonPath');
  }, [callSketchupMethod, isAvailable]);

  const addFolder = useCallback(
    async (folderName: string) => {
      if (!folderName.trim()) {
        toast.warning('Digite o nome da pasta');
        return false;
      }

      if (data.folders.find((f) => f.name === folderName)) {
        toast.error('Pasta já existe');
        return false;
      }

      if (!isAvailable) {
        // Mock mode - only update local state
        setData((prev) => ({
          ...prev,
          folders: [...prev.folders, { name: folderName, tags: [] }],
        }));
        toast.success(`Pasta "${folderName}" adicionada (modo simulação)`);
        return true;
      }

      setPendingAction('addFolder');
      await callSketchupMethod('addFolder', { folderName });
      return true;
    },
    [data.folders, isAvailable, callSketchupMethod]
  );

  const addTag = useCallback(
    async (tagName: string, color: string, folder: string) => {
      if (!tagName.trim()) {
        toast.warning('Digite o nome da tag');
        return false;
      }

      const tagExists =
        data.tags.some((t) => t.name === tagName) ||
        data.folders.some((f) => f.tags.some((t) => t.name === tagName));

      if (tagExists) {
        toast.error('Tag já existe');
        return false;
      }

      const colorRgb = hexToRgb(color);

      if (!isAvailable) {
        // Mock mode - only update local state
        const newTag: SketchUpTag = {
          name: tagName,
          visible: true,
          color: colorRgb,
        };

        if (folder === 'root') {
          setData((prev) => ({
            ...prev,
            tags: [...prev.tags, newTag],
          }));
        } else {
          setData((prev) => ({
            ...prev,
            folders: prev.folders.map((f) =>
              f.name === folder ? { ...f, tags: [...f.tags, newTag] } : f
            ),
          }));
        }

        toast.success(`Tag "${tagName}" adicionada (modo simulação)`);
        return true;
      }

      setPendingAction('addTag');
      await callSketchupMethod('addTag', {
        name: tagName,
        color: colorRgb,
        folder: folder,
      });
      return true;
    },
    [data.folders, data.tags, hexToRgb, isAvailable, callSketchupMethod]
  );

  const deleteFolder = useCallback(
    async (name: string) => {
      if (!confirm(`Excluir pasta "${name}" e mover suas tags para fora?`))
        return;

      if (!isAvailable) {
        // Mock mode - update local state
        setData((prev) => ({
          ...prev,
          folders: prev.folders.filter((f) => f.name !== name),
        }));
        toast.info(`Pasta "${name}" excluída (modo simulação)`);
        return;
      }

      setPendingAction('deleteFolder');
      await callSketchupMethod('deleteFolder', { name });
    },
    [callSketchupMethod, isAvailable]
  );

  const deleteLayer = useCallback(
    async (name: string) => {
      if (!confirm(`Excluir tag "${name}"?`)) return;

      if (!isAvailable) {
        // Mock mode - update local state
        setData((prev) => {
          const newData = { ...prev };
          // Remove from root tags
          newData.tags = newData.tags.filter((t) => t.name !== name);
          // Remove from folders
          newData.folders = newData.folders.map((f) => ({
            ...f,
            tags: f.tags.filter((t) => t.name !== name),
          }));
          return newData;
        });
        toast.info(`Tag "${name}" excluída (modo simulação)`);
        return;
      }

      setPendingAction('deleteLayer');
      await callSketchupMethod('deleteLayer', { name });
    },
    [callSketchupMethod, isAvailable]
  );

  const toggleVisibility = useCallback(
    async (name: string, visible: boolean) => {
      // Update local state optimistically
      setData((prev) => {
        const newData = JSON.parse(JSON.stringify(prev));
        newData.folders.forEach((folder: SketchUpFolder) => {
          const tag = folder.tags.find((t) => t.name === name);
          if (tag) tag.visible = visible;
        });
        const tag = newData.tags.find((t: SketchUpTag) => t.name === name);
        if (tag) tag.visible = visible;
        return newData;
      });

      if (!isAvailable) return;

      setPendingAction('toggleVisibility');
      await callSketchupMethod('toggleVisibility', { name, visible });
    },
    [callSketchupMethod, isAvailable]
  );

  const saveToJson = useCallback(async () => {
    if (countTags() === 0) {
      toast.warning('Nenhuma tag para salvar');
      return;
    }

    if (!isAvailable) {
      toast.info(`JSON salvo com ${countTags()} tags`);
      return;
    }

    setPendingAction('save');
    await callSketchupMethod(
      'saveToJson',
      data as unknown as Record<string, unknown>
    );
  }, [callSketchupMethod, countTags, data, isAvailable]);

  const loadDefaultTags = useCallback(async () => {
    if (!isAvailable) {
      const mockData: LayersData = {
        folders: [
          {
            name: '2D',
            tags: [
              { name: '-2D-AMBIENTE', visible: true, color: [244, 244, 244] },
              { name: '-2D-ESQUADRIA', visible: true, color: [244, 244, 244] },
            ],
          },
        ],
        tags: [{ name: '-DET-1', visible: true, color: [180, 180, 180] }],
      };
      setData(mockData);
      toast.info('Tags padrão carregadas (simulação)');
      return;
    }

    setPendingAction('loadDefault');
    await callSketchupMethod('loadDefaultTags');
  }, [callSketchupMethod, isAvailable]);

  const loadFromJson = useCallback(async () => {
    if (!isAvailable) {
      toast.info('Arquivo JSON carregado (simulação)');
      return;
    }

    setPendingAction('loadFile');
    await callSketchupMethod('loadFromFile');
  }, [callSketchupMethod, isAvailable]);

  const importToModel = useCallback(async () => {
    if (countTags() === 0) {
      toast.warning('Nenhuma tag para importar');
      return;
    }

    if (!confirm(`Importar ${countTags()} tags no modelo?`)) return;

    if (!isAvailable) {
      toast.info('Importando tags no modelo...');
      return;
    }

    setPendingAction('import');
    await callSketchupMethod(
      'importLayers',
      data as unknown as Record<string, unknown>
    );
  }, [callSketchupMethod, countTags, data, isAvailable]);

  const clearAll = useCallback(() => {
    if (!confirm('Limpar toda a lista?')) return;
    setData({ folders: [], tags: [] });
  }, []);

  const isBusy = isAvailable && (isLoading || Boolean(pendingAction));

  // Initialize data on mount
  useEffect(() => {
    loadLayers();
    getJsonPath();
  }, [loadLayers, getJsonPath]);

  return {
    data,
    jsonPath,
    isBusy,
    isLoading,
    isAvailable,
    countTags,
    rgbToHex,
    loadLayers,
    getJsonPath,
    addFolder,
    addTag,
    deleteFolder,
    deleteLayer,
    toggleVisibility,
    saveToJson,
    loadFromJson,
    loadDefaultTags,
    importToModel,
    clearAll,
  };
}
