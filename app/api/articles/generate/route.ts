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
You are a professional technical blog writer specializing in programming and web development.

Write a comprehensive, detailed technical article on: "${topic}"

CRITICAL REQUIREMENTS:
1. You MUST respond with ONLY valid JSON - no extra text, no markdown formatting, no code blocks
2. The content field MUST contain raw HTML (not escaped) with semantic tags
3. Follow this EXACT JSON structure (no deviations):

{
  "title": "Article title (60-80 characters)",
  "excerpt": "Comprehensive summary (150-200 characters)",
  "content": "Full HTML formatted article content (RAW HTML, NOT ESCAPED)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "Technology",
  "metaTitle": "SEO optimized meta title",
  "metaDescription": "SEO meta description (150-160 characters)"
}

HTML CONTENT STRUCTURE (use exactly these tags - RAW HTML, NOT ESCAPED):
<h1>Main Article Title</h1>
<p>Introduction paragraph explaining the topic's importance and what readers will learn. Make this compelling and informative.</p>

<h2>Current State and Overview</h2>
<p>Detailed explanation of the current landscape and why this topic matters in today's development world...</p>
<ul>
<li><strong>Key Point 1:</strong> Detailed explanation with practical insights</li>
<li><strong>Key Point 2:</strong> Detailed explanation with real-world applications</li>
<li><strong>Key Point 3:</strong> Detailed explanation with actionable advice</li>
<li><strong>Key Point 4:</strong> Additional important consideration</li>
</ul>

<h2>Key Areas of Implementation</h2>
<h3>Area 1: Specific Implementation Topic</h3>
<p>Detailed explanation with practical examples and code concepts...</p>
<blockquote>
<p>Important insight, quote, or key takeaway that highlights the significance of this topic</p>
</blockquote>

<h3>Area 2: Another Specific Implementation Topic</h3>
<p>More detailed content with actionable advice and best practices...</p>

<h3>Area 3: Advanced Considerations</h3>
<p>Advanced topics and considerations for experienced developers...</p>

<h2>Tools and Technologies</h2>
<p>Overview of essential tools and technologies relevant to this topic...</p>
<ol>
<li><strong>Tool/Technology 1:</strong> Comprehensive description, benefits, and use cases</li>
<li><strong>Tool/Technology 2:</strong> Detailed explanation of capabilities and advantages</li>
<li><strong>Tool/Technology 3:</strong> Practical applications and implementation guidance</li>
<li><strong>Tool/Technology 4:</strong> Additional important tool or framework</li>
<li><strong>Tool/Technology 5:</strong> Emerging or complementary technology</li>
</ol>

<h2>Best Practices and Implementation Strategies</h2>
<p>Practical advice and proven implementation strategies that developers can apply immediately...</p>
<ul>
<li><strong>Practice 1:</strong> Specific actionable advice</li>
<li><strong>Practice 2:</strong> Important implementation consideration</li>
<li><strong>Practice 3:</strong> Performance and optimization tip</li>
<li><strong>Practice 4:</strong> Security and reliability consideration</li>
</ul>

<h2>Common Challenges and Solutions</h2>
<p>Address typical obstacles developers face and provide practical solutions...</p>

<h2>Future Outlook and Trends</h2>
<p>What developers should expect and prepare for in the coming years...</p>

<h2>Conclusion</h2>
<p>Comprehensive summary of key takeaways and actionable insights. Include specific next steps developers can take to implement these concepts.</p>

ARTICLE REQUIREMENTS:
- Write 2000-3000 words of substantial, technical content
- Use semantic HTML tags: h1, h2, h3, p, ul, ol, li, strong, em, blockquote
- Include practical examples and actionable advice throughout
- Focus on technical depth and real-world applications
- End with clear, actionable conclusions
- Use RAW HTML tags (not escaped) - example: <h1> not &lt;h1&gt;
- Make content comprehensive and valuable for developers

RESPOND WITH ONLY THE JSON OBJECT - NO MARKDOWN, NO CODE BLOCKS, NO EXTRA TEXT.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()

    let articleData
    try {
      // Clean the response text to extract JSON
      let cleanedResponse = responseText.trim()
      
      // Remove any markdown code blocks if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      articleData = JSON.parse(cleanedResponse)
      
      // Validate that content is in HTML format
      if (!articleData.content || !articleData.content.includes('<')) {
        throw new Error('Content is not in HTML format')
      }
      
      // Ensure content is properly formatted HTML (decode any escaped entities)
      if (typeof articleData.content === 'string') {
        articleData.content = articleData.content
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&#39;/g, "'");
      }
      
    } catch (error) {
      console.log('JSON parsing failed, generating fallback HTML content:', error)
      // Fallback: Generate proper HTML content from the topic
      const htmlContent = `<h1>${topic}</h1>
<p>This is a comprehensive guide to ${topic} that covers the essential aspects and latest developments in this important technology area.</p>

<h2>Overview</h2>
<p>Understanding ${topic} is crucial for modern developers and technology professionals. This article explores the key concepts, best practices, and future implications.</p>

<h2>Key Benefits</h2>
<ul>
<li><strong>Improved Efficiency:</strong> Enhanced workflow and productivity gains</li>
<li><strong>Better Performance:</strong> Optimized solutions and faster execution</li>
<li><strong>Enhanced User Experience:</strong> More intuitive and responsive applications</li>
<li><strong>Future-Ready Architecture:</strong> Scalable and maintainable solutions</li>
</ul>

<h2>Implementation Strategies</h2>
<p>When implementing ${topic}, consider these proven approaches and methodologies that have been successfully used in production environments.</p>

<h3>Best Practices</h3>
<p>Following industry best practices ensures reliable and maintainable implementations that can scale with your needs.</p>

<h2>Common Challenges</h2>
<p>While ${topic} offers many advantages, there are important considerations and potential challenges to be aware of during implementation.</p>

<h2>Conclusion</h2>
<p>As technology continues to evolve, ${topic} represents an important advancement that can significantly benefit development teams and end users alike. By understanding these concepts and applying them thoughtfully, developers can create more effective and robust solutions.</p>`

      articleData = {
        title: `Complete Guide to ${topic}`,
        excerpt: `A comprehensive guide covering the essential aspects and latest developments in ${topic} for modern developers.`,
        content: htmlContent,
        tags: [topic.toLowerCase().replace(/\s+/g, '-'), 'development', 'technology', 'guide'],
        category: "Technology",
        metaTitle: `Complete Guide to ${topic}`,
        metaDescription: `Learn about ${topic} with this comprehensive guide covering key concepts, best practices, and implementation strategies.`
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
      readTime: Math.ceil(articleData.content.replace(/<[^>]*>/g, '').split(' ').length / 200), // Strip HTML tags for word count
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
