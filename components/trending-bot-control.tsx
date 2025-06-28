'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Bot, 
  Globe, 
  Github, 
  RefreshCcw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  TrendingUp,
  Database,
  PlayCircle
} from 'lucide-react'

interface TrendingSource {
  name: string
  icon: React.ComponentType<any>
  status: 'active' | 'inactive' | 'error'
  lastUpdate: string
  topics: number
}

export function TrendingBotControl() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshStatus, setRefreshStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [refreshMessage, setRefreshMessage] = useState('')

  const sources: TrendingSource[] = [
    {
      name: 'Google Trends',
      icon: Globe,
      status: 'active',
      lastUpdate: '15 minutes ago',
      topics: 8
    },
    {
      name: 'GitHub Trending',
      icon: Github,
      status: 'active',
      lastUpdate: '15 minutes ago',
      topics: 5
    },
    {
      name: 'Hacker News',
      icon: TrendingUp,
      status: 'active',
      lastUpdate: '15 minutes ago',
      topics: 7
    }
  ]

  const handleRefreshTrending = async () => {
    setIsRefreshing(true)
    setRefreshStatus('running')
    setRefreshMessage('Fetching latest trending topics...')

    try {
      const response = await fetch('/api/trending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (result.success) {
        setRefreshStatus('success')
        setRefreshMessage(`Successfully refreshed ${result.topics?.length || 0} trending topics`)
        setLastRefresh(new Date())
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setRefreshStatus('idle')
          setRefreshMessage('')
        }, 5000)
      } else {
        setRefreshStatus('error')
        setRefreshMessage(result.message || 'Failed to refresh trending topics')
      }
    } catch (error) {
      console.error('Error refreshing trending topics:', error)
      setRefreshStatus('error')
      setRefreshMessage('Network error occurred while refreshing')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleAutoGenerate = async () => {
    setIsRefreshing(true)
    setRefreshStatus('running')
    setRefreshMessage('Starting automated article generation from trending topics...')

    try {
      // Trigger the backend bot
      const response = await fetch('/api/bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'trigger' })
      })

      const result = await response.json()

      if (result.success) {
        setRefreshStatus('success')
        setRefreshMessage('Automated article generation completed successfully!')
        setLastRefresh(new Date())
        
        // Auto-hide success message after 8 seconds
        setTimeout(() => {
          setRefreshStatus('idle')
          setRefreshMessage('')
        }, 8000)
      } else {
        setRefreshStatus('error')
        setRefreshMessage(result.error || 'Failed to trigger automated generation')
      }
    } catch (error) {
      console.error('Error in auto-generation:', error)
      setRefreshStatus('error')
      setRefreshMessage('Network error occurred during automated generation')
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Trending Bot Control
        </CardTitle>
        <CardDescription>
          Monitor and control the trending topics crawler and content generation bot
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div>
          <h4 className="text-sm font-medium mb-3">Data Sources Status</h4>
          <div className="grid gap-3">
            {sources.map((source) => (
              <div key={source.name} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <source.icon className="h-4 w-4" />
                  <div>
                    <span className="text-sm font-medium">{source.name}</span>
                    <p className="text-xs text-muted-foreground">{source.topics} topics found</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={source.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {source.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {source.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {source.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{source.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Control Actions */}
        <div>
          <h4 className="text-sm font-medium mb-3">Manual Controls</h4>
          <div className="space-y-3">
            <Button 
              onClick={handleRefreshTrending}
              disabled={isRefreshing}
              className="w-full"
              variant="outline"
            >
              {isRefreshing ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing Trending Topics...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh Trending Topics
                </>
              )}
            </Button>

            <Button 
              onClick={handleAutoGenerate}
              disabled={isRefreshing}
              className="w-full"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Auto-Generate Articles from Trends
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {refreshStatus !== 'idle' && (
          <div className={`p-3 rounded-lg border ${
            refreshStatus === 'success' 
              ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
              : refreshStatus === 'error'
              ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
              : 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
          }`}>
            <div className="flex items-start gap-2">
              {refreshStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
              {refreshStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />}
              {refreshStatus === 'running' && <Clock className="h-4 w-4 text-blue-600 mt-0.5 animate-pulse" />}
              <div>
                <p className={`text-sm font-medium ${
                  refreshStatus === 'success' 
                    ? 'text-green-700 dark:text-green-300' 
                    : refreshStatus === 'error'
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-blue-700 dark:text-blue-300'
                }`}>
                  {refreshMessage}
                </p>
                {lastRefresh && refreshStatus === 'success' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Schedule Information */}
        <div>
          <h4 className="text-sm font-medium mb-3">Automation Schedule</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Trending topics refresh: Every 1 hour</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-3 w-3" />
              <span>Database cleanup: Daily at midnight</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              <span>Auto article generation: On-demand</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
