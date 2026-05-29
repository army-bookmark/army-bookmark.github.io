'use client'
import { motion } from 'framer-motion'
import type { PostCard } from '@/lib/types'
import { TopCard } from './TopCard'

interface Props {
  stage: string
  posts: PostCard[]
  isPhoto: boolean
  onSelect: (stage: string) => void
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 28 }

const layer3 = { rest: { x: 16, y: 14, rotate: 2.2 }, hover: { x: 20, y: 18, rotate: 3.8 } }
const layer2 = { rest: { x: 8, y: 7, rotate: 1.1 }, hover: { x: 11, y: 10, rotate: 2.0 } }
const topLayer = { rest: { rotate: 0, y: 0, x: 0 }, hover: { rotate: -1.2, y: -3, x: -1 } }

export function CardStack({ stage, posts, isPhoto, onSelect }: Props) {
  const latest = posts[0]
  if (!latest) {
    // Empty state — still show the stack outline
    return (
      <div style={{ paddingRight: 22, paddingBottom: 18, maxWidth: 270 }}>
        <div style={{ height: 145, border: '1px dashed #FB304C', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-main)', fontSize: 9, color: '#BBB' }}>Belum ada post</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      style={{ position: 'relative', cursor: 'pointer', userSelect: 'none', paddingRight: 22, paddingBottom: 18, maxWidth: 270 }}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(stage)}
    >
      {/* Layer 3 — deepest */}
      <motion.div
        style={{ position: 'absolute', inset: 0, border: '1px solid #FB304C', right: 22, bottom: 18, zIndex: 1, pointerEvents: 'none', borderRadius: 6 }}
        variants={layer3} transition={spring}
      />
      {/* Layer 2 — middle */}
      <motion.div
        style={{ position: 'absolute', inset: 0, border: '1px solid #FB304C', right: 22, bottom: 18, zIndex: 2, pointerEvents: 'none', borderRadius: 6 }}
        variants={layer2} transition={spring}
      />
      {/* Top card */}
      <motion.div
        className="card"
        style={{ zIndex: 10, position: 'relative', borderRadius: 6, overflow: 'hidden' }}
        layoutId={`card-top-${stage}`}
        variants={topLayer}
        transition={spring}
      >
        <TopCard item={latest} />
      </motion.div>
    </motion.div>
  )
}
