import type { Tile as TileType, Player } from '../../types/game';
import { Tile } from '../tiles/Tile';
import { Button } from '../ui/Button';

interface TileSelectModalProps {
  isOpen: boolean;
  takeableTiles: TileType[];
  stealableTargets: { playerIndex: number; tileNumber: number }[];
  players: Player[];
  onTakeTile: (tileNumber: number) => void;
  onStealTile: (fromPlayerIndex: number) => void;
  onClose: () => void;
}

export function TileSelectModal({
  isOpen,
  takeableTiles,
  stealableTargets,
  players,
  onTakeTile,
  onStealTile,
  onClose,
}: TileSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
      <div className="bg-stone-800 rounded-t-2xl w-full max-w-lg p-5 pb-8 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-amber-400">타일 선택</h3>
          <button
            onClick={onClose}
            className="text-stone-400 text-2xl leading-none p-1"
          >
            ✕
          </button>
        </div>

        {/* Stealable tiles */}
        {stealableTargets.length > 0 && (
          <div className="mb-4">
            <p className="text-stone-400 text-sm mb-2">훔치기 가능</p>
            <div className="flex flex-col gap-2">
              {stealableTargets.map((t) => (
                <button
                  key={t.playerIndex}
                  onClick={() => onStealTile(t.playerIndex)}
                  className="flex items-center gap-3 bg-stone-700 rounded-lg p-3 active:bg-stone-600"
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: players[t.playerIndex].color }}
                  />
                  <span className="text-sm">
                    {players[t.playerIndex].name}
                  </span>
                  <span className="ml-auto">
                    <Tile number={t.tileNumber} size="sm" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Center tiles */}
        {takeableTiles.length > 0 && (
          <div className="mb-4">
            <p className="text-stone-400 text-sm mb-2">중앙 타일</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {takeableTiles.map((tile) => (
                <Tile
                  key={tile.number}
                  number={tile.number}
                  highlighted
                  onClick={() => onTakeTile(tile.number)}
                />
              ))}
            </div>
          </div>
        )}

        <Button variant="secondary" onClick={onClose} fullWidth>
          취소
        </Button>
      </div>
    </div>
  );
}
