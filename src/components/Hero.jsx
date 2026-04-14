import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Shuffle from './Shuffle'
import styles from './Hero.module.css'
import AsciiBackground from './AsciiBackground'

gsap.registerPlugin(ScrollTrigger)

// Live IST clock
function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      let h = ist.getHours()
      const m = String(ist.getMinutes()).padStart(2, '0')
      const ampm = h >= 12 ? 'PM' : 'AM'
      h = h % 12 || 12
      setTime(`${h}:${m} ${ampm}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* 
================================================================================
  🌌 [ ASCII FLASHLIGHT VIDEO BACKGROUND TOGGLE ] 🌌
================================================================================
  Hey! If you want your interactive 'Creation of Adam' ASCII video back:
  
  1. Simply change 'enableAsciiBackground' below from 'false' to 'true'.
  
  - When set to false: You get a clean black background.
  - When set to true:  You get the fully animated interactive ASCII art
                       with the flashlight reveal effect!
                       
  (Just flip this single switch, that's it!)
================================================================================
*/
const enableAsciiBackground = true;

export default function Hero() {
  const time      = useClock()
  const bgRef     = useRef(null)
  const contentRef = useRef(null)
  const nameRef   = useRef(null)

  // Fit hero name to exact viewport width
  useEffect(() => {
    const fit = () => {
      const el = nameRef.current
      if (!el) return
      el.style.fontSize = '10px'
      el.style.width = 'max-content'
      const w = el.getBoundingClientRect().width
      el.style.width = '100%'
      el.style.fontSize = (window.innerWidth / w * 10) + 'px'
    }
    document.fonts.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  // GSAP scroll blur: bg blurs, content fades as you scroll down
  useEffect(() => {
    const bg      = bgRef.current
    const content = contentRef.current
    if (!bg || !content) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    })

    tl.to(bg,      { filter: 'blur(18px)', scale: 1.05, ease: 'none' }, 0)
    tl.to(content, { opacity: 0, y: -30,                ease: 'none' }, 0)

    return () => tl.scrollTrigger?.kill()
  }, [])

  return (
    <section id="hero" className={styles.hero}>
      <div ref={bgRef} className={styles.bg}>
        {/* Render the ASCII background ONLY if the toggle switch above is set to 'true' */}
        {enableAsciiBackground && <AsciiBackground />}
      </div>

      <div ref={contentRef} className={styles.content}>
        <div className={styles.tagline}>
          <span><em>A Creative Partner</em> for companies and brands</span>
          <span>that decide to move forward.</span>
        </div>

        {/* 3-column bottom bar: location | socials (centred) | spacer */}
        <div className={styles.bar}>
          <span className={styles.location}>
            <Shuffle text="INDIA" tag="span" />&nbsp;{time}
          </span>

          <div className={styles.socials}>
            <a href="https://wa.me/" target="_blank" rel="noopener">
              <Shuffle text="WHATSAPP" tag="span" />
            </a>
            <span className={styles.sep}>/</span>
            <a href="https://linkedin.com/" target="_blank" rel="noopener">
              <Shuffle text="LINKED" tag="span" /><span className={styles.accent}><Shuffle text="IN" tag="span" /></span>
            </a>
          </div>

          <div className={styles.spacer} />
        </div>

        <div ref={nameRef} className={styles.name} aria-label="Shubham Barik">
          <span className={styles.first}>Shubham&nbsp;</span>
          <span className={styles.last}>Barik</span>
        </div>
      </div>
    </section>
  )
}
