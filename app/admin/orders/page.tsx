
import Link from 'next/link'
import styles from '../products/products.module.css'
import { cookies } from 'next/headers'

export default async function AdminOrders() {
  let orders = []
  let error = null

  try {
    const cookieStore = await cookies()

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/orders`,
      {
        cache: 'no-store',
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch orders (${res.status})`)
    }

    const data = await res.json()
    orders = data.orders ?? []
    error = data.error ?? null
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : 'An unexpected error occurred'
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Orders</h1>
      </div>

      {error && (
        <p className={styles.error}>
          Error loading orders: {error}
        </p>
      )}

      {!error && (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order: any) => {
                const itemCount =
                  order.order_items?.reduce(
                    (sum: number, item: any) =>
                      sum + item.quantity,
                    0
                  ) ?? 0

                return (
                  <tr key={order.id}>
                    <td>
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td>{order.customer_name}</td>
                    <td>
                      {itemCount} item
                      {itemCount !== 1 ? 's' : ''}
                    </td>
                    <td>
                      ₹
                      {Number(order.total_amount).toLocaleString(
                        'en-IN'
                      )}
                    </td>
                    <td>
                      <span
                        className={
                          order.status === 'paid'
                            ? styles.active
                            : styles.inactive
                        }
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {new Date(
                        order.created_at
                      ).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className={styles.editLink}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className={styles.empty}>No orders yet.</p>
          )}
        </>
      )}
    </div>
  )
}
