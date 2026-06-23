import { useEffect, useRef, useState, memo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.css'
import algoclashImg from '../assets/algoclash.png'
import syntroxImg from '../assets/syntrox.png'
import ingridioImg from '../assets/ingridio.png'
import traviImg from '../assets/travi.png'
import TraviLogo from './TraviLogo'
import { LogoWordmark } from './LogoWordmark'
import SyntroxWordmark from './SyntroxWordmark'

gsap.registerPlugin(ScrollTrigger)

const ROMAN_NUMERALS = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"]
const numeralsList = [...ROMAN_NUMERALS, ...ROMAN_NUMERALS, ...ROMAN_NUMERALS, ...ROMAN_NUMERALS]

// 3D Astrolabe Perspective Constants
const a = 460  // Starting radius
const b = 0.05 // Soft decay constant
const c = 75   // Depth recede rate in Z-axis
const d = 800  // Camera focal length

// Optimized 3D Perspective Projection for Spiral boundaries (steps reduced from 250 to 70 for speed)
const generateSpiralD = (angleOffset, camZ = 0) => {
  const points = []
  const steps = 70
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

// Optimized 3D Perspective Projection for Filled track ribbons (steps reduced from 150 to 40 for speed)
const generateLaneD = (offsetOuter, offsetInner, camZ = 0) => {
  let dString = ''
  const steps = 40
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

// Gear path outline generator
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

// Static deterministic embers positions and CSS animation offset values
const EMBERS_DATA = Array.from({ length: 25 }).map((_, i) => {
  const r1 = Math.abs(Math.sin(i * 12.9898 + 4.321)) * 10000;
  const size = (r1 - Math.floor(r1)) * 4 + 2; 
  const r2 = Math.abs(Math.sin(i * 78.233 + 1.234)) * 10000;
  const left = (r2 - Math.floor(r2)) * 100; 
  const r3 = Math.abs(Math.sin(i * 45.123 + 9.876)) * 10000;
  const top = 100 + (r3 - Math.floor(r3)) * 20; 
  const delay = (r1 - Math.floor(r1)) * -5;
  const duration = (r2 - Math.floor(r2)) * 3 + 2.5;
  return { size, left, top, delay, duration };
});

// Memoized Background SVG Astrolabe dial
const AstrolabeBackground = memo(() => {
  const spiral1D = generateSpiralD(0, 0)
  const spiral2D = generateSpiralD(2 * Math.PI / 3, 0)
  const lane0D = generateLaneD(2 * Math.PI / 3, 0, 0)

  return (
    <svg 
      className={styles.astrolabeSvg} 
      viewBox="-500 -500 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="astrolabe-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Clockwork Background Rings and Gears */}
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
                filter="url(#astrolabe-glow)"
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

      {/* Spiralling Logarithmic Numerals Track */}
      <g data-astrolabe="clock-group">
        
        <path 
          data-astrolabe="lane-0"
          d={lane0D} 
          className={styles.laneBackgroundRed} 
        />

        {/* Outer glowing path filters */}
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

        {/* Winding numerals along spiral */}
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

        {/* Central symbol */}
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

const PROJECTS = [
  {
    id: 1,
    name: 'algoclash (startup)',
    url: 'https://algoclash.com',
    image: algoclashImg,
    desc: 'A competitive coding arena where developers clash in real-time algorithmic battles with integrated multiplayer lobbies and visualizers.',
    tech: ['React', 'Node.js', 'WebSockets', 'GSAP'],
    colorHex: '#39ff14', // Vibrant neon green
    colorRgb: '57, 255, 20'
  },
  {
    id: 2,
    name: 'Syntrox.io',
    url: 'https://syntrox.io',
    image: syntroxImg,
    desc: 'An interactive 3D web experience focusing on innovative agency design, immersive audio, and seamless 3D navigation.',
    tech: ['React', 'Three.js', 'GSAP', 'WebGL'],
    colorHex: '#ff0055', // Hot synthwave pink
    colorRgb: '255, 0, 85'
  },
  {
    id: 3,
    name: 'Travi',
    url: 'https://googlepromptwars-travi.vercel.app/',
    image: traviImg,
    desc: 'A next-generation AI travel assistant that maps custom itineraries, recommends hidden spots, and automates bookings.',
    tech: ['Next.js', 'TailwindCSS', 'AI APIs', 'PostgreSQL'],
    colorHex: '#00f0ff', // Electric cyan
    colorRgb: '0, 240, 255'
  },
  {
    id: 4,
    name: 'Ingridio',
    url: 'https://phxshubham-ingredio.hf.space/',
    image: ingridioImg,
    staticOnly: true, // Disable heavy Gradio iframe completely to save memory/heat
    desc: 'An AI-driven ingredient analyzer providing transparent, chemical-by-chemical insights into food and cosmetic products.',
    tech: ['React', 'Python', 'ML', 'HuggingFace'],
    colorHex: '#ffaa00', // Neon Orange/Gold
    colorRgb: '255, 170, 0'
  }
]

function ProjectCard({ project, cardProxyRef, isActive }) {
  const wrapperRef = useRef(null)
  const cardRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [mountIframe, setMountIframe] = useState(false)

  // Track mobile layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Debounced iframe mounting
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setMountIframe(true)
      }, 2500) // 2500ms delay to prevent loading intermediate iframes when scrolling rapidly
      return () => clearTimeout(timer)
    } else {
      setMountIframe(false)
      setIframeLoaded(false)
    }
  }, [isActive])

  // Pass ref upwards for the master timeline overlay
  useEffect(() => {
    if (cardProxyRef) {
      if (typeof cardProxyRef === 'function') {
        cardProxyRef(wrapperRef.current)
      } else {
        cardProxyRef.current = wrapperRef.current // eslint-disable-line react-hooks/immutability
      }
    }
  }, [cardProxyRef])

  // Click to redirect
  const handleClick = () => {
    window.open(project.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div ref={wrapperRef} className={`${styles.projectWrapper} ${!isActive ? styles.inactiveCardWrapper : ''}`}>
      
      {/* Main Card Area with Click Event */}
      <div 
        ref={cardRef}
        className={styles.card3d}
        onClick={handleClick}
      >
        
        {/* Right-side Hover Hint */}
        <div className={styles.hoverHint} style={{ color: project.colorHex }}>
          Click to visit the site <span>→</span>
        </div>
        
        {/* Iframe/Screenshot Preview Container */}
        <div className={styles.previewContainer}>
          
          {project.isPlaceholder ? (
            <div className={styles.traviPlaceholder}>
              <div className={styles.traviGlassCard}>
                <div className={styles.traviBrand}>
                  <span className={styles.traviLogo}>✈️</span>
                  <h3>TRAVI</h3>
                  <span className={styles.traviBadge}>AI Assistant</span>
                </div>
                
                <p className={styles.traviHeroText}>Where do you want to explore?</p>
                
                <div className={styles.traviSearchBox}>
                  <span className={styles.traviSearchIcon}>🔍</span>
                  <div className={styles.traviSearchPlaceholder}>Plan my summer trip to Switzerland...</div>
                </div>

                <div className={styles.traviChips}>
                  <span className={styles.traviChip}>🇯🇵 Tokyo</span>
                  <span className={styles.traviChip}>🇮🇹 Amalfi</span>
                  <span className={styles.traviChip}>🇮🇸 Iceland</span>
                </div>

                <div className={styles.traviFooterBadge}>
                  <span>LAUNCHING 2026</span>
                </div>
              </div>
            </div>
          ) : isMobile ? (
            <div className={styles.mobilePreview} style={{ background: `linear-gradient(135deg, rgba(${project.colorRgb || '100,100,100'}, 0.2) 0%, #111 100%)` }}>
              <div className={styles.mobilePreviewLogo} style={{ textShadow: `0 0 20px ${project.colorHex}` }}>
                {project.id === 1 && '⚔️'}
                {project.id === 2 && '✨'}
                {project.id === 3 && '✈️'}
                {project.id === 4 && '🥗'}
              </div>
              <span className={styles.mobilePreviewAction} style={{ color: project.colorHex }}>TAP TO EXPLORE ↗</span>
            </div>
          ) : (
            <div className={styles.imageAndIframeContainer}>
              <img 
                src={project.image} 
                className={styles.screenshotImage} 
                alt={`${project.name} Preview`}
                loading="eager"
              />
              {!project.staticOnly && mountIframe && (
                <iframe 
                  src={project.url}
                  className={`${styles.iframe} ${iframeLoaded ? styles.iframeLoaded : ''}`}
                  style={{ pointerEvents: 'none' }}
                  tabIndex={-1}
                  title={`${project.name} Live Preview`}
                  onLoad={() => setIframeLoaded(true)}
                />
              )}
              {!project.staticOnly && mountIframe && !iframeLoaded && (
                <div className={styles.iframeLoader} style={{ borderColor: project.colorHex }}>
                  <div className={styles.iframeLoaderSpinner} style={{ borderTopColor: project.colorHex }} />
                  <span className={styles.iframeLoaderText} style={{ color: project.colorHex }}>Loading Live Preview...</span>
                </div>
              )}
            </div>
          )}
          
          {/* Invisible overlay to catch mouse events smoothly */}
          <div className={styles.interactionOverlay} />
        </div>

      </div>
    </div>
  )
}

const SOUL_PHRASES = [
  "I pour my soul",
  "into every digital canvas,",
  "crafting interfaces that live, breathe,",
  "and connect."
]

export default function Projects() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const introRef = useRef(null)
  const logoSeqRef = useRef(null)
  const introTitleRef = useRef(null)
  const introSubtitleRef = useRef(null)
  const ambientBgRef = useRef(null)
  const wheelOverlayRef = useRef(null)
  const cardsContainerRef = useRef(null)
  const astrolabeContainerRef = useRef(null)
  const astrolabeBlob1Ref = useRef(null)
  const astrolabeBlob2Ref = useRef(null)
  const projectsLoaderRef = useRef(null)
  
  // Track which index is currently active
  const [activeIndex, setActiveIndex] = useState(0)
  const [debouncedActiveIndex, setDebouncedActiveIndex] = useState(0)
  const [loadedAmbientBgs, setLoadedAmbientBgs] = useState({})

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedActiveIndex(activeIndex)
    }, 600) // 600ms delay to avoid loading heavy background iframes during fast scrolls
    return () => clearTimeout(timer)
  }, [activeIndex])

  useEffect(() => {
    setLoadedAmbientBgs(prev => {
      const next = {}
      if (prev[debouncedActiveIndex]) {
        next[debouncedActiveIndex] = true
      }
      return next
    })
  }, [debouncedActiveIndex])

  const handleAmbientBgLoad = (idx) => {
    setLoadedAmbientBgs(prev => ({ ...prev, [idx]: true }))
  }
  
  // Refs for our manual overlay tracking
  const wheelRef = useRef(null)
  const cardRefs = useRef([])

  // Ensure card refs array has the right size
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, PROJECTS.length)
  }, [])

  // Use 1.5s scrub for smooth inertia transitions
  useEffect(() => {
    let ctx = gsap.context(() => {
      const pinContainer = pinRef.current
      if (!pinContainer) return

      // Fade out about as Projects enters viewport
      const about = document.querySelector('#about')
      if (about) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top 20%',
          scrub: 1.2,
          onUpdate: self => {
            const opacity = 1 - self.progress
            about.style.opacity = opacity
          }
        })
      }
      const cards = cardRefs.current.filter(Boolean)
      if (cards.length === 0) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,      // Smooth inertia catch-up
          onUpdate: (self) => {
            const prog = self.progress
            const t = prog * 7.2
            let index = -1
            if (t >= 2.8 && t < 4.0) {
              index = 0
            } else if (t >= 4.0 && t < 5.2) {
              index = 1
            } else if (t >= 5.2 && t < 6.4) {
              index = 2
            } else if (t >= 6.4) {
              index = 3
            }
            setActiveIndex((prev) => (prev === index ? prev : index))
          }
        }
      })

      // Initially, ambient background starts black
      gsap.set(ambientBgRef.current, { opacity: 0 })

      // Initially, hide 3D carousel elements completely
      gsap.set([cardsContainerRef.current, wheelOverlayRef.current], { opacity: 0, visibility: 'hidden' })

      // Initially, hide projects loader completely
      gsap.set(projectsLoaderRef.current, { opacity: 0 })

      // Playhead object for scrolling/sliding the numerals along the spiral path
      const playhead = { value: 0 }
      const N = numeralsList.length // 48 total

      const container = pinContainer
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
        value: 24, // Slide numerals by 2 full clock turns
        ease: 'none',
        duration: 2.2,
        onUpdate: () => {
          const S = playhead.value
          const camZ = S * (520 / 24)

          const projectedLine1 = generateSpiralD(0, camZ)
          const projectedLine2 = generateSpiralD(2 * Math.PI / 3, camZ)
          const projectedLane0 = generateLaneD(2 * Math.PI / 3, 0, camZ)

          if (line1) line1.setAttribute('d', projectedLine1)
          if (line2) line2.setAttribute('d', projectedLine2)
          if (blur1) blur1.setAttribute('d', projectedLine1)
          if (blur2) blur2.setAttribute('d', projectedLine2)
          if (lane) lane.setAttribute('d', projectedLane0)

          numerals.forEach((el, idx) => {
            if (!el) return
            let val = (idx + S) % N
            if (val < 0) val += N

            const alpha = val * (Math.PI / 6) + Math.PI / 3
            const theta_radius = val * (Math.PI / 6)
            const r = a * Math.exp(-b * theta_radius)
            const z = -c * theta_radius
            const z_rel = z + camZ
            
            const denom = Math.max(100, d - z_rel)
            const scale3d = d / denom

            const x = r * Math.cos(alpha - Math.PI / 2) * scale3d
            const y = r * Math.sin(alpha - Math.PI / 2) * scale3d
            const rotation = alpha * (180 / Math.PI) - 8
            const scale = scale3d * 1.05

            el.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${rotation}deg) scale(${scale})`

            let opacity = 1
            if (z_rel > 0) opacity = Math.max(0, (150 - z_rel) / 150)
            if (z_rel < -1200) opacity = Math.max(0, (1500 + z_rel) / 300)
            el.style.opacity = opacity
          })
        }
      }, 0)

      // Rotate gears and auxiliary astrolabe rings inside timeline (0 to 2.2)
      if (gear1) tl.to(gear1, { rotation: 72, svgOrigin: "0 0", ease: 'none', duration: 2.2 }, 0)
      if (gear2) tl.to(gear2, { rotation: -108, svgOrigin: "300 -220", ease: 'none', duration: 2.2 }, 0)
      if (gear3) tl.to(gear3, { rotation: -90, svgOrigin: "-280 260", ease: 'none', duration: 2.2 }, 0)
      if (ring1) tl.to(ring1, { rotation: -180, svgOrigin: "0 0", ease: 'none', duration: 2.2 }, 0)
      if (ring2) tl.to(ring2, { rotation: 120, svgOrigin: "0 0", ease: 'none', duration: 2.2 }, 0)

      // Background astrolabe blobs shifting position (0 to 2.2)
      if (astrolabeBlob1Ref.current) {
        tl.to(astrolabeBlob1Ref.current, { x: '35vw', y: '25vh', scale: 1.3, opacity: 0.25, ease: 'none', duration: 2.2 }, 0)
      }
      if (astrolabeBlob2Ref.current) {
        tl.to(astrolabeBlob2Ref.current, { x: '-20vw', y: '-30vh', scale: 1.2, opacity: 0.22, ease: 'none', duration: 2.2 }, 0)
      }

      // Fade out the entire astrolabe background container (time 1.7 to 2.2)
      if (astrolabeContainerRef.current) {
        tl.to(astrolabeContainerRef.current, {
          autoAlpha: 0,
          ease: 'power2.inOut',
          duration: 0.5
        }, 1.7)
      }

      // Animate ambient background to fade in (from t=1.7 to t=2.2)
      tl.to(ambientBgRef.current, {
        opacity: 1,
        ease: 'power2.inOut',
        duration: 0.5
      }, 1.7)

      // 1. Heading fades in smoothly (time 0 to 0.4)
      tl.fromTo(introTitleRef.current,
        { opacity: 0.1, filter: 'blur(5px)' },
        { opacity: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 0.4 },
        0
      )

      // 2. Storytelling Subtitle phrase reveal (synchronized with logo phases)
      SOUL_PHRASES.forEach((phrase, idx) => {
        const phraseEl = introSubtitleRef.current ? introSubtitleRef.current.querySelector(`.intro-phrase-${idx}`) : null
        const phraseWords = phraseEl ? phraseEl.querySelectorAll('.intro-word') : []
        if (phraseWords.length > 0) {
          const startTime = idx * 0.5
          tl.fromTo(phraseWords,
            { opacity: 0.05, filter: 'blur(8px)', y: 10 },
            {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              stagger: 0.05,
              ease: 'power2.out',
              duration: 0.35
            },
            startTime
          )
        }
      })

      // 3. Logo Symbol Cross-Fade on the Right (time 0.5 to 1.8)
      const logoItems = logoSeqRef.current ? logoSeqRef.current.querySelectorAll('.intro-logo-item') : []
      if (logoItems.length > 0) {
        // Set initial state
        gsap.set(logoItems, { opacity: 0, scale: 0.85, filter: 'blur(10px)' })
        gsap.set(logoItems[0], { opacity: 1, scale: 1, filter: 'blur(0px)' })

        // Logo 0 -> Logo 1 (Syntrox)
        tl.to(logoItems[0], { opacity: 0, scale: 1.15, filter: 'blur(10px)', ease: 'power2.inOut', duration: 0.3 }, 0.5)
        tl.to(logoItems[1], { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.inOut', duration: 0.3 }, 0.5)

        // Logo 1 -> Logo 2 (Travi)
        tl.to(logoItems[1], { opacity: 0, scale: 1.15, filter: 'blur(10px)', ease: 'power2.inOut', duration: 0.3 }, 1.0)
        tl.to(logoItems[2], { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.inOut', duration: 0.3 }, 1.0)

        // Logo 2 -> Logo 3 (Ingridio)
        tl.to(logoItems[2], { opacity: 0, scale: 1.15, filter: 'blur(10px)', ease: 'power2.inOut', duration: 0.3 }, 1.5)
        tl.to(logoItems[3], { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.inOut', duration: 0.3 }, 1.5)
      }

      // 4. Fade out the entire Intro (time 1.7 to 2.2)
      tl.to(introRef.current, {
        opacity: 0,
        filter: 'blur(20px)',
        scale: 0.95,
        ease: 'power2.inOut',
        duration: 0.5
      }, 1.7)

      // --- 2.2 to 2.8: TRANSITION BREATHING GAP ---
      if (projectsLoaderRef.current) {
        tl.to(projectsLoaderRef.current, { opacity: 1, ease: 'power2.out', duration: 0.2 }, 2.2)
        tl.to(projectsLoaderRef.current, { opacity: 0, ease: 'power2.in', duration: 0.2 }, 2.6)
      }

      // --- 2.8: CAROUSEL ENTRANCE ---
      tl.to([cardsContainerRef.current, wheelOverlayRef.current], {
        opacity: 1,
        visibility: 'visible',
        ease: 'power2.inOut',
        duration: 0.6
      }, 2.8)

      // Eased spiral snap scroll progress
      tl.fromTo(trackRef.current, 
        { '--scroll-progress': -0.6 },
        {
          '--scroll-progress': 0,
          ease: 'power2.inOut',
          duration: 0.6
        }, 
        2.8
      )

      // Preset initial states of cards
      cards.forEach((card, idx) => {
        gsap.set(card, { autoAlpha: idx === 0 ? 0 : 0 })
      })

      // Fade in Card 0 inside the container
      tl.to(cards[0], {
        autoAlpha: 1,
        ease: 'power2.inOut',
        duration: 0.6
      }, 2.8)

      // Focus wheel item 0
      const wheelItems = wheelRef.current ? wheelRef.current.children : []
      if (wheelItems.length > 0) {
        gsap.set(wheelItems, { opacity: 0.3, scale: 0.8 })
        tl.fromTo(wheelItems[0],
          { opacity: 0.3, scale: 0.8 },
          { opacity: 1, scale: 1, ease: 'power2.inOut', duration: 0.6 },
          2.8
        )
      }

      // Build sequential transitions for card snaps (t=3.4 to t=7.0)
      for (let i = 0; i < cards.length - 1; i++) {
        const currentCard = cards[i]
        const nextCard = cards[i + 1]
        const startTime = 3.4 + i * 1.2

        // Eased track scroll progress from card i to card i+1
        tl.to(trackRef.current, {
          '--scroll-progress': i + 1,
          ease: 'power2.inOut',
          duration: 1.2
        }, startTime)

        // Fade out current card to background opacity
        tl.to(currentCard, {
          autoAlpha: 0,
          ease: 'power2.inOut',
          duration: 1.2
        }, startTime)

        // Fade in next card
        tl.to(nextCard, {
          autoAlpha: 1,
          ease: 'power2.inOut',
          duration: 1.2
        }, startTime)

        // Synchronize wheel overlay title translations
        tl.to(wheelRef.current, {
          yPercent: - (i + 1) * (100 / PROJECTS.length),
          ease: 'power2.inOut',
          duration: 1.2
        }, startTime)

        // Animate wheel items focus states
        if (wheelItems.length > 0) {
          tl.to(wheelItems[i], {
            opacity: 0.3,
            scale: 0.8,
            ease: 'power2.inOut',
            duration: 1.2
          }, startTime)

          tl.to(wheelItems[i + 1], {
            opacity: 1,
            scale: 1,
            ease: 'power2.inOut',
            duration: 1.2
          }, startTime)
        }
      }

      // Trailing ease buffer
      tl.to({}, { duration: 0.2 }) 
      
    }, sectionRef)
    
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 1500)
    
    return () => {
      ctx.revert()
      clearTimeout(refreshTimer)
    }
  }, [])

  const totalPanels = 7.2

  return (
    <section 
      id="projects" 
      ref={sectionRef} 
      className={styles.sectionTrigger}
      style={{ height: `${totalPanels * 100}vh` }}
    >
      <div ref={pinRef} className={styles.sectionPinned}>
        
        {/* Scroll indicator for transition gap */}
        <div ref={projectsLoaderRef} className={styles.projectsLoader}>
          <span className={styles.loaderText}>Scroll to Discover</span>
          <div className={styles.scrollArrow}>↓</div>
        </div>
        
        {/* Astrolabe / Logarithmic Spiral Background */}
        <div ref={astrolabeContainerRef} className={styles.astrolabeContainer}>
          <div className={styles.astrolabeAmbientGlow} />
          <div ref={astrolabeBlob1Ref} className={`${styles.astrolabeBlob} ${styles.astrolabeBlobRed}`} />
          <div ref={astrolabeBlob2Ref} className={`${styles.astrolabeBlob} ${styles.astrolabeBlobOrange}`} />

          {/* Floating Particle Embers (Compositor-only CSS animated) */}
          {EMBERS_DATA.map((ember, i) => (
            <div
              key={i}
              className={styles.ember}
              style={{
                width: ember.size,
                height: ember.size,
                left: `${ember.left}%`,
                top: `${ember.top}%`,
                '--delay': `${ember.delay}s`,
                '--duration': `${ember.duration}s`
              }}
            />
          ))}

          <AstrolabeBackground />
        </div>

        {/* Dynamic Ambient Background Glow */}
        <div ref={ambientBgRef} className={styles.projectAmbientBg}>
          {PROJECTS.map((project, idx) => {
            const isActiveBg = activeIndex === idx
            const isDebouncedActiveBg = debouncedActiveIndex === idx
            return (
              <div 
                key={`bg-${project.id}`} 
                className={`${styles.ambientBgItem} ${isActiveBg ? styles.ambientBgActive : ''}`}
              >
                {/* Image is always mounted for smooth background blending */}
                <img 
                  src={project.image}
                  className={styles.ambientImage}
                  alt=""
                />
                {/* Iframe is mounted only when active and settled. Disabled for Ingridio. */}
                {!project.staticOnly && project.id !== 4 && isDebouncedActiveBg && (
                  <iframe 
                    src={project.url}
                    className={styles.ambientIframe}
                    style={{ 
                      pointerEvents: 'none',
                      opacity: loadedAmbientBgs[idx] ? 1 : 0,
                      transition: 'opacity 1s ease-in-out'
                    }}
                    tabIndex={-1}
                    title={`${project.name} Ambient Live Preview`}
                    onLoad={() => handleAmbientBgLoad(idx)}
                  />
                )}
              </div>
            )
          })}
          <div className={styles.ambientOverlay} />
        </div>

        {/* Pinned Projects Intro Screen */}
        <div ref={introRef} className={styles.projectsIntro}>
          <div className={styles.introSplit}>
            
            {/* Left Column: Storytelling Text */}
            <div className={styles.introLeft}>
              <h1 ref={introTitleRef} className={styles.introTitle}>My Projects</h1>
              <p ref={introSubtitleRef} className={styles.introSubtitle}>
                {SOUL_PHRASES.map((phrase, pIdx) => (
                  <span key={pIdx} className={`intro-phrase-${pIdx}`} style={{ display: 'inline-block', marginRight: '0.35em' }}>
                    {phrase.split(' ').map((word, wIdx) => (
                      <span key={wIdx} className="intro-word" style={{ display: 'inline-block', marginRight: '0.22em' }}>
                        {word}
                      </span>
                    ))}
                  </span>
                ))}
              </p>
            </div>

            {/* Right Column: Cross-fading Logo Symbols */}
            <div ref={logoSeqRef} className={styles.introRight}>
              <div className={`${styles.introLogoItem} intro-logo-item`}><LogoWordmark fontSize="clamp(20px, 3vw, 42px)" animated={false} /></div>
              <div className={`${styles.introLogoItem} intro-logo-item`}><SyntroxWordmark fontSize="clamp(24px, 4.5vw, 64px)" animate={false} glitch={false} /></div>
              <div className={`${styles.introLogoItem} intro-logo-item`}><TraviLogo /></div>
              <div className={`${styles.introLogoItem} intro-logo-item`}>
                <span style={{ 
                  fontFamily: "'Space Grotesk', sans-serif", 
                  fontWeight: 900, 
                  fontSize: "clamp(24px, 4.5vw, 64px)", 
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase"
                }}>
                  Ingridio
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 3D Wheel/Carousel Overlay */}
        <div ref={wheelOverlayRef} className={styles.wheelOverlay}>
          <div className={styles.wheelViewport}>
            <div ref={wheelRef} className={styles.wheelTrack} style={{ height: `${PROJECTS.length * 100}%` }}>
              {PROJECTS.map((project) => (
                <div key={project.id} className={styles.wheelItem}>
                  {project.name.toLowerCase().startsWith('travi') ? (
                    <TraviLogo />
                  ) : project.name.toLowerCase().startsWith('algoclash') ? (
                    <LogoWordmark fontSize="clamp(24px, 4vw, 55px)" animated={true} />
                  ) : project.name.toLowerCase().startsWith('syntrox') ? (
                    <SyntroxWordmark fontSize="clamp(36px, 6.5vw, 95px)" animate={true} glitch={false} />
                  ) : (
                    <span style={{ 
                      fontFamily: "'Space Grotesk', sans-serif", 
                      fontWeight: 900, 
                      fontSize: "clamp(36px, 6.5vw, 95px)", 
                      letterSpacing: "-0.03em",
                      textTransform: "uppercase"
                    }}>
                      Ingridio
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Display with fixed Z-indexing for natural stacking order */}
        <div ref={cardsContainerRef} className={styles.projectsListPinned}>
          <div ref={trackRef} className={styles.spiralTrack}>
            {PROJECTS.map((project, idx) => (
              <div 
                key={project.id} 
                className={styles.cardContainerWrapper} 
                style={{ 
                  zIndex: PROJECTS.length - idx,
                  '--idx': idx 
                }}
              >
                <ProjectCard 
                  project={project} 
                  cardProxyRef={(el) => { cardRefs.current[idx] = el; }} 
                  isActive={activeIndex === idx} 
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
