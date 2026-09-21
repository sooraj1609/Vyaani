'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'

type WishlistContextType = {
  wishlistIds: Set<string>
  toggleWishlist: (productId: string) => Promise<void>
  isWishlisted: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) {
      setWishlistIds(new Set())
      return
    }

    supabase
      .from('wishlist_items')
      .select('product_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) setWishlistIds(new Set(data.map((item) => item.product_id)))
      })
  }, [user])

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      alert('Please sign in to save items to your wishlist.')
      return
    }

    if (wishlistIds.has(productId)) {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      setWishlistIds((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    } else {
      await supabase.from('wishlist_items').insert({ user_id: user.id, product_id: productId })

      setWishlistIds((prev) => new Set(prev).add(productId))
    }
  }

  const isWishlisted = (productId: string) => wishlistIds.has(productId)

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}