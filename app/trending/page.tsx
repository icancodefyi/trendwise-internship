import React from 'react'
import { TrendingTopics } from '@/components/trending-topics'
import { SearchComponent } from '@/components/search-component'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Globe, Twitter, Github, Clock, BarChart3, Zap } from 'lucide-react'

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium mb-6 bg-primary/5 border-primary/20">
            <TrendingUp className="mr-2 h-4 w-4 text-primary" />
            Live Trending Data
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            What's <span className="text-primary">Trending</span> Now
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Discover the hottest topics in technology and development, sourced from Google Trends, Twitter, and GitHub.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <SearchComponent placeholder="Search trending topics..." className="w-full" />
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sources</p>
                  <p className="text-3xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Data providers</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Update Frequency</p>
                  <p className="text-3xl font-bold text-foreground">5min</p>
                  <p className="text-sm text-muted-foreground">Real-time updates</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trending Topics</p>
                  <p className="text-3xl font-bold text-foreground">50+</p>
                  <p className="text-sm text-muted-foreground">Currently tracked</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Sources Info */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Our Data Sources
              </CardTitle>
              <CardDescription>
                We aggregate trending data from multiple authoritative sources to give you the most comprehensive view
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Google Trends</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Real-time search trends and emerging topics from Google's search data.
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Real-time
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-sky-100 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
                    <Twitter className="h-6 w-6 text-sky-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Twitter API</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Trending hashtags and discussions from the developer community.
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Live feed
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800">
                    <Github className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">GitHub Trending</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Popular repositories and emerging technologies in the open source community.
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Daily updates
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Trending Component */}
        <section>
          <TrendingTopics />
        </section>
      </div>
    </div>
  )
}
