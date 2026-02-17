import { TILE_WORMS } from '../../constants/game';

interface TileProps {
  number: number;
  disabled?: boolean;
  owned?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export function Tile({
  number,
  disabled = false,
  owned = false,
  highlighted = false,
  onClick,
  size = 'md',
}: TileProps) {
  const worms = TILE_WORMS[number] || 0;
  const isSm = size === 'sm';

  return (
    <button
      onClick={onClick}
      disabled={disabled || (!onClick && !highlighted)}
      className={`
        ${isSm ? 'w-10 h-14' : 'w-12 h-16'} rounded-lg flex flex-col items-center justify-center
        border-2 transition-all font-bold
        ${disabled
          ? 'bg-stone-800 border-stone-700 opacity-30'
          : highlighted
            ? 'bg-amber-900 border-amber-400 shadow-md shadow-amber-400/20 active:scale-95'
            : owned
              ? 'bg-stone-700 border-stone-500'
              : 'bg-stone-700 border-stone-600'
        }
        ${onClick && !disabled ? 'cursor-pointer' : ''}
      `}
    >
      <span className={`${isSm ? 'text-xs' : 'text-sm'} text-stone-300`}>
        {number}
      </span>
      <div className={`flex gap-0.5 ${isSm ? 'mt-0' : 'mt-0.5'}`}>
        {Array.from({ length: worms }, (_, i) => (
          <span key={i} className={isSm ? 'text-[8px]' : 'text-[10px]'}>
            🐛
          </span>
        ))}
      </div>
    </button>
  );
}
