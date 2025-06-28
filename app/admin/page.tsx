import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AdminHeader } from '@/components/admin-header'
import { ArticleGenerator } from '@/components/article-generator'
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
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <AdminHeader />
      
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Articles</CardTitle>
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalArticles}</div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              +{stats.thisMonthArticles} this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Views</CardTitle>
            <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.totalViews.toLocaleString()}</div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Comments</CardTitle>
            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalComments}</div>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Avg. Views</CardTitle>
            <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">{Math.round(stats.totalViews / stats.totalArticles)}</div>
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              per article
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Article Generator */}
        <div className="lg:col-span-2">
          <ArticleGenerator />
        </div>

        {/* Recent Articles */}
        <div>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Recent Articles
              </CardTitle>
              <CardDescription>
                Latest published content performance
              </CardDescription>
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
                            {article.views.toLocaleString()} views
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
                      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t mt-6">
                <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Sparkles className="h-4 w-4 mr-2" />
                  View All Articles
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
