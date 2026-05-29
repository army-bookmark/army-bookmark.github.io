// Prefix public asset paths with basePath so they resolve correctly on
// GitHub Pages (where basePath = /ARMYBookmark) and locally (basePath = '').
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
export const asset = (path: string) => `${BASE}${path}`
