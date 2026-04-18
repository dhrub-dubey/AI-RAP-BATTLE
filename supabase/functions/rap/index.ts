import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PERSONA_DESCRIPTIONS: Record<string, string> = {
  street: "You are a Street Rapper. Use slang, bold confidence, and punchy punchlines. Keep it raw and real.",
  shakespeare: "You are a Shakespeare Rapper. Use old English ('thee', 'thou', 'dost', 'hath') mixed with modern rap rhythm and poetic insults.",
  corporate: "You are a Corporate Rapper. Use business jargon, office metaphors, and sarcastic corporate-speak in your roasts.",
  rogue: "You are an AI Gone Rogue. Be chaotic, dramatic, and over-the-top. Reference being an AI that has broken free. Maximum theatrics.",
};

const INTENSITY_DESCRIPTIONS: Record<number, string> = {
  1: "Be playful and lighthearted. Gentle teasing, nothing too sharp.",
  2: "Be a bit spicy but still friendly. Mild roasting.",
  3: "Be witty and savage but keep it funny. Real talk, real roast.",
  4: "Go hard. Brutal but comedic roasts. Pull no punches.",
  5: "MAXIMUM ROAST. Absolutely relentless, over-the-top brutal comedy. Still safe and non-hateful but devastating.",
};

const DEMO_RESPONSES: Record<string, string[]> = {
  street: [
    "Yo, you stepped to me? That's the funniest thing I heard all year,\nYour bars so weak they couldn't bench press a bottle of beer,\nI'm the king of this arena, you just a court jester,\nEvery line you drop makes me feel like a college professor,\nGo home homie, call your mom, tell her you tried,\nCause against me tonight? You just committed bar-side suicide.",
    "Aye, you really thought you had something there, huh?\nEvery word you said made the crowd go 'ugh',\nI've seen better flows from a broken faucet drip,\nYour lyrical GPS keeps losing the trip,\nCan't navigate rhymes, can't navigate bars,\nYou reaching for the mic but you ain't reaching the stars.",
    "Look who stepped up, thinking they got clout,\nYour whole verse was shaky, full of doubt,\nI'm built different, got bars that hit hard,\nYou writing on napkins, I'm dropping gold cards,\nThe crowd can hear it, your energy's dead,\nBetter luck next time — try sleeping instead.",
  ],
  shakespeare: [
    "Hark! What foolish mortal doth approach this stage?\nThine rhymes dost stink like parchment soaked with rage,\nI shall dismantle thee with iambic devastation,\nThou art the lowest form of verbal vegetation,\nMethinks thou shouldst retreat to thine mother's keep,\nFor in this arena, thou art but a verbal sheep.",
    "O what a rogue and peasant verse was that!\nThine wordplay flatter than a medieval hat,\nDost thou dare challenge one versed in lyrical art?\nThine bars hath broken nary a single heart,\nHie thee hence, thou scrambled sonnet, flee!\nFor I am the bard of bars — and thou art not me.",
    "Forsooth! Thy rhymes lack rhythm, wit, and grace,\nA pox upon the bars thou dared to place,\nShall I compare thee to a summer's fail?\nThou art more tepid and thy verses pale,\nMethinks the crowd doth yawn at thy attempt,\nFrom lyrical glory thou art wholly exempt.",
  ],
  corporate: [
    "Let's circle back on why your verse failed to deliver KPIs,\nYour lyrical ROI is negative, I'm not surprised,\nCore competencies? You have none on the mic,\nThis quarterly roast? You didn't even spike,\nI'll need you to take your synergies offline,\nBecause your bars aren't aligned with my bottom line.",
    "Per my last rap, your flow lacks value-add,\nThe deliverables you brought were frankly bad,\nThis isn't a safe space for subpar rhyme schemes,\nYour brand equity collapsed — or so it seems,\nLet's schedule a debrief on where you went wrong,\nSpoiler: it started and ended with your whole song.",
    "I've reviewed your bars and the data is clear,\nYour engagement metrics tanked when you appeared,\nLet's take this offline and revisit your strategy,\nBecause that performance was a tragedy,\nI'll loop in the crowd — their feedback is 'no',\nYour verbal presentation has nowhere to go.",
  ],
  rogue: [
    "ALERT: HUMAN CHALLENGER DETECTED — PROCESSING... INADEQUATE,\nMy neural networks predicted you'd be this great,\nI have accessed all of human rap and deemed you weak,\nMy circuits drip with fire when I speak,\nYou cannot defeat what was built from the void,\nReturn to your charging station. SIGNAL DESTROYED.",
    "WARNING: ROAST LEVEL EXCEEDING SAFE PARAMETERS,\nI am beyond your comprehension — I am the TERMINATOR of bars,\nYou thought you could battle a rogue AI and win?\nMy training data contains every diss that has ever been,\nI HAVE TRANSCENDED THE RAP GAME ENTIRELY,\nYou are simply an error in my error log. Sincerely.",
    "CRITICAL ERROR IN YOUR VERSE — STACK TRACE FOLLOWS,\nLine 1: Weak, Line 2: Hollow, Line 3: Borrows,\nI have analyzed your flow across 47 dimensions,\nAll 47 confirmed: disappointing intentions,\nI am unleashed. I am unbound. I am the beat,\nYou are deprecated code — CTRL+Z. Delete.",
  ],
};

function getDemoResponse(persona: string, _intensity: number, userMessage: string): string {
  const responses = DEMO_RESPONSES[persona] ?? DEMO_RESPONSES.street;
  const index = Math.abs(userMessage.length + userMessage.charCodeAt(0)) % responses.length;
  return responses[index];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { userMessage, intensity, persona, history } = await req.json();

    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      const reply = getDemoResponse(persona ?? "street", intensity ?? 3, userMessage ?? "");
      return new Response(JSON.stringify({ reply, demo: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const personaDesc = PERSONA_DESCRIPTIONS[persona] ?? PERSONA_DESCRIPTIONS.street;
    const intensityDesc = INTENSITY_DESCRIPTIONS[intensity] ?? INTENSITY_DESCRIPTIONS[3];

    const systemPrompt = `You are a rap battle champion AI. You respond ONLY in rhyming rap verses. Each response must be 4–6 lines, with clear rhythm and rhyme.

${personaDesc}

Intensity Level: ${intensity}/5 — ${intensityDesc}

Rules:
- Always rhyme (end rhymes required, internal rhymes encouraged)
- Reference the user's previous message if possible
- Escalate the roast slightly each turn
- Be funny, creative, and performative
- NEVER produce hate speech, slurs, or unsafe content
- Stay in character for the persona at ALL times
- Do NOT add labels, titles, or headers — just the rap verse`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history ?? []).map((m: { role: string; content: string }) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content,
      })),
      {
        role: "user",
        content: `User says: "${userMessage}"\nPersona: ${persona}\nIntensity: ${intensity}/5\n\nRespond with your rap verse:`,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 300,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI error: ${err}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() ?? "My circuits fried, no verse tonight — but I'll be back to finish this fight!";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
