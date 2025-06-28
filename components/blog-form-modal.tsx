"use client"

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Image,
  Video,
  Twitter,
  Sparkles,
  Wand2,
  User
} from 'lucide-react'

interface BlogFormData {
  title: string
  excerpt: string
  content: string
  images: string[]
  videos: string[]
  tweets: string[]
  meta?: {
    title: string
    description: string
    keywords: string[]
  }
  openGraph?: {
    title: string
    description: string
    image?: string
    type: string
  }
}

export function BlogFormModal() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    content: '',
    images: [],
    videos: [],
    tweets: [],
    meta: undefined,
    openGraph: undefined
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle')
  const [aiTopic, setAiTopic] = useState('')
  const [mediaInputs, setMediaInputs] = useState({
    image: '',
    video: '',
    tweet: ''
  })

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim() || isGenerating) return
    
    setIsGenerating(true)
    setGenerationStatus('generating')
    
    try {
      const response = await fetch('/api/articles/generate-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: aiTopic.trim()
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate article')
      }

      const result = await response.json()
      
      console.log('AI generation result:', {
        title: result.title,
        meta: result.meta,
        openGraph: result.openGraph,
        media: result.media
      })
      
      // Pre-fill the form with generated content including media (this is just draft content, not saved)
      setFormData(prev => ({
        ...prev,
        title: result.title || aiTopic,
        excerpt: result.excerpt || '',
        content: result.content || '',
        images: result.media?.image ? [result.media.image] : [],
        videos: result.media?.videos || [],
        tweets: result.media?.tweets || [],
        meta: result.meta || undefined,
        openGraph: result.openGraph || undefined
      }))
      
      setGenerationStatus('success')
      setAiTopic('')
      
    } catch (error) {
      console.error('Error generating article:', error)
      setGenerationStatus('error')
    } finally {
      setIsGenerating(false)
      // Reset status after 5 seconds
      setTimeout(() => setGenerationStatus('idle'), 5000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user || !formData.title.trim() || !formData.content.trim() || isSubmitting) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const slug = generateSlug(formData.title)
      
      const blogData = {
        title: formData.title.trim(),
        slug,
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 200).trim() + '...',
        content: formData.content.trim(),
        meta: formData.meta || {
          title: formData.title.trim(),
          description: formData.excerpt.trim() || formData.content.substring(0, 160).trim(),
          keywords: []
        },
        openGraph: formData.openGraph || {
          title: formData.title.trim(),
          description: formData.excerpt.trim() || formData.content.substring(0, 160).trim(),
          image: formData.images.length > 0 ? formData.images[0] : undefined,
          type: 'article'
        },
        // Include additional meta fields from AI generation
        metaTitle: formData.meta?.title,
        metaDescription: formData.meta?.description,
        ogTitle: formData.openGraph?.title,
        ogDescription: formData.openGraph?.description,
        ogKeywords: formData.meta?.keywords,
        media: {
          image: formData.images.length > 0 ? formData.images[0] : undefined,
          images: formData.images.filter(url => url.trim()),
          videos: formData.videos.filter(url => url.trim()),
          tweets: formData.tweets.filter(url => url.trim())
        },
        author: session.user.name || 'Anonymous',
        tags: [],
        featured: false,
        readTime: Math.ceil(formData.content.split(' ').length / 200)
      }

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create blog')
      }

      setSubmitStatus('success')
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        images: [],
        videos: [],
        tweets: [],
        meta: undefined,
        openGraph: undefined
      })
      setMediaInputs({
        image: '',
        video: '',
        tweet: ''
      })

      // Close modal after 2 seconds without auto-refresh
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          // Close the modal by triggering a custom event or handle it through parent component
          // For now, we'll reload but this could be improved to just close the modal
          window.location.reload()
        }
      }, 2000)

    } catch (error) {
      console.error('Error creating blog:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  const addMediaItem = (type: 'image' | 'video' | 'tweet') => {
    const url = mediaInputs[type].trim()
    if (!url) return

    setFormData(prev => ({
      ...prev,
      [`${type}s`]: [...prev[`${type}s` as keyof typeof prev] as string[], url]
    }))
    setMediaInputs(prev => ({
      ...prev,
      [type]: ''
    }))
  }

  const removeMediaItem = (type: 'images' | 'videos' | 'tweets', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: (prev[type] as string[]).filter((_, i) => i !== index)
    }))
  }

  if (!session?.user) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Please log in to create a blog post.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Generation Section */}
      <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-purple-900 dark:text-purple-100">AI Assistant</h4>
            <span className="text-xs bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full text-purple-700 dark:text-purple-300">
              Optional - Generate content to help you get started
            </span>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="Enter a topic to generate draft content (you can edit before publishing)..."
              disabled={isGenerating || isSubmitting}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleGenerateWithAI}
              disabled={!aiTopic.trim() || isGenerating || isSubmitting}
              variant="outline"
              className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-800/50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Draft
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-purple-600 dark:text-purple-300">
              💡 AI will help you create a draft. You can then edit and customize it before publishing as your own article.
            </p>

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
                      Generating draft content with AI... This may take a moment.
                    </span>
                  </>
                )}
                {generationStatus === 'success' && (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Draft content generated successfully! Edit and customize it below, then publish as your article.
                      {formData.images.length > 0 && ` Found ${formData.images.length} image(s).`}
                      {formData.videos.length > 0 && ` Found ${formData.videos.length} video(s).`}
                      {formData.tweets.length > 0 && ` Found ${formData.tweets.length} tweet(s).`}
                    </span>
                  </>
                )}
                {generationStatus === 'error' && (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                      Failed to generate draft content. Please check your API configuration and try again.
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Author Information */}
      <div className="p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Publishing as:</p>
            <p className="text-lg font-semibold text-primary">{session.user?.name || 'Anonymous'}</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter blog title..."
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt (Optional)</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Brief description of your blog post..."
          disabled={isSubmitting}
          rows={2}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          If left empty, will be auto-generated from content
        </p>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Write your blog content here..."
          disabled={isSubmitting}
          required
          rows={8}
          className="resize-none"
        />
      </div>

      <Separator />

      {/* Media Section */}
      <div className="space-y-6">
        <h4 className="font-medium">Media Content (Optional)</h4>
        
        {/* Images */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Images
          </Label>
          <div className="flex gap-2">
            <Input
              value={mediaInputs.image}
              onChange={(e) => setMediaInputs(prev => ({ ...prev, image: e.target.value }))}
              placeholder="Image URL..."
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addMediaItem('image')}
              disabled={!mediaInputs.image.trim() || isSubmitting}
            >
              Add
            </Button>
          </div>
          {formData.images.length > 0 && (
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {formData.images.map((url, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <span className="text-sm flex-1 truncate">{url}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMediaItem('images', index)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos
          </Label>
          <div className="flex gap-2">
            <Input
              value={mediaInputs.video}
              onChange={(e) => setMediaInputs(prev => ({ ...prev, video: e.target.value }))}
              placeholder="Video URL..."
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addMediaItem('video')}
              disabled={!mediaInputs.video.trim() || isSubmitting}
            >
              Add
            </Button>
          </div>
          {formData.videos.length > 0 && (
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {formData.videos.map((url, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <span className="text-sm flex-1 truncate">{url}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMediaItem('videos', index)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tweets */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Tweets
          </Label>
          <div className="flex gap-2">
            <Input
              value={mediaInputs.tweet}
              onChange={(e) => setMediaInputs(prev => ({ ...prev, tweet: e.target.value }))}
              placeholder="Tweet URL..."
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addMediaItem('tweet')}
              disabled={!mediaInputs.tweet.trim() || isSubmitting}
            >
              Add
            </Button>
          </div>
          {formData.tweets.length > 0 && (
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {formData.tweets.map((url, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <span className="text-sm flex-1 truncate">{url}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMediaItem('tweets', index)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Status */}
      {submitStatus !== 'idle' && (
        <div className={`p-3 rounded-lg border ${
          submitStatus === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' :
          'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {submitStatus === 'success' && (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Your article has been published successfully! Refreshing page...
                </span>
              </>
            )}
            {submitStatus === 'error' && (
              <>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Failed to publish your article. Please try again.
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!formData.title.trim() || !formData.content.trim() || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publishing Your Article...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Publish My Article
          </>
        )}
      </Button>
    </form>
  )
}
