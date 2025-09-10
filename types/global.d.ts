declare global {
  interface Window {
    sketchup: {
      showMessageBox: (message: string) => void;
      requestModelName: () => void;
      requestAllSettings: () => void;
      loadRoomAnnotationDefaults: () => void;
      loadSectionAnnotationDefaults: () => void;
      executeExtensionFunction: (payload: string) => void;
      loadGlobalSettings: () => void;
      changeLanguage: (langCode: string) => void;
    };
    changeLanguage: (langCode: string) => void;
    loadGlobalSettings: () => void;
    handleSectionDefaults: (defaults: SectionDefaults) => void;
    handleGlobalSettings: (settings: GlobalSettings) => void;
    languageChanged: (langCode: string) => void;
    handleRubyResponse: (response: RubyResponse) => void;
    handleRoomDefaults: (defaults: {
      scale?: string;
      font?: string;
      floor_height?: string;
      show_pd?: string;
      pd?: string;
      show_level?: string;
      level?: string;
    }) => void;
    handleSectionDefaults: (defaults: {
      line_height_cm?: string;
      scale_factor?: string;
    }) => void;
    receiveModelNameFromRuby?: (modelName: string) => void;
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

export interface RoomDefaults {
  floor_height: string;
  show_pd: string;
  pd: string;
  show_level: string;
  level: string;
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
