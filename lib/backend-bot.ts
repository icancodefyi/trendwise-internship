import { aggregateTrendingTopics, TrendingTopic } from './trending-crawler'
import clientPromise from './mongodb'

interface AutoGenerationConfig {
  maxArticlesPerRun: number
  minTrendScore: number
  cooldownHours: number
  enabled: boolean
}

const DEFAULT_CONFIG: AutoGenerationConfig = {
  maxArticlesPerRun: 3,
  minTrendScore: 80,
  cooldownHours: 6,
  enabled: true
}

export class BackendBot {
  private config: AutoGenerationConfig
  private isRunning: boolean = false
  private lastRun: Date | null = null

  constructor(config?: Partial<AutoGenerationConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  async start() {
    if (!this.config.enabled) {
      console.log('Backend bot is disabled')
      return
    }

    console.log('🤖 Backend Bot starting...')
    
    // Run immediately
    await this.runGenerationCycle()
    
    // Set up interval to run every few hours
    const intervalMs = this.config.cooldownHours * 60 * 60 * 1000
    setInterval(async () => {
      await this.runGenerationCycle()
    }, intervalMs)

    console.log(`🤖 Backend Bot started! Will run every ${this.config.cooldownHours} hours`)
  }

  async runGenerationCycle() {
    if (this.isRunning) {
      console.log('⏳ Backend bot is already running, skipping this cycle')
      return
    }

    this.isRunning = true
    console.log('🚀 Starting automated content generation cycle...')

    try {
      // Step 1: Fetch trending topics
      const trendingTopics = await aggregateTrendingTopics()
      console.log(`📈 Fetched ${trendingTopics.length} trending topics`)

      if (trendingTopics.length === 0) {
        console.log('❌ No trending topics found, skipping generation')
        return
      }

      // Step 2: Filter high-scoring topics
      const highScoreTopics = trendingTopics
        .filter(topic => topic.trend_score >= this.config.minTrendScore)
        .slice(0, this.config.maxArticlesPerRun)

      console.log(`🎯 Selected ${highScoreTopics.length} high-scoring topics for generation`)

      // Step 3: Check for existing articles to avoid duplicates
      const newTopics = await this.filterExistingArticles(highScoreTopics)
      console.log(`✨ ${newTopics.length} new topics after filtering existing articles`)

      // Step 4: Generate articles for each topic
      const generatedArticles = []
      for (const topic of newTopics) {
        try {
          console.log(`📝 Generating article for: ${topic.title}`)
          const article = await this.generateArticleFromTopic(topic)
          
          if (article) {
            generatedArticles.push(article)
            console.log(`✅ Successfully generated: ${article.title}`)
            
            // Small delay between generations to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
        } catch (error) {
          console.error(`❌ Failed to generate article for ${topic.title}:`, error)
        }
      }

      // Step 5: Update statistics
      await this.updateBotStatistics({
        lastRun: new Date(),
        topicsProcessed: trendingTopics.length,
        articlesGenerated: generatedArticles.length,
        highScoreTopics: highScoreTopics.length
      })

      this.lastRun = new Date()
      
      console.log(`🎉 Generation cycle completed! Generated ${generatedArticles.length} articles`)

    } catch (error) {
      console.error('💥 Error in generation cycle:', error)
    } finally {
      this.isRunning = false
    }
  }

  private async filterExistingArticles(topics: TrendingTopic[]): Promise<TrendingTopic[]> {
    try {
      const client = await clientPromise
      const db = client.db("trendwise")
      
      const existingSlugs = new Set()
      
      // Check for existing articles with similar titles/keywords
      for (const topic of topics) {
        const slug = this.generateSlugFromTopic(topic)
        const existingArticle = await db.collection("articles").findOne({ 
          $or: [
            { slug },
            { title: { $regex: topic.title.slice(0, 20), $options: "i" } },
            { "generatedFrom.topic": topic.title }
          ]
        })
        
        if (existingArticle) {
          existingSlugs.add(topic.id)
        }
      }
      
      return topics.filter(topic => !existingSlugs.has(topic.id))
    } catch (error) {
      console.error('Error filtering existing articles:', error)
      return topics // Return all topics if filtering fails
    }
  }

  private async generateArticleFromTopic(topic: TrendingTopic) {
    try {
      // Call the article generation API
      const response = await fetch('http://localhost:3000/api/articles/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: topic.title,
          description: topic.description,
          keywords: topic.keywords,
          media: {
            image: topic.image,
            videos: topic.videos || [],
            tweets: topic.tweets || []
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Article generation failed')
      }

      return result.article
    } catch (error) {
      console.error(`Failed to generate article for topic ${topic.title}:`, error)
      return null
    }
  }

  private generateSlugFromTopic(topic: TrendingTopic): string {
    return topic.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .slice(0, 60) // Limit slug length
  }

  private async updateBotStatistics(stats: any) {
    try {
      const client = await clientPromise
      const db = client.db("trendwise")
      
      await db.collection("bot_statistics").insertOne({
        ...stats,
        timestamp: new Date()
      })

      // Keep only last 100 records
      const count = await db.collection("bot_statistics").countDocuments()
      if (count > 100) {
        const oldRecords = await db.collection("bot_statistics")
          .find({})
          .sort({ timestamp: 1 })
          .limit(count - 100)
          .toArray()
        
        const oldIds = oldRecords.map(r => r._id)
        await db.collection("bot_statistics").deleteMany({ _id: { $in: oldIds } })
      }
    } catch (error) {
      console.error('Error updating bot statistics:', error)
    }
  }

  async getStatistics() {
    try {
      const client = await clientPromise
      const db = client.db("trendwise")
      
      const latestStats = await db.collection("bot_statistics")
        .findOne({}, { sort: { timestamp: -1 } })
      
      const totalArticles = await db.collection("articles")
        .countDocuments({ "generatedFrom.topic": { $exists: true } })
      
      return {
        lastRun: latestStats?.lastRun || null,
        isRunning: this.isRunning,
        totalGeneratedArticles: totalArticles,
        lastCycleStats: latestStats || null,
        config: this.config
      }
    } catch (error) {
      console.error('Error getting bot statistics:', error)
      return {
        lastRun: null,
        isRunning: false,
        totalGeneratedArticles: 0,
        lastCycleStats: null,
        config: this.config
      }
    }
  }

  async manualTrigger() {
    console.log('🔧 Manual trigger requested for backend bot')
    await this.runGenerationCycle()
  }

  stop() {
    this.config.enabled = false
    console.log('🛑 Backend bot stopped')
  }
}

// Singleton instance
export const backendBot = new BackendBot()
