"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

export function LoginForm() {
  return (
    <div className="space-y-6">
      <Button
        onClick={() => signIn("google")}
        size="lg"
        className="w-full h-14 text-lg font-semibold"
        variant="default"
      >
        <Chrome className="mr-3 h-6 w-6" />
        Continue with Google
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Quick, secure, and hassle-free authentication
        </p>
      </div>
    </div>
  )
}
