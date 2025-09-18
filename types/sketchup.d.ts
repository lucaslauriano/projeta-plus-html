interface SketchUpBridge {
  startRoomAnnotation: (args: RoomAnnotationArgs) => void;
  showMessageBox: (message: string) => void;
  requestModelName: () => void;
}

interface RoomAnnotationArgs {
  enviroment_name?: string;
  floor_height?: string | number;
  show_ceilling_height?: string;
  ceilling_height?: string | number;
  show_level?: string;
  level?: string | number;
  scale?: number;
  font?: string;
}

interface RoomAnnotationResult {
  success: boolean;
  message: string;
}

interface Window {
  sketchup?: SketchUpBridge;
  handleRoomAnnotationResult?: (result: RoomAnnotationResult) => void;
}
