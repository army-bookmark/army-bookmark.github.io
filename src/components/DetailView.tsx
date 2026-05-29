'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import type { PostCard } from '@/lib/types'
import { asset } from '@/lib/asset'
import { DetailItem } from './DetailItem'

interface StageConfig { name: string; description: string }
interface Props {
  stage: string
  config: StageConfig
  posts: PostCard[]
  onBack: () => void
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0 } },
}
const EASE_DROP = [0.16, 1, 0.3, 1] as const

const itemVariants = {
  hidden: { opacity: 0, y: -40, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: EASE_DROP },
  },
}

export function DetailView({ config, posts, onBack }: Props) {
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

  const reversed = [...posts].reverse()
  const sorted = [
    ...reversed.filter(p => p.is_featured),
    ...reversed.filter(p => !p.is_featured),
  ]
  const featuredPosts = sorted.filter(p => p.is_featured)
  const otherPosts = sorted.filter(p => !p.is_featured)

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

        {posts.length === 0 && (
          <p style={{ fontFamily: 'var(--font-main)', fontSize: 13, color: '#888', textAlign: 'center', paddingTop: 40 }}>
            Belum ada info di kategori ini.
          </p>
        )}

        {/* Featured cards — stagger drop-in from top */}
        {featuredPosts.length > 0 && (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {featuredPosts.map(item => (
              <motion.div key={item.id} variants={itemVariants}>
                <DetailItem item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Divider: no label, just the border */}
        {featuredPosts.length > 0 && otherPosts.length > 0 && (
          <div style={{ borderBottom: '1px solid #DDD', margin: '20px 0' }} />
        )}

        {/* Other cards — stagger drop-in from top */}
        {otherPosts.length > 0 && (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {otherPosts.map(item => (
              <motion.div key={item.id} variants={itemVariants}>
                <DetailItem item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: '#F7F6F2', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0 48px', gap: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/assets/bts_logo.svg')} alt="BTS" style={{ width: 50, height: 68, objectFit: 'contain', opacity: 0.25 }} />
        <a
          href="https://trakteer.id/rememorari/tip"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-main)', fontSize: 12,
            color: '#000',
            background: 'rgb(251, 48, 76)',
            padding: '5px 12px',
            textDecoration: 'none',
          }}
        >
          bisa traktir cendol ♡
        </a>
      </div>
    </div>
  )
}
