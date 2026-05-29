'use client'
import type { PostCard } from '@/lib/types'
import { useTweetText } from '@/lib/useTweetText'
import { Avatar, XIcon, ThreadsIcon, TikTokIcon } from './TopCard'

// ── Caption bubble (editorial note) ──────────────────────────────────────────

function CaptionBubble({ text }: { text: string }) {
  return (
    <div style={{ position: 'relative', border: '1px solid #000', background: '#FFF', borderRadius: 6, padding: '10px 14px', marginBottom: 14, fontFamily: 'var(--font-main)', fontSize: 12, lineHeight: '17px', color: '#000' }}>
      {text}
      <div style={{ position: 'absolute', bottom: -6, left: 24, width: 10, height: 10, background: '#FFF', borderRight: '1px solid #000', borderBottom: '1px solid #000', transform: 'rotate(45deg)' }} />
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────

export function DetailItem({ item }: { item: PostCard }) {
  const tweetText = useTweetText(item.tweet_url, item.platform)

  return (
    <>
      {item.caption && <CaptionBubble text={item.caption} />}

      <div style={{ background: '#FFFFFF', border: '1px solid #FB304C', borderRadius: 6, overflow: 'hidden', padding: '12px 14px', boxShadow: '3px 6px 9px rgba(0,0,0,0.18)', boxSizing: 'border-box' }}>

        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Avatar photoUrl={item.photo_url} initials={item.initials} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 13, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.username}
            </div>
            <div style={{ fontFamily: 'var(--font-main)', fontSize: 11, color: '#888' }}>{item.handle}</div>
          </div>
          <div style={{ color: '#000', flexShrink: 0 }}>
            {item.platform === 'x' && <XIcon size={14} />}
            {item.platform === 'threads' && <ThreadsIcon size={13} />}
            {item.platform === 'tiktok' && <TikTokIcon size={13} />}
          </div>
        </div>

        {/* Tweet text (fetched from oEmbed — X/Twitter only) */}
        {tweetText && (
          <p style={{ fontFamily: 'var(--font-main)', fontSize: 12, lineHeight: '18px', color: '#000', margin: '0 0 10px 0', whiteSpace: 'pre-wrap' }}>
            {tweetText}
          </p>
        )}

        {/* Embedded image */}
        {item.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt=""
            style={{ width: '100%', borderRadius: 6, objectFit: 'cover', maxHeight: 200, marginBottom: 10, display: 'block' }}
          />
        )}

        {/* Footer: likes / comments + Open Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid #EEE', fontFamily: 'var(--font-main)', fontSize: 11 }}>
          <span style={{ color: '#FB304C' }}>♥</span>
          <span style={{ color: '#888' }}>{item.likes ?? '—'}</span>
          <span style={{ color: '#888', marginLeft: 2 }}>💬</span>
          <span style={{ color: '#888' }}>{item.comments ?? '—'}</span>
          <a
            href={item.tweet_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, background: '#000', color: '#fff', fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 11, padding: '5px 12px', borderRadius: 4, textDecoration: 'none', flexShrink: 0 }}
          >
            Open Link →
          </a>
        </div>
      </div>
    </>
  )
}
