'use client'
import { useState } from 'react'
import type { PostCard } from '@/lib/types'

interface Props {
  item: PostCard
  isPhoto?: boolean
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function ThreadsIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 192 192" fill="currentColor">
      <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.195 47.292 9.642 32.788 28.08 19.882 44.485 13.224 67.315 13.001 96c.223 28.685 6.88 51.515 19.788 67.92 14.504 18.438 36.094 27.885 64.184 28.08h.113c25.395-.169 43.324-6.82 58.083-21.567 19.737-19.73 19.217-44.241 12.686-59.331-4.547-10.605-13.315-19.207-26.318-25.114z" />
    </svg>
  )
}

// Real profile photo with initials fallback
function Avatar({ photoUrl, initials, size = 30 }: { photoUrl: string; initials: string; size?: number }) {
  const [imgFailed, setImgFailed] = useState(false)

  if (!imgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={initials}
        width={size}
        height={size}
        onError={() => setImgFailed(true)}
        style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
      />
    )
  }

  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: '#FCE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: size * 0.33, color: '#9D174D', lineHeight: 1 }}>
        {initials}
      </span>
    </div>
  )
}

// Caption bubble — curator's description with diamond tail pointing to card below
function CaptionBubble({ text }: { text: string }) {
  return (
    <div style={{ position: 'relative', border: '1px solid #000', background: '#FFF', borderRadius: 6, padding: '10px 12px', marginBottom: 14, fontFamily: 'var(--font-main)', fontSize: 11, lineHeight: '15px', color: '#000' }}>
      {text}
      <div style={{ position: 'absolute', bottom: -6, left: 24, width: 10, height: 10, background: '#FFF', borderRight: '1px solid #000', borderBottom: '1px solid #000', transform: 'rotate(45deg)' }} />
    </div>
  )
}

export function DetailItem({ item, isPhoto = false }: Props) {
  const isX = item.platform === 'x'
  const isThreads = item.platform === 'threads'

  return (
    <>
      {/* Caption from Google Sheet — shown as curator title above each card */}
      {item.caption && <CaptionBubble text={item.caption} />}

      <div style={{ background: '#FFFFFF', border: '1px solid #FB304C', borderRadius: 6, overflow: 'hidden', padding: '10px 12px', boxShadow: '3px 6px 9px rgba(0,0,0,0.20)', boxSizing: 'border-box' }}>

        {/* Author row — real profile photo, no Follow button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Avatar photoUrl={item.photo_url} initials={item.initials} size={isPhoto ? 28 : 30} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 11, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.username}
            </div>
            <div style={{ fontFamily: 'var(--font-main)', fontSize: 9, color: '#888' }}>{item.handle}</div>
          </div>
          <div style={{ color: '#000', flexShrink: 0 }}>
            {isX && <XIcon />}
            {isThreads && <ThreadsIcon />}
          </div>
        </div>

        {/* Footer: likes / comments + Buka Tweet CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8, borderTop: '1px solid #EEE', fontFamily: 'var(--font-main)', fontSize: 9 }}>
          <span style={{ color: '#FB304C' }}>♥</span>
          {item.likes ? <span style={{ color: '#888' }}>{item.likes}</span> : null}
          {item.comments ? <span style={{ color: '#888', marginLeft: 4 }}>{item.comments} comments</span> : null}
          <a
            href={item.tweet_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, background: '#000', color: '#fff', fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 9, padding: '4px 10px', borderRadius: 4, textDecoration: 'none', flexShrink: 0 }}
          >
            Open Link →
          </a>
        </div>
      </div>
    </>
  )
}
