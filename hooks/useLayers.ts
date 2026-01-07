'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';
import type { LayersData, SketchUpFolder, SketchUpTag } from '@/types/global';

export function useLayers() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();
  const [data, setData] = useState<LayersData>({ folders: [], tags: [] });
  const [jsonPath, setJsonPath] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [silentLoad, setSilentLoad] = useState<boolean>(false);

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
        // Não recarrega automaticamente - mantém apenas na interface
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
        // Não recarrega automaticamente - mantém apenas na interface
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
        const newData = result as LayersData;

        // Merge: manter tags existentes e adicionar apenas as novas do modelo
        setData((prev) => {
          const mergedData: LayersData = {
            folders: [],
            tags: [],
          };

          // Criar um Set de nomes de tags existentes para verificação rápida
          const existingTagNames = new Set<string>();
          prev.folders.forEach((folder) => {
            folder.tags.forEach((tag) => existingTagNames.add(tag.name));
          });
          prev.tags.forEach((tag) => existingTagNames.add(tag.name));

          // Merge folders
          const folderMap = new Map<string, SketchUpFolder>();

          // Adicionar folders existentes
          prev.folders.forEach((folder) => {
            folderMap.set(folder.name, { ...folder });
          });

          // Adicionar/atualizar com folders do modelo
          newData.folders.forEach((newFolder) => {
            const existing = folderMap.get(newFolder.name);
            if (existing) {
              // Folder existe, fazer merge das tags
              const tagMap = new Map<string, SketchUpTag>();
              existing.tags.forEach((tag) => tagMap.set(tag.name, tag));

              // Adicionar apenas tags novas do modelo
              newFolder.tags.forEach((newTag) => {
                if (!tagMap.has(newTag.name)) {
                  tagMap.set(newTag.name, newTag);
                }
              });

              existing.tags = Array.from(tagMap.values());
            } else {
              // Folder novo do modelo
              folderMap.set(newFolder.name, newFolder);
            }
          });

          mergedData.folders = Array.from(folderMap.values());

          // Merge root tags
          const rootTagMap = new Map<string, SketchUpTag>();

          // Manter todas as tags existentes
          prev.tags.forEach((tag) => rootTagMap.set(tag.name, tag));

          newData.tags.forEach((newTag) => {
            if (!rootTagMap.has(newTag.name)) {
              rootTagMap.set(newTag.name, newTag);
            }
          });

          mergedData.tags = Array.from(rootTagMap.values());

          // Reset silent mode after processing
          setSilentLoad(false);

          return mergedData;
        });
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
        loadLayers(true); // Silent mode: não mostra toast extra após importar
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
        // Atualizar estado local removendo a pasta
        const folderName = result.message.match(/"([^"]+)"/)?.[1];
        if (folderName) {
          setData((prev) => ({
            ...prev,
            folders: prev.folders.filter((f) => f.name !== folderName),
          }));
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
        // Atualizar estado local removendo a tag
        const tagName = result.message.match(/"([^"]+)"/)?.[1];
        if (tagName) {
          setData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t.name !== tagName),
            folders: prev.folders.map((f) => ({
              ...f,
              tags: f.tags.filter((t) => t.name !== tagName),
            })),
          }));
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
        loadLayers(true); // Silent mode: reload após erro
      }
    };

    window.handleUpdateTagColorResult = (result: {
      success: boolean;
      message: string;
    }) => {
      // Não chamar clearPending pois não estamos usando setPendingAction
      if (!result.success) {
        toast.error(result.message);
        loadLayers(true); // Silent mode: reload após erro
      }
      // Sucesso silencioso - não mostrar toast para não poluir a UI
    };

    window.handleUpdateTagNameResult = (result: {
      success: boolean;
      message: string;
    }) => {
      // Não chamar clearPending pois não estamos usando setPendingAction
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        loadLayers(true); // Silent mode: reload após erro
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

    window.handleLoadMyTagsResult = (
      result: LayersData & { success: boolean; message: string }
    ) => {
      if (result.success) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { success, message, ...layersData } = result;
        setData(layersData);
        const count = countTagsFromData(layersData);
        toast.success(`${count} tags carregadas do seu arquivo`);
      } else {
        toast.error(result.message || 'Erro ao carregar suas tags');
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
      delete window.handleUpdateTagColorResult;
      delete window.handleUpdateTagNameResult;
      delete window.handleSaveToJsonResult;
      delete window.handleLoadFromFileResult;
      delete window.handleLoadDefaultTagsResult;
      delete window.handleLoadMyTagsResult;
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

  const loadLayers = useCallback(
    async (silent: boolean = false) => {
      // Define se deve silenciar toasts
      setSilentLoad(silent);

      if (!isAvailable) {
        // Mock data for development
        setTimeout(() => {
          const mockData: LayersData = {
            folders: [
              {
                name: '2D',
                tags: [
                  {
                    name: '-2D-AMBIENTE',
                    visible: true,
                    color: [244, 244, 244],
                  },
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
    },
    [callSketchupMethod, isAvailable]
  );

  const getJsonPath = useCallback(async () => {
    if (!isAvailable) {
      // Modo simulação - caminho será obtido do backend quando disponível
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

      // Atualizar estado local imediatamente (optimistic update)
      setData((prev) => ({
        ...prev,
        folders: [...prev.folders, { name: folderName, tags: [] }],
      }));

      if (!isAvailable) {
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
      const newTag: SketchUpTag = {
        name: tagName,
        visible: true,
        color: colorRgb,
      };

      // Atualizar estado local imediatamente (optimistic update)
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

      if (!isAvailable) {
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
      // Atualizar estado local: mover tags da pasta para root e remover pasta
      setData((prev) => {
        const folderToDelete = prev.folders.find((f) => f.name === name);
        const tagsFromFolder = folderToDelete?.tags || [];

        return {
          folders: prev.folders.filter((f) => f.name !== name),
          tags: [...prev.tags, ...tagsFromFolder],
        };
      });

      if (!isAvailable) {
        toast.info(
          `Pasta "${name}" excluída e tags movidas para root (modo simulação)`
        );
        return;
      }

      // Apenas remove a pasta no backend, as tags já estão no root do front
      // Não chama deleteFolder no backend para evitar erro
      toast.success(
        `Pasta "${name}" removida. Tags movidas para fora da pasta.`
      );
    },
    [isAvailable]
  );

  const deleteLayer = useCallback(
    async (name: string) => {
      // Atualizar estado local imediatamente (optimistic update)
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

      if (!isAvailable) {
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

  const updateTagColor = useCallback(
    async (name: string, newColor: string) => {
      const colorRgb = hexToRgb(newColor);

      // Update local state optimistically
      setData((prev) => {
        const newData = JSON.parse(JSON.stringify(prev));
        // Update in folders
        newData.folders.forEach((folder: SketchUpFolder) => {
          const tag = folder.tags.find((t) => t.name === name);
          if (tag) tag.color = colorRgb;
        });
        // Update in root tags
        const tag = newData.tags.find((t: SketchUpTag) => t.name === name);
        if (tag) tag.color = colorRgb;
        return newData;
      });

      if (!isAvailable) {
        return;
      }

      // Não usar setPendingAction para não bloquear a UI
      await callSketchupMethod('updateTagColor', { name, color: colorRgb });
    },
    [hexToRgb, callSketchupMethod, isAvailable]
  );

  const updateTagName = useCallback(
    async (oldName: string, newName: string) => {
      // Verificar se o novo nome já existe
      const nameExists =
        data.tags.some((t) => t.name === newName) ||
        data.folders.some((f) => f.tags.some((t) => t.name === newName));

      if (nameExists) {
        toast.error('Já existe uma tag com este nome');
        return;
      }

      // Update local state optimistically
      setData((prev) => {
        const newData = JSON.parse(JSON.stringify(prev));
        // Update in folders
        newData.folders.forEach((folder: SketchUpFolder) => {
          const tag = folder.tags.find((t) => t.name === oldName);
          if (tag) tag.name = newName;
        });
        // Update in root tags
        const tag = newData.tags.find((t: SketchUpTag) => t.name === oldName);
        if (tag) tag.name = newName;
        return newData;
      });

      if (!isAvailable) {
        toast.success(`Tag renomeada para "${newName}"`);
        return;
      }

      // Não usar setPendingAction para não bloquear a UI
      await callSketchupMethod('updateTagName', { oldName, newName });
    },
    [data.tags, data.folders, callSketchupMethod, isAvailable]
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

  const loadMyTags = useCallback(async () => {
    if (!isAvailable) {
      const mockData: LayersData = {
        folders: [
          {
            name: 'Minha Pasta',
            tags: [
              { name: 'Minha Tag 1', visible: true, color: [100, 150, 200] },
              { name: 'Minha Tag 2', visible: true, color: [200, 100, 150] },
            ],
          },
        ],
        tags: [
          { name: 'Tag Customizada', visible: true, color: [150, 200, 100] },
        ],
      };
      setData(mockData);
      toast.info('Minhas tags carregadas (simulação)');
      return;
    }

    // Não usar setPendingAction - o handler vai processar o resultado
    await callSketchupMethod('loadMyTags');
  }, [callSketchupMethod, isAvailable]);

  const importToModel = useCallback(async () => {
    if (countTags() === 0) {
      toast.warning('Nenhuma tag para importar');
      return;
    }

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
    setData({ folders: [], tags: [] });
  }, []);

  const isBusy = isAvailable && (isLoading || Boolean(pendingAction));

  // Initialize data on mount
  useEffect(() => {
    loadLayers(true); // Silent mode: não mostra toasts no carregamento inicial
    getJsonPath();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    updateTagColor,
    updateTagName,
    saveToJson,
    loadFromJson,
    loadDefaultTags,
    loadMyTags,
    importToModel,
    clearAll,
  };
}
