import { Button } from '../ui/Button';

interface ActionBarProps {
  canRoll: boolean;
  canTake: boolean;
  isBusted: boolean;
  isTurnEnd: boolean;
  isSelecting: boolean;
  remainingDice: number;
  onRoll: () => void;
  onTake: () => void;
  onResolveBust: () => void;
  onEndTurn: () => void;
}

export function ActionBar({
  canRoll,
  canTake,
  isBusted,
  isTurnEnd,
  isSelecting,
  remainingDice,
  onRoll,
  onTake,
  onResolveBust,
  onEndTurn,
}: ActionBarProps) {
  if (isTurnEnd) {
    return (
      <div className="flex justify-center">
        <Button onClick={onEndTurn} fullWidth>
          다음 플레이어
        </Button>
      </div>
    );
  }

  if (isBusted) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-red-400 font-bold">💥 버스트!</p>
        <p className="text-stone-400 text-sm">선택 가능한 눈금이 없습니다</p>
        <Button variant="danger" onClick={onResolveBust} fullWidth>
          확인
        </Button>
      </div>
    );
  }

  if (isSelecting) {
    return (
      <div className="flex justify-center">
        <p className="text-amber-400 text-sm">눈금을 선택하세요</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {remainingDice > 0 && (
        <Button onClick={onRoll} disabled={!canRoll} className="flex-1">
          🎲 굴리기
        </Button>
      )}
      {canTake && (
        <Button variant="secondary" onClick={onTake} className="flex-1">
          타일 가져오기
        </Button>
      )}
    </div>
  );
}
