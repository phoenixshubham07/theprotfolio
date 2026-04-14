import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollReveal from './ScrollReveal'
import Shuffle from './Shuffle'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const bioRef = useRef(null)
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const v1Ref = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const bio = bioRef.current
    const image = imageRef.current
    const v1Label = v1Ref.current

    if (!section || !bio || !image || !v1Label) return

    // Bio fades in and slides right
    gsap.set(bio, { opacity: 0, x: -40 })
    ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end:   'top 15%',
      scrub: 2,
      onUpdate: self => {
        gsap.set(bio, {
          opacity: self.progress,
          x: -40 + (self.progress * 40)
        })
      },
    })

    // Blur out hero as About enters viewport
    const hero = document.querySelector('#hero')
    if (hero) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 90%',
        end:   'top 10%',
        scrub: 1.2,
        onUpdate: self => {
          const blur = self.progress * 16
          hero.style.filter = blur > 0 ? `blur(${blur}px)` : ''
        },
      })
    }

    // Parallax effect for the image placeholder
    // It translates down (y: 120) while the page scrolls up, making it appear "slower"
    gsap.fromTo(image, 
      { y: -40 }, // Start slightly higher than normal
      {
        y: 160,   // End much lower
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom', // Start parallax when section enters bottom of viewport
          end: 'bottom top',   // End when section leaves top of viewport
          scrub: 1.2,          // Smooth catching-up feeling
        }
      }
    )

    // Delayed fade-in for the "V1.0" label
    gsap.fromTo(v1Label,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'center 40%', // Triggers very late, after all other text has scrolled in
          end: 'center 10%',   
          scrub: true
        }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section id="about" ref={sectionRef} className={styles.section}>

      {/* ── Full-width statement above the image ── */}
      <ScrollReveal
        enableBlur
        baseOpacity={0.05}
        baseRotation={1}
        blurStrength={6}
        containerClassName={styles.statementAbove}
        textClassName={styles.scrollRevealText}
        wordAnimationEnd="center center"
        italicWords={['architect', 'engineer']}
      >
        As a fullstack architect and engineer, I build digital experiences that connect,
      </ScrollReveal>

      {/* ── Image + rest of statement + bio ── */}
      <div className={styles.layout}>

        <div ref={imageRef} className={styles.imageCol}>
          <div className={styles.placeholder} />
        </div>

        <div className={styles.textCol}>
          <ScrollReveal
            enableBlur
            baseOpacity={0}
            baseRotation={0}
            blurStrength={11}
            containerClassName={styles.statementBelow}
            textClassName={styles.scrollRevealText}
            wordAnimationEnd="center center"
            italicWords={['scale', 'power', 'precision']}
          >
            scale with power and precision, and leave a mark in a fast-moving world.
          </ScrollReveal>

          <div ref={bioRef} className={styles.bio}>
            <p className={styles.bioLead}>My name is Shubham. I'm a passionate developer who bridges the gap between high-end design and robust backend logic, helping companies unlock their full potential with seamless, fullstack solutions.</p>
            <a href="#projects" className={styles.bioLink}>View Projects</a>
          </div>
        </div>

      </div>

      {/* Giant V1.0 Label at the bottom right */}
      <div ref={v1Ref} className={styles.v1Label} style={{ display: 'flex' }}>
        <span>V</span>
        <Shuffle
          text="1"
          tag="span"
          shuffleDirection="right"
          duration={0.35}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover={true}
          respectReducedMotion={true}
          loop={false}
          loopDelay={0}
        />
        <span>.</span>
        <Shuffle
          text="0"
          tag="span"
          shuffleDirection="right"
          duration={0.35}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover={true}
          respectReducedMotion={true}
          loop={false}
          loopDelay={0}
        />
      </div>
    </section>
  )
}
