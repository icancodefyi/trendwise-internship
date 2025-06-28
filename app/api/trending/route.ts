import { NextRequest, NextResponse } from "next/server"
import { aggregateTrendingTopics, TrendingTopic } from "@/lib/trending-crawler"
import clientPromise from "@/lib/mongodb"

// Cache trending topics for 1 hour to avoid hitting APIs too frequently
let cachedTrends: TrendingTopic[] = []
let lastFetch = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export async function GET() {
  try {
    const now = Date.now()
    
    // Check if we have cached data that's still fresh
    if (cachedTrends.length > 0 && (now - lastFetch) < CACHE_DURATION) {
      return NextResponse.json(cachedTrends)
    }

    console.log('Fetching fresh trending data...')
    
    // Fetch real trending topics
    const trendingTopics = await aggregateTrendingTopics()
    
    if (trendingTopics.length > 0) {
      cachedTrends = trendingTopics
      lastFetch = now
      
      // Store in database for persistence
      try {
        const client = await clientPromise
        const db = client.db("trendwise")
        
        // Update trending topics collection
        await db.collection("trending_topics").deleteMany({})
        await db.collection("trending_topics").insertMany(trendingTopics.map(topic => ({
          ...topic,
          fetchedAt: new Date(),
          createdAt: new Date()
        })))
        
        console.log(`Stored ${trendingTopics.length} trending topics in database`)
      } catch (dbError) {
        console.error('Error storing trending topics in database:', dbError)
      }
      
      return NextResponse.json(trendingTopics)
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
          return NextResponse.json(storedTopics)
        }
      } catch (dbError) {
        console.error('Error fetching from database:', dbError)
      }
      
      // Ultimate fallback to mock data
      return NextResponse.json(getMockTrendingTopics())
    }
  } catch (error) {
    console.error("Error fetching trending topics:", error)
    
    // Return cached data if available
    if (cachedTrends.length > 0) {
      return NextResponse.json(cachedTrends)
    }
    
    // Final fallback to mock data
    return NextResponse.json(getMockTrendingTopics())
  }
}

export async function POST() {
  try {
    console.log('Manual refresh of trending topics triggered...')
    
    // Force refresh by clearing cache
    cachedTrends = []
    lastFetch = 0
    
    // Fetch fresh data
    const trendingTopics = await aggregateTrendingTopics()
    
    if (trendingTopics.length > 0) {
      cachedTrends = trendingTopics
      lastFetch = Date.now()
      
      // Store in database
      try {
        const client = await clientPromise
        const db = client.db("trendwise")
        
        await db.collection("trending_topics").deleteMany({})
        await db.collection("trending_topics").insertMany(trendingTopics.map(topic => ({
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
      description: 'Latest React 19 features including Server Components improvements',
      keywords: ['React', 'JavaScript', 'Frontend', 'Components'],
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
      tweets: ['https://twitter.com/reactjs/status/example']
    },
   
  ]
}
