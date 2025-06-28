"use client"

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Heart, Reply, MoreHorizontal, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Comment {
  _id: string
  content: string
  author: {
    name: string
    email: string
    image?: string
  }
  createdAt: Date
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

interface CommentSectionProps {
  articleId: string
}

// Mock comments data
const mockComments: Comment[] = [
  {
    _id: '1',
    content: "This is a fascinating perspective on AI in web development. I've been using GitHub Copilot for a few months now and it's incredible how much it speeds up my workflow. The key insight about AI augmenting rather than replacing developers really resonates with me.",
    author: {
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      image: '/avatars/sarah.jpg'
    },
    createdAt: new Date('2024-12-20T14:30:00Z'),
    likes: 12,
    isLiked: false,
    replies: [
      {
        _id: '2',
        content: "I completely agree! The collaboration aspect is what makes AI tools so powerful. It's not about replacing our creativity but amplifying it.",
        author: {
          name: 'Marcus Rodriguez',
          email: 'marcus@example.com',
        },
        createdAt: new Date('2024-12-20T15:45:00Z'),
        likes: 5,
        isLiked: true,
      }
    ]
  },
  {
    _id: '3',
    content: "Great article! I'd love to see more content about specific AI tools and how to integrate them into existing workflows. Maybe a follow-up piece on prompt engineering best practices?",
    author: {
      name: 'Alex Thompson',
      email: 'alex.t@example.com',
    },
    createdAt: new Date('2024-12-20T16:20:00Z'),
    likes: 8,
    isLiked: false,
  }
]

export function CommentSection({ articleId }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const comment: Comment = {
      _id: Date.now().toString(),
      content: newComment,
      author: {
        name: session.user?.name || 'Anonymous',
        email: session.user?.email || '',
        image: session.user?.image || undefined
      },
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
    }
    
    setComments([comment, ...comments])
    setNewComment('')
    setIsSubmitting(false)
  }

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment._id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        }
      }
      return comment
    }))
  }

  const handleReply = async (parentId: string) => {
    if (!session || !replyContent.trim()) return

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const reply: Comment = {
      _id: Date.now().toString(),
      content: replyContent,
      author: {
        name: session.user?.name || 'Anonymous',
        email: session.user?.email || '',
        image: session.user?.image || undefined
      },
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
    }
    
    setComments(comments.map(comment => {
      if (comment._id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        }
      }
      return comment
    }))
    
    setReplyContent('')
    setReplyingTo(null)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
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
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
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
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
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

          {/* Comments List */}
          {comments.length > 0 && (
            <div className="space-y-6">
              <Separator />
              {comments.map((comment) => (
                <div key={comment._id} className="space-y-4">
                  {/* Main Comment */}
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 mt-1">
                      <AvatarImage src={comment.author.image || ''} alt={comment.author.name} />
                      <AvatarFallback>
                        {getInitials(comment.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.author.name}</span>
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
                          {comment.likes > 0 && comment.likes}
                        </Button>
                        {session && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        )}
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment._id && session && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                              <AvatarFallback>
                                {getInitials(session.user?.name || 'Anonymous')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <Textarea
                                placeholder={`Reply to ${comment.author.name}...`}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="min-h-[80px] resize-none border-0 bg-muted/30 focus-visible:ring-1"
                              />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleReply(comment._id)}
                                  disabled={!replyContent.trim()}
                                >
                                  Reply
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setReplyingTo(null)
                                    setReplyContent('')
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-12 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="flex gap-3">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={reply.author.image || ''} alt={reply.author.name} />
                            <AvatarFallback>
                              {getInitials(reply.author.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{reply.author.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground">
                              {reply.content}
                            </p>
                            <div className="flex items-center gap-4 pt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-muted-foreground hover:text-foreground"
                                onClick={() => handleLike(reply._id)}
                              >
                                <Heart className={cn(
                                  "h-3 w-3 mr-1",
                                  reply.isLiked && "fill-current text-red-500"
                                )} />
                                {reply.likes > 0 && reply.likes}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
