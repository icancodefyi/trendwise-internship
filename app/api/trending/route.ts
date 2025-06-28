import { NextRequest, NextResponse } from "next/server"
import { trendingService } from "@/lib/trending-service"
import clientPromise from "@/lib/mongodb"

interface TrendingTopic {
  id: string
  title: string
  source: string
  trend_score: number
  category: string
  description: string
  keywords: string[]
  image?: string
  videos?: string[]
  tweets?: string[]
}

// Cache trending topics for 1 hour to avoid hitting APIs too frequently
let cachedTrends: TrendingTopic[] = []
let lastFetch = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export async function GET() {
  try {
    const now = Date.now()
    
    // Check if we have cached data that's still fresh
    if (cachedTrends.length > 0 && (now - lastFetch) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        trending_topics: cachedTrends,
        last_updated: new Date(lastFetch).toISOString(),
        sources: {
          google_trends: 'cached',
          twitter_api: 'cached',
          github_trending: 'cached'
        }
      })
    }

    console.log('Fetching fresh trending data...')
    
    // Fetch real trending topics using the trending service
    const trendingTopics = await trendingService.getAllTrendingTopics()
    
    if (trendingTopics.length > 0) {
      cachedTrends = trendingTopics
      lastFetch = now
      
      // Store in database for persistence
      try {
        const client = await clientPromise
        const db = client.db("trendwise")
        
        // Update trending topics collection
        await db.collection("trending_topics").deleteMany({})
        await db.collection("trending_topics").insertMany(trendingTopics.map((topic: TrendingTopic) => ({
          ...topic,
          fetchedAt: new Date(),
          createdAt: new Date()
        })))
        
        console.log(`Stored ${trendingTopics.length} trending topics in database`)
      } catch (dbError) {
        console.error('Error storing trending topics in database:', dbError)
      }
      
      return NextResponse.json({
        success: true,
        trending_topics: trendingTopics,
        last_updated: new Date().toISOString(),
        sources: {
          google_trends: 'active',
          twitter_api: 'active', 
          github_trending: 'active'
        }
      })
    } else {
      // Fallback to database if API calls fail
      try {
        const client = await clientPromise
        const db = client.db("trendwise")
        const storedTopics = await db.collection("trending_topics")
          .find({})
          .sort({ fetchedAt: -1 })
          .limit(15)
          .toArray()
        
        if (storedTopics.length > 0) {
          return NextResponse.json({
            success: true,
            trending_topics: storedTopics,
            last_updated: storedTopics[0]?.fetchedAt || new Date().toISOString(),
            sources: {
              google_trends: 'active',
              twitter_api: 'active',
              github_trending: 'active'
            }
          })
        }
      } catch (dbError) {
        console.error('Error fetching from database:', dbError)
      }
      
      // Ultimate fallback to mock data
      return NextResponse.json({
        success: true,
        trending_topics: getMockTrendingTopics(),
        last_updated: new Date().toISOString(),
        sources: {
          google_trends: 'mock',
          twitter_api: 'mock',
          github_trending: 'mock'
        }
      })
    }
  } catch (error) {
    console.error("Error fetching trending topics:", error)
    
    // Return cached data if available
    if (cachedTrends.length > 0) {
      return NextResponse.json({
        success: true,
        trending_topics: cachedTrends,
        last_updated: new Date(lastFetch).toISOString(),
        sources: {
          google_trends: 'cached',
          twitter_api: 'cached',
          github_trending: 'cached'
        }
      })
    }
    
    // Final fallback to mock data
    return NextResponse.json({
      success: true,
      trending_topics: getMockTrendingTopics(),
      last_updated: new Date().toISOString(),
      sources: {
        google_trends: 'mock',
        twitter_api: 'mock',
        github_trending: 'mock'
      }
    })
  }
}

export async function POST() {
  try {
    console.log('Manual refresh of trending topics triggered...')
    
    // Force refresh by clearing cache
    cachedTrends = []
    lastFetch = 0
    
    // Fetch fresh data using trending service
    const trendingTopics = await trendingService.getAllTrendingTopics()
    
    if (trendingTopics.length > 0) {
      cachedTrends = trendingTopics
      lastFetch = Date.now()
      
      // Store in database
      try {
        const client = await clientPromise
        const db = client.db("trendwise")
        
        await db.collection("trending_topics").deleteMany({})
        await db.collection("trending_topics").insertMany(trendingTopics.map((topic: TrendingTopic) => ({
          ...topic,
          fetchedAt: new Date(),
          createdAt: new Date()
        })))
      } catch (dbError) {
        console.error('Error storing in database:', dbError)
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Successfully refreshed ${trendingTopics.length} trending topics`,
        topics: trendingTopics 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to fetch trending topics' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Error refreshing trending topics:", error)
    return NextResponse.json({ 
      success: false, 
      message: 'Error refreshing trending topics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Fallback mock data function
function getMockTrendingTopics(): TrendingTopic[] {
  return [
    {
      id: '1',
      title: 'React 19 Release Features',
      source: 'Google Trends',
      trend_score: 95,
      category: 'Web Development',
      description: 'Latest React 19 features including Server Components improvements and new hooks for better performance',
      keywords: ['React', 'JavaScript', 'Frontend', 'Components'],
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
      tweets: ['https://twitter.com/reactjs/status/example']
    },
    {
      id: '2',
      title: 'AI Code Assistants Revolution',
      source: 'GitHub Trending',
      trend_score: 92,
      category: 'Artificial Intelligence',
      description: 'New AI coding tools are transforming development workflows with better code completion and debugging',
      keywords: ['AI', 'Code Assistant', 'Programming', 'Automation'],
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
      videos: ['https://www.youtube.com/embed/ScMzIvxBSi4'],
      tweets: ['https://twitter.com/github/status/example']
    },
    {
      id: '3',
      title: 'TypeScript 5.5 Performance Boost',
      source: 'Hacker News',
      trend_score: 88,
      category: 'Programming Languages',
      description: 'TypeScript 5.5 brings significant performance improvements and new type system features',
      keywords: ['TypeScript', 'Performance', 'Types', 'JavaScript'],
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
      videos: ['https://www.youtube.com/embed/9bZkp7q19f0'],
      tweets: ['https://twitter.com/typescript/status/example']
    },
    {
      id: '4',
      title: 'WebAssembly in Production',
      source: 'Dev.to',
      trend_score: 85,
      category: 'Web Technologies',
      description: 'Companies sharing their successful WebAssembly implementation experiences in production environments',
      keywords: ['WebAssembly', 'Performance', 'Production', 'WASM'],
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
      videos: ['https://www.youtube.com/embed/LWrPqQAz55E'],
      tweets: ['https://twitter.com/webassembly/status/example']
    },
    {
      id: '5',
      title: 'Next.js 15 App Router Updates',
      source: 'Google Trends',
      trend_score: 90,
      category: 'Web Frameworks',
      description: 'Next.js 15 introduces enhanced App Router features with improved caching and performance optimizations',
      keywords: ['Next.js', 'App Router', 'React', 'SSR'],
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
      videos: ['https://www.youtube.com/embed/VjHj_OwR_lk'],
      tweets: ['https://twitter.com/nextjs/status/example']
    },
    {
      id: '6',
      title: 'Rust for Web Development',
      source: 'GitHub Trending',
      trend_score: 87,
      category: 'Programming Languages',
      description: 'Rust continues to gain popularity for web development with new frameworks and tools',
      keywords: ['Rust', 'Web Development', 'Performance', 'Systems'],
      image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80',
      videos: ['https://www.youtube.com/embed/BrQuxlAFXcE'],
      tweets: ['https://twitter.com/rustlang/status/example']
    }
  ]
}
