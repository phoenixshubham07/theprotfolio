import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.css'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    id: 1,
    name: 'Ingredio',
    url: 'https://phxshubham-ingredio.hf.space/',
    desc: 'An AI-driven ingredient analyzer providing transparent insights into food and cosmetic products.',
    tech: ['React', 'Python', 'ML', 'HuggingFace'],
    colorHex: '#39ff14', // Vibrant neon green
    colorRgb: '57, 255, 20'
  },
  {
    id: 2,
    name: 'Syntrox.io',
    url: 'https://syntrox.io',
    desc: 'An interactive 3D web experience focusing on innovative design and seamless navigation.',
    tech: ['React', 'Three.js', 'GSAP', 'WebGL'],
    colorHex: '#ff0055', // Hot synthwave pink
    colorRgb: '255, 0, 85'
  },
  {
    id: 3,
    name: 'Algoclash.in',
    url: 'https://algoclash.in',
    desc: 'A competitive programming platform offering real-time coding battles and algorithm challenges.',
    tech: ['Next.js', 'Node.js', 'WebSockets', 'Python'],
    colorHex: '#6dedf0', // Cool cyan
    colorRgb: '109, 237, 240'
  }
]

function ProjectCard({ project, index, cardRefProxy, isActive }) {
  const cardRef = useRef(null)
  
  // Algoclash.in (ID 3) should load immediately; others lazy-load on scroll
  const shouldEagerLoad = project.id === 3
  const [hasLoaded, setHasLoaded] = useState(shouldEagerLoad)

  // Once active, we trigger the load. We never "unload" to keep the session alive.
  useEffect(() => {
    if ((isActive || shouldEagerLoad) && !hasLoaded) {
      setHasLoaded(true)
    }
  }, [isActive, hasLoaded, shouldEagerLoad])

  // Pass ref upwards for the master timeline overlay
  useEffect(() => {
    if (cardRefProxy) cardRefProxy.current = cardRef.current
  }, [cardRefProxy])

  // Click to redirect
  const handleClick = () => {
    window.open(project.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={styles.projectWrapper}>
      
      {/* Main Card Area */}
      <div 
        ref={cardRef}
        className={styles.card3d}
        onClick={handleClick}
      >
        
        {/* Right-side Hover Hint */}
        <div className={styles.hoverHint} style={{ color: project.colorHex }}>
          Click to visit the site <span>→</span>
        </div>
        
        {/* Iframe Preview Container */}
        <div className={styles.previewContainer}>
          <div className={styles.browserHeader}>
            <div className={styles.browserDots} />
            <div className={styles.browserUrl}>{project.url.replace('https://', '')}</div>
          </div>
          
          {hasLoaded ? (
            <iframe 
              src={project.url}
              className={`${styles.iframe} ${hasLoaded ? styles.iframeLoaded : ''}`}
              style={{ pointerEvents: 'none' }} /* Ensure clicks go to the wrapper */
              tabIndex={-1}
              title={`${project.name} Live Preview`}
            />
          ) : (
            <div className={styles.iframePlaceholder}>
              <div className={styles.loader} />
            </div>
          )}
          
          {/* Invisible overlay to catch all mouse events over the iframe smoothly */}
          <div className={styles.interactionOverlay} />
        </div>

      </div>
    </div>
  )
}


export default function Projects() {
  const sectionRef = useRef(null)
  
  // Track which index is currently active to trigger iframe loading
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Refs for our manual overlay tracking
  const wheelRef = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)
  const card3Ref = useRef(null)

  // Use 1.2s scrub for smoother high-performance scrolling
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%', // Increased distance for a more natural scroll pace
          pin: true,
          scrub: 1.2,    // Slightly slower scrub for better interpolation at higher refresh rates
          onUpdate: (self) => {
            // Determine active index based on scroll progress
            // 0.0 - 0.33 -> 0
            // 0.33 - 0.66 -> 1
            // 0.66 - 1.0 -> 2
            const prog = self.progress
            if (prog < 0.33) setActiveIndex(0)
            else if (prog < 0.66) setActiveIndex(1)
            else setActiveIndex(2)
          }
        }
      })

      // Ensure all cards are pre-set to avoid layout jumps
      gsap.set([card2Ref.current, card3Ref.current], { opacity: 0, y: '100%', z: 800 })

      // --- STAGE 1: CARD 1 SWAP ---
      // CARD 1 -> EXIT (Ingredio)
      tl.to(card1Ref.current, {
        y: '-100%',
        z: -800,       // Reduced from -1200 to keep it in a more performant frustum
        rotationX: -10, // Reduced for stability
        opacity: 0,
        filter: 'blur(10px)', // Reduced blur for faster GPU processing
        ease: 'power2.inOut'
      }, 0.5)
      
      // SYNC TITLE 1 -> 2
      tl.to(wheelRef.current, {
        yPercent: -33.33,
        ease: 'power2.inOut'
      }, 0.5)

      // CARD 2 -> ENTER (Synthrox)
      tl.fromTo(card2Ref.current, 
        { y: '100%', z: 800, rotationX: 10, opacity: 0 },
        { y: 0, z: 0, rotationX: 0, opacity: 1, ease: 'power2.inOut' },
        0.5
      )

      // --- STAGE 2: CARD 2 SWAP ---
      // CARD 2 -> EXIT
      tl.to(card2Ref.current, {
        y: '-100%',
        z: -800,
        rotationX: -10,
        opacity: 0,
        filter: 'blur(10px)',
        ease: 'power2.inOut'
      }, 1.5)

      // SYNC TITLE 2 -> 3
      tl.to(wheelRef.current, {
        yPercent: -66.66,
        ease: 'power2.inOut'
      }, 1.5)

      // CARD 3 -> ENTER (Algoclash)
      tl.fromTo(card3Ref.current, 
        { y: '100%', z: 800, rotationX: 10, opacity: 0 },
        { y: 0, z: 0, rotationX: 0, opacity: 1, ease: 'power2.inOut' },
        1.5
      )

      // Buffer at the end to prevent immediate snapping out
      tl.to({}, { duration: 1.0 }) 
      
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className={styles.sectionPinned}>
      
      {/* 3D Wheel/Carousel Overlay */}
      <div className={styles.wheelOverlay}>
        <div className={styles.wheelViewport}>
          <div ref={wheelRef} className={styles.wheelTrack}>
            <div className={styles.wheelItem}>INGREDIO</div>
            <div className={styles.wheelItem}>SYNTROX.IO</div>
            <div className={styles.wheelItem}>ALGOCLASH.IN</div>
          </div>
        </div>
      </div>

      <div className={styles.projectsListPinned}>
        <div className={styles.cardContainerWrapper} style={{ zIndex: 2 }}>
          <ProjectCard project={PROJECTS[0]} index={0} cardRefProxy={card1Ref} isActive={activeIndex === 0} />
        </div>
        <div className={styles.cardContainerWrapper} style={{ zIndex: 3 }}>
          <ProjectCard project={PROJECTS[1]} index={1} cardRefProxy={card2Ref} isActive={activeIndex === 1} />
        </div>
        <div className={styles.cardContainerWrapper} style={{ zIndex: 4 }}>
          <ProjectCard project={PROJECTS[2]} index={2} cardRefProxy={card3Ref} isActive={activeIndex === 2} />
        </div>
      </div>
    </section>
  )
}
