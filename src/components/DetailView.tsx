'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import type { PostCard } from '@/lib/types'
import { asset } from '@/lib/asset'
import { DetailItem } from './DetailItem'
import { playClick, playHover } from '@/lib/sounds'

interface StageConfig { name: string; description: string }
interface Props {
  stage: string
  config: StageConfig
  posts: PostCard[]
  onBack: () => void
}

const EASE_DROP = [0.16, 1, 0.3, 1] as const

// Stacking collapse: cards 2,3,4 fly up to the position of card 1
function getCollapseTarget(idx: number) {
  if (idx === 0) return { opacity: 0, scale: 0.97, y: 0 }
  return {
    opacity: 0,
    scale: Math.max(0.95 - (idx - 1) * 0.02, 0.83),
    y: -(idx * 135),
  }
}

function getCollapseTransition(idx: number) {
  if (idx === 0) return { duration: 0.4, ease: EASE_DROP, delay: 0.15 }
  return { duration: 0.4, ease: EASE_DROP, delay: Math.min((idx - 1) * 0.05, 0.15) }
}

export function DetailView({ config, posts, onBack }: Props) {
  const [isCollapsing, setIsCollapsing] = useState(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const mountTime = useRef(Date.now())

  const handleBack = () => {
    if (isCollapsing) return
    setIsCollapsing(true)
    // Cards animate for 400ms; call onBack at 300ms so home crossfades in
    // while the last card is finishing — feels continuous rather than staged
    setTimeout(() => onBack(), 300)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
    if (dx > 64 && dy < 50) handleBack()
  }

  const reversed = [...posts].reverse()
  const sorted = [
    ...reversed.filter(p => p.is_featured),
    ...reversed.filter(p => !p.is_featured),
  ]

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ minHeight: '100dvh', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}
    >

      {/* ── HEADER ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '24px 34px 16px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E0E0E0',
      }}>
        <button
          onClick={() => { playClick(); handleBack() }}
          onMouseEnter={playHover}
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
      <div style={{ flex: 1, maxWidth: 430, width: '100%', margin: '0 auto', padding: '24px 28px 80px' }}>

        {posts.length === 0 && (
          <p style={{ fontFamily: 'var(--font-main)', fontSize: 13, color: '#888', textAlign: 'center', paddingTop: 40 }}>
            Belum ada info di kategori ini.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {sorted.flatMap((item, idx) => {
            const nodes = []

            // Divider between featured and non-featured groups
            if (idx > 0 && !item.is_featured && sorted[idx - 1].is_featured) {
              nodes.push(
                <div key={`divider-${idx}`} style={{ borderBottom: '1px solid #DDD', margin: '-4px 0' }} />
              )
            }

            nodes.push(
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -30, scale: 0.97 }}
                animate={
                  isCollapsing
                    ? getCollapseTarget(idx)
                    : { opacity: 1, y: 0, scale: 1 }
                }
                transition={
                  isCollapsing
                    ? getCollapseTransition(idx)
                    : { duration: 0.5, ease: EASE_DROP, delay: idx * 0.07 }
                }
              >
                <DetailItem item={item} typewriterStartAt={mountTime.current + Math.round((idx * 0.07 + 0.5) * 1000)} />
              </motion.div>
            )

            return nodes
          })}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0 48px', gap: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/assets/bts_logo.svg')} alt="BTS" style={{ width: 50, height: 68, objectFit: 'contain', opacity: 0.25 }} />
        <a
          href="https://trakteer.id/rememorari/tip"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={playHover}
          onClick={playClick}
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-main)', fontSize: 12, fontWeight: 700,
            color: '#000',
            backgroundImage: `url(${asset('/assets/tape.png')})`,
            backgroundSize: '100% 100%',
            padding: '12px 28px',
            textDecoration: 'none',
          }}
        >
          bisa traktir cendol ♡
        </a>
      </div>
    </div>
  )
}
