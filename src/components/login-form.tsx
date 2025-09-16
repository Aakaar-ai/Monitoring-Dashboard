import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "../lib/utils"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "../contexts/AuthContext"
import { Loader2, Eye, EyeOff, Bot } from "lucide-react"
import { toast } from "sonner"
import { Button } from "./ui/Button"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    if (!email.includes('@')) {
      toast.error("Please enter a valid email address")
      return
    }
    
    try {
      await login(email, password);
      toast.success("Login successful!");
      const redirectTo = '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please check your credentials."
      toast.error(errorMessage)
    }
  }

  return (
    <div className={cn("flex h-screen items-center justify-center bg-background text-foreground", className)} {...props}>
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 rounded-lg border border-border shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="size-6" />
            </div>
            <h1 className="text-2xl font-bold text-center">Welcome to Aakaarai</h1>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@aakaarai.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10 bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in with Email'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}