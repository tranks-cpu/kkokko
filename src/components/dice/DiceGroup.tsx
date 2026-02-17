import type { Die as DieType, DieFace } from '../../types/game';
import { Die } from './Die';

interface DiceGroupProps {
  dice: DieType[];
  selectableFaces?: DieFace[];
  onSelectFace?: (face: DieFace) => void;
  animate?: boolean;
}

export function DiceGroup({
  dice,
  selectableFaces = [],
  onSelectFace,
  animate = false,
}: DiceGroupProps) {
  if (dice.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {dice.map((die) => {
        const selectable = selectableFaces.includes(die.face);
        return (
          <Die
            key={die.id}
            face={die.face}
            highlighted={selectable}
            dimmed={!selectable && selectableFaces.length > 0}
            onClick={selectable && onSelectFace ? () => onSelectFace(die.face) : undefined}
            animate={animate}
          />
        );
      })}
    </div>
  );
}
