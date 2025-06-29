"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  PenTool, 
  Mail, 
  Twitter, 
  Github, 
  Linkedin, 
  Instagram,
  ArrowRight,
  Heart,
  ExternalLink
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubscribing(true)
    
    try {
      // In a real app, you would send this to your newsletter API
      // For now, we'll simulate the subscription
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setEmail("")
      toast.success("Thanks for subscribing! 🎉", {
        description: "You'll receive our weekly tech insights newsletter.",
      })
    } catch (error) {
      toast.error("Failed to subscribe", {
        description: "Please try again later.",
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Newsletter Section */}
        <div className="text-center mb-16 py-12 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Stay Updated with TrendWise</h3>
            <p className="text-muted-foreground text-lg mb-8">
              Get the latest tech insights, AI trends, and development tips delivered to your inbox weekly.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 text-base"
                required
              />
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubscribing}
                className="h-12 px-8 font-semibold"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-4">
              No spam, unsubscribe anytime. Read our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-primary text-primary-foreground">
                <PenTool className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">TrendWise</span>
            </Link>
            <p className="text-muted-foreground mb-6 text-base leading-relaxed">
              AI-powered platform delivering cutting-edge insights on technology trends, 
              development practices, and innovation for the modern developer community.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="h-10 w-10" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link 
                  href="/trending" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Popular Topics</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/categories/ai-machine-learning" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories/web-development" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories/react" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  React & Frontend
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories/typescript" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  TypeScript
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories/dev-tools" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  Developer Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/help" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@trendwise.com" 
                  className="text-muted-foreground hover:text-primary transition-colors text-base flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  support@trendwise.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center text-muted-foreground text-base">
            <span>© 2025 TrendWise. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground text-base">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by developers, for developers</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link 
              href="/sitemap" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Sitemap
            </Link>
            <Link 
              href="/rss" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              RSS Feed
            </Link>
            <a 
              href="https://status.trendwise.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center"
            >
              Status
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
