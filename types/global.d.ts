interface RoomAnnotationResult {
  success: boolean;
  message: string;
}

export interface RoomDefaults {
  scale?: string;
  font?: string;
  floor_height?: string;
  show_ceilling_height?: boolean;
  ceilling_height?: string;
  show_level?: boolean;
  is_auto_level?: boolean;
  level?: string;
}

declare global {
  interface Window {
    sketchup: {
      requestAllSettings: () => void;
      loadRoomAnnotationDefaults: () => void;
      loadSectionAnnotationDefaults: () => void;
      executeExtensionFunction: (payload: string) => void;
      loadGlobalSettings: () => void;
      changeLanguage: (langCode: string) => void;
      startRoomAnnotation: (args: RoomAnnotationArgs) => void;
      showMessageBox: (message: string) => void;
      requestModelName: () => void;
    };
    changeLanguage: (langCode: string) => void;
    loadGlobalSettings: () => void;
    handleSectionDefaults: (defaults: SectionDefaults) => void;
    handleGlobalSettings: (settings: GlobalSettings) => void;
    languageChanged: (langCode: string) => void;
    handleRubyResponse: (response: RubyResponse) => void;
    handleRoomDefaults: (defaults: RoomDefaults) => void;
    handleSectionDefaults: (defaults: {
      line_height_cm?: string;
      scale_factor?: string;
    }) => void;
    receiveModelNameFromRuby?: (modelName: string) => void;
    receiveAllSettingsFromRuby?: (settings: GlobalSettings) => void;
    handleRoomAnnotationResult?: (result: RoomAnnotationResult) => void;
  }
}

export {};

// types.d.ts
export interface RubyResponse {
  success: boolean;
  message: string;
  path?: string;
  setting_key?: string;
  updated_value?: unknown;
}

export interface SectionDefaults {
  line_height_cm: string;
  scale_factor: string;
}

export interface LanguageOption {
  code: string; // e.g., "en", "pt-BR"
  name: string; // e.g., "English", "Português (Brasil)"
}

export interface GlobalSettings {
  font: string;
  measurement_unit: string;
  area_unit: string;
  scale_numerator: number;
  scale_denominator: number;
  floor_level: number;
  cut_height: number;
  headroom_height: number;
  styles_folder: string;
  sheets_folder: string;
  language: string; // NOVO: idioma selecionado
  frontend_options: {
    fonts: string[];
    measurement_units: string[];
    area_units: string[];
    languages: LanguageOption[]; // NOVO: opções de idioma
  };
}
