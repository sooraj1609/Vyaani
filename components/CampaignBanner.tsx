import styles from './CampaignBanner.module.css'

export default function CampaignBanner() {
  return (
    <section className={styles.banner}>
      <div className={styles.placeholder}>Campaign banner image — 1400×600</div>
      <div className={styles.text}>
        <h3>Anti-Tarnish, Everyday Jewelry</h3>
        <p>Detailed · Delicate · Demifine</p>
      </div>
    </section>
  )
}