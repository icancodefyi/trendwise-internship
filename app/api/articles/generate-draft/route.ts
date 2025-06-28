import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { mediaService } from "@/lib/media-service"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { topic, description, keywords, media } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    console.log(`Generating draft content for topic: ${topic}`)

    // Fetch real media content using the proper media service
    let realMedia = media
    if (!realMedia || !realMedia.image) {
      console.log('Fetching real media content with media service...')
      console.log('Environment check:', {
        hasUnsplashKey: !!process.env.UNSPLASH_ACCESS_KEY && process.env.UNSPLASH_ACCESS_KEY !== 'demo-key',
        hasYouTubeKey: !!process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY !== 'demo-key',
        hasTwitterKey: !!process.env.TWITTER_BEARER_TOKEN && process.env.TWITTER_BEARER_TOKEN !== 'demo-key'
      })
      try {
        realMedia = await mediaService.getTopicMedia(topic)
        console.log('Media service result:', {
          image: realMedia.image ? 'Found image' : 'No image',
          videos: `${realMedia.videos?.length || 0} videos`,
          tweets: `${realMedia.tweets?.length || 0} tweets`
        })
      } catch (error) {
        console.error('Error fetching media:', error)
        realMedia = { videos: [], tweets: [] }
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Enhanced prompt for draft generation
    const prompt = `You are a professional technical blog writer specializing in programming and web development.

Write a comprehensive, detailed technical article on: "${topic}"
${description ? `Description: ${description}` : ''}
${keywords ? `Keywords to include: ${keywords.join(', ')}` : ''}

CRITICAL REQUIREMENTS:
1. You MUST respond with ONLY valid JSON - no extra text, no markdown formatting, no code blocks
2. The content field MUST contain raw HTML (not escaped) with semantic tags
3. ${realMedia?.image ? 'Include the provided featured image naturally in the content' : ''}
4. Follow this EXACT JSON structure (no deviations):

IMPORTANT: Generate DISTINCT and UNIQUE meta tags for each field:

{
  "title": "Article title (60-80 characters)",
  "excerpt": "Comprehensive summary (150-200 characters)",
  "content": "Full HTML formatted article content (RAW HTML, NOT ESCAPED)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "Technology",
  "metaTitle": "SEO optimized meta title - MUST be different from main title (50-60 characters)",
  "metaDescription": "Compelling SEO meta description for search engines (150-160 characters)",
  "ogTitle": "Engaging OpenGraph title for social sharing - MUST be different from main title (60-70 characters)",
  "ogDescription": "Descriptive OpenGraph description for social media previews (155-200 characters)",
  "ogKeywords": ["seo", "keyword1", "keyword2", "keyword3", "keyword4"]
}

EXAMPLE of DISTINCT meta tags:
- Main title: "Understanding React Server Components"
- metaTitle: "React Server Components Guide - Performance & SEO Benefits"
- ogTitle: "Master React Server Components - Complete Developer Guide"

HTML CONTENT STRUCTURE (use exactly these tags - RAW HTML, NOT ESCAPED):
<h1>Main Article Title</h1>
<p>Introduction paragraph explaining the topic's importance and what readers will learn. Make this compelling and informative.</p>

${realMedia?.image ? `<div class="article-image">
<img src="${realMedia.image}" alt="${topic}" class="w-full rounded-lg mb-4" />
<p class="text-sm text-muted-foreground text-center">Featured image for ${topic}</p>
</div>` : ''}

<h2>Current State and Overview</h2>
<p>Detailed explanation of the current landscape and why this topic matters now.</p>

<h2>Key Benefits and Features</h2>
<ul>
<li><strong>Feature 1:</strong> Detailed explanation</li>
<li><strong>Feature 2:</strong> Detailed explanation</li>
<li><strong>Feature 3:</strong> Detailed explanation</li>
</ul>

${realMedia?.videos && realMedia.videos.length > 0 ? `<div class="video-section">
<h2>Video Resources</h2>
<div class="video-container mb-6">
<iframe width="100%" height="315" src="${realMedia.videos[0]}" title="Educational Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
</div>` : ''}

<h2>Implementation and Best Practices</h2>
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

RESPOND WITH ONLY THE JSON OBJECT - NO MARKDOWN, NO CODE BLOCKS, NO EXTRA TEXT.

IMPORTANT: Make sure to generate distinct and optimized meta tags:
- metaTitle: Should be different from the main title, optimized for SEO
- metaDescription: Should be compelling for search results
- ogTitle: Should be engaging for social media sharing
- ogDescription: Should be descriptive for social media previews
- ogKeywords: Should include relevant SEO keywords`

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
      }
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      // Parse the JSON
      articleData = JSON.parse(cleanedResponse)
      
      console.log('Draft content generated successfully')
      console.log('Generated meta tags:', {
        metaTitle: articleData.metaTitle,
        metaDescription: articleData.metaDescription,
        ogTitle: articleData.ogTitle,
        ogDescription: articleData.ogDescription
      })
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.log('Raw response:', responseText.substring(0, 500))
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    // Ensure we have proper meta tags - generate fallbacks if missing
    const finalMetaTitle = articleData.metaTitle || `${articleData.title} - Complete Guide`
    const finalMetaDescription = articleData.metaDescription || articleData.excerpt || `Learn about ${topic} with this comprehensive guide`
    const finalOgTitle = articleData.ogTitle || `${articleData.title} | Developer Resource`
    const finalOgDescription = articleData.ogDescription || articleData.excerpt || `Discover everything you need to know about ${topic}`

    // Return just the content without saving to database
    return NextResponse.json({ 
      success: true, 
      title: articleData.title,
      excerpt: articleData.excerpt,
      content: articleData.content,
      tags: articleData.tags || [],
      category: articleData.category || 'Technology',
      meta: {
        title: finalMetaTitle,
        description: finalMetaDescription,
        keywords: articleData.ogKeywords || articleData.tags || []
      },
      openGraph: {
        title: finalOgTitle,
        description: finalOgDescription,
        image: realMedia?.image || null,
        type: 'article'
      },
      media: {
        image: realMedia?.image || null,
        videos: realMedia?.videos || [],
        tweets: realMedia?.tweets || []
      }
    })
  } catch (error) {
    console.error("Error generating draft:", error)
    return NextResponse.json({ 
      error: "Failed to generate draft content",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
