import { supabase } from '@/lib/supabase'
import styles from './ComingSoonGate.module.css'

export default async function ComingSoonGate({ children }: { children: React.ReactNode }) {
  const { data: settings } = await supabase
    .from('site_settings')
    .select('coming_soon_mode')
    .eq('id', 1)
    .single()

  if (settings?.coming_soon_mode) {
    return (
      <div className={styles.hero}>
        <h1 className={styles.tagline}>Coming Soon</h1>
        <p className={styles.subtext}>
          Fast-fashion jewelry, crafted for the moment.
        </p>
      </div>
    )
  }

  return <>{children}</>
}