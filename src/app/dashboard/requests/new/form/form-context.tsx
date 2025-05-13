"use client"

import React, { createContext, useContext, useState } from "react"

interface RequestFormData {
  title: string
  type: string
  description: string
  budget: string
  deadline: string
}

const defaultData: RequestFormData = {
  title: "",
  type: "",
  description: "",
  budget: "",
  deadline: "",
}

interface RequestFormContextProps {
  data: RequestFormData
  setData: (data: Partial<RequestFormData>) => void
  reset: () => void
}

const RequestFormContext = createContext<RequestFormContextProps | undefined>(undefined)

export function RequestFormProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<RequestFormData>(defaultData)

  const setData = (update: Partial<RequestFormData>) => {
    setDataState((prev) => ({ ...prev, ...update }))
  }

  const reset = () => setDataState(defaultData)

  return (
    <RequestFormContext.Provider value={{ data, setData, reset }}>
      {children}
    </RequestFormContext.Provider>
  )
}

export function useRequestForm() {
  const ctx = useContext(RequestFormContext)
  if (!ctx) throw new Error("useRequestForm must be used within RequestFormProvider")
  return ctx
} 