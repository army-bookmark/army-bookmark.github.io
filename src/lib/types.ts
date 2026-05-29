export interface PostCard {
  id: string
  tweet_url: string
  stage: string
  category_tag: string
  caption: string        // curator's description — title above card in detail view
  platform: 'x' | 'threads'
  username: string       // derived from source_url path
  handle: string         // display handle from source_handle column, e.g. "@whathefell"
  initials: string       // first 2 chars of username, uppercased
  photo_url: string      // unavatar.io profile photo URL
  likes?: string         // optional engagement count
  comments?: string      // optional comment count
}
