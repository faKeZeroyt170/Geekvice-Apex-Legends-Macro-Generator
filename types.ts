
export enum ActionType {
  STICK_MOVE = 'STICK_MOVE',
  WAIT = 'WAIT',
  KEY_PRESS = 'KEY_PRESS',
  CLICK = 'CLICK'
}

export interface MacroAction {
  id: string;
  type: ActionType;
  stick?: 'LS' | 'RS'; // LS = Left Stick, RS = Right Stick
  x?: number; // Percentage -100 to 100
  y?: number; // Percentage -100 to 100
  duration?: number;
  key?: string; // Physical button name (e.g., "A", "CROSS")
  role?: string; // Logical role (e.g., "jump", "crouch")
  button?: 'left' | 'right' | 'middle';
}

export interface MacroProject {
  id: string;
  name: string;
  actions: MacroAction[];
  bindings: Record<string, string>; // Maps role (jump) to physical key (A)
  instructions?: string; // AI generated guide for Geekvice
  lastModified: number;
}
