const fs = require('fs');

// Fix 'loadElements' timeout loop error and remove redundant event listeners since we handle that in React useEffect
let code = fs.readFileSync('src/components/AsciiBackground.jsx', 'utf-8');
code = code.replace(/if\(!canvas \|\| !sourceMedia\)\{setTimeout\(loadElements,50\);return\}/g, '');

// Clean up weird resize handling to use standard React cleanup
code = code.replace(/window\.addEventListener\('resize',function\(\)\{chars=\[\];generateAsciiArt\(\)\}\);/g, '');
code = code.replace(/canvas\.addEventListener\('mousemove',function\(e\)/g, 'container.addEventListener("mousemove",function(e)');
code = code.replace(/canvas\.addEventListener\('mouseleave',function\(\)/g, 'container.addEventListener("mouseleave",function()');

const endOfEffect = `
    const resizeHandler = () => { chars = []; generateAsciiArt(); };
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      window.removeEventListener('resize', resizeHandler);
      isAnimating = false; // stop animation loop
    };
  }, []);
`;
code = code.replace(/return \(\) => \{\s*\/\/ cleanup if necessary\s*\}\s*\}, \[\]\);/g, endOfEffect);

// Add the mouse tracker to state/prop drilling instead of canvas directly? No, the event listener is fine on container.
fs.writeFileSync('src/components/AsciiBackground.jsx', code);

// NOW let's replace the CSS background with this component!
let heroJsx = fs.readFileSync('src/components/Hero.jsx', 'utf-8');
if (!heroJsx.includes("AsciiBackground")) {
    heroJsx = heroJsx.replace("import styles from './Hero.module.css'", "import styles from './Hero.module.css'\nimport AsciiBackground from './AsciiBackground'");
    heroJsx = heroJsx.replace('<div ref={bgRef} className={styles.bg} />', '<div ref={bgRef} className={styles.bg}>\n        <AsciiBackground />\n      </div>');
    fs.writeFileSync('src/components/Hero.jsx', heroJsx);
}

let heroCss = fs.readFileSync('src/components/Hero.module.css', 'utf-8');
heroCss = heroCss.replace("background-image: url('/bg.jpg');", "/* background-image: url('/bg.jpg'); */");
fs.writeFileSync('src/components/Hero.module.css', heroCss);

