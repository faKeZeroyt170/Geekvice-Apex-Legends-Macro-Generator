
import { MacroProject, ActionType } from './types';

export const MOVEMENT_TEMPLATES = [
  {
    id: 'superglide',
    name: 'Superglide (Stick-Sync)',
    category: 'Elite',
  },
  {
    id: 'tapstrafe_ctrl',
    name: 'Controller Tap-Strafe',
    category: 'Advanced',
  },
  {
    id: 'neostrafe_ctrl',
    name: 'Neo-Strafe (Circle)',
    category: 'Elite',
  },
  {
    id: 'wallbounce',
    name: 'Auto Wall-Bounce',
    category: 'Advanced',
  }
];

export const MOCK_PROJECTS: MacroProject[] = [
  {
    id: 'proj_1',
    name: 'LS Superglide Elite',
    bindings: {
      jump: 'CROSS / A',
      crouch: 'CIRCLE / B',
      interact: 'SQUARE / X',
      tactical: 'L1 / LB'
    },
    actions: [
      { id: '1', type: ActionType.STICK_MOVE, stick: 'LS', x: 0, y: -100, duration: 40 },
      { id: '2', type: ActionType.WAIT, duration: 10 },
      { id: '3', type: ActionType.KEY_PRESS, role: 'jump', key: 'CROSS / A', duration: 15 },
      { id: '4', type: ActionType.KEY_PRESS, role: 'crouch', key: 'CIRCLE / B', duration: 15 },
      { id: '5', type: ActionType.STICK_MOVE, stick: 'LS', x: 0, y: 100, duration: 30 }
    ],
    instructions: "1. Öffne Geekvice App\n2. Gehe zum 'Stick Curve' Tab\n3. Lade dieses Makro auf dein Aimzenox Profil\n4. Die Stick-Werte sind in Prozent angegeben, um maximale Kompatibilität zu gewährleisten.",
    lastModified: Date.now()
  }
];
