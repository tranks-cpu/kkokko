import { useEffect } from 'react';
import type { GameState } from '../types/game';
import { saveState, loadState } from '../utils/storage';

export function useSessionPersist(
  state: GameState,
  dispatch: React.Dispatch<{ type: 'RESTORE_STATE'; state: GameState }>
) {
  // Restore on mount
  useEffect(() => {
    const saved = loadState();
    if (saved && saved.gamePhase !== 'setup') {
      dispatch({ type: 'RESTORE_STATE', state: saved });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save on every state change
  useEffect(() => {
    if (state.gamePhase !== 'setup') {
      saveState(state);
    }
  }, [state]);
}
