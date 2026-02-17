import { useState } from 'react';
import type { Player } from '../../types/game';
import { getPlayerWormCount } from '../../logic/scoreEngine';
import { TILE_WORMS } from '../../constants/game';

interface ScoreboardProps {
  players: Player[];
  currentPlayerIndex?: number;
}

export function Scoreboard({ players, currentPlayerIndex }: ScoreboardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-stone-800/80 rounded-xl">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 min-h-[44px]"
      >
        <span className="text-stone-400 text-sm">스코어보드</span>
        <span className="text-stone-500 text-xs">{expanded ? '▲' : '▼'}</span>
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
                  {player.tileStack.map((num) => (
                    <span
                      key={num}
                      className="text-[10px] bg-stone-600 px-1 rounded"
                    >
                      {num}
                      <span className="ml-0.5">
                        {'🐛'.repeat(TILE_WORMS[num] || 0)}
                      </span>
                    </span>
                  ))}
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
