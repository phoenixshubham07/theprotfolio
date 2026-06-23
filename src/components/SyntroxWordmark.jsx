import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const BRAND_COLORS = {
  blue: '#3b82f6',
  cyan: '#22d3ee',
  white: '#ffffff',
  dark: '#020617',
  muted: '#64748b',
  glow: 'rgba(59,130,246,0.3)',
  particle: '#475569',
  threat: '#ef4444',
};

const CHARS = "+-_/\\\\|[]{}<>";

function HexO({ color }) {
  return (
    <svg viewBox="0 0 100 100" fill="none"
      style={{ display: 'inline-block', width: '0.75em', height: '0.75em', verticalAlign: '-0.05em', margin: '0 0.01em' }}>
      <polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
        stroke={color} strokeWidth="7" strokeLinejoin="round" fill="none" />
      <polygon points="50,28 69,39 69,61 50,72 31,61 31,39"
        stroke={color} strokeWidth="2.5" strokeLinejoin="round" fill="none" opacity="0.3" />
      <circle cx="50" cy="50" r="4" fill={color} opacity="0.5" />
    </svg>
  );
}

// Beautifully formatted mathematical equation: Quantum Style (Syntropy)
const MathEquation = ({ color }) => (
  <span style={{ 
    display: 'inline-flex', alignItems: 'center', 
    fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '0.05em',
    color, fontStyle: 'italic', fontWeight: 600, whiteSpace: 'nowrap',
    fontSize: '0.65em'
  }}>
    ∇<span style={{fontSize:'0.6em', verticalAlign:'super', marginLeft:'0.25em'}}>2</span>Ψ − (1/c<span style={{fontSize:'0.6em', verticalAlign:'super', marginLeft:'0.25em'}}>2</span>)∂<span style={{fontSize:'0.6em', verticalAlign:'super', marginLeft:'0.25em'}}>2</span>Ψ/∂t<span style={{fontSize:'0.6em', verticalAlign:'super', marginLeft:'0.25em'}}>2</span> = 0
  </span>
);

const GlitchEffect = ({ children }) => {
  const [showBlock, setShowBlock] = useState(true);
  const [blockClip, setBlockClip] = useState(() => `inset(${Math.random() * 50}% 0 ${Math.random() * 50}% 0)`);

  useEffect(() => {
    const int = setInterval(() => {
      const shouldShow = Math.random() > 0.6;
      setShowBlock(shouldShow);
      if (shouldShow) {
        setBlockClip(`inset(${Math.random() * 60}% 0 ${Math.random() * 60}% 0)`);
      }
    }, 80);
    return () => clearInterval(int);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <style>{`
        @keyframes crt-pulse-clean {
          0% { text-shadow: 0 0 5px #fff, 0 0 10px #0ff, 0 0 20px #0ff; }
          50% { text-shadow: 0 0 5px #fff, 0 0 15px #0ff, 0 0 30px #0ff; color: #e0ffff; filter: contrast(150%); }
          100% { text-shadow: 0 0 5px #fff, 0 0 10px #0ff, 0 0 20px #0ff; }
        }
        @keyframes g-slice-h {
          0% { clip-path: inset(10% 0 80% 0); transform: translateX(-4px); }
          20% { clip-path: inset(30% 0 20% 0); transform: translateX(4px); }
          40% { clip-path: inset(70% 0 10% 0); transform: translateX(-3px); }
          60% { clip-path: inset(20% 0 50% 0); transform: translateX(5px); }
          80% { clip-path: inset(50% 0 30% 0); transform: translateX(-5px); }
          100% { clip-path: inset(5% 0 90% 0); transform: translateX(3px); }
        }
      `}</style>
      
      {/* Base CRT layer */}
      <div style={{ animation: 'crt-pulse-clean 0.1s infinite', color: '#fff', opacity: showBlock ? 0.8 : 1 }}>
        {children}
      </div>

      {/* Base Break Slices (Physical horizontal tearing of the text) */}
      {showBlock && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', color: '#fff', clipPath: 'inset(10% 0 70% 0)', transform: 'translateX(-4px)', zIndex: 8, pointerEvents: 'none' }}>
            {children}
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', color: '#fff', clipPath: 'inset(60% 0 20% 0)', transform: 'translateX(5px)', zIndex: 8, pointerEvents: 'none' }}>
            {children}
          </div>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', color: '#0ff', mixBlendMode: 'screen', animation: 'g-slice-h 0.2s infinite linear alternate-reverse', textShadow: '2px 0 #0ff', zIndex: 9, pointerEvents: 'none' }}>
            {children}
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', color: '#f0f', mixBlendMode: 'screen', animation: 'g-slice-h 0.25s infinite linear alternate', textShadow: '-2px 0 #f0f', zIndex: 9, pointerEvents: 'none' }}>
            {children}
          </div>
        </>
      )}

      {/* Clean Data Corruption Blocks */}
      {showBlock && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: BRAND_COLORS.blue, mixBlendMode: 'difference', clipPath: blockClip, zIndex: 10, pointerEvents: 'none' }} />
      )}

      {/* Master Scanline Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)', pointerEvents: 'none', mixBlendMode: 'multiply', zIndex: 11 }} />
    </div>
  );
};

const FINAL_WORD = ['S', 'Y', 'N', 'T', 'R', 'O', 'X'];

export default function SyntroxWordmark({
  fontSize = 20,
  color = BRAND_COLORS.white,
  animate = true,
  show = true,
  delay = 0,
  paused = false,
  glitch = false,
}) {
  const [displayText, setDisplayText] = useState(() => animate ? FINAL_WORD.map(() => '') : FINAL_WORD);
  const [iteration, setIteration] = useState(animate ? 0 : FINAL_WORD.length);
  const [showSuffix, setShowSuffix] = useState(!animate);
  
  // Glitch State
  const [isGlitching, setIsGlitching] = useState(false);

  // 1. Initial Reveal Effect
  useEffect(() => {
    if (!animate || !show || paused) {
      return;
    }

    let currentIteration = 0;
    let intervalId;
    
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setDisplayText(() => 
          FINAL_WORD.map((letter, index) => {
            if (index < currentIteration) {
              return letter;
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
        );
        
        if (currentIteration >= FINAL_WORD.length) {
          clearInterval(intervalId);
          setTimeout(() => setShowSuffix(true), 150);
        }
        
        currentIteration += 1/6; 
        setIteration(Math.floor(currentIteration));
      }, 30);
    }, delay);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [animate, show, delay, paused]);

  // 2. Periodic Glitch Effect (Starts after reveal)
  useEffect(() => {
    if (!showSuffix || paused || !glitch) return;

    const runGlitchSequence = () => {
      // 1. Initial fast pop
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
      
      // 2. Main extended glitch to admire the equation
      setTimeout(() => setIsGlitching(true), 300);
      setTimeout(() => setIsGlitching(false), 1500);
    };

    // Glitch randomly every 6 to 12 seconds
    const scheduleNextGlitch = () => {
      const nextDelay = 6000 + Math.random() * 6000;
      return setTimeout(() => {
        runGlitchSequence();
        glitchTimer = scheduleNextGlitch(); // loop
      }, nextDelay);
    };

    // Fire first glitch quickly (2–3 s after reveal), then normal 6–12 s cycle
    let glitchTimer = setTimeout(() => {
      runGlitchSequence();
      glitchTimer = scheduleNextGlitch();
    }, 2000 + Math.random() * 1000);
    return () => clearTimeout(glitchTimer);
  }, [showSuffix, paused, glitch]);

  if (!show && animate) return null;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline', userSelect: 'none' }}>
      <span style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        fontFamily: '"Space Grotesk", sans-serif', 
        fontWeight: 600,
        fontSize, 
        color, 
        letterSpacing: '-0.025em', 
        lineHeight: 1,
        position: 'relative'
      }}>
        {isGlitching ? (
          <GlitchEffect>
            <MathEquation color={color} />
          </GlitchEffect>
        ) : (
          displayText.map((char, index) => {
            const isResolved = index < iteration;
            
            if (index === 5 && isResolved) {
              return (
                <motion.span 
                  key={index}
                  initial={{ rotate: 180, scale: 0.5, filter: 'blur(10px)' }}
                  animate={{ rotate: 0, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <HexO color={color} />
                </motion.span>
              );
            }

            return (
              <span 
                key={index} 
                style={{ 
                  opacity: isResolved ? 1 : 0.6,
                  color: isResolved ? color : BRAND_COLORS.blue,
                  fontWeight: isResolved ? 600 : 400
                }}
              >
                {char}
              </span>
            );
          })
        )}
      </span>

      {/* .ai */}
      <AnimatePresence>
        {(!isGlitching) && (
          <motion.span
            initial={animate ? { opacity: 0, x: -4 } : { opacity: 1, x: 0 }}
            animate={showSuffix ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              fontFamily: '"JetBrains Mono", monospace', fontWeight: 400,
              fontSize: '0.55em', lineHeight: 1, marginLeft: '0.06em',
              position: 'relative', zIndex: 1,
              textTransform: 'none',
            }}
          >
            <span style={{ color: BRAND_COLORS.blue }}>.</span>
            <span style={{ color: BRAND_COLORS.muted }}>ai</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
