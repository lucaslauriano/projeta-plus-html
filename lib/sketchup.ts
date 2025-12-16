import { ReactNode } from 'react';

interface SketchUpBridge {
  call: (callback: string, ...args: unknown[]) => void;
}

declare global {
  interface Window {
    skp: SketchUpBridge;
  }
}

export class SketchUpAPI {
  static isInSketchUp(): boolean {
    return typeof window !== 'undefined' && 'skp' in window;
  }

  static async sendMessage(message: string): Promise<void> {
    if (this.isInSketchUp()) {
      window.skp.call('showMessageBox', message);
    } else {
      console.error('Not in SketchUp:', message);
    }
  }

  static async getModelName(): Promise<string | null> {
    if (this.isInSketchUp()) {
      return new Promise((resolve) => {
        // Register a one-time callback to receive the model name
        const callbackName = 'receiveModelName';
        (window as unknown as { [key: string]: unknown })[callbackName] = (
          modelName: string
        ) => {
          delete (window as unknown as { [key: string]: unknown })[
            callbackName
          ];
          resolve(modelName);
        };
        window.skp.call('requestModelName');
      });
    }
    return null;
  }

  static async getSelectionInfo(): Promise<ReactNode> {
    if (this.isInSketchUp()) {
      return new Promise((resolve) => {
        const callbackName = 'receiveSelectionInfo';
        (window as unknown as { [key: string]: unknown })[callbackName] = (
          info: unknown
        ) => {
          delete (window as unknown as { [key: string]: unknown })[
            callbackName
          ];
          resolve(info as ReactNode);
        };
        window.skp.call('requestSelectionInfo');
      });
    }
    return null;
  }
}
