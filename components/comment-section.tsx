"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Heart, Reply, MoreHorizontal, Calendar, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Comment {
  _id: string
  articleId: string
  userId: string
  userName: string
  userImage?: string
  content: string
  createdAt: string | Date
  updatedAt: string | Date
  likes?: number
  isLiked?: boolean
  replies?: Comment[]
}

interface CommentSectionProps {
  articleId: string
}

// Fallback comments for when API is not available
const fallbackComments: Comment[] = []

export function CommentSection({ articleId }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/comments?articleId=${articleId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }
      
      const fetchedComments = await response.json()
      setComments(fetchedComments.length > 0 ? fetchedComments : fallbackComments)
    } catch (error) {
      console.error('Error fetching comments:', error)
      setError('Failed to load comments')
      // Use fallback comments when API fails
      setComments(fallbackComments)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId,
          content: newComment.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to post comment')
      }

      const newCommentData = await response.json()
      
      // Add the new comment to the beginning of the list
      setComments([newCommentData, ...comments])
      setNewComment('')
    } catch (error) {
      console.error('Error posting comment:', error)
      setError('Failed to post comment. Please try again.')
      
      // Fallback: Add comment locally if API fails
      const fallbackComment: Comment = {
        _id: `temp-${Date.now()}`,
        articleId,
        userId: session.user?.email || '',
        userName: session.user?.name || 'Anonymous',
        userImage: session.user?.image || undefined,
        content: newComment.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        isLiked: false,
      }
      
      setComments([fallbackComment, ...comments])
      setNewComment('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment._id === commentId) {
        const currentLikes = comment.likes || 0
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? currentLikes - 1 : currentLikes + 1
        }
      }
      return comment
    }))
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60))
        return `${minutes}m ago`
      }
      return `${hours}h ago`
    } else if (days === 1) {
      return '1 day ago'
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments ({comments.length})
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Message */}
          {error && !isLoading && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Comment Form */}
          {session ? (
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 mt-1">
                  <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                  <AvatarFallback>
                    {getInitials(session.user?.name || 'Anonymous')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Share your thoughts on this article..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-none border-0 bg-muted/50 focus-visible:ring-1"
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Logged in as <span className="font-medium">{session.user?.name}</span>
                    </p>
                    <Button 
                      type="submit" 
                      disabled={!newComment.trim() || isSubmitting}
                      size="sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        'Post Comment'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">Join the Discussion</h3>
                <p className="text-muted-foreground mb-4">
                  Sign in to share your thoughts and engage with the community
                </p>
                <Button asChild>
                  <a href="/login">Sign In to Comment</a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && comments.length === 0 && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Comments List */}
          {!isLoading && comments.length > 0 && (
            <div className="space-y-6">
              <Separator />
              {comments.map((comment) => (
                <div key={comment._id} className="space-y-4">
                  {/* Main Comment */}
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 mt-1">
                      <AvatarImage src={comment.userImage || ''} alt={comment.userName} />
                      <AvatarFallback>
                        {getInitials(comment.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.userName}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-4 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleLike(comment._id)}
                        >
                          <Heart className={cn(
                            "h-4 w-4 mr-1",
                            comment.isLiked && "fill-current text-red-500"
                          )} />
                          {(comment.likes || 0) > 0 && (comment.likes || 0)}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && comments.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your thoughts on this article!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
