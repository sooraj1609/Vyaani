'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './Hero.module.css'

const slides = [
  {
    title: 'Ethnic Pieces',
    subtitle: 'for the modern Indian woman',
    cta: 'Shop Now',
    className: styles.s1,
  },
  {
    title: 'New Arrivals',
    subtitle: 'fresh drops, every week',
    cta: 'Explore',
    className: styles.s2,
  },
  {
    title: 'Festive Edit',
    subtitle: 'statement pieces for every celebration',
    cta: 'Discover',
    className: styles.s3,
  },
]

export default function Hero() {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
  }

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const goTo = (i: number) => {
    setIndex(i)
    resetTimer()
  }

  const next = () => goTo((index + 1) % slides.length)
  const prev = () => goTo((index - 1 + slides.length) % slides.length)

  return (
    <section className={styles.hero}>
      <div
        className={styles.track}
        style={{ transform: `translateX(-${index * (100 / slides.length)}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className={`${styles.slide} ${slide.className}`}>
            <div className={styles.placeholder}>Hero campaign image — 1600×900</div>
            <div className={styles.content}>
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <button className={styles.cta}>{slide.cta}</button>
            </div>
          </div>
        ))}
      </div>

      <button className={`${styles.arrow} ${styles.prev}`} onClick={prev} aria-label="Previous slide">
        ‹
      </button>
      <button className={`${styles.arrow} ${styles.next}`} onClick={next} aria-label="Next slide">
        ›
      </button>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === index ? styles.active : ''}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}