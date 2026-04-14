const fs = require('fs');

const html = fs.readFileSync('creationofadam.html', 'utf-8');
const mediaMatch = html.match(/src="(data:video\/[^"]+)"/i) || html.match(/src="(data:image\/[^"]+)"/i);
const b64 = mediaMatch ? mediaMatch[1] : '';

let code = fs.readFileSync('src/components/AsciiBackground.jsx', 'utf-8');

if (!code.includes('let isAnimating')) {
    code = code.replace('let chars=[];', 'let isAnimating=false; let chars=[];');
}

// Ensure the video tag has the b64 source and autoPlay muted playsInline attributes but NOT loop
code = code.replace(/<video[^>]*?(?:\/>|<\/video>)/gi, `<video ref={mediaRef} src="${b64}" muted playsInline autoPlay style={{ display: 'none' }} />`);

fs.writeFileSync('src/components/AsciiBackground.jsx', code);
console.log("Rewrite successful");
