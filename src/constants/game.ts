import type { DieFace } from '../types/game';

export const TOTAL_DICE = 8;

export const DICE_FACES: DieFace[] = [1, 2, 3, 4, 5, 'worm'];

// Worm = 5 points for sum calculation
export const FACE_VALUE: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  'worm': 5,
};

// Tile number → worm count mapping (21–36)
export const TILE_WORMS: Record<number, number> = {
  21: 1, 22: 1, 23: 1, 24: 1,
  25: 2, 26: 2, 27: 2, 28: 2,
  29: 3, 30: 3, 31: 3, 32: 3,
  33: 4, 34: 4, 35: 4, 36: 4,
};

export const TILE_NUMBERS = Array.from({ length: 16 }, (_, i) => 21 + i);
export const MIN_TILE = 21;
export const MAX_TILE = 36;

export const PLAYER_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#a855f7', // purple
];

export const PLAYER_COLOR_NAMES = ['빨강', '파랑', '초록', '보라'];

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;

export const MAX_UNDO_STACK = 20;
