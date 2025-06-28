import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, Eye, ArrowRight, TrendingUp, Star, BookOpen, Users, Zap } from 'lucide-react'
import { Article } from '@/types/article'

// Fetch articles from API
async function getArticles(): Promise<Article[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/articles?limit=20`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch articles')
    }
    
    const data = await res.json()
    // Handle both old format (direct array) and new format (with pagination)
    return Array.isArray(data) ? data : (data.articles || [])
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
    content: `<h1>The Future of AI in Web Development</h1><p>Artificial Intelligence is no longer a distant concept from science fiction—it's actively reshaping how we build, test, and deploy web applications.</p>`,
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
    content: `<h1>React Server Components Guide</h1><p>Deep dive into React Server Components and their revolutionary approach to building modern web applications.</p>`,
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
    content: `<h1>TypeScript 5.0 New Features</h1><p>Discover the groundbreaking features in TypeScript 5.0 that enhance developer productivity and improve type safety.</p>`,
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-20 py-12">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium mb-8 bg-primary/5 border-primary/20">
            <Zap className="mr-2 h-4 w-4 text-primary" />
            AI-Powered Tech Insights
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 text-foreground">
            Stay Ahead with <span className="text-primary">TrendWise</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
            Discover the latest trends in technology, development, and innovation. 
            Curated by AI, crafted for developers who build the future.
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
            <div className="text-center p-6 rounded-xl border bg-card">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Articles Published</div>
            </div>
            <div className="text-center p-6 rounded-xl border bg-card">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Readers</div>
            </div>
            <div className="text-center p-6 rounded-xl border bg-card">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <Star className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="px-8 py-6 text-lg font-semibold shadow-lg">
              Start Reading
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold">
              Explore Topics
            </Button>
          </div>
        </section>

        {/* Featured Articles */}
        {displayedFeatured.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Featured Articles</h2>
                  <p className="text-muted-foreground">Hand-picked articles from our editorial team</p>
                </div>
              </div>
              <Button variant="outline" className="hidden md:flex">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-2">
              {displayedFeatured.map((article: Article, index: number) => (
                <Card key={article._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border hover:border-primary/20 bg-card">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                        Featured
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {article.views.toLocaleString()}
                      </div>
                    </div>
                    <CardTitle className="text-2xl leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      <Link href={`/article/${article.slug}`} className="block">
                        {article.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {article.publishedAt.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.readTime} min
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {article.tags.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="p-0 h-auto font-medium text-primary hover:text-primary/80 group/button" asChild>
                        <Link href={`/article/${article.slug}`}>
                          Read more
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Regular Articles */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted/50 border">
                <BookOpen className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
                <p className="text-muted-foreground">Fresh insights and updates from the tech world</p>
              </div>
            </div>
            <Button variant="outline" className="hidden md:flex">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedRegular.map((article: Article) => (
              <Card key={article._id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border hover:border-primary/20 bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs bg-muted/50">
                      {article.tags[0]}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {article.views.toLocaleString()}
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-3">
                    <Link href={`/article/${article.slug}`} className="block">
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.publishedAt.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}m
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {article.tags.slice(1, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs h-6">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-sm font-medium text-primary hover:text-primary/80 group/button" asChild>
                      <Link href={`/article/${article.slug}`}>
                        Read
                        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/button:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Load More */}
        <div className="text-center mt-16">
          <Button variant="outline" size="lg" className="px-12 py-6 text-lg font-semibold">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
