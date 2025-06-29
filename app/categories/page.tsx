import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Code, 
  Smartphone, 
  Brain, 
  Globe, 
  Database, 
  Shield, 
  Palette, 
  TrendingUp,
  Users,
  Zap,
  BookOpen,
  Star
} from "lucide-react"

const categories = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Frontend, backend, and full-stack development tutorials and trends',
    icon: Code,
    color: 'bg-blue-500',
    articles: 25,
    trending: true,
    tags: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Vue.js']
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    description: 'AI, machine learning, and emerging intelligent technologies',
    icon: Brain,
    color: 'bg-purple-500',
    articles: 18,
    trending: true,
    tags: ['Machine Learning', 'GPT', 'Computer Vision', 'NLP', 'TensorFlow']
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    description: 'iOS, Android, and cross-platform mobile app development',
    icon: Smartphone,
    color: 'bg-green-500',
    articles: 15,
    trending: false,
    tags: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic']
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    description: 'Cloud platforms, DevOps, and scalable infrastructure solutions',
    icon: Globe,
    color: 'bg-cyan-500',
    articles: 22,
    trending: true,
    tags: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Serverless']
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Data analysis, visualization, and business intelligence',
    icon: Database,
    color: 'bg-orange-500',
    articles: 12,
    trending: false,
    tags: ['Python', 'R', 'Pandas', 'Visualization', 'Analytics']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Security practices, ethical hacking, and privacy protection',
    icon: Shield,
    color: 'bg-red-500',
    articles: 10,
    trending: false,
    tags: ['Security', 'Encryption', 'Penetration Testing', 'Privacy', 'Blockchain']
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    description: 'User interface design, user experience, and design systems',
    icon: Palette,
    color: 'bg-pink-500',
    articles: 14,
    trending: false,
    tags: ['Figma', 'Design Systems', 'Prototyping', 'User Research', 'Accessibility']
  },
  {
    id: 'startup-tech',
    name: 'Startup & Tech',
    description: 'Entrepreneurship, tech industry trends, and business insights',
    icon: TrendingUp,
    color: 'bg-yellow-500',
    articles: 8,
    trending: true,
    tags: ['Startups', 'Venture Capital', 'Product Management', 'Growth', 'Innovation']
  }
]

const CategoriesPage = () => {
  const trendingCategories = categories.filter(cat => cat.trending)
  const allCategories = categories

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium mb-6 bg-primary/5 border-primary/20">
            <BookOpen className="mr-2 h-4 w-4 text-primary" />
            Explore Topics
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            Browse by <span className="text-primary">Categories</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Discover articles organized by technology domains and industry topics. 
            Stay updated with the latest trends in your field of interest.
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Categories</p>
                  <p className="text-3xl font-bold text-foreground">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">Technology domains</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Articles</p>
                  <p className="text-3xl font-bold text-foreground">
                    {categories.reduce((sum, cat) => sum + cat.articles, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Published content</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trending Now</p>
                  <p className="text-3xl font-bold text-foreground">{trendingCategories.length}</p>
                  <p className="text-sm text-muted-foreground">Hot categories</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Trending Categories */}
        {trendingCategories.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Trending Categories</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {trendingCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-3 rounded-lg ${category.color} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">
                          {category.articles} articles
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {category.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {category.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <Button asChild className="w-full">
                        <Link href={`/categories/${category.id}`}>
                          Explore Category
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {/* All Categories */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">All Categories</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-lg ${category.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      {category.trending && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        {category.articles} articles
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {category.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {category.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/categories/${category.id}`}>
                        View Articles
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-20 py-16 bg-primary/5 rounded-2xl border border-primary/10">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're constantly adding new categories and content. 
            Suggest a topic or category you'd like to see covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/suggest-category">
                Suggest a Category
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">
                Browse All Articles
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CategoriesPage
