import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { useGameContext } from '../context/GameContext';
import {
  MIN_PLAYERS,
  MAX_PLAYERS,
  PLAYER_COLORS,
  PLAYER_COLOR_NAMES,
} from '../constants/game';

const DEFAULT_NAMES = ['플레이어 1', '플레이어 2', '플레이어 3', '플레이어 4'];

export function SetupScreen() {
  const { dispatch } = useGameContext();
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState(DEFAULT_NAMES);

  const handleNameChange = (index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleStart = () => {
    const playerNames = names
      .slice(0, playerCount)
      .map((n, i) => n.trim() || DEFAULT_NAMES[i]);
    dispatch({ type: 'START_GAME', playerNames });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-8">
      <h1 className="text-4xl font-bold text-amber-400">꼬꼬미노</h1>
      <p className="text-stone-400 text-sm">Heckmeck am Bratwurmeck</p>

      {/* Player count */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-stone-300">인원 수</p>
        <div className="flex gap-3">
          {Array.from(
            { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
            (_, i) => i + MIN_PLAYERS
          ).map((n) => (
            <button
              key={n}
              onClick={() => setPlayerCount(n)}
              className={`
                w-14 h-14 rounded-xl text-xl font-bold transition-all
                ${
                  playerCount === n
                    ? 'bg-amber-500 text-stone-900 scale-110'
                    : 'bg-stone-700 text-stone-300'
                }
              `}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Player names */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {Array.from({ length: playerCount }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full shrink-0"
              style={{ backgroundColor: PLAYER_COLORS[i] }}
            />
            <input
              type="text"
              value={names[i]}
              onChange={(e) => handleNameChange(i, e.target.value)}
              placeholder={DEFAULT_NAMES[i]}
              maxLength={8}
              className="
                flex-1 bg-stone-800 text-stone-100 rounded-lg
                px-3 py-2.5 text-base
                border border-stone-600 focus:border-amber-500
                outline-none transition-colors
              "
            />
            <span className="text-stone-500 text-xs w-10 text-right">
              {PLAYER_COLOR_NAMES[i]}
            </span>
          </div>
        ))}
      </div>

      <Button onClick={handleStart} fullWidth className="max-w-xs">
        게임 시작
      </Button>
    </div>
  );
}
