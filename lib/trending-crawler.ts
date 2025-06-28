import axios from 'axios'
import * as cheerio from 'cheerio'

// Dynamic import for google-trends-api to handle type issues
const googleTrends = require('google-trends-api')

export interface TrendingTopic {
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
  relatedLinks?: string[]
}

export interface MediaContent {
  image?: string
  videos: string[]
  tweets: string[]
}

// Google Trends Integration
export async function fetchGoogleTrends(): Promise<TrendingTopic[]> {
  try {
    const results = await googleTrends.dailyTrends({
      trendDate: new Date(),
      geo: 'US',
    })

    const trendsData = JSON.parse(results)
    const trends: TrendingTopic[] = []

    if (trendsData.default?.trendingSearchesDays?.[0]?.trendingSearches) {
      const trendingSearches = trendsData.default.trendingSearchesDays[0].trendingSearches.slice(0, 10)
      
      for (let i = 0; i < trendingSearches.length; i++) {
        const trend = trendingSearches[i]
        const topic: TrendingTopic = {
          id: `google-${i + 1}`,
          title: trend.title.query,
          source: 'Google Trends',
          trend_score: Math.floor(Math.random() * 30) + 70, // 70-100 range
          category: 'Technology',
          description: trend.formattedTraffic || 'Trending topic from Google',
          keywords: [trend.title.query, ...trend.relatedQueries?.map((q: any) => q.query) || []].slice(0, 5),
          image: trend.image?.newsUrl || undefined,
          videos: [],
          tweets: [],
          relatedLinks: trend.articles?.map((article: any) => article.url) || []
        }
        trends.push(topic)
      }
    }

    return trends
  } catch (error) {
    console.error('Error fetching Google Trends:', error)
    return []
  }
}

// GitHub Trending Integration
export async function fetchGitHubTrending(): Promise<TrendingTopic[]> {
  try {
    const response = await axios.get('https://api.github.com/search/repositories', {
      params: {
        q: 'created:>2024-12-01',
        sort: 'stars',
        order: 'desc',
        per_page: 10
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TrendWise-Bot'
      }
    })

    const repos = response.data.items
    const trends: TrendingTopic[] = []

    for (let i = 0; i < repos.length; i++) {
      const repo = repos[i]
      const topic: TrendingTopic = {
        id: `github-${i + 1}`,
        title: `${repo.name}: ${repo.description || 'Trending Repository'}`.slice(0, 80),
        source: 'GitHub Trending',
        trend_score: Math.min(Math.floor(repo.stargazers_count / 10), 100),
        category: repo.language || 'Programming',
        description: repo.description || 'Trending GitHub repository',
        keywords: [repo.name, repo.language, 'GitHub', 'Open Source'].filter(Boolean),
        image: repo.owner.avatar_url,
        videos: [],
        tweets: [],
        relatedLinks: [repo.html_url, repo.homepage].filter(Boolean)
      }
      trends.push(topic)
    }

    return trends
  } catch (error) {
    console.error('Error fetching GitHub trending:', error)
    return []
  }
}

// Hacker News Trending (as Twitter alternative since Twitter API requires paid access)
export async function fetchHackerNewsTrending(): Promise<TrendingTopic[]> {
  try {
    const response = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')
    const storyIds = response.data.slice(0, 10)
    
    const trends: TrendingTopic[] = []
    
    for (let i = 0; i < storyIds.length; i++) {
      const storyId = storyIds[i]
      const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
      const story = storyResponse.data
      
      if (story && story.title) {
        const topic: TrendingTopic = {
          id: `hn-${i + 1}`,
          title: story.title.slice(0, 80),
          source: 'Hacker News',
          trend_score: Math.min(Math.floor((story.score || 0) / 10), 100),
          category: 'Technology',
          description: story.title,
          keywords: extractKeywords(story.title),
          videos: [],
          tweets: [],
          relatedLinks: [story.url].filter(Boolean)
        }
        trends.push(topic)
      }
    }
    
    return trends
  } catch (error) {
    console.error('Error fetching Hacker News trending:', error)
    return []
  }
}

// Media Content Fetcher
export async function fetchMediaContent(topic: string, keywords: string[]): Promise<MediaContent> {
  const media: MediaContent = {
    videos: [],
    tweets: []
  }

  try {
    // Fetch related images from Unsplash
    const imageResponse = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: keywords.join(' '),
        per_page: 1,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY || 'demo-key'}`
      }
    })

    if (imageResponse.data.results?.[0]) {
      media.image = imageResponse.data.results[0].urls.regular
    }

    // Generate YouTube search URLs (since we can't directly embed without API key)
    const youtubeSearchQuery = encodeURIComponent(`${topic} tutorial programming`)
    media.videos.push(`https://www.youtube.com/results?search_query=${youtubeSearchQuery}`)

  } catch (error) {
    console.error('Error fetching media content:', error)
  }

  return media
}

// Utility function to extract keywords from text
function extractKeywords(text: string): string[] {
  const commonWords = ['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'an', 'as', 'are', 'was', 'for', 'with']
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word))
  
  return [...new Set(words)].slice(0, 5)
}

// Web Scraping for Related Articles
export async function scrapeRelatedArticles(topic: string): Promise<string[]> {
  try {
    const searchQuery = encodeURIComponent(`${topic} programming development`)
    const response = await axios.get(`https://www.google.com/search?q=${searchQuery}&num=5`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    const $ = cheerio.load(response.data)
    const links: string[] = []

    $('div.g a[href^="http"]').each((i, element) => {
      if (i < 5) {
        const href = $(element).attr('href')
        if (href && !href.includes('google.com')) {
          links.push(href)
        }
      }
    })

    return links
  } catch (error) {
    console.error('Error scraping related articles:', error)
    return []
  }
}

// Main aggregator function
export async function aggregateTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    console.log('Fetching trending topics from multiple sources...')
    
    const [googleTrends, githubTrending, hackerNewsTrending] = await Promise.allSettled([
      fetchGoogleTrends(),
      fetchGitHubTrending(),
      fetchHackerNewsTrending()
    ])

    const allTopics: TrendingTopic[] = []

    if (googleTrends.status === 'fulfilled') {
      allTopics.push(...googleTrends.value)
    }
    if (githubTrending.status === 'fulfilled') {
      allTopics.push(...githubTrending.value)
    }
    if (hackerNewsTrending.status === 'fulfilled') {
      allTopics.push(...hackerNewsTrending.value)
    }

    // Sort by trend score and return top 15
    return allTopics
      .sort((a, b) => b.trend_score - a.trend_score)
      .slice(0, 15)
      .map((topic, index) => ({ ...topic, id: `trend-${index + 1}` }))

  } catch (error) {
    console.error('Error aggregating trending topics:', error)
    return []
  }
}
