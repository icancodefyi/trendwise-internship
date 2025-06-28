"use client"

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Image,
  Video,
  Twitter
} from 'lucide-react'

interface BlogFormData {
  title: string
  excerpt: string
  content: string
  images: string[]
  videos: string[]
  tweets: string[]
}

export function BlogForm() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    content: '',
    images: [],
    videos: [],
    tweets: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
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
        meta: {
          title: formData.title.trim(),
          description: formData.excerpt.trim() || formData.content.substring(0, 160).trim(),
          keywords: []
        },
        media: {
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
        tweets: []
      })
      setMediaInputs({
        image: '',
        video: '',
        tweet: ''
      })

      // Refresh the page after 2 seconds
      setTimeout(() => {
        window.location.reload()
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
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to create a blog post.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Create New Blog Post
        </CardTitle>
        <CardDescription>
          Write and publish your blog post with media content
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              rows={3}
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
              rows={12}
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                      Blog post created successfully! Refreshing page...
                    </span>
                  </>
                )}
                {submitStatus === 'error' && (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                      Failed to create blog post. Please try again.
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
                Creating Blog Post...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Blog Post
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
