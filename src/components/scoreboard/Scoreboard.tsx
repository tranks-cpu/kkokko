import { useState } from 'react';
import type { Player } from '../../types/game';
import { getPlayerWormCount } from '../../logic/scoreEngine';
import { TILE_WORMS } from '../../constants/game';

interface ScoreboardProps {
  players: Player[];
  currentPlayerIndex?: number;
  stealableTileNumbers?: number[];
}

export function Scoreboard({ players, currentPlayerIndex, stealableTileNumbers = [] }: ScoreboardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-stone-800/80 rounded-xl">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 min-h-[44px]"
      >
        <span className="text-stone-400 text-sm">스코어보드</span>
        {!expanded && (
          <div className="flex items-center gap-1.5">
            {players.map((player, i) => {
              if (i === currentPlayerIndex) return null;
              const topTile = player.tileStack[player.tileStack.length - 1];
              if (topTile == null) return null;
              const isStealable = stealableTileNumbers.includes(topTile);
              return (
                <span
                  key={i}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isStealable
                      ? 'bg-red-500/80 text-white animate-pulse'
                      : 'bg-stone-700 text-stone-400'
                  }`}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1 align-middle"
                    style={{ backgroundColor: player.color }}
                  />
                  {topTile}
                </span>
              );
            })}
            <span className="text-stone-500 text-xs">▼</span>
          </div>
        )}
        {expanded && (
          <span className="text-stone-500 text-xs">▲</span>
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {players.map((player, i) => {
            const worms = getPlayerWormCount(player);
            const isCurrent = i === currentPlayerIndex;
            return (
              <div
                key={i}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${
                  isCurrent ? 'bg-stone-700' : ''
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: player.color }}
                />
                <span className="text-sm flex-1">{player.name}</span>
                <div className="flex gap-1">
                  {player.tileStack.map((num, tileIdx) => {
                    const isTopTile = tileIdx === player.tileStack.length - 1;
                    const isStealable =
                      isTopTile &&
                      !isCurrent &&
                      stealableTileNumbers.includes(num);
                    return (
                      <span
                        key={num}
                        className={`text-[10px] px-1 rounded ${
                          isStealable
                            ? 'bg-red-500/80 text-white ring-1 ring-red-400 animate-pulse'
                            : 'bg-stone-600'
                        }`}
                      >
                        {num}
                        <span className="ml-0.5">
                          {'🐛'.repeat(TILE_WORMS[num] || 0)}
                        </span>
                      </span>
                    );
                  })}
                </div>
                <span className="text-amber-400 font-bold text-sm ml-2">
                  🐛{worms}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
