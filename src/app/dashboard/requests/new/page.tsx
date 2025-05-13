"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NewRequestPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/requests/new/start")
  }, [router])

  return null
} 