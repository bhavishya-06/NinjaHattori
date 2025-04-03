"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast" // Ensure this path is correct
import { useRouter } from 'next/navigation' // Needed for redirection

// Form validation schema
const formSchema = z.object({
  userId: z.string().min(1, {
    message: "User ID is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  })

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log("Login data:", values)

    // --- TODO: Implement backend login logic ---
    // 1. Call your API endpoint to authenticate the user.
    // 2. On success from API:
    //    - Store the session token/user data (e.g., in cookies or state management).
    //    - Redirect the user: router.push('/');
    //    toast({ title: "Login Successful" });
    // 3. On error from API (e.g., invalid credentials):
    //    toast({ variant: "destructive", title: "Login Failed", description: "Invalid User ID or Password." });
    // --- ---

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Example success (replace with actual logic + redirection)
    toast({
      title: "Login Successful (Simulated)",
    })
    // router.push('/'); // Uncomment and use after successful backend authentication

    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Log In</CardTitle>
          <CardDescription>Enter your User ID and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your user ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging In...</>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 