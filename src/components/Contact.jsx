import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './Contact.module.css'

export default function Contact() {
  const containerRef = useRef(null)

  return (
    <section id="contact" className={styles.contact} ref={containerRef}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Get in Touch</h2>
        
        <div className={styles.details}>
          <div className={styles.row}>
            <span className={styles.label}>Email</span>
            <a href="mailto:phoenixshubham07@gmail.com" className={styles.value}>
              phoenixshubham07@gmail.com
            </a>
          </div>
          
          <div className={styles.row}>
            <span className={styles.label}>Phone</span>
            <a href="tel:+919329189589" className={styles.value}>
              +91 9329189589
            </a>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} Shubham Barik</p>
          <p>Made with ❤️ in India</p>
        </footer>
      </div>
    </section>
  )
}
