import type { GameState } from '../types/game';

const STORAGE_KEY = 'kkokko-game-state';

export function saveState(state: GameState): void {
  try {
    const serialized = JSON.stringify(state);
    sessionStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Storage full or unavailable — silently fail
  }
}

export function loadState(): GameState | null {
  try {
    const serialized = sessionStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as GameState;
  } catch {
    return null;
  }
}

export function clearState(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}
