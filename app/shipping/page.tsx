import styles from '../returns/returns.module.css'

export default function ShippingPage() {
  return (
    <div className={styles.wrapper}>
      <h1>Shipping Information</h1>

      <section>
        <h2>Shipping Charges</h2>
        <p>Free shipping on all orders above ₹999.</p>
      </section>

      <section>
        <h2>Tracking Your Order</h2>
        <p>
          Once your order ships, we'll email you the courier name and tracking number. You can
          also check your order anytime on our <a href="/track-order">Track Order</a> page.
        </p>
      </section>
    </div>
  )
}