import { useRef } from 'react'
import styles from './TechStack.module.css'

const DEPLOYMENT = [
  { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/white' },
  { name: 'Railway', icon: 'https://cdn.simpleicons.org/railway/white' },
  { name: 'Hugging Face', icon: 'https://cdn.simpleicons.org/huggingface/white' },
  { name: 'AWS', icon: 'https://cdn.simpleicons.org/amazonaws/white' },
  { name: 'Google Cloud', icon: 'https://cdn.simpleicons.org/googlecloud/white' },
  { name: 'Cloudflare', icon: 'https://cdn.simpleicons.org/cloudflare/white' }
]
const FRONTEND = [
  { name: 'React', icon: 'https://cdn.simpleicons.org/react/white' },
  { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/white' },
  { name: 'Three.js', icon: 'https://cdn.simpleicons.org/threedotjs/white' },
  { name: 'GSAP', icon: 'https://cdn.simpleicons.org/greensock/white' },
  { name: 'Tailwind', icon: 'https://cdn.simpleicons.org/tailwindcss/white' },
  { name: 'Framer', icon: 'https://cdn.simpleicons.org/framer/white' }
]
const BACKEND = [
  { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/white' },
  { name: 'Python', icon: 'https://cdn.simpleicons.org/python/white' },
  { name: 'Flask', icon: 'https://cdn.simpleicons.org/flask/white' },
  { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/white' },
  { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/white' },
  { name: 'FastAPI', icon: 'https://cdn.simpleicons.org/fastapi/white' }
]

function Marquee({ items, direction = 'left', label }) {
  const containerClass = direction === 'left' ? styles.marqueeLeft : styles.marqueeRight;
  
  return (
    <div className={styles.marqueeRow}>
      <div className={styles.titleOverlay}>
        <span>{label}</span>
      </div>
      <div className={styles.marqueeContainer}>
        <div className={containerClass}>
          {items.map((item, i) => (
            <div key={i} className={styles.item}>
              {item.icon ? (
                <img 
                  src={item.icon} 
                  alt={item.name} 
                  className={styles.iconOnly} 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span className={item.icon ? styles.textHidden : styles.textVisible}>{item.name}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {items.map((item, i) => (
            <div key={`dup-${i}`} className={styles.item}>
              {item.icon ? (
                <img 
                  src={item.icon} 
                  alt={item.name} 
                  className={styles.iconOnly}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span className={item.icon ? styles.textHidden : styles.textVisible}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TechStack() {
  return (
    <section className={styles.techSection}>
      <Marquee items={DEPLOYMENT} direction="left" label="Deployment" />
      <Marquee items={FRONTEND} direction="right" label="Frontend" />
      <Marquee items={BACKEND} direction="left" label="Backend" />
    </section>
  )
}
