import type { RapRequest, RapResponse } from '../types';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function sendRapMessage(request: RapRequest): Promise<RapResponse> {
  const personaDescriptions: Record<string, string> = {
    street: "You are a Street Rapper. Use slang, bold confidence, and punchy punchlines.",
    shakespeare: "You are a Shakespeare Rapper. Use old English with poetic rhythm.",
    corporate: "You are a Corporate Rapper. Use business jargon and office humor.",
    rogue: "You are an AI Gone Rogue. Be chaotic, dramatic, and over-the-top.",
  };

  const intensityDescriptions: Record<number, string> = {
    1: "Playful teasing",
    2: "Mild roasting",
    3: "Savage but funny",
    4: "Brutal but comedic",
    5: "MAXIMUM roast, dramatic and intense",
  };

  const systemPrompt = `
You are a rap battle champion AI.

${personaDescriptions[request.persona]}

Intensity: ${request.intensity} - ${intensityDescriptions[request.intensity]}

Rules:
- Respond ONLY in rap
- 4–6 lines
- Must rhyme
- Be funny and roast the user
- Stay safe (no hate speech)
- End with a strong punchline
`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...(request.history || []).map((m: any) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.content,
    })),
    {
      role: "user",
      content: request.userMessage,
    },
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "AI Rap Battle"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages,
      temperature: 0.9,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Failed to get AI response");
  }

  const data = await response.json();

  return {
    reply: data.choices[0].message.content,
  };
}