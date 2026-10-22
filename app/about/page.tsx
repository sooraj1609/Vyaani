import styles from '../returns/returns.module.css'

export default function AboutPage() {
  return (
    <div className={styles.wrapper}>
      <h1>Our Story</h1>

      <section>
        <p>
          Vyaani Accessories is built around a simple idea: tradition, wrapped around time.
          We design fast-fashion jewellery that carries the richness of classic Indian craft
          into pieces you can wear every day.
        </p>
      </section>

      <section>
        <h2>Follow Us</h2>
        <p>
          See our latest pieces on{' '}
          <a
            href="https://www.instagram.com/vyaani_accessories"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          .
        </p>
      </section>
    </div>
  )
}