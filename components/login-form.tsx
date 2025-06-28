"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

export function LoginForm() {
  return (
    <div className="space-y-4">
      <Button
        onClick={() => signIn("google")}
        size="lg"
        className="w-full"
        variant="default"
      >
        <Chrome className="mr-2 h-5 w-5" />
        Continue with Google
      </Button>
    </div>
  )
}
