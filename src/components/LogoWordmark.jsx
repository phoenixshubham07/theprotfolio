import React from 'react';
import { motion } from 'framer-motion';

export const LogoWordmark = ({ 
  fontSize = '24px', 
  animated = false,
  bracketColor = 'var(--accent-crimson)',
  bracketGlow = 'rgba(244, 63, 94, 0.65)',
  style = {},
  ...props 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const pathVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (customIndex) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
        delay: animated ? 0.15 + customIndex * 0.06 : 0
      }
    })
  };

  const Wrapper = animated ? motion.div : 'div';
  const Span = animated ? motion.span : 'span';
  const Path = animated ? motion.path : 'path';

  return (
    <Wrapper 
      variants={animated ? containerVariants : undefined}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSize,
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#fff',
        userSelect: 'none',
        lineHeight: 1,
        fontFamily: "'Space Grotesk', sans-serif",
        ...style
      }}
      {...props}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Left bracket */}
        <Span 
          initial={animated ? { opacity: 0, x: 45 } : undefined}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 14, delay: animated ? 0.1 : 0 }}
          style={{ 
            display: 'inline-block', 
            color: bracketColor, 
            marginRight: '0.16em', 
            fontFamily: "'Space Grotesk', sans-serif",
            textShadow: `0 0 10px ${bracketGlow}`
          }}
        >
          &lt;
        </Span>

        {/* algo simple upright */}
        <span style={{ display: 'flex', color: '#fff', letterSpacing: '0.04em', fontWeight: 400, fontStyle: 'normal', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'none' }}>
          {'algo'.split('').map((char, idx) => (
            <Span 
              key={`algo-${idx}`}
              initial={animated ? { opacity: 0, x: 10 } : undefined}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 12, delay: animated ? 0.15 + (3 - idx) * 0.05 : 0 }}
              style={{ display: 'inline-block', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {char}
            </Span>
          ))}
        </span>

        {/* Asymmetrical Spacing Double Slash separator */}
        <Span 
          initial={animated ? { opacity: 0, scale: 0 } : undefined}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10, delay: animated ? 0.05 : 0 }}
          style={{ 
            display: 'inline-block', 
            marginLeft: '0.08em', 
            marginRight: '0.22em', 
            letterSpacing: '-0.08em',
            fontFamily: "'Space Grotesk', sans-serif",
            color: 'var(--accent-crimson)', 
            textShadow: '0 0 12px rgba(244, 63, 94, 0.65)'
          }}
        >
          //
        </Span>

        {/* CLASH with Katakana subtitle centered underneath */}
        <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
          <Span 
            initial={animated ? { opacity: 0, x: -10 } : undefined}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 12, delay: animated ? 0.2 : 0 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              color: 'var(--accent-cyan)',
              filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.5))',
              marginLeft: '0.04em'
            }}
          >
            <svg style={{ height: '0.72em', width: 'auto', display: 'block' }} viewBox="0 0 224 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path custom={0} variants={animated ? pathVariants : undefined} d="M 0 8 L 8 0 L 36 0 L 36 10 L 12 10 L 12 36 L 36 36 L 36 46 L 8 46 L 0 38 Z" fill="currentColor" />
              <Path custom={1} variants={animated ? pathVariants : undefined} d="M 46 0 L 58 0 L 58 36 L 82 36 L 82 46 L 46 46 Z" fill="currentColor" />
              <Path custom={2} variants={animated ? pathVariants : undefined} d="M 92 46 L 92 8 L 100 0 L 120 0 L 128 8 L 128 46 L 116 46 L 116 30 L 104 30 L 104 46 Z M 104 20 L 116 20 L 116 10 L 104 10 Z" fill="currentColor" />
              <Path custom={3} variants={animated ? pathVariants : undefined} d="M 138 8 L 146 0 L 174 0 L 174 10 L 150 10 L 150 18 L 166 18 L 174 26 L 174 38 L 166 46 L 138 46 L 138 36 L 162 36 L 162 28 L 146 28 L 138 20 Z" fill="currentColor" />
              <Path custom={4} variants={animated ? pathVariants : undefined} d="M 184 0 L 196 0 L 196 18 L 212 18 L 212 0 L 224 0 L 224 46 L 212 46 L 212 28 L 196 28 L 196 46 L 184 46 Z" fill="currentColor" />
            </svg>
          </Span>
          
          {/* Static Layout Wrapper for absolute alignment ending at H (right-aligned under CLASH) */}
          <div 
            style={{ 
              fontSize: '0.22em', 
              fontWeight: 800,
              letterSpacing: '0.65em', 
              color: 'var(--accent-crimson)', 
              textShadow: '0 0 8px rgba(244, 63, 94, 0.8)',
              textTransform: 'uppercase',
              display: 'inline-block',
              position: 'absolute',
              bottom: '-1.6em',
              right: '-0.65em',
              whiteSpace: 'nowrap'
            }}
          >
            <Span 
              initial={animated ? { opacity: 0, y: 6 } : undefined}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: animated ? 0.5 : 0, duration: 0.4 }}
              style={{ display: 'inline-block' }}
            >
              クラッシュ
            </Span>
          </div>
        </div>

        {/* Right Bracket */}
        <Span 
          initial={animated ? { opacity: 0, x: -45 } : undefined}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.1 }}
          style={{ 
            display: 'inline-block', 
            color: bracketColor, 
            marginLeft: '0.16em', 
            fontFamily: "'Space Grotesk', sans-serif",
            textShadow: `0 0 10px ${bracketGlow}`
          }}
        >
          &gt;
        </Span>
      </div>
    </Wrapper>
  );
};
