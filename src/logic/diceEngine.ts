import type { Die, DieFace, TurnState } from '../types/game';
import { FACE_VALUE } from '../constants/game';
import { rollDie, generateDieId } from '../utils/random';

export function rollDice(count: number): Die[] {
  return Array.from({ length: count }, () => ({
    id: generateDieId(),
    face: rollDie(),
  }));
}

export function getSelectableFaces(
  rolledDice: Die[],
  keptFaces: DieFace[]
): DieFace[] {
  const available = new Set<DieFace>();
  for (const die of rolledDice) {
    if (!keptFaces.includes(die.face)) {
      available.add(die.face);
    }
  }
  return Array.from(available);
}

export function getDiceWithFace(dice: Die[], face: DieFace): Die[] {
  return dice.filter((d) => d.face === face);
}

export function calculateSum(keptDice: Die[]): number {
  return keptDice.reduce((sum, die) => sum + FACE_VALUE[String(die.face)], 0);
}

export function hasWormInKept(keptFaces: DieFace[]): boolean {
  return keptFaces.includes('worm');
}

export function isBusted(turn: TurnState): boolean {
  // Busted if no selectable faces remain after rolling
  const selectable = getSelectableFaces(turn.rolledDice, turn.keptFaces);
  return selectable.length === 0;
}
