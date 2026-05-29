'use client'
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
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 340, damping: 28 } },
}

export function DetailView({ stage, config, posts, isPhoto, onBack }: Props) {
  // Newest first; featured always pinned to top
  const reversed = [...posts].reverse()
  const sorted = [
    ...reversed.filter(p => p.is_featured),
    ...reversed.filter(p => !p.is_featured),
  ]
  const [latest, ...rest] = sorted

  return (
    <div style={{ minHeight: '100dvh', background: '#F7F6F2', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER — Paper 4D-0: "← Category Name", 18px Bold ── */}
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
          <span style={{ fontFamily: '"Space Mono", monospace', fontWeight: 700, fontSize: 18, lineHeight: '22px', color: '#000000' }}>
            {config.name}
          </span>
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, maxWidth: 375, width: '100%', margin: '0 auto', padding: '24px 34px 80px', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Description box — Paper B2-0: 294×70, borderRadius:6px, 1px solid #000 */}
        <div style={{ borderRadius: 6, border: '1px solid #000000', padding: '9px 11px', marginBottom: 24, boxSizing: 'border-box' }}>
          <p style={{ fontFamily: '"Space Mono", monospace', fontWeight: 400, fontSize: 12, lineHeight: '16px', color: '#000000', margin: 0, whiteSpace: 'pre-wrap' }}>
            {config.description}
          </p>
        </div>

        {posts.length === 0 && (
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 11, color: '#888', textAlign: 'center', paddingTop: 40 }}>
            Belum ada info di kategori ini.
          </p>
        )}

        {/* Top card — shared layoutId from CardStack */}
        {latest && (
          <motion.div
            layoutId={`card-top-${stage}`}
            style={{ border: '1px solid #FB304C', background: '#FFFFFF', borderRadius: 6, overflow: 'hidden', marginBottom: 16, boxShadow: '3px 6px 9px rgba(0,0,0,0.20)', boxSizing: 'border-box' }}
          >
            <TopCard item={latest} isPhoto={isPhoto} />
          </motion.div>
        )}

        {/* Rest of items — staggered */}
        {rest.length > 0 && (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <p style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, fontWeight: 700, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', paddingBottom: 6, borderBottom: '1px solid #DDD', marginBottom: 0 }}>
              Info Sebelumnya
            </p>
            {rest.map(item => (
              <motion.div key={item.id} variants={itemVariants}>
                <DetailItem item={item} isPhoto={isPhoto} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── FOOTER — BTS logo at 0.25 opacity ── */}
      <div style={{ background: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0 48px', opacity: 0.25 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/assets/bts_logo.svg')} alt="BTS" style={{ width: 50, height: 68, objectFit: 'contain' }} />
      </div>
    </div>
  )
}
