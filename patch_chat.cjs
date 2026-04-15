const fs = require('fs');
const file = '/Users/phoenixechoes/Documents/miyona.ai/src/app/(app)/chat/ChatClient.tsx';

let content = fs.readFileSync(file, 'utf8');

const target = `            speakingEndTime.current = Date.now() + (reply.length * 60 + 500);`;
const replacement = `            // Generate and play TTS (ElevenLabs)
            try {
                const ttsRes = await fetch("/api/voice/tts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: reply, emotion: reaction }),
                });
                
                if (ttsRes.ok) {
                    const audioBlob = await ttsRes.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    
                    // Start lipsync
                    speakingEndTime.current = Date.now() + 1000 * 60 * 60; // Keep open until ended
                    
                    audio.onended = () => {
                        speakingEndTime.current = 0; // Stop lipsync
                        URL.revokeObjectURL(audioUrl);
                    };
                    
                    await audio.play();
                } else {
                    speakingEndTime.current = Date.now() + (reply.length * 60 + 500); // Fallback
                }
            } catch (err) {
                console.error("TTS fetch error in ChatClient:", err);
                speakingEndTime.current = Date.now() + (reply.length * 60 + 500); // Fallback
            }`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
console.log("Patched");
