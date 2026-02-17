import { useGameContext } from '../context/GameContext';
import { Button } from '../components/ui/Button';
import { getRankings } from '../logic/scoreEngine';
import { motion } from 'framer-motion';

export function GameOverScreen() {
  const { state, dispatch } = useGameContext();
  const rankings = getRankings(state.players);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-6">
      <motion.h2
        className="text-3xl font-bold text-amber-400"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
      >
        🎉 게임 종료!
      </motion.h2>

      <div className="w-full max-w-sm space-y-3">
        {rankings.map((r, rank) => (
          <motion.div
            key={r.playerIndex}
            className={`flex items-center gap-3 p-4 rounded-xl ${
              rank === 0 ? 'bg-amber-900/50 border border-amber-500' : 'bg-stone-800'
            }`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.15 }}
          >
            <span className="text-2xl font-bold text-stone-400 w-8">
              {rank + 1}
            </span>
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: r.color }}
            />
            <div className="flex-1">
              <p className="font-bold">{r.name}</p>
              <p className="text-sm text-stone-400">
                타일 {r.tileCount}장
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-amber-400">
                🐛 {r.worms}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3 w-full max-w-sm">
        <Button
          onClick={() => dispatch({ type: 'RESET_GAME' })}
          fullWidth
        >
          다시 하기
        </Button>
      </div>
    </div>
  );
}
