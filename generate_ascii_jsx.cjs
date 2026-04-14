const fs = require('fs');
const html = fs.readFileSync('creationofadam.html', 'utf-8');

// Use regex to find the base64 image
const match = html.match(/src="(data:image\/jpeg;base64,[^"]+)"/);
const b64 = match[1];

let scriptMatch = html.match(/const loadElements=function\(\){(.*)};loadElements\(\)/s);
let script = scriptMatch[1];

// Make script React compatible
script = script.replace('const container=document.getElementById("ascii-canvas-1775222322097").parentNode;', '');
script = script.replace('const canvas=document.getElementById("ascii-canvas-1775222322097");', '');
script = script.replace('const sourceMedia=document.getElementById("source-image-1775222322097");', '');

// Flashlight logic:
const animateReplacement = `
            const charInfo=chars[i];

            // --- RED/WHITE + TRUE COLOR FLASHLIGHT LOGIC HERE ---
            const lightDist = Math.sqrt((particle.x - mouseX)**2 + (particle.y - mouseY)**2);
            const radius = 250; 
            
            if (lightDist < radius) {
                // True color
                ctx.fillStyle = charInfo.color;
            } else {
                // Determine red/white mapping. 
                ctx.fillStyle = charInfo.rwColor;
            }
            
            ctx.fillText(charInfo.char,particle.x,particle.y)
`;

script = script.replace(/const charInfo=chars\[i\];(.*?)ctx\.fillText\(charInfo\.char,particle\.x,particle\.y\)/s, animateReplacement);

// Setup rwColor inside generateAsciiArt
const rwColorReplacement = `
                        const color=colorScheme(r,g,b,brightness,config.saturation);
                        // Red & White mapping:
                        // Brightness > 128 -> White/Pinkish scale, Brightness < 128 -> Red scale
                        // Let's do a simple pure RED to pure WHITE scale
                        const rwColor = \`rgb(255, \${Math.floor(brightness)}, \${Math.floor(brightness)})\`;
                        const charIdx=y * columns + x;
                        if(charIdx < chars.length){
                            chars[charIdx].char=char;
                            chars[charIdx].color=color;
                            chars[charIdx].rwColor=rwColor;
                        }
`;
script = script.replace(/const color=colorScheme\(r,g,b,brightness,config\.saturation\);([\s\S]*?)if\(charIdx < chars\.length\)\{([\s\S]*?)chars\[charIdx\]\.color=color([\s\S]*?)\}/s, rwColorReplacement);

// Make background transparent?
script = script.replace('useTransparentBackground:false', 'useTransparentBackground:true');

const reactCode = `import { useEffect, useRef } from 'react';

export default function AsciiBackground() {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const sourceMedia = imgRef.current;
    const container = containerRef.current;

    let resizeTimer;
    
    // Original extracted logic
    ${script}
    
    return () => {
      // cleanup if necessary
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', margin: '0 auto', overflow: 'hidden', position: 'absolute', inset: 0, zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ display: 'block', minWidth: '100%', minHeight: '100%', objectFit: 'cover' }}></canvas>
      <img ref={imgRef} src="${b64}" style={{ display: 'none' }} />
    </div>
  );
}
`;

fs.writeFileSync('src/components/AsciiBackground.jsx', reactCode);
