import type { Die as DieType } from '../../types/game';
import { Die } from './Die';

interface KeptDiceAreaProps {
  keptDice: DieType[];
  currentSum: number;
  hasWorm: boolean;
}

export function KeptDiceArea({ keptDice, currentSum, hasWorm }: KeptDiceAreaProps) {
  return (
    <div className="bg-stone-800/50 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-stone-400 text-sm">확보한 주사위</span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-amber-400">{currentSum}</span>
          {hasWorm && <span className="text-sm">🐛</span>}
        </div>
      </div>
      {keptDice.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {keptDice.map((die) => (
            <Die key={die.id} face={die.face} size={36} />
          ))}
        </div>
      ) : (
        <p className="text-stone-600 text-sm text-center py-2">
          아직 없음
        </p>
      )}
    </div>
  );
}
