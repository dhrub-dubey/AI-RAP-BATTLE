import { Bot, User } from 'lucide-react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAi = message.role === 'ai';

  if (isAi) {
    return (
      <div className="flex gap-3 items-start animate-slide-in">
        <div className="shrink-0 mt-1">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-60 rounded-full" />
            <div className="relative w-9 h-9 rounded-full bg-black border border-cyan-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-[80%]">
          <div className="text-xs text-cyan-500 font-bold tracking-widest mb-1 uppercase">AI Champion</div>
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-500/10 rounded-lg blur-sm" />
            <div className="relative bg-black/80 border border-cyan-500/50 rounded-lg px-4 py-3 shadow-lg shadow-cyan-500/10">
              <p className="text-gray-100 leading-relaxed whitespace-pre-line font-medium tracking-wide text-sm">
                {message.content}
              </p>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full bg-cyan-500/60 animate-pulse"
                    style={{ width: `${20 + Math.random() * 40}px`, animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start justify-end animate-slide-in">
      <div className="flex-1 max-w-[80%] flex flex-col items-end">
        <div className="text-xs text-orange-400 font-bold tracking-widest mb-1 uppercase">You</div>
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/10 rounded-lg blur-sm" />
          <div className="relative bg-black/80 border border-orange-500/40 rounded-lg px-4 py-3 shadow-lg shadow-orange-500/10">
            <p className="text-gray-100 leading-relaxed text-sm">{message.content}</p>
          </div>
        </div>
      </div>
      <div className="shrink-0 mt-1">
        <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center">
          <User className="w-5 h-5 text-orange-400" />
        </div>
      </div>
    </div>
  );
}
