import { useState, useMemo } from 'react';
import { useGameContext } from '../context/GameContext';
import { DiceGroup } from '../components/dice/DiceGroup';
import { KeptDiceArea } from '../components/dice/KeptDiceArea';
import { CenterTiles } from '../components/tiles/CenterTiles';
import { ActionBar } from '../components/game/ActionBar';
import { TileSelectModal } from '../components/modals/TileSelectModal';
import { getSelectableFaces } from '../logic/diceEngine';
import { getTakeableTiles, getStealableTargets } from '../logic/tileEngine';
import { Scoreboard } from '../components/scoreboard/Scoreboard';
import { vibrate } from '../utils/haptic';

export function GameScreen() {
  const { state, dispatch } = useGameContext();
  const [showTileModal, setShowTileModal] = useState(false);
  const [diceAnimating, setDiceAnimating] = useState(false);

  const turn = state.turn;
  if (!turn) return null;

  const player = state.players[turn.currentPlayerIndex];
  const selectableFaces = useMemo(
    () => getSelectableFaces(turn.rolledDice, turn.keptFaces),
    [turn.rolledDice, turn.keptFaces]
  );

  const takeableTiles = useMemo(
    () => (turn.hasWorm ? getTakeableTiles(state.tiles, turn.currentSum) : []),
    [state.tiles, turn.currentSum, turn.hasWorm]
  );

  const stealableTargets = useMemo(
    () =>
      getStealableTargets(
        state.players,
        turn.currentPlayerIndex,
        turn.currentSum
      ),
    [state.players, turn.currentPlayerIndex, turn.currentSum]
  );

  const canRoll =
    (turn.turnPhase === 'rolling' || turn.turnPhase === 'decidingAction') &&
    turn.remainingDiceCount > 0;

  const canTake =
    turn.turnPhase === 'decidingAction' &&
    turn.hasWorm &&
    (takeableTiles.length > 0 || stealableTargets.length > 0);

  const handleRoll = () => {
    if (!canRoll || diceAnimating) return;
    vibrate(15);
    setDiceAnimating(true);
    dispatch({ type: 'ROLL_DICE' });
    setTimeout(() => setDiceAnimating(false), 500);
  };

  const handleSelectFace = (face: import('../types/game').DieFace) => {
    vibrate(10);
    dispatch({ type: 'SELECT_DICE_FACE', face });
  };

  const handleTakeTile = (tileNumber: number) => {
    vibrate(20);
    dispatch({ type: 'TAKE_TILE', tileNumber });
    setShowTileModal(false);
  };

  const handleStealTile = (fromPlayerIndex: number) => {
    vibrate(30);
    dispatch({ type: 'STEAL_TILE', fromPlayerIndex });
    setShowTileModal(false);
  };

  const takeableNumbers = takeableTiles.map((t) => t.number);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          {state.undoStack.length > 0 && (
            <button
              onClick={() => dispatch({ type: 'UNDO' })}
              className="text-stone-400 text-xl p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              ↩
            </button>
          )}
        </div>
        <div className="text-center">
          <span className="font-bold" style={{ color: player.color }}>
            {player.name}
          </span>
          <span className="text-stone-500 text-sm ml-2">
            🎲 {turn.remainingDiceCount}개
          </span>
        </div>
        <button
          onClick={() => {
            if (confirm('새 게임을 시작할까요?')) {
              dispatch({ type: 'RESET_GAME' });
            }
          }}
          className="text-stone-500 text-xs p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          새게임
        </button>
      </div>

      {/* Center tiles */}
      <div className="px-3 py-2">
        <CenterTiles
          tiles={state.tiles}
          takeableNumbers={canTake ? takeableNumbers : []}
          onTakeTile={canTake ? handleTakeTile : undefined}
        />
      </div>

      {/* Scoreboard */}
      <div className="px-3 py-1">
        <Scoreboard
          players={state.players}
          currentPlayerIndex={turn.currentPlayerIndex}
          stealableTileNumbers={stealableTargets.map((t) => t.tileNumber)}
        />
      </div>

      {/* Kept dice */}
      <div className="px-3 py-2">
        <KeptDiceArea
          keptDice={turn.keptDice}
          currentSum={turn.currentSum}
          hasWorm={turn.hasWorm}
        />
        {player.tileStack.length > 0 && turn.keptDice.length > 0 && (
          <p className="text-xs text-red-400 mt-1 text-center">
            💥 버스트 시 -{player.tileStack[player.tileStack.length - 1]}
          </p>
        )}
      </div>

      {/* Rolled dice area */}
      <div className="flex-1 flex items-center justify-center px-4">
        {turn.rolledDice.length > 0 ? (
          <DiceGroup
            dice={turn.rolledDice}
            selectableFaces={turn.turnPhase === 'selectingDice' ? selectableFaces : []}
            onSelectFace={turn.turnPhase === 'selectingDice' ? handleSelectFace : undefined}
            animate={diceAnimating}
          />
        ) : turn.turnPhase === 'rolling' ? (
          <p className="text-stone-600">주사위를 굴려주세요</p>
        ) : turn.turnPhase === 'decidingAction' ? (
          <p className="text-stone-500 text-sm">
            다시 굴리거나 타일을 가져오세요
          </p>
        ) : null}
      </div>

      {/* Action bar */}
      <div className="px-4 pb-4">
        <ActionBar
          canRoll={canRoll && !diceAnimating}
          canTake={canTake}
          isBusted={turn.turnPhase === 'busted'}
          isTurnEnd={turn.turnPhase === 'turnEnd'}
          isSelecting={turn.turnPhase === 'selectingDice'}
          remainingDice={turn.remainingDiceCount}
          onRoll={handleRoll}
          onTake={() => setShowTileModal(true)}
          onResolveBust={() => dispatch({ type: 'RESOLVE_BUST' })}
          onEndTurn={() => dispatch({ type: 'END_TURN' })}
        />
      </div>

      {/* Tile selection modal */}
      <TileSelectModal
        isOpen={showTileModal}
        takeableTiles={takeableTiles}
        stealableTargets={stealableTargets}
        players={state.players}
        onTakeTile={handleTakeTile}
        onStealTile={handleStealTile}
        onClose={() => setShowTileModal(false)}
      />
    </div>
  );
}
