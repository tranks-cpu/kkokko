import type { Tile as TileType } from '../../types/game';
import { Tile } from './Tile';

interface CenterTilesProps {
  tiles: TileType[];
  takeableNumbers?: number[];
  onTakeTile?: (tileNumber: number) => void;
}

export function CenterTiles({
  tiles,
  takeableNumbers = [],
  onTakeTile,
}: CenterTilesProps) {
  // Only show center tiles (not owned)
  const centerTiles = tiles.filter((t) => t.owner === null);
  // Split into two rows
  const mid = Math.ceil(centerTiles.length / 2);
  const row1 = centerTiles.slice(0, mid);
  const row2 = centerTiles.slice(mid);

  const renderRow = (row: TileType[]) => (
    <div className="flex gap-1 justify-center flex-wrap">
      {row.map((tile) => {
        const takeable = takeableNumbers.includes(tile.number);
        return (
          <Tile
            key={tile.number}
            number={tile.number}
            disabled={tile.disabled}
            highlighted={takeable}
            onClick={takeable && onTakeTile ? () => onTakeTile(tile.number) : undefined}
            size="sm"
          />
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      {renderRow(row1)}
      {row2.length > 0 && renderRow(row2)}
    </div>
  );
}
