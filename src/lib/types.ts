export interface PostCard {
  id: string
  tweet_url: string
  stage: string
  caption: string
  platform: 'x' | 'threads' | 'tiktok'
  username: string
  handle: string
  initials: string
  photo_url: string
  is_featured: boolean
  likes?: string
  comments?: string
  image_url?: string
}
