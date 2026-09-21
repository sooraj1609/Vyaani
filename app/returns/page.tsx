import styles from './returns.module.css'

export default function ReturnsPage() {
  return (
    <div className={styles.wrapper}>
      <h1>Returns & Exchange</h1>

      <section>
        <h2>Our Policy</h2>
        <p>
          We want you to love your Vyaani pieces. If something isn't right, we're happy to help
          with a return or exchange within 7 days of delivery.
        </p>
      </section>

      <section>
        <h2>Eligibility</h2>
        <ul>
          <li>Items must be unused, unworn, and in original packaging</li>
          <li>Request must be raised within 7 days of delivery</li>
          <li>Sale/clearance items are final sale and not eligible for return</li>
        </ul>
      </section>

      <section>
        <h2>How to Request a Return</h2>
        <p>
          Email us at <a href="mailto:help@vyaani.in">help@vyaani.in</a> with your Order ID and
          reason for return. We'll guide you through the next steps.
        </p>
      </section>
    </div>
  )
}