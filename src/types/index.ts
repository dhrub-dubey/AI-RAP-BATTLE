export type Role = 'user' | 'ai';
export type Persona = 'street' | 'shakespeare' | 'corporate' | 'rogue';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface BattleState {
  messages: Message[];
  intensity: number;
  persona: Persona;
  isLoading: boolean;
  crowdScore: number;
}

export interface RapRequest {
  userMessage: string;
  intensity: number;
  persona: Persona;
  history: { role: Role; content: string }[];
}

export interface RapResponse {
  reply: string;
}
