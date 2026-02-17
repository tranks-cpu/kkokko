import type { DieFace, GameState } from './game';

export type GameAction =
  | { type: 'START_GAME'; playerNames: string[] }
  | { type: 'DISMISS_PASS_SCREEN' }
  | { type: 'ROLL_DICE' }
  | { type: 'SELECT_DICE_FACE'; face: DieFace }
  | { type: 'TAKE_TILE'; tileNumber: number }
  | { type: 'STEAL_TILE'; fromPlayerIndex: number }
  | { type: 'RESOLVE_BUST' }
  | { type: 'END_TURN' }
  | { type: 'UNDO' }
  | { type: 'RESET_GAME' }
  | { type: 'RESTORE_STATE'; state: GameState };
