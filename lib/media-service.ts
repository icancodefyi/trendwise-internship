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

    try {
      // Get relevant image
      result.image = await this.getRelevantImage(topic)
      
      // Get relevant videos (if YouTube API is available)
      if (this.youtubeApiKey) {
        result.videos = await this.getYouTubeVideos(topic)
      } else {
        result.videos = this.getMockVideos()
      }
      
      // Get relevant tweets (if Twitter API is available)
      if (this.twitterBearerToken) {
        result.tweets = await this.getTweets(topic)
      } else {
        result.tweets = this.getMockTweets()
      }

    } catch (error) {
      console.error('Error fetching media for topic:', topic, error)
      result.image = this.getFallbackImage(topic)
      result.videos = this.getMockVideos()
      result.tweets = this.getMockTweets()
    }

    return result
  }

  private async getRelevantImage(topic: string): Promise<string> {
    if (!this.unsplashAccessKey) {
      return this.getFallbackImage(topic)
    }

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
        return response.data.results[0].urls.regular
      }

      return this.getFallbackImage(topic)
    } catch (error) {
      console.error('Error fetching Unsplash image:', error)
      return this.getFallbackImage(topic)
    }
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
    // Generate a relevant fallback image URL
    const techCategories = [
      'computer-programming', 'technology', 'coding', 'software-development',
      'artificial-intelligence', 'web-development', 'data-science'
    ]
    
    const randomCategory = techCategories[Math.floor(Math.random() * techCategories.length)]
    return `https://source.unsplash.com/800x400/?${randomCategory}`
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
