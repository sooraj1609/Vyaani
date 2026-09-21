'use client'

import { useState } from 'react'
import styles from './contact.module.css'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, opens the user's email client with prefilled content
    window.location.href = `mailto:help@vyaani.in?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`
    setSent(true)
  }

  return (
    <div className={styles.wrapper}>
      <h1>Contact Us</h1>
      <p className={styles.intro}>We'd love to hear from you. Reach out anytime.</p>

      <div className={styles.info}>
        <p><strong>Email:</strong> help@vyaani.in</p>
        <p><strong>Instagram:</strong> @vyaani_accessories</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Message
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required />
        </label>
        <button type="submit">Send Message</button>
        {sent && <p className={styles.sentNote}>Opening your email client...</p>}
      </form>
    </div>
  )
}