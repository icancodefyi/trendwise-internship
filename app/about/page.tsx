import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Brain, 
  Target, 
  Users, 
  Zap, 
  Code, 
  TrendingUp, 
  Shield, 
  Globe,
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
  Mail,
  MessageSquare,
  Github,
  Twitter
} from "lucide-react"

const AboutPage = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Content",
      description: "Our advanced AI analyzes trending topics and generates high-quality, relevant articles on cutting-edge technology topics."
    },
    {
      icon: TrendingUp,
      title: "Real-Time Trends",
      description: "Stay ahead of the curve with content based on real-time data from Google Trends, Twitter, and GitHub."
    },
    {
      icon: Code,
      title: "Developer-Focused",
      description: "Content specifically curated for developers, covering programming languages, frameworks, and best practices."
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Every piece of content is verified for accuracy and relevance before publication."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a community of passionate developers sharing insights and engaging in meaningful discussions."
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "Content that reflects global technology trends and diverse perspectives from around the world."
    }
  ]

  const stats = [
    { label: "Articles Published", value: "150+", icon: Target },
    { label: "Active Readers", value: "10K+", icon: Users },
    { label: "Topics Covered", value: "50+", icon: Brain },
    { label: "Update Frequency", value: "Daily", icon: Zap }
  ]

  const team = [
    {
      name: "AI Content Engine",
      role: "Chief Content Creator",
      description: "Our sophisticated AI system that analyzes trends and generates insightful content.",
      avatar: "🤖"
    },
    {
      name: "Trend Analytics",
      role: "Data Intelligence",
      description: "Advanced algorithms that monitor and analyze technology trends from multiple sources.",
      avatar: "📈"
    },
    {
      name: "Quality Control",
      role: "Content Curator",
      description: "Automated systems ensuring every article meets our high standards for accuracy and relevance.",
      avatar: "✅"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-20 py-12">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium mb-6 bg-primary/5 border-primary/20">
            <Heart className="mr-2 h-4 w-4 text-primary" />
            About TrendWise
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Empowering Developers with
            <span className="text-primary block">AI-Driven Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            TrendWise is an innovative AI-powered blog platform that keeps developers and tech enthusiasts 
            informed about the latest trends, technologies, and best practices in the rapidly evolving world of software development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/">
                <ArrowRight className="mr-2 h-4 w-4" />
                Explore Articles
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/trending">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Trending Topics
              </Link>
            </Button>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-20">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mx-auto mb-4">
                <Target className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl font-bold mb-4">Our Mission</CardTitle>
              <CardDescription className="text-lg max-w-3xl mx-auto leading-relaxed">
                To democratize access to cutting-edge technology knowledge by leveraging artificial intelligence 
                to deliver timely, accurate, and actionable insights that help developers stay ahead in their careers.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">TrendWise by the Numbers</h2>
            <p className="text-lg text-muted-foreground">
              Our impact in the developer community continues to grow
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="text-center border-2 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">What Makes Us Different</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We combine artificial intelligence with deep domain expertise to deliver content that's both comprehensive and accessible
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">How TrendWise Works</h2>
            <p className="text-lg text-muted-foreground">
              Our intelligent content creation process in three simple steps
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <Badge variant="secondary" className="mb-2">Step 1</Badge>
                <CardTitle className="text-xl">Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our AI continuously monitors Google Trends, Twitter, GitHub, and other sources to identify emerging topics and technologies.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mx-auto mb-4">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <Badge variant="secondary" className="mb-2">Step 2</Badge>
                <CardTitle className="text-xl">Content Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Advanced AI models create comprehensive, well-researched articles that provide valuable insights and practical knowledge.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <Badge variant="secondary" className="mb-2">Step 3</Badge>
                <CardTitle className="text-xl">Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Every article undergoes automated quality checks and is enhanced with relevant media, examples, and actionable insights.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Meet Our AI Team</h2>
            <p className="text-lg text-muted-foreground">
              The intelligent systems behind TrendWise's content creation
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">{member.role}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {member.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-20">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mx-auto mb-4">
                <Code className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl font-bold mb-4">Built with Modern Technology</CardTitle>
              <CardDescription className="text-lg max-w-3xl mx-auto">
                TrendWise is built using cutting-edge technologies to ensure optimal performance, security, and user experience
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <h4 className="font-semibold mb-3">Frontend</h4>
                  <div className="space-y-2">
                    <Badge variant="outline">Next.js 14</Badge>
                    <Badge variant="outline">React 19</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-3">Backend</h4>
                  <div className="space-y-2">
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">MongoDB</Badge>
                    <Badge variant="outline">NextAuth.js</Badge>
                    <Badge variant="outline">API Routes</Badge>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-3">AI & Analytics</h4>
                  <div className="space-y-2">
                    <Badge variant="outline">Google Gemini</Badge>
                    <Badge variant="outline">OpenAI GPT</Badge>
                    <Badge variant="outline">Google Trends</Badge>
                    <Badge variant="outline">Twitter API</Badge>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-3">Infrastructure</h4>
                  <div className="space-y-2">
                    <Badge variant="outline">Vercel</Badge>
                    <Badge variant="outline">MongoDB Atlas</Badge>
                    <Badge variant="outline">CDN</Badge>
                    <Badge variant="outline">SSL/TLS</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section className="text-center py-16 bg-primary/5 rounded-2xl border border-primary/10">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="mailto:contact@trendwise.dev">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/feedback">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Feedback
              </Link>
            </Button>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://github.com/trendwise" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://twitter.com/trendwise" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
