import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trendwise.vercel.app'
  
  // In a real app, you'd fetch these from your database
  const articles = [
    {
      slug: 'future-ai-web-development-2025',
      updatedAt: '2024-12-20T00:00:00.000Z'
    },
    {
      slug: 'react-server-components-complete-guide',
      updatedAt: '2024-12-18T00:00:00.000Z'
    },
    {
      slug: 'typescript-5-new-features-2024',
      updatedAt: '2024-12-15T00:00:00.000Z'
    }
  ]

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

  const articlePages = articles.map(article => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...articlePages]
}
