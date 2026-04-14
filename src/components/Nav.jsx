import { useEffect, useRef } from 'react'
import Shuffle from './Shuffle'
import styles from './Nav.module.css'

export default function Nav() {
  const navRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (!navRef.current) return
      // Move nav to top-right once hero (100vh) is scrolled past
      if (window.scrollY > window.innerHeight * 0.85) {
        navRef.current.classList.add(styles.atTop)
      } else {
        navRef.current.classList.remove(styles.atTop)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav ref={navRef} className={styles.nav}>
      <a href="#hero">
        <Shuffle text="HOME" tag="span" />
      </a>
      <a href="#about">
        <Shuffle text="WORK" tag="span" />
      </a>
      <a href="#about">
        <Shuffle text="INFO" tag="span" />
      </a>
      <a href="#about">
        <Shuffle text="CONTACT" tag="span" />
      </a>
    </nav>
  )
}
