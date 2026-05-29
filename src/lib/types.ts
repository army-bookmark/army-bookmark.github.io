export interface PostCard {
  id: string
  tweet_url: string
  stage: string
  category_tag: string
  caption: string
  platform: 'x' | 'threads'
  username: string
  handle: string
  initials: string
  photo_url: string
  is_featured: boolean
  likes?: string
  comments?: string
}
