import type { GameState, Player, Tile } from '../types/game';
import { TILE_NUMBERS, TILE_WORMS, PLAYER_COLORS } from '../constants/game';

export function createInitialTiles(): Tile[] {
  return TILE_NUMBERS.map((num) => ({
    number: num,
    worms: TILE_WORMS[num],
    owner: null,
    disabled: false,
  }));
}

export function createPlayers(names: string[]): Player[] {
  return names.map((name, i) => ({
    name,
    color: PLAYER_COLORS[i],
    tileStack: [],
  }));
}

export function createInitialGameState(): GameState {
  return {
    gamePhase: 'setup',
    players: [],
    tiles: createInitialTiles(),
    turn: null,
    showPassScreen: false,
    undoStack: [],
  };
}
