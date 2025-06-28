"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User, LogOut, Settings, PenTool, Plus } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { BlogFormModal } from "./blog-form-modal"

export function Navigation() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link 
            href="/" 
            className="flex items-center space-x-3 font-bold text-2xl tracking-tight hover:text-primary transition-colors"
          >
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <PenTool className="h-6 w-6 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              TrendWise
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm">
            <Link 
              href="/" 
              className="relative transition-colors hover:text-foreground text-foreground/70 font-medium group"
            >
              Articles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/trending" 
              className="relative transition-colors hover:text-foreground text-foreground/70 font-medium group"
            >
              Trending
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/categories" 
              className="relative transition-colors hover:text-foreground text-foreground/70 font-medium group"
            >
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {session && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="font-medium shadow-lg hover:shadow-xl transition-all">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Blog
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                  <DialogDescription>
                    Write and publish your blog post with media content
                  </DialogDescription>
                </DialogHeader>
                <BlogFormModal />
              </DialogContent>
            </Dialog>
          )}
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-background hover:ring-primary/20 transition-all">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <div className="flex items-center justify-start gap-3 p-4 border-b">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user?.name && (
                      <p className="font-semibold text-sm">{session.user.name}</p>
                    )}
                    {session.user?.email && (
                      <p className="w-[180px] truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-2">
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center w-full px-2 py-2 rounded-md">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center w-full px-2 py-2 rounded-md">
                      <User className="mr-3 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
                <div className="p-2 border-t">
                  <DropdownMenuItem
                    className="cursor-pointer w-full px-2 py-2 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    onSelect={(event) => {
                      event.preventDefault()
                      signOut()
                    }}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn("google")} className="font-medium shadow-lg hover:shadow-xl transition-all">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
