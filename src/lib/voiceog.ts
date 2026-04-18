// // export function speak(text: string, persona: string) {
// //     text = text
// //     .replace(/!/g, " !! ")
// //     .replace(/\?/g, " ? ")
// //     .replace(/,/g, " , ");

// //     const lines = text.split("\n").filter(l => l.trim() !== "");
  
// //     const speakLine = (index: number) => {
// //       if (index >= lines.length) return;
  
// //       const utterance = new SpeechSynthesisUtterance(lines[index]);
  
// //       const voices = speechSynthesis.getVoices();
// //       utterance.voice =
// //         voices.find(v => v.name.includes("Google")) ||
// //         voices.find(v => v.lang === "en-US") ||
// //         voices[0];
  
// //       // Persona tuning
// //       if (persona === "street") {
// //         utterance.rate = 1.2;
// //         utterance.pitch = 1.1;
// //       } else if (persona === "rogue") {
// //         utterance.rate = 1.3;
// //         utterance.pitch = 1.3;
// //       } else if (persona === "shakespeare") {
// //         utterance.rate = 0.9;
// //         utterance.pitch = 0.9;
// //       } else {
// //         utterance.rate = 1;
// //         utterance.pitch = 0.9;
// //       }
  
// //       utterance.onend = () => {
// //         setTimeout(() => speakLine(index + 1), 180); // 🔥 rhythm gap
// //       };
  
// //       speechSynthesis.speak(utterance);
// //     };
  
// //     speechSynthesis.cancel();
// //     speakLine(0);
// //   }



// export async function speak(text: string, persona: string) {
//     const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  
//     // make pauses feel more rap-like
//     text = text.replace(/\n/g, " ... ");
  
//     try {
//       const res = await fetch("https://api.openai.com/v1/audio/speech", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${API_KEY}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           model: "gpt-4o-mini-tts",
//           voice:
//             persona === "rogue"
//               ? "onyx"
//               : persona === "shakespeare"
//               ? "ballad"
//               : persona === "corporate"
//               ? "coral"
//               : "alloy",
//           input: text,
  
//           // 🔥 THIS is what makes it expressive
//           instructions:
//             persona === "street"
//               ? "Perform this like an energetic rap battle with punchy rhythm and swagger."
//               : persona === "rogue"
//               ? "Speak in a dramatic, chaotic villain voice with intense energy."
//               : persona === "shakespeare"
//               ? "Speak like a theatrical Shakespearean performer with poetic emphasis."
//               : "Speak in a polished confident corporate tone."
//         })
//       });
  
//       if (!res.ok) {
//         console.error("TTS ERROR:", await res.text());
//         return;
//       }
  
//       const audioBlob = await res.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);
  
//       const audio = new Audio(audioUrl);
//       audio.play();
  
//     } catch (err) {
//       console.error("Voice error:", err);
//     }
//   }