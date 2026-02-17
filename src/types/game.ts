export type DieFace = 1 | 2 | 3 | 4 | 5 | 'worm';
export type GamePhase = 'setup' | 'playing' | 'gameOver';
export type TurnPhase =
  | 'rolling'
  | 'selectingDice'
  | 'decidingAction'
  | 'takingTile'
  | 'busted'
  | 'turnEnd';

export interface Die {
  id: string;
  face: DieFace;
}

export interface Tile {
  number: number;       // 21–36
  worms: number;        // 1–4
  owner: number | null; // playerIndex or null (center)
  disabled: boolean;    // permanently removed (flipped)
}

export interface Player {
  name: string;
  color: string;
  tileStack: number[];  // tile numbers, top = last element
}

export interface TurnState {
  currentPlayerIndex: number;
  rolledDice: Die[];
  keptDice: Die[];
  keptFaces: DieFace[];      // serializable (treated as Set in logic)
  remainingDiceCount: number;
  currentSum: number;
  hasWorm: boolean;
  turnPhase: TurnPhase;
}

export interface GameState {
  gamePhase: GamePhase;
  players: Player[];
  tiles: Tile[];
  turn: TurnState | null;
  showPassScreen: boolean;
  undoStack: GameSnapshot[];
}

export type GameSnapshot = Omit<GameState, 'undoStack'>;
