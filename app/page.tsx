"use client"

import Dashboard from "@/components/dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking")

  useEffect(() => {
    // Check if the backend is available
    const checkBackendStatus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/", {
          method: "HEAD",
          mode: "cors",
          // Set a short timeout to avoid long waits
          signal: AbortSignal.timeout(3000),
        })
        setBackendStatus(response.ok ? "online" : "offline")
      } catch (error) {
        console.error("Backend connection check failed:", error)
        setBackendStatus("offline")
      }
    }

    checkBackendStatus()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {backendStatus === "offline" && (
        <Card className="mx-auto max-w-4xl mt-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-600 dark:text-amber-400"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300">Backend Connection Warning</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Could not connect to the backend server at http://127.0.0.1:8000/. The dashboard will use sample data
                  instead.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <Dashboard />
    </main>
  )
}
