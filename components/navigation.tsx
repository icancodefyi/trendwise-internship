"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { User, LogOut, Settings, PenTool, Plus, Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { BlogFormModal } from "./blog-form-modal"
import { SearchComponent } from "@/components/search-component"
import { useState } from "react"

export function Navigation() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-20 items-center">
        {/* Logo */}
        <div className="flex items-center px-4 lg:px-6">
          <Link 
            href="/" 
            className="flex items-center space-x-3 font-bold text-2xl tracking-tight hover:text-primary transition-colors"
          >
            <div className="p-3 rounded-xl bg-primary text-primary-foreground">
              <PenTool className="h-6 w-6" />
            </div>
            <span className="text-foreground">
              TrendWise
            </span>
          </Link>
        </div>

        {/* Centered Navigation */}
        <div className="flex-1 flex justify-center">
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className="relative transition-colors hover:text-primary text-foreground/80 font-semibold text-base group"
            >
              Articles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/trending" 
              className="relative transition-colors hover:text-primary text-foreground/80 font-semibold text-base group"
            >
              Trending
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/categories" 
              className="relative transition-colors hover:text-primary text-foreground/80 font-semibold text-base group"
            >
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className="relative transition-colors hover:text-primary text-foreground/80 font-semibold text-base group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Component */}
          <div className="hidden md:flex max-w-xs">
            <SearchComponent placeholder="Search articles..." className="w-full" />
          </div>
          <ThemeToggle />
          
          {session && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="font-semibold hidden sm:flex">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Article</DialogTitle>
                  <DialogDescription>
                    Write and publish your article with media content
                  </DialogDescription>
                </DialogHeader>
                <BlogFormModal />
              </DialogContent>
            </Dialog>
          )}
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full border-2 hover:border-primary/50 transition-all">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="end" forceMount>
                <div className="flex items-center justify-start gap-4 p-6 border-b">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user?.name && (
                      <p className="font-semibold text-base">{session.user.name}</p>
                    )}
                    {session.user?.email && (
                      <p className="w-[180px] truncate text-sm text-muted-foreground">
                        {session.user.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium">
                      <Settings className="mr-3 h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium">
                      <User className="mr-3 h-5 w-5" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
                <div className="p-3 border-t">
                  <DropdownMenuItem
                    className="cursor-pointer w-full px-3 py-3 rounded-lg text-base font-medium text-destructive hover:text-destructive focus:text-destructive"
                    onSelect={(event) => {
                      event.preventDefault()
                      signOut()
                    }}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="lg" onClick={() => signIn("google")} className="font-semibold">
              Sign In
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="lg"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur-sm">
          <nav className="container py-6 space-y-4">
            {/* Mobile Search */}
            <div className="md:hidden mb-6">
              <SearchComponent placeholder="Search articles..." className="w-full" />
            </div>
            
            <Link 
              href="/" 
              className="block text-lg font-semibold text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Articles
            </Link>
            <Link 
              href="/trending" 
              className="block text-lg font-semibold text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trending
            </Link>
            <Link 
              href="/categories" 
              className="block text-lg font-semibold text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/about" 
              className="block text-lg font-semibold text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            {session && (
              <div className="pt-4 border-t">
                <Button size="lg" className="w-full font-semibold">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Article
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
