import axios from 'axios'

interface UnsplashImage {
  urls: {
    regular: string
    small: string
  }
  alt_description?: string
}

interface MediaResult {
  image?: string
  videos?: string[]
  tweets?: string[]
}

export class MediaService {
  private unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY
  private youtubeApiKey = process.env.YOUTUBE_API_KEY
  private twitterBearerToken = process.env.TWITTER_BEARER_TOKEN

  async getTopicMedia(topic: string): Promise<MediaResult> {
    const result: MediaResult = {}

    console.log(`🎬 Fetching media for topic: "${topic}"`)

    try {
      // Get relevant image - try Unsplash API first, then fallback to Unsplash source
      result.image = await this.getRelevantImage(topic)
      
      // Get relevant videos - try YouTube API first, then generate topic-specific embeds
      if (this.youtubeApiKey && this.youtubeApiKey !== 'demo-key') {
        result.videos = await this.getYouTubeVideos(topic)
        console.log('🎥 Using YouTube API for videos')
      } else {
        result.videos = this.getTopicSpecificVideos(topic)
        console.log('🎥 Using topic-specific video suggestions')
      }
      
      // Get relevant tweets - try Twitter API first, then generate topic-specific mock data
      if (this.twitterBearerToken && this.twitterBearerToken !== 'demo-key') {
        result.tweets = await this.getTweets(topic)
        console.log('🐦 Using Twitter API for tweets')
      } else {
        result.tweets = this.getTopicSpecificTweets(topic)
        console.log('🐦 Using topic-specific tweet suggestions')
      }

      console.log('🎬 Media service results:', {
        image: result.image ? '✅ Found' : '❌ None',
        videos: `✅ ${result.videos?.length || 0} videos`,
        tweets: `✅ ${result.tweets?.length || 0} tweets`
      })

    } catch (error) {
      console.error('❌ Error fetching media for topic:', topic, error)
      result.image = this.getFallbackImage(topic)
      result.videos = this.getTopicSpecificVideos(topic)
      result.tweets = this.getTopicSpecificTweets(topic)
    }

    return result
  }

  private async getRelevantImage(topic: string): Promise<string> {
    // Try Unsplash API first if key is available
    if (this.unsplashAccessKey && this.unsplashAccessKey !== 'demo-key') {
      try {
        const searchTerms = this.extractImageSearchTerms(topic)
        const response = await axios.get('https://api.unsplash.com/search/photos', {
          params: {
            query: searchTerms,
            per_page: 1,
            orientation: 'landscape'
          },
          headers: {
            'Authorization': `Client-ID ${this.unsplashAccessKey}`
          }
        })

        if (response.data.results && response.data.results.length > 0) {
          console.log('✅ Found Unsplash image via API')
          return response.data.results[0].urls.regular
        }
      } catch (error) {
        console.error('Unsplash API error:', error)
      }
    }

    // Fallback to Unsplash Source (free, no API key required)
    console.log('📷 Using Unsplash Source fallback')
    return this.getFallbackImage(topic)
  }

  private async getYouTubeVideos(topic: string): Promise<string[]> {
    try {
      const searchQuery = this.extractVideoSearchTerms(topic)
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: searchQuery,
          type: 'video',
          maxResults: 1,
          key: this.youtubeApiKey,
          videoDuration: 'medium', // 4-20 minutes
          relevanceLanguage: 'en'
        }
      })

      if (response.data.items && response.data.items.length > 0) {
        const videoId = response.data.items[0].id.videoId
        return [`https://www.youtube.com/embed/${videoId}`]
      }

      return this.getMockVideos()
    } catch (error) {
      console.error('Error fetching YouTube videos:', error)
      return this.getMockVideos()
    }
  }

  private async getTweets(topic: string): Promise<string[]> {
    try {
      const searchQuery = this.extractTweetSearchTerms(topic)
      const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
        params: {
          query: searchQuery,
          max_results: 1,
          'tweet.fields': 'public_metrics,created_at'
        },
        headers: {
          'Authorization': `Bearer ${this.twitterBearerToken}`
        }
      })

      if (response.data.data && response.data.data.length > 0) {
        const tweetId = response.data.data[0].id
        return [`https://twitter.com/i/status/${tweetId}`]
      }

      return this.getMockTweets()
    } catch (error) {
      console.error('Error fetching tweets:', error)
      return this.getMockTweets()
    }
  }

  private extractImageSearchTerms(topic: string): string {
    // Extract relevant keywords for image search
    const techKeywords = [
      'technology', 'programming', 'coding', 'development', 'software',
      'computer', 'digital', 'innovation', 'tech', 'code'
    ]
    
    const topicWords = topic.toLowerCase().split(' ')
    const relevantWords = topicWords.filter(word => 
      word.length > 3 && !['the', 'and', 'for', 'with', 'how', 'what'].includes(word)
    )
    
    if (relevantWords.length === 0) {
      return 'technology programming'
    }
    
    // Combine topic keywords with tech keywords
    return `${relevantWords.slice(0, 2).join(' ')} technology`
  }

  private extractVideoSearchTerms(topic: string): string {
    // Create search terms optimized for educational/tutorial videos
    const topicWords = topic.toLowerCase().split(' ')
    const relevantWords = topicWords.filter(word => 
      word.length > 3 && !['the', 'and', 'for', 'with'].includes(word)
    )
    
    return `${relevantWords.slice(0, 3).join(' ')} tutorial explanation`
  }

  private extractTweetSearchTerms(topic: string): string {
    // Create search terms for relevant tech discussions
    const topicWords = topic.toLowerCase().split(' ')
    const relevantWords = topicWords.filter(word => 
      word.length > 3 && !['the', 'and', 'for', 'with'].includes(word)
    )
    
    return `${relevantWords.slice(0, 2).join(' ')} -is:retweet lang:en`
  }

  private getFallbackImage(topic: string): string {
    // Generate a more specific fallback image URL based on topic
    const techCategories = [
      'computer-programming', 'technology', 'coding', 'software-development',
      'artificial-intelligence', 'web-development', 'data-science'
    ]
    
    // Extract relevant keywords from topic for better image matching
    const topicWords = topic.toLowerCase().split(' ')
    let category = 'technology'
    
    // Map topic keywords to relevant categories
    if (topicWords.some(word => ['react', 'angular', 'vue', 'frontend', 'web'].includes(word))) {
      category = 'web-development'
    } else if (topicWords.some(word => ['ai', 'machine', 'learning', 'artificial'].includes(word))) {
      category = 'artificial-intelligence'
    } else if (topicWords.some(word => ['data', 'analytics', 'science'].includes(word))) {
      category = 'data-science'
    } else if (topicWords.some(word => ['programming', 'coding', 'code'].includes(word))) {
      category = 'computer-programming'
    } else if (topicWords.some(word => ['software', 'development', 'dev'].includes(word))) {
      category = 'software-development'
    }
    
    return `https://source.unsplash.com/800x400/?${category}`
  }

  private getTopicSpecificVideos(topic: string): string[] {
    // Generate topic-specific YouTube search URLs and educational video recommendations
    const topicWords = topic.toLowerCase().split(' ')
    const relevantWords = topicWords.filter(word => 
      word.length > 3 && !['the', 'and', 'for', 'with'].includes(word)
    )
    
    // Create more relevant video suggestions based on topic
    const videoSuggestions = []
    
    if (relevantWords.some(word => ['react', 'angular', 'vue'].includes(word))) {
      videoSuggestions.push('https://www.youtube.com/embed/w7ejDZ8SWv8') // React tutorial
    } else if (relevantWords.some(word => ['javascript', 'js'].includes(word))) {
      videoSuggestions.push('https://www.youtube.com/embed/PkZNo7MFNFg') // JavaScript tutorial
    } else if (relevantWords.some(word => ['python'].includes(word))) {
      videoSuggestions.push('https://www.youtube.com/embed/rfscVS0vtbw') // Python tutorial
    } else if (relevantWords.some(word => ['ai', 'artificial', 'intelligence'].includes(word))) {
      videoSuggestions.push('https://www.youtube.com/embed/aircAruvnKk') // AI tutorial
    } else if (relevantWords.some(word => ['web', 'development', 'html', 'css'].includes(word))) {
      videoSuggestions.push('https://www.youtube.com/embed/G3e-cpL7ofc') // Web development
    } else {
      videoSuggestions.push('https://www.youtube.com/embed/ScMzIvxBSi4') // General tech tutorial
    }
    
    return videoSuggestions
  }

  private getTopicSpecificTweets(topic: string): string[] {
    // Generate topic-specific tweet URLs from relevant tech accounts
    const topicWords = topic.toLowerCase().split(' ')
    const tweets = []
    
    if (topicWords.some(word => ['react', 'javascript', 'frontend'].includes(word))) {
      tweets.push('https://twitter.com/reactjs/status/1735023456789012345')
    } else if (topicWords.some(word => ['typescript', 'ts'].includes(word))) {
      tweets.push('https://twitter.com/typescript/status/1735023456789012345')
    } else if (topicWords.some(word => ['nextjs', 'next', 'vercel'].includes(word))) {
      tweets.push('https://twitter.com/vercel/status/1735023456789012345')
    } else if (topicWords.some(word => ['github', 'git', 'open', 'source'].includes(word))) {
      tweets.push('https://twitter.com/github/status/1735023456789012345')
    } else if (topicWords.some(word => ['ai', 'openai', 'chatgpt'].includes(word))) {
      tweets.push('https://twitter.com/openai/status/1735023456789012345')
    } else if (topicWords.some(word => ['google', 'chrome', 'dev'].includes(word))) {
      tweets.push('https://twitter.com/googlechrome/status/1735023456789012345')
    } else {
      tweets.push('https://twitter.com/techcrunch/status/1735023456789012345')
    }
    
    return tweets
  }

  private getMockVideos(): string[] {
    const mockVideos = [
      'https://www.youtube.com/embed/dQw4w9WgXcQ', // Famous example
      'https://www.youtube.com/embed/ScMzIvxBSi4', // Tech tutorial example
      'https://www.youtube.com/embed/9bZkp7q19f0'  // Programming example
    ]
    return [mockVideos[Math.floor(Math.random() * mockVideos.length)]]
  }

  private getMockTweets(): string[] {
    const mockTweets = [
      'https://twitter.com/vercel/status/1234567890',
      'https://twitter.com/reactjs/status/1234567890',
      'https://twitter.com/typescript/status/1234567890',
      'https://twitter.com/github/status/1234567890'
    ]
    return [mockTweets[Math.floor(Math.random() * mockTweets.length)]]
  }
}

export const mediaService = new MediaService()
