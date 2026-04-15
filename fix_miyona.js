const fs = require('fs');
const cssPath = '/Users/phoenixechoes/Documents/miyona.ai/src/app/globals.css';
const tsxPath = '/Users/phoenixechoes/Documents/miyona.ai/src/app/(app)/chat/ChatClient.tsx';

let css = fs.readFileSync(cssPath, 'utf8');

// Replace bg-cosmic-animation
const newCosmic = `  .bg-cosmic-animation {
    background-color: #04010d;
    background-image: 
      radial-gradient(circle at 10% 20%, rgba(138, 43, 226, 0.45) 0%, transparent 45%),
      radial-gradient(circle at 90% 80%, rgba(148, 0, 211, 0.35) 0%, transparent 55%),
      radial-gradient(circle at 50% 50%, rgba(75, 0, 130, 0.25) 0%, transparent 60%);
    background-size: 200% 200%;
    animation: cosmic-nebula 20s ease-in-out infinite alternate;
    position: relative;
    overflow: hidden;
  }

  .bg-cosmic-animation::before,
  .bg-cosmic-animation::after {
    content: "";
    position: absolute;
    top: -50%; left: -50%; right: -50%; bottom: -50%;
    pointer-events: none;
    z-index: 1;
  }

  .bg-cosmic-animation::before {
    background-image: 
      radial-gradient(1.5px 1.5px at 15% 25%, rgba(255, 255, 255, 0.9) 1px, transparent 0),
      radial-gradient(2px 2px at 35% 45%, rgba(255, 255, 255, 0.8) 1.5px, transparent 0),
      radial-gradient(1px 1px at 55% 75%, rgba(255, 255, 255, 0.7) 1px, transparent 0),
      radial-gradient(1.5px 1.5px at 85% 20%, rgba(255, 255, 255, 1) 2px, transparent 0),
      radial-gradient(2px 2px at 90% 85%, rgba(255, 255, 255, 0.9) 1px, transparent 0);
    background-size: 300px 300px;
    animation: cosmic-twinkle 4s ease-in-out infinite alternate;
  }

  .bg-cosmic-animation::after {
    background-image: 
      radial-gradient(2px 2px at 20% 60%, rgba(255, 255, 255, 0.7) 1.5px, transparent 0),
      radial-gradient(1.5px 1.5px at 45% 15%, rgba(255, 255, 255, 0.5) 1px, transparent 0),
      radial-gradient(2px 2px at 75% 45%, rgba(255, 255, 255, 0.8) 2px, transparent 0),
      radial-gradient(1.5px 1.5px at 65% 90%, rgba(255, 255, 255, 0.7) 1px, transparent 0);
    background-size: 400px 400px;
    animation: cosmic-twinkle 6s ease-in-out infinite alternate-reverse;
  }
`;

css = css.replace(/ *\.bg-cosmic-animation \{[\s\S]*?animation: space 40s linear infinite;\n *}/, newCosmic);

// Replace keyframes
const newKeyframes = `  @keyframes space {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }

  @keyframes cosmic-nebula {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }

  @keyframes cosmic-twinkle {
    0% { opacity: 0.1; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1.1); }
  }
`;

css = css.replace(/ *\@keyframes space \{[\s\S]*?100\% \{ background-position: 100\% 100\%; \}\n *}/, newKeyframes);

fs.writeFileSync(cssPath, css);


let tsx = fs.readFileSync(tsxPath, 'utf8');

const oldGlass = 'bg-black/20 backdrop-blur-md md:bg-white/5 md:dark:bg-black/20 md:border-l md:border-primary/15';
const newGlass = 'bg-black/40 backdrop-blur-3xl border border-white/10 md:border-l-white/20 md:border-y-0 md:border-r-0 md:bg-gradient-to-br md:from-white/10 md:to-transparent shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-t-[2.5rem] md:rounded-none ring-1 ring-white/5';

tsx = tsx.replace(oldGlass, newGlass);

fs.writeFileSync(tsxPath, tsx);
console.log("Done");
