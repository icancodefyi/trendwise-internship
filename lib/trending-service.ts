import axios from 'axios'
import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer'
import { mediaService } from './media-service'

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

interface MediaContent {
  image?: string
  videos?: string[]
  tweets?: string[]
}

export class TrendingService {
  
  // Fetch Google Trends data
  async fetchGoogleTrends(): Promise<TrendingTopic[]> {
    try {
      // Using a simple web scraping approach for Google Trends
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      const page = await browser.newPage()
      
      await page.goto('https://trends.google.com/trends/trendingsearches/daily?geo=US&category=5', {
        waitUntil: 'networkidle2'
      })
      
      await page.waitForSelector('.feed-load-more-button', { timeout: 10000 })
      
      const trends = await page.evaluate(() => {
        const trendItems = document.querySelectorAll('.feed-item')
        return Array.from(trendItems).slice(0, 10).map((item, index) => {
          const titleElement = item.querySelector('.summary-title a')
          const title = titleElement?.textContent?.trim() || `Trending Topic ${index + 1}`
          const description = item.querySelector('.summary-text')?.textContent?.trim() || 'A trending technology topic'
          
          return {
            id: `google-${index + 1}`,
            title: title,
            source: 'Google Trends',
            trend_score: 90 + Math.floor(Math.random() * 10),
            category: 'Technology',
            description: description,
            keywords: title.toLowerCase().split(' ').filter(word => word.length > 2)
          }
        })
      })
      
      await browser.close()
      return trends
      
    } catch (error) {
      console.error('Error fetching Google Trends:', error)
      // Fallback to mock data if scraping fails
      return this.getMockGoogleTrends()
    }
  }

  // Fetch GitHub trending repositories
  async fetchGitHubTrending(): Promise<TrendingTopic[]> {
    try {
      const response = await axios.get('https://api.github.com/search/repositories', {
        params: {
          q: 'stars:>1000 created:>2024-01-01',
          sort: 'stars',
          order: 'desc',
          per_page: 10
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TrendWise-Bot'
        }
      })

      return response.data.items.map((repo: any, index: number) => ({
        id: `github-${repo.id}`,
        title: `${repo.name}: ${repo.description?.substring(0, 50)}...`,
        source: 'GitHub Trending',
        trend_score: Math.min(95, 60 + Math.floor(repo.stargazers_count / 1000)),
        category: repo.language || 'Programming',
        description: repo.description || 'Trending GitHub repository',
        keywords: [repo.language, 'programming', 'development', repo.name].filter(Boolean)
      }))
      
    } catch (error) {
      console.error('Error fetching GitHub trending:', error)
      return this.getMockGitHubTrending()
    }
  }

  // Fetch tech news from multiple sources
  async fetchTechNews(): Promise<TrendingTopic[]> {
    try {
      const sources = [
        'https://news.ycombinator.com/',
        'https://dev.to/',
      ]
      
      const allTopics: TrendingTopic[] = []
      
      for (const url of sources) {
        try {
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          })
          
          const $ = cheerio.load(response.data)
          
          if (url.includes('ycombinator')) {
            $('.athing').slice(0, 5).each((index, element) => {
              const title = $(element).find('.titleline a').text().trim()
              if (title && title.length > 10) {
                allTopics.push({
                  id: `hn-${index}`,
                  title: title,
                  source: 'Hacker News',
                  trend_score: 85 + Math.floor(Math.random() * 10),
                  category: 'Technology',
                  description: `Trending discussion: ${title}`,
                  keywords: title.toLowerCase().split(' ').filter(word => word.length > 2).slice(0, 5)
                })
              }
            })
          }
          
          if (url.includes('dev.to')) {
            $('.crayons-story__title a').slice(0, 5).each((index, element) => {
              const title = $(element).text().trim()
              if (title && title.length > 10) {
                allTopics.push({
                  id: `devto-${index}`,
                  title: title,
                  source: 'Dev.to',
                  trend_score: 80 + Math.floor(Math.random() * 15),
                  category: 'Development',
                  description: `Popular article: ${title}`,
                  keywords: title.toLowerCase().split(' ').filter(word => word.length > 2).slice(0, 5)
                })
              }
            })
          }
        } catch (sourceError) {
          console.error(`Error fetching from ${url}:`, sourceError)
        }
      }
      
      return allTopics.slice(0, 10)
      
    } catch (error) {
      console.error('Error fetching tech news:', error)
      return this.getMockTechNews()
    }
  }

  // Get related media for a topic
  async getTopicMedia(topic: string): Promise<MediaContent> {
    try {
      // Use the dedicated media service for better results
      return await mediaService.getTopicMedia(topic)
    } catch (error) {
      console.error('Error fetching media for topic:', topic, error)
      // Fallback to basic media
      return {
        image: await this.getUnsplashImage(topic),
        videos: await this.getYouTubeVideos(topic),
        tweets: await this.getTwitterContent(topic)
      }
    }
  }

  private async getUnsplashImage(topic: string): Promise<string> {
    try {
      // Using Unsplash's source API for random tech images
      const techKeywords = ['technology', 'programming', 'computer', 'code', 'developer']
      const randomKeyword = techKeywords[Math.floor(Math.random() * techKeywords.length)]
      return `https://source.unsplash.com/800x400/?${randomKeyword}`
    } catch (error) {
      return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'
    }
  }

  private async getYouTubeVideos(topic: string): Promise<string[]> {
    // Mock YouTube videos - in production, use YouTube Data API
    const mockVideos = [
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/ScMzIvxBSi4',
      'https://www.youtube.com/embed/9bZkp7q19f0'
    ]
    return [mockVideos[Math.floor(Math.random() * mockVideos.length)]]
  }

  private async getTwitterContent(topic: string): Promise<string[]> {
    // Mock Twitter content - in production, use Twitter API
    const mockTweets = [
      'https://twitter.com/vercel/status/example',
      'https://twitter.com/reactjs/status/example',
      'https://twitter.com/typescript/status/example'
    ]
    return [mockTweets[Math.floor(Math.random() * mockTweets.length)]]
  }

  // Fallback mock data methods
  private getMockGoogleTrends(): TrendingTopic[] {
    return [
      {
        id: 'google-1',
        title: 'React 19 Server Actions',
        source: 'Google Trends',
        trend_score: 95,
        category: 'Web Development',
        description: 'New React 19 features revolutionizing server-side interactions',
        keywords: ['React', 'Server Actions', 'JavaScript', 'Frontend']
      },
      {
        id: 'google-2',
        title: 'AI Code Assistants 2025',
        source: 'Google Trends',
        trend_score: 92,
        category: 'Artificial Intelligence',
        description: 'Latest AI coding tools transforming development workflows',
        keywords: ['AI', 'Code Assistant', 'Programming', 'Automation']
      }
    ]
  }

  private getMockGitHubTrending(): TrendingTopic[] {
    return [
      {
        id: 'github-1',
        title: 'Bun 1.1: Ultra-fast JavaScript Runtime',
        source: 'GitHub Trending',
        trend_score: 88,
        category: 'Runtime',
        description: 'Bun continues to gain popularity as a Node.js alternative',
        keywords: ['Bun', 'JavaScript', 'Runtime', 'Performance']
      }
    ]
  }

  private getMockTechNews(): TrendingTopic[] {
    return [
      {
        id: 'news-1',
        title: 'WebAssembly in Production: Success Stories',
        source: 'Tech News',
        trend_score: 85,
        category: 'Web Technologies',
        description: 'Companies sharing their WebAssembly implementation experiences',
        keywords: ['WebAssembly', 'Performance', 'Production', 'WASM']
      }
    ]
  }

  // Main method to aggregate all trending data
  async getAllTrendingTopics(): Promise<TrendingTopic[]> {
    try {
      const [googleTrends, githubTrending, techNews] = await Promise.allSettled([
        this.fetchGoogleTrends(),
        this.fetchGitHubTrending(),
        this.fetchTechNews()
      ])

      const allTopics: TrendingTopic[] = []

      if (googleTrends.status === 'fulfilled') {
        allTopics.push(...googleTrends.value)
      }
      if (githubTrending.status === 'fulfilled') {
        allTopics.push(...githubTrending.value)
      }
      if (techNews.status === 'fulfilled') {
        allTopics.push(...techNews.value)
      }

      // Sort by trend score and return top 20
      return allTopics
        .sort((a, b) => b.trend_score - a.trend_score)
        .slice(0, 20)
        .map(topic => ({
          ...topic,
          // Add media for each topic
          image: `https://source.unsplash.com/800x400/?technology,${topic.keywords[0]}`,
          videos: [`https://www.youtube.com/embed/dQw4w9WgXcQ`],
          tweets: [`https://twitter.com/trending/status/example`]
        }))

    } catch (error) {
      console.error('Error aggregating trending topics:', error)
      // Return mock data as fallback
      return [
        ...this.getMockGoogleTrends(),
        ...this.getMockGitHubTrending(),
        ...this.getMockTechNews()
      ]
    }
  }
}

export const trendingService = new TrendingService()
