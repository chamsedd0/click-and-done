"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/providers/auth-provider"
import { RequestFormProvider, useRequestForm } from "./form-context"

const websiteTypes = [
  { value: "landing", label: "Landing Page" },
  { value: "business", label: "Business Website" },
  { value: "ecommerce", label: "E-commerce Store" },
  { value: "portfolio", label: "Portfolio Website" },
  { value: "blog", label: "Blog" },
  { value: "other", label: "Other" },
]

const steps = [
  "Project Overview",
  "Project Description",
  "Budget",
  "Timeline",
  "Review & Submit",
]

function StepWizard() {
  const [step, setStep] = useState(0)
  const { data, setData, reset } = useRequestForm()
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Block rendering until auth is loaded
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Icons.spinner className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  // Validation per step
  const validateStep = () => {
    if (step === 0) {
      if (!data.title.trim()) {
        toast({ title: "Error", description: "Enter a project title", variant: "destructive" })
        return false
      }
      if (!data.type) {
        toast({ title: "Error", description: "Select a website type", variant: "destructive" })
        return false
      }
    }
    if (step === 1) {
      if (!data.description.trim()) {
        toast({ title: "Error", description: "Enter a project description", variant: "destructive" })
        return false
      }
    }
    if (step === 2) {
      if (!data.budget.trim()) {
        toast({ title: "Error", description: "Enter a budget range", variant: "destructive" })
        return false
      }
    }
    if (step === 3) {
      if (!data.deadline) {
        toast({ title: "Error", description: "Select a deadline", variant: "destructive" })
        return false
      }
      const deadlineDate = new Date(data.deadline)
      const today = new Date()
      if (deadlineDate < today) {
        toast({ title: "Error", description: "Deadline cannot be in the past", variant: "destructive" })
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep()) return
    setStep((s) => s + 1)
  }
  const handleBack = () => setStep((s) => s - 1)

  async function handleSubmit() {
    setIsLoading(true)
    setError("")
    try {
      if (!user || !user.uid) {
        setError("You must be logged in to submit a request.")
        setIsLoading(false)
        return
      }
      await addDoc(collection(db, "websiteRequests"), {
        ...data,
        status: "pending",
        userId: user.uid,
        createdAt: new Date(),
      })
      reset()
      router.push("/dashboard/requests/new/success")
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again.")
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 flex items-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium
                ${i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
              {i < steps.length - 1 && <div className="w-8 h-1 bg-muted mx-1 rounded" />}
            </div>
          ))}
        </div>
        <div className="ml-4 text-sm text-muted-foreground">Step {step + 1} of {steps.length}</div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="My Awesome Website"
                  value={data.title}
                  onChange={e => setData({ title: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Website Type</Label>
                <Select
                  name="type"
                  value={data.type}
                  onValueChange={val => setData({ type: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {websiteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your website requirements..."
                value={data.description}
                onChange={e => setData({ description: e.target.value })}
                rows={6}
              />
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Input
                id="budget"
                name="budget"
                placeholder="e.g., $1000 - $2000"
                value={data.budget}
                onChange={e => setData({ budget: e.target.value })}
              />
            </div>
          )}
          {step === 3 && (
            <div className="grid gap-2">
              <Label htmlFor="deadline">Desired Deadline</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={data.deadline}
                onChange={e => setData({ deadline: e.target.value })}
              />
            </div>
          )}
          {step === 4 && (
            <>
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive flex items-start mb-4">
                  <Icons.alertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                  <div>{error}</div>
                </div>
              )}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Review Your Request</h3>
                <div className="grid gap-2">
                  <span className="font-medium">Project Title:</span>
                  <span className="text-muted-foreground">{data.title}</span>
                </div>
                <div className="grid gap-2">
                  <span className="font-medium">Website Type:</span>
                  <span className="text-muted-foreground">{websiteTypes.find(t => t.value === data.type)?.label || data.type}</span>
                </div>
                <div className="grid gap-2">
                  <span className="font-medium">Description:</span>
                  <span className="text-muted-foreground whitespace-pre-wrap">{data.description}</span>
                </div>
                <div className="grid gap-2">
                  <span className="font-medium">Budget Range:</span>
                  <span className="text-muted-foreground">{data.budget}</span>
                </div>
                <div className="grid gap-2">
                  <span className="font-medium">Deadline:</span>
                  <span className="text-muted-foreground">{data.deadline ? new Date(data.deadline).toLocaleDateString() : ""}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <div className="flex justify-between items-center px-6 pb-6 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={step === 0 ? () => router.back() : handleBack}
            disabled={isLoading}
          >
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={isLoading}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !data.title || !data.type || !data.description || !data.budget || !data.deadline}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Icons.check className="h-4 w-4 mr-2" />
              )}
              Submit Request
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

export default function MultiStepFormPage() {
  return (
    <RequestFormProvider>
      <StepWizard />
    </RequestFormProvider>
  )
} 