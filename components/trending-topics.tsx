"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  TrendingUp, 
  Globe, 
  Twitter, 
  Github,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Play,
  ExternalLink
} from 'lucide-react'

interface TrendingTopic {
  id: string
  title: string
  source: string
  trend_score: number
  category: string
  description: string
  keywords: string[]
  image: string
  videos: string[]
  tweets: string[]
}

interface TrendingData {
  success: boolean
  trending_topics: TrendingTopic[]
  last_updated: string
  sources: {
    google_trends: string
    twitter_api: string
    github_trending: string
  }
}

export function TrendingTopics() {
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null)

  const fetchTrendingData = async () => {
    try {
      const response = await fetch('/api/trending')
      const data = await response.json()
      setTrendingData(data)
    } catch (error) {
      console.error('Error fetching trending data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetch('/api/trending', { method: 'POST' })
      await fetchTrendingData()
    } catch (error) {
      console.error('Error refreshing trending data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const generateArticleFromTrending = async (topic: TrendingTopic) => {
    try {
      const response = await fetch('/api/articles/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: topic.title,
          description: topic.description,
          keywords: topic.keywords,
          media: {
            image: topic.image,
            videos: topic.videos,
            tweets: topic.tweets
          }
        }),
      })

      if (response.ok) {
        // Redirect or refresh to see the new article
        window.location.reload()
      }
    } catch (error) {
      console.error('Error generating article from trending topic:', error)
    }
  }

  useEffect(() => {
    fetchTrendingData()
  }, [])

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'google trends':
        return Globe
      case 'twitter api':
        return Twitter
      case 'github trending':
        return Github
      default:
        return TrendingUp
    }
  }

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'google trends':
        return 'text-blue-600'
      case 'twitter api':
        return 'text-sky-500'
      case 'github trending':
        return 'text-gray-800 dark:text-gray-200'
      default:
        return 'text-primary'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Topics
            </CardTitle>
            <CardDescription>
              Latest trending topics from multiple sources
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Data Sources Status */}
        {trendingData?.sources && (
          <div>
            <h4 className="text-sm font-medium mb-3">Data Sources</h4>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Google Trends</span>
                <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <Twitter className="h-4 w-4 text-sky-500" />
                <span className="text-sm font-medium">Twitter API</span>
                <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <Github className="h-4 w-4" />
                <span className="text-sm font-medium">GitHub Trending</span>
                <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />
              </div>
            </div>
            {trendingData.last_updated && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last updated: {new Date(trendingData.last_updated).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <Separator />

        {/* Trending Topics */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Top Trending Topics</h4>
          {trendingData?.trending_topics?.map((topic) => {
            const SourceIcon = getSourceIcon(topic.source)
            const sourceColor = getSourceColor(topic.source)
            
            return (
              <div key={topic.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <SourceIcon className={`h-4 w-4 ${sourceColor}`} />
                      <Badge variant="outline" className="text-xs">
                        {topic.source}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Score: {topic.trend_score}
                      </Badge>
                    </div>
                    
                    <h5 className="font-medium text-sm mb-1 line-clamp-2">
                      {topic.title}
                    </h5>
                    
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {topic.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {topic.keywords.slice(0, 4).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                    {/* Media Preview */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      {topic.image && (
                        <div className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Image
                        </div>
                      )}
                      {topic.videos.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {topic.videos.length} Video{topic.videos.length > 1 ? 's' : ''}
                        </div>
                      )}
                      {topic.tweets.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Twitter className="h-3 w-3" />
                          {topic.tweets.length} Tweet{topic.tweets.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => generateArticleFromTrending(topic)}
                >
                  Generate Article
                </Button>
              </div>
            )
          })}
        </div>

        {(!trendingData?.trending_topics || trendingData.trending_topics.length === 0) && (
          <div className="text-center py-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No trending topics available at the moment
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
