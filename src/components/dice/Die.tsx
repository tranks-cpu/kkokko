import { motion } from 'framer-motion';
import type { DieFace } from '../../types/game';

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
};

interface DieProps {
  face: DieFace;
  size?: number;
  highlighted?: boolean;
  dimmed?: boolean;
  onClick?: () => void;
  animate?: boolean;
}

export function Die({
  face,
  size = 48,
  highlighted = false,
  dimmed = false,
  onClick,
  animate = false,
}: DieProps) {
  const isWorm = face === 'worm';
  const dotSize = size * 0.16;

  const content = isWorm ? (
    <span style={{ fontSize: size * 0.5 }}>🐛</span>
  ) : (
    <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 100 100">
      {DOT_POSITIONS[face as number]?.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={dotSize} fill="white" />
      ))}
    </svg>
  );

  return (
    <motion.div
      className={`
        rounded-lg border-2 flex items-center justify-center
        ${highlighted ? 'border-amber-400 shadow-lg shadow-amber-400/30' : 'border-stone-500'}
        ${dimmed ? 'opacity-40' : ''}
        ${onClick ? 'cursor-pointer active:scale-95' : ''}
      `}
      style={{
        width: size,
        height: size,
        backgroundColor: isWorm ? '#b45309' : '#292524',
      }}
      onClick={onClick}
      animate={
        animate
          ? { rotateX: [0, 360, 720], rotateY: [0, 180, 360] }
          : { rotateX: 0, rotateY: 0 }
      }
      transition={{ duration: animate ? 0.5 : 0, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  );
}
