'use client'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import type { PostCard } from '@/lib/types'
import { asset } from '@/lib/asset'
import { getSheetData } from '@/lib/sheets'
import { CardStack } from './CardStack'
import { DetailView } from './DetailView'
import { playClick, playHover, playHorrorHover } from '@/lib/sounds'

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

// ── Root ──────────────────────────────────────────────────────────────────────

export function AppClient() {
  const [posts, setPosts] = useState<PostCard[]>([])
  const [loading, setLoading] = useState(true)
  // Only show shimmer if data takes longer than 250 ms — fast loads skip it entirely
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const hasVisitedDetail = useRef(false)
  const savedScrollY = useRef(0)

  useEffect(() => {
    const skeletonTimer = setTimeout(() => setShowSkeleton(true), 250)
    getSheetData().then(data => {
      clearTimeout(skeletonTimer)
      setPosts(data)
      setLoading(false)
    })
    return () => clearTimeout(skeletonTimer)
  }, [])

  const grouped = Object.fromEntries(
    STAGE_ORDER.map(s => [s, posts.filter(p => p.stage === s)])
  )
  const activePosts = activeStage ? grouped[activeStage] ?? [] : []

  const handleSelect = (stage: string) => {
    savedScrollY.current = typeof window !== 'undefined' ? window.scrollY : 0
    hasVisitedDetail.current = true
    setActiveStage(stage)
  }

  return (
    <AnimatePresence>
      {!activeStage ? (
        <motion.div
          key="home"
          initial={hasVisitedDetail.current ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
        >
          <HomePage grouped={grouped} onSelect={handleSelect} loading={loading} showSkeleton={showSkeleton} savedScrollY={savedScrollY.current} />
        </motion.div>
      ) : (
        <motion.div
          key={`detail-${activeStage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, ease: 'linear' } }}
          exit={{ opacity: 0, transition: { duration: 0.18, ease: 'linear' } }}
          style={{ minHeight: '100dvh', background: '#FFFFFF' }}
        >
          <DetailView
            stage={activeStage}
            config={STAGE_CONFIG[activeStage] ?? { name: activeStage, description: '' }}
            posts={activePosts}
            onBack={() => setActiveStage(null)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Home page ─────────────────────────────────────────────────────────────────

function HomePage({ grouped, onSelect, loading, showSkeleton, savedScrollY }: { grouped: Record<string, PostCard[]>; onSelect: (s: string) => void; loading: boolean; showSkeleton: boolean; savedScrollY: number }) {
  const stackStages = STAGE_ORDER.filter(s => !BAR_STAGES.includes(s))
  const [scamHovered, setScamHovered] = useState(false)
  const [faqHovered, setFaqHovered]   = useState(false)

  // Restore exact scroll position on return from detail
  useEffect(() => {
    if (savedScrollY > 0) {
      const t = setTimeout(() => window.scrollTo(0, savedScrollY), 50)
      return () => clearTimeout(t)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: 430, width: '100%', margin: '0 auto', position: 'relative', overflowX: 'hidden' }}>

        {/* ── HEADER ── */}
        <div style={{ position: 'relative', height: 240, overflow: 'visible' }}>

          <Metaballs
            speed={1} count={10} size={0.07} scale={1.31}
            colors={['#000000']} colorBack="#00000000"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 280, pointerEvents: 'none', zIndex: 0 }}
          />

          {/* Full-width tape strips behind CURATED / CONTENT / CONCERT */}
          {/* Brutalist asymmetric tape — each strip unique, mix-blend: multiply */}
          <TapeStrip style={{ top: 8,   left: -4,  width: '72%', transform: 'rotate(-3.5deg)', mixBlendMode: 'multiply' }} />
          <TapeStrip style={{ top: 62,  left: -22, width: '88%', transform: 'rotate(4deg)',    mixBlendMode: 'multiply' }} />
          <TapeStrip style={{ top: 118, left: 28,  width: '66%', transform: 'rotate(-2deg)',   mixBlendMode: 'multiply' }} />

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
              onMouseEnter={playHover}
              onClick={playClick}
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
                isLoading={loading}
                showSkeleton={showSkeleton}
              />
            )
          })}
        </div>

        {/* ── BOTTOM BARS ── brutalist asymmetric drawers */}
        <div style={{ marginTop: 28, paddingTop: 28, position: 'relative', paddingBottom: 110 }}>
          {/* Signature — first in DOM so buttons paint on top; centered below FAQ */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset('/assets/Signature.png')}
            alt="" aria-hidden="true"
            style={{
              position: 'absolute',
              top: 205, left: '50%',
              width: '75%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          />
          {/* SCAM ALLERT — aggressively wider, tilted left */}
          <button
            onMouseEnter={() => { setScamHovered(true); playHorrorHover() }}
            onMouseLeave={() => setScamHovered(false)}
            onClick={() => { playClick(); onSelect('scam-alert') }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: 'calc(100% + 12px)',
              padding: '0 24px', height: 90,
              background: '#FB304C', border: 'none', cursor: 'pointer',
              position: 'relative', zIndex: 2,
              transform: scamHovered
                ? 'rotate(0deg) translateX(0)'
                : 'rotate(-2.8deg) translateX(-6px)',
              transition: 'transform 300ms cubic-bezier(0.68, -0.6, 0.32, 1.6)',
              transformOrigin: 'left center',
            }}
          >
            <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 20, color: '#fff' }}>SCAM ALLERT</span>
            <span style={{ fontSize: 20, color: '#fff' }}>⚠︎</span>
          </button>
          {/* FAQ — countering tilt, offset right */}
          <button
            onMouseEnter={() => { setFaqHovered(true); playHover() }}
            onMouseLeave={() => setFaqHovered(false)}
            onClick={() => { playClick(); onSelect('faq-konser') }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%',
              padding: '0 24px', height: 90,
              background: '#000', border: 'none', cursor: 'pointer',
              position: 'relative', zIndex: 1,
              transform: faqHovered
                ? 'rotate(0deg) translate(0, 0)'
                : 'rotate(1.8deg) translateY(4px) translateX(4px)',
              transition: 'transform 300ms cubic-bezier(0.68, -0.6, 0.32, 1.6)',
              transformOrigin: 'left center',
              marginTop: -4,
            }}
          >
            <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 20, color: '#fff' }}>F.A.Q Konser</span>
            <span style={{ fontSize: 20, color: '#fff' }}>☺︎</span>
          </button>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '240px 0 52px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/assets/bts_logo.svg')} alt="BTS" style={{ width: 50, height: 68, objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  )
}

// ── Skeleton card stack ───────────────────────────────────────────────────────

function SkeletonCardStack() {
  return (
    <div style={{ position: 'relative', paddingRight: 22, paddingBottom: 18, maxWidth: 270 }}>
      {/* Background stack layers */}
      <div style={{ position: 'absolute', inset: 0, right: 22, bottom: 18, border: '1px solid rgba(251,48,76,0.25)', borderRadius: 6 }} />
      <div style={{ position: 'absolute', inset: 0, right: 22, bottom: 18, border: '1px solid rgba(251,48,76,0.5)', borderRadius: 6, transform: 'translate(4px, 4px)' }} />
      {/* Top card */}
      <div style={{ position: 'relative', zIndex: 10, background: '#fff', border: '1.5px solid #FB304C', borderRadius: 6, height: 145, padding: '10px 12px', boxSizing: 'border-box', overflow: 'hidden' }}>
        {/* Avatar + name row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
          <div className="skeleton-shimmer" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div className="skeleton-shimmer" style={{ height: 9, width: '55%' }} />
            <div className="skeleton-shimmer" style={{ height: 7, width: '35%' }} />
          </div>
        </div>
        {/* Text lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div className="skeleton-shimmer" style={{ height: 7, width: '100%' }} />
          <div className="skeleton-shimmer" style={{ height: 7, width: '88%' }} />
          <div className="skeleton-shimmer" style={{ height: 7, width: '72%' }} />
        </div>
        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 8, left: 12, right: 12, display: 'flex', gap: 8 }}>
          <div className="skeleton-shimmer" style={{ height: 7, width: 30 }} />
          <div className="skeleton-shimmer" style={{ height: 7, width: 30 }} />
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

function CategorySection({ stage, config, posts, onSelect, isLoading, showSkeleton }: {
  stage: string; config: StageConfig; posts: PostCard[]; onSelect: (s: string) => void; isLoading?: boolean; showSkeleton?: boolean
}) {
  const deco = TITLE_DECOS[stage]
  const featuredPosts = posts.filter(p => p.is_featured)
  const [seeMoreHovered, setSeeMoreHovered] = useState(false)

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

      {/* Card + See More */}
      <div style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: 32 }}>
        <div
          style={{ flex: 1, minWidth: 0, cursor: isLoading ? 'default' : 'pointer' }}
          onMouseEnter={isLoading ? undefined : playHover}
          onClick={isLoading ? undefined : () => { playClick(); onSelect(stage) }}
        >
          {isLoading && showSkeleton
            ? <SkeletonCardStack />
            : !isLoading
              ? <CardStack stage={stage} posts={featuredPosts} isPhoto={false} onSelect={onSelect} />
              : <div style={{ paddingRight: 22, paddingBottom: 18, maxWidth: 270, height: 163 }} />}
        </div>

        {/* See More — hidden while loading */}
        {!isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 145, marginLeft: -10, paddingLeft: 6, paddingRight: 25, flexShrink: 0 }}>
            <button
              onMouseEnter={() => { setSeeMoreHovered(true); playHover() }}
              onMouseLeave={() => setSeeMoreHovered(false)}
              onClick={() => { playClick(); onSelect(stage) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
            >
              <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 11, lineHeight: '14px', color: seeMoreHovered ? '#000' : '#FB304C' }}>See</span>
              <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 11, lineHeight: '14px', color: seeMoreHovered ? '#000' : '#FB304C' }}>More</span>
              <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 13, color: seeMoreHovered ? '#000' : '#FB304C' }}>→</span>
            </button>
          </div>
        )}
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
        height: 160,
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
