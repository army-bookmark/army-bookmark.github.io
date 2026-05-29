'use client'

import { motion } from 'framer-motion'
import type { PostCard } from '@/lib/types'

const F = '"Space Mono", system-ui, monospace'
const ACCENT = '#FB304C'
const BG = '#F7F6F2'

const CATEGORY_LABELS: Record<string, string> = {
  persiapan: 'Persiapan Cari Tiket',
  tiket: '(Lagi) War Tiket',
  udah: 'Udah Dapet Tiket, terus?',
  hari_h: 'Hari-H Konser',
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function ThreadsIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 192 192" fill="currentColor">
      <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.195 47.292 9.642 32.788 28.08 19.882 44.485 13.224 67.315 13.001 96c.223 28.685 6.88 51.515 19.788 67.92 14.504 18.438 36.094 27.885 64.184 28.08h.113c25.395-.169 43.324-6.82 58.083-21.567 19.737-19.73 19.217-44.241 12.686-59.331-4.547-10.605-13.315-19.207-26.318-25.114z" />
    </svg>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ initials, size = 30 }: { initials: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: '#FCE7F3',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 9, lineHeight: '12px', color: '#9D174D' }}>
        {initials}
      </span>
    </div>
  )
}

// ─── Detail card ─────────────────────────────────────────────────────────────

interface DetailCardData {
  initials: string
  username: string
  handle?: string
  timestamp?: string
  source: 'x' | 'threads' | 'tiktok'
  text: string
  likes: string
  comments: string
  hasImage?: boolean
  shadow?: boolean
}

const cardVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.15 + i * 0.07, duration: 0.28, ease: 'easeOut' as const },
  }),
}

function DetailCard({ card, index }: { card: DetailCardData; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{
        background: '#FFFFFF',
        border: `1px solid ${ACCENT}`,
        borderRadius: 6,
        boxShadow: card.shadow !== false ? '3px 6px 9px rgba(0,0,0,0.2)' : 'none',
        padding: '10px 12px',
        display: 'flex', flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5, flexShrink: 0 }}>
        <Avatar initials={card.initials} size={30} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: F, fontWeight: 700,
            fontSize: 11, lineHeight: '14px', color: '#000',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {card.username}
          </div>
          <div style={{ fontFamily: F, fontWeight: 400, fontSize: 9, lineHeight: '12px', color: '#888888' }}>
            {card.handle ?? card.timestamp}
          </div>
        </div>
        <div style={{ color: '#000', flexShrink: 0, marginTop: 2 }}>
          {card.source === 'x' ? <XIcon /> : <ThreadsIcon />}
        </div>
      </div>

      <p style={{
        fontFamily: F, fontWeight: 400,
        fontSize: 10, lineHeight: '14px', color: '#444444',
        margin: '0 0 5px', whiteSpace: 'pre-wrap', flexShrink: 0,
      }}>
        {card.text}
      </p>

      {card.hasImage && (
        <div style={{ width: '100%', height: 84, background: '#DDDDDD', marginBottom: 6, flexShrink: 0 }} />
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        paddingTop: card.hasImage ? 6 : 5,
        borderTop: '1px solid #EEEEEE',
        marginTop: 'auto',
        fontFamily: F, fontSize: 9, lineHeight: '12px',
      }}>
        <span style={{ color: ACCENT }}>♥</span>
        <span style={{ color: '#888888' }}>{card.likes}</span>
        <span style={{ color: '#888888', marginLeft: 4 }}>{card.comments} comments</span>
      </div>
    </motion.div>
  )
}

// ─── Static fallback cards ────────────────────────────────────────────────────

const STATIC_CARDS: DetailCardData[] = [
  {
    initials: 'JA', username: 'jastipfeli', handle: '@whathefell', source: 'x',
    text: 'Tips atau cara yang biasa aku pake buat war di tikom tiket dot com Bisa dipake buat ticketing Babymonster...',
    likes: '4.5rb', comments: '71', shadow: true,
  },
  {
    initials: 'BF', username: 'BTS Fan ID', handle: '@btsfanid', source: 'x',
    text: 'Pastikan akun kamu di platform ticketing sudah VERIFIED ya. Proses verifikasi bisa 1-3 hari kerja. Jangan sampai telat daftar dan gagal war tiket cuma karena akun belum aktif 😅',
    likes: '4.5rb', comments: '71', shadow: true,
  },
  {
    initials: 'KB', username: 'kookies_bamm07', timestamp: '6 hari lalu', source: 'threads',
    text: 'I think Sophia is handling her bias staring right at her super well',
    likes: '11.4rb', comments: '55', hasImage: true, shadow: false,
  },
]

// ─── Main export ─────────────────────────────────────────────────────────────

interface DetailViewStaticProps {
  onBack?: () => void
  cards?: PostCard[]
  selectedCategory?: string
}

export function DetailViewStatic({ onBack, cards, selectedCategory = 'persiapan' }: DetailViewStaticProps) {
  const label = CATEGORY_LABELS[selectedCategory] ?? 'Persiapan Cari Tiket'

  const displayCards: DetailCardData[] = cards && cards.length > 0
    ? cards.map((c, i) => ({
        initials: c.initials,
        username: c.username,
        handle: c.handle,
        source: c.platform,
        text: c.caption,
        likes: '—', comments: '—',
        shadow: i === 0,
      }))
    : STATIC_CARDS

  return (
    <div style={{ width: '100%', maxWidth: 375, background: BG, fontFamily: F, minHeight: 745, position: 'relative' }}>

      <h1
        onClick={onBack}
        style={{
          position: 'absolute',
          top: 29, left: 34,
          fontFamily: F, fontWeight: 700,
          fontSize: 18, lineHeight: '22px',
          color: '#000', margin: 0,
          cursor: onBack ? 'pointer' : 'default',
        }}
      >
        ← {label}
      </h1>

      <div style={{ paddingTop: 79 }}>

        <div style={{
          margin: '0 34px 16px',
          border: '1px solid #000000',
          borderRadius: 6,
          padding: '10px 12px',
          background: '#FFFFFF',
          minHeight: 70,
          boxSizing: 'border-box',
        }}>
          <p style={{
            fontFamily: F, fontWeight: 400,
            fontSize: 12, lineHeight: '16px',
            color: '#000', margin: 0,
          }}>
            yang mau war sendiri bisa baca ini ya, mimin aja baru tau harus x,y,z yang disiapin
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 34px 32px' }}>
          {displayCards.map((card, i) => (
            <DetailCard key={i} card={card} index={i} />
          ))}
        </div>

      </div>
    </div>
  )
}
