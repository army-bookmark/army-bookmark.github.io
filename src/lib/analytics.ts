'use client'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

// Virtual pageview — SPA has no real URL changes per section, so GA4's
// automatic pageview can't tell sections apart. This makes each section show
// up as its own "page" for the built-in Path Exploration report.
export function trackPageView(path: string, title: string) {
  if (typeof window === 'undefined') return
  gtag('event', 'page_view', {
    page_location: `${window.location.origin}${path}`,
    page_path: path,
    page_title: title,
  })
}

// Fired the instant a button/card that opens a section is clicked —
// tells you *which* entry point (thumbnail vs "See More" vs bottom bar) led in.
export function trackSectionEntryClick(sectionId: string, sectionName: string, entryPoint: string) {
  gtag('event', 'section_entry_click', {
    section_id: sectionId,
    section_name: sectionName,
    entry_point: entryPoint,
  })
}

// Fired when a homepage section's collapse/expand toggle is clicked.
export function trackSectionToggle(sectionId: string, sectionName: string, expanded: boolean) {
  gtag('event', 'section_toggle', {
    section_id: sectionId,
    section_name: sectionName,
    expanded,
  })
}

// Fired when a section's detail view mounts.
export function trackSectionView(sectionId: string, sectionName: string) {
  trackPageView(`/section/${sectionId}`, sectionName)
  gtag('event', 'section_view', {
    section_id: sectionId,
    section_name: sectionName,
  })
}

// Fired when a section's detail view unmounts — answers "how long".
export function trackSectionEngagement(sectionId: string, sectionName: string, dwellMs: number) {
  gtag('event', 'section_engagement', {
    section_id: sectionId,
    section_name: sectionName,
    engagement_time_msec: dwellMs,
    engagement_time_sec: Math.round(dwellMs / 1000),
  })
}

// Fired on every outbound link/button click — source posts, donation link, etc.
export function trackLinkClick(opts: { url: string; label: string; sectionId: string; linkType: string }) {
  gtag('event', 'link_click', {
    link_url: opts.url,
    link_text: opts.label,
    section_id: opts.sectionId,
    link_type: opts.linkType,
  })
}

// Fired once per scroll-depth threshold crossed, per section visit.
export function trackScrollDepth(percent: number, sectionId: string) {
  gtag('event', 'scroll_depth', {
    percent_scrolled: percent,
    section_id: sectionId,
  })
}
