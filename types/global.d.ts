declare global {
  interface Window {
    sketchup: {
      send_action: (action: string, ...args: unknown[]) => void;
      showMessageBox: (message: string) => void;
      requestModelName: () => void;
    };
    handleRubyResponse: (response: {
      success: boolean;
      message: string;
    }) => void;
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
