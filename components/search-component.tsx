"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Clock, ArrowRight, Loader2 } from 'lucide-react'

interface SearchResult {
  _id: string
  title: string
  slug: string
  excerpt: string
  tags: string[]
  publishedAt: string
  readTime: number
}

interface SearchComponentProps {
  placeholder?: string
  className?: string
}

export function SearchComponent({ placeholder = "Search articles...", className = "" }: SearchComponentProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    setShowResults(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (data.success) {
        setResults(data.results)
        
        // Save to recent searches
        const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
        setRecentSearches(newRecentSearches)
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      handleSearch(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSearch(query)
    }
  }

  const handleResultClick = (slug: string) => {
    setShowResults(false)
    setQuery('')
    router.push(`/article/${slug}`)
  }

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery)
    handleSearch(recentQuery)
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowResults(true)}
            className="pl-10 pr-10"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 border-2">
          <CardContent className="p-0">
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Recent Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((recentQuery, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleRecentSearchClick(recentQuery)}
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      {recentQuery}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && (
              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="divide-y">
                    {results.map((result) => (
                      <div
                        key={result._id}
                        className="p-4 hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleResultClick(result.slug)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">
                              {result.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {result.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {result.readTime} min read
                              <span>•</span>
                              <span>{new Date(result.publishedAt).toLocaleDateString()}</span>
                            </div>
                            {result.tags && result.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {result.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      No articles found for "{query}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
