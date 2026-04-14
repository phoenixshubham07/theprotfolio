import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Initials from './components/Initials'
import Nav      from './components/Nav'
import Hero     from './components/Hero'
import About    from './components/About'
import Projects from './components/Projects'
import TechStack from './components/TechStack'
import Contact  from './components/Contact'
import HeroExperiment from './components/HeroExperiment'

gsap.registerPlugin(ScrollTrigger)

function Home() {
  return (
    <>
      <Initials />
      <Nav />
      <Hero />
      <About />
      <Projects />
      <TechStack />
      <Contact />
    </>
  )
}

export default function App() {
  useEffect(() => {
    // Lenis smooth scroll — buttery inertia
    const lenis = new Lenis({
      duration: 1.8,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.6, // Slower scrolling speed
      smoothWheel: true,
    })

    // Keep GSAP ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    const ticker = time => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(ticker)
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hero" element={<HeroExperiment />} />
      </Routes>
    </BrowserRouter>
  )
}

