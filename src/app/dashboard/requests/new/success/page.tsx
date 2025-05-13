"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export default function SuccessPage() {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
          <Icons.check className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Request Submitted!</h1>
        <p className="text-muted-foreground">
          Thank you for submitting your website development request. We'll review it and get back to you soon.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-medium">1</span>
            </div>
            <div>
              <h3 className="font-medium">Review Process</h3>
              <p className="text-muted-foreground">
                Our team will review your request within 24-48 hours.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-medium">2</span>
            </div>
            <div>
              <h3 className="font-medium">Initial Consultation</h3>
              <p className="text-muted-foreground">
                We'll schedule a call to discuss your requirements in detail.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-medium">3</span>
            </div>
            <div>
              <h3 className="font-medium">Project Kickoff</h3>
              <p className="text-muted-foreground">
                Once approved, we'll begin working on your website development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/requests")}
        >
          View All Requests
        </Button>
        <Button
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
} 