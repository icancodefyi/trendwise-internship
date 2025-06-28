"use client"

import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Settings, Shield, Activity, Zap, Users } from 'lucide-react'

export function AdminHeader() {
  const { data: session } = useSession()

  return (
    <div className="mb-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-primary text-primary-foreground">
            <Shield className="h-10 w-10" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-5xl font-bold tracking-tight text-foreground">
                Admin Dashboard
              </h1>
              <Badge className="text-sm font-semibold">
                Administrator
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground">
              Manage your TrendWise content and monitor performance metrics
            </p>
          </div>
        </div>

        {session && (
          <Card className="border-2 w-fit">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-background">
                  <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                    {session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg">{session.user?.name}</p>
                  <p className="text-sm text-muted-foreground">Administrator</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* System Status */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <span className="font-semibold text-foreground">System Online</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 rounded-lg bg-muted border">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="font-medium">AI Generator Ready</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 rounded-lg bg-muted border">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="font-medium">Auto-publishing Active</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 rounded-lg bg-muted border">
                  <Users className="h-4 w-4" />
                </div>
                <span className="font-medium">142 Active Users</span>
              </div>
            </div>
            <Button size="lg" variant="outline" className="gap-2 font-semibold">
              <Settings className="h-4 w-4" />
              System Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
