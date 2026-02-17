import { SafeAreaWrapper } from './components/ui/SafeAreaWrapper';
import { GameContext } from './context/GameContext';
import { useGame } from './hooks/useGame';
import { useSessionPersist } from './hooks/useSessionPersist';
import { SetupScreen } from './screens/SetupScreen';
import { PassScreen } from './screens/PassScreen';
import { GameScreen } from './screens/GameScreen';
import { GameOverScreen } from './screens/GameOverScreen';

function AppContent() {
  const game = useGame();
  const { state, dispatch } = game;

  useSessionPersist(state, dispatch);

  let screen: React.ReactNode;

  if (state.gamePhase === 'setup') {
    screen = <SetupScreen />;
  } else if (state.gamePhase === 'gameOver') {
    screen = <GameOverScreen />;
  } else if (state.showPassScreen) {
    screen = <PassScreen />;
  } else {
    screen = <GameScreen />;
  }

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <SafeAreaWrapper>{screen}</SafeAreaWrapper>
    </GameContext.Provider>
  );
}

export default function App() {
  return <AppContent />;
}
