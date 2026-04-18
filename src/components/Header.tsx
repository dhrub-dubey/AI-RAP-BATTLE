import { Mic2, Zap } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  return (
    <header className="relative z-10 border-b border-cyan-500/30 bg-black/60 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 rounded-full" />
            <div className="relative bg-black border border-cyan-500 rounded-full p-2">
              <Mic2 className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-white">
              AI <span className="text-cyan-400 neon-text">RAP BATTLE</span> ARENA
            </h1>
            <p className="text-xs text-gray-500 tracking-widest uppercase">Drop bars. Get roasted.</p>
          </div>
        </div>

        <button
          onClick={() => {
            setTimeout(() => {
              onReset();
            }, 2000);
          }}
          className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-400 rounded text-sm font-bold tracking-wider hover:bg-red-500/10 hover:border-red-400 transition-all duration-200"
        >
          <Zap className="w-4 h-4" />
          NEW BATTLE
        </button>
      </div>
    </header>
  );
}
