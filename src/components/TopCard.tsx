'use client'
import { useState } from 'react'
import type { PostCard } from '@/lib/types'
import { useTweetText } from '@/lib/useTweetText'

interface Props { item: PostCard }

export function XIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function ThreadsIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 192 192" fill="currentColor">
      <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.195 47.292 9.642 32.788 28.08 19.882 44.485 13.224 67.315 13.001 96c.223 28.685 6.88 51.515 19.788 67.92 14.504 18.438 36.094 27.885 64.184 28.08h.113c25.395-.169 43.324-6.82 58.083-21.567 19.737-19.73 19.217-44.241 12.686-59.331-4.547-10.605-13.315-19.207-26.318-25.114z" />
    </svg>
  )
}

export function TikTokIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.83 1.53V6.77a4.85 4.85 0 0 1-1.06-.08z" />
    </svg>
  )
}

export function Avatar({ photoUrl, initials, size = 32 }: { photoUrl: string; initials: string; size?: number }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (!imgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photoUrl} alt={initials} width={size} height={size}
        onError={() => setImgFailed(true)}
        style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
      />
    )
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: '#FCE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: size * 0.33, color: '#9D174D', lineHeight: 1 }}>{initials}</span>
    </div>
  )
}

export function TopCard({ item }: Props) {
  const tweetText = useTweetText(item.tweet_url, item.platform)
  const displayText = tweetText || item.caption
  const hasImage = !!item.image_url

  return (
    <div style={{
      padding: '10px 12px 8px',
      height: 145,
      overflow: 'hidden',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      border: '1.5px solid #FB304C',
    }}>
      {/* Author row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6, flexShrink: 0 }}>
        <Avatar photoUrl={item.photo_url} initials={item.initials} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 12, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.username}
          </div>
          <div style={{ fontFamily: 'var(--font-main)', fontSize: 10, color: '#888' }}>{item.handle}</div>
        </div>
        <div style={{ color: '#000', flexShrink: 0, marginTop: 2 }}>
          {item.platform === 'x' && <XIcon size={13} />}
          {item.platform === 'threads' && <ThreadsIcon size={12} />}
          {item.platform === 'tiktok' && <TikTokIcon size={12} />}
        </div>
      </div>

      {/* Tweet text + optional thumbnail side-by-side */}
      <div style={{ display: 'flex', gap: 8, flex: 1, minHeight: 0, overflow: 'hidden', marginBottom: 6 }}>
        <p style={{
          fontFamily: 'var(--font-main)', fontSize: 11, lineHeight: '15px',
          color: '#333', margin: 0, flex: 1,
          display: '-webkit-box', WebkitLineClamp: hasImage ? 3 : 4,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {displayText}
        </p>
        {hasImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
        )}
      </div>

      {/* Footer: likes + comments */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 5, borderTop: '1px solid #EEE', fontFamily: 'var(--font-main)', fontSize: 10, color: '#888', flexShrink: 0 }}>
        <span style={{ color: '#FB304C' }}>♥</span>
        {item.likes ? <span>{item.likes}</span> : <span>—</span>}
        <span style={{ marginLeft: 4 }}>💬</span>
        {item.comments ? <span>{item.comments}</span> : <span>—</span>}
      </div>
    </div>
  )
}
