import { useState, useCallback, useRef } from 'react';
import type { Message, Persona, BattleState } from '../types';
import { sendRapMessage } from '../lib/api';
import { speak } from "../lib/voice";

export function useBattle() {
  const [state, setState] = useState<BattleState>({
    messages: [],
    intensity: 3,
    persona: 'street',
    isLoading: false,
    crowdScore: 0,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const setIntensity = useCallback((intensity: number) => {
    setState(prev => ({ ...prev, intensity }));
  }, []);

  const setPersona = useCallback((persona: Persona) => {
    setState(prev => ({ ...prev, persona }));
  }, []);

  const sendMessage = useCallback(async (userInput: string) => {
    const trimmed = userInput.trim();
    if (!trimmed || stateRef.current.isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const { messages, intensity, persona } = stateRef.current;
      const history = [...messages, userMessage].slice(-8).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await sendRapMessage({
        userMessage: trimmed,
        intensity,
        persona,
        history,
      });

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: response.reply,
        timestamp: new Date(),
      };
      
      setTimeout(() => {
        speak(response.reply, persona);
      }, 300);

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
        crowdScore: Math.min(100, prev.crowdScore + prev.intensity * 4 + Math.floor(Math.random() * 8)),
      }));
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const resetBattle = useCallback(() => {
    setState(prev => ({ ...prev, messages: [], crowdScore: 0 }));
  }, []);

  return { state, setIntensity, setPersona, sendMessage, resetBattle };
}
