"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Sparkles, 
  Wand2, 
  Globe, 
  Twitter, 
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export function ArticleGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [topic, setTopic] = useState('')
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle')

  const trendingSources = [
    { name: 'Google Trends', icon: Globe, status: 'connected' },
    { name: 'Twitter API', icon: Twitter, status: 'connected' },
    { name: 'GitHub Trending', icon: TrendingUp, status: 'connected' },
  ]

  const recentTopics = [
    'AI Code Generation',
    'React Server Components',
    'TypeScript Performance',
    'Web3 Development',
    'Mobile-First Design'
  ]

  const handleGenerateArticle = async () => {
    if (!topic.trim()) return
    
    setIsGenerating(true)
    setGenerationStatus('generating')
    
    try {
      // Simulate AI article generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      setGenerationStatus('success')
      setTopic('')
    } catch (error) {
      setGenerationStatus('error')
    } finally {
      setIsGenerating(false)
      // Reset status after 3 seconds
      setTimeout(() => setGenerationStatus('idle'), 3000)
    }
  }

  const handleQuickGenerate = (quickTopic: string) => {
    setTopic(quickTopic)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Article Generator
        </CardTitle>
        <CardDescription>
          Generate SEO-optimized articles from trending topics using AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Trending Sources Status */}
        <div>
          <h4 className="text-sm font-medium mb-3">Data Sources</h4>
          <div className="grid gap-2 sm:grid-cols-3">
            {trendingSources.map((source) => (
              <div key={source.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <source.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{source.name}</span>
                <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Topic Input */}
        <div className="space-y-4">
          <div>
            <label htmlFor="topic" className="text-sm font-medium mb-2 block">
              Article Topic
            </label>
            <div className="flex gap-2">
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Latest trends in React development"
                disabled={isGenerating}
                className="flex-1"
              />
              <Button
                onClick={handleGenerateArticle}
                disabled={!topic.trim() || isGenerating}
                className="px-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Generation Status */}
          {generationStatus !== 'idle' && (
            <div className={`p-3 rounded-lg border ${
              generationStatus === 'generating' ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' :
              generationStatus === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' :
              'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {generationStatus === 'generating' && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Generating article from trending data...
                    </span>
                  </>
                )}
                {generationStatus === 'success' && (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Article generated successfully! Check the articles list.
                    </span>
                  </>
                )}
                {generationStatus === 'error' && (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                      Failed to generate article. Please try again.
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Quick Topics */}
          <div>
            <h4 className="text-sm font-medium mb-2">Trending Topics</h4>
            <div className="flex flex-wrap gap-2">
              {recentTopics.map((quickTopic) => (
                <Badge
                  key={quickTopic}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => handleQuickGenerate(quickTopic)}
                >
                  {quickTopic}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Features */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">AI Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• SEO-optimized content</li>
              <li>• Trending keywords integration</li>
              <li>• Meta tags generation</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Content Quality</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Technical accuracy</li>
              <li>• Developer-focused writing</li>
              <li>• Code examples included</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
