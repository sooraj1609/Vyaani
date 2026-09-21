import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.col}>
          <h5>Shop</h5>
          <a>Earrings</a>
          <a>Necklaces</a>
          <a>Rings</a>
          <a>Bracelets</a>
          <a>Bracelet Watches</a>
        </div>
        <div className={styles.col}>
          <h5>Help</h5>
          <a>Track order</a>
          <a>Returns and exchange</a>
          <a>Shipping info</a>
          <a>Contact us</a>
        </div>
        <div className={styles.col}>
          <h5>About</h5>
          <a>Our story</a>
          <a>Instagram</a>
          <a>Reviews</a>
        </div>
        <div className={styles.col}>
          <h5>Newsletter</h5>
          <a>Sign up for offers</a>
          <a>help@vyaani.in</a>
        </div>
      </div>
      <div className={styles.bottom}>© 2026 Vyaani Accessories. All rights reserved.</div>
    </footer>
  )
}