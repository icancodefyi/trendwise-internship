import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, Eye, Share2, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommentSection } from '@/components/comment-section'
import { Article } from '@/types/article'

// Fetch article from API
async function getArticle(slug: string): Promise<Article | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/articles/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })
    
    if (!res.ok) {
      return null
    }
    
    return res.json()
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
  content: `# The Future of AI in Web Development

Artificial Intelligence is no longer a distant concept from science fiction—it's actively reshaping how we build, test, and deploy web applications. As we move through 2025, developers who understand and leverage AI tools will have a significant competitive advantage.

## The Current State of AI in Development

Today's development landscape already includes powerful AI-assisted tools:

- **Code Generation**: Tools like GitHub Copilot and Claude can generate entire functions and components
- **Automated Testing**: AI can create comprehensive test suites based on your codebase
- **Bug Detection**: Machine learning models can identify potential issues before they reach production
- **Performance Optimization**: AI algorithms can suggest optimizations for better performance

## Key Areas of Transformation

### 1. Code Generation and Completion

Modern AI tools can understand context and generate meaningful code snippets. This isn't just autocomplete—it's intelligent code synthesis that understands your project's patterns and conventions.

### 2. Automated Code Review

AI-powered code review tools can catch issues that human reviewers might miss, from security vulnerabilities to performance bottlenecks.

### 3. Testing and Quality Assurance

Machine learning models can generate test cases, predict edge cases, and even create end-to-end tests based on user interaction patterns.

## Skills Developers Need to Develop

To stay relevant in an AI-enhanced development world, focus on:

1. **AI Tool Proficiency**: Learn to work effectively with AI coding assistants
2. **Prompt Engineering**: Understand how to communicate effectively with AI systems
3. **AI Ethics**: Understand the implications and limitations of AI-generated code
4. **Human-AI Collaboration**: Learn when to trust AI and when to rely on human judgment

## The Road Ahead

The future of web development isn't about AI replacing developers—it's about developers who use AI replacing those who don't. The key is to view AI as a powerful tool that augments human creativity and problem-solving abilities.

As we continue to see advancements in AI technology, the developers who thrive will be those who can effectively collaborate with AI systems while maintaining their critical thinking and creative problem-solving skills.

## Conclusion

The integration of AI into web development workflows is inevitable and already happening. By understanding these tools and adapting our skills accordingly, we can leverage AI to build better applications faster while focusing on the high-level creative and strategic aspects of development that truly require human insight.`,
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
  
  return {
    title: article.meta.title,
    description: article.meta.description,
    keywords: article.meta.keywords,
    openGraph: {
      title: article.title,
      description: article.meta.description,
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.author],
      tags: article.tags,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  const finalArticle = article || getMockArticle(slug);

  if (!finalArticle && article === null) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Article Header */}
      <header className="mb-12">
        <div className="flex flex-wrap gap-2 mb-6">
          {finalArticle.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          {finalArticle.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          {finalArticle.excerpt}
        </p>

        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-avatar.jpg" alt={finalArticle.author} />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-lg">{finalArticle.author}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-5 w-5" />
                  {new Date(finalArticle.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  {finalArticle.readTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-5 w-5" />
                  {finalArticle.views.toLocaleString()} views
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bookmark className="h-5 w-5 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <Separator className="mb-12" />

      {/* Article Content */}
      <Card className="mb-12 border-0 shadow-lg">
        <CardContent className="p-12">
          <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-li:leading-relaxed prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-6 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-3xl font-semibold mt-8 mb-4 border-b border-border pb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-2xl font-medium mt-6 mb-3">{children}</h3>,
                p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>,
                ul: ({ children }) => <ul className="my-4 space-y-2">{children}</ul>,
                li: ({ children }) => <li className="ml-4 leading-relaxed">{children}</li>,
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{children}</code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted/50 border rounded-lg p-4 overflow-x-auto my-6">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/30 pl-4 my-6 italic text-muted-foreground">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {finalArticle.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection articleId={finalArticle._id || 'mock-article-id'} />
    </div>
  );
}