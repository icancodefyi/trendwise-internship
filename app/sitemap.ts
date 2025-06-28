import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trendwise.vercel.app'

  let articles = []
  
  try {
    // Fetch articles from the correct API endpoint
    const response = await fetch(`${baseUrl}/api/articles`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (response.ok) {
      articles = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch articles for sitemap:', error)
    // Continue with empty articles array
  }

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.3,
    },
  ]

  const articlePages = articles.map((article: { slug: string; updatedAt: string }) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...articlePages]
}
