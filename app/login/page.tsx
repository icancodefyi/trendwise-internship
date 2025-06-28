import React from 'react'
import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LoginForm } from '@/components/login-form'
import { PenTool, Shield, Zap, Users, BookOpen, TrendingUp } from 'lucide-react'

const LoginPage = async () => {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-primary text-primary-foreground">
              <PenTool className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold text-foreground">TrendWise</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground max-w-sm mx-auto">
            Sign in to access exclusive content and join our community of developers
          </p>
        </div>

        {/* Main Login Card */}
        <Card className="border-2 hover:border-primary/20 transition-colors">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">Sign In to Continue</CardTitle>
            <CardDescription className="text-base">
              Use your Google account to get started instantly
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <LoginForm />
            
            <Separator />
            
            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-center text-foreground">What you'll get:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 border">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Unlimited Access</div>
                    <div className="text-sm text-muted-foreground">Read all premium articles and content</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 border">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">AI-Powered Insights</div>
                    <div className="text-sm text-muted-foreground">Get personalized content recommendations</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 border">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Community Access</div>
                    <div className="text-sm text-muted-foreground">Comment and interact with other developers</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 border">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Secure & Private</div>
                    <div className="text-sm text-muted-foreground">Your data is protected with enterprise security</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Trusted by 10,000+ developers worldwide</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
