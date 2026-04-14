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
    tech: ['React', 'Python', 'ML', 'HuggingFace']
  },
  {
    id: 2,
    name: 'Synthrox.io',
    url: 'https://syntrox.io',
    desc: 'An interactive 3D web experience focusing on innovative design and seamless navigation.',
    tech: ['React', 'Three.js', 'GSAP', 'WebGL']
  },
  {
    id: 3,
    name: 'Algoclash.in',
    url: 'https://algoclash.in',
    desc: 'A competitive programming platform offering real-time coding battles and algorithm challenges.',
    tech: ['Next.js', 'Node.js', 'WebSockets', 'Python']
  }
]

function ProjectCard({ project, index, cardRefProxy }) {
  const cardRef = useRef(null)
  const cursorRef = useRef(null)
  const iframeRef = useRef(null)
  
  const [isInteractive, setIsInteractive] = useState(false)

  // Pass ref upwards for the master timeline overlay
  useEffect(() => {
    if (cardRefProxy) cardRefProxy.current = cardRef.current
  }, [cardRefProxy])

  // 3D Parallax Hover Effect
  const handleMouseMove = (e) => {
    if (!cardRef.current || isInteractive) return

    const { left, top, width, height } = cardRef.current.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top
    
    // Calculate rotation limits (-10 to 10 degrees)
    const rotateX = ((y / height) - 0.5) * -15
    const rotateY = ((x / width) - 0.5) * 15

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1200
    })
  }

  const handleMouseEnter = () => {
    // No-op
  }

  const handleMouseLeave = () => {
    if (isInteractive) return
    // Reset rotations
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
  }

  // Click to interact with the iframe
  const enableInteraction = () => {
    setIsInteractive(true)
    // Reset 3D tilt
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.5 })
  }

  return (
    <div className={styles.projectWrapper}>
      
      {/* Main 3D Card Area */}
      <div 
        ref={cardRef}
        className={`${styles.card3d} ${isInteractive ? styles.interactiveMode : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        
        {/* Iframe Preview Container */}
        <div className={styles.previewContainer}>
          <div className={styles.browserHeader}>
            <div className={styles.browserDots} />
            <div className={styles.browserUrl}>{project.url.replace('https://', '')}</div>
          </div>
          
          <iframe 
            ref={iframeRef}
            src={project.url}
            className={styles.iframe}
            style={{ pointerEvents: isInteractive ? 'auto' : 'none' }}
            tabIndex={-1}
            title={`${project.name} Live Preview`}
          />

          {!isInteractive && (
            <div className={styles.interactionOverlay} onClick={enableInteraction} />
          )}
        </div>

      </div>
    </div>
  )
}


export default function Projects() {
  const sectionRef = useRef(null)
  
  // Refs for our manual overlay tracking
  const wheelRef = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)
  const card3Ref = useRef(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%', // the scrolling distance
          pin: true,
          scrub: 1
        }
      })

      // We have 3 states (0%, 33.33%, 66.66% visible for titles)
      // CARD 1 -> EXIT (Ingredio)
      tl.to(card1Ref.current, {
        y: '-100%', 
        z: -1200,
        rotationX: -15,
        opacity: 0,
        filter: 'blur(20px)',
        ease: 'power2.inOut'
      }, 0.5)
      
      // SYNC TITLE 1 -> 2
      tl.to(wheelRef.current, {
        yPercent: -33.33,
        ease: 'power2.inOut'
      }, 0.5)

      // CARD 2 -> ENTER (Synthrox)
      tl.fromTo(card2Ref.current, 
        { y: '100%', z: 1200, rotationX: 15, opacity: 0 },
        { y: 0, z: 0, rotationX: 0, opacity: 1, ease: 'power2.inOut' },
        0.5
      )

      // CARD 2 -> EXIT
      tl.to(card2Ref.current, {
        y: '-100%',
        z: -1200,
        rotationX: -15,
        opacity: 0,
        filter: 'blur(20px)',
        ease: 'power2.inOut'
      }, 1.5)

      // SYNC TITLE 2 -> 3
      tl.to(wheelRef.current, {
        yPercent: -66.66,
        ease: 'power2.inOut'
      }, 1.5)

      // CARD 3 -> ENTER (Algoclash)
      tl.fromTo(card3Ref.current, 
        { y: '100%', z: 1200, rotationX: 15, opacity: 0 },
        { y: 0, z: 0, rotationX: 0, opacity: 1, ease: 'power2.inOut' },
        1.5
      )

      // WAIT FOR INTERACTION -> Adds stability before scrolling to next section
      tl.to({}, { duration: 1.5 }) 
      
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
            <div className={styles.wheelItem}>SYNTHROX.IO</div>
            <div className={styles.wheelItem}>ALGOCLASH.IN</div>
          </div>
        </div>
      </div>

      <div className={styles.projectsListPinned}>
        <div className={styles.cardContainerWrapper} style={{ zIndex: 2 }}>
          <ProjectCard project={PROJECTS[0]} index={0} cardRefProxy={card1Ref} />
        </div>
        <div className={styles.cardContainerWrapper} style={{ zIndex: 3 }}>
          <ProjectCard project={PROJECTS[1]} index={1} cardRefProxy={card2Ref} />
        </div>
        <div className={styles.cardContainerWrapper} style={{ zIndex: 4 }}>
          <ProjectCard project={PROJECTS[2]} index={2} cardRefProxy={card3Ref} />
        </div>
      </div>
    </section>
  )
}
