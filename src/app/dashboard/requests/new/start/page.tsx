"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, Clock, DollarSign } from "lucide-react"

export default function StartPage() {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create New Request</h1>
        <p className="mt-2 text-muted-foreground">
          Let's get started with your website development request
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-primary" />
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Tell us about your website requirements and goals
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <DollarSign className="h-8 w-8 text-primary" />
            <CardTitle>Budget & Timeline</CardTitle>
            <CardDescription>
              Set your budget range and desired completion date
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="h-8 w-8 text-primary" />
            <CardTitle>Quick Process</CardTitle>
            <CardDescription>
              Get your request reviewed within 24 hours
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={() => router.push("/dashboard/requests/new/form")}>
          Start Request
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 