'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HomeFeedStatic } from './HomeFeedStatic'
import { DetailViewStatic } from './DetailViewStatic'
import type { PostCard } from '@/lib/types'

type Screen = 'home' | 'detail'

const DETAIL_EASE = [0.76, 0, 0.24, 1] as const

export function PreviewClient({ cards }: { cards: PostCard[] }) {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedCategory, setSelectedCategory] = useState('persiapan')

  function goToDetail(category: string) {
    setSelectedCategory(category)
    setScreen('detail')
  }

  const categoryCards = cards.filter(c => c.category_tag === selectedCategory)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#E0E0E0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 0,
      overflow: 'hidden',
    }}>
      <AnimatePresence mode="wait">
        {screen === 'home' ? (
          <motion.div
            key="home"
            style={{ width: '100%', maxWidth: 375, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            <HomeFeedStatic
              cards={cards}
              onCategoryClick={goToDetail}
            />
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            style={{ width: '100%', maxWidth: 375 }}
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.48, ease: DETAIL_EASE } }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.32, ease: DETAIL_EASE } }}
          >
            <DetailViewStatic
              onBack={() => setScreen('home')}
              cards={categoryCards.length > 0 ? categoryCards : undefined}
              selectedCategory={selectedCategory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
