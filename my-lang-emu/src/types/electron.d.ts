declare interface Window {
  electron: {
    loadROM: (path: string) => Promise<ArrayBuffer>;
    loadBIOS: (path: string) => Promise<ArrayBuffer>;
    selectROM: () => Promise<string>;
    selectBIOS: () => Promise<string>;
    saveState: (slot: number) => Promise<void>;
    loadState: (slot: number) => Promise<void>;
    getSettings: () => Promise<{
      biosPath?: string;
      lastRomPath?: string;
      scale?: number;
      volume?: number;
    }>;
    saveSettings: (settings: any) => Promise<void>;
  };
  gamepad: {
    getGamepads: () => (Gamepad | null)[];
    requestGamepadAccess: () => Promise<boolean>;
  };
}
