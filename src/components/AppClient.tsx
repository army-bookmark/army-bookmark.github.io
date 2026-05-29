'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import type { PostCard } from '@/lib/types'
import { asset } from '@/lib/asset'
import { getSheetData } from '@/lib/sheets'
import { CardStack } from './CardStack'
import { DetailView } from './DetailView'

const Metaballs = dynamic(
  () => import('@paper-design/shaders-react').then(m => m.Metaballs),
  { ssr: false }
)

// ── Stage config ──────────────────────────────────────────────────────────────

interface StageConfig { name: string; description: string }

const STAGE_CONFIG: Record<string, StageConfig> = {
  'persiapan-tiket': { name: 'Persiapan Cari Tiket', description: 'Semua yang perlu kamu tau sebelum masuk ke war zone,..' },
  'war-tiket':       { name: '(Lagi) War Tiket',      description: 'Strategi war, troubleshoot, jastip,..' },
  'udah-dapat-tiket':{ name: 'Udah Dapet Tiket, terus?', description: 'Verifikasi, keamanan data, plan ke venue' },
  'hari-h-konser':   { name: 'Hari-H Konser',          description: 'Fanchant, setlist, etiket konser, logistik,.' },
  'scam-alert':      { name: 'SCAM ALLERT',            description: 'Waspada penipuan tiket dan akun palsu yang beredar' },
  'faq-konser':      { name: 'F.A.Q Konser',           description: 'Pertanyaan umum seputar concert BTS' },
}

const STAGE_ORDER = ['persiapan-tiket', 'war-tiket', 'udah-dapat-tiket', 'hari-h-konser', 'scam-alert', 'faq-konser']
const BAR_STAGES  = ['scam-alert', 'faq-konser']

const SPREAD_EASE = [0.76, 0, 0.24, 1] as const

// ── Root ──────────────────────────────────────────────────────────────────────

export function AppClient() {
  const [posts, setPosts] = useState<PostCard[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStage, setActiveStage] = useState<string | null>(null)

  useEffect(() => {
    getSheetData().then(data => { setPosts(data); setLoading(false) })
  }, [])

  const grouped = Object.fromEntries(
    STAGE_ORDER.map(s => [s, posts.filter(p => p.stage === s)])
  )
  const activePosts = activeStage ? grouped[activeStage] ?? [] : []

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', background: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-main)', fontSize: 14, color: '#999' }}>Loading...</span>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {!activeStage ? (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.08 } }}
        >
          <HomePage grouped={grouped} onSelect={setActiveStage} />
        </motion.div>
      ) : (
        <motion.div
          key={`detail-${activeStage}`}
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.42, ease: SPREAD_EASE } }}
          exit={{ clipPath: 'inset(100% 0% 0% 0%)', transition: { duration: 0.30, ease: SPREAD_EASE } }}
          style={{ minHeight: '100dvh', background: '#F7F6F2' }}
        >
          <DetailView
            stage={activeStage}
            config={STAGE_CONFIG[activeStage] ?? { name: activeStage, description: '' }}
            posts={activePosts}
            isPhoto={false}
            onBack={() => setActiveStage(null)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Home page ─────────────────────────────────────────────────────────────────

function HomePage({ grouped, onSelect }: { grouped: Record<string, PostCard[]>; onSelect: (s: string) => void }) {
  const stackStages = STAGE_ORDER.filter(s => !BAR_STAGES.includes(s))

  return (
    <div style={{ background: '#F7F6F2', minHeight: '100vh' }}>
      <div style={{ maxWidth: 430, width: '100%', margin: '0 auto', position: 'relative', overflowX: 'hidden' }}>

        {/* ── HEADER ── */}
        <div style={{ position: 'relative', height: 240, overflow: 'visible' }}>

          <Metaballs
            speed={1} count={10} size={0.07} scale={1.31}
            colors={['#000000']} colorBack="#00000000"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 280, pointerEvents: 'none', zIndex: 0 }}
          />

          {/* Full-width tape strips behind CURATED / CONTENT / CONCERT */}
          <TapeStrip style={{ top: 30,  transform: 'rotate(-0.4deg)' }} />
          <TapeStrip style={{ top: 90,  transform: 'rotate(0.6deg)'  }} />
          <TapeStrip style={{ top: 150, transform: 'rotate(-0.2deg)' }} />

          {/* CURATED CONTENT CONCERT — big */}
          <div style={{
            position: 'absolute', top: 36, left: 32,
            fontFamily: 'var(--font-main)', fontWeight: 700,
            fontSize: 44, lineHeight: '56px',
            color: '#000', zIndex: 5, pointerEvents: 'none',
          }}>
            CURATED<br />CONTENT<br />CONCERT
          </div>

          {/* BTS ARMY logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/assets/army-logo.png')} alt="BTS ARMY" style={{
            position: 'absolute', top: 36, right: 24,
            width: 28, height: 56, zIndex: 5, objectFit: 'contain',
          }} />
        </div>

        {/* ── TRUST BANNER ── */}
        <div style={{ margin: '0 24px 28px', position: 'relative', zIndex: 10, lineHeight: '28px' }}>
          <span style={{
            display: 'inline',
            background: '#0A0A0A', color: '#fff',
            fontFamily: 'var(--font-main)', fontSize: 12,
            padding: '3px 8px',
            WebkitBoxDecorationBreak: 'clone',
            boxDecorationBreak: 'clone',
          } as React.CSSProperties}>
            Kami udah kurasi info konser dari banyak sumber gais, we&apos;re not official please alwyz double check ♡ dan{' '}
            <a
              href="https://trakteer.id/rememorari/tip"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgb(251, 48, 76)', textDecoration: 'underline' }}
            >
              bisa traktir cendol
            </a>
          </span>
        </div>

        {/* ── CATEGORY STACKS ── */}
        <div style={{ paddingBottom: 8 }}>
          {stackStages.map(stage => {
            const cfg = STAGE_CONFIG[stage]
            if (!cfg) return null
            return (
              <CategorySection
                key={stage}
                stage={stage}
                config={cfg}
                posts={grouped[stage] ?? []}
                onSelect={onSelect}
              />
            )
          })}
        </div>

        {/* ── BOTTOM BARS ── */}
        <div style={{ marginTop: 28 }}>
          <button
            onClick={() => onSelect('scam-alert')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 24px', height: 56, background: '#FB304C', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 20, color: '#fff' }}>SCAM ALLERT</span>
            <span style={{ fontSize: 20, color: '#fff' }}>⚠︎</span>
          </button>
          <button
            onClick={() => onSelect('faq-konser')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 24px', height: 56, background: '#000', border: 'none', cursor: 'pointer', marginTop: -4 }}
          >
            <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 20, color: '#fff' }}>F.A.Q Konser</span>
            <span style={{ fontSize: 20, color: '#fff' }}>☺︎</span>
          </button>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ background: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0 52px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/assets/bts_logo.svg')} alt="BTS" style={{ width: 50, height: 68, objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  )
}

// ── Category section ──────────────────────────────────────────────────────────

type DecoType = 'underline' | 'tape'
interface DecoConfig { type: DecoType; left: number; top?: number; width: number; height?: number; rotate?: number }

const TITLE_DECOS: Record<string, DecoConfig> = {
  'persiapan-tiket':  { type: 'underline', left: 115, width: 135, rotate: -2.38 },
  'war-tiket':        { type: 'tape', left: 82, top: -6, width: 82, height: 40, rotate: 7.62 },
  'udah-dapat-tiket': { type: 'tape', left: 40, top: -22, width: 150, height: 62, rotate: 0 },
  'hari-h-konser':    { type: 'tape', left: -6, top: -18, width: 84, height: 58, rotate: 0 },
}

function CategorySection({ stage, config, posts, onSelect }: {
  stage: string; config: StageConfig; posts: PostCard[]; onSelect: (s: string) => void
}) {
  const deco = TITLE_DECOS[stage]
  const featuredPosts = posts.filter(p => p.is_featured)

  return (
    <div style={{ padding: '28px 0 0' }}>
      {/* Title row with decoration */}
      <div style={{ position: 'relative', marginLeft: 32, marginRight: 32, marginBottom: 4 }}>
        {deco?.type === 'tape' && (
          <TapeImg style={{
            position: 'absolute', left: deco.left, top: deco.top,
            width: deco.width, height: deco.height,
            transform: deco.rotate ? `rotate(${deco.rotate}deg)` : undefined,
            transformOrigin: '0 0', filter: 'hue-rotate(349deg)', zIndex: 1,
          }} />
        )}
        <h2 style={{ position: 'relative', zIndex: 2, fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 20, lineHeight: '24px', color: '#000', margin: 0 }}>
          {config.name}
        </h2>
        {deco?.type === 'underline' && (
          <div style={{ position: 'absolute', left: deco.left, bottom: -1, width: deco.width, height: 2, background: '#FB314C', transform: `rotate(${deco.rotate ?? 0}deg)`, transformOrigin: '0 0', zIndex: 3 }} />
        )}
      </div>

      <p style={{ marginLeft: 32, marginRight: 32, marginTop: 6, marginBottom: 16, fontFamily: 'var(--font-main)', fontSize: 13, lineHeight: '18px', color: '#000' }}>
        {config.description}
      </p>

      {/* Card + See More side-by-side */}
      <div style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: 32 }}>
        {/* Card stack — clickable */}
        <div
          style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
          onClick={() => onSelect(stage)}
        >
          <CardStack stage={stage} posts={featuredPosts} isPhoto={false} onSelect={onSelect} />
        </div>

        {/* See More — vertically centred relative to card face (145px) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 145, paddingLeft: 8, paddingRight: 14, flexShrink: 0 }}>
          <button
            onClick={() => onSelect(stage)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
          >
            <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 11, lineHeight: '14px', color: '#FB304C' }}>See</span>
            <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 11, lineHeight: '14px', color: '#FB304C' }}>More</span>
            <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 13, color: '#FB304C' }}>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Full-width tape strip for header (stretches to container width)
function TapeStrip({ style }: { style: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset('/assets/tape.png')}
      alt="" aria-hidden="true"
      style={{
        position: 'absolute',
        left: -4, width: 'calc(100% + 8px)',
        height: 62,
        objectFit: 'fill',
        filter: 'hue-rotate(349deg)',
        pointerEvents: 'none',
        zIndex: 3,
        ...style,
      }}
    />
  )
}

// Small tape image for category-title decorations
function TapeImg({ style }: { style: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset('/assets/tape.png')} alt="" aria-hidden="true" style={{ position: 'absolute', objectFit: 'cover', ...style }} />
  )
}
