'use client'

import { useCart } from '@/lib/CartContext'
import styles from './CartDrawer.module.css'
import Link from 'next/link'


export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart()

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={closeCart}
      />
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Your Bag</h2>
          <button onClick={closeCart} className={styles.closeBtn}>×</button>
        </div>

        {items.length === 0 ? (
          <p className={styles.empty}>Your bag is empty</p>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.variantId} className={styles.item}>
                  <div className={styles.itemImage}>
                    {item.image ? <img src={item.image} alt={item.name} /> : 'No image'}
                  </div>
                  <div className={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    <p className={styles.variant}>{item.variantName}</p>
                    <div className={styles.qtyRow}>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <span className={styles.price}>₹{item.price * item.quantity}</span>
                    <button onClick={() => removeItem(item.variantId)} className={styles.remove}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <Link href="/checkout" className={styles.checkoutBtn} onClick={closeCart}>Checkout</Link>
            </div>
            <Link href="/cart" className={styles.viewFullLink} onClick={closeCart}>
  View Full Bag
</Link>
          </>
        )}
      </div>
    </>
  )
}