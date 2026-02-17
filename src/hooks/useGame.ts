import { useReducer, useMemo } from 'react';
import type { GameState } from '../types/game';
import { gameReducer } from '../logic/gameReducer';
import { createInitialGameState } from '../logic/gameInit';
import {
  getTakeableTiles,
  getStealableTargets,
  getAvailableCenterTiles,
} from '../logic/tileEngine';
import { getSelectableFaces } from '../logic/diceEngine';

export function useGame(initialState?: GameState) {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState ?? createInitialGameState()
  );

  const derived = useMemo(() => {
    const { turn, tiles, players } = state;
    if (!turn) {
      return {
        selectableFaces: [] as import('../types/game').DieFace[],
        takeableTiles: [] as import('../types/game').Tile[],
        stealableTargets: [] as { playerIndex: number; tileNumber: number }[],
        availableCenterTiles: getAvailableCenterTiles(tiles),
        canRoll: false,
        canTake: false,
        currentPlayer: null as import('../types/game').Player | null,
      };
    }

    const selectableFaces = getSelectableFaces(turn.rolledDice, turn.keptFaces);
    const takeableTiles = turn.hasWorm
      ? getTakeableTiles(tiles, turn.currentSum)
      : [];
    const stealableTargets = turn.hasWorm
      ? getStealableTargets(players, turn.currentPlayerIndex, turn.currentSum)
      : [];
    const availableCenterTiles = getAvailableCenterTiles(tiles);

    const canRoll =
      (turn.turnPhase === 'rolling' || turn.turnPhase === 'decidingAction') &&
      turn.remainingDiceCount > 0;

    const canTake =
      turn.turnPhase === 'decidingAction' &&
      turn.hasWorm &&
      (takeableTiles.length > 0 || stealableTargets.length > 0);

    const currentPlayer = players[turn.currentPlayerIndex] ?? null;

    return {
      selectableFaces,
      takeableTiles,
      stealableTargets,
      availableCenterTiles,
      canRoll,
      canTake,
      currentPlayer,
    };
  }, [state]);

  return { state, dispatch, ...derived };
}
