import { useEffect, useRef } from 'react'
import styles from './HeroExperiment.module.css'

export default function HeroExperiment() {
  const nameRef = useRef(null)

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

  return (
    <div className={styles.container}>
      <div ref={nameRef} className={styles.name} aria-label="Shubham Barik">
        <span className={styles.first}>Shubham&nbsp;</span>
        <span className={styles.last}>Barik</span>
      </div>
    </div>
  )
}
