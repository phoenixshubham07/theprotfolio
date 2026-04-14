const fs = require('fs');
const html = fs.readFileSync('creationofadam.html', 'utf-8');

let mediaMatch = html.match(/src="(data:video\/[^"]+)"/i) || html.match(/src="(data:image\/[^"]+)"/i);
let b64 = mediaMatch ? mediaMatch[1] : '';
let isVideoTag = b64.startsWith('data:video');

let scriptMatch = html.match(/const loadElements=function\(\)\{([\s\S]*?)\};loadElements\(\)/);
let script = scriptMatch[1];

script = script.replace(/const container=document\.getElementById\("[^"]+"\)\.parentNode;/g, '');
script = script.replace(/const canvas=document\.getElementById\("[^"]+"\);/g, '');
script = script.replace(/const ctx=canvas\.getContext\('2d'\);/g, '');
script = script.replace(/const sourceMedia=document\.getElementById\("[^"]+"\);/g, '');

script = script.replace(/window\.addEventListener\('resize',function\(\)\{chars=\[\];generateAsciiArt\(\)\}\);/g, '');
script = script.replace(/canvas\.addEventListener\('mousemove',function\(e\)/g, 'container.addEventListener("mousemove",function(e)');
script = script.replace(/canvas\.addEventListener\('mouseleave',function\(\)/g, 'container.addEventListener("mouseleave",function()');
script = script.replace(/if\(!canvas \|\| !sourceMedia\)\{setTimeout\(loadElements,50\);return\}/g, '');
script = script.replace(/useTransparentBackground:false/g, 'useTransparentBackground:true');

const animateReplacement = `
            const charInfo=chars[i];
            const lightDist = Math.sqrt((particle.x - mouseX)**2 + (particle.y - mouseY)**2);
            const radius = 250; 
            
            if (lightDist < radius) {
                ctx.fillStyle = charInfo.color;
            } else {
                const rgb = charInfo.color.match(/\\d+/g);
                if(rgb && rgb.length >= 3) {
                    const brightness = Math.floor(0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);
                    ctx.fillStyle = \\\`rgb(255, \${brightness}, \${brightness})\\\`;
                } else {
                    ctx.fillStyle = '#ff0000';
                }
            }
            ctx.fillText(charInfo.char,particle.x,particle.y);
`;
script = script.replace(/const charInfo=chars\[i\];(.*?)ctx\.fillText\(charInfo\.char,particle\.x,particle\.y\)/s, animateReplacement);

const reactCode = `import { useEffect, useRef } from 'react';

export default function AsciiBackground() {
  const canvasRef = useRef(null);
  const mediaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const sourceMedia = mediaRef.current;
    const container = containerRef.current;

    let isAnimating = false;
    
    ${script}
    
    const resizeHandler = () => { chars = []; generateAsciiArt(); };
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      window.removeEventListener('resize', resizeHandler);
      isAnimating = false;
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', margin: '0 auto', overflow: 'hidden', position: 'absolute', inset: 0, zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ display: 'block', minWidth: '100%', minHeight: '100%', objectFit: 'cover' }}></canvas>
      ${isVideoTag ? 
        `<video ref={mediaRef} src="${b64}" loop muted playsInline autoPlay style={{ display: 'none' }} />` :
        `<img ref={mediaRef} src="${b64}" style={{ display: 'none' }} />`
      }
    </div>
  );
}
`;

fs.writeFileSync('src/components/AsciiBackground.jsx', reactCode);
