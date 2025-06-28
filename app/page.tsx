import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, Eye, ArrowRight, TrendingUp, Sparkles } from 'lucide-react'
import { Article } from '@/types/article'

// Fetch articles from API
async function getArticles(): Promise<Article[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/articles`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch articles')
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

const mockArticlesForFallback = [
  {
    _id: '1',
    title: 'The Future of AI in Web Development: What Developers Need to Know in 2025',
    slug: 'future-ai-web-development-2025',
    excerpt: 'Explore how artificial intelligence is revolutionizing web development workflows, from code generation to automated testing, and what skills developers need to stay relevant.',
    content: '',
    author: 'TrendWise AI',
    publishedAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
    tags: ['AI', 'Web Development', 'Future Tech', 'Programming'],
    readTime: 8,
    views: 1247,
    featured: true,
    meta: {
      title: 'The Future of AI in Web Development',
      description: 'AI revolutionizing web development workflows',
      keywords: ['AI', 'web development', 'programming']
    }
  },
  {
    _id: '2',
    title: 'React Server Components: A Complete Guide to the New Paradigm',
    slug: 'react-server-components-complete-guide',
    excerpt: 'Deep dive into React Server Components, understanding the benefits, implementation patterns, and how they change the way we build React applications.',
    content: '',
    author: 'TrendWise AI',
    publishedAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18'),
    tags: ['React', 'Server Components', 'Frontend', 'Performance'],
    readTime: 12,
    views: 892,
    featured: false,
    meta: {
      title: 'React Server Components Guide',
      description: 'Complete guide to React Server Components',
      keywords: ['React', 'server components', 'frontend']
    }
  },
  {
    _id: '3',
    title: 'TypeScript 5.0: New Features That Will Transform Your Development Experience',
    slug: 'typescript-5-new-features-2024',
    excerpt: 'Discover the groundbreaking features in TypeScript 5.0 that enhance developer productivity, improve type safety, and streamline large-scale application development.',
    content: '',
    author: 'TrendWise AI',
    publishedAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
    tags: ['TypeScript', 'Programming', 'Developer Tools', 'JavaScript'],
    readTime: 10,
    views: 1534,
    featured: true,
    meta: {
      title: 'TypeScript 5.0 New Features',
      description: 'New features in TypeScript 5.0',
      keywords: ['TypeScript', 'programming', 'JavaScript']
    }
  }
]

const HomePage = async () => {
  const articles = await getArticles()
  const featuredArticles = articles.filter(article => article.featured).map(article => ({
    ...article,
    publishedAt: new Date(article.publishedAt),
  }))
  const regularArticles = articles.filter(article => !article.featured).map(article => ({
    ...article,
    publishedAt: new Date(article.publishedAt),
  }))

  // If no articles from API, use fallback data
  const displayedFeatured = featuredArticles.length > 0 ? featuredArticles : mockArticlesForFallback.filter(article => article.featured)
  const displayedRegular = regularArticles.length > 0 ? regularArticles : mockArticlesForFallback.filter(article => !article.featured)

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <div className="inline-flex items-center rounded-full border border-border/50 bg-muted/30 px-4 py-2 text-sm font-medium mb-8 backdrop-blur">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          AI-Powered Tech Insights
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
          Stay Ahead with TrendWise
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Discover the latest trends in technology, development, and innovation. 
          Curated by AI, crafted for developers who build the future.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Live AI Analysis
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Daily Updates
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Developer Focused
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">Featured Articles</h2>
            </div>
            <div className="h-px bg-gradient-to-r from-border to-transparent flex-1"></div>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {displayedFeatured.map((article: Article) => (
              <Card key={article._id} className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 font-medium">
                      Featured
                    </Badge>
                    <Badge variant="outline" className="text-xs border-muted-foreground/20">
                      {article.tags[0]}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl leading-tight group-hover:text-primary transition-colors duration-300">
                    <Link href={`/article/${article.slug}`} className="block">
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground/90">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {article.publishedAt.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {article.readTime} min read
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        {article.views.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="p-0 h-auto font-medium group/button text-primary hover:text-primary/80" asChild>
                    <Link href={`/article/${article.slug}`}>
                      Read full article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Regular Articles */}
      <section>
        <div className="flex items-center gap-3 mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
          <div className="h-px bg-gradient-to-r from-border to-transparent flex-1"></div>
        </div>
        
        <div className="space-y-8">
          {displayedRegular.map((article: Article, index: number) => (
            <div key={article._id}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-transparent hover:bg-muted/20">
                <CardContent className="p-8">
                  <div className="grid gap-6 lg:grid-cols-4">
                    <div className="lg:col-span-3 space-y-4">
                      <div className="flex items-center gap-3">
                        {article.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs border-muted-foreground/30 hover:border-primary/50 transition-colors">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <CardTitle className="text-2xl leading-tight group-hover:text-primary transition-colors duration-300">
                        <Link href={`/article/${article.slug}`} className="block">
                          {article.title}
                        </Link>
                      </CardTitle>
                      
                      <CardDescription className="text-base leading-relaxed text-muted-foreground/90">
                        {article.excerpt}
                      </CardDescription>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {article.publishedAt.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {article.readTime} min read
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          {article.views.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" className="font-medium text-primary hover:text-primary/80 group/button" asChild>
                        <Link href={`/article/${article.slug}`}>
                          Read article
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {index < displayedRegular.length - 1 && (
                <Separator className="my-8 bg-gradient-to-r from-transparent via-border to-transparent" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Load More */}
      <div className="text-center mt-16">
        <Button variant="outline" size="lg" className="px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-colors">
          Load More Articles
        </Button>
      </div>
    </div>
  )
}

export default HomePage
