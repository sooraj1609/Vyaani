import styles from './Newsletter.module.css'

export default function Newsletter() {
  return (
    <section className={styles.newsletter}>
      <h2>Join the Vyaani circle</h2>
      <p>Be the first to know about new drops and exclusive offers</p>
      <div className={styles.form}>
        <input type="email" placeholder="Your email address" />
        <button>Subscribe</button>
      </div>
    </section>
  )
}