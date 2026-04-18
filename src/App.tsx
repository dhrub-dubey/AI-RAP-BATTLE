import { useBattle } from './hooks/useBattle';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { BattleControls } from './components/BattleControls';
import { CrowdMeter } from './components/CrowdMeter';

function App() {
  const { state, setIntensity, setPersona, sendMessage, resetBattle } = useBattle();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="scanlines fixed inset-0 pointer-events-none z-50" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.07)_0%,_transparent_60%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(249,115,22,0.05)_0%,_transparent_60%)] pointer-events-none" />

      <Header onReset={resetBattle} />

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-4 gap-4 min-h-0">
        <CrowdMeter score={state.crowdScore} />

        <div className="flex-1 bg-black/40 border border-gray-800 rounded-xl flex flex-col overflow-hidden min-h-[400px]">
          <ChatWindow messages={state.messages} isLoading={state.isLoading} />
        </div>

        <BattleControls
          intensity={state.intensity}
          persona={state.persona}
          isLoading={state.isLoading}
          onIntensityChange={setIntensity}
          onPersonaChange={setPersona}
          onSend={sendMessage}
        />
      </main>
    </div>
  );
}

export default App;
