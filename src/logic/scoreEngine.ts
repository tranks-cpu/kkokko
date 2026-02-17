import type { Player, Tile } from '../types/game';
import { TILE_WORMS } from '../constants/game';

export function getPlayerWormCount(player: Player): number {
  return player.tileStack.reduce((sum, num) => sum + (TILE_WORMS[num] || 0), 0);
}

export interface PlayerRanking {
  playerIndex: number;
  name: string;
  color: string;
  worms: number;
  tileCount: number;
}

export function getRankings(players: Player[]): PlayerRanking[] {
  const rankings: PlayerRanking[] = players.map((p, i) => ({
    playerIndex: i,
    name: p.name,
    color: p.color,
    worms: getPlayerWormCount(p),
    tileCount: p.tileStack.length,
  }));

  // Sort by worms descending, then by tile count descending
  rankings.sort((a, b) => {
    if (b.worms !== a.worms) return b.worms - a.worms;
    return b.tileCount - a.tileCount;
  });

  return rankings;
}

export function getWinner(players: Player[]): PlayerRanking {
  return getRankings(players)[0];
}

export function getTotalWormsOnTiles(_tiles: Tile[]): number {
  // Total worms in the game
  return Object.values(TILE_WORMS).reduce((sum, w) => sum + w, 0);
}
