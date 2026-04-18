export function speak(text: string, persona: string) {
    console.log("SPEAK CALLED");
  
    const speakNow = () => {
      const utterance = new SpeechSynthesisUtterance(text);
  
      const voices = speechSynthesis.getVoices();
  
      // 🔥 EXACT male voice (from your list)
      const voice = voices.find(v => v.name === "Google UK English Male");
  
      if (voice) utterance.voice = voice;
  
      // 🎤 persona tuning (your requirement)
      if (persona === "street") {
        utterance.rate = 1.3;
        utterance.pitch = 1.1;
      } else if (persona === "rogue") {
        utterance.rate = 1.35;
        utterance.pitch = 1.25;
      } else if (persona === "shakespeare") {
        utterance.rate = 1.05;
        utterance.pitch = 0.9;
      } else {
        // corporate
        utterance.rate = 1.2;
        utterance.pitch = 0.9;
      }
  
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    };
  
    // 🔥 ensure voices are loaded (IMPORTANT)
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = speakNow;
    } else {
      speakNow();
    }
  }