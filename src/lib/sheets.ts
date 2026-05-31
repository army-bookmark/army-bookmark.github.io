import type { PostCard } from './types'

// Sheet columns (0-indexed, header row skipped):
// 0: id | 1: stage | 2: caption | 3: source_url | 4: source_handle
// 5: date_added | 6: is_featured

const CSV_URL =
  process.env.NEXT_PUBLIC_SHEET_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/1SvPzeIu7lIL-foauzYvzyhcF4k3lK5tnL2VC9YQhfdU/export?format=csv&gid=484688399'

// Maps sheet stage slugs → app stage IDs
const STAGE_MAP: Record<string, string> = {
  'belum-tiket':     'persiapan-tiket',
  'persiapan-tiket': 'persiapan-tiket',
  'before_ticket':   'persiapan-tiket',
  'persiapan':       'persiapan-tiket',
  'lagi-war':        'war-tiket',
  'war-tiket':       'war-tiket',
  'war_time':        'war-tiket',
  'war':             'war-tiket',
  'udah-dapat-tiket':'udah-dapat-tiket',
  'udah-tiket':      'udah-dapat-tiket',
  'after_ticket':    'udah-dapat-tiket',
  'after':           'udah-dapat-tiket',
  'hari-h-konser':   'hari-h-konser',
  'hari-h':          'hari-h-konser',
  'concert_day':     'hari-h-konser',
  'concert':         'hari-h-konser',
  'scam-alert':      'scam-alert',
  'scam':            'scam-alert',
  'faq-konser':      'faq-konser',
  'faq':             'faq-konser',
}

function parseCSVLine(line: string): string[] {
  const results: string[] = []
  let current = ''
  let inQuotes = false
  for (const char of line) {
    if (char === '"') { inQuotes = !inQuotes }
    else if (char === ',' && !inQuotes) { results.push(current); current = '' }
    else { current += char }
  }
  results.push(current)
  return results
}

function parsePlatform(url: string): 'x' | 'threads' | 'tiktok' {
  if (url.includes('threads.net')) return 'threads'
  if (url.includes('tiktok.com')) return 'tiktok'
  return 'x'
}

// Extract clean username from the tweet/post URL
function parseUsername(url: string, fallbackHandle?: string): { username: string; handle: string } {
  try {
    const u = new URL(url)
    if (u.hostname.includes('threads.net')) {
      const parts = u.pathname.split('/').filter(Boolean)
      const raw = parts[0].replace('@', '')
      return { username: raw, handle: fallbackHandle || `@${raw}` }
    }
    const parts = u.pathname.split('/').filter(Boolean)
    const username = parts[0] ?? 'unknown'
    return { username, handle: fallbackHandle || `@${username}` }
  } catch {
    return { username: 'user', handle: fallbackHandle || '@user' }
  }
}

function buildPhotoUrl(username: string, platform: 'x' | 'threads' | 'tiktok'): string {
  if (platform === 'threads') return `https://unavatar.io/instagram/${username}`
  if (platform === 'tiktok') return `https://unavatar.io/tiktok/${username}`
  return `https://unavatar.io/x/${username}`
}

export async function getSheetData(): Promise<PostCard[]> {
  try {
    const res = await fetch(CSV_URL)
    if (!res.ok) return []
    const text = await res.text()
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []

    return lines.slice(1).map((line, i): PostCard | null => {
      const values = parseCSVLine(line)
      const id          = (values[0] ?? '').trim() || String(i)
      const rawStage    = (values[1] ?? '').trim()
      const stage       = STAGE_MAP[rawStage] ?? rawStage
      const caption     = (values[2] ?? '').trim()
      const tweet_url   = (values[3] ?? '').trim()
      const srcHandle   = (values[4] ?? '').trim()

      if (!tweet_url) return null

      const platform = parsePlatform(tweet_url)
      const { username, handle } = parseUsername(tweet_url, srcHandle || undefined)
      const photo_url = buildPhotoUrl(username, platform)

      const isFeatured = (values[6] ?? '').trim().toUpperCase() === 'TRUE'
      const likes      = (values[7] ?? '').trim() || undefined
      const comments   = (values[8] ?? '').trim() || undefined
      const image_url  = (values[9] ?? '').trim() || undefined

      return {
        id,
        tweet_url,
        stage,
        caption,
        platform,
        username,
        handle,
        initials: username.slice(0, 2).toUpperCase(),
        photo_url,
        is_featured: isFeatured,
        likes,
        comments,
        image_url,
      } satisfies PostCard
    }).filter((c): c is PostCard => c !== null)
  } catch {
    return []
  }
}
