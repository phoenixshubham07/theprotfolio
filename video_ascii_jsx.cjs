const fs = require('fs');
const html = fs.readFileSync('creationofadam.html', 'utf-8');

// Match the video source instead of image
const srcMatch = html.match(/src="(data:video\/mp4;base64,[^"]+)"/);
if (!srcMatch) throw new Error("Could not find video source");
const b64 = srcMatch[1];

let scriptMatch = html.match(/const loadElements=function\(\)\{(.*)\};loadElements\(\)/s);
let script = scriptMatch[1];

// Find and strip out DOM queries to be replaced by React refs
// First get the canvas ID
const canvasIdMatch = script.match(/getElementById\("([^"]+)"\)/g);
script = script.replace(/const container=document\.getElementById\("[^"]+"\)\.parentNode;/, '');
script = script.replace(/const canvas=document\.getElementById\("[^"]+"\);/, '');
script = script.replace(/const sourceMedia=document\.getElementById\("[^"]+"\);/, '');

// Strip annoying event listener binding
script = script.replace(/if\(!canvas \|\| !sourceMedia\)\{setTimeout\(loadElements,50\);return\}/g, '');
script = script.replace(/window\.addEventListener\('resize',function\(\)\{chars=\[\];generateAsciiArt\(\)\}\);/g, '');
script = script.replace(/canvas\.addEventListener\('mousemove',function\(e\)/g, 'container.addEventListener("mousemove",function(e)');
script = script.replace(/canvas\.addEventListener\('mouseleave',function\(\)/g, 'container.addEventListener("mouseleave",function()');

// Replace rendering loop with flashlight mapping
const animateReplacement = `
            const charInfo=chars[i];

            // --- RED/WHITE + TRUE COLOR FLASHLIGHT LOGIC HERE ---
            const lightDist = Math.sqrt((particle.x - mouseX)**2 + (particle.y - mouseY)**2);
            const radius = 250; 
            
            if (lightDist < radius) {
                // True color
                ctx.fillStyle = charInfo.color;
            } else {
                // Determine red/white mapping
                ctx.fillStyle = charInfo.rwColor;
            }
            
            ctx.fillText(charInfo.char,particle.x,particle.y)
`;
script = script.replace(/const charInfo=chars\[i\];(.*?)ctx\.fillText\(charInfo\.char,particle\.x,particle\.y\)/s, animateReplacement);

// Replace initialization color parsing for flashlight support
const rwColorReplacement = `
                        const color=colorScheme(r,g,b,brightness,config.saturation);
                        const rwColor = \`rgb(255, \${Math.floor(brightness)}, \${Math.floor(brightness)})\`;
                        const charIdx=y * columns + x;
                        if(charIdx < chars.length){
                            chars[charIdx].char=char;
                            chars[charIdx].color=color;
                            chars[charIdx].rwColor=rwColor;
                        }
`;
script = script.replace(/const color=colorScheme\(r,g,b,brightness,config\.saturation\);([\s\S]*?)if\(charIdx < chars\.length\)\{([\s\S]*?)chars\[charIdx\]\.color=color([\s\S]*?)\}/s, rwColorReplacement);

// Transparent BG
script = script.replace('useTransparentBackground:false', 'useTransparentBackground:true');

// Effect cleanup hook
const endOfEffect = `
    const resizeHandler = () => { chars = []; generateAsciiArt(); };
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      window.removeEventListener('resize', resizeHandler);
      isAnimating = false; // stop animation loop
    };
  }, []);
`;
script = script.replace(/return \(\) => \{\s*\/\/ cleanup if necessary\s*\}\s*\}, \[\]\);/, endOfEffect);

const reactCode = `import { useEffect, useRef } from 'react';

export default function AsciiBackground() {
  const canvasRef = useRef(null);
  const mediaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const sourceMedia = mediaRef.current;
    const container = containerRef.current;

    let resizeTimer;
    
    ${script}
    
    const resizeHandler = () => { chars = []; generateAsciiArt(); };
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      window.removeEventListener('resize', resizeHandler);
      let isAnimating = false; // stop animation loop
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', margin: '0 auto', overflow: 'hidden', position: 'absolute', inset: 0, zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ display: 'block', minWidth: '100%', minHeight: '100%', objectFit: 'cover' }}></canvas>
      <video ref={mediaRef} src="${b64}" crossOrigin="anonymous" loop muted playsInline autoPlay style={{ display: 'none' }} />
    </div>
  );
}
`;

fs.writeFileSync('src/components/AsciiBackground.jsx', reactCode);
console.log("Successfully rebuilt AsciiBackground.jsx for VIDEO");
