'use client'

import { motion } from 'framer-motion'
import { Metaballs } from '@paper-design/shaders-react'
import type { PostCard } from '@/lib/types'

const F = '"Space Mono", system-ui, monospace'
const ACCENT = '#FB304C'
const BG = '#F7F6F2'

// ─── Icons ───────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function ThreadsIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 192 192" fill="currentColor">
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
      <span style={{
        fontFamily: F, fontWeight: 700,
        fontSize: size >= 30 ? 9 : 8,
        lineHeight: size >= 30 ? '12px' : '10px',
        color: '#9D174D',
      }}>
        {initials}
      </span>
    </div>
  )
}

// ─── Card content variants ────────────────────────────────────────────────────

interface CardData {
  initials: string
  username: string
  handle?: string
  timestamp?: string
  source: 'x' | 'threads'
  text: string
  likes: string
  comments: string
  hasImage?: boolean
}

function CardContent({ card, compact = true }: { card: CardData; compact?: boolean }) {
  const bodySize = compact ? 9 : 10
  const bodyLeading = compact ? '13px' : '14px'
  const metaSize = compact ? 8 : 9
  const metaLeading = compact ? '10px' : '12px'

  return (
    <div style={{
      padding: '10px 12px',
      display: 'flex', flexDirection: 'column',
      height: '100%', boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex', alignItems: compact ? 'center' : 'flex-start',
        gap: 8, marginBottom: compact ? 6 : 5, flexShrink: 0,
      }}>
        <Avatar initials={card.initials} size={compact ? 28 : 30} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: F, fontWeight: 700,
            fontSize: 9, lineHeight: '12px',
            color: '#000',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {card.username}
          </div>
          <div style={{ fontFamily: F, fontWeight: 400, fontSize: 8, lineHeight: '10px', color: '#888' }}>
            {card.handle ?? card.timestamp}
          </div>
        </div>
        <div style={{ color: '#000', flexShrink: 0, marginTop: 2 }}>
          {card.source === 'x' ? <XIcon /> : <ThreadsIcon />}
        </div>
      </div>

      <p style={{
        fontFamily: F, fontWeight: 400,
        fontSize: bodySize, lineHeight: bodyLeading,
        color: '#444444', margin: '0 0 5px',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: compact ? 2 : 3,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {card.text}
      </p>

      {card.hasImage && (
        <div style={{ width: '100%', height: 82, background: '#DDDDDD', flexShrink: 0, marginBottom: 5 }} />
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        paddingTop: compact ? 6 : 5,
        borderTop: '1px solid #EEEEEE',
        marginTop: 'auto',
        fontFamily: F, fontSize: metaSize, lineHeight: metaLeading,
      }}>
        <span style={{ color: ACCENT }}>♥</span>
        <span style={{ color: '#888888' }}>{card.likes}</span>
        <span style={{ color: '#888888', marginLeft: 4 }}>{card.comments} comments</span>
      </div>
    </div>
  )
}

// ─── Stacked card with hover jiggle ──────────────────────────────────────────

const jiggle = {
  rest: { rotate: 0 },
  hover: {
    rotate: [0, -1.5, 1.5, -0.8, 0.8, 0],
    transition: { duration: 0.45, ease: 'easeInOut' as const },
  },
}

function StackedCard({
  card, shadow = true, onClick,
}: { card: CardData; shadow?: boolean; onClick?: () => void }) {
  return (
    <motion.div
      variants={jiggle}
      initial="rest"
      whileHover="hover"
      onClick={onClick}
      style={{
        position: 'relative', width: 260, height: 158, flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{
        position: 'absolute', top: 16, left: 16,
        width: 238, height: 125,
        borderRadius: 6, border: `1px solid ${ACCENT}`,
        transform: 'rotate(2.2deg)', transformOrigin: '0 0',
      }} />
      <div style={{
        position: 'absolute', top: 8, left: 8,
        width: 238, height: 125,
        borderRadius: 6, border: `1px solid ${ACCENT}`, background: '#FFFFFF',
        transform: 'rotate(1.1deg)', transformOrigin: '0 0',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 238, height: 125,
        borderRadius: 6, border: `1px solid ${ACCENT}`, background: '#FFFFFF',
        boxShadow: shadow ? '3px 6px 9px rgba(0,0,0,0.2)' : 'none',
        overflow: 'hidden',
      }}>
        <CardContent card={card} compact={false} />
      </div>
    </motion.div>
  )
}

function PhotoCard({ card, onClick }: { card: CardData; onClick?: () => void }) {
  const cardH = 200
  return (
    <motion.div
      variants={jiggle}
      initial="rest"
      whileHover="hover"
      onClick={onClick}
      style={{
        position: 'relative', width: 260, height: cardH + 33, flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{
        position: 'absolute', top: 16, left: 16,
        width: 238, height: cardH,
        borderRadius: 6, border: `1px solid ${ACCENT}`,
        transform: 'rotate(2.2deg)', transformOrigin: '0 0',
      }} />
      <div style={{
        position: 'absolute', top: 8, left: 8,
        width: 238, height: cardH,
        borderRadius: 6, border: `1px solid ${ACCENT}`, background: '#FFFFFF',
        transform: 'rotate(1.1deg)', transformOrigin: '0 0',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 238, height: cardH,
        borderRadius: 6, border: `1px solid ${ACCENT}`, background: '#FFFFFF',
        boxShadow: '3px 6px 9px rgba(0,0,0,0.2)',
        overflow: 'hidden',
      }}>
        <CardContent card={{ ...card, hasImage: true }} compact={false} />
      </div>
    </motion.div>
  )
}

// ─── Tape helper ──────────────────────────────────────────────────────────────

function Tape({ src, style }: { src: 'red' | 'black'; style: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src === 'red' ? '/assets/red_tape.png' : '/assets/black_tape.png'}
      alt="" aria-hidden
      style={{ position: 'absolute', objectFit: 'cover', ...style }}
    />
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

type TitleDeco =
  | { type: 'underline'; left: number; width: number; rotate: number }
  | { type: 'tape'; left: number; top: number; width: number; height: number; rotate?: number }

function Section({
  title, description, deco, cardSlot, onSeeMore,
}: {
  title: React.ReactNode
  description: string
  deco: TitleDeco
  cardSlot: React.ReactNode
  onSeeMore?: () => void
}) {
  return (
    <div style={{ paddingTop: 28, paddingBottom: 8 }}>
      <div style={{ position: 'relative', marginLeft: 32, marginRight: 32, marginBottom: 4 }}>
        {deco.type === 'tape' && (
          <Tape src="red" style={{
            left: deco.left, top: deco.top,
            width: deco.width, height: deco.height,
            transform: deco.rotate ? `rotate(${deco.rotate}deg)` : undefined,
            transformOrigin: '0 0',
            zIndex: 1,
          }} />
        )}
        <h2 style={{
          fontFamily: F, fontWeight: 700,
          fontSize: 18, lineHeight: '22px',
          color: '#000', margin: 0,
          position: 'relative', zIndex: 2,
        }}>
          {title}
        </h2>
        {deco.type === 'underline' && (
          <div style={{
            position: 'absolute',
            left: deco.left, bottom: -1,
            width: deco.width, height: 2,
            background: ACCENT,
            transform: `rotate(${deco.rotate}deg)`,
            transformOrigin: '0 0',
            zIndex: 3,
          }} />
        )}
      </div>

      <p style={{
        fontFamily: F, fontWeight: 400,
        fontSize: 12, lineHeight: '16px', color: '#000',
        margin: '4px 32px 16px',
      }}>
        {description}
      </p>

      <div style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: 25 }}>
        {cardSlot}
        <div
          onClick={onSeeMore}
          style={{
            paddingLeft: 14, paddingTop: 50, flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            fontFamily: F, fontWeight: 700,
            fontSize: 10, lineHeight: '12px', color: ACCENT,
            cursor: onSeeMore ? 'pointer' : 'default',
          }}
        >
          <span>See More</span>
          <span>→</span>
        </div>
      </div>
    </div>
  )
}

// ─── Static fallback card data ────────────────────────────────────────────────

const FALLBACK: Record<string, CardData> = {
  persiapan: {
    initials: 'JA', username: 'jastipfeli', handle: '@whathefell', source: 'x',
    text: 'Tips atau cara yang biasa aku pake buat war di tikom tiket dot com Bisa dipake buat ticketing …',
    likes: '4.5rb', comments: '71',
  },
  tiket: {
    initials: 'KB', username: 'kookies_bamm07', timestamp: '8 hari lalu', source: 'threads',
    text: 'I think Sophia is handling her bias staring right at her super well',
    likes: '11.4rb', comments: '55',
  },
  udah: {
    initials: 'KB', username: 'kookies_bamm0', handle: '@whathefell', source: 'threads',
    text: 'Concert survival kit yang wajib dibawa: powerbank penuh, jas hujan kecil, earplug, KTP + tiket (prin…',
    likes: '4.5rb', comments: '71',
  },
  hari_h: {
    initials: 'KB', username: 'kookies_bamm07', timestamp: '8 hari lalu', source: 'threads',
    text: 'I think Sophia is handling her bias staring right at her super well',
    likes: '11.4rb', comments: '55',
  },
}

function cardFromPost(post: PostCard): CardData {
  return {
    initials: post.initials,
    username: post.username,
    handle: post.handle,
    source: post.platform,
    text: post.caption || post.username,
    likes: '—', comments: '—',
  }
}

function topCard(cards: PostCard[], category: string): CardData {
  const match = cards.find(c => c.category_tag === category)
  return match ? cardFromPost(match) : FALLBACK[category] ?? FALLBACK.persiapan
}

// ─── Main export ─────────────────────────────────────────────────────────────

interface HomeFeedStaticProps {
  cards?: PostCard[]
  onCategoryClick?: (category: string) => void
}

export function HomeFeedStatic({ cards = [], onCategoryClick }: HomeFeedStaticProps) {
  const nav = (cat: string) => onCategoryClick?.(cat)

  return (
    <div style={{ width: '100%', maxWidth: 375, background: BG, fontFamily: F }}>

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 228, overflow: 'visible' }}>

        {/* Metaballs animation — header background */}
        <Metaballs
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
          speed={1}
          count={10}
          size={0.07}
          scale={1.31}
          colors={['#000000']}
          colorBack="#00000000"
        />

        <Tape src="red" style={{ top: 16, left: 26, width: 81, height: 52, transform: 'rotate(0.32deg)', transformOrigin: '0 0', zIndex: 3 }} />
        <Tape src="red" style={{ top: 37, left: -10, width: 116, height: 52, transform: 'rotate(0.32deg)', transformOrigin: '0 0', zIndex: 3 }} />
        <Tape src="red" style={{ top: 53, left: 24, width: 85, height: 52, transform: 'rotate(0.32deg)', transformOrigin: '0 0', zIndex: 3 }} />

        <div style={{
          position: 'absolute', top: 36, left: 32, zIndex: 5,
          fontFamily: F, fontWeight: 700, fontSize: 20, lineHeight: '18px', color: '#000',
        }}>
          CURATED<br />CONTENT<br />CONCERT
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/army_logo.svg"
          alt="BTS ARMY"
          style={{ position: 'absolute', top: 37, left: 326, width: 27, height: 53, zIndex: 5 }}
        />

        <Tape src="black" style={{ top: 105, left: 11, width: 142, height: 59, zIndex: 4 }} />
        <Tape src="black" style={{ top: 127, left: 180, width: 142, height: 59, zIndex: 4 }} />

        <div style={{ position: 'absolute', top: 131, left: 29, width: 256, height: 16, background: '#000', zIndex: 5 }} />
        <div style={{ position: 'absolute', top: 148, left: 29, width: 247, height: 15, background: '#000', zIndex: 5 }} />
        <div style={{ position: 'absolute', top: 164, left: 29, width: 268, height: 15, background: '#000', zIndex: 5 }} />

        <div style={{
          position: 'absolute', top: 130, left: 35, width: 270, zIndex: 6,
          fontFamily: F, fontWeight: 400, fontSize: 12, lineHeight: '16px',
          color: '#FFFFFF', whiteSpace: 'pre-wrap',
        }}>
          {`Kami udah kurasi info konser dari\nbanyak sumber gais, we're not\nofficial please alwyz double check♡`}
        </div>
      </div>

      {/* ── CATEGORY SECTIONS ───────────────────────────────────────── */}

      <Section
        title={<>Persiapan <span>Cari Tiket</span></>}
        description="Semua yang perlu kamu tau sebelum masuk ke war zone,.."
        deco={{ type: 'underline', left: 105, width: 123, rotate: -2.38 }}
        cardSlot={<StackedCard card={topCard(cards, 'persiapan')} onClick={() => nav('persiapan')} />}
        onSeeMore={() => nav('persiapan')}
      />

      <Section
        title="(Lagi) War Tiket"
        description="Strategi war, troubleshoot, jastip,.."
        deco={{ type: 'tape', left: 72, top: -5, width: 78, height: 38, rotate: -4.84 }}
        cardSlot={<PhotoCard card={topCard(cards, 'tiket')} onClick={() => nav('tiket')} />}
        onSeeMore={() => nav('tiket')}
      />

      <Section
        title="Udah Dapet Tiket, terus?"
        description="Verifikasi, keamanan data, plan ke venue"
        deco={{ type: 'tape', left: 37, top: -20, width: 142, height: 59, rotate: 0 }}
        cardSlot={<StackedCard card={topCard(cards, 'udah')} onClick={() => nav('udah')} />}
        onSeeMore={() => nav('udah')}
      />

      <Section
        title="Hari-H Konser"
        description="Fanchant, setlist, etiket konser, logistik,."
        deco={{ type: 'tape', left: -5, top: -17, width: 79, height: 55, rotate: 0 }}
        cardSlot={<StackedCard card={topCard(cards, 'hari_h')} shadow={false} onClick={() => nav('hari_h')} />}
        onSeeMore={() => nav('hari_h')}
      />

      {/* ── BOTTOM BARS ─────────────────────────────────────────────── */}

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '0 22px',
        height: 105, background: ACCENT,
        borderTopLeftRadius: 6, borderTopRightRadius: 6,
        marginTop: 32, boxSizing: 'border-box',
      }}>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 18, lineHeight: '22px', color: '#FFFFFF' }}>
          SCAM ALLERT
        </span>
        <span style={{ fontSize: 18, color: '#FFFFFF' }}>⚠︎</span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '0 22px',
        height: 105, background: '#000000',
        borderTopLeftRadius: 6, borderTopRightRadius: 6,
        boxSizing: 'border-box',
      }}>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 18, lineHeight: '22px', color: '#FFFFFF' }}>
          F.A.Q Konser
        </span>
        <span style={{ fontSize: 22, color: '#FFFFFF' }}>☺︎</span>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <div style={{
        background: '#000', display: 'flex',
        justifyContent: 'center', alignItems: 'center',
        padding: '28px 0 32px',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/bts_logo.svg"
          alt="BTS"
          style={{ width: 129, height: 73, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
        />
      </div>

    </div>
  )
}
