import { useEffect, useState } from 'react';
import { useSketchup } from '@/contexts/SketchupContext';
import type {
  HeightDefaults,
  LightingDefaults,
  RoomAnnotationArgs,
  ComponentUpdaterArgs,
  ComponentUpdaterDefaults,
} from '@/types/annotations';
import { registerHandlers } from '@/utils/register-handlers';

export function useAnnotations() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();

  const [defaults, setDefaults] = useState({
    floor_level: '0,00',
    circuit_text: 'C1',
    circuit_scale: 1.0,
    circuit_height_cm: 250,
    circuit_font: 'Arial',
    circuit_text_color: '#000000',
    show_usage: false,
    last_attribute: 'scale',
    last_value: '',
    last_situation_type: '1',
  });

  useEffect(() => {
    loadDefaults();

    const cleanup = registerHandlers({
      handleRoomAnnotationResult: true,
      handleViewAnnotationResult: true,
      handleCeilingAnnotationResult: true,
      handleSectionAnnotationResult: true,
      handleLightingAnnotationResult: true,
      handleEletricalAnnotationResult: true,
      handleComponentUpdaterResult: true,

      handleCeilingDefaults: (response) => {
        if (response) {
          setDefaults((prev) => ({
            ...prev,
            ...(response as unknown as { floor_level: string }),
          }));
        }
      },
      handleLightingDefaults: (response) => {
        if (response) {
          setDefaults((prev) => ({
            ...prev,
            ...(response as unknown as Partial<LightingDefaults>),
          }));
        }
      },

      handleEletricalDefaults: (response) => {
        if (response) {
          setDefaults(response as unknown as typeof defaults);
        }
      },

      handleComponentUpdaterDefaults: (response) => {
        if (response) {
          setDefaults((prev) => ({
            ...prev,
            ...(response as unknown as Partial<ComponentUpdaterDefaults>),
          }));
        }
      },
    });

    return cleanup;
  }, []);

  // ROOM
  const startRoomAnnotation = async (args: RoomAnnotationArgs) => {
    await callSketchupMethod(
      'startRoomAnnotation',
      args as unknown as Record<string, unknown>
    );
  };

  // CEILING
  const loadDefaults = async () => {
    await Promise.all([
      callSketchupMethod('loadCeilingAnnotationDefaults', {}),
      callSketchupMethod('loadLightingAnnotationDefaults', {}),
      callSketchupMethod('loadEletricalAnnotationDefaults', {}),
      callSketchupMethod('loadComponentUpdaterDefaults', {}),
    ]);
  };

  const startCeilingAnnotation = async (args = {}) => {
    const params = {
      scale: 1.0,
      font: 'Arial',
      floor_level: defaults.floor_level,
      ...args,
    };
    await callSketchupMethod('startCeilingAnnotation', params);
  };

  // VIEW
  const activateViewAnnotationTool = async () => {
    await callSketchupMethod('activate_view_tool', {});
  };

  const getViewAnnotationSettings = async () => {
    await callSketchupMethod('get_view_settings', {});
  };

  const updateViewAnnotationSettings = async (
    settings: Record<string, unknown>
  ) => {
    await callSketchupMethod('update_view_settings', settings);
  };

  // SECTION
  const startSectionAnnotation = async () => {
    await callSketchupMethod('startSectionAnnotation', {});
  };

  // LIGHTING
  const startLightingAnnotation = async (args: Partial<LightingDefaults>) => {
    const params = {
      circuit_text: args.circuit_text || defaults.circuit_text,
      circuit_scale: args.circuit_scale ?? defaults.circuit_scale,
      circuit_height_cm: args.circuit_height_cm ?? defaults.circuit_height_cm,
      circuit_font: args.circuit_font || defaults.circuit_font,
      circuit_text_color:
        args.circuit_text_color || defaults.circuit_text_color,
    };
    await callSketchupMethod(
      'startLightingAnnotation',
      params as unknown as Record<string, unknown>
    );
  };

  // HEIGHT
  const startEletricalAnnotation = async (args: Partial<HeightDefaults>) => {
    const params = {
      show_usage: args.show_usage ?? defaults.show_usage,
    };
    await callSketchupMethod(
      'startEletricalAnnotation',
      params as unknown as Record<string, unknown>
    );
  };

  // COMPONENT UPDATER
  const updateComponentAttributes = async (args: ComponentUpdaterArgs) => {
    await callSketchupMethod(
      'updateComponentAttributes',
      args as unknown as Record<string, unknown>
    );
  };

  return {
    // ROOM
    startRoomAnnotation,

    // VIEW
    activateViewAnnotationTool,
    getViewAnnotationSettings,
    updateViewAnnotationSettings,

    // SECTION
    startSectionAnnotation,

    // CEILING
    startCeilingAnnotation,

    // LIGHTING
    startLightingAnnotation,

    // ELETRICAL
    startEletricalAnnotation,

    // COMPONENT UPDATER
    updateComponentAttributes,

    // DEFAULTS
    loadDefaults,
    defaults,
    setDefaults,
    isLoading,
    isAvailable,
  };
}
