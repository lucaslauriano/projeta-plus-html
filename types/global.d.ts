declare global {
  interface Window {
    sketchup: {
      send_action: (action: string, ...args: unknown[]) => void;
      showMessageBox: (message: string) => void;
      requestModelName: () => void;
    };
    handleRubyResponse: (response: { success: boolean; message: string }) => void;
    receiveModelNameFromRuby?: (modelName: string) => void;
  }
}

export {};
