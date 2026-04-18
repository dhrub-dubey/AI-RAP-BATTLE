import { useEffect, useRef } from 'react';
import { Mic2 } from 'lucide-react';
import type { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full scale-150" />
          <div className="relative w-20 h-20 rounded-full bg-black border-2 border-cyan-500/50 flex items-center justify-center">
            <Mic2 className="w-10 h-10 text-cyan-400 opacity-80" />
          </div>
        </div>
        <h2 className="text-xl font-black text-white mb-2 tracking-wider">READY TO BATTLE?</h2>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
          Choose your persona, set the intensity, and drop your first bar. The AI champion is waiting...
        </p>
        <div className="mt-6 flex gap-2">
          {['🔥', '🎤', '💥', '👑'].map((emoji, i) => (
            <span
              key={i}
              className="text-2xl animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-thin">
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex gap-3 items-start animate-slide-in">
          <div className="relative shrink-0 mt-1">
            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-60 rounded-full" />
            <div className="relative w-9 h-9 rounded-full bg-black border border-cyan-500 flex items-center justify-center">
              <Mic2 className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="bg-black/80 border border-cyan-500/50 rounded-lg px-4 py-3 shadow-lg shadow-cyan-500/10">
            <div className="flex gap-1 items-center h-5">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
