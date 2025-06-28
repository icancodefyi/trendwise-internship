import React from 'react'
import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LoginForm } from '@/components/login-form'
import { PenTool, Shield, Zap, Users } from 'lucide-react'

const LoginPage = async () => {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <PenTool className="h-8 w-8" />
          <span className="text-2xl font-bold">TrendWise</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">
          Sign in to access exclusive content and join the conversation
        </p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Continue with your Google account to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <LoginForm />
          
          <Separator className="my-6" />
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4" />
              <span>Secure authentication with Google</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4" />
              <span>Access to premium AI-generated content</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4" />
              <span>Join the developer community</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-6">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="font-medium hover:text-foreground transition-colors">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="font-medium hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
