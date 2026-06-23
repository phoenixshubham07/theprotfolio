import { useEffect, useRef, useState } from 'react'
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
    hideIframeOnHover: true,
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

  // Track mobile layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Reset iframeLoaded state when card becomes inactive
  useEffect(() => {
    if (!isActive) {
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

  // Mouse tilt parallax effect for interactive 3D feel
  const handleMouseMove = (e) => {
    if (isMobile || project.staticOnly) return
    const card = cardRef.current
    if (!card || !isActive) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    // Normalize coordinates to a range of -1 to 1
    const xPct = x / (rect.width / 2)
    const yPct = y / (rect.height / 2)

    // Calculate rotation (max 8deg tilt) and slight translation for depth
    const tiltX = -yPct * 8
    const tiltY = xPct * 8

    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1200,
      z: 30,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
      force3D: true
    })
  }

  const handleMouseLeave = () => {
    if (isMobile || project.staticOnly) return
    const card = cardRef.current
    if (!card) return

    // Smoothly reset tilt values
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
      force3D: true
    })
  }

  // Click to redirect
  const handleClick = () => {
    window.open(project.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div ref={wrapperRef} className={`${styles.projectWrapper} ${!isActive ? styles.inactiveCardWrapper : ''}`}>
      
      {/* Main Card Area with 3D Tilt Events */}
      <div 
        ref={cardRef}
        className={styles.card3d}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
              {isActive && !project.staticOnly && (
                <iframe 
                  src={project.url}
                  className={`${styles.iframe} ${iframeLoaded ? styles.iframeLoaded : ''} ${project.hideIframeOnHover ? styles.hideOnHover : ''}`}
                  style={{ pointerEvents: 'none' }}
                  tabIndex={-1}
                  title={`${project.name} Live Preview`}
                  onLoad={() => setIframeLoaded(true)}
                />
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
  const trackRef = useRef(null)
  const introRef = useRef(null)
  const logoSeqRef = useRef(null)
  const introTitleRef = useRef(null)
  const introSubtitleRef = useRef(null)
  const ambientBgRef = useRef(null)
  const wheelOverlayRef = useRef(null)
  const cardsContainerRef = useRef(null)
  const blob1Ref = useRef(null)
  const blob2Ref = useRef(null)
  const blob3Ref = useRef(null)
  const gridRef = useRef(null)
  
  // Track which index is currently active to trigger iframe loading
  const [activeIndex, setActiveIndex] = useState(0)
  
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
      // Blur out about as Projects enters viewport
      const about = document.querySelector('#about')
      if (about) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top 20%',
          scrub: 1.2,
          onUpdate: self => {
            const blur = self.progress * 16
            about.style.filter = blur > 0 ? `blur(${blur}px)` : ''
          }
        })
      }
      const cards = cardRefs.current.filter(Boolean)
      if (cards.length === 0) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${(PROJECTS.length + 1) * 100}%`, // Extended to 500% of viewport (2 units intro, 3 units transitions)
          pin: true,
          scrub: 1.5,      // Smooth inertia catch-up
          onUpdate: (self) => {
            const prog = self.progress
            const t = prog * (PROJECTS.length + 1)
            let index = Math.round(t - 2)
            index = Math.max(0, Math.min(PROJECTS.length - 1, index))
            setActiveIndex(index)
          }
        }
      })

      // Initially, ambient background starts black
      gsap.set(ambientBgRef.current, { opacity: 0 })

      // Initially, hide 3D carousel elements completely
      gsap.set([cardsContainerRef.current, wheelOverlayRef.current], { opacity: 0, visibility: 'hidden' })

      // Abstract living background initial state & scroll movement (time 0 to 5)
      gsap.set([blob1Ref.current, blob2Ref.current, blob3Ref.current], { xPercent: 0, yPercent: 0 })
      gsap.set(gridRef.current, { rotation: 0, scale: 1 })

      tl.to(blob1Ref.current, {
        x: '30vw',
        y: '20vh',
        scale: 1.25,
        opacity: 0.22,
        duration: 5,
        ease: 'none'
      }, 0)

      tl.to(blob2Ref.current, {
        x: '-25vw',
        y: '-30vh',
        scale: 1.15,
        opacity: 0.18,
        duration: 5,
        ease: 'none'
      }, 0)

      tl.to(blob3Ref.current, {
        x: '-15vw',
        y: '15vh',
        scale: 1.3,
        opacity: 0.22,
        duration: 5,
        ease: 'none'
      }, 0)

      tl.to(gridRef.current, {
        scale: 1.15,
        rotation: 12,
        duration: 5,
        ease: 'none'
      }, 0)

      // Animate ambient background to fade in as card 0 prepares to enter (from t=1.7 to t=2.1)
      tl.to(ambientBgRef.current, {
        opacity: 1,
        ease: 'power2.inOut',
        duration: 0.4
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

      // 4. Fade out the entire Intro, Fade in 3D carousel elements (time 1.7 to 2.1)
      tl.to(introRef.current, {
        opacity: 0,
        filter: 'blur(20px)',
        scale: 0.95,
        ease: 'power2.inOut',
        duration: 0.4
      }, 1.7)

      tl.to([cardsContainerRef.current, wheelOverlayRef.current], {
        opacity: 1,
        visibility: 'visible',
        ease: 'power2.inOut',
        duration: 0.4
      }, 1.7)

      // Eased spiral snap scroll progress
      tl.fromTo(trackRef.current, 
        { '--scroll-progress': -0.6 },
        {
          '--scroll-progress': 0,
          ease: 'power2.inOut',
          duration: 0.4
        }, 
        1.7
      )

      // Preset initial states of cards
      cards.forEach((card, idx) => {
        gsap.set(card, { opacity: idx === 0 ? 0 : 0.15 })
      })

      // Fade in Card 0 inside the container
      tl.to(cards[0], {
        opacity: 1,
        ease: 'power2.inOut',
        duration: 0.4
      }, 1.7)

      // Focus wheel item 0
      const wheelItems = wheelRef.current ? wheelRef.current.children : []
      if (wheelItems.length > 0) {
        gsap.set(wheelItems, { opacity: 0.3, scale: 0.8 })
        tl.fromTo(wheelItems[0],
          { opacity: 0.3, scale: 0.8 },
          { opacity: 1, scale: 1, ease: 'power2.inOut', duration: 0.4 },
          1.7
        )
      }

      // Build sequential transitions for card snaps (t=2 to t=5)
      for (let i = 0; i < cards.length - 1; i++) {
        const currentCard = cards[i]
        const nextCard = cards[i + 1]
        const startTime = i + 2 // Shift start times by 2 units for the extended intro

        // Eased track scroll progress from card i to card i+1
        tl.to(trackRef.current, {
          '--scroll-progress': i + 1,
          ease: 'power2.inOut',
          duration: 1
        }, startTime)

        // Fade out current card to background opacity
        tl.to(currentCard, {
          opacity: 0.15,
          ease: 'power2.inOut',
          duration: 1
        }, startTime)

        // Fade in next card
        tl.to(nextCard, {
          opacity: 1,
          ease: 'power2.inOut',
          duration: 1
        }, startTime)

        // Synchronize wheel overlay title translations
        tl.to(wheelRef.current, {
          yPercent: - (i + 1) * (100 / PROJECTS.length),
          ease: 'power2.inOut',
          duration: 1
        }, startTime)

        // Animate wheel items focus states
        if (wheelItems.length > 0) {
          tl.to(wheelItems[i], {
            opacity: 0.3,
            scale: 0.8,
            ease: 'power2.inOut',
            duration: 1
          }, startTime)

          tl.to(wheelItems[i + 1], {
            opacity: 1,
            scale: 1,
            ease: 'power2.inOut',
            duration: 1
          }, startTime)
        }
      }

      // Trailing ease buffer
      tl.to({}, { duration: 0.15 }) 
      
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className={styles.sectionPinned}>
      
      {/* Abstract Living Background */}
      <div className={styles.abstractBg}>
        <div ref={blob1Ref} className={`${styles.blob} ${styles.blobCrimson}`} />
        <div ref={blob2Ref} className={`${styles.blob} ${styles.blobOrange}`} />
        <div ref={blob3Ref} className={`${styles.blob} ${styles.blobGold}`} />
        <div ref={gridRef} className={styles.gridOverlay} />
        <div className={styles.abstractOverlayGlow} />
      </div>

      {/* Dynamic Ambient Background Glow */}
      <div ref={ambientBgRef} className={styles.projectAmbientBg}>
        {PROJECTS.map((project, idx) => {
          const isActiveBg = activeIndex === idx
          return (
            <div 
              key={`bg-${project.id}`} 
              className={`${styles.ambientBgItem} ${isActiveBg ? styles.ambientBgActive : ''}`}
            >
              {isActiveBg && (
                <img 
                  src={project.image}
                  className={styles.ambientImage}
                  alt=""
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
    </section>
  )
}
