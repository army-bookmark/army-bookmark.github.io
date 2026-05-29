'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import type { PostCard } from '@/lib/types'
import { asset } from '@/lib/asset'
import { getSheetData } from '@/lib/sheets'
import { CardStack } from './CardStack'
import { DetailView } from './DetailView'

// Live animated metaballs shader — Paper DR-0 exact params
const Metaballs = dynamic(
  () => import('@paper-design/shaders-react').then(m => m.Metaballs),
  { ssr: false }
)

// ── Stage → UI config ─────────────────────────────────────────────────────────

interface StageConfig {
  name: string
  description: string
  isBar?: boolean
  barColor?: string
}

const STAGE_CONFIG: Record<string, StageConfig> = {
  'persiapan-tiket': {
    name: 'Persiapan Cari Tiket',
    description: 'Semua yang perlu kamu tau sebelum masuk ke war zone,..',
  },
  'war-tiket': {
    name: '(Lagi) War Tiket',
    description: 'Strategi war, troubleshoot, jastip,..',
  },
  'udah-dapat-tiket': {
    name: 'Udah Dapet Tiket, terus?',
    description: 'Verifikasi, keamanan data, plan ke venue',
  },
  'hari-h-konser': {
    name: 'Hari-H Konser',
    description: 'Fanchant, setlist, etiket konser, logistik,.',
  },
  'scam-alert': {
    name: 'SCAM ALLERT',
    description: 'Waspada penipuan tiket dan akun palsu yang beredar',
    isBar: true,
    barColor: '#FB304C',
  },
  'faq-konser': {
    name: 'F.A.Q Konser',
    description: 'Pertanyaan umum seputar concert BTS',
    isBar: true,
    barColor: '#000',
  },
}

const STAGE_ORDER = [
  'persiapan-tiket',
  'war-tiket',
  'udah-dapat-tiket',
  'hari-h-konser',
  'scam-alert',
  'faq-konser',
]

const BAR_STAGES = ['scam-alert', 'faq-konser']
const PHOTO_STAGES = ['war-tiket', 'hari-h-konser']

// Spread ease from Paper
const SPREAD_EASE = [0.76, 0, 0.24, 1] as const

// ── Root component ────────────────────────────────────────────────────────────

export function AppClient() {
  const [posts, setPosts] = useState<PostCard[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStage, setActiveStage] = useState<string | null>(null)

  useEffect(() => {
    getSheetData().then(data => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  // Group posts by stage, preserve defined order
  const grouped = Object.fromEntries(
    STAGE_ORDER.map(stage => [
      stage,
      posts.filter(p => p.stage === stage),
    ])
  )

  const activePosts = activeStage ? grouped[activeStage] ?? [] : []

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', background: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-main)', fontSize: 13, color: '#999' }}>Loading...</span>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
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
        /* Spread from top → bottom on enter; collapse from top on back */
        <motion.div
          key={`detail-${activeStage}`}
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{
            clipPath: 'inset(0% 0% 0% 0%)',
            transition: { duration: 0.48, ease: SPREAD_EASE },
          }}
          exit={{
            clipPath: 'inset(100% 0% 0% 0%)',
            transition: { duration: 0.32, ease: SPREAD_EASE },
          }}
          style={{ minHeight: '100dvh', background: '#F7F6F2' }}
        >
          <DetailView
            stage={activeStage}
            config={STAGE_CONFIG[activeStage] ?? { name: activeStage, description: '' }}
            posts={activePosts}
            isPhoto={PHOTO_STAGES.includes(activeStage)}
            onBack={() => setActiveStage(null)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Home page ─────────────────────────────────────────────────────────────────

function HomePage({
  grouped,
  onSelect,
}: {
  grouped: Record<string, PostCard[]>
  onSelect: (stage: string) => void
}) {
  const stackStages = STAGE_ORDER.filter(s => !BAR_STAGES.includes(s))
  const scamPosts = grouped['scam-alert'] ?? []
  const faqPosts = grouped['faq-konser'] ?? []

  return (
    <div style={{ background: '#F7F6F2', minHeight: '100vh' }}>
      <div style={{ maxWidth: 375, margin: '0 auto', position: 'relative' }}>

        {/* ── HEADER ── */}
        <div style={{ position: 'relative', height: 140, overflow: 'visible' }}>

          {/* Live Metaballs shader — Paper DR-0: 371×224px at left:4, top:0 */}
          <Metaballs
            speed={1} count={10} size={0.07} scale={1.31}
            colors={['#000000']} colorBack="#00000000"
            style={{
              position: 'absolute', top: 0, left: 4,
              width: 371, height: 224,
              pointerEvents: 'none', zIndex: 0,
            }}
          />

          {/* CURATED CONTENT CONCERT */}
          <div style={{
            position: 'absolute', top: 36, left: 32,
            fontFamily: 'var(--font-main)', fontWeight: 700,
            fontSize: 20, lineHeight: '22px',
            color: '#000', zIndex: 5, pointerEvents: 'none',
          }}>
            CURATED<br />CONTENT<br />CONCERT
          </div>

          {/* Red tape strips — one per line, height matches line-height (22px) */}
          <TapeImg style={{ top: 33, left: 28, width: 114, height: 24, transform: 'rotate(-0.4deg)', filter: 'hue-rotate(349deg)', zIndex: 3 }} />
          <TapeImg style={{ top: 55, left: 28, width: 110, height: 24, transform: 'rotate(0.6deg)', filter: 'hue-rotate(349deg)', zIndex: 3 }} />
          <TapeImg style={{ top: 77, left: 28, width: 112, height: 24, transform: 'rotate(-0.2deg)', filter: 'hue-rotate(349deg)', zIndex: 3 }} />

          {/* BTS ARMY logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/assets/army-logo.png')} alt="BTS ARMY" style={{
            position: 'absolute', top: 36, left: 324,
            width: 26, height: 51, zIndex: 5, objectFit: 'contain',
          }} />

        </div>

        {/* ── TRUST BANNER — per-line tape strips via box-decoration-break ── */}
        <div style={{ margin: '0 24px 24px', position: 'relative', zIndex: 10, lineHeight: '26px' }}>
          <span style={{
            display: 'inline',
            background: '#0A0A0A',
            color: '#fff',
            fontFamily: 'var(--font-main)',
            fontSize: 11,
            padding: '3px 8px',
            WebkitBoxDecorationBreak: 'clone',
            boxDecorationBreak: 'clone',
          } as React.CSSProperties}>
            Kami udah kurasi info konser dari banyak sumber gais, we&apos;re not official please alwyz double check ♡
          </span>
        </div>

        {/* ── CATEGORY STACKS ── */}
        <div style={{ paddingBottom: 8 }}>
          {stackStages.map(stage => {
            const cfg = STAGE_CONFIG[stage]
            if (!cfg) return null
            const posts = grouped[stage] ?? []
            return (
              <CategorySection
                key={stage}
                stage={stage}
                config={cfg}
                posts={posts}
                isPhoto={PHOTO_STAGES.includes(stage)}
                onSelect={onSelect}
              />
            )
          })}
        </div>

        {/* ── BOTTOM BARS ── */}
        {scamPosts.length >= 0 && (
          <button
            onClick={() => onSelect('scam-alert')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '0 24px',
              height: 52, background: '#FB304C',
              border: 'none', cursor: 'pointer',
            }}
          >
            <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 18, color: '#fff' }}>
              SCAM ALLERT
            </span>
            <span style={{ fontSize: 18, color: '#fff' }}>⚠︎</span>
          </button>
        )}
        {faqPosts.length >= 0 && (
          <button
            onClick={() => onSelect('faq-konser')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '0 24px',
              height: 52, background: '#000',
              border: 'none', cursor: 'pointer',
              marginTop: -6,
            }}
          >
            <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 18, color: '#fff' }}>
              F.A.Q Konser
            </span>
            <span style={{ fontSize: 18, color: '#fff' }}>☺︎</span>
          </button>
        )}

        {/* ── FOOTER ── */}
        <div style={{ background: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0 48px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/assets/bts_logo.svg')} alt="BTS" style={{ width: 29, height: 68, objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  )
}

// ── Category section ──────────────────────────────────────────────────────────

type DecoType = 'underline' | 'tape'
interface DecoConfig { type: DecoType; left: number; top?: number; width: number; height?: number; rotate?: number }

const TITLE_DECOS: Record<string, DecoConfig> = {
  'persiapan-tiket': { type: 'underline', left: 105, width: 123, rotate: -2.38 },
  'war-tiket': { type: 'tape', left: 76, top: -5, width: 78, height: 38, rotate: 7.62 },
  'udah-dapat-tiket': { type: 'tape', left: 37, top: -20, width: 142, height: 59, rotate: 0 },
  'hari-h-konser': { type: 'tape', left: -5, top: -17, width: 79, height: 55, rotate: 0 },
}

function CategorySection({
  stage, config, posts, isPhoto, onSelect,
}: {
  stage: string
  config: StageConfig
  posts: PostCard[]
  isPhoto: boolean
  onSelect: (stage: string) => void
}) {
  const deco = TITLE_DECOS[stage]

  return (
    <div style={{ padding: '28px 0 0' }}>
      <div style={{ position: 'relative', marginLeft: 32, marginRight: 32, marginBottom: 4 }}>
        {deco?.type === 'tape' && (
          <TapeImg style={{
            position: 'absolute', left: deco.left, top: deco.top,
            width: deco.width, height: deco.height,
            transform: deco.rotate ? `rotate(${deco.rotate}deg)` : undefined,
            transformOrigin: '0 0', filter: 'hue-rotate(349deg)', zIndex: 1,
          }} />
        )}
        <h2 style={{ position: 'relative', zIndex: 2, fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 18, lineHeight: '22px', color: '#000', margin: 0 }}>
          {config.name}
        </h2>
        {deco?.type === 'underline' && (
          <div style={{
            position: 'absolute', left: deco.left, bottom: -1,
            width: deco.width, height: 2, background: '#FB314C',
            transform: `rotate(${deco.rotate ?? 0}deg)`, transformOrigin: '0 0', zIndex: 3,
          }} />
        )}
      </div>

      <p style={{ marginLeft: 32, marginRight: 32, marginTop: 4, marginBottom: 16, fontFamily: 'var(--font-main)', fontSize: 12, lineHeight: '16px', color: '#000' }}>
        {config.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: 32 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <CardStack stage={stage} posts={posts} isPhoto={isPhoto} onSelect={onSelect} />
        </div>
        <button
          onClick={() => onSelect(stage)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px 0 8px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}
        >
          <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 10, lineHeight: '12px', color: '#FB304C' }}>See More</span>
          <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 10, lineHeight: '12px', color: '#FB304C' }}>→</span>
        </button>
      </div>
    </div>
  )
}

// ── Tape image helper ─────────────────────────────────────────────────────────

function TapeImg({ style }: { style: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset('/assets/tape.png')} alt="" aria-hidden="true" style={{ position: 'absolute', objectFit: 'cover', ...style }} />
  )
}
