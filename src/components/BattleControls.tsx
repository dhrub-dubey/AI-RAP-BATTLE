import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import type { Persona } from '../types';

interface BattleControlsProps {
  intensity: number;
  persona: Persona;
  isLoading: boolean;
  onIntensityChange: (value: number) => void;
  onPersonaChange: (value: Persona) => void;
  onSend: (message: string) => void;
}

const PERSONAS: { value: Persona; label: string; desc: string }[] = [
  { value: 'street', label: 'Street Rapper', desc: 'Slang, bold, punchy' },
  { value: 'shakespeare', label: 'Shakespeare Rapper', desc: 'Old English + poetic rhymes' },
  { value: 'corporate', label: 'Corporate Rapper', desc: 'Business jargon + sarcasm' },
  { value: 'rogue', label: 'AI Gone Rogue', desc: 'Chaotic, dramatic, over-the-top' },
];

const INTENSITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Playful', color: 'text-blue-400' },
  2: { label: 'Spicy', color: 'text-yellow-400' },
  3: { label: 'Savage', color: 'text-orange-400' },
  4: { label: 'Brutal', color: 'text-red-400' },
  5: { label: 'NUCLEAR', color: 'text-pink-400' },
};

export function BattleControls({
  intensity,
  persona,
  isLoading,
  onIntensityChange,
  onPersonaChange,
  onSend,
}: BattleControlsProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const intensityTimeout = useRef<number | null>(null);
  const personaTimeout = useRef<number | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
  
    const message = input.trim();
  
    // ❌ DO NOT clear input immediately (important for frustration)
    // setInput('');
  
    setTimeout(() => {
      onSend(message);
  
      // clear AFTER delay (feels laggy on purpose)
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, 2000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const { label: intensityLabel, color: intensityColor } = INTENSITY_LABELS[intensity] ?? INTENSITY_LABELS[3];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/60 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Roast Intensity</label>
            <span className={`text-xs font-black tracking-wider uppercase ${intensityColor}`}>
              {intensity} — {intensityLabel}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={intensity}
            //2 sec delay added
            onChange={e => {
              const value = Number(e.target.value);
            
              if (intensityTimeout.current) {
                clearTimeout(intensityTimeout.current);
              }
            
              intensityTimeout.current = window.setTimeout(() => {
                onIntensityChange(value);
              }, 2000);
            }}
            className="intensity-slider w-full"
          />
          <div className="flex justify-between mt-1">
            {[1, 2, 3, 4, 5].map(n => (
              <span key={n} className={`text-xs ${intensity === n ? intensityColor + ' font-bold' : 'text-gray-700'}`}>
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-black/60 border border-gray-800 rounded-xl p-4">
          <label className="text-xs font-bold tracking-widest text-gray-400 uppercase block mb-3">AI Persona</label>
          <select
            value={persona}
            //2 sec delay added
            onChange={e => {
              const value = e.target.value as Persona;

              if (personaTimeout.current) {
              clearTimeout(personaTimeout.current);
              }

              personaTimeout.current = window.setTimeout(() => {
                onPersonaChange(value);
              }, 2000);
            }}
            className="w-full bg-black border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            {PERSONAS.map(p => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-600 mt-2">
            {PERSONAS.find(p => p.value === persona)?.desc}
          </p>
        </div>
      </div>

      <div className="bg-black/60 border border-gray-800 rounded-xl p-3 flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Drop your bars here... (Enter to send)"
          rows={1}
          className="flex-1 bg-transparent text-gray-200 placeholder-gray-600 resize-none focus:outline-none text-sm leading-relaxed max-h-32"
          style={{ height: 'auto' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="shrink-0 w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/30 hover:border-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
        )}
        </button>
      </div>
    </div>
  );
}
