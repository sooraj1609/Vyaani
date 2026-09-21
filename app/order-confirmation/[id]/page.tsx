import Link from 'next/link'
import styles from './confirmation.module.css'

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/order/${id}`, {
    cache: 'no-store',
  })
  const { order } = await res.json()

  if (!order) {
    return (
      <div className={styles.wrapper}>
        <p>Order not found.</p>
        <Link href="/" className={styles.homeLink}>Return home</Link>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.checkmark}>✓</div>
        <h1>Order Confirmed</h1>
        <p className={styles.subtext}>
          Thank you, {order.customer_name}! Your order has been placed successfully.
        </p>

        <div className={styles.orderInfo}>
          <div className={styles.row}>
            <span>Order ID</span>
            <span>{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className={styles.row}>
            <span>Status</span>
            <span className={styles.status}>{order.status}</span>
          </div>
          <div className={styles.row}>
            <span>Total</span>
            <span>₹{order.total_amount}</span>
          </div>
        </div>

        {order.tracking_number && (
          <div className={styles.trackingBox}>
            <p><strong>Courier:</strong> {order.courier_name || 'N/A'}</p>
            <p><strong>Tracking Number:</strong> {order.tracking_number}</p>
          </div>
        )}

        <div className={styles.items}>
          <h3>Items</h3>
          {order.order_items?.map((item: any) => (
            <div key={item.id} className={styles.itemRow}>
              <span>
                {item.product_variants?.products?.name} ({item.product_variants?.variant_name}) × {item.quantity}
              </span>
              <span>₹{item.price_at_purchase * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className={styles.shipping}>
          <h3>Shipping to</h3>
          <p>{order.shipping_address}</p>
          <p>{order.customer_phone} · {order.customer_email}</p>
        </div>

        <Link href="/" className={styles.homeLink}>
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}