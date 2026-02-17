import type { GameState, GameSnapshot } from '../types/game';
import { MAX_UNDO_STACK } from '../constants/game';

export function takeSnapshot(state: GameState): GameSnapshot {
  // Deep clone without undoStack
  const { undoStack: _, ...rest } = state;
  return JSON.parse(JSON.stringify(rest));
}

export function pushSnapshot(
  undoStack: GameSnapshot[],
  snapshot: GameSnapshot
): GameSnapshot[] {
  const newStack = [...undoStack, snapshot];
  if (newStack.length > MAX_UNDO_STACK) {
    return newStack.slice(newStack.length - MAX_UNDO_STACK);
  }
  return newStack;
}

export function popSnapshot(
  undoStack: GameSnapshot[]
): { snapshot: GameSnapshot | null; newStack: GameSnapshot[] } {
  if (undoStack.length === 0) {
    return { snapshot: null, newStack: [] };
  }
  const newStack = undoStack.slice(0, -1);
  const snapshot = undoStack[undoStack.length - 1];
  return { snapshot, newStack };
}
