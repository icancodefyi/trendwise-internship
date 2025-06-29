import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, Eye, Share2, Bookmark, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommentSection } from '@/components/comment-section'
import { Article } from '@/types/article'
import Link from 'next/link'

// Utility function to validate and sanitize HTML content
function validateAndSanitizeHTML(content: string): string {
  if (!content) return '';
  
  // If content is a string that looks like escaped HTML, try to parse it
  if (typeof content === 'string' && content.includes('&lt;') && content.includes('&gt;')) {
    // Decode HTML entities
    content = content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'");
  }
  
  // Check if content contains HTML tags
  if (!content.includes('<')) {
    // Convert plain text to HTML with proper paragraph structure
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
    return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n');
  }
  
  // Ensure content has proper HTML structure
  if (!content.includes('<h1>') && !content.includes('<h2>') && !content.includes('<p>')) {
    // Wrap content in paragraphs if it only has basic HTML
    return `<p>${content}</p>`;
  }
  
  return content;
}

// Fetch article from API
async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`/api/articles/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })
    
    if (!res.ok) {
      return null
    }
    
    const article = await res.json()
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

// Fallback mock data for development
const getMockArticle = (slug: string): Article => ({
  _id: '1',
  title: 'The Future of AI in Web Development: What Developers Need to Know in 2025',
  slug: slug,
  excerpt: 'Explore how artificial intelligence is revolutionizing web development workflows, from code generation to automated testing, and what skills developers need to stay relevant.',
  content: `<h1>The Future of AI in Web Development</h1>
<p>Artificial Intelligence is no longer a distant concept from science fiction—it's actively reshaping how we build, test, and deploy web applications. As we move through 2025, developers who understand and leverage AI tools will have a significant competitive advantage.</p>

<h2>The Current State of AI in Development</h2>
<p>Today's development landscape already includes powerful AI-assisted tools that are transforming how we approach coding challenges:</p>
<ul>
<li><strong>Code Generation:</strong> Tools like GitHub Copilot and Claude can generate entire functions and components based on natural language descriptions</li>
<li><strong>Automated Testing:</strong> AI can create comprehensive test suites based on your codebase, identifying edge cases human testers might miss</li>
<li><strong>Bug Detection:</strong> Machine learning models can identify potential issues before they reach production, saving countless hours of debugging</li>
<li><strong>Performance Optimization:</strong> AI algorithms can suggest optimizations for better performance and resource utilization</li>
</ul>

<h2>Key Areas of Transformation</h2>

<h3>1. Code Generation and Completion</h3>
<p>Modern AI tools can understand context and generate meaningful code snippets. This isn't just autocomplete—it's intelligent code synthesis that understands your project's patterns and conventions.</p>
<blockquote>
<p>The future of coding isn't about writing every line from scratch, but about effectively communicating your intent to intelligent systems that can help bring your ideas to life.</p>
</blockquote>

<h3>2. Automated Code Review</h3>
<p>AI-powered code review tools can catch issues that human reviewers might miss, from security vulnerabilities to performance bottlenecks. These systems learn from millions of codebases to provide insights that would take years of experience to develop.</p>

<h3>3. Testing and Quality Assurance</h3>
<p>Machine learning models can generate test cases, predict edge cases, and even create end-to-end tests based on user interaction patterns. This democratizes testing and makes comprehensive coverage more achievable for teams of all sizes.</p>

<h2>Essential Skills for AI-Enhanced Development</h2>
<p>To stay relevant in an AI-enhanced development world, developers should focus on these key areas:</p>
<ol>
<li><strong>AI Tool Proficiency:</strong> Learn to work effectively with AI coding assistants and understand their capabilities and limitations</li>
<li><strong>Prompt Engineering:</strong> Develop skills in communicating effectively with AI systems to get the best results</li>
<li><strong>AI Ethics and Responsibility:</strong> Understand the implications and limitations of AI-generated code, including potential biases and security concerns</li>
<li><strong>Human-AI Collaboration:</strong> Learn when to trust AI recommendations and when to rely on human judgment and creativity</li>
<li><strong>System Architecture:</strong> Focus on high-level design and architecture skills that require human insight and strategic thinking</li>
</ol>

<h2>The Road Ahead</h2>
<p>The future of web development isn't about AI replacing developers—it's about developers who use AI replacing those who don't. The key is to view AI as a powerful tool that augments human creativity and problem-solving abilities rather than a threat to the profession.</p>

<p>As we continue to see advancements in AI technology, the developers who thrive will be those who can effectively collaborate with AI systems while maintaining their critical thinking and creative problem-solving skills. The focus will shift from writing boilerplate code to solving complex problems, designing elegant architectures, and creating innovative user experiences.</p>

<h2>Conclusion</h2>
<p>The integration of AI into web development workflows is inevitable and already happening at an unprecedented pace. By understanding these tools and adapting our skills accordingly, we can leverage AI to build better applications faster while focusing on the high-level creative and strategic aspects of development that truly require human insight.</p>

<p>The developers who embrace this change today will be the ones leading the industry tomorrow. Start experimenting with AI tools, develop your prompt engineering skills, and always remember that the goal is not to be replaced by AI, but to become a more effective developer through AI collaboration.</p>`,
  author: 'TrendWise AI',
  publishedAt: new Date('2024-12-20'),
  updatedAt: new Date('2024-12-20'),
  tags: ['AI', 'Web Development', 'Future Tech', 'Programming'],
  readTime: 8,
  views: 1247,
  featured: true,
  meta: {
    title: 'The Future of AI in Web Development',
    description: 'AI revolutionizing web development workflows',
    keywords: ['AI', 'web development', 'programming']
  }
})

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticle(slug) || getMockArticle(slug)
  
  // Ensure publishedAt is a Date object
  if (article) {
    article.publishedAt = new Date(article.publishedAt);
  }
  
  // Use the enhanced meta fields if available, otherwise fall back to basic fields
  const metaTitle = article.metaTitle || article.meta?.title || article.title
  const metaDescription = article.metaDescription || article.meta?.description || article.excerpt
  const ogTitle = article.ogTitle || article.openGraph?.title || article.title
  const ogDescription = article.ogDescription || article.openGraph?.description || article.excerpt
  const ogImage = article.openGraph?.image || article.media?.image || 
                  (article.media?.images && article.media.images.length > 0 ? article.media.images[0] : null)
  
  console.log('Metadata generation:', {
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage
  })
  
  return {
    title: metaTitle,
    description: metaDescription,
    keywords: article.ogKeywords || article.meta?.keywords || article.tags,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: article.openGraph?.type || 'article',
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.author],
      tags: article.tags,
      images: ogImage ? [ogImage] : [],
      url: `/article/${slug}`,
      siteName: 'TrendWise Blog'
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : []
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  const finalArticle = article || getMockArticle(slug);

  if (!finalArticle && article === null) {
    notFound();
  }

  // Debug logging for content and meta tags
  console.log('Article meta debug:', {
    title: finalArticle.title,
    metaTitle: finalArticle.metaTitle,
    ogTitle: finalArticle.ogTitle,
    meta: finalArticle.meta,
    openGraph: finalArticle.openGraph,
    media: finalArticle.media
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {finalArticle.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight text-foreground">
            {finalArticle.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {finalArticle.excerpt}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder-avatar.jpg" alt={finalArticle.author} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {finalArticle.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{finalArticle.author}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(finalArticle.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {finalArticle.readTime} min read
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {finalArticle.views.toLocaleString()} views
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        <Separator className="mb-12" />

        {/* Article Content */}
        <Card className="mb-12 border-0 shadow-none">
          <CardContent className="px-0">
            <div 
              className="max-w-none
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-8 [&_h1]:mt-8 [&_h1]:first:mt-0 [&_h1]:text-foreground [&_h1]:tracking-tight
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-6 [&_h2]:mt-10 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-border [&_h2]:text-foreground
                [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:text-foreground
                [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mb-3 [&_h4]:mt-6 [&_h4]:text-foreground
                [&_h5]:text-lg [&_h5]:font-semibold [&_h5]:mb-2 [&_h5]:mt-4 [&_h5]:text-foreground
                [&_h6]:text-base [&_h6]:font-semibold [&_h6]:mb-2 [&_h6]:mt-4 [&_h6]:text-foreground
                [&_p]:mb-6 [&_p]:leading-relaxed [&_p]:text-foreground/90
                [&_ul]:my-6 [&_ul]:space-y-2
                [&_ol]:my-6 [&_ol]:space-y-2
                [&_li]:leading-relaxed [&_li]:ml-6 [&_li]:text-foreground/90
                [&_ul>li]:list-disc
                [&_ol>li]:list-decimal
                [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-6 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:bg-muted/30 [&_blockquote]:py-4 [&_blockquote]:rounded-r-lg
                [&_blockquote_p]:mb-0 [&_blockquote_p]:text-muted-foreground
                [&_strong]:text-foreground [&_strong]:font-semibold
                [&_em]:italic [&_em]:text-foreground/90
                [&_code]:bg-muted [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-foreground [&_code]:border
                [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:border
                [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:border-0
                [&_a]:text-primary [&_a]:hover:text-primary/80 [&_a]:underline [&_a]:decoration-primary/30 [&_a]:hover:decoration-primary/60 [&_a]:transition-colors
                [&_img]:rounded-lg [&_img]:my-8 [&_img]:max-w-full [&_img]:h-auto [&_img]:border
                [&_hr]:my-8 [&_hr]:border-border
                [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-8 [&_iframe]:border
                [&_.video-container]:my-8 [&_.video-container]:rounded-lg [&_.video-container]:overflow-hidden [&_.video-container]:border
                [&_.video-section]:my-8
                [&_.article-image]:my-8 [&_.article-image]:text-center
                [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-border [&_table]:my-6
                [&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-2 [&_th]:bg-muted [&_th]:font-semibold [&_th]:text-left
                [&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2
                [&_.content-wrapper]:space-y-4
                [&_.content-wrapper_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: validateAndSanitizeHTML(finalArticle.content) }}
            />
          </CardContent>
        </Card>

        {/* Media Section - Videos and Tweets */}
        {(finalArticle.media?.videos?.length || finalArticle.media?.tweets?.length) && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Related Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Videos */}
              {finalArticle.media?.videos && finalArticle.media.videos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
                  <div className="space-y-6">
                    {finalArticle.media.videos.map((video, index) => (
                      <div key={index} className="video-container rounded-lg overflow-hidden border">
                        <iframe
                          src={video}
                          title={`Related video ${index + 1}`}
                          className="w-full aspect-video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tweets */}
              {finalArticle.media?.tweets && finalArticle.media.tweets.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Related Tweets</h3>
                  <div className="space-y-4">
                    {finalArticle.media.tweets.map((tweet, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">𝕏</span>
                          </div>
                          <span className="text-sm text-muted-foreground">Related Tweet</span>
                        </div>
                        <p className="text-sm">{tweet}</p>
                        <a 
                          href={typeof tweet === 'string' && tweet.startsWith('http') ? tweet : '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-2 inline-block"
                        >
                          View on Twitter →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Comments Section */}
        <CommentSection articleId={finalArticle._id || 'mock-article-id'} />
      </div>
    </div>
  );
}