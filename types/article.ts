export interface Article {
  _id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: Date
  updatedAt: Date
  tags: string[]
  readTime: number
  views: number
  featured: boolean
  meta: {
    title: string
    description: string
    keywords: string[]
  }
  media?: {
    images: string[]
    videos: string[]
    tweets: string[]
  }
}

export interface Comment {
  _id?: string
  articleId: string
  userId: string
  userName: string
  userImage?: string
  content: string
  createdAt: Date
  updatedAt: Date
}
