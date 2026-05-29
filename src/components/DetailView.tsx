'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import type { PostCard } from '@/lib/types'
import { asset } from '@/lib/asset'
import { DetailItem } from './DetailItem'
import { TopCard } from './TopCard'

interface StageConfig { name: string; description: string }
interface Props {
  stage: string
  config: StageConfig
  posts: PostCard[]
  isPhoto: boolean
  onBack: () => void
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 320, damping: 26 } },
}

export function DetailView({ stage, config, posts, onBack }: Props) {
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
    if (dx > 64 && dy < 50) onBack()
  }

  // Newest first; featured always pinned to top
  const reversed = [...posts].reverse()
  const sorted = [
    ...reversed.filter(p => p.is_featured),
    ...reversed.filter(p => !p.is_featured),
  ]
  const [latest, ...rest] = sorted

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ minHeight: '100dvh', background: '#F7F6F2', display: 'flex', flexDirection: 'column' }}
    >

      {/* ── HEADER ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '24px 34px 16px',
        background: '#F7F6F2',
        borderBottom: '1px solid #E0E0E0',
      }}>
        <button
          onClick={onBack}
          aria-label="Kembali"
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 20, lineHeight: '24px', color: '#000' }}>
            {config.name}
          </span>
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, maxWidth: 430, width: '100%', margin: '0 auto', padding: '24px 28px 80px', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Description box */}
        <div style={{ borderRadius: 6, border: '1px solid #000', padding: '10px 13px', marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-main)', fontWeight: 400, fontSize: 13, lineHeight: '18px', color: '#000', margin: 0, whiteSpace: 'pre-wrap' }}>
            {config.description}
          </p>
        </div>

        {posts.length === 0 && (
          <p style={{ fontFamily: 'var(--font-main)', fontSize: 13, color: '#888', textAlign: 'center', paddingTop: 40 }}>
            Belum ada info di kategori ini.
          </p>
        )}

        {/* Top card — shared layoutId from CardStack */}
        {latest && (
          <motion.div
            layoutId={`card-top-${stage}`}
            style={{ border: '1px solid #FB304C', background: '#FFFFFF', borderRadius: 6, overflow: 'hidden', marginBottom: 20, boxShadow: '3px 6px 9px rgba(0,0,0,0.20)', boxSizing: 'border-box' }}
          >
            <TopCard item={latest} />
          </motion.div>
        )}

        {/* Rest — staggered top-to-bottom */}
        {rest.length > 0 && (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <p style={{ fontFamily: 'var(--font-main)', fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', paddingBottom: 8, borderBottom: '1px solid #DDD', marginBottom: 0 }}>
              Info Sebelumnya
            </p>
            {rest.map(item => (
              <motion.div key={item.id} variants={itemVariants}>
                <DetailItem item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: '#F7F6F2', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0 48px', gap: 16 }}>
        <img src={asset('/assets/bts_logo.svg')} alt="BTS" style={{ width: 50, height: 68, objectFit: 'contain', opacity: 0.25 }} />
        <a
          href="https://trakteer.id/rememorari/tip"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: 'var(--font-main)', fontSize: 12, color: 'rgb(251, 48, 76)', textDecoration: 'underline' }}
        >
          bisa traktir cendol ♡
        </a>
      </div>
    </div>
  )
}
