import type { Tile, Player } from '../types/game';

/** Get available center tiles (not owned, not disabled) sorted ascending */
export function getAvailableCenterTiles(tiles: Tile[]): Tile[] {
  return tiles
    .filter((t) => t.owner === null && !t.disabled)
    .sort((a, b) => a.number - b.number);
}

/** Get the highest available center tile with number <= sum */
export function getBestTile(tiles: Tile[], sum: number): Tile | null {
  const available = getAvailableCenterTiles(tiles);
  const eligible = available.filter((t) => t.number <= sum);
  return eligible.length > 0 ? eligible[eligible.length - 1] : null;
}

/** Get all center tiles that can be taken (number <= sum) */
export function getTakeableTiles(tiles: Tile[], sum: number): Tile[] {
  return getAvailableCenterTiles(tiles).filter((t) => t.number <= sum);
}

/** Get players whose top tile can be stolen (exact sum match) */
export function getStealableTargets(
  players: Player[],
  currentPlayerIndex: number,
  sum: number
): { playerIndex: number; tileNumber: number }[] {
  const targets: { playerIndex: number; tileNumber: number }[] = [];

  for (let i = 0; i < players.length; i++) {
    if (i === currentPlayerIndex) continue;
    const stack = players[i].tileStack;
    if (stack.length === 0) continue;
    const topTile = stack[stack.length - 1];
    if (topTile === sum) {
      targets.push({ playerIndex: i, tileNumber: topTile });
    }
  }

  return targets;
}

/** Check if the game is over (all center tiles gone or disabled) */
export function isGameOver(tiles: Tile[]): boolean {
  return tiles.every((t) => t.owner !== null || t.disabled);
}

/** Get the highest non-disabled center tile (for bust removal) */
export function getHighestCenterTile(tiles: Tile[]): Tile | null {
  const available = getAvailableCenterTiles(tiles);
  return available.length > 0 ? available[available.length - 1] : null;
}

/** Handle bust: return player's top tile to center, disable highest center tile */
export function processBust(
  tiles: Tile[],
  player: Player
): { tiles: Tile[]; player: Player } {
  let newTiles = [...tiles.map((t) => ({ ...t }))];
  let newPlayer = {
    ...player,
    tileStack: [...player.tileStack],
  };

  // Return top tile to center
  if (newPlayer.tileStack.length > 0) {
    const returnedNumber = newPlayer.tileStack.pop()!;
    newTiles = newTiles.map((t) =>
      t.number === returnedNumber ? { ...t, owner: null } : t
    );
  }

  // Disable highest available center tile
  const highest = getHighestCenterTile(newTiles);
  if (highest) {
    newTiles = newTiles.map((t) =>
      t.number === highest.number ? { ...t, disabled: true } : t
    );
  }

  return { tiles: newTiles, player: newPlayer };
}
