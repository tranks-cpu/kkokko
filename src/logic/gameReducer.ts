import type { GameState, TurnState, DieFace } from '../types/game';
import type { GameAction } from '../types/actions';
import { TOTAL_DICE, FACE_VALUE } from '../constants/game';
import { createPlayers, createInitialTiles, createInitialGameState } from './gameInit';
import { rollDice, getDiceWithFace, getSelectableFaces } from './diceEngine';
import {
  getTakeableTiles,
  getStealableTargets,
  processBust,
  isGameOver,
} from './tileEngine';
import { takeSnapshot, pushSnapshot, popSnapshot } from './undoManager';

function createTurn(playerIndex: number): TurnState {
  return {
    currentPlayerIndex: playerIndex,
    rolledDice: [],
    keptDice: [],
    keptFaces: [],
    remainingDiceCount: TOTAL_DICE,
    currentSum: 0,
    hasWorm: false,
    turnPhase: 'rolling',
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const players = createPlayers(action.playerNames);
      const tiles = createInitialTiles();
      return {
        gamePhase: 'playing',
        players,
        tiles,
        turn: createTurn(0),
        showPassScreen: true,
        undoStack: [],
      };
    }

    case 'DISMISS_PASS_SCREEN': {
      return { ...state, showPassScreen: false };
    }

    case 'ROLL_DICE': {
      if (
        !state.turn ||
        (state.turn.turnPhase !== 'rolling' && state.turn.turnPhase !== 'decidingAction')
      )
        return state;
      if (state.turn.remainingDiceCount <= 0) return state;

      // Save snapshot before action
      const snapshot = takeSnapshot(state);
      const undoStack = pushSnapshot(state.undoStack, snapshot);

      const rolled = rollDice(state.turn.remainingDiceCount);
      const selectable = getSelectableFaces(rolled, state.turn.keptFaces);

      const newTurn: TurnState = {
        ...state.turn,
        rolledDice: rolled,
        turnPhase: selectable.length === 0 ? 'busted' : 'selectingDice',
      };

      return { ...state, turn: newTurn, undoStack };
    }

    case 'SELECT_DICE_FACE': {
      if (!state.turn || state.turn.turnPhase !== 'selectingDice') return state;

      const face: DieFace = action.face;
      if (state.turn.keptFaces.includes(face)) return state;

      const snapshot = takeSnapshot(state);
      const undoStack = pushSnapshot(state.undoStack, snapshot);

      const matchingDice = getDiceWithFace(state.turn.rolledDice, face);
      if (matchingDice.length === 0) return state;

      const newKeptDice = [...state.turn.keptDice, ...matchingDice];
      const newKeptFaces = [...state.turn.keptFaces, face];
      const addedValue = matchingDice.length * FACE_VALUE[String(face)];
      const newSum = state.turn.currentSum + addedValue;
      const newHasWorm = state.turn.hasWorm || face === 'worm';
      const newRemaining = state.turn.remainingDiceCount - matchingDice.length;

      // Determine next phase: if no remaining dice and can't take any tile, bust
      let nextPhase: import('../types/game').TurnPhase = 'decidingAction';
      if (newRemaining === 0) {
        const canTakeAny =
          newHasWorm &&
          (getTakeableTiles(state.tiles, newSum).length > 0 ||
            getStealableTargets(state.players, state.turn.currentPlayerIndex, newSum).length > 0);
        if (!canTakeAny) {
          nextPhase = 'busted';
        }
      }

      const newTurn: TurnState = {
        ...state.turn,
        keptDice: newKeptDice,
        keptFaces: newKeptFaces,
        currentSum: newSum,
        hasWorm: newHasWorm,
        remainingDiceCount: newRemaining,
        rolledDice: [],
        turnPhase: nextPhase,
      };

      return { ...state, turn: newTurn, undoStack };
    }

    case 'TAKE_TILE': {
      if (!state.turn) return state;

      const snapshot = takeSnapshot(state);
      const undoStack = pushSnapshot(state.undoStack, snapshot);

      const { currentPlayerIndex, currentSum, hasWorm } = state.turn;
      if (!hasWorm) return state;

      const tile = state.tiles.find(
        (t) => t.number === action.tileNumber && t.owner === null && !t.disabled
      );
      if (!tile || tile.number > currentSum) return state;

      const newTiles = state.tiles.map((t) =>
        t.number === action.tileNumber
          ? { ...t, owner: currentPlayerIndex }
          : t
      );
      const newPlayers = state.players.map((p, i) =>
        i === currentPlayerIndex
          ? { ...p, tileStack: [...p.tileStack, action.tileNumber] }
          : p
      );

      return {
        ...state,
        tiles: newTiles,
        players: newPlayers,
        turn: { ...state.turn, turnPhase: 'turnEnd' },
        undoStack,
      };
    }

    case 'STEAL_TILE': {
      if (!state.turn) return state;

      const snapshot = takeSnapshot(state);
      const undoStack = pushSnapshot(state.undoStack, snapshot);

      const { currentPlayerIndex, currentSum, hasWorm } = state.turn;
      if (!hasWorm) return state;

      const targets = getStealableTargets(
        state.players,
        currentPlayerIndex,
        currentSum
      );
      const target = targets.find((t) => t.playerIndex === action.fromPlayerIndex);
      if (!target) return state;

      const newPlayers = state.players.map((p, i) => {
        if (i === action.fromPlayerIndex) {
          return { ...p, tileStack: p.tileStack.slice(0, -1) };
        }
        if (i === currentPlayerIndex) {
          return { ...p, tileStack: [...p.tileStack, target.tileNumber] };
        }
        return p;
      });

      // Update tile ownership
      const newTiles = state.tiles.map((t) =>
        t.number === target.tileNumber
          ? { ...t, owner: currentPlayerIndex }
          : t
      );

      return {
        ...state,
        players: newPlayers,
        tiles: newTiles,
        turn: { ...state.turn, turnPhase: 'turnEnd' },
        undoStack,
      };
    }

    case 'RESOLVE_BUST': {
      if (!state.turn || state.turn.turnPhase !== 'busted') return state;

      const snapshot = takeSnapshot(state);
      const undoStack = pushSnapshot(state.undoStack, snapshot);

      const { currentPlayerIndex } = state.turn;
      const { tiles, player } = processBust(
        state.tiles,
        state.players[currentPlayerIndex]
      );

      const newPlayers = state.players.map((p, i) =>
        i === currentPlayerIndex ? player : p
      );

      return {
        ...state,
        tiles,
        players: newPlayers,
        turn: { ...state.turn, turnPhase: 'turnEnd' },
        undoStack,
      };
    }

    case 'END_TURN': {
      if (!state.turn || state.turn.turnPhase !== 'turnEnd') return state;

      // Check game over
      if (isGameOver(state.tiles)) {
        return {
          ...state,
          gamePhase: 'gameOver',
          turn: null,
          showPassScreen: false,
          undoStack: [],
        };
      }

      // Next player
      const nextIndex =
        (state.turn.currentPlayerIndex + 1) % state.players.length;

      return {
        ...state,
        turn: createTurn(nextIndex),
        showPassScreen: true,
        undoStack: [],
      };
    }

    case 'UNDO': {
      const { snapshot, newStack } = popSnapshot(state.undoStack);
      if (!snapshot) return state;
      return { ...snapshot, undoStack: newStack };
    }

    case 'RESET_GAME': {
      return createInitialGameState();
    }

    case 'RESTORE_STATE': {
      return action.state;
    }

    default:
      return state;
  }
}
