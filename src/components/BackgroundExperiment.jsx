import React, { useEffect, useRef, memo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './BackgroundExperiment.module.css'

gsap.registerPlugin(ScrollTrigger)

const ROMAN_NUMERALS = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"]

// Build a sequence of numerals for 4 turns of the 12-hour clock (48 total) to fully populate the spiral
const numeralsList = [...ROMAN_NUMERALS, ...ROMAN_NUMERALS, ...ROMAN_NUMERALS, ...ROMAN_NUMERALS]

// 3D Astrolabe Perspective Constants
const a = 460  // Starting radius
const b = 0.05 // Soft decay constant (perspective handles depth scaling)
const c = 75   // Depth recede rate in Z-axis
const d = 800  // Camera focal length

// 3D Perspective Projection for Spiral boundaries
const generateSpiralD = (angleOffset, camZ = 0) => {
  const points = []
  const steps = 250
  const maxTheta = 6.4 * Math.PI
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxTheta
    const r = a * Math.exp(-b * theta)
    const z = -c * theta
    const z_rel = z + camZ
    const scale = d / Math.max(100, d - z_rel)
    const x = r * Math.cos(theta + angleOffset - Math.PI / 2) * scale
    const y = r * Math.sin(theta + angleOffset - Math.PI / 2) * scale
    points.push({ x, y })
  }
  return points.reduce((acc, p, idx) => {
    return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`)
  }, '')
}

// 3D Perspective Projection for Filled track ribbons
const generateLaneD = (offsetOuter, offsetInner, camZ = 0) => {
  let dString = ''
  const steps = 150
  const maxTheta = 6.4 * Math.PI
  for (let i = 0; i < steps; i++) {
    const theta1 = (i / steps) * maxTheta
    const theta2 = ((i + 1) / steps) * maxTheta
    
    const rOuter1 = a * Math.exp(-b * theta1)
    const z1 = -c * theta1
    const z_rel1 = z1 + camZ
    const scale1 = d / Math.max(100, d - z_rel1)
    const xOuter1 = rOuter1 * Math.cos(theta1 + offsetOuter - Math.PI / 2) * scale1
    const yOuter1 = rOuter1 * Math.sin(theta1 + offsetOuter - Math.PI / 2) * scale1

    const rOuter2 = a * Math.exp(-b * theta2)
    const z2 = -c * theta2
    const z_rel2 = z2 + camZ
    const scale2 = d / Math.max(100, d - z_rel2)
    const xOuter2 = rOuter2 * Math.cos(theta2 + offsetOuter - Math.PI / 2) * scale2
    const yOuter2 = rOuter2 * Math.sin(theta2 + offsetOuter - Math.PI / 2) * scale2

    const rInner2 = a * Math.exp(-b * theta2)
    const zInner2 = -c * theta2
    const z_relInner2 = zInner2 + camZ
    const scaleInner2 = d / Math.max(100, d - z_relInner2)
    const xInner2 = rInner2 * Math.cos(theta2 + offsetInner - Math.PI / 2) * scaleInner2
    const yInner2 = rInner2 * Math.sin(theta2 + offsetInner - Math.PI / 2) * scaleInner2

    const rInner1 = a * Math.exp(-b * theta1)
    const zInner1 = -c * theta1
    const z_relInner1 = zInner1 + camZ
    const scaleInner1 = d / Math.max(100, d - z_relInner1)
    const xInner1 = rInner1 * Math.cos(theta1 + offsetInner - Math.PI / 2) * scaleInner1
    const yInner1 = rInner1 * Math.sin(theta1 + offsetInner - Math.PI / 2) * scaleInner1
    
    dString += `M ${xOuter1} ${yOuter1} L ${xOuter2} ${yOuter2} L ${xInner2} ${yInner2} L ${xInner1} ${yInner1} Z `
  }
  return dString
}

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

// Static deterministic embers positions
const EMBERS_DATA = Array.from({ length: 25 }).map((_, i) => {
  const r1 = Math.abs(Math.sin(i * 12.9898 + 4.321)) * 10000;
  const size = (r1 - Math.floor(r1)) * 4 + 2; 
  const r2 = Math.abs(Math.sin(i * 78.233 + 1.234)) * 10000;
  const left = (r2 - Math.floor(r2)) * 100; 
  const r3 = Math.abs(Math.sin(i * 45.123 + 9.876)) * 10000;
  const top = 100 + (r3 - Math.floor(r3)) * 20; 
  return { size, left, top };
});

// Memoized background astrolabe dial (drawn initially at camZ = 0)
const AstrolabeBackground = memo(() => {
  const spiral1D = generateSpiralD(0, 0)
  const spiral2D = generateSpiralD(2 * Math.PI / 3, 0)
  const lane0D = generateLaneD(2 * Math.PI / 3, 0, 0)

  return (
    <svg 
      className={styles.svgCanvas} 
      viewBox="-500 -500 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* BACKGROUND CLOCKWORK GEARS */}
      <g>
        <circle cx="0" cy="0" r="460" className={styles.ring} />
        <circle cx="0" cy="0" r="400" className={styles.ring} />
        
        <g data-astrolabe="ring-1">
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
                fill="rgba(179, 80, 0, 0.25)" 
                filter="url(#glow)"
              />
            )
          })}
        </g>

        <g data-astrolabe="ring-2">
          <circle cx="0" cy="0" r="320" className={styles.dottedRing} />
        </g>

        <path 
          data-astrolabe="gear-1"
          d={generateGearPath(0, 0, 36, 200, 185)} 
          className={styles.gear} 
        />
        <path 
          data-astrolabe="gear-2"
          d={generateGearPath(300, -220, 24, 130, 118)} 
          className={styles.gear} 
        />
        <path 
          data-astrolabe="gear-3"
          d={generateGearPath(-280, 260, 28, 150, 138)} 
          className={styles.gear} 
        />
      </g>

      {/* MAIN SPIRALLING CLOCK dial */}
      <g data-astrolabe="clock-group">
        
        {/* Soft filled track ribbon (Lane 0) */}
        <path 
          data-astrolabe="lane-0"
          d={lane0D} 
          className={styles.laneBackgroundRed} 
        />

        {/* Ambient blur paths under the main lines for thin glowing ribbon effect */}
        <path 
          data-astrolabe="spiral-blur-1"
          d={spiral1D} 
          stroke="#990026"
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          style={{ filter: 'blur(8px)', opacity: 0.15 }}
        />
        <path 
          data-astrolabe="spiral-blur-2"
          d={spiral2D} 
          stroke="#b38000"
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          style={{ filter: 'blur(8px)', opacity: 0.15 }}
        />

        {/* The 2 logarithmic spiral paths (Inner and Outer boundaries of the numeral lane) */}
        <path 
          data-astrolabe="spiral-line-1"
          d={spiral1D} 
          className={styles.spiralLineRed} 
        />
        <path 
          data-astrolabe="spiral-line-2"
          d={spiral2D} 
          className={styles.spiralLineGold} 
        />

        {/* Roman Numerals winding along the spiral */}
        {numeralsList.map((numeral, idx) => {
          const val = idx
          const alpha = val * (Math.PI / 6) + Math.PI / 3
          const theta_radius = val * (Math.PI / 6)
          const r = a * Math.exp(-b * theta_radius)
          const z = -c * theta_radius
          const scale3d = d / Math.max(100, d - z)
          const x = r * Math.cos(alpha - Math.PI / 2) * scale3d
          const y = r * Math.sin(alpha - Math.PI / 2) * scale3d
          const rotation = alpha * (180 / Math.PI) - 8
          const scale = scale3d * 1.05

          let opacity = 1
          if (z < -1200) opacity = Math.max(0, (1500 + z) / 300)

          return (
            <g 
              key={idx} 
              data-astrolabe="numeral-item"
              style={{
                transform: `translate3d(${x}px, ${y}px, 0px) rotate(${rotation}deg) scale(${scale})`,
                opacity: opacity
              }}
            >
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.romanNumeral}
              >
                {numeral}
              </text>
            </g>
          )
        })}

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
  )
})
AstrolabeBackground.displayName = 'AstrolabeBackground'

export default function BackgroundExperiment() {
  const containerRef = useRef(null)
  const blob1Ref = useRef(null)
  const blob2Ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Setup the ScrollTrigger timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        }
      })

      // 2. Playhead object for scrolling/sliding the numerals along the path
      const playhead = { value: 0 }
      const N = numeralsList.length // 24

      // Query elements inside the container using data selectors
      const container = containerRef.current
      const numerals = container.querySelectorAll('[data-astrolabe="numeral-item"]')
      const line1 = container.querySelector('[data-astrolabe="spiral-line-1"]')
      const line2 = container.querySelector('[data-astrolabe="spiral-line-2"]')
      const blur1 = container.querySelector('[data-astrolabe="spiral-blur-1"]')
      const blur2 = container.querySelector('[data-astrolabe="spiral-blur-2"]')
      const lane = container.querySelector('[data-astrolabe="lane-0"]')

      const gear1 = container.querySelector('[data-astrolabe="gear-1"]')
      const gear2 = container.querySelector('[data-astrolabe="gear-2"]')
      const gear3 = container.querySelector('[data-astrolabe="gear-3"]')
      const ring1 = container.querySelector('[data-astrolabe="ring-1"]')
      const ring2 = container.querySelector('[data-astrolabe="ring-2"]')

      // Slide numerals and zoom camera along the spiral path on scroll
      tl.to(playhead, {
        value: 24, // Slide numerals by 2 full clock turns (24 steps of Math.PI/6)
        ease: 'none',
        duration: 3,
        onUpdate: () => {
          const S = playhead.value
          const camZ = S * (520 / 24) // Camera moves forward in Z-axis as we scroll

          // 3D reprojection of static spiral paths in real time based on camera Z depth!
          const projectedLine1 = generateSpiralD(0, camZ)
          const projectedLine2 = generateSpiralD(2 * Math.PI / 3, camZ)
          const projectedLane0 = generateLaneD(2 * Math.PI / 3, 0, camZ)

          if (line1) line1.setAttribute('d', projectedLine1)
          if (line2) line2.setAttribute('d', projectedLine2)
          if (blur1) blur1.setAttribute('d', projectedLine1)
          if (blur2) blur2.setAttribute('d', projectedLine2)
          if (lane) lane.setAttribute('d', projectedLane0)

          // 3D reprojection and depth-clipping of Roman numerals
          numerals.forEach((el, idx) => {
            if (!el) return
            // Calculate looped virtual index
            let val = (idx + S) % N
            if (val < 0) val += N

            const alpha = val * (Math.PI / 6) + Math.PI / 3 // Screen angle (offset by 60deg to sit in Lane 0)
            const theta_radius = val * (Math.PI / 6) // Radius/decay angle (starts at 0)
            const r = a * Math.exp(-b * theta_radius)
            const z = -c * theta_radius
            const z_rel = z + camZ // Relative depth to camera
            
            const denom = Math.max(100, d - z_rel)
            const scale3d = d / denom

            const x = r * Math.cos(alpha - Math.PI / 2) * scale3d
            const y = r * Math.sin(alpha - Math.PI / 2) * scale3d
            const rotation = alpha * (180 / Math.PI) - 8 // Align tangent to spiral curve
            const scale = scale3d * 1.05

            el.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${rotation}deg) scale(${scale})`

            // Soft depth-based clipping volume opacity calculations (replaces arbitrary theta bounds)
            let opacity = 1
            if (z_rel > 0) opacity = Math.max(0, (150 - z_rel) / 150) // Fades out as it flies past camera
            if (z_rel < -1200) opacity = Math.max(0, (1500 + z_rel) / 300) // Fades out in the dark distance
            el.style.opacity = opacity
          })
        }
      }, 0)

      // 3. Meshed gear rotations around their specific gear center points
      tl.to(gear1, { rotation: 72, svgOrigin: "0 0", ease: 'none', duration: 3 }, 0)
      tl.to(gear2, { rotation: -108, svgOrigin: "300 -220", ease: 'none', duration: 3 }, 0)
      tl.to(gear3, { rotation: -90, svgOrigin: "-280 260", ease: 'none', duration: 3 }, 0)

      // 4. Auxiliary astrolabe rings rotation
      tl.to(ring1, { rotation: -180, svgOrigin: "0 0", ease: 'none', duration: 3 }, 0)
      tl.to(ring2, { rotation: 120, svgOrigin: "0 0", ease: 'none', duration: 3 }, 0)

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
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.viewport}>
        <div className={styles.ambientGlow} />
        <div ref={blob1Ref} className={`${styles.blob} ${styles.blobRed}`} />
        <div ref={blob2Ref} className={`${styles.blob} ${styles.blobOrange}`} />

        {/* Floating Particle Embers */}
        {EMBERS_DATA.map((ember, i) => (
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
        ))}

        {/* SVG Astrolabe / Clockwork Canvas (Memoized Child) */}
        <AstrolabeBackground />

      </div>

      <div className={styles.overlayInfo}>
        <span>The Antikythera Spiral Sundial</span>
        <span className={styles.scrollIndicator}>↓</span>
      </div>
    </div>
  )
}
