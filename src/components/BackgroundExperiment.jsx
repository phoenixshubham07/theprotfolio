import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './BackgroundExperiment.module.css'

gsap.registerPlugin(ScrollTrigger)

const ROMAN_NUMERALS = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"]

// Build a sequence of numerals for 3 full turns (36 total)
const numeralsList = [...ROMAN_NUMERALS, ...ROMAN_NUMERALS, ...ROMAN_NUMERALS]

// Helper to generate a gear outline SVG path
function generateGearPath(cx, cy, teeth, outerR, innerR) {
  let path = ''
  const step = (2 * Math.PI) / teeth
  for (let i = 0; i < teeth; i++) {
    const angle1 = i * step
    const angle2 = (i + 0.4) * step
    const angle3 = (i + 0.5) * step
    const angle4 = (i + 0.9) * step

    const x1 = cx + outerR * Math.cos(angle1)
    const y1 = cy + outerR * Math.sin(angle1)
    const x2 = cx + outerR * Math.cos(angle2)
    const y2 = cy + outerR * Math.sin(angle2)
    const x3 = cx + innerR * Math.cos(angle3)
    const y3 = cy + innerR * Math.sin(angle3)
    const x4 = cx + innerR * Math.cos(angle4)
    const y4 = cy + innerR * Math.sin(angle4)

    if (i === 0) {
      path += `M ${x1} ${y1} `
    } else {
      path += `L ${x1} ${y1} `
    }
    path += `L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} `
  }
  path += 'Z'
  return path
}

// Static deterministic embers positions to comply with React 19 render purity rules
const EMBERS_DATA = Array.from({ length: 25 }).map((_, i) => {
  // Use high-frequency sine waves to generate pseudo-random distributions
  const r1 = Math.abs(Math.sin(i * 12.9898 + 4.321)) * 10000;
  const size = (r1 - Math.floor(r1)) * 4 + 2; // size between 2px and 6px

  const r2 = Math.abs(Math.sin(i * 78.233 + 1.234)) * 10000;
  const left = (r2 - Math.floor(r2)) * 100; // left position %

  const r3 = Math.abs(Math.sin(i * 45.123 + 9.876)) * 10000;
  const top = 100 + (r3 - Math.floor(r3)) * 20; // top start offset %

  return { size, left, top };
});

export default function BackgroundExperiment() {
  const containerRef = useRef(null)
  const clockGroupRef = useRef(null)
  const spiralPathRef = useRef(null)
  const gear1Ref = useRef(null)
  const gear2Ref = useRef(null)
  const gear3Ref = useRef(null)
  const ring1Ref = useRef(null)
  const ring2Ref = useRef(null)
  const blob1Ref = useRef(null)
  const blob2Ref = useRef(null)

  // Logarithmic Spiral Parameters
  const a = 420 // Starting radius
  const b = 0.14 // Decay constant

  // Generate points for the spiral path
  const points = []
  const steps = 240
  const maxTheta = 6.2 * Math.PI // A bit over 3 full turns
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxTheta
    const thetaOffset = theta - Math.PI / 2 // Offset by -90deg so XII starts at top
    const r = a * Math.exp(-b * theta)
    const x = r * Math.cos(thetaOffset)
    const y = r * Math.sin(thetaOffset)
    points.push({ x, y })
  }

  // Build SVG path "d" string
  const spiralPathD = points.reduce((acc, p, idx) => {
    return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`)
  }, '')

  // Calculate position and rotation for each Roman numeral along the spiral
  const numeralsData = numeralsList.map((numeral, idx) => {
    const theta = idx * ((2 * Math.PI) / 12)
    const thetaOffset = theta - Math.PI / 2
    const r = a * Math.exp(-b * theta)
    const x = r * Math.cos(thetaOffset)
    const y = r * Math.sin(thetaOffset)
    const rotation = idx * 30 // 30deg per clock digit
    const scale = Math.max(0.12, r / a) * 1.25

    return {
      numeral,
      x,
      y,
      rotation,
      scale
    }
  })

  useEffect(() => {
    // Standard ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    })

    // 1. Zoom and rotate into the spiral center
    tl.to(clockGroupRef.current, {
      scale: 7.5,
      rotation: 540,
      ease: 'power1.inOut',
      duration: 3
    }, 0)

    // 2. Draw the spiral line dynamically
    if (spiralPathRef.current) {
      const length = spiralPathRef.current.getTotalLength()
      gsap.set(spiralPathRef.current, { strokeDasharray: length, strokeDashoffset: length })
      tl.to(spiralPathRef.current, {
        strokeDashoffset: 0,
        ease: 'power1.inOut',
        duration: 2.8
      }, 0)
    }

    // 3. Meshed gear rotations
    tl.to(gear1Ref.current, { rotation: 72, ease: 'none', duration: 3 }, 0)
    tl.to(gear2Ref.current, { rotation: -108, ease: 'none', duration: 3 }, 0)
    tl.to(gear3Ref.current, { rotation: -90, ease: 'none', duration: 3 }, 0)

    // 4. Auxiliary astrolabe rings rotation
    tl.to(ring1Ref.current, { rotation: -180, ease: 'none', duration: 3 }, 0)
    tl.to(ring2Ref.current, { rotation: 120, ease: 'none', duration: 3 }, 0)

    // 5. Floating background blobs shifting position
    tl.to(blob1Ref.current, { x: '35vw', y: '25vh', scale: 1.3, opacity: 0.25, ease: 'none', duration: 3 }, 0)
    tl.to(blob2Ref.current, { x: '-20vw', y: '-30vh', scale: 1.2, opacity: 0.22, ease: 'none', duration: 3 }, 0)

    // Embers animation
    const embers = containerRef.current.querySelectorAll('.ember')
    embers.forEach((ember) => {
      const duration = 2 + Math.random() * 3
      const delay = Math.random() * -3
      gsap.to(ember, {
        y: '-100vh',
        x: '+=30px',
        opacity: 0,
        repeat: -1,
        duration: duration,
        delay: delay,
        ease: 'power1.out'
      })
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div ref={containerRef} className={styles.container}>
      
      {/* Fixed Viewport holding the SVG clockwork */}
      <div className={styles.viewport}>
        
        {/* Ambient Gradient Glows */}
        <div className={styles.ambientGlow} />
        <div ref={blob1Ref} className={`${styles.blob} ${styles.blobRed}`} />
        <div ref={blob2Ref} className={`${styles.blob} ${styles.blobOrange}`} />

        {/* Floating Particle Embers */}
        {EMBERS_DATA.map((ember, i) => {
          return (
            <div
              key={i}
              className="ember"
              style={{
                position: 'absolute',
                width: ember.size,
                height: ember.size,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ff6600 0%, rgba(255, 0, 80, 0.4) 100%)',
                boxShadow: '0 0 8px #ff4500',
                left: `${ember.left}%`,
                top: `${ember.top}%`,
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
          )
        })}

        {/* SVG Astrolabe / Clockwork Canvas */}
        <svg 
          className={styles.svgCanvas} 
          viewBox="-500 -500 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dark orange/crimson gradient for the spiral line */}
            <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff0044" />
              <stop offset="50%" stopColor="#ff6600" />
              <stop offset="100%" stopColor="#ffb700" />
            </linearGradient>
            
            {/* Soft glow filter for Roman numerals */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND CLOCKWORK GEARS (Antikythera Mechanism theme) */}
          <g>
            {/* Concentric blueprint rings */}
            <circle cx="0" cy="0" r="460" className={styles.ring} />
            <circle cx="0" cy="0" r="400" className={styles.ring} />
            
            {/* Star constellation / astrological ring */}
            <g ref={ring1Ref}>
              <circle cx="0" cy="0" r="430" className={styles.dottedRing} />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * (Math.PI / 6)
                const x = 430 * Math.cos(angle)
                const y = 430 * Math.sin(angle)
                return (
                  <circle 
                    key={i} 
                    cx={x} 
                    cy={y} 
                    r="3.5" 
                    fill="rgba(255, 80, 0, 0.25)" 
                    filter="url(#glow)"
                  />
                )
              })}
            </g>

            <g ref={ring2Ref}>
              <circle cx="0" cy="0" r="320" className={styles.dottedRing} />
            </g>

            {/* Mesh Gear 1: Center background */}
            <path 
              ref={gear1Ref}
              d={generateGearPath(0, 0, 36, 200, 185)} 
              className={styles.gear} 
            />

            {/* Mesh Gear 2: Top Right */}
            <path 
              ref={gear2Ref}
              d={generateGearPath(300, -220, 24, 130, 118)} 
              className={styles.gear} 
            />

            {/* Mesh Gear 3: Bottom Left */}
            <path 
              ref={gear3Ref}
              d={generateGearPath(-280, 260, 28, 150, 138)} 
              className={styles.gear} 
            />
          </g>

          {/* MAIN SPIRALLING CLOCK dial */}
          <g ref={clockGroupRef}>
            
            {/* The logarithmic spiral path */}
            <path 
              ref={spiralPathRef}
              d={spiralPathD} 
              className={styles.spiralLine} 
            />

            {/* Roman Numerals winding along the spiral */}
            {numeralsData.map((data, idx) => (
              <g 
                key={idx} 
                transform={`translate(${data.x}, ${data.y}) rotate(${data.rotation}) scale(${data.scale})`}
              >
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.romanNumeral}
                >
                  {data.numeral}
                </text>
              </g>
            ))}

            {/* Microscopic infinity symbol in center */}
            <g transform="scale(0.12)">
              <text 
                x="0" 
                y="0" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className={styles.romanNumeralCenter}
              >
                Ω
              </text>
            </g>
          </g>

        </svg>

      </div>

      {/* Floating Info / Instructions overlay */}
      <div className={styles.overlayInfo}>
        <span>The Antikythera Spiral Sundial</span>
        <span className={styles.scrollIndicator}>↓</span>
      </div>

    </div>
  )
}
