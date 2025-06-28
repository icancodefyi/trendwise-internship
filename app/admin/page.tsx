import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AdminHeader } from '@/components/admin-header'
import { BlogForm } from '@/components/blog-form'
import { ArticleGenerator } from '@/components/article-generator'
import { TrendingTopics } from '@/components/trending-topics'
import { TrendingBotControl } from '@/components/trending-bot-control'
import { 
  BarChart3, 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react'

const AdminPage = async () => {

  // Mock data for admin dashboard
  const stats = {
    totalArticles: 47,
    totalViews: 125430,
    totalComments: 892,
    thisMonthArticles: 12
  }

  const recentArticles = [
    {
      _id: '1',
      title: 'The Future of AI in Web Development',
      slug: 'future-ai-web-development-2025',
      publishedAt: new Date('2024-12-20'),
      views: 1247,
      status: 'published'
    },
    {
      _id: '2',
      title: 'React Server Components Complete Guide',
      slug: 'react-server-components-guide',
      publishedAt: new Date('2024-12-18'),
      views: 892,
      status: 'published'
    },
    {
      _id: '3',
      title: 'TypeScript 5.0 New Features',
      slug: 'typescript-5-new-features',
      publishedAt: new Date('2024-12-15'),
      views: 1534,
      status: 'published'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <AdminHeader />
      
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card className="border-2 hover:border-primary/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Articles</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 border">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">{stats.totalArticles}</div>
            <p className="text-sm text-muted-foreground">
              +{stats.thisMonthArticles} this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:border-primary/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Views</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 border">
              <Eye className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">{stats.totalViews.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:border-primary/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Comments</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 border">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">{stats.totalComments}</div>
            <p className="text-sm text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:border-primary/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Avg. Views</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 border">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">{Math.round(stats.totalViews / stats.totalArticles)}</div>
            <p className="text-sm text-muted-foreground">
              per article
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Blog Form */}
        <div className="lg:col-span-2">
          <BlogForm />
        </div>

        {/* Recent Articles */}
        <div>
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted border">
                  <BarChart3 className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <div className="text-xl font-bold">Recent Articles</div>
                  <p className="text-sm text-muted-foreground font-normal">Latest published content</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentArticles.map((article, index) => (
                  <div key={article._id} className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {article.publishedAt.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            {article.views.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={article.status === 'published' ? 'default' : 'secondary'} 
                        className="text-xs font-medium"
                      >
                        {article.status}
                      </Badge>
                    </div>
                    {index < recentArticles.length - 1 && (
                      <Separator />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t mt-6">
                <Button variant="outline" size="lg" className="w-full font-semibold">
                  View All Articles
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Topics */}
        <div className="lg:col-span-1">
          <TrendingTopics />
        </div>
      </div>

      {/* AI Article Generator */}
      <div className="mt-8">
        <ArticleGenerator />
      </div>


      {/* Trending Bot Control */}
      <div className="mt-8">
        <TrendingBotControl />
      </div>
    </div>
  )
}

export default AdminPage
