import { useGameContext } from '../context/GameContext';
import { Button } from '../components/ui/Button';
import { PLAYER_BG_COLORS } from '../constants/ui';

export function PassScreen() {
  const { state, dispatch } = useGameContext();
  const turn = state.turn;
  if (!turn) return null;

  const player = state.players[turn.currentPlayerIndex];
  const bgColor = PLAYER_BG_COLORS[turn.currentPlayerIndex];

  return (
    <div
      className={`flex flex-col items-center justify-center h-full gap-8 ${bgColor}`}
    >
      <div
        className="w-20 h-20 rounded-full border-4 border-white/30"
        style={{ backgroundColor: player.color }}
      />
      <h2 className="text-3xl font-bold">{player.name}</h2>
      <p className="text-stone-300">차례입니다</p>
      <Button onClick={() => dispatch({ type: 'DISMISS_PASS_SCREEN' })}>
        준비 완료
      </Button>
    </div>
  );
}
