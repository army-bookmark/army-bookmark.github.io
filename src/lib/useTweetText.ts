'use client'
import { useState, useEffect } from 'react'

export function useTweetText(url: string, platform: 'x' | 'threads' | 'tiktok'): string | null {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    if (platform !== 'x' || !url) return

    const key = `oembed:${url}`
    try {
      const cached = sessionStorage.getItem(key)
      if (cached !== null) { setText(cached); return }
    } catch {}

    fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`)
      .then(r => r.json())
      .then((data: { html: string }) => {
        const doc = new DOMParser().parseFromString(data.html, 'text/html')
        const p = doc.querySelector('blockquote p')
        if (!p) return
        p.querySelectorAll('a[href*="pic.twitter"]').forEach(a => a.remove())
        const raw = (p.textContent ?? '').trim()
        if (!raw) return
        setText(raw)
        try { sessionStorage.setItem(key, raw) } catch {}
      })
      .catch(() => {})
  }, [url, platform])

  return text
}
