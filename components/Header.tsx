'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, User, ShoppingBag } from 'lucide-react'
import SidePanel from './SidePanel'
import SearchOverlay from './SearchOverlay'
import styles from './Header.module.css'
import { useCart } from '@/lib/CartContext'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'

export default function Header() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { openCart, totalItems } = useCart()
  const { user } = useAuth()

  return (
    <>
      <header className={styles.header}>
        <div className={styles.side}>
          <button
            className={styles.hamburger}
            onClick={() => setPanelOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <Link href="/" className={styles.logo}>
          <Image
            src="/logo-icon.png"
            alt="Vyaani Accessories"
            width={48}
            height={48}
            priority
          />
        </Link>

        <div className={`${styles.side} ${styles.right}`}>
          <button className={styles.iconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search size={20} strokeWidth={1.5} />
          </button>

          <Link href={user ? '/account' : '/account/login'} className={styles.iconBtn} aria-label="Account">
  <User size={20} strokeWidth={1.5} />
</Link>

          <button
            className={styles.iconBtn}
            aria-label="Cart"
            onClick={openCart}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />

            {totalItems > 0 && (
              <span className={styles.cartBadge}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <SidePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
      />

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  )
}