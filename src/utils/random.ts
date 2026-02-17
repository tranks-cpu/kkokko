import type { DieFace } from '../types/game';
import { DICE_FACES } from '../constants/game';

export function rollDie(): DieFace {
  return DICE_FACES[Math.floor(Math.random() * DICE_FACES.length)];
}

export function generateDieId(): string {
  return Math.random().toString(36).slice(2, 8);
}
