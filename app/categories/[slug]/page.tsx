import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  Eye, 
  ArrowLeft, 
  TrendingUp,
  BookOpen,
  User
} from "lucide-react"

// Mock data for demonstration - in a real app, this would come from an API
const categoryData = {
  'web-development': {
    name: 'Web Development',
    description: 'Frontend, backend, and full-stack development tutorials and trends',
    color: 'bg-blue-500',
    articles: [
      {
        _id: '1',
        title: 'The Future of AI in Web Development: What Developers Need to Know in 2025',
        slug: 'future-ai-web-development-2025',
        excerpt: 'Explore how artificial intelligence is revolutionizing web development workflows, from code generation to automated testing.',
        author: 'TrendWise AI',
        publishedAt: new Date('2024-12-20'),
        tags: ['AI', 'Web Development', 'Future Tech', 'Programming'],
        readTime: 8,
        views: 1247,
        featured: true
      },
      {
        _id: '2',
        title: 'React Server Components: A Complete Guide to the New Paradigm',
        slug: 'react-server-components-complete-guide',
        excerpt: 'Deep dive into React Server Components, understanding the benefits, implementation patterns, and performance improvements.',
        author: 'TrendWise AI',
        publishedAt: new Date('2024-12-18'),
        tags: ['React', 'Server Components', 'Frontend', 'Performance'],
        readTime: 12,
        views: 892,
        featured: false
      }
    ]
  },
  'artificial-intelligence': {
    name: 'Artificial Intelligence',
    description: 'AI, machine learning, and emerging intelligent technologies',
    color: 'bg-purple-500',
    articles: [
      {
        _id: '3',
        title: 'Understanding Large Language Models: A Developer\'s Guide',
        slug: 'understanding-large-language-models-guide',
        excerpt: 'Comprehensive overview of LLMs, their capabilities, limitations, and practical applications in software development.',
        author: 'TrendWise AI',
        publishedAt: new Date('2024-12-15'),
        tags: ['AI', 'LLM', 'Machine Learning', 'GPT'],
        readTime: 15,
        views: 2103,
        featured: true
      }
    ]
  }
  // Add more categories as needed
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const category = categoryData[slug as keyof typeof categoryData];

  if (!category) {
    notFound();
  }

  const featuredArticles = category.articles.filter(article => article.featured);
  const regularArticles = category.articles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Categories
            </Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground">{category.name}</span>
        </div>

        {/* Header Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium mb-6 bg-primary/5 border-primary/20">
            <BookOpen className="mr-2 h-4 w-4 text-primary" />
            {category.name}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            {category.name} <span className="text-primary">Articles</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            {category.description}
          </p>
          
          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                {category.articles.length} articles published
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                {featuredArticles.length} featured articles
              </span>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Featured Articles</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
              {featuredArticles.map((article) => (
                <Card key={article._id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Featured
                          </Badge>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {article.publishedAt.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {article.readTime} min read
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {article.views.toLocaleString()} views
                            </div>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                          <Link href={`/article/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{article.author}</span>
                          </div>
                          <Button asChild>
                            <Link href={`/article/${article.slug}`}>
                              Read Article
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">All Articles</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category.articles.map((article) => (
              <Card key={article._id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    {article.featured && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        Featured
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {article.publishedAt.toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/article/${article.slug}`}>
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/article/${article.slug}`}>
                      Read More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {category.articles.length === 0 && (
          <section className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">No Articles Yet</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              We're working on adding more content to this category. Check back soon!
            </p>
            <Button asChild>
              <Link href="/">
                Browse All Articles
              </Link>
            </Button>
          </section>
        )}

        {/* Back to Categories */}
        <section className="text-center mt-20 py-16 bg-primary/5 rounded-2xl border border-primary/10">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Explore More Categories
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover more topics and expand your knowledge across different technology domains.
          </p>
          <Button size="lg" asChild>
            <Link href="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View All Categories
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;
