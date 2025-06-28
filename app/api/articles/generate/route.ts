import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
You are a technical blog writer specializing in programming and web development.

Write a comprehensive, detailed technical article on: "${topic}"

The article should follow this exact format structure:
- Title: Engaging and descriptive (60-80 characters)
- Multiple sections with ## headings
- Subsections with ### headings  
- Bullet points with practical examples
- Code-focused content with technical depth
- Real-world applications and use cases
- Actionable advice for developers
- Professional conclusions

Make it similar in style and depth to: "The Future of AI in Web Development: What Developers Need to Know in 2025"

Write 1500-2500 words with:
- Clear introduction explaining the topic's importance
- Current state and landscape overview
- Key areas of transformation/implementation
- Skills/tools developers need
- Future outlook and roadmap
- Practical conclusion with actionable insights

Use markdown formatting with proper headers, bullet points, numbered lists, and **bold** text for emphasis.

Respond in valid JSON with the following structure:
{
  "title": "Article title (60–80 characters)",
  "excerpt": "Comprehensive summary explaining what readers will learn (150–200 characters)",
  "content": "Full markdown formatted article content (1500–2500 words)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "Relevant category",
  "metaTitle": "SEO optimized meta title",
  "metaDescription": "SEO meta description (150-160 characters)"
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()

    let articleData
    try {
      articleData = JSON.parse(responseText)
    } catch {
      // Fallback if not valid JSON
      articleData = {
        title: topic,
        excerpt: `A comprehensive guide to ${topic}`,
        content: responseText,
        tags: [topic.toLowerCase()],
        category: "Technology",
        metaTitle: topic,
        metaDescription: `Learn about ${topic} in this comprehensive guide`
      }
    }

    const slug = generateSlug(articleData.title)

    const article = {
      title: articleData.title,
      slug,
      excerpt: articleData.excerpt,
      content: articleData.content,
      author: "AI Assistant",
      tags: articleData.tags || [],
      publishedAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      readTime: Math.ceil(articleData.content.split(' ').length / 200),
      featured: false,
      meta: {
        title: articleData.metaTitle || articleData.title,
        description: articleData.metaDescription || articleData.excerpt,
        keywords: articleData.tags || []
      }
    }

    const client = await clientPromise
    const db = client.db("trendwise")
    const resultDB = await db.collection("articles").insertOne(article)

    return NextResponse.json({ ...article, _id: resultDB.insertedId }, { status: 201 })

  } catch (error) {
    console.error("Error generating article:", error)
    return NextResponse.json({ error: "Failed to generate article" }, { status: 500 })
  }
}
