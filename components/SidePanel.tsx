'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import styles from './SidePanel.module.css'
import { useAuth } from '@/lib/AuthContext'

export default function SidePanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [catOpen, setCatOpen] = useState(false)
  const { user } = useAuth()
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data,error}) => {
          console.log('SidePanel categories fetch:', { data, error })

        if (data) setCategories(data)
      })
  }, [])

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={onClose}
      />
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.panelHeader}>
          <span className={styles.logo}>vyaani</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            ×
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.link} onClick={() => setCatOpen(!catOpen)}>
            <span>Shop by category</span>
            <span className={styles.chev}>{catOpen ? '⌃' : '⌄'}</span>
          </div>

          {catOpen && (
            <div className={styles.sub}>
              {categories.map((cat) => (
                <Link
                  href={`/category/${cat.slug}`}
                  key={cat.id}
                  className={styles.catRow}
                  onClick={onClose}
                >
                  <div className={styles.catThumb} />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          )}

          <Link href="/new" className={styles.link} onClick={onClose}>
          <span>New launch</span></Link>
          <Link href="/track-order" className={styles.link} onClick={onClose}>
          <span>Track order</span></Link>
          <Link href="/returns" className={styles.link} onClick={onClose}>
          <span>Returns and exchange</span></Link>
          <Link href="/contact" className={styles.link} onClick={onClose}>
          <span>Contact us</span></Link>
          <Link href={user ? '/account' : '/account/login'} className={styles.link} onClick={onClose}>
          <span>{user ? 'My Account' : 'Sign in'}</span></Link>
        </div>
        <div className={styles.footer}>help@vyaani.in</div>
      </div>
    </>
  )
}