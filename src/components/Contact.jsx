import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './Contact.module.css'

const ParticleCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    
    let particles = []
    const maxDist = 150

    class Particle {
      constructor() {
        this.x = Math.random() * w
        this.y = Math.random() * h
        this.vx = (Math.random() - 0.5) * 1.5
        this.vy = (Math.random() - 0.5) * 1.5
        this.radius = Math.random() * 2 + 1
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0 || this.x > w) this.vx *= -1
        if (this.y < 0 || this.y > h) this.vy *= -1
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(109, 237, 240, 0.4)'
        ctx.fill()
      }
    }

    for (let i = 0; i < 90; i++) particles.push(new Particle())

    let mouse = { x: -1000, y: -1000 }
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onMouseLeave = () => { mouse.x = -1000; mouse.y = -1000 }
    
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.update()
        p.draw()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < maxDist) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(109, 237, 240, ${0.4 * (1 - dist/maxDist)})`
            ctx.lineWidth = 1
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
        const dx = particles[i].x - mouse.x
        const dy = particles[i].y - mouse.y
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist < maxDist * 1.5) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(255, 0, 128, ${0.8 * (1 - dist/(maxDist*1.5))})`
          ctx.lineWidth = 1.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
          particles[i].x -= dx * 0.015
          particles[i].y -= dy * 0.015
        }
      }
      animationId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      const section = canvas.closest('#contact')
      if (section) h = canvas.height = section.clientHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.particleCanvas} />
}

export default function Contact() {
  const containerRef = useRef(null)
  const headingRef = useRef(null)
  
  const handleHeadingMouseMove = (e) => {
    if (!headingRef.current) return
    const rect = headingRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    headingRef.current.style.setProperty('--x', `${x}%`)
    headingRef.current.style.setProperty('--y', `${y}%`)
  }

  const createMagneticRef = () => {
    const ref = useRef(null)
    const handleMove = (e) => {
      const el = ref.current
      if(!el) return
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      gsap.to(el, { x: dx * 0.2, y: dy * 0.2, duration: 0.4, ease: 'power2.out' })
    }
    const handleLeave = () => {
      if(ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' })
    }
    return { ref, onMouseMove: handleMove, onMouseLeave: handleLeave }
  }

  const emailMagnetic = createMagneticRef()
  const linkedinMagnetic = createMagneticRef()

  return (
    <section id="contact" className={styles.contact} ref={containerRef}>
      <ParticleCanvas />
      <div className={styles.container}>
        <div className={styles.headingWrapper} onMouseMove={handleHeadingMouseMove}>
          <h2 ref={headingRef} className={styles.heading} data-text="GET IN TOUCH">
            GET IN TOUCH
          </h2>
        </div>
        
        <div className={styles.details}>
          <div className={styles.row}>
            <span className={styles.label}>Email</span>
            <div className={styles.magneticWrap} {...emailMagnetic}>
              <a ref={emailMagnetic.ref} href="mailto:phoenixshubham07@gmail.com" className={styles.value}>
                phoenixshubham07@gmail.com
                <div className={styles.underline}></div>
              </a>
            </div>
          </div>
          
          <div className={styles.row}>
            <span className={styles.label}>LinkedIn</span>
            <div className={styles.magneticWrap} {...linkedinMagnetic}>
              <a ref={linkedinMagnetic.ref} href="https://www.linkedin.com/in/shubham-barik/" target="_blank" rel="noopener noreferrer" className={styles.value}>
                shubham-barik
                <div className={styles.underline}></div>
              </a>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} Shubham Barik</p>
        </footer>
      </div>
    </section>
  )
}
