const fs = require('fs');

const route1 = '/Users/phoenixechoes/Documents/miyona.ai/src/app/api/voice/route.ts';
const route2 = '/Users/phoenixechoes/Documents/miyona.ai/src/app/api/voice/tts/route.ts';

let c1 = fs.readFileSync(route1, 'utf8');
let c2 = fs.readFileSync(route2, 'utf8');

const oldVoice = 'ALCIIw5qAlLDox8iBl0U';
const newVoice = 'EXAVITQu4vr4xnSDxMaL'; // Bella (Free tier compatible)

c1 = c1.replace(oldVoice, newVoice);
c2 = c2.replace(oldVoice, newVoice);

fs.writeFileSync(route1, c1);
fs.writeFileSync(route2, c2);

console.log("Fixed Voice IDs");
