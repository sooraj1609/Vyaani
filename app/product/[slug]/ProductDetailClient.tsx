'use client'

import { useState } from 'react'
import { useCart } from '@/lib/CartContext'
import styles from './product.module.css'

export default function ProductDetailClient({ product }: { product: any }) {
  const { addItem } = useCart()
  const images = [...(product.product_images || [])].sort(
    (a: any, b: any) => a.display_order - b.display_order
  )
  const variants = product.product_variants || []

  const [selectedImage, setSelectedImage] = useState(images[0]?.image_url || null)
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    if (!selectedVariant) return

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      variantName: selectedVariant.variant_name,
      price: product.price,
      image: selectedImage,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const outOfStock = selectedVariant && selectedVariant.stock_quantity <= 0

  return (
    <div className={styles.wrapper}>
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          {selectedImage ? (
            <img src={selectedImage} alt={product.name} />
          ) : (
            <span>No image yet</span>
          )}
        </div>
        {images.length > 1 && (
          <div className={styles.thumbs}>
            {images.map((img: any) => (
              <button
                key={img.image_url}
                className={`${styles.thumb} ${selectedImage === img.image_url ? styles.thumbActive : ''}`}
                onClick={() => setSelectedImage(img.image_url)}
              >
                <img src={img.image_url} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h1>{product.name}</h1>
        <p className={styles.price}>₹{product.price}</p>
        <p className={styles.description}>{product.description}</p>

        {variants.length > 1 && (
          <div className={styles.variantSection}>
            <span className={styles.variantLabel}>Select option</span>
            <div className={styles.variantOptions}>
              {variants.map((v: any) => (
                <button
                  key={v.id}
                  className={`${styles.variantBtn} ${selectedVariant?.id === v.id ? styles.variantSelected : ''}`}
                  onClick={() => setSelectedVariant(v)}
                  disabled={v.stock_quantity <= 0}
                >
                  {v.variant_name}
                  {v.stock_quantity <= 0 && ' (Out of stock)'}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className={styles.addToCartBtn}
          onClick={handleAddToCart}
          disabled={!selectedVariant || outOfStock}
        >
          {added ? 'Added ✓' : outOfStock ? 'Out of Stock' : 'Add to Bag'}
        </button>
      </div>
    </div>
  )
}